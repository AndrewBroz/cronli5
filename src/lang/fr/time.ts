// The time part: seconds, minutes and hours said together. What happens
// inside an hour is worked out first (a beat), then the hours confine it,
// then the seconds that are not already in it are added. A plain list of
// clock times competes with all of that by the count of things named.

import type {RangeDescription} from '../../core/schedule.js';
import {denote} from '../../core/describe-set.js';
import type {Context} from './context.js';
import lexicon from './lexicon.js';
import {
  after, conjoin, counted, every, given, led, phrase, series, tally, written
} from './say.js';
import type {
  Cadence, Counts, Excepted, Of, Part, Sayers, Stretch
} from './sets.js';
import {
  around, choose, countOf, interior, isRange, isRun, isSingle, keepsEnds,
  lengthOf, members, partsCount, runsOf, say, singles, stretchesOf, tiling,
  when
} from './sets.js';

const {twoDigits, units, words: w} = lexicon;

/** A moment inside an hour. */
interface Tick {
  minute: number;
  second: number;
}

/** A stretch inside an hour, from its first moment to its last. */
type Span = [Tick, Tick];

/** A phrase, with what the frame and the choice need to know of it. */
interface Said {
  // Whether it begins with a clock time.
  clock: boolean;
  // How many things it names.
  count: number;
  excepted?: boolean;
  text: string;
}

/** What happens inside each hour that fires. */
interface Beat {
  // Whether the seconds are already said by the head.
  consumed: boolean;
  // Whether it fills the hour, so that hours in a row are one window.
  continuous: boolean;
  count: number;
  // What repeats: «toutes les 15 minutes». Empty for positions.
  head: string;
  headCount: number;
  // How it is said under every hour.
  phrase: string;
  // The minutes excepted from it.
  removed: number[];
  // The stretches it sweeps inside an hour; none for positions.
  runs: Span[];
  // Its first and its last moment in an hour.
  span: Span;
  // Minutes that fire after its stretches.
  strays: Tick[];
  // Its moments, when they are few enough to be clock times.
  ticks: Tick[];
}

/** A way to say a beat hour by hour. */
interface HourlyForm {
  clock: boolean;
  count(stretches: RangeDescription[]): number;
  item(stretches: RangeDescription[]): string;
  lead: string;
  // Whether hours in a row are one stretch.
  merged: boolean;
}

const still = {
  consumed: false,
  continuous: false,
  head: '',
  headCount: 0,
  removed: [] as number[],
  runs: [] as Span[],
  strays: [] as Tick[],
  ticks: [] as Tick[]
};

function tick(c: Context, minute: number): Tick {
  return {minute, second: c.offset};
}

function at(c: Context, hour: number, moment: Tick): string {
  return written({hour, ...moment}, c.style);
}

// A window names its first and its last moment, and both fire.
function between(c: Context, hours: RangeDescription, span: Span): string {
  return phrase(w.from, at(c, hours.from, span[0]),
    w.to, at(c, hours.to, span[1]));
}

function windows(
  c: Context,
  stretches: RangeDescription[],
  spans: Span[]
): string[] {
  return stretches.flatMap(function eachStretch(hours) {
    return spans.map((span) => between(c, hours, span));
  });
}

// On the spoken clock «à» is repeated before every time, so that a part
// of the day is not heard with the time before it.
function clockList(c: Context, times: string[]): string {
  return c.style.hour12 ?
    conjoin(times.map(led(w.at))) :
    series(times, led(w.at));
}

// Minutes as a clock shows them: «à 05, 20 et 45 de chaque heure».
function positions(minutes: number[]): string {
  return phrase(series(minutes.map(twoDigits), led(w.at)), w.ofEachHour);
}

// A count of minutes at one end of the hour.
function edge(count: number, which: string): string {
  return phrase(w.during, w.thePlural, String(count), which,
    units.minute.many, w.ofEachHour);
}

