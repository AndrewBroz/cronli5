// The time part: the hours and minutes, and the seconds on them. One
// second rides on every moment. Several are a rhythm of their own inside
// whole hours, the end of a span, the moments themselves while those are
// few, or positions in each minute after «각각».

import type {ScheduleFacts} from '../../core/schedule.js';
import type {Time, Voice} from './clock.js';
import {blocks, join, paren, rhythm, sayTimes, span} from './clock.js';
import lexicon from './lexicon.js';
import type {KoreanStyle} from './options.js';
import type {Level} from './phrases.js';
import {inside, levelOf, progress, taken} from './phrases.js';
import type {Choice, Described, FieldSet} from './sets.js';
import {
  baseOf, choose, endsOf, fieldOf, hoursOf, isOpen, removedOf, stepOf
} from './sets.js';
import type {Clockwork, Spoken} from './time.js';
import {clockworkOf, hoursAndMinutes, inSpans, listable, wholeHours}
  from './time.js';

const {units, words} = lexicon;

/** A schedule's clock: its hours and minutes, and its seconds. */
interface Seconds {
  seconds: FieldSet;
  // The seconds as a rhythm of their own, as moments, and after «각각».
  rhythm: Described;
  moments: Described;
  inEach: Described;
  work: Clockwork;
  // The voice seconds are said in: a rhythm of seconds is never a frame.
  voice: Voice;
}

type SecondsRule = (clock: Seconds) => Spoken | false;

// Moments with their seconds are written out one by one up to this many.
const listedMoments = 6;

const exceptions: Choice =
  {allBut: true, ceiling: 12, few: 4, lessCadence: true, split: true};

// What the seconds on one moment may be for the moment to open a span.
const spanned =
  ['all', 'range', 'cadence', 'pieces', 'cadencePieces', 'except'];

// The hours fixed in a moment: the one hour, or none under every hour.
function hourFixed(work: Clockwork): Time {
  return work.lone && {hour: work.hours.values[0]} || {};
}

// Each hour with each minute and each second, in order.
function everyMoment(hours: Time[], minutes: number[], seconds: number[]):
  Time[] {
  return hours.flatMap(function eachHour(hour) {
    return minutes.flatMap(function eachMinute(minute) {
      return seconds.map(function eachSecond(second) {
        return {...hour, minute, second};
      });
    });
  });
}

// «매시» where the hours are every hour, or every hour but some.
function everyHour(work: Clockwork): string {
  return isOpen(work.hourForm) && words.everyHour || '';
}

// The hours left out of every hour, as whole hours.
function hoursGone(work: Clockwork): string[] {
  const gone = isOpen(work.hourForm) && removedOf(work.hourForm) || [];

  return [blocks(gone, work.voice)].filter(Boolean);
}

// Every second of a minute is the minute's length from its start; any
// other set is said as it lies.
function fromOrThrough(form: Described, level: Level, clock: Seconds):
  string {
  const whole = `${words.forOneMinute} ${rhythm(1, units.second, clock.voice)}`;
  const start = sayTimes([level.moment(0)], clock.voice)[0];

  return form.kind === 'all' ?
    join(!level.tight && `${start}${words.from}`, whole) :
    progress(form, level, clock.voice);
}

// Whether the seconds are said under whole hours as a rhythm of their
// own: every minute fires, and one riding second has no span to ride on;
// or several seconds are in every minute, or in every minute but a few.
function ownRhythm(clock: Seconds): boolean {
  const {work} = clock;
  const everyMinute = work.minuteForm.kind === 'all';
  const still = clock.seconds.values.length === 1;
  const riding = Boolean(work.ride);
  const spans = work.lone || Boolean(inSpans(work));

  return riding && everyMinute && (isOpen(work.hourForm) || !spans) ||
    !still && isOpen(work.minuteForm);
}

