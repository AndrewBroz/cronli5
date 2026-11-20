// The time part: seconds, minutes and hours said together, the stretch of
// the day first and what happens in it second.

import {denote} from '../../core/describe-set.js';
import type {
  CadencePieces, Domain, Field, Schedule, SetDescription
} from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import lexicon from './lexicon.js';
import type {Counting, Described, Sayable} from './sets.js';
import {
  boundedCadence, inSuccession, join, list, longerThan, restOf, runsOf,
  settle, settleUnwrapped, thingsNamed
} from './sets.js';
import type {Voice} from './voice.js';

const {units, words} = lexicon;

/** The time part, and what the parts before it need to know of it. */
export interface TimeSaid {
  // Whether it opens with a clock time («um 9:00 Uhr»).
  clock: boolean;
  // Whether the hours give the day a rhythm that «täglich» names.
  daily: boolean;
  // Whether it opens with a number of seconds («30 Sekunden nach …»).
  offset: boolean;
  text: string;
}

interface Unit {
  many: string;
  one: string;
}

// A phrase, and the exceptions that follow the whole time part.
interface Said {
  excepts: string[];
  text: string;
}

// How the two ends of a stretch are written.
interface Spans {
  from(value: number): string;
  oClock: string;
  to(value: number): string;
}

// How one field of the clock says its set: its points, its stretches and
// the words that go with them.
interface Level {
  // Whether a window before the phrase already gives a stretch its ends.
  absorbed: boolean;
  // What happens at every value of a stretch: «jede Minute», «stündlich».
  each: string;
  // Values taken away from the set.
  gone(values: number[]): string;
  // Whether single values join the runs as runs of their own: «in den
  // Minuten 0 bis 29 und 45».
  folds: boolean;
  // What opens a phrase that has ends or points of its own.
  lead: string;
  // Whether every value, and a cadence that tiles, need no ends.
  open: boolean;
  // Single values: «um 9:05 und 9:20 Uhr», «zu den Minuten 5 und 20».
  points(values: number[]): string;
  // Unbroken runs, each by its first and last value.
  runs(runs: number[][]): string;
  tiling: boolean;
  top: number;
  unit: Unit;
  // Every value of the field, where that needs no ends.
  whole: string;
}

// Everything the time part is built from.
interface Clockwork {
  H: number[];
  M: number[];
  S: number[];
  // The second a point carries, if the pattern has one second.
  carry: number[];
  // One minute and one second under every hour: one count from the full
  // hour, «5 Minuten und 30 Sekunden nach jeder vollen Stunde».
  counted: boolean;
  // The minute and second of the last moment of an hour, and the first.
  high: number[];
  hours: Sayable;
  // Whether the seconds take the place of «jede Minute».
  leads: boolean;
  // The hours as points, for a time part that names them as hours.
  hourPoints: Sayable;
  // Each field's candidates with nothing wrapped.
  linear: {[field in 'hour' | 'minute' | 'second']: SetDescription[]};
  // Whether the time part is a list of clock times.
  listed: boolean;
  // The seconds said with every full hour: a few after it, or none.
  onTheHour: number[];
  low: number[];
  minutes: Sayable;
  // Whether the seconds need no words of their own.
  quiet: boolean;
  // The hours, where they are a cadence that comes round the day.
  round: Round[];
  seconds: Sayable;
  voice: Voice;
}

// A cadence of hours that comes round the day.
interface Round {
  interval: number;
  start: number;
}

interface Wording {
  after: string;
  at: string;
}

const sixty: Domain = {cyclic: false, max: 59, min: 0};
const hoursOfDay: Domain = {cyclic: false, max: 23, min: 0};

// The most clock times a list holds, and the most minutes or seconds.
const held = 6;

// The most clock times a list holds before a cadence replaces it.
const heldBeforeCadence = 4;

const eachHour: Wording =
  {after: words.afterEachHour, at: words.atEachHour};
const eachMinute: Wording =
  {after: words.afterEachMinute, at: words.atEachMinute};
const theMinute: Wording =
  {after: words.afterTheMinute, at: words.atTheMinute};
const theHour: Wording =
  {after: words.afterTheHour, at: words.atTheHour};

// Whether a cadence starts at 0 and comes round to 0 again.
function tiles(cadence: Described<'cadence'>): boolean {
  return cadence.start === 0 && cadence.last + cadence.interval ===
    sixty.max + 1;
}