// Where a run of minutes lies in every hour.
function stretch(run: RangeDescription): string {
  if (run.from === 0) {
    return edge(run.to + 1, w.first);
  }

  if (run.to === 59) {
    return edge(60 - run.from, w.last);
  }

  return phrase(w.from, twoDigits(run.from), w.to, twoDigits(run.to),
    w.ofEachHour);
}

// Minutes named one by one. Minute 0 alone is the hour itself.
function listBeat(c: Context, minutes: number[]): Beat {
  const ticks = minutes.map((minute) => tick(c, minute));
  const onTheHour = minutes.length === 1 && minutes[0] === 0;

  return {
    ...still,
    count: minutes.length,
    phrase: onTheHour ? every(1, units.hour) : positions(minutes),
    span: [ticks[0], ticks[ticks.length - 1]],
    ticks
  };
}

// A cadence that fills the hour. When it is every minute and the seconds
// fill the minute too, the seconds are what repeats, and a window closes
// on the last second that fires.
function fillingBeat(c: Context, interval: number, removed: number[]): Beat {
  const fine = c.sweep > 0 && interval === 1;
  const [unit, step, last] = fine ?
    [units.second, c.sweep, {minute: 59, second: 60 - c.sweep}] as const :
    [units.minute, interval, tick(c, 60 - interval)] as const;
  const span: Span = [tick(c, 0), last];

  return {
    ...still,
    consumed: fine,
    continuous: true,
    count: Number(step > 1),
    head: every(step, unit),
    headCount: Number(step > 1),
    phrase: every(step, unit),
    removed,
    runs: [span],
    span
  };
}

// A run of minutes. Under every hour, a run from the top of the hour with
// every second is said in seconds.
function runBeat(c: Context, run: RangeDescription): Beat {
  const fine = c.sweep === 1 && c.hours.all && run.from === 0;
  const head = every(1, fine ? units.second : units.minute);
  const span: Span = [tick(c, run.from), tick(c, run.to)];

  return {
    ...still,
    consumed: fine,
    count: 2,
    head,
    phrase: phrase(head, stretch(run)),
    runs: [span],
    span
  };
}

// A cadence that does not fill the hour: a list while it can be held,
// and both ends beyond that. Inside a named hour it is a window as soon
// as it is more than four clock times.
function cadenceBeat(c: Context, cadence: Cadence): Beat {
  const minutes = denote(cadence, c.minutes.domain);
  const listed = listBeat(c, minutes);
  const head = every(cadence.interval, units.minute);
  const [count, text] = minutes.length > 6 ?
    [3, phrase(head, w.from, twoDigits(cadence.start), w.to,
      twoDigits(cadence.last), w.ofEachHour)] as const :
    [listed.count, listed.phrase] as const;

  return {
    ...listed,
    count,
    head,
    headCount: 1,
    phrase: text,
    runs: [listed.span].filter(() => minutes.length > 4)
  };
}

// Minutes as parts joined in a list, each with its own lead and no word
// borrowed: a cadence or a run with both its ends, a single minute after
// «à». Only parts that are all runs are stretches an hour can show as
// windows.
function joinedBeat(c: Context, parts: Stretch[]): Beat {
  const {values} = c.minutes;

  function ends(from: number, to: number): string {
    return phrase(w.from, twoDigits(from), w.to, twoDigits(to));
  }

  return {
    ...still,
    count: partsCount({parts}),
    head: every(1, units.minute),
    phrase: phrase(conjoin(parts.flatMap((part) => say(part, {
      cadence: (cadence) => [phrase(every(cadence.interval, units.minute),
        ends(cadence.start, cadence.last))],
      range: (run) =>
        [phrase(every(1, units.minute), ends(run.from, run.to))],
      values: (strays) =>
        strays.values.map((minute) => phrase(w.at, twoDigits(minute)))
    }, []))), w.ofEachHour),
    runs: parts.filter(isRange).map(function toSpan(minutes): Span {
      return [tick(c, minutes.from), tick(c, minutes.to)];
    }).filter(() => parts.every(isRange)),
    span: [tick(c, values[0]), tick(c, values[values.length - 1])]
  };
}

