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
import {clock24, mark} from './voice.js';

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
interface Level extends Spans {
  // Whether a window before the phrase already gives a stretch its ends.
  absorbed: boolean;
  // What happens at every value of a stretch: «jede Minute», «stündlich».
  each: string;
  gone(values: number[], level: Level): string;
  // What opens a phrase that has ends or points of its own.
  lead: string;
  // Whether every value, and a cadence that tiles, need no ends.
  open: boolean;
  point(value: number): string;
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
  // The minute and second of the last moment of an hour, and the first.
  high: number[];
  hours: Sayable;
  // Whether the seconds take the place of «jede Minute».
  leads: boolean;
  // Each field's candidates with nothing wrapped.
  linear: {[field in 'hour' | 'minute' | 'second']: SetDescription[]};
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

// The most clock times a list holds, and the most minutes or seconds.
const held = 6;

// The most clock times a list holds before a cadence replaces it.
const heldBeforeCadence = 4;

// The most minutes to the hour a series of clock times shows.
const heldInSeries = 3;

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

function points(values: number[], level: Level): string {
  return atTimes(values.map(level.point), level.oClock);
}

function span(ends: number[], spans: Spans): string {
  return `${words.from} ${spans.from(ends[0])} ${words.to} ` +
    `${spans.to(ends[1])}`;
}

// A window for each unbroken run of the values.
function windows(values: number[], spans: Spans): string {
  return list(runsOf(values).map(function toSpan(run) {
    return span(run, spans);
  })) + spans.oClock;
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
    `${level.lead}${span(ends, level)}${level.oClock} ${what}`;
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
        `${span([from as number, to as number], level)}${level.oClock} ` +
        `${interval ? every(interval, level.unit) : level.each}`
      ];
    });
    const strays = pieces.parts.flatMap(function straysOf(part) {
      return (part as Described<'values'>).values ?? [];
    });

    return join([level.lead + list(stretches),
      strays.length > 0 && `${words.also} ${points(strays, level)}`]);
  },
  // The runs share what happens in them, and single points follow.
  pieces(pieces, level) {
    const runs = pieces.parts.flatMap(function runOf(part) {
      return part.kind === 'range' ? [span([part.from, part.to], level)] : [];
    });
    const strays = pieces.parts.flatMap(function straysOf(part) {
      return (part as Described<'values'>).values ?? [];
    });

    return join([`${level.lead}${list(runs)}${level.oClock} ${level.each}`,
      strays.length > 0 && `${words.also} ${points(strays, level)}`]);
  },
  range(range, level) {
    return stretch([range.from, range.to], level.each, false, level);
  },
  values(values, level) {
    return level.lead + points(values.values, level);
  }
};

// A set of one field's values, said at its level.
function spread(description: Sayable, level: Level): Said {
  const {base, removed} = restOf(description);

  return {
    excepts: [removed].filter(nonEmpty).map(function say(values) {
      return level.gone(values, level);
    }),
    text: shapes[base.kind as 'all'](base as never, level)
  };
}

