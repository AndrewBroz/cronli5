// The time of day with the seconds held still: the hours and the minutes
// said together, by the first form that applies. A second that rides on
// every moment is carried along.

import type {Time, Voice} from './clock.js';
import {blocks, paren, rhythm, sayTime, sayTimes, span} from './clock.js';
import lexicon from './lexicon.js';
import type {Lead} from './phrases.js';
import {inside, levelOf, progress, taken} from './phrases.js';
import type {Described, FieldSet} from './sets.js';
import {
  baseOf, choose, endsOf, isOpen, ofKind, parityOf, removedOf, runsOf,
  stepOf, tiles, touchesEdge
} from './sets.js';

const {units, words} = lexicon;

/** The hours and minutes of a schedule, and how they are to be said. */
export interface Clockwork {
  hours: FieldSet;
  minutes: FieldSet;
  // The descriptions the hours and the minutes are said by.
  hourForm: Described;
  minuteForm: Described;
  // Whether there is one hour, and whether there is one minute.
  lone: boolean;
  one: boolean;
  // The one second every moment carries, when it is not zero.
  ride?: number;
  voice: Voice;
}

/**
 * A time part: its words, what its closing bracket takes out, and whether
 * it names a clock time.
 */
export interface Spoken {
  body: string;
  bracket: string[];
  names: boolean;
}

/** Whole hours, as they stand before what happens in each. */
export interface HourLead extends Lead {
  // The hours left out of every hour, or of every second hour.
  gone: number[];
  // The word for "in each of them" in a bracket.
  head: string;
  // The hours, when they are named one by one.
  named: number[] | null;
}

type TimeRule = (work: Clockwork) => Spoken | false;

// A list of clock times is the form up to this many times; fewer when
// they are evenly spaced or one field is not a plain list.
const fewTimes = 3;
const unevenTimes = 5;
const listedTimes = 6;

// How many clock times a list of hours may hold at one minute, and how
// many whole hours may be named.
const hoursAtOneMinute = 6;
const wholeHoursNamed = 12;

const hourParities = [words.evenHours, words.oddHours];
const also = `, ${words.also} `;

// What one hour's minutes may be for the hour to be said as spans.
const spanned = ['all', 'range', 'cadence', 'pieces', 'except'];

/** The hours and minutes with the descriptions each is said by. */
function clockworkOf(
  hours: FieldSet,
  minutes: FieldSet,
  voice: Voice,
  ride?: number
): Clockwork {
  const lone = hours.values.length === 1;
  const one = minutes.values.length === 1;

  return {
    hourForm: choose(hours, {
      allBut: true,
      ceiling: one ? hoursAtOneMinute : wholeHoursNamed,
      few: fewTimes,
      lessCadence: true,
      split: one
    }),
    minuteForm: choose(minutes, {
      allBut: true,
      bare: !voice.frame,
      ceiling: 12,
      edges: lone || !voice.bare,
      few: lone ? fewTimes : 4,
      lessCadence: true,
      split: true
    }),
    hours,
    lone,
    minutes,
    one,
    ride,
    voice
  };
}

function hoursFromTo(from: number, to: number, voice: Voice): string {
  const [first, last] =
    sayTimes([{hour: from}, {hour: to}], voice, units.hourBlock);

  return `${first}${words.from} ${last}${words.until}`;
}

// Every hour, or every hour but some: nothing stands before a rhythm.
function everyHour(): HourLead {
  return {
    before: words.everyHour,
    gone: [],
    head: words.everyHour,
    named: null,
    onto: ''
  };
}

function hourRange(form: Described, set: FieldSet, voice: Voice): HourLead {
  const {last, start} = endsOf(form, set.domain);
  const text = hoursFromTo(start, last, voice);

  return {
    before: `${text} ${words.everyHour}`,
    gone: [],
    head: words.everyHour,
    named: null,
    onto: text
  };
}