// Minutes in pieces. Two shapes have their own words: a run with stray
// minutes after it, and a run that wraps round the hour, which is the
// first minutes of the hour and the last. Any other pieces are joined as
// a list is, each with its own lead, and no piece borrows a word.
function piecesBeat(c: Context, pieces: Of<'pieces'>): Beat {
  const [run, second] = pieces.parts as [RangeDescription, Part];
  const head = every(1, units.minute);
  const start: Span = [tick(c, run.from), tick(c, run.to)];
  const {values} = c.minutes;
  const whole: Span = [tick(c, values[0]), tick(c, values[values.length - 1])];
  const declared = pieces.parts.length === 2 && isRange(run) &&
    (!isRange(second) || run.from === 0 && second.to === 59);

  if (!declared) {
    return joinedBeat(c, pieces.parts);
  }

  return say<Beat>(second, {
    range: (end) => ({
      ...still,
      count: 4,
      head,
      phrase: phrase(head, w.during, w.thePlural, String(run.to + 1),
        w.first, w.and, w.thePlural, String(60 - end.from), w.last,
        units.minute.many, w.ofEachHour),
      runs: [start, [tick(c, end.from), tick(c, end.to)]],
      span: whole
    }),
    values: (strays) => ({
      ...still,
      count: 2 + strays.values.length,
      head,
      phrase: `${phrase(head, stretch(run))}, ` +
        phrase(w.then, series(strays.values.map(twoDigits), led(w.at))),
      runs: [start],
      span: whole,
      strays: strays.values.map((minute) => tick(c, minute))
    })
  });
}

// The interval of a base that fills the cycle of sixty: 1 for every
// value, N for a cadence from 0 that divides it, and 0 for any other.
function fills(base: Excepted['base']): number {
  return say(base, {
    all: () => 1,
    cadence: (cadence) => cadence.interval *
      Number(cadence.start === 0 && cadence.last + cadence.interval === 60)
  }, 0);
}

// The things each description of the minutes names. An exception is said
// only of minutes that fill the hour, only when it replaces a list too
// long to hold, and only when nothing follows it: no clause of seconds
// and no offset. Beside hours that are not every hour a window names the
// first and the last minute, so neither may be the one excepted.
function minuteCounts(c: Context): Counts {
  const quiet = c.seconds.values.length === 1 &&
    (c.offset === 0 || !c.hours.all);
  const long = c.minutes.values.length > 6 || !c.hours.all;

  return {
    cadence: () => 3,
    cadencePieces: partsCount,
    except(excepted) {
      const interval = fills(excepted.base);
      const sayable = c.bare && long && interval > 0 && interior(excepted) &&
        (c.hours.all || keepsEnds(excepted, c.minutes.domain)) &&
        (quiet || c.sweep > 0 && interval === 1);

      return when(sayable, Number(interval > 1) + excepted.removed.length);
    },
    pieces: partsCount,
    range: (run) => when(run.to - run.from > 1, 2),
    values: (listed) => listed.values.length
  };
}

// The things the seconds after the first name, said as a clause.
const restCounts: Counts = {
  all: () => 1,
  cadence: (cadence) => when(members(cadence) > 2, 1),
  cadencePieces: partsCount,
  pieces: partsCount,
  range: (run) => when(run.to - run.from > 1, 1),
  values: (listed) => listed.values.length - 1
};

// Under one clock time, runs of seconds are windows to the second, and
// there is no other way to say them.
function secondsBeat(c: Context, ranges: RangeDescription[]): Beat {
  const [minute] = c.minutes.values;
  const runs = ranges.map(function toSpan(run): Span {
    return [{minute, second: run.from}, {minute, second: run.to}];
  });

  return {
    ...still,
    consumed: true,
    count: Infinity,
    head: every(1, units.second),
    phrase: '',
    runs,
    span: [runs[0][0], runs[runs.length - 1][1]]
  };
}

