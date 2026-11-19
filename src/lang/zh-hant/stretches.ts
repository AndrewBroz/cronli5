// Stretches of clock times: each runs from the first moment that fires to
// the last, to the precision of what fires, and is followed by its rate
// (answers 3.4, 3.6, 4.1 C and 4.2).

import {
  type AddedForm, type CadenceForm, type Form, type Reading, type Span, coreOf,
  removedOf, runsIn, spansOf
} from './forms.js';
import {
  type Carried, type Edge, type Held, type Holding, held, minuteNamer, named,
  secondNamer, told
} from './hold.js';
import {
  type Moment, clock, excepting, gap, list, rate, stretch, wordThenClock
} from './write.js';
import type {ZhHantStyle} from './options.js';
import {domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;

/** What was said of the time, and what the day part must know of it. */
export interface Said {
  // Whether the time is tied to the day: it names clock times or hours.
  anchored: boolean;
  // Whether it begins with a clock time.
  clock: boolean;
  text: string;
  // Whether it is one stretch with a plain rate, or a rate alone.
  whole?: boolean;
}

/** How the seconds are said, wherever the sentence comes to them. */
export interface Seconds extends Carried {
  // After minutes that are named: the whole minute, or positions in it.
  afterNamed: string;
  // After a rate of minutes: what each such minute holds.
  afterThat: string;
  // The rate between the two ends of a stretch of minutes.
  between: string;
  form: Form;
  // Several seconds fire in a minute.
  live: boolean;
  // The rate when every minute fires and no end is named.
  open: string;
  // Clock times show their seconds.
  shown: boolean;
}

/** The units stretches run over, and what stands inside each of them. */
export interface Level {
  how: Holding;
  moment(outer: number, inner: number, edge: Edge): string;
  // The rate of the outer units themselves, when each holds one moment.
  spanRate: string;
}

/** The hours, as a field of the clock: two neighbours are a stretch. */
const hourReading: Reading = {
  domain: domainOf('hour'),
  exceptCadence: true,
  pairs: true,
  pieces: true,
  run: 2,
  steps: sayableStep
};

// A cadence of the clock is said as one when it tiles its unit or has
// more than four values.
function sayableStep(cadence: CadenceForm): boolean {
  return cadence.tiles || cadence.values.length > 4;
}

function tiling(cadence: CadenceForm): boolean {
  return cadence.tiles;
}

function fromFirst(cadence: CadenceForm): boolean {
  return cadence.tiles && cadence.fromFirst;
}

function longFromFirst(cadence: CadenceForm): boolean {
  return fromFirst(cadence) && cadence.values.length > 4;
}

function secondHow(bare: Holding['bare']): Holding {
  return {
    bare,
    each: rate('second', 1),
    every: rate('second', 1),
    gaps: secondNamer,
    namer: secondNamer,
    once: words.once,
    prefix: words.everyMinute + words.of,
    unit: 'second'
  };
}

/** The seconds of a pattern, said once for every place they can stand. */
function secondsOf(form: Form): Seconds {
  const live = form.values.length > 1;
  const shown = live || form.values[0] !== 0;
  const edges = shown ? form.values : [null];
  const everyMinute = rate('minute', 1);
  const prefix = words.everyMinute + words.of;
  const inside = held(form, secondHow(longFromFirst));

  return {
    afterNamed: told(inside, words.comma + words.thatMinute + words.within,
      words.of),
    afterThat: words.thatMinute + told(inside, words.within, words.of),
    between: live ? told(held(form, secondHow(tiling)), '', prefix) :
      everyMinute,
    first: edges[0],
    form,
    last: edges[edges.length - 1],
    live,
    open: shown ? told(held(form, secondHow(fromFirst)), '', prefix) :
      everyMinute,
    shown
  };
}

// The three places a set of minutes is said: after every hour, after
// hours that are named, and between the ends of a stretch. Minute zero
// is the hour itself except after named hours, where that would say the
// hour twice.
const places = {
  hours: {
    bare: fromFirst,
    every: 'open',
    prefix: '',
    zero: {text: lexicon.twoDigits(0), unit: units.minute.position}
  },
  open: {
    bare: fromFirst,
    every: 'open',
    prefix: words.everyHour + words.of,
    zero: {text: words.onTheHour, unit: ''}
  },
  stretch: {
    bare: tiling,
    every: 'between',
    prefix: words.everyHour + words.of,
    zero: {text: words.onTheHour, unit: ''}
  }
} as const;

/** A place minutes are said in. */
export type Place = keyof typeof places;

/**
 * How minutes are said in a place. Named minutes carry the seconds shown,
 * unless they are given others to carry.
 */
function minuteHow(sec: Seconds, place: Place, carried: Carried = sec):
  Holding {
  const {bare, every, prefix, zero} = places[place];
  // A minute left out is left out whole when several seconds fire in it.
  const plain = {first: null, last: null};

  return {
    bare,
    each: sec.between,
    every: sec[every],
    gaps: minuteNamer(zero, sec.live ? plain : carried),
    namer: minuteNamer(zero, carried),
    once: words.once,
    prefix,
    unit: 'minute'
  };
}

/** Hours as the units of stretches, each holding minutes. */
function hourLevel(sec: Seconds, style: ZhHantStyle): Level {
  return {
    how: minuteHow(sec, 'stretch'),
    moment(hour, minute, edge) {
      return clock({hour, minute, second: sec[edge]}, style);
    },
    spanRate: rate('hour', 1)
  };
}

/** A few clock times as the units of stretches, each holding seconds. */
function minuteLevel(times: Moment[], style: ZhHantStyle): Level {
  return {
    how: secondHow(tiling),
    moment(index, second) {
      return clock({...times[index], second}, style);
    },
    spanRate: ''
  };
}

// A cadence from its first value to its last, and each value beside it.
function stepAndOthers(form: AddedForm): Span[] {
  return [
    {from: form.base.start, to: form.base.last},
    ...form.added.map(function alone(value) {
      return {from: value, to: value};
    })
  ];
}

// The forms whose runs become stretches of their own inside one unit.
const cutInside: {[kind: string]: (form: never) => Span[]} = {
  added: stepAndOthers,
  pieces: spansOf,
  range: spansOf
};

// A form's runs inside one unit, where it has them.
function cutsOf(form: Form): Span[] | false {
  return Object.hasOwn(cutInside, form.kind) &&
    cutInside[form.kind](form as never);
}

// The rate between the ends of a run inside one unit: a cadence's own,
// or the rate of every position.
function rateInside(form: Form, how: Holding): string {
  return form.kind === 'added' && rate(how.unit, form.base.interval) ||
    how.each;
}

// One run of units crossed with one run of what they hold: its first and
// last moments.
interface Cell {
  from: string;
  nextDay: boolean;
  to: string;
}

function crossed(spans: Span[], parts: Span[], level: Level): Cell[] {
  return spans.flatMap(function cross(span) {
    return parts.map(function cell(part) {
      return {
        from: level.moment(span.from, part.from, 'first'),
        nextDay: span.from > span.to,
        to: level.moment(span.to, part.to, 'last')
      };
    });
  });
}

function isMoment(cell: Cell): boolean {
  return cell.from === cell.to;
}

// What is left out of single units, as the moments themselves.
function momentsGone(
  spans: Span[],
  dropped: number[],
  level: Level,
  style: ZhHantStyle
): string {
  return list(spans.flatMap(function eachUnit(span) {
    return dropped.map(function moment(value) {
      return gap(level.moment(span.from, value, 'first'),
        level.moment(span.from, value, 'last'), style);
    });
  }));
}

// What is left out across several units, as positions in each: after a
// rate they name the unit that holds them.
function positionsGone(dropped: number[], rest: Held, how: Holding): string {
  const names = named(how.gaps, dropped);
  const outside = rest.rate ? how.prefix : '';

  return names && outside + names;
}

/**
 * Stretches over runs of units, then the rate. Inside single units a run
 * of what they hold is a stretch of its own; across several units the
 * stretch runs from first to last and what each unit holds follows it.
 * Single moments come after the rate, and what is left out last.
 */
function stretched(
  spans: Span[],
  inner: Form,
  level: Level,
  style: ZhHantStyle
): Said {
  const core = coreOf(inner);
  const single = spans.every(function isOne(span) {
    return span.from === span.to;
  });
  const extent = {
    from: inner.values[0],
    to: inner.values[inner.values.length - 1]
  };
  const cut = single && cutsOf(core);
  const cells = crossed(spans, cut || [extent], level);
  const runs = cells.filter(function isRun(cell) {
    return !isMoment(cell);
  }).map(function asStretch(cell) {
    return stretch(cell.from, cell.to, style, cell.nextDay);
  });
  const lone = list(cells.filter(isMoment).map(function asMoment(cell) {
    return cell.from;
  }));
  const added = [lone].filter(Boolean).map(function after(times) {
    return wordThenClock(words.plus, times);
  });
  const how = {
    ...level.how,
    bare(cadence: CadenceForm) {
      return cadence.tiles || single;
    }
  };
  const rest = held(core, how);
  const ownRate = core.kind === 'one' && level.spanRate ||
    cut && rateInside(core, how);
  const dropped = removedOf(inner).filter(function between(value) {
    return value > extent.from && value < extent.to;
  });
  const gone = single ?
    momentsGone(spans, dropped, level, style) :
    positionsGone(dropped, rest, how);

  return {
    anchored: true,
    clock: true,
    text: [list(runs), ownRate || told(rest, '', how.prefix), ...added]
      .join(words.comma) + excepting(gone),
    whole: runs.length === 1 && added.length + dropped.length === 0 &&
      Boolean(ownRate || rest.rate)
  };
}

/**
 * Hours that do not fire, as the moments missing from a rate: each run of
 * them from its first moment to its last, or its two moments when it has
 * only two.
 */
function gaps(
  hours: number[],
  minutes: Form,
  sec: Seconds,
  style: ZhHantStyle
): string {
  const first = minutes.values[0];
  const last = minutes.values[minutes.values.length - 1];

  return list(runsIn(hours, hourReading).flatMap(function gapOf(run) {
    const from = clock({hour: run.from, minute: first, second: sec.first},
      style);
    const to = clock({hour: run.to, minute: last, second: sec.last}, style);
    const two = !sec.live &&
      (run.to - run.from + 1) * minutes.values.length === 2;

    return two ? [from, to] : [gap(from, to, style)];
  }));
}

export {
  gaps, hourLevel, hourReading, minuteHow, minuteLevel, sayableStep,
  secondsOf, stretched
};
