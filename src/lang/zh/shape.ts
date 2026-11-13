// Deciding how a set of values is said. The core offers every compact
// description of a field's values; here each becomes a shape Chinese has a
// device for, with a count of the things it names, and the shape naming
// the fewest is chosen. The same shapes serve every field. Small helpers
// that join names into lists live here too, since every part uses them.

import type {
  Domain, Field, RangeDescription, ScheduleFacts, SetDescription,
  ValuesDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';

const {marks, words} = lexicon;

/** A run of values, or values named one by one. */
export type Part = RangeDescription | ValuesDescription;

/** A sayable arrangement of a field's values. */
export interface Shape {
  // Every second value of the whole field: the odd or the even ones.
  alternate: boolean;
  // The spacing of the values inside each run.
  interval: number;
  // How many things the phrase names.
  length: number;
  // A cadence that runs to the end of its field and names only its start.
  open: boolean;
  parts: Part[];
  // Values taken out of the parts.
  removed: number[];
  // Going round the whole field with no ends to name.
  round: boolean;
}

/** What Chinese can say of one field's cadences and pairs. */
export interface Scale {
  // Whether every second value has an odd or even name.
  alternates: boolean;
  domain: Domain;
  // Whether two adjacent values are listed in the order of their run.
  pairsInRunOrder: boolean;
  // Whether a cadence may name its start and no end.
  starts: boolean;
  // Whether a cadence that divides the field is said with no ends.
  tiles: boolean;
}

/** Whether a shape may be said, given how many values the field has. */
export type Sayable = (shape: Shape, count: number) => boolean;

function scaleOf(domain: Domain, traits: Partial<Scale>): Scale {
  return {alternates: false, domain, pairsInRunOrder: false, starts: false,
    tiles: false, ...traits};
}

// The week is counted from Monday to Sunday, so Sunday is 7 here.
const week: Domain = {cyclic: true, max: 7, min: 1};

const scales: Record<Field, Scale> = {
  date: scaleOf(domainOf('date'), {alternates: true, starts: true}),
  hour: scaleOf(domainOf('hour'), {alternates: true, tiles: true}),
  minute: scaleOf(domainOf('minute'), {tiles: true}),
  month: scaleOf(domainOf('month'), {alternates: true}),
  second: scaleOf(domainOf('second'), {tiles: true}),
  weekday: scaleOf(week, {pairsInRunOrder: true}),
  year: scaleOf(domainOf('year'), {alternates: true, starts: true})
};

// An exception, or a cadence with both ends named, has to be worked out:
// it must stand in for more than this many values.
const easilyListed = 4;

function plain(parts: Part[], length: number): Shape {
  return {alternate: false, interval: 1, length, open: false, parts,
    removed: [], round: false};
}

function sizeOf(domain: Domain): number {
  return domain.max - domain.min + 1;
}

// A run of exactly two values is a list of the two.
function rangeShape(range: RangeDescription, scale: Scale): Shape | null {
  const size = sizeOf(scale.domain);
  const steps = ((range.to - range.from) % size + size) % size;
  const pair: Part = {kind: 'values', values: [range.from, range.to]};

  if (steps > 1) {
    return plain([range], 2);
  }

  return scale.pairsInRunOrder ? plain([pair], 2) : null;
}

function cadenceShape(
  cadence: Extract<SetDescription, {kind: 'cadence'}>,
  scale: Scale
): Shape {
  const {interval, last, start} = cadence;
  const {max, min} = scale.domain;
  const reaches = last + interval > max;
  const round = scale.tiles && start === min && reaches &&
    sizeOf(scale.domain) % interval === 0;
  const alternate = scale.alternates && interval === 2 &&
    start - interval < min && reaches;
  const open = scale.starts && reaches;

  return {
    ...plain([{from: start, kind: 'range', to: last}], 0),
    alternate,
    interval,
    length: round || alternate ? 1 : 3 - Number(open),
    open,
    round
  };
}

function thingsNamed(total: number, part: Part): number {
  return total + (part.kind === 'range' ? 2 : part.values.length);
}

// The shape of one description, or null where Chinese has no device.
// Values are taken out only of a base that names at most one thing: the
// whole field, or a cadence said with no ends.
function shapeOf(description: SetDescription, scale: Scale): Shape | null {
  const {max, min} = scale.domain;

  switch (description.kind) {
    case 'all':
      return {...plain([{from: min, kind: 'range', to: max}], 0), round: true};
    case 'range':
      return rangeShape(description, scale);
    case 'cadence':
      return cadenceShape(description, scale);
    case 'pieces':
      return plain(description.parts, description.parts.reduce(thingsNamed, 0));
    case 'except': {
      const base = shapeOf(description.base, scale);

      return base && base.length <= 1 ?
        {...base, length: base.length + description.removed.length,
          removed: description.removed} :
        null;
    }
    default:
      return plain([description], description.values.length);
  }
}

function laboured(shape: Shape): boolean {
  return shape.removed.length > 0 ||
    shape.interval > 1 && !shape.round && !shape.alternate && !shape.open;
}

/** The values a list of candidate descriptions stands for. */
function valuesOf(candidates: SetDescription[], domain: Domain): number[] {
  return denote(candidates[candidates.length - 1], domain);
}

/**
 * The sayable shape that names the fewest things. On a tie the earliest
 * candidate wins, but a run that wraps round gives way to an exception.
 * `sayable` is the field's own say in what it has a device for; it must
 * accept a plain list of values.
 */
function choose(
  candidates: SetDescription[],
  scale: Scale,
  sayable: Sayable
): Shape {
  const count = valuesOf(candidates, scale.domain).length;
  const shapes: Shape[] = [];

  candidates.forEach(function consider(candidate) {
    const shape = shapeOf(candidate, scale);
    const easy = shape !== null && sayable(shape, count) &&
      (!laboured(shape) || count > easilyListed && shape.length < count);

    if (shape !== null && easy) {
      shapes.push(shape);
    }
  });

  return shapes.reduce(function fewer(best, shape) {
    const tieBroken = shape.length === best.length &&
      shape.removed.length > 0 && ranges(best).some(wrapsRound);

    return shape.length < best.length || tieBroken ? shape : best;
  });
}

function wrapsRound(description: SetDescription): boolean {
  return description.kind === 'range' && description.from > description.to ||
    description.kind === 'pieces' && description.parts.some(wrapsRound);
}

function isCadence(description: SetDescription): boolean {
  return description.kind === 'cadence';
}

function notCadence(description: SetDescription): boolean {
  return description.kind !== 'cadence';
}

/**
 * The candidates in the order Chinese says them: as the core walks them
 * when a run wraps round the field and may be said to, and otherwise
 * described afresh in ascending order.
 */
function arranged(
  offered: SetDescription[],
  domain: Domain,
  mayWrap: boolean
): SetDescription[] {
  if (mayWrap && offered.some(wrapsRound) || !domain.cyclic ||
      offered[0].kind === 'all') {
    return offered;
  }

  const ascending =
    describeSet(valuesOf(offered, domain), {...domain, cyclic: false});

  return [...offered.filter(isCadence), ...ascending.filter(notCadence)];
}

/**
 * A field's candidates, arranged. Never asked of a Quartz field, which
 * has none.
 */
function setsOf(
  facts: ScheduleFacts,
  field: Field,
  mayWrap: boolean
): SetDescription[] {
  return arranged(facts.analyses.candidates[field] as SetDescription[],
    domainOf(field), mayWrap);
}

/** The weekday candidates, counted from Monday with Sunday last. */
function weekSets(facts: ScheduleFacts): SetDescription[] {
  const days = valuesOf(setsOf(facts, 'weekday', true), domainOf('weekday'))
    .map(function fromMonday(day) {
      return day || week.max;
    })
    .sort(function ascending(a, b) {
      return a - b;
    });

  return arranged(describeSet(days, week), week, true);
}

/** Whether every one of the fields takes every value. */
function unrestricted(facts: ScheduleFacts, fields: Field[]): boolean {
  return fields.every(function open(field) {
    return facts.analyses.candidates[field]?.[0].kind === 'all';
  });
}

/** The runs among a shape's parts. */
function ranges(shape: Shape): RangeDescription[] {
  return shape.parts.filter(function isRun(part): part is RangeDescription {
    return part.kind === 'range';
  });
}

/** The values a shape names one by one. */
function strays(shape: Shape): number[] {
  return shape.parts.flatMap(function named(part) {
    return part.kind === 'values' ? part.values : [];
  });
}

/** Groups joined as pieces: the list comma between, and 及 before the last. */
function andLast(groups: string[]): string {
  return [groups.slice(0, -1).join(marks.list), ...groups.slice(-1)]
    .filter(Boolean).join(words.and);
}

/** A run from its first member to its last, marked where it wraps. */
function span(
  range: RangeDescription,
  name: (value: number) => string,
  next: string
): string {
  return name(range.from) + words.to +
    (range.from > range.to ? next : '') + name(range.to);
}

/** Runs and listed values, each named, joined as pieces. */
function listed(
  parts: Part[],
  name: (value: number) => string,
  next: string
): string {
  return andLast(parts.map(function say(part) {
    return part.kind === 'range' ?
      span(part, name, next) :
      part.values.map(name).join(marks.list);
  }));
}

/** Names with words around them; nothing when there are no names. */
function around(before: string, names: string, after: string): string {
  return names ? before + names + after : '';
}

/** What is taken out, in brackets; nothing when nothing is. */
function excepted(groups: string[]): string {
  return around(marks.open, groups.filter(Boolean).join(words.and),
    words.excepted + marks.close);
}

/** One of two words, by whether a cadence starts on an even value. */
function parity(shape: Shape, even: string, odd: string): string {
  return [even, odd][ranges(shape)[0].from % 2];
}

export {
  andLast, around, choose, excepted, listed, parity, ranges, scales, setsOf,
  span, strays, unrestricted, valuesOf, weekSets
};