// Minutes named by their place in the hour, and seconds in the minute: a
// cadence that tiles is one thing, any other needs its ends.
const inTheHour: Counting = {
  cadence(cadence, count) {
    return tiles(cadence) ? 1 : longerThan(held)(cadence, count);
  },
  listed: held,
  removable: Infinity
};

// Minutes inside one named hour, and seconds inside one named minute, are
// clock times: every cadence has its ends.
const onTheClock: Counting = {
  cadence(cadence, count) {
    return tiles(cadence) || count > heldBeforeCadence ?
      boundedCadence :
      Infinity;
  },
  listed: held,
  removable: Infinity
};

const hoursAsPoints: Counting =
  {cadence: longerThan(heldBeforeCadence), listed: held, removable: Infinity};

// Every stretch of hours is a window, however few hours it has.
const hoursAsWindows: Counting = {...hoursAsPoints, listed: 0};

// Hours named as hours, the minutes said after them, are listed up to
// six: a cadence said with its ends would end on a clock time.
const hoursByNumber: Counting =
  {cadence: longerThan(held), listed: held, removable: Infinity};

function nonEmpty(values: unknown[]): boolean {
  return values.length > 0;
}

// Numbers with their unit: singular for the number 1 alone.
function amount(values: number[], unit: Unit): string {
  return `${list(values.map(String))} ` +
    `${values.join() === '1' ? unit.one : unit.many}`;
}

function every(interval: number, unit: Unit): string {
  return interval > 1 ?
    `${words.every} ${interval} ${unit.many}` :
    `${words.each} ${unit.one}`;
}

function stepOf(description: Sayable): number {
  return (description as Partial<Described<'cadence'>>).interval ?? 1;
}

// Seconds by their distance from the full minute (or hour). Second 0 is
// the full minute itself, and the others follow it.
function offset(seconds: number[], wording: Wording): string {
  const later = seconds.filter(function isLater(second) {
    return second > 0;
  });

  return seconds[0] === 0 ?
    join([wording.at, later.length > 0 && `${words.also} ` +
      `${amount(later, units.second)} ${words.afterThat}`]) :
    `${amount(seconds, units.second)} ${wording.after}`;
}

function exceptTail(excepts: string[], voice: Voice): string {
  return excepts.length > 0 ?
    `, ${voice.except} ${excepts.join(` ${words.and} `)}` :
    '';
}

function atTimes(times: string[], oClock: string): string {
  return `${words.at} ${list(times)}${oClock}`;
}

function span(ends: number[], spans: Spans): string {
  return `${words.from} ${spans.from(ends[0])} ${words.to} ` +
    `${spans.to(ends[1])}`;
}

// A window for each run, «Uhr» after the last.
function spansOf(runs: number[][], spans: Spans): string {
  return list(runs.map(function toSpan(run) {
    return span(run, spans);
  })) + spans.oClock;
}

// A window for each unbroken run of the values.
function windows(values: number[], spans: Spans): string {
  return spansOf(runsOf(values), spans);
}

// Minutes by their number in the hour, as timetables give them: «zur
// Minute 30», «zu den Minuten 5, 20 und 45».
function minutePoints(minutes: number[]): string {
  return `${[words.atMinutes, words.atMinute][Number(minutes.length === 1)]}` +
    ` ${list(minutes.map(String))}`;
}

// Minutes or hours by their numbers: one word for a single one, another
// for several or for a run.
function byNumber(several: string, one: string, items: string[]): string {
  const single = items.length === 1 && !items[0].includes(words.to);

  return `${[several, one][Number(single)]} ${list(items)}`;
}

// Runs of minutes by their numbers, each a stretch that fills its minutes:
// «in der Minute 29», «in den Minuten 0 bis 29», «in den Minuten 0 bis 2
// und 57 bis 59».
function minuteRuns(runs: number[][]): string {
  return byNumber(words.inMinutes, words.inMinute,
    runs.map(function say(run) {
      return [...new Set(run)].join(` ${words.to} `);
    }));
}

// A level that says its values as clock times.
function onClock(spans: Spans, point: (value: number) => string) {
  return {
    points(values: number[]) {
      return atTimes(values.map(point), spans.oClock);
    },
    runs(runs: number[][]) {
      return spansOf(runs, spans);
    }
  };
}