function namedHours(text: string, set: FieldSet): HourLead {
  return {
    before: `${text} ${words.each}`,
    gone: [],
    head: words.each,
    named: set.values,
    onto: text
  };
}

function hourList(form: Described, set: FieldSet, voice: Voice): HourLead {
  return namedHours(`${blocks(set.values, voice)}${words.at}`, set);
}

// Ranges and lists in ascending order; a list that comes last ends in
// «에».
function hourPieces(form: {parts: Described[]}, set: FieldSet, voice: Voice):
  HourLead {
  const text = form.parts.map(function each(part, at) {
    const {last, start} = endsOf(part, set.domain);
    const ends = at === form.parts.length - 1 && words.at || '';

    return part.kind === 'range' ?
      hoursFromTo(start, last, voice) :
      `${blocks((part as {values: number[]}).values, voice)}${ends}`;
  }).join(also);

  return namedHours(text, set);
}

const hourLeads: {
  [kind: string]: (form: never, set: FieldSet, voice: Voice) => HourLead;
} = {all: everyHour, pieces: hourPieces, range: hourRange};

/**
 * The hours as whole hours («N시대»), named by how many they are and how
 * they lie, or «짝수 시», «홀수 시» for every second hour.
 */
function wholeHours(form: Described, set: FieldSet, voice: Voice): HourLead {
  const base = baseOf(form);
  const parity = parityOf(base, set.domain, hourParities);
  const say = hourLeads[base.kind] ?? hourList;
  const lead = parity ?
    {
      before: parity,
      gone: [],
      head: words.everyHour,
      named: null,
      onto: `${parity}${words.at}`
    } :
    say(base as never, set, voice);

  return {
    ...lead,
    gone: (parity || isOpen(form)) && removedOf(form) || []
  };
}

// The moments of the given hours at one minute.
function atMinute(hours: number[], work: Clockwork): Time[] {
  return hours.map(function at(hour) {
    return {hour, minute: work.minutes.values[0], second: work.ride};
  });
}

// Whole hours and the minutes in each; with every hour, or every hour but
// some, the minutes inside the hour and the missing hours in the bracket.
function inHours(work: Clockwork): Spoken {
  const {hourForm, minuteForm, voice} = work;
  const lead = wholeHours(hourForm, work.hours, voice);
  const level = levelOf('minute', {second: work.ride});
  const gone = work.one && isOpen(hourForm) &&
    sayTimes(atMinute(lead.gone, work), voice).join(', ') ||
    blocks(lead.gone, voice);
  const under = lead.named && lead.named.map(function fix(hour) {
    return {hour};
  });

  return {
    body: inside(minuteForm, level, lead, voice),
    bracket: [
      ...taken(removedOf(minuteForm), level, {head: lead.head, under}, voice),
      gone
    ].filter(Boolean),
    names: !isOpen(hourForm)
  };
}

function minutesOfDay(time: Time): number {
  return (time.hour as number) * 60 + (time.minute as number);
}

/**
 * The clock times of the day, when they are few enough to be listed one
 * by one; false otherwise.
 */
function listable(work: Clockwork): Time[] | false {
  const {hours, minutes} = work;
  const count = hours.values.length * minutes.values.length;
  const times = count <= listedTimes && hours.values.flatMap(
    function eachHour(hour) {
      return minutes.values.map(function eachMinute(minute) {
        return {hour, minute, second: work.ride};
      });
    }
  ) || [];
  const even = times.every(function spaced(time, at) {
    return at < 2 || minutesOfDay(time) - minutesOfDay(times[at - 1]) ===
      minutesOfDay(times[1]) - minutesOfDay(times[0]);
  });
  const fits = count <= fewTimes || count <= unevenTimes && !even ||
    count <= listedTimes && (work.lone && work.minuteForm.kind === 'values' ||
      work.one && work.hourForm.kind === 'values');

  return fits && times;
}