function beatOf(c: Context): Beat {
  const rest = choose(c.seconds, restCounts);
  const windowed = c.once && say(rest, {
    pieces: (pieces) => pieces.parts.every(isRange),
    range: (run) => run.from > 0
  }, false);
  const filling = tiling(c.minutes);

  if (windowed) {
    return secondsBeat(c, stretchesOf(rest, singles));
  }

  if (filling) {
    return fillingBeat(c, filling, []);
  }

  return say<Beat>(choose(c.minutes, minuteCounts(c)), {
    cadence: (cadence) => cadenceBeat(c, cadence),
    cadencePieces: (pieces) => joinedBeat(c, pieces.parts),
    except: (excepted) =>
      fillingBeat(c, fills(excepted.base), excepted.removed),
    pieces: (pieces) => piecesBeat(c, pieces),
    range: (run) => runBeat(c, run),
    values: (listed) => listBeat(c, listed.values)
  });
}

// One minute under hours that are not all single: «toutes les heures de
// 9 h 30 à 17 h 30 et à 22 h 30». What repeats is said once, before the
// first stretch. Hours named one by one are a list of clock times.
function hourPieces(
  c: Context,
  beat: Beat,
  stretches: RangeDescription[],
  interval: number
): Said {
  const [moment] = beat.ticks;
  const firstRun = stretches.findIndex((hours) => !isSingle(hours));
  const items = stretches.map(function item(hours, index) {
    return isSingle(hours) ?
      phrase(w.at, at(c, hours.from, moment)) :
      phrase(given(index === firstRun, every(interval, units.hour)),
        between(c, hours, beat.span));
  });
  const times = stretches.map((hours) => at(c, hours.from, moment));

  return {
    clock: isSingle(stretches[0]),
    count: Number(interval > 1) + stretches.length +
      stretches.filter(isRun).length,
    text: firstRun < 0 ? clockList(c, times) : conjoin(items)
  };
}

// One minute under hours that are runs and cadences together: each part
// whole, with what repeats in it and both its ends.
function hourParts(c: Context, beat: Beat, parts: Stretch[]): Said {
  function swept(interval: number, from: number, to: number): string {
    return phrase(every(interval, units.hour),
      between(c, {from, kind: 'range', to}, beat.span));
  }

  return {
    clock: parts[0].kind === 'values',
    count: partsCount({parts}),
    text: conjoin(parts.flatMap((part) => say(part, {
      cadence: (cadence) =>
        [swept(cadence.interval, cadence.start, cadence.last)],
      range: (run) => [swept(1, run.from, run.to)],
      values: (listed) => listed.values.map(
        (hour) => phrase(w.at, at(c, hour, beat.span[0])))
    }, [])))
  };
}

// How a beat of more than one minute may be said hour by hour, the first
// way first: its stretches as windows; its minutes as clock times; and
// its own phrase with a window from its first moment to its last.
function hourlyForms(
  c: Context,
  beat: Beat,
  hours: {apart: boolean; count: number; limit: number}
): HourlyForm[] {
  const swept = beat.continuous || hours.apart && beat.runs.length > 0 &&
    (beat.strays.length === 0 || hours.count === 1);
  const listed = hours.apart && beat.ticks.length > 0 &&
    hours.count * beat.ticks.length <= hours.limit;
  const forms: Array<[boolean, HourlyForm]> = [
    [swept, {
      clock: false,
      count: (stretches) => beat.headCount + beat.strays.length +
        2 * stretches.length * beat.runs.length,
      item: (stretches) => conjoin(windows(c, stretches, beat.runs)) +
        after(`, ${w.then} `, clockList(c,
          beat.strays.map((stray) => at(c, stretches[0].from, stray)))),
      lead: `${beat.head} `,
      merged: beat.continuous
    }],
    [listed, {
      clock: true,
      count: (stretches) => stretches.length * beat.ticks.length,
      item: (stretches) => clockList(c, stretches.flatMap(
        (hour) => beat.ticks.map((moment) => at(c, hour.from, moment)))),
      lead: '',
      merged: false
    }],
    [true, {
      clock: false,
      count: (stretches) => beat.count + 2 * stretches.length,
      item: (stretches) => conjoin(windows(c, stretches, [beat.span])),
      lead: `${beat.phrase}, `,
      merged: true
    }]
  ];

  return forms.filter((form) => form[0]).map((form) => form[1]);
}