// A stretch with what happens in it; bare where its ends go unsaid.
function stretch(
  ends: number[],
  what: string,
  bare: boolean,
  level: Level
): string {
  return bare || level.absorbed ?
    what :
    `${level.lead}${level.runs([ends])} ${what}`;
}

const shapes: {
  [Kind in Exclude<Sayable['kind'], 'except'>]:
  (description: Extract<Sayable, {kind: Kind}>, level: Level) => string
} = {
  all(_all, level) {
    return stretch([0, level.top], level.whole, level.open, level);
  },
  cadence(cadence, level) {
    return stretch([cadence.start, cadence.last],
      every(cadence.interval, level.unit), level.open && level.tiling &&
      tiles(cadence), level);
  },
  // Each stretch with what happens in it, and single points after them.
  cadencePieces(pieces, level) {
    const stretches = pieces.parts.flatMap(function stretchOf(part) {
      const {interval, last, start, from = start, to = last} =
        part as Partial<Described<'cadence'> & Described<'range'>>;

      return part.kind === 'values' ? [] : [
        `${level.runs([[from as number, to as number]])} ` +
        `${interval ? every(interval, level.unit) : level.each}`
      ];
    });
    const strays = pieces.parts.flatMap(function straysOf(part) {
      return (part as Described<'values'>).values ?? [];
    });

    return join([level.lead + list(stretches),
      strays.length > 0 && `${words.also} ${level.points(strays)}`]);
  },
  // The runs share what happens in them, and single points follow, or
  // join them where the level folds them in.
  pieces(pieces, level) {
    const runs = pieces.parts.flatMap(function runOf(part) {
      return part.kind === 'range' ? [[part.from, part.to]] : [];
    });
    const strays = pieces.parts.flatMap(function straysOf(part) {
      return (part as Described<'values'>).values ?? [];
    });
    const folded = strays.filter(function folds() {
      return level.folds;
    }).map(function single(value) {
      return [value, value];
    });

    return join([`${level.lead}${level.runs([...runs, ...folded].sort(
      function ascending(a, b) {
        return a[0] - b[0];
      }))} ${level.each}`,
    !level.folds && strays.length > 0 &&
      `${words.also} ${level.points(strays)}`]);
  },
  range(range, level) {
    return stretch([range.from, range.to], level.each, false, level);
  },
  values(values, level) {
    return level.lead + level.points(values.values);
  }
};

// A set of one field's values, said at its level.
function spread(description: Sayable, level: Level): Said {
  const {base, removed} = restOf(description);

  return {
    excepts: [removed].filter(nonEmpty).map(level.gone),
    text: shapes[base.kind as 'all'](base as never, level)
  };
}

// Every hour at one minute: the full hour and its seconds, one count of a
// minute and a second from it, or the minute as a place in the hour.
function wholeHour(work: Clockwork): string {
  const {M, S, counted} = work;

  return M[0] === 0 ?
    offset(work.onTheHour, eachHour) :
    [`${words.hourly} ${minutePoints(M)}`,
      `${amount(M, units.minute)} ${words.and} ${amount(S, units.second)} ` +
      words.afterEachHour][Number(counted)];
}

// The hours as points: each at the pattern's one minute, or, where the
// minutes are said after them, as hours alone («um 9 und 17 Uhr»).
function hourLevel(work: Clockwork, rest: number[]): Level {
  const {voice} = work;

  function at(hour: number): string {
    return voice.clock(hour, rest);
  }

  const clock = onClock({from: at, oClock: voice.oClock, to: at}, at);

  return {
    absorbed: false,
    each: words.hourly,
    folds: false,
    gone: clock.points,
    lead: '',
    open: true,
    ...clock,
    tiling: false,
    top: hoursOfDay.max,
    unit: units.hour,
    whole: wholeHour(work)
  };
}

// Whether no window of hours holds a second hour.
function standApart(hours: Sayable): boolean {
  const {base} = restOf(hours);

  return base.kind !== 'all' &&
    runsOf(denote(base, hoursOfDay)).every(function single(run) {
      return run[0] === run[1];
    });
}

