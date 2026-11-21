// The clock a time is said on: the three time fields as chosen forms, the
// seconds a clock time carries, and the pieces every way of saying a time
// is built from (answers 4.1 and 4.2).

import type {
  Field, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';
import type {Part, Plain} from './forms.js';
import {habits, isCadence, isRange, partOf} from './forms.js';
import lexicon from './lexicon.js';
import type {IndonesianStyle} from './options.js';
import {clock, list, phrase} from './say.js';
import type {Setting, Tier} from './within.js';
import {
  closesAfter, eachTime, everyUnit, inside, leftOutAt, minuteTier,
  secondTier, under
} from './within.js';

const {units, words} = lexicon;

/** The three time fields and the style their clock times are written in. */
export interface Clockwork {
  hours: Part;
  minutes: Part;
  seconds: Part;
  style: IndonesianStyle;
}

/** How a way of saying the time carries the seconds. */
export interface Tick {
  // What is left out of the seconds.
  left: string[];
  // The rhythm of one: every minute, or the seconds that fill it.
  one: string;
  // The seconds clock times show; none when they show no seconds.
  seconds: number[];
  // The seconds said after the minutes («tiap kali …»), when no clock
  // time carries them.
  suffix: string;
}

/** Which seconds a way of saying the time can carry on its clock times. */
export interface Takes {
  // Any seconds at all: every moment is listed.
  any?: boolean;
  // A rhythm of seconds that fills every minute of a stretch.
  fine?: boolean;
  // One second, on every clock time.
  one?: boolean;
  // Every second, where the minutes are said as a length.
  whole?: boolean;
}

/** One way of saying the time, before what is left out is added. */
export interface Shaped {
  // Whether it ends in a clause of its own.
  clause?: boolean;
  // Whether it holds «tiap kali» already.
  each?: boolean;
  // Whether a position left out of the minutes still has to say «setiap
  // jam».
  closes?: boolean;
  // Whether it is a rhythm that runs round the clock.
  round?: boolean;
  // The seconds shown on the times that are left out, when they are not
  // the ones the time itself carries.
  span?: Tick;
  text: string;
  tick: Tick;
}

/** A clock time, or a stretch between two with its rhythm. */
export interface Item {
  moment?: string;
  text: string;
  word?: string;
}

// Hours that run past midnight are one run only when nothing else is
// restricted, and only where the hours would otherwise be said in pieces:
// every hour but one or two is still said as that.
function pastMidnight(facts: ScheduleFacts, cut: Part): Part {
  const {candidates} = facts.analyses;
  const others: Field[] = ['date', 'month', 'weekday', 'year'];
  const free = others.every(function open(field) {
    return candidates[field]?.[0].kind === 'all';
  });
  const wrapped = (candidates.hour as SetDescription[]).find(
    function wraps(found) {
      return isRange(found) && found.from > found.to;
    }
  );
  const inPieces = cut.removed.length === 0 &&
    ['pieces', 'values'].includes(cut.base.kind);

  return free && wrapped && inPieces ?
    {...cut, base: wrapped as Plain} :
    cut;
}

/** The time fields of a schedule, each in the form it is said in. */
function clockworkOf(facts: ScheduleFacts, style: IndonesianStyle):
  Clockwork {
  function part(field: 'second' | 'minute' | 'hour',
    candidates: SetDescription[]): Part {
    return partOf({
      candidates,
      domain: domainOf(field),
      habits: habits[field],
      mixed: facts.analyses.cadencePieces[field]
    });
  }

  function cut(field: 'second' | 'minute' | 'hour'): Part {
    return part(field,
      candidatesAs(facts, field, {linear: true}) as SetDescription[]);
  }

  return {
    hours: pastMidnight(facts, cut('hour')),
    minutes: cut('minute'),
    seconds: cut('second'),
    style
  };
}

/** A clock time in the style, with a second when one is given. */
function at(work: Clockwork, hour: number, minute: number, second?: number):
  string {
  return clock(hour, minute, second, work.style);
}

function firstSecond(tick: Tick): number | undefined {
  return tick.seconds[0];
}

function lastSecond(tick: Tick): number | undefined {
  return tick.seconds[tick.seconds.length - 1];
}

/** How many moments a tick shows in each minute. */
function perMinute(tick: Tick): number {
  return Math.max(1, tick.seconds.length);
}

/** Every moment a tick shows in one minute, as clock times. */
function moments(work: Clockwork, tick: Tick, hour: number, minute: number):
  string[] {
  return tick.seconds.length > 0 ?
    tick.seconds.map(function withSecond(second) {
      return at(work, hour, minute, second);
    }) :
    [at(work, hour, minute)];
}

// Which seconds a pattern has, in the order they are told apart: none to
// say (second 0 alone), one, a rhythm that fills the minute from its
// start, or anything else.
const SILENT = 0;
const FILLING = 2;

function secondsKind(seconds: Part): number {
  return [
    seconds.values.length === 1 && seconds.values[0] === 0,
    seconds.values.length === 1,
    seconds.base.kind === 'all' ||
      isCadence(seconds.base) &&
      habits.second.bare(seconds.base, secondTier.domain),
    true
  ].findIndex(Boolean);
}

/** The seconds left out, as positions in the minute. */
function secondsLeftOut(work: Clockwork, closes: boolean): string[] {
  const {removed} = work.seconds;

  return removed.length > 0 ? [leftOutAt(removed, secondTier, closes)] : [];
}

/**
 * The seconds for a way of saying the time. Where its clock times can
 * carry them they do; where not, the seconds follow the minutes after
 * «tiap kali», and up to four are named even when they are a rhythm.
 */
function tickFor(work: Clockwork, takes: Takes): Tick {
  const {seconds} = work;
  const kind = secondsKind(seconds);
  const carried = [
    true, takes.one, takes.fine || takes.whole && seconds.base.kind === 'all'
  ][kind] || takes.any;

  if (carried) {
    return {
      left: secondsLeftOut(work, !closesAfter(seconds.base, secondTier)),
      one: kind === FILLING ?
        inside(seconds.base, secondTier, under) :
        everyUnit(units.minute),
      seconds: kind === SILENT ? [] : seconds.values,
      suffix: ''
    };
  }

  const spoken: Plain = seconds.values.length > 4 ?
    seconds.base :
    {kind: 'values', values: seconds.values};

  return {
    left: secondsLeftOut(work, false),
    one: everyUnit(units.minute),
    seconds: [],
    suffix: inside(spoken, secondTier, eachTime)
  };
}

/**
 * Whether a set is said as a length: every value, or a stretch from the
 * start of the unit.
 */
function isLength(form: Plain, tier: Tier): boolean {
  return form.kind === 'all' ||
    isRange(form) && form.from === tier.domain.min;
}

/**
 * The minutes inside the hour, with every second of them when the minutes
 * are a length and the seconds are all there.
 */
function minutesInside(work: Clockwork, setting: Setting): Shaped {
  const tick = tickFor(work, {whole: isLength(work.minutes.base, minuteTier)});

  return {
    text: inside(work.minutes.base, minuteTier, {...setting, one: tick.one}),
    tick
  };
}

/** «dari pukul 09.00 sampai 17.45». */
function between(from: string, to: string): string {
  return phrase(words.from, words.oClock, from, words.to, to);
}

function stretch(word: string | undefined, from: string, to: string): Item {
  return {text: between(from, to), word};
}

function moment(time: string): Item {
  return {moment: time, text: phrase(words.oClock, time)};
}

/** Clock times in a list, «pukul» said once. */
function times(found: string[]): string {
  return phrase(words.oClock, list(found));
}

/**
 * Stretches and single times in one list. A list of times alone says
 * «pukul» once; otherwise every member is a whole phrase, and a stretch
 * says its rhythm unless the stretch before it had the same.
 */
function series(items: Item[]): string {
  const alone = items.map(function timeOf(item) {
    return item.moment;
  });
  let rhythm: string | undefined;

  return alone.every(Boolean) ?
    times(alone as string[]) :
    list(items.map(function each(item) {
      const said = phrase(item.word !== rhythm && item.word, item.text);

      rhythm = item.word || rhythm;

      return said;
    }));
}

type Spans<Kind extends Plain['kind']> = (
  form: Extract<Plain, {kind: Kind}>,
  tier: Tier,
  one: string,
  time: (value: number, last: boolean) => string
) => Item[];

function severalSpans(
  form: Extract<Plain, {kind: 'pieces' | 'cadencePieces'}>,
  tier: Tier,
  one: string,
  time: (value: number, last: boolean) => string
): Item[] {
  return form.parts.flatMap(function each(part) {
    return spans(part, tier, one, time);
  });
}

const spanners: {[Kind in Plain['kind']]: Spans<Kind>} = {
  all(_form, tier, one, time) {
    return [stretch(one, time(tier.domain.min, false),
      time(tier.domain.max, true))];
  },
  cadence(form, tier, _one, time) {
    return [stretch(everyUnit(tier.unit, form.interval),
      time(form.start, false), time(form.last, true))];
  },
  cadencePieces: severalSpans,
  pieces: severalSpans,
  range(form, _tier, one, time) {
    return [stretch(one, time(form.from, false), time(form.to, true))];
  },
  values(form, _tier, _one, time) {
    return form.values.map(function single(value) {
      return moment(time(value, false));
    });
  }
};

/**
 * A set of minutes in one hour, or of seconds in one minute, with clock
 * times: each run or rhythm a stretch from its first to its last firing,
 * each single value a time.
 */
function spans(
  form: Plain,
  tier: Tier,
  one: string,
  time: (value: number, last: boolean) => string
): Item[] {
  return (spanners[form.kind] as Spans<Plain['kind']>)(form, tier, one, time);
}

export {
  at, between, clockworkOf, firstSecond, isLength, lastSecond,
  minutesInside, moment, moments, perMinute, secondsLeftOut, series, spans,
  stretch, tickFor, times
};