// Hours that are values, a range or pieces. With one minute, two hours in
// a row are two times. With more, the first way that can be said is said,
// unless that is a window for each stretch of minutes in each hour and
// the minute phrase with one window for each run of hours names fewer
// things.
function onStretches(
  c: Context,
  beat: Beat,
  description: Of<'pieces' | 'range' | 'values'>
): Said {
  const apart = stretchesOf(description, singles);

  if (beat.ticks.length === 1) {
    return hourPieces(c, beat, apart.flatMap(function listed(hours) {
      return lengthOf(hours, c.hours.domain) === 2 ?
        singles([hours.from, hours.to]) :
        [hours];
    }), 1);
  }

  const runs = stretchesOf(description, runsOf);
  const [first, ...others] = hourlyForms(c, beat,
    {apart: apart.every(isSingle), count: apart.length, limit: 12})
    .map(function said(form): Said {
      const stretches = form.merged ? runs : apart;

      return {
        clock: form.clock,
        count: form.count(stretches),
        text: form.lead + form.item(stretches)
      };
    });

  return others.reduce(function fewer(best, phrased) {
    return !best.clock && phrased.count < best.count ? phrased : best;
  }, first);
}

// Several minutes under hours that are cadences, runs and single hours
// together. A cadence shows its first two hours and says how the rest go
// on, to the last time that fires; each part after the first follows
// «puis». Of the ways to say an hour, the one that names the fewest
// things over the hours shown is said, the earlier on a tie.
function onParts(c: Context, beat: Beat, parts: Stretch[]): Said {
  const {domain} = c.hours;

  function hoursOf(part: Stretch, merged: boolean): RangeDescription[] {
    return say(part, {
      cadence: (cadence) => singles(denote(cadence, domain)).slice(0, 2),
      range(run) {
        return merged ? [run] : singles(denote(run, domain));
      },
      values: (listed) => singles(listed.values)
    }, []);
  }

  function shownCount(form: HourlyForm): number {
    return form.count(parts.flatMap((part) => hoursOf(part, form.merged)));
  }

  const form = hourlyForms(c, beat,
    {apart: true, count: c.hours.values.length, limit: Infinity})
    .reduce(function fewer(best, other) {
      return shownCount(other) < shownCount(best) ? other : best;
    });

  function onward(cadence: Cadence): string {
    return phrase(w.andSoOn, every(cadence.interval, units.hour),
      w.until, at(c, cadence.last, beat.span[1]));
  }

  return {
    clock: form.clock,
    count: partsCount({parts}),
    text: form.lead + parts.map((part) => [
      ...hoursOf(part, form.merged).map((hour) => form.item([hour])),
      ...say(part, {cadence: (cadence) => [onward(cadence)]}, [])
    ].join(', ')).join(`, ${w.then} `)
  };
}

// Hours on a cadence too long to list. One minute is the cadence with
// both ends. Anything more shows the first two hours and says how the
// rest go on.
function onCadence(c: Context, beat: Beat, cadence: Cadence): Said {
  return beat.ticks.length === 1 ?
    hourPieces(c, beat,
      [{from: cadence.start, kind: 'range', to: cadence.last}],
      cadence.interval) :
    onParts(c, beat, [cadence]);
}

// Whether hours may be said as a simpler set «sauf» some: only when
// nothing follows the time part, when the exception replaces more than
// four times, and never after a part that names no time when an offset
// of seconds has to follow it.
function excepts(c: Context, beat: Beat, excepted: Excepted): boolean {
  const quiet = c.seconds.values.length === 1 &&
    (c.offset === 0 || excepted.base.kind !== 'all');

  return c.bare && c.hours.values.length > 4 && interior(excepted) &&
    (beat.consumed || quiet);
}