// Minutes taken away: the minutes themselves, or, where the seconds fill
// each minute, the stretches they leave out.
function goneFrom(said: Pick<Level, 'points' | 'runs'>, leads: boolean) {
  return function gone(minutes: number[]): string {
    return leads ? said.runs(runsOf(minutes)) : said.points(minutes);
  };
}

// The minutes by their number in the hour. Where the seconds fill each
// minute, a minute is a stretch: «in den Minuten 5 und 20 jede Sekunde».
function placesInTheHour(work: Clockwork, each: string) {
  const places = {points: minutePoints, runs: minuteRuns};

  function filled(minutes: number[]): string {
    return `${minuteRuns(minutes.map(function single(minute) {
      return [minute, minute];
    }))} ${each}`;
  }

  return {
    gone: goneFrom(places, work.leads),
    points: work.leads ? filled : minutePoints,
    runs: minuteRuns
  };
}

// The minutes: clock times inside one named hour, and otherwise their
// number in the hour.
function minuteLevel(work: Clockwork, each: string): Level {
  const {H, carry, high, hours, low, voice} = work;
  const named = H.length === 1;
  const apart = standApart(hours);
  const lead = apart ? words.eachTime : words.hourly;

  function clockTime(rest: number[]): string {
    return voice.clock(H[0], rest);
  }

  const clock = onClock({
    from(minute) {
      return clockTime([minute, ...low.slice(1)]);
    },
    oClock: voice.oClock,
    to(minute) {
      return clockTime([minute, ...high.slice(1)]);
    }
  }, function point(minute) {
    return clockTime([minute, ...carry]);
  });
  const said = named ?
    {...clock, gone: goneFrom(clock, work.leads), lead: ''} :
    {...placesInTheHour(work, each), lead: `${lead} `};

  return {
    absorbed: apart && !named,
    each,
    folds: !named,
    open: !named,
    ...said,
    tiling: true,
    top: sixty.max,
    unit: units.minute,
    whole: each
  };
}

// Whether the time part is a list of clock times: the list is said when
// it is short enough to hold and names no more than the windows would.
function isListed(
  H: number[],
  M: number[],
  hours: Sayable,
  minutes: Sayable
): boolean {
  const times = H.length * M.length;
  const explicit = ['pieces', 'range', 'values'].includes(hours.kind);
  const windowed = runsOf(H).length * 2 +
    thingsNamed(minutes, M.length, inTheHour);

  return M.length === 1 && hours.kind === 'values' ||
    H.length === 1 && minutes.kind === 'values' ||
    M.length > 1 && H.length > 1 && explicit && times <= held &&
    times <= windowed;
}

// The windows of a set of hours, without «Uhr»: one for each run.
function windowsOf(part: Sayable, spans: Spans): string {
  return list(runsOf(denote(part, hoursOfDay)).map(function toSpan(run) {
    return span(run, spans);
  }));
}

// Whether a part of the hours is a cadence too long to name each window
// of: it is said as one window and its step.
function stepped(part: Sayable): part is Described<'cadence'> {
  return part.kind === 'cadence' &&
    denote(part, hoursOfDay).length > heldBeforeCadence;
}

// The step of a cadence of hours whose minutes run through each hour:
// every second hour has a name, any other step is held for one hour;
// under other minutes the step alone.
function hourStep(cadence: Round, steadily: boolean): string {
  const step = every(cadence.interval, units.hour);

  return [step, `${step} ${words.oneHourLong}`, words.inEvenHours,
    words.inOddHours][Number(steadily) *
    (1 + Number(cadence.interval === 2) * (cadence.start % 2 + 1))];
}

// The minutes as said after the hours that hold them, with what leads
// them.
function minutesAfter(work: Clockwork, each: string, lead: string): string {
  return spread(work.minutes,
    {...minuteLevel(work, each), absorbed: false, lead}).text;
}

