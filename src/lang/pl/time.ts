// The time of day for second 0: a minute set and an hour set become
// clock times, a rhythm between two of them, or a rhythm inside each
// hour (answers 4.1).

import type {Form, Kind} from './forms.js';
import {asFew} from './forms.js';
import type {Clock} from './text.js';
import {counted, every, listed, units, words} from './text.js';
import type {Anchor, Gap, Tone} from './within.js';
import {fullHours, hours, lacks, momentsLacking, namedHours, theHour,
  within} from './within.js';
import {inEach, windows} from './spans.js';

/**
 * How finely the clock is read: the second a clock time shows, and the
 * finer rhythm said in place of «co minutę» when seconds fill the minute.
 */
export interface Grain {
  each: string;
  // The second a stretch opens on, closes on, and a lone moment shows.
  first: number | null;
  last: number | null;
  moment: number | null;
  endTail: string;
  gap: Gap;
}

/** The three clock fields as forms, and how a clock time is written. */
export interface TimeFacts {
  second: Form;
  minute: Form;
  hour: Form;
  clock: Clock;
  short: boolean;
}

/** A time as said, and what the parts around it need to know of it. */
export interface Said {
  text: string;
  // Names a clock time outside an exception: the schedule has a daily
  // shape.
  clock: boolean;
  // Made of real clock times only, each of which can show a second.
  real: boolean;
  // Says every minute between named ends, so a rhythm of seconds can
  // take the place of «co minutę».
  spans: boolean;
  // The clock times, when the time is a list of them.
  times: number[][];
}

type Maybe<T> = T | false | null | undefined;
type Handler = (t: TimeFacts, g: Grain) => Said;

const hoursInDay = 24;
const listedAtMost = 4;
const twoListsAtMost = 6;
const everyOtherHour = 12;

function said(text: string, clock: boolean, real: boolean): Said {
  return {clock, real, spans: false, text, times: []};
}

function toneOf(t: TimeFacts, g: Grain): Tone {
  return {each: g.each, endTail: g.endTail, gap: g.gap, short: t.short};
}

function fullHour(t: TimeFacts, g: Grain): Anchor {
  return fullHours(toneOf(t, g));
}

// «, oprócz godziny 8», «, oprócz godzin 8 i 14»: an hour that holds
// several firings is left out by its number.
function withoutHours(removed: number[]): string {
  const lead = [words.exceptHour, words.exceptHours][
    Number(removed.length > 1)];

  return removed.length > 0 && `, ${lead} ${listed(removed)}` || '';
}

// The runs of neighbouring hours, each in the order it is passed through;
// a run kept whole past midnight starts before it.
function hourRuns(hour: Form): number[][] {
  const turned = [
    ...hour.values.filter(function late(value) {
      return value >= hour.from;
    }),
    ...hour.values.filter(function early(value) {
      return value < hour.from;
    })
  ];

  return turned.reduce<number[][]>(function group(runs, value) {
    const current = runs[runs.length - 1];
    const joins = current &&
      (current[current.length - 1] + 1) % hoursInDay === value;

    (joins && current || runs[runs.push([]) - 1]).push(value);

    return runs;
  }, []);
}

// A window for each run of hours, from the first moment that fires to
// the last.
function hourWindows(t: TimeFacts, g: Grain): string[][] {
  return hourRuns(t.hour).map(function ends(run) {
    return [
      t.clock(run[0], t.minute.from, g.first),
      t.clock(run[run.length - 1], t.minute.to, g.last)
    ];
  });
}

// A rhythm of hours that tiles the day, on the hour, is said bare: «co
// 2 godziny», and less an hour or two «co 2 godziny, oprócz 8:00».
function bare(t: TimeFacts, g: Grain): Maybe<Said> {
  const base = t.hour.base || t.hour;
  const onTheHour = t.minute.kind === 'one' && t.minute.values[0] === 0 &&
    g.moment === null;
  const gone = t.hour.removed.map(function time(hour) {
    return t.clock(hour, 0, null);
  });

  return onTheHour && base.kind === 'tiling' && said(
    `${every(base.interval, units.hour, t.short)}` +
    `${lacks(gone, [], fullHour(t, g))}`, false, false);
}

function isList(form: Form): boolean {
  return form.kind === 'one' || form.kind === 'list';
}