const rules: SecondsRule[] = [
  // Whole hours, then the seconds inside every minute. A minute taken
  // out is a length from its start.
  function inWholeHours(clock) {
    const {voice, work} = clock;
    const lead = wholeHours(work.hourForm, work.hours, voice);
    const level = levelOf('second');
    const before = join(lead.onto, words.everyMinute);
    const under = lead.named && lead.named.map(function fix(hour) {
      return {hour};
    });
    const minutes = taken(removedOf(work.minuteForm), levelOf('minute'),
      {head: lead.head, under}, voice);

    return ownRhythm(clock) && {
      body: inside(clock.rhythm, level, {before, onto: lead.onto}, voice),
      bracket: [
        ...taken(removedOf(clock.rhythm), level,
          {head: words.everyMinute, under: null}, voice),
        ...minutes.map(function length(minute) {
          return `${minute}${words.from} ${words.forOneMinute}`;
        }),
        blocks(lead.gone, voice)
      ].filter(Boolean),
      names: !isOpen(work.hourForm)
    };
  },
  // No second, or one that rides on every moment.
  function onEveryMoment(clock) {
    return clock.seconds.values.length === 1 && hoursAndMinutes(clock.work);
  },
  // A run of minutes filled with a rhythm of seconds: the span moves down
  // to seconds and ends on the last second that fires.
  function throughMinutes(clock) {
    const {voice, work} = clock;
    const fixed = hourFixed(work);
    const step = stepOf(clock.rhythm, clock.seconds.domain);
    const minutes = endsOf(work.minuteForm, work.minutes.domain);
    const {last} = endsOf(clock.rhythm, clock.seconds.domain);

    return work.minuteForm.kind === 'range' && step > 0 &&
      (work.lone || isOpen(work.hourForm)) && {
      body: join(everyHour(work), span({...fixed, minute: minutes.start},
        {...fixed, minute: minutes.last, second: last},
        rhythm(step, units.second, voice), voice)),
      bracket: hoursGone(work),
      names: work.lone
    };
  },
  // One named moment: the seconds as a span from it, or its whole minute.
  function onOneMoment(clock) {
    const {moments, voice, work} = clock;
    const fixed = {...hourFixed(work), minute: work.minutes.values[0]};
    const level = levelOf('second', fixed);
    const head = everyHour(work);

    return work.one && (work.lone || isOpen(work.hourForm)) &&
      spanned.includes(moments.kind) && {
      body: join(head, fromOrThrough(baseOf(moments), level, clock)),
      bracket: [
        ...sayTimes(removedOf(moments).map(level.moment), voice).map(
          function under(time) {
            return join(head, time);
          }
        ),
        ...hoursGone(work)
      ],
      names: work.lone
    };
  },
  // A few moments and a few seconds: every moment, written out.
  function writtenOut(clock) {
    const {seconds, voice, work} = clock;
    const open = isOpen(work.hourForm);
    // In clock order on one day, an hour counted past midnight brought
    // back into the day.
    const hours = open && [{}] || work.hours.values.map(function fix(hour) {
      return hour % 24;
    }).sort(function ascending(a, b) {
      return a - b;
    }).map(function fix(hour) {
      return {hour};
    });
    const count =
      hours.length * work.minutes.values.length * seconds.values.length;
    const plain = open && work.minuteForm.kind === 'values' || listable(work);

    return clock.moments.kind === 'values' && count <= listedMoments &&
      plain && {
      body: join(everyHour(work), sayTimes(
        everyMoment(hours, work.minutes.values, seconds.values), voice
      ).join(', ')),
      bracket: hoursGone(work),
      names: !open
    };
  },
  // Otherwise the minutes are named, as moments or as a spacing, and the
  // seconds are positions in each.
  function inEachMinute(clock) {
    const {inEach, voice, work} = clock;
    const flat = hoursAndMinutes(work);
    const level = levelOf('second');
    const closing = [words.interval, words.alsoAt, words.at];
    const closed = closing.some(function ends(word) {
      return flat.body.endsWith(word);
    });

    return {
      body: join(`${flat.body}${[words.at, ''][Number(closed)]}`, words.each,
        fromOrThrough(baseOf(inEach), level, clock)),
      bracket: [
        ...flat.bracket,
        ...taken(removedOf(inEach), level,
          {head: words.each, under: null}, voice)
      ],
      names: flat.names
    };
  }
];

/**
 * The time part of a description, and whether it names a clock time (a
 * bare rhythm, or one under every hour, names none).
 */
function timeOf(facts: ScheduleFacts, style: KoreanStyle):
  {names: boolean; text: string} {
  const seconds = fieldOf(facts, 'second');
  const ride = facts.analyses.clockSecond;
  const still = seconds.values.length === 1;
  const voice = {bare: true, frame: false, style};
  const clock: Seconds = {
    inEach: choose(seconds, {...exceptions, edges: true}),
    moments: choose(seconds,
      {...exceptions, ceiling: listedMoments, edges: true, few: 3}),
    rhythm: choose(seconds, {...exceptions, bare: true}),
    seconds,
    voice,
    work: clockworkOf(hoursOf(facts), fieldOf(facts, 'minute'),
      {bare: still && !ride, frame: !still, style}, ride)
  };
  const said = rules.reduce<Spoken | false>(function first(found, rule) {
    return found || rule(clock);
  }, false) as Spoken;

  return {names: said.names, text: `${said.body}${paren(said.bracket)}`};
}

export {timeOf};