// The hours as stretches, each from its first moment to its last, with
// the minutes after them. A cadence of more than four hours is one window
// and its step, said as a cadence that comes round the day is: «von 8:00
// bis 18:45 Uhr in den geraden Stunden alle 15 Minuten». Runs and
// cadences together are said one after another, and where one of them
// is such a window the minutes follow all of them after «jeweils».
function hourStretches(
  work: Clockwork,
  base: Sayable,
  spans: Spans,
  each: string
): string {
  const parts = base.kind === 'cadencePieces' ? base.parts : [base];
  const steadily = steady(work.minutes);
  const stepping = Number(parts.some(stepped));
  const absorbed = spread(work.minutes, minuteLevel(work, each)).text;

  if (base.kind === 'all') {
    return absorbed;
  }

  const said = parts.map(function say(part) {
    return stepped(part) ?
      `${span([part.start, part.last], spans)}${spans.oClock} ` +
        hourStep(part, steadily) :
      windowsOf(part, spans) + ['', spans.oClock][stepping];
  }).join(` ${words.also} `) + [spans.oClock, ''][stepping];
  const glue = [' ', `, ${words.eachTime} `][
    stepping * Number(parts.length > 1)];

  return said + glue + [absorbed, minutesAfter(work, each, '')][stepping];
}

// The hours named as hours, with no minute of their own: their list; or,
// for a cadence too long to list, the window from the first time that
// fires to the last and the step in the place of «stündlich»: «von 2:05
// bis 20:45 Uhr alle 3 Stunden zu den Minuten 5, 20 und 45».
function hoursAlone(work: Clockwork, each: string, spans: Spans): string {
  const {base} = restOf(work.hourPoints);
  const hours = denote(base, hoursOfDay);

  return base.kind === 'cadence' ?
    `${span([base.start, base.last], spans)}${spans.oClock} ` +
      minutesAfter(work, each,
        `${every(base.interval, units.hour)} `) :
    `${hourLevel(work, []).points(hours)}, ` +
      spread(work.minutes, minuteLevel(work, each)).text;
}

// Whether the minutes are points or several parts, which windows round
// each hour would show as one stretch.
function dotted(work: Clockwork): boolean {
  return ['values', 'pieces', 'cadencePieces']
    .includes(restOf(work.minutes).base.kind);
}

// Whether the hours are named as hours and the minutes said once after
// them: the hours stand apart and the minutes are dotted.
function scattered(work: Clockwork): boolean {
  return work.H.length > 1 && standApart(work.hours) && dotted(work);
}

// Hours taken away from dotted minutes, each the whole hour it is: «in
// der Stunde 3».
function hoursGone(hours: number[]): string {
  return byNumber(words.inHours, words.inHour, hours.map(String));
}

// The hours of a cadence that comes round the day, from 0:00 bare and
// from a later start with that start: «alle 2 Stunden», «ab 1:00 Uhr alle
// 2 Stunden».
function cadenceOfHours(round: Round, voice: Voice): string {
  return join([round.start > 0 &&
    `${words.since} ${voice.clock(round.start, [0])}${voice.oClock}`,
  every(round.interval, units.hour)]);
}

// Whether the values of a set are every value, or a cadence that tiles.
function steady(description: Sayable): boolean {
  const {base} = restOf(description);

  return base.kind === 'all' || base.kind === 'cadence' && tiles(base);
}

// The hours of a schedule, where they are a cadence that comes round the
// day: its step divides the day, it has three hours or more, and it starts
// inside its first step. From a later start it holds more hours than a
// list of clock times does.
function roundTheDay(hours: Sayable): Round[] {
  const values = denote(restOf(hours).base, hoursOfDay);
  const [start, next] = values;
  const interval = next - start;
  const fewest = [2, heldBeforeCadence][Number(start > 0)];

  return [{interval, start}].filter(function comesRound() {
    return interval > 1 && values.length > fewest &&
      values.length * interval === hoursOfDay.max + 1 &&
      values.every(function inStep(hour, at) {
        return hour === start + at * interval;
      });
  });
}

// The time part where the hours come round the day. Minute 0 is the
// cadence alone. Minutes that run through each hour make the hours
// stretches: every second hour has a name, and any other step is held
// for one hour. Any other minutes are said as against every hour, with
// the cadence in the place of «stündlich». Hours taken away follow.
function roundTheClock(
  work: Clockwork,
  each: string,
  spans: Spans,
  round: Round
): Said {
  const {M, hours, minutes, voice} = work;
  const cadence = cadenceOfHours(round, voice);
  const stretched = [`${cadence} ${words.oneHourLong}`, words.inEvenHours,
    words.inOddHours][Number(round.interval === 2) * (round.start + 1)];
  const said = spread(minutes,
    {...minuteLevel(work, each), absorbed: false, lead: `${cadence} `});
  const gone = [restOf(hours).removed].filter(nonEmpty).map(
    function say(values) {
      return [windows(values, spans), hoursGone(values),
        hourLevel(work, [0]).points(values)][
        Number(dotted(work)) + Number(M.join() === '0')];
    });
  const text = [said.text, join([stretched, said.text]), cadence][
    Number(steady(minutes)) + 2 * Number(M.join() === '0')];

  return {excepts: [...gone, ...said.excepts], text};
}