// Up to four clock times a day are listed; a list of minutes with a list
// of hours up to six.
function fewTimes(t: TimeFacts, g: Grain): Maybe<Said> {
  const count = t.minute.values.length * t.hour.values.length;
  const fits = count <= listedAtMost ||
    count <= twoListsAtMost && isList(t.minute) && isList(t.hour);
  const times = fits && t.hour.values.flatMap(function inHour(hour) {
    return t.minute.values.map(function at(minute) {
      return [hour, minute];
    });
  });

  return times && {
    clock: true,
    real: true,
    spans: false,
    text: `${words.at} ${listed(times.map(function time([hour, minute]) {
      return t.clock(hour, minute, g.moment);
    }))}`,
    times
  };
}

// Every other hour of the whole day, or that less one or two: 0 for the
// even hours, 1 for the odd; null for any other set of hours.
function parityOf(hour: Form): number | null {
  const base = hour.base || hour;

  return base.interval === 2 && base.values.length === everyOtherHour ?
    base.values[0] % 2 :
    null;
}

// A rhythm of hours that tiles the day in five hours or more, other than
// every other hour (said by parity): its step; 0 for any other hours.
function tilingStep(hour: Form): number {
  const base = hour.base || hour;

  return base.kind === 'tiling' && base.values.length > listedAtMost &&
    parityOf(hour) === null && base.interval || 0;
}

// The step of such hours said bare, and what follows it inside each of
// them: «co 3 godziny, za każdym razem 30 minut po pełnej godzinie».
function eachTimeIn(t: TimeFacts, inside: Said): Said {
  return {...inside, text: `${every(tilingStep(t.hour), units.hour,
    t.short)}, ${words.eachTime} ${inside.text}`};
}

// One minute in each of the hours named: a distance from the start of
// each («30 minut po każdej pełnej godzinie»), or, on the hour, the
// phrase given for it. Hours left out are clock times.
function oneMinuteIn(t: TimeFacts, g: Grain, each: string[]): Said {
  const [minute] = t.minute.values;
  const [locative, onTheHour] = each;
  const past = [
    minute > 0 && counted(minute, units.minute, t.short),
    g.moment !== null && counted(g.moment, units.second, t.short)
  ].filter(Boolean).join(` ${words.and} `);
  const base = past && `${past} ${words.minutesPast} ${locative}` ||
    onTheHour;
  const gone = t.hour.removed.map(function time(hour) {
    return t.clock(hour, minute, g.moment);
  });

  return said(`${base}${lacks(gone, [], fullHour(t, g))}`, false, true);
}

// One minute in every hour; minute 0 is «co godzinę».
function onEveryHour(t: TimeFacts, g: Grain): Said {
  return oneMinuteIn(t, g,
    [words.eachFullHour, every(1, units.hour, t.short)]);
}

// One minute in some hours: the hours carry the form, as real times.
function hourMoments(t: TimeFacts, g: Grain): Said {
  const [minute] = t.minute.values;
  const found = inEach(t.hour, [{
    clock(hour) {
      return t.clock(hour, minute, g.moment);
    },
    each: every(1, units.hour, t.short),
    short: t.short,
    unit: units.hour
  }], fullHour(t, g));

  return said(found.text, true, true);
}

// One minute in a rhythm of hours: every other hour of the whole day by
// parity, «o każdej nieparzystej godzinie», «30 minut po każdej parzystej
// godzinie»; a rhythm that tiles the day by its step and the minute after
// it; any other rhythm as real times.
function rhythmMoments(t: TimeFacts, g: Grain): Said {
  const odd = parityOf(t.hour);
  const locative = odd !== null &&
    [words.eachEvenHourLocative, words.eachOddHourLocative][odd];

  return locative &&
      oneMinuteIn(t, g, [locative, `${words.at} ${locative}`]) ||
    tilingStep(t.hour) > 0 &&
      eachTimeIn(t, oneMinuteIn(t, g, [words.fullHour, ''])) ||
    hourMoments(t, g);
}

// Every hour: the minutes in their own form inside the hour.
function open(t: TimeFacts, g: Grain): Said {
  return said(within(t.minute, fullHour(t, g)), false, false);
}

