// The time of day for second 0: a minute set and an hour set become
// clock times, a rhythm between two of them, or a rhythm inside each
// hour (answers 4.1).

import type {Form, Kind} from './forms.js';
import {asFew} from './forms.js';
import type {Clock} from './text.js';
import {counted, every, listed, units, words} from './text.js';
import type {Anchor, Gap, Tone} from './within.js';
import {fullHours, hours, lacks, momentsLacking, within} from './within.js';
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

// One minute in every hour is a distance from the full hour; minute 0 is
// «co godzinę». Hours left out are clock times.
function onEveryHour(t: TimeFacts, g: Grain): Said {
  const [minute] = t.minute.values;
  const past = [
    minute > 0 && counted(minute, units.minute, t.short),
    g.moment !== null && counted(g.moment, units.second, t.short)
  ].filter(Boolean).join(` ${words.and} `);
  const base = past && `${past} ${words.minutesPast} ${words.eachFullHour}` ||
    every(1, units.hour, t.short);
  const gone = t.hour.removed.map(function time(hour) {
    return t.clock(hour, minute, g.moment);
  });

  return said(`${base}${lacks(gone, [], fullHour(t, g))}`, false, true);
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

// Every hour: the minutes in their own form inside the hour.
function open(t: TimeFacts, g: Grain): Said {
  return said(within(t.minute, fullHour(t, g)), false, false);
}

// Minutes that fill the hour evenly: the rhythm once, and a window for
// each run of hours; what is missing inside the windows after them.
function windowed(t: TimeFacts, g: Grain): Said {
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

// A rhythm of hours under several minutes: the hours are not moments but
// hours that each hold several firings. Every other hour of the whole day
// is said by parity; any other rhythm names its hours by the moment each
// begins.
function underRhythm(t: TimeFacts, g: Grain): Said {
  const {hour, minute} = t;
  const tone = toneOf(t, g);
  const base = hour.base || hour;
  const parity = base.interval === 2 && base.values.length === everyOtherHour;
  const odd = base.values[0] % 2;
  const starts = listed(hour.values.map(function start(value) {
    return t.clock(value, 0, null);
  }));
  const each = `${words.eachOfTheHours} ${starts}`;
  const [anchor, where] = parity ?
    [
      hours([words.eachEvenHourLocative, words.eachOddHourLocative][odd],
        [words.eachEvenHourGenitive, words.eachOddHourGenitive][odd], tone),
      [words.evenHours, words.oddHours][odd]
    ] :
    [hours(each, each, tone), `${words.hoursBeginningAt} ${starts}`];
  const fewer = withoutHours(hour.removed).repeat(Number(parity));
  const rhythm = [every(minute.interval, units.minute, t.short), g.each][
    Number(minute.interval === 1)];
  const text = minute.steady ?
    `${rhythm} ${words.in} ${where}${fewer}` +
      `${momentsLacking(minute.removed, fullHours(tone))}` :
    `${within(minute, anchor)}${fewer}`;

  return said(text, !parity, false);
}

// A list of minutes after each of a few hours: «5, 20 i 45 minut po
// każdej z godzin 8:00, 12:00 i 18:00».
function eachOfHours(t: TimeFacts, g: Grain): Said {
  const each = `${words.eachOfTheHours} ${listed(
    t.hour.values.map(function start(value) {
      return t.clock(value, 0, null);
    }))}`;

  return said(within(t.minute, hours(each, each, toneOf(t, g))), true, false);
}

// A list of minutes in every hour but one or two.
function butHours(t: TimeFacts, g: Grain): Said {
  return said(
    `${within(t.minute, fullHour(t, g))}${withoutHours(t.hour.removed)}`,
    false, false);
}

function runsOnly(minute: Form): boolean {
  return (minute.kind === 'run' || minute.kind === 'pieces') &&
    minute.parts.every(function isRun(part) {
      return part.kind === 'run';
    });
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
// hour.
function perHour(t: TimeFacts, g: Grain): Said {
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
  one: {allBut: onEveryHour, every: onEveryHour, rhythm: hourMoments,
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