// The clock times of a schedule that names them, hour by hour.
function clockTimes(work: Clockwork): number[][] {
  return work.H.flatMap(function inHour(hour) {
    return work.M.map(function atMinute(minute) {
      return [hour, minute];
    });
  });
}

// Minutes and hours together, before any seconds trail.
function minutesAndHours(work: Clockwork, each: string): Said {
  const {H, M, carry, hours, leads, listed, minutes, round, voice} = work;

  if (listed) {
    return {
      excepts: [],
      text: atTimes(clockTimes(work).map(function toTime(time) {
        return voice.clock(time[0], [time[1], ...carry]);
      }), voice.oClock)
    };
  }

  const spans: Spans = {
    from(hour) {
      return voice.clock(hour, work.low);
    },
    oClock: voice.oClock,
    to(hour) {
      return voice.clock(hour, work.high);
    }
  };

  if (round.length > 0) {
    return roundTheClock(work, each, spans, round[0]);
  }

  if (M.length === 1 && !leads) {
    return spread(hours, hourLevel(work, [M[0], ...carry]));
  }

  const said = spread(minutes, minuteLevel(work, each));

  if (H.length === 1) {
    return said;
  }

  const {base, removed} = restOf(scattered(work) ? work.hourPoints : hours);
  const gone = [removed].filter(nonEmpty).map(function say(values) {
    return dotted(work) ? hoursGone(values) : windows(values, spans);
  });

  return {
    excepts: [...gone, ...said.excepts],
    text: scattered(work) ?
      hoursAlone(work, each, spans) :
      hourStretches(work, base, spans, each)
  };
}

// Several seconds at a few clock times: every time to the second where
// that is a short list, and a window to the second for one time or two.
// Nothing where neither can be said.
function toTheSecond(work: Clockwork): Said | null {
  const {S, voice} = work;
  const times = clockTimes(work);
  const {base, removed} = restOf(settle(work.linear.second, onTheClock,
    beatOf(work.linear.second)));
  const reach = denote(base, sixty);

  function stamps(seconds: number[]): string[] {
    return times.flatMap(function eachTime(time) {
      return seconds.map(function eachSecond(second) {
        return voice.clock(time[0], [time[1], second]);
      });
    });
  }

  if (base.kind === 'values') {
    return times.length * S.length > held ?
      null :
      {excepts: [], text: atTimes(stamps(S), voice.oClock)};
  }

  if (times.length > 2 || base.kind === 'pieces') {
    return null;
  }

  return {
    excepts: [removed].filter(nonEmpty).map(function say(seconds) {
      return atTimes(stamps(seconds), voice.oClock);
    }),
    text: list(times.map(function toWindow(time) {
      return span([reach[0], reach[reach.length - 1]], {
        from(second) {
          return voice.clock(time[0], [time[1], second]);
        },
        oClock: '',
        to(second) {
          return voice.clock(time[0], [time[1], second]);
        }
      });
    })) + `${voice.oClock} ${every(stepOf(base), units.second)}`
  };
}

// A burst too long to list: how many times and how far apart, and its
// first second where that is not the full minute (or hour).
function burst(base: Sayable, wording: Wording): string {
  const seconds = denote(base, sixty);
  const start = seconds.slice(0, 1).filter(function isLater(second) {
    return second > 0;
  }).map(function say(second) {
    return `, ${words.first} ${offset([second], wording)}`;
  });

  return `${seconds.length}${words.times} ${words.apart} ` +
    `${amount([stepOf(base)], units.second)}${start.join('')}`;
}