// Minutes that fill the hour evenly: the rhythm once, and a window for
// each run of hours; what is missing inside the windows after them. A
// list of hours whose windows name too many clock times is named once.
function windowed(t: TimeFacts, g: Grain): Said {
  const named = t.hour.kind === 'list' &&
    tooMany(t, hourRuns(t.hour).length * 2);

  return named ? eachOfHours(t, g) : windowEach(t, g);
}

function windowEach(t: TimeFacts, g: Grain): Said {
  const {minute} = t;
  const rhythm = [every(minute.interval, units.minute, t.short), g.each][
    Number(minute.interval === 1)];
  const gone = hourRuns(t.hour).flatMap(function inRun(run) {
    return run.flatMap(function inHour(hour, at) {
      return minute.removed.filter(function inside(value) {
        return (at > 0 || value > minute.from) &&
          (at < run.length - 1 || value < minute.to);
      }).map(function pair(value) {
        return [hour, value];
      });
    });
  });
  const lost = minute.removed.filter(function fallsInside(value) {
    return gone.some(function same(pair) {
      return pair[1] === value;
    });
  });
  const times = gone.map(function time([hour, value]) {
    return t.clock(hour, value, g.moment);
  });

  return {
    clock: true,
    real: gone.length <= listedAtMost,
    spans: minute.kind === 'all',
    text: `${windows(hourWindows(t, g), rhythm)}` +
      `${lacks(times, lost, fullHour(t, g))}`,
    times: []
  };
}

function runsOnly(minute: Form): boolean {
  return (minute.kind === 'run' || minute.kind === 'pieces') &&
    minute.parts.every(function isRun(part) {
      return part.kind === 'run';
    });
}

// Several minutes in a rhythm of hours that tiles the day: the step, and
// the minutes in their own form inside one hour; a missing hour by its
// number. Every minute, or runs of them, give way to a finer rhythm of
// seconds.
function underTiling(t: TimeFacts, g: Grain): Said {
  return eachTimeIn(t, {
    clock: false,
    real: false,
    spans: t.minute.kind === 'all' || runsOnly(t.minute),
    text: `${within(t.minute, theHour(toneOf(t, g)))}` +
      `${withoutHours(t.hour.removed)}`,
    times: []
  });
}

// The hours named once and the minutes said once, inside each of them:
// «5, 20 i 45 minut po każdej z godzin 8:00, 12:00 i 18:00», «co 15
// minut od każdej z godzin 1:00, 4:00 i 9:00 do 45 minut po niej».
function eachOfHours(t: TimeFacts, g: Grain): Said {
  const each = `${words.eachOfTheHours} ${listed(
    t.hour.values.map(function start(value) {
      return t.clock(value, 0, null);
    }))}`;

  return {
    ...said(within(t.minute, namedHours(each, toneOf(t, g))), true, false),
    spans: t.minute.kind === 'all' || runsOnly(t.minute)
  };
}

// Every other hour of the whole day, under several minutes, by parity.
function byParity(t: TimeFacts, g: Grain): Said {
  const {hour, minute} = t;
  const tone = toneOf(t, g);
  const odd = (hour.base || hour).values[0] % 2;
  const anchor = hours(
    [words.eachEvenHourLocative, words.eachOddHourLocative][odd],
    [words.eachEvenHourGenitive, words.eachOddHourGenitive][odd], tone);
  const rhythm = [every(minute.interval, units.minute, t.short), g.each][
    Number(minute.interval === 1)];
  const text = minute.steady ?
    `${rhythm} ${words.in} ${[words.evenHours, words.oddHours][odd]}` +
      `${withoutHours(hour.removed)}` +
      `${momentsLacking(minute.removed, fullHours(tone))}` :
    `${within(minute, anchor)}${withoutHours(hour.removed)}`;

  return said(text, false, false);
}

// A rhythm of hours under several minutes: the hours are not moments but
// hours that each hold several firings. A rhythm that tiles the day is
// said by its step; every other hour of the whole day by parity; any
// other rhythm names its hours once.
function underRhythm(t: TimeFacts, g: Grain): Said {
  return tilingStep(t.hour) > 0 && underTiling(t, g) ||
    parityOf(t.hour) !== null && byParity(t, g) ||
    eachOfHours(t, g);
}