// A cadence of hours with a hole, where no exception may be said: the
// stretches of the cadence each side of the hole.
function splits(c: Context, beat: Beat, excepted: Excepted): boolean {
  return !excepts(c, beat, excepted) &&
    excepted.base.kind === 'cadence' && interior(excepted);
}

/** When each of the hours' own devices may be said. */
interface HourRules {
  excepted(description: Excepted): boolean;
  // Whether one minute fires in each hour.
  single: boolean;
  split(description: Excepted): boolean;
}

function hourCounts(c: Context, rules: HourRules): Counts {
  const counts: Counts = {
    all: () => 0,
    cadence: (cadence) => when(members(cadence) > 4, 3),
    // Hours on a cadence are said as one only when there are more than
    // four, among other parts too.
    cadencePieces: (pieces) => when(
      pieces.parts.every((part) => say(part, {
        cadence: (cadence) => members(cadence) > 4
      }, true)),
      partsCount(pieces)),
    // Each side of a hole: with one minute the interval once and each
    // stretch's two ends, otherwise each stretch as a cadence of its own.
    except(description) {
      const left = around(description, c.hours.domain);
      const runs = left.filter(isRun).length;

      return Math.min(
        when(rules.excepted(description),
          countOf(description.base, counts) + description.removed.length),
        when(rules.split(description), left.length +
          (rules.single ? 1 + runs : 2 * runs)));
    },
    pieces: partsCount,
    range: () => 2,
    values: (listed) => listed.values.length
  };

  return counts;
}

/**
 * Whether the hours are every hour, with or without exceptions: the time
 * part then runs round the clock and says so. This reads the hours alone.
 */
function roundTheClock(c: Context): boolean {
  const hours = choose(c.hours, hourCounts(c, {
    excepted: (description) =>
      c.hours.values.length > 4 && interior(description),
    single: true,
    split: () => false
  }));

  return say(hours, {
    all: () => true,
    except: (description) => description.base.kind === 'all'
  }, false);
}

function excepting(c: Context, beat: Beat, excepted: Excepted): Said {
  const left = around(excepted, c.hours.domain);
  const {interval} = excepted.base as Cadence;

  // What is left each side of a hole, as a cadence or a single hour.
  function part(run: RangeDescription): Stretch {
    return isRun(run) ?
      {interval, kind: 'cadence', last: run.to, start: run.from} :
      {kind: 'values', values: [run.from]};
  }

  if (!excepts(c, beat, excepted)) {
    return beat.ticks.length === 1 ?
      hourPieces(c, beat, left, interval) :
      onParts(c, beat, left.map(part));
  }

  const base = say(excepted.base, hourForms(c, beat));
  const gone = beat.ticks.length === 1 ?
    clockList(c, excepted.removed.map((hour) => at(c, hour, beat.span[0]))) :
    conjoin(windows(c, runsOf(excepted.removed), [beat.span]));

  return {
    clock: base.clock,
    count: base.count + excepted.removed.length,
    excepted: true,
    text: `${base.text}, ${phrase(w.except, gone)}`
  };
}

function hourForms(c: Context, beat: Beat): Sayers<Said> {
  return {
    all: () => ({clock: false, count: beat.count, text: beat.phrase}),
    cadence: (cadence) => onCadence(c, beat, cadence),
    cadencePieces: (pieces) =>
      [onParts, hourParts][Number(beat.ticks.length === 1)](
        c, beat, pieces.parts),
    except: (excepted) => excepting(c, beat, excepted),
    pieces: (pieces) => onStretches(c, beat, pieces),
    range: (run) => onStretches(c, beat, run),
    values: (listed) => onStretches(c, beat, listed)
  };
}

// The minutes excepted from a beat, after everything else: clock times
// inside one named hour, positions in the hour otherwise. Under seconds
// that fill the minute, what is excepted is a whole minute.
function minuteException(c: Context, beat: Beat, said: Said): Said {
  const [hour] = c.hours.values;
  const where = c.hours.values.length === 1 ?
    clockList(c, beat.removed.map((minute) => at(c, hour, tick(c, minute)))) :
    positions(beat.removed);
  const text = phrase(given(said.excepted === true, w.and), w.except,
    given(beat.consumed, phrase(w.during, w.oneMinute)), where);

  return {
    ...said,
    count: said.count + beat.removed.length,
    text: said.text + after(', ', given(beat.removed.length > 0, text))
  };
}