// Seconds by their number in the minute: each run by its ends and each
// second between them, in ascending order. Runs and cadences together
// give each cadence of more than four seconds its own stretch and step,
// «in den Sekunden 0 bis 20 alle 2 Sekunden», and list the rest between.
function numbered(base: Sayable): string {
  const {parts = [base]} = base as Partial<CadencePieces>;
  const items = parts.flatMap(function split(part):
    Array<[number, string, boolean]> {
    const seconds = denote(part, sixty);

    if (part.kind === 'cadence' && seconds.length > boundedCadence + 1) {
      return [[part.start, `${part.start} ${words.to} ${part.last} ` +
        every(part.interval, units.second), true]];
    }

    return part.kind === 'range' ?
      [[part.from, `${part.from} ${words.to} ${part.to}`, false]] :
      seconds.map(function single(second): [number, string, boolean] {
        return [second, String(second), false];
      });
  }).sort(function ascending(a, b) {
    return a[0] - b[0];
  });
  const groups: string[][] = [[]];

  items.forEach(function place(item) {
    if (item[2]) {
      groups.push([item[1]], []);
    }
    else {
      groups[groups.length - 1].push(item[1]);
    }
  });

  return groups.filter(nonEmpty).map(function inSeconds(group) {
    return `${words.inSeconds} ${list(group)}`;
  }).join(` ${words.also} `);
}

const bursts: {
  [kind: string]: (base: never, wording: Wording) => string;
} = {
  all() {
    return `${words.oneMinuteLong} ${every(1, units.second)}`;
  },
  cadence: burst,
  cadencePieces: numbered,
  pieces: numbered,
  range: numbered,
  values(base, wording) {
    return offset(denote(base, sixty), wording);
  }
};

// The seconds that follow a time part said whole, counted from the full
// minute, or from the full hour where the minute is 0: «nach der vollen
// Minute» after a single minute could be heard as every minute.
function trailing(work: Clockwork) {
  const {M, S, seconds, voice} = work;
  const {base, removed} = restOf(seconds);
  const wording = [theMinute, theHour][Number(M.join() === '0')];

  return S.length > held ?
    bursts[base.kind](base as never, wording) + exceptTail(
      [removed].filter(nonEmpty).map(function say(gone) {
        return offset(gone, wording);
      }), voice) :
    offset(S, wording);
}

// Whether the seconds take the place of «jede Minute»: they run without
// a break, through every minute of a stretch, or through each minute named
// by its number.
function runThrough(seconds: Sayable, minutes: Sayable, placed: boolean) {
  const run = restOf(minutes).base;

  return steady(seconds) && (run.kind === 'all' || run.kind === 'range' ||
    placed && run.kind === 'values' ||
    run.kind === 'pieces' && run.parts.every(function isRun(part) {
      return part.kind === 'range';
    }));
}

// Two values that halve the cycle are a cadence too (minutes 0 and 30),
// which a field that does not wrap is not offered.
function beatOf(candidates: SetDescription[]): Sayable[] {
  const {values = []} =
    candidates[candidates.length - 1] as Partial<Described<'values'>>;
  const half = (sixty.max + 1) / 2;

  return values.join() === `0,${half}` ?
    [{interval: half, kind: 'cadence', last: half, start: 0}] :
    [];
}

// A field's candidates with nothing wrapped.
function unwrapped(schedule: Schedule, field: Field): SetDescription[] {
  return candidatesAs(schedule, field, {linear: true}) as SetDescription[];
}

// A field's runs and cadences together, where they follow one another.
// Single points may stand anywhere where they are said after the rest.
function together(schedule: Schedule, field: Field, loose: boolean) {
  return inSuccession(schedule.analyses.cadencePieces[field], loose);
}

// Whether every hour at minute 0 takes a few seconds as it takes one:
// «15 und 45 Sekunden nach jeder vollen Stunde».
function takesFewSeconds(S: number[], M: number[], hours: Sayable) {
  return M.join() === '0' && restOf(hours).base.kind === 'all' &&
    S.length <= held;
}

// One minute and one non-zero second, the minute a place in every hour.
function isCounted(S: number[], M: number[], placed: boolean): boolean {
  return [S.length, M.length].every(function single(length) {
    return length === 1;
  }) && S[0] > 0 && placed;
}

// Whether the minutes are said by their number in the hour. One minute is
// a clock time unless every hour has it, or the hours come round the day;
// several are, unless they are said once for many hours.
function placedOf(
  work: Pick<Clockwork, 'H' | 'M' | 'hours' | 'listed' | 'round'>
): boolean {
  const {H, M, hours, listed, round} = work;

  return M.length === 1 ?
    (restOf(hours).base.kind === 'all' || round.length > 0) && M[0] > 0 :
    !listed && H.length > 1;
}