// The hours as points, each at the pattern's one minute.
function hourLevel(work: Clockwork): Level {
  const {M, carry, voice} = work;

  function at(hour: number): string {
    return voice.clock(hour, [M[0], ...carry]);
  }

  return {
    absorbed: false,
    each: words.hourly,
    from: at,
    gone: points,
    lead: '',
    oClock: voice.oClock,
    open: true,
    point: at,
    tiling: false,
    to: at,
    top: hoursOfDay.max,
    unit: units.hour,
    whole: M[0] === 0 ?
      offset([...carry, 0].slice(0, 1), eachHour) :
      `${words.hourly} ${words.at} ${mark([M[0], ...carry])}`
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

// How many windows the hours write out, where each holds one hour: every
// one, or for a cadence of more than four the first two and the last.
function windowsShown(hours: Sayable): number {
  const {base} = restOf(hours);
  const parts = base.kind === 'cadencePieces' ? base.parts : [base];

  return standApart(hours) ?
    parts.reduce(function count(total, part) {
      const size = denote(part, hoursOfDay).length;

      return total + (part.kind === 'cadence' && size > heldBeforeCadence ?
        boundedCadence :
        size);
    }, 0) :
    0;
}

// Beside windows of single hours that show more clock times than a list
// holds, a cadence of three minutes or more is said by its step alone:
// every window already names its first minute and its last.
function stepInWindows(
  chosen: Sayable,
  candidates: SetDescription[],
  hours: Sayable
): Sayable {
  const cadence = candidates.find(function isCadence(description) {
    return description.kind === 'cadence' &&
      denote(description, sixty).length > 2;
  });

  return chosen.kind === 'values' && cadence &&
    windowsShown(hours) * 2 > held ?
    cadence :
    chosen;
}

// The minutes: clock times inside one named hour, and otherwise places in
// the hour («:05»).
function minuteLevel(work: Clockwork, each: string): Level {
  const {H, carry, high, hours, leads, low, voice} = work;
  const named = H.length === 1;
  const apart = standApart(hours);
  const lead = apart ? words.eachTime : words.hourly;

  function clockTime(rest: number[]): string {
    return voice.clock(H[0], rest);
  }

  const [write, oClock, opening] = named ?
    [clockTime, voice.oClock, ''] :
    [mark, '', `${lead} `];

  return {
    absorbed: apart && !named,
    each,
    from(minute) {
      return write([minute, ...low.slice(1)]);
    },
    gone: leads ? windows : points,
    lead: opening,
    oClock,
    open: !named,
    point(minute) {
      return write([minute, ...carry]);
    },
    tiling: true,
    to(minute) {
      return write([minute, ...high.slice(1)]);
    },
    top: sixty.max,
    unit: units.minute,
    whole: each
  };
}

// Whether the time part is a list of clock times: the list is said when
// it is short enough to hold and names no more than the windows would.
function isListed(work: Clockwork): boolean {
  const {H, M, hours, minutes} = work;
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

// The hours as stretches, each from its first moment to its last. Every
// second hour of the whole day has a name, and the windows are its gloss.
// Runs and cadences together are said one after another.
function hourStretches(base: Sayable, spans: Spans, work: Clockwork): string {
  const {interval, last = 0, start = 0} = base as Partial<Described<'cadence'>>;
  const parts = base.kind === 'cadencePieces' ? base.parts : [base];
  const hours = denote(base, hoursOfDay);
  const gloss = [hours[0], hours[1], hours[hours.length - 1]].map(
    function toGloss(hour) {
      return `${clock24(hour, work.low)}–${clock24(hour, work.high)}`;
    });

  if (base.kind === 'all') {
    return '';
  }

  return interval === 2 && start < 2 && last + 2 > hoursOfDay.max ?
    `${[words.inEvenHours, words.inOddHours][start]} (${gloss[0]}, ` +
      `${gloss[1]} ${words.ellipsis} ${gloss[2]} ${words.oClock})` :
    parts.map(function say(part) {
      return windowsOf(part, spans);
    }).join(` ${words.also} `) + spans.oClock;
}

// A series of clock times: every time of the first two hours and of the
// last.
function seriesOfTimes(base: Sayable, work: Clockwork): string {
  const {M, carry, voice} = work;
  const hours = denote(base, hoursOfDay);

  function timesIn(hour: number): string[] {
    return M.map(function toTime(minute) {
      return voice.clock(hour, [minute, ...carry]);
    });
  }

  return `${words.at} ${[...timesIn(hours[0]), ...timesIn(hours[1])]
    .join(', ')} ${words.ellipsis} ` +
    `${list(timesIn(hours[hours.length - 1]))}${voice.oClock}`;
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
function minutesAndHours(
  work: Clockwork,
  each: string,
  listed: boolean
): Said {
  const {H, M, carry, hours, minutes, voice} = work;

  if (listed) {
    return {
      excepts: [],
      text: atTimes(clockTimes(work).map(function toTime(time) {
        return voice.clock(time[0], [time[1], ...carry]);
      }), voice.oClock)
    };
  }

  if (M.length === 1) {
    return spread(hours, hourLevel(work));
  }

  const said = spread(minutes, minuteLevel(work, each));

  if (H.length === 1) {
    return said;
  }

  const {base, removed} = restOf(hours);
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
    return windows(values, spans);
  });

  return base.kind === 'cadence' && minutes.kind === 'values' &&
    M.length <= heldInSeries ?
    {excepts: gone, text: seriesOfTimes(base, work)} :
    {
      excepts: [...gone, ...said.excepts],
      text: join([hourStretches(base, spans, work), said.text])
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
// a break, through every minute of a stretch.
function runThrough(seconds: Sayable, minutes: Sayable) {
  const beat = restOf(seconds).base;
  const run = restOf(minutes).base;
  const steady = beat.kind === 'all' || beat.kind === 'cadence' && tiles(beat);

  return steady && (run.kind === 'all' || run.kind === 'range' ||
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
  const hours = settle(linear.hour,
    M.length === 1 ? hoursAsPoints : hoursAsWindows,
    together(schedule, 'hour', M.length === 1));
  const minutes = H.length === 1 ?
    settle(linear.minute, onTheClock, minuteOthers) :
    stepInWindows(settleUnwrapped(candidates.minute as SetDescription[],
      linear.minute, inTheHour, minuteOthers), linear.minute, hours);
  const lone = S.length === 1;
  const pointed = minutes.kind === 'values';
  const leads = runThrough(seconds, minutes);
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
    high: [M[M.length - 1], ...toSecond.filter(whereLeading)],
    hours,
    leads,
    linear,
    low: [M[0], ...[0].filter(whereLeading)],
    minutes,
    // One second is silent at 0 and carried by points.
    quiet: lone && (S[0] === 0 || pointed),
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
  const {S, hours, leads, minutes, quiet, seconds} = work;
  const offsets = !quiet && !leads && minutes.kind === 'all' &&
    S.length <= held;
  const listed = isListed(work);
  const stamped = listed && S.length > 1 ? toTheSecond(work) : null;
  const said = stamped ||
    minutesAndHours(work, eachMinuteOf(work, offsets), listed);
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