// How long evenly spaced seconds go on: the interval times their number.
function lasting(seconds: number): string {
  return seconds === 60 ? w.oneMinute : counted(seconds, units.second);
}

// Evenly spaced seconds, and how long they go on: the interval times
// their number, or to the end of the minute when that would be longer
// than the minute they are in.
function evenly(interval: number, howMany: number): string {
  const span = interval * howMany;

  return phrase(every(interval, units.second),
    span > 60 ? w.untilMinuteEnd : phrase(w.during, lasting(span)));
}

/** Seconds at one interval: a run, a cadence, or a single second. */
interface Sweep {
  from: number;
  howMany: number;
  interval: number;
}

// Seconds in parts. The first part that sweeps says what repeats, and so
// does a later one that sweeps at another interval; any other part only
// how long it lasts, and a single second only how much later it comes.
// The first second of all is the time itself. Once a part has swept,
// «plus tard» could be counted from its end, so what follows is counted
// «après le début». A single second after a run is «une fois», so that
// it is not taken for another run.
function sweeping(c: Context, parts: Stretch[]): string {
  const sweeps = parts.flatMap((part) => say<Sweep[]>(part, {
    cadence: (cadence) => [{
      from: cadence.start,
      howMany: members(cadence),
      interval: cadence.interval
    }],
    range: (run) =>
      [{from: run.from, howMany: run.to - run.from + 1, interval: 1}],
    values: (listed) => listed.values.map(
      (second) => ({from: second, howMany: 1, interval: 1}))
  }, []));
  const first = sweeps.findIndex((sweep) => sweep.howMany > 1);

  return sweeps.map(function item(sweep, index) {
    const begun = index > first && first >= 0;
    const single = begun && sweep.howMany === 1;
    const later = given(index > 0, phrase(single ? w.once : w.again,
      counted(sweep.from - c.offset, units.second),
      begun ? w.afterStart : w.later));
    const named = sweep.howMany > 1 &&
      (index === first || sweep.interval !== sweeps[first].interval);
    const lasts = given(sweep.howMany > 1,
      phrase(w.during, lasting(sweep.interval * sweep.howMany)));
    const said = named ?
      phrase(given(index > 0, w.thisTime),
        evenly(sweep.interval, sweep.howMany)) :
      lasts;

    return [later, said].filter(Boolean).join(given(named, ',') + ' ');
  }).filter(Boolean).map(function joined(item, index) {
    return phrase(given(index > 0, w.then), item);
  }).join(', ');
}

// What the seconds after the first do: a cadence and how long it lasts,
// or how much later than the first the others come.
function restSayers(c: Context): Sayers<string> {
  return {
    all: () => evenly(1, 60),
    cadence: (cadence) => evenly(cadence.interval, members(cadence)),
    cadencePieces: (pieces) => sweeping(c, pieces.parts),
    pieces: (pieces) => sweeping(c, pieces.parts),
    range: (run) => evenly(1, run.to - run.from + 1),
    values: (listed) => phrase(w.again, tally(
      listed.values.slice(1).map((second) => second - c.offset),
      units.second), w.later)
  };
}

// Every time the pattern fires at, when there are few enough to list.
function allTimes(c: Context): Said {
  const count = c.hours.values.length * c.minutes.values.length *
    c.seconds.values.length;
  const sayable = !c.hours.all && !c.minutes.all && !c.seconds.all &&
    count <= 24;
  const times = c.hours.values.slice(0, Number(sayable) * 24).flatMap(
    (hour) => c.minutes.values.flatMap(
      (minute) => c.seconds.values.map(
        (second) => at(c, hour, {minute, second}))));

  return {clock: true, count: when(sayable, count), text: clockList(c, times)};
}