// The three fields of the clock, each with the description it is said
// by, and what the seconds do to the rest.
function clockworkOf(schedule: Schedule, voice: Voice): Clockwork {
  const {candidates} = schedule.analyses;
  const linear = {
    hour: unwrapped(schedule, 'hour'),
    minute: unwrapped(schedule, 'minute'),
    second: unwrapped(schedule, 'second')
  };
  const [S, M] = [linear.second, linear.minute].map(function valuesOf(field) {
    return denote(field[field.length - 1], sixty);
  });
  const H = denote(linear.hour[linear.hour.length - 1], hoursOfDay);
  const seconds = settle(linear.second, inTheHour,
    [...beatOf(linear.second), ...together(schedule, 'second', false)]);
  const minuteOthers =
    [...beatOf(linear.minute), ...together(schedule, 'minute', true)];
  const minutes = H.length === 1 ?
    settle(linear.minute, onTheClock, minuteOthers) :
    settleUnwrapped(candidates.minute as SetDescription[], linear.minute,
      inTheHour, minuteOthers);
  const hours = settle(linear.hour,
    M.length === 1 ? hoursAsPoints : hoursAsWindows,
    together(schedule, 'hour', M.length === 1));
  const round = roundTheDay(hours);
  const listed = round.length === 0 && isListed(H, M, hours, minutes);
  const placed = placedOf({H, M, hours, listed, round});
  const lone = S.length === 1;
  const pointed = minutes.kind === 'values' && !placed && round.length === 0;
  const counted = isCounted(S, M, placed && round.length === 0);
  const leads = runThrough(seconds, minutes, placed);
  const toSecond = denote(restOf(seconds).base, sixty).slice(-1);
  // Every hour at minute 0 takes a few seconds as it takes one.
  const hourly = takesFewSeconds(S, M, hours);

  function whereLeading() {
    return leads;
  }

  return {
    H,
    M,
    S,
    carry: S.filter(function carried(second) {
      return lone && pointed && second > 0;
    }),
    counted,
    high: [M[M.length - 1], ...toSecond.filter(whereLeading)],
    hourPoints: settle(linear.hour, hoursByNumber,
      together(schedule, 'hour', true)),
    hours,
    leads,
    linear,
    listed,
    low: [M[0], ...[0].filter(whereLeading)],
    minutes,
    onTheHour: [[0], S][Number(hourly)],
    // One second is silent at 0, carried by points, or counted with the
    // minute.
    quiet: lone && (S[0] === 0 || pointed || counted) || hourly,
    round,
    seconds,
    voice
  };
}

// What happens in every minute of a stretch: the seconds where they lead
// or are a few offsets from the full minute, and otherwise «jede Minute».
function eachMinuteOf(work: Clockwork, offsets: boolean): string {
  const {S, hours, leads, seconds} = work;
  const windowed = restOf(hours).base.kind !== 'all';

  return leads && every(stepOf(restOf(seconds).base), units.second) ||
    offsets && join([windowed && S[0] > 0 && words.eachTime,
      offset(S, eachMinute)]) ||
    every(1, units.minute);
}

/** The time part of a schedule. */
function timePart(schedule: Schedule, voice: Voice): TimeSaid {
  const work = clockworkOf(schedule, voice);
  const {S, hours, leads, listed, minutes, quiet, round, seconds} = work;
  const offsets = !quiet && !leads && minutes.kind === 'all' &&
    S.length <= held;
  const stamped = listed && S.length > 1 ? toTheSecond(work) : null;
  const said = stamped || minutesAndHours(work, eachMinuteOf(work, offsets));
  const gone = [restOf(seconds).removed].filter(function apply(removed) {
    return leads && removed.length > 0;
  }).map(function say(removed) {
    return offset(removed, eachMinute);
  });
  const body = said.text + exceptTail([...said.excepts, ...gone], voice);
  const text = quiet || leads || offsets || stamped ?
    body :
    `${body}, ${words.eachTime} ${trailing(work)}`;

  return {
    clock: text.startsWith(`${words.at} `),
    daily: restOf(hours).base.kind !== 'all' && round.length === 0,
    offset: (/^\d/u).test(text),
    text
  };
}

export {timePart};