// The rhythm the minutes keep when they fill the hour, at any offset:
// every minute, or a cadence that comes round evenly, with what is taken
// out of it. A missing first or last minute of the hour is no such
// exception.
function beatOf(work: Clockwork) {
  const {minuteForm, minutes} = work;
  const {domain} = minutes;
  const beat = minuteForm.kind === 'except' && minuteForm.base ||
    ofKind(minutes.candidates, 'cadence') || minuteForm;
  const gone = removedOf(minuteForm);

  return {
    ...endsOf(beat, domain),
    fromTop: endsOf(beat, domain).start === domain.min,
    gone,
    steady: !touchesEdge(gone, domain) && (beat.kind === 'all' ||
      beat.kind === 'cadence' && tiles(beat, domain))
  };
}

// One run of hours under a rhythm that fills the hour, or two runs under
// one that fills it from the top: a span for each run, from its first
// firing to its last.
function inSpans(work: Clockwork): Spoken | false {
  const {ride, voice} = work;
  const beat = beatOf(work);
  const runs = runsOf(work.hours.values);
  const two = runs.length === 2 && beat.fromTop &&
    runs.some(function long(run) {
      return run.length > 1;
    });
  const level = levelOf('minute', {second: ride});
  // Each of two spans has its own bracket, unless something follows them.
  const apart = runs.length > 1 && !voice.frame;
  const cuts = runs.map(function cut(run) {
    const under = run.length === 1 && [{hour: run[0]}] || null;

    return taken(beat.gone, level, {head: words.everyHour, under}, voice);
  });

  return beat.steady && (runs.length === 1 || two) && {
    body: runs.map(function each(run, at) {
      return span({hour: run[0], minute: beat.start, second: ride},
        {hour: run[run.length - 1], minute: beat.last, second: ride},
        rhythm(beat.interval, units.minute, voice), voice) +
        (apart && paren(cuts[at]) || '');
    }).join(also),
    bracket: [...new Set(cuts.flat())].filter(function shared() {
      return !apart;
    }),
    names: true
  };
}

const rules: TimeRule[] = [
  // Hours unrestricted, or all but one or two.
  function underEveryHour(work) {
    return isOpen(work.hourForm) && inHours(work);
  },
  function clockTimes(work) {
    const times = listable(work);

    return times && {
      body: sayTimes(times, work.voice).join(', '),
      bracket: [],
      names: true
    };
  },
  // One minute: the hours as moments. From the first hour of the day at
  // minute 0 a rhythm that fills the day is the step alone.
  function atOneMinute(work) {
    const {hours, ride, voice} = work;
    const [minute] = work.minutes.values;
    const base = baseOf(work.hourForm);
    const step = voice.bare && minute === 0 && stepOf(base, hours.domain);
    const parity = parityOf(base, hours.domain, hourParities);

    return work.one && {
      body: step && rhythm(step, units.hours, voice) ||
        parity && `${parity} ${sayTime({minute, second: ride}, '', voice)}` ||
        progress(base, levelOf('hour', {minute, second: ride}), voice),
      bracket: [
        sayTimes(atMinute(removedOf(work.hourForm), work), voice).join(', ')
      ].filter(Boolean),
      names: !step
    };
  },
  // One hour: its minutes as spans, pieces and the times between them.
  function inOneHour(work) {
    const {minuteForm, voice} = work;
    const [hour] = work.hours.values;
    const level = levelOf('minute', {hour, second: work.ride});
    const scope = {head: words.each, under: [{}]};

    return work.lone && spanned.includes(minuteForm.kind) && {
      body: progress(baseOf(minuteForm), level, voice),
      bracket: taken(removedOf(minuteForm), level, scope, voice),
      names: true
    };
  },
  inSpans,
  inHours
];

/** The hours and minutes together: the first form that applies. */
function hoursAndMinutes(work: Clockwork): Spoken {
  return rules.reduce<Spoken | false>(function first(found, rule) {
    return found || rule(work);
  }, false) as Spoken;
}

export {clockworkOf, hoursAndMinutes, inSpans, listable, wholeHours};
