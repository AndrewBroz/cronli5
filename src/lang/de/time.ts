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
import {clock24} from './voice.js';

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
  low: number[];
  minutes: Sayable;
  // Whether the seconds need no words of their own.
  quiet: boolean;
  seconds: Sayable;
  voice: Voice;
}

interface Wording {
  after: string;
  at: string;
}

const sixty: Domain = {cyclic: false, max: 59, min: 0};
const hoursOfDay: Domain = {cyclic: false, max: 23, min: 0};

// Every second hour of the day, from hour 0 or from hour 1.
const parity = 2;

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

// Every hour at one minute: the full hour and its second, one count of a
// minute and a second from it, or the minute as a place in the hour.
function wholeHour(work: Clockwork): string {
  const {M, S, carry, counted} = work;

  if (M[0] === 0) {
    return offset([...carry, 0].slice(0, 1), eachHour);
  }

  return counted ?
    `${amount(M, units.minute)} ${words.and} ${amount(S, units.second)} ` +
      words.afterEachHour :
    `${words.hourly} ${minutePoints(M)}`;
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

// The windows of a set of hours, without «Uhr»: every one, or for a
// cadence of more than four the first two and the last.
function windowsOf(part: Sayable, spans: Spans): string {
  const hours = denote(part, hoursOfDay);
  const [first, second, last] =
    [hours[0], hours[1], hours[hours.length - 1]].map(function toSpan(hour) {
      return span([hour, hour], spans);
    });

  return part.kind === 'cadence' && hours.length > heldBeforeCadence ?
    `${first}, ${second} ${words.ellipsis} ${words.and} ${last}` :
    list(runsOf(hours).map(function toSpan(run) {
      return span(run, spans);
    }));
}

// The name of every second hour of the whole day, from hour 0 or hour 1,
// and nothing for any other set of hours.
function parityOf(base: Sayable): string {
  const {interval, last = 0, start = 0} = base as Partial<Described<'cadence'>>;
  const named = interval === parity && start < parity &&
    last + parity > hoursOfDay.max;

  return [named && [words.inEvenHours, words.inOddHours][start]]
    .filter(Boolean).join('');
}

// The hours as stretches, each from its first moment to its last. Every
// second hour of the whole day has a name, and the windows are its gloss.
// Runs and cadences together are said one after another.
function hourStretches(base: Sayable, spans: Spans, work: Clockwork): string {
  const parts = base.kind === 'cadencePieces' ? base.parts : [base];
  const hours = denote(base, hoursOfDay);
  const gloss = [hours[0], hours[1], hours[hours.length - 1]].map(
    function toGloss(hour) {
      return `${clock24(hour, work.low)}–${clock24(hour, work.high)}`;
    });
  const name = parityOf(base);

  if (base.kind === 'all') {
    return '';
  }

  return name ?
    `${name} (${gloss[0]}, ` +
      `${gloss[1]} ${words.ellipsis} ${gloss[2]} ${words.oClock})` :
    parts.map(function say(part) {
      return windowsOf(part, spans);
    }).join(` ${words.also} `) + spans.oClock;
}

// The hours named as hours, with no minute of their own: their parity,
// a cadence as a series (the first three, «…», «und» and the last), or
// their list.
function hoursAlone(work: Clockwork): string {
  const {voice} = work;
  const {base} = restOf(work.hourPoints);
  const hours = denote(base, hoursOfDay);
  const level = hourLevel(work, []);

  function at(hour: number): string {
    return voice.clock(hour, []);
  }

  return parityOf(base) || (base.kind === 'cadence' ?
    `${words.at} ${hours.slice(0, boundedCadence).map(at).join(', ')} ` +
      `${words.ellipsis} ${words.and} ${at(hours[hours.length - 1])}` +
      voice.oClock :
    level.points(hours));
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
  const {H, M, carry, hours, leads, listed, minutes, voice} = work;

  if (listed) {
    return {
      excepts: [],
      text: atTimes(clockTimes(work).map(function toTime(time) {
        return voice.clock(time[0], [time[1], ...carry]);
      }), voice.oClock)
    };
  }

  if (M.length === 1 && !leads) {
    return spread(hours, hourLevel(work, [M[0], ...carry]));
  }

  const said = spread(minutes, minuteLevel(work, each));

  if (H.length === 1) {
    return said;
  }

  const {base, removed} = restOf(scattered(work) ? work.hourPoints : hours);
  const spans: Spans = {
    from(hour) {
      return voice.clock(hour, work.low);
    },
    oClock: voice.oClock,
    to(hour) {
      return voice.clock(hour, work.high);
    }
  };
  const gone = [removed].filter(nonEmpty).map(function say(values) {
    return dotted(work) ? hoursGone(values) : windows(values, spans);
  });

  return {
    excepts: [...gone, ...said.excepts],
    text: scattered(work) ?
      `${hoursAlone(work)}, ${said.text}` :
      join([hourStretches(base, spans, work), said.text])
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
// first second where that is not the full minute.
function burst(base: Sayable): string {
  const seconds = denote(base, sixty);
  const start = seconds.slice(0, 1).filter(function isLater(second) {
    return second > 0;
  }).map(function say(second) {
    return `, ${words.first} ${offset([second], theMinute)}`;
  });

  return `${seconds.length}${words.times} ${words.apart} ` +
    `${amount([stepOf(base)], units.second)}${start.join('')}`;
}

// Seconds in step, by number: the first three and the last, or all of a
// few.
function secondSeries(seconds: number[]): string {
  return seconds.length > boundedCadence + 1 ?
    `${seconds.slice(0, boundedCadence).join(', ')} ${words.ellipsis} ` +
      `${seconds[seconds.length - 1]}` :
    list(seconds.map(String));
}

// Seconds by their number in the minute: each run by its ends, each
// cadence as a series and each second between them, in ascending order.
// A series stands apart from its neighbours.
function numbered(base: Sayable): string {
  const {parts = [base]} = base as Partial<CadencePieces>;
  const items = parts.flatMap(function split(part): Array<[number, string]> {
    const seconds = denote(part, sixty);

    return part.kind === 'values' ?
      seconds.map(function single(second) {
        return [second, String(second)];
      }) :
      [[seconds[0], part.kind === 'range' ?
        `${part.from} ${words.to} ${part.to}` :
        secondSeries(seconds)]];
  }).sort(function ascending(a, b) {
    return a[0] - b[0];
  }).map(function text(item) {
    return item[1];
  });

  return `${words.inSeconds} ` + (base.kind === 'cadencePieces' ?
    items.join(` ${words.also} `) :
    list(items));
}

const bursts: {[kind: string]: (base: never) => string} = {
  all() {
    return `${words.oneMinuteLong} ${every(1, units.second)}`;
  },
  cadence: burst,
  cadencePieces: numbered,
  pieces: numbered,
  range: numbered,
  values(base) {
    return offset(denote(base, sixty), theMinute);
  }
};

// The seconds that follow a time part said whole.
function trailing(S: number[], seconds: Sayable, voice: Voice) {
  const {base, removed} = restOf(seconds);

  return S.length > held ?
    bursts[base.kind](base as never) + exceptTail(
      [removed].filter(nonEmpty).map(function say(gone) {
        return offset(gone, theMinute);
      }), voice) :
    offset(S, theMinute);
}

// Whether the seconds take the place of «jede Minute»: they run without
// a break, through every minute of a stretch, or through each minute named
// by its number.
function runThrough(seconds: Sayable, minutes: Sayable, placed: boolean) {
  const beat = restOf(seconds).base;
  const run = restOf(minutes).base;
  const steady = beat.kind === 'all' || beat.kind === 'cadence' && tiles(beat);

  return steady && (run.kind === 'all' || run.kind === 'range' ||
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

// The three fields of the clock, each with the description it is said
// by, and what the seconds do to the rest.
// One minute and one non-zero second, the minute a place in every hour.
function isCounted(S: number[], M: number[], placed: boolean): boolean {
  return [S.length, M.length].every((length) => length === 1) &&
    S[0] > 0 && placed;
}

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
  const listed = isListed(H, M, hours, minutes);
  // One minute is a clock time unless every hour has it; several are,
  // unless they are said once for many hours.
  const placed = M.length === 1 ?
    restOf(hours).base.kind === 'all' && M[0] > 0 :
    !listed && H.length > 1;
  const lone = S.length === 1;
  const pointed = minutes.kind === 'values' && !placed;
  const counted = isCounted(S, M, placed);
  const leads = runThrough(seconds, minutes, placed);
  const toSecond = denote(restOf(seconds).base, sixty).slice(-1);

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
    // One second is silent at 0, carried by points, or counted with the
    // minute.
    quiet: lone && (S[0] === 0 || pointed || counted),
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
  const {S, hours, leads, listed, minutes, quiet, seconds} = work;
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
    `${body}, ${words.eachTime} ${trailing(S, seconds, voice)}`;

  return {
    clock: text.startsWith(`${words.at} `),
    daily: restOf(hours).base.kind !== 'all',
    offset: (/^\d/u).test(text),
    text
  };
}

export {timePart};