// How many clock times a set of minutes names in one hour said as real
// times: a moment one, a stretch its two ends.
function clocksIn(form: Form): number {
  return form.parts.length > 0 ?
    form.parts.reduce(function add(total, part) {
      return total + clocksIn(part);
    }, 0) :
    [2, form.values.length][Number(isList(form))];
}

// Up to six clock times a day are said hour by hour; past that several
// hours are named once.
function tooMany(t: TimeFacts, clocks: number): boolean {
  return t.hour.values.length > 1 && clocks > twoListsAtMost;
}

// A list of minutes in every hour but one or two.
function butHours(t: TimeFacts, g: Grain): Said {
  return said(
    `${within(t.minute, fullHour(t, g))}${withoutHours(t.hour.removed)}`,
    false, false);
}

// Inside each hour of several hours: the window of the first and last
// moment that fire, a colon, and the hour's own form.
function colon(t: TimeFacts, g: Grain): Said {
  return {
    clock: true,
    real: false,
    spans: runsOnly(t.minute),
    text: `${windows(hourWindows(t, g), '')}: ` +
      `${within(t.minute, fullHour(t, g))}`,
    times: []
  };
}

// One hour, or a few: real clock times in the minutes' own form for each
// hour; hours that would name too many clock times are named once.
function perHour(t: TimeFacts, g: Grain): Said {
  return tooMany(t, t.hour.values.length * clocksIn(t.minute)) ?
    eachOfHours(t, g) :
    hourByHour(t, g);
}

function hourByHour(t: TimeFacts, g: Grain): Said {
  const seconds = [g.first, g.last, g.moment];
  const found = inEach(t.minute, t.hour.values.map(function dial(hour) {
    return {
      clock(minute: number, as: number) {
        return t.clock(hour, minute, seconds[as]);
      },
      each: g.each,
      short: t.short,
      unit: units.minute
    };
  }), fullHour(t, g));

  return {...found, clock: true, spans: runsOnly(t.minute), times: []};
}

const underLists: Partial<Record<Kind, Handler>> = {
  allBut: butHours,
  list: eachOfHours
};

const underOthers: Partial<Record<Kind, Handler>> = {
  allBut: colon,
  cadencePieces: colon,
  list: perHour,
  one: perHour,
  pieces: colon,
  run: colon,
  wrap: colon
};

// Minutes that are neither one nor a rhythm filling the hour, in hours
// that are neither every hour nor a rhythm.
function someHours(t: TimeFacts, g: Grain): Said {
  const handler = t.minute.kind === 'list' && underLists[t.hour.kind] ||
    underOthers[t.hour.kind] as Handler;

  return handler(t, g);
}

type Shape = 'allBut' | 'every' | 'rhythm' | 'runs';

/** How a set of hours lies in the day. */
const shapes: Record<Kind, Shape> = {
  all: 'every',
  allBut: 'allBut',
  cadence: 'rhythm',
  cadencePieces: 'runs',
  less: 'rhythm',
  list: 'runs',
  one: 'runs',
  pieces: 'runs',
  run: 'runs',
  tiling: 'rhythm',
  wrap: 'runs'
};

const handlers: Record<string, Record<Shape, Handler>> = {
  filling: {allBut: windowed, every: open, rhythm: underRhythm,
    runs: windowed},
  one: {allBut: onEveryHour, every: onEveryHour, rhythm: rhythmMoments,
    runs: hourMoments},
  other: {allBut: someHours, every: open, rhythm: underRhythm,
    runs: someHours}
};

/** The time the minutes and hours make, read at a grain of seconds. */
function minutesAndHours(t: TimeFacts, g: Grain): Said {
  const listable = {...t, hour: asFew(t.hour)};
  const {minute} = t;
  // Few minutes with equal gaps are one rhythm only where hours follow
  // one another, so that it runs on across the full hour.
  const runsOn = minute.unbroken &&
    hourRuns(listable.hour).some(function several(run) {
      return run.length > 1;
    });
  const sort = minute.kind === 'one' && 'one' ||
    (minute.steady || minute.seamless || runsOn) && 'filling' || 'other';

  return bare(t, g) || fewTimes(listable, g) ||
    handlers[sort][shapes[listable.hour.kind]](listable, g);
}

export {minutesAndHours, shapes};