// The time part of a pattern that names a minute or an hour.
function clockPart(c: Context): Said {
  const beat = beatOf(c);
  const hours = choose(c.hours, hourCounts(c, {
    excepted: (description) => excepts(c, beat, description),
    single: beat.ticks.length === 1,
    split: (description) => splits(c, beat, description)
  }));
  const said = minuteException(c, beat, say(hours, hourForms(c, beat)));
  const rest = choose(c.seconds, restCounts);
  const more = !beat.consumed && c.seconds.values.length > 1;
  const late = given(!beat.consumed && c.offset > 0 && hours.kind === 'all',
    phrase(w.with, counted(c.offset, units.second), w.late));
  const again = given(more,
    phrase(given(!c.once, w.andEachTime), say(rest, restSayers(c))));
  const full = {
    clock: said.clock,
    count: said.count + Number(more) * countOf(rest, restCounts),
    text: said.text + after(', ', late) + after(', ', again)
  };
  const list = allTimes(c);

  return list.count <= full.count ? list : full;
}

function fromStart(numbers: number[]): string {
  return phrase(tally(numbers, units.second), w.afterEachMinuteStart);
}

function spanned(from: number, to: number): string {
  return phrase(w.from, String(from), w.to, String(to));
}

// Seconds with every minute of every hour: the seconds are the time part,
// placed from the start of the minute.
function secondsAlone(c: Context): Said {
  const description = choose(c.seconds, {
    cadence: (cadence) => when(members(cadence) > 6, 3),
    cadencePieces: partsCount,
    except: (excepted) => when(
      c.bare && c.seconds.values.length > 6 && fills(excepted.base) > 0 &&
      interior(excepted) && keepsEnds(excepted, c.seconds.domain),
      Number(fills(excepted.base) > 1) + excepted.removed.length),
    pieces: partsCount,
    range: (run) => when(run.to - run.from > 1, 2),
    values: (listed) => listed.values.length
  });
  const each = every(1, units.second);

  // A run from the top of the minute is its first seconds.
  function opening(run: RangeDescription): string {
    return run.from === 0 ?
      phrase(each, w.during, w.thePlural, String(run.to + 1), w.first,
        units.second.many, w.ofEachMinute) :
      phrase(each, w.from, String(run.from), w.to, fromStart([run.to]));
  }

  // Runs share «toutes les secondes» while nothing but runs is said; a
  // single second or a cadence among them makes each part take its own.
  function several(pieces: {parts: Stretch[]}): string {
    const shared = pieces.parts.every(isRange);

    return phrase(conjoin(pieces.parts.flatMap((part, index) => say(part, {
      cadence: (cadence) => [phrase(every(cadence.interval, units.second),
        spanned(cadence.start, cadence.last))],
      range: (run) => [phrase(given(index === 0 || !shared, each),
        spanned(run.from, run.to))],
      values: (listed) =>
        listed.values.map((second) => phrase(w.at, String(second)))
    }, []))), units.second.many, w.afterEachMinuteStart);
  }

  return {
    clock: false,
    count: 0,
    text: say(description, {
      cadence: (cadence) => phrase(every(cadence.interval, units.second),
        w.from, String(cadence.start), w.to, fromStart([cadence.last])),
      except: (excepted) =>
        `${every(fills(excepted.base), units.second)}, ` +
        phrase(w.except, fromStart(excepted.removed)),
      cadencePieces: several,
      pieces: several,
      range: opening,
      values: (listed) => fromStart(listed.values)
    })
  };
}

/**
 * The time part. With every minute of every hour, seconds that do not
 * fill the minute are placed from its start; otherwise the time is said
 * to the minute and the seconds are carried in it or follow it.
 */
function timePart(c: Context): Said {
  const secondsOnly = c.minutes.all && c.hours.all && c.sweep === 0 &&
    c.seconds.values.length + c.offset > 1;

  return secondsOnly ? secondsAlone(c) : clockPart(c);
}

export type {Said};
export {roundTheClock, timePart};
