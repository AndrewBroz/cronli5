// What stands in front of a description: the years, then the months.

import type {
  CadenceDescription, CadencePieces, RangeDescription, ScheduleFacts,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import {every, listed, pieced, units, words} from './text.js';

/** The years as said, and the mark the phrase takes after it. */
export interface Years {
  text: string;
  // A colon after a step, a comma after pieces and after «włącznie».
  mark: string;
  // The year, when there is exactly one.
  single: number | null;
}

/** How a set of months is said. */
export type MonthKind = 'list' | 'none' | 'one' | 'outside' | 'pieces' |
  'range';

/** The months as a frame. */
export interface Months {
  kind: MonthKind;
  text: string;
  // The months, ascending, when they are named one by one.
  values: number[];
}

type Maybe<T> = T | false | null | undefined;
type Part = CadenceDescription | RangeDescription | ValuesDescription;

const dash = '–';
const few = 4;
const minRun = 3;
const maxListed = 12;
const none: Years = {mark: '', single: null, text: ''};

function pick<K extends SetDescription['kind']>(
  cands: SetDescription[],
  kind: K
): Extract<SetDescription, {kind: K}> | undefined {
  return cands.find(function ofKind(cand) {
    return cand.kind === kind;
  }) as Extract<SetDescription, {kind: K}> | undefined;
}

function outsideOf(cands: SetDescription[]): number[] {
  const found = cands.find(function fromAll(cand) {
    return cand.kind === 'except' && cand.base.kind === 'all' &&
      cand.removed.length <= 2;
  }) as Extract<SetDescription, {kind: 'except'}> | undefined;

  return found ? found.removed : [];
}

function years(text: string, mark: string): Years {
  return {mark, single: null, text};
}

function inYears(list: string): string {
  return `${words.in} ${words.inYears} ${list}`;
}

// «w 2030 r.», «w latach 2030 i 2035».
function someYears(values: number[]): Years {
  return values.length === 1 ?
    {mark: '', single: values[0],
      text: `${words.in} ${values[0]} ${words.year}`} :
    years(inYears(listed(values)), '');
}

// A run with no end is its start; one from the field's first year has
// only an end, which a bare «do» would leave in doubt.
function yearRange(range: RangeDescription): Years {
  const first = domainOf('year').min;

  return range.open &&
    years(`${words.from} ${range.from} ${words.year}`, '') ||
    range.from === first && years(
      `${words.to} ${range.to} ${words.year} ${words.inclusive}`, ',') ||
    years(inYears(`${range.from}${dash}${range.to}`), '');
}

// Every second year by parity; any other step first in its part, then
// the span it runs over, and a colon. A few years are a list.
function yearCadence(cadence: CadenceDescription): Years {
  const {interval, last, start} = cadence;
  const span = cadence.open ?
    ` ${words.from} ${start} ${words.year}` :
    ` ${words.from} ${start} ${words.to} ${last} ${words.year}`;
  const wholeField = cadence.open &&
    start - domainOf('year').min < interval;
  const parity = `${words.in} ` +
    `${[words.evenYears, words.oddYears][start % 2]}` +
    `${span.repeat(Number(!wholeField))}`;

  return (last - start) / interval < few &&
    someYears([start, start + interval, start + 2 * interval,
      start + 3 * interval].filter(function reached(year) {
      return year <= last;
    })) ||
    interval === 2 && years(parity, '') ||
    years(`${every(interval, units.year, false)}${span}`, ':');
}

function yearPart(part: Part): Years {
  return part.kind === 'range' && yearRange(part) ||
    part.kind === 'cadence' && yearCadence(part) ||
    someYears((part as ValuesDescription).values);
}

// A run of years as bare digits; one with no end is its start.
function yearRun(range: RangeDescription): string {
  return range.open ?
    `${words.from} ${range.from} ${words.year}` :
    `${range.from}${dash}${range.to}`;
}

// Runs and single years under one «w latach».
function yearPieces(cands: SetDescription[]): Maybe<Years> {
  const found = pick(cands, 'pieces');
  const loose = found ? found.parts.flatMap(function single(part) {
    return part.kind === 'values' ? part.values : [];
  }) : [];

  return found && loose.length <= maxListed && years(
    inYears(pieced(found.parts.map(function bare(part) {
      return part.kind === 'range' ?
        yearRun(part) :
        listed(part.values);
    }))), ',');
}

// More years than a list holds, as runs and rhythms together, each part
// in its own form. The last part's step keeps its colon; otherwise pieces
// take a comma.
function yearParts(found: CadencePieces | null, count: number):
  Maybe<Years> {
  const parts = found ? found.parts.map(yearPart) : [];
  const last = parts[parts.length - 1];

  const texts = parts.map(function text(part) {
    return part.text;
  });

  return found && count > maxListed &&
    years(pieced(texts), last.mark === ':' && ':' || ',');
}

// The kinds of a set of years, in the order they are tried.
const yearKinds: Array<(cands: SetDescription[], values: number[]) =>
  Maybe<Years>> = [
  function unrestricted(cands) {
    return cands[0].kind === 'all' && none;
  },
  function one(cands, values) {
    return values.length === 1 && someYears(values);
  },
  function run(cands, values) {
    const range = pick(cands, 'range');

    return range && values.length >= minRun && yearRange(range);
  },
  function allBut(cands) {
    const outside = outsideOf(cands);
    const lead = [words.outsideYear, words.outsideYears][
      Number(outside.length > 1)];

    return outside.length > 0 && years(`${lead} ${listed(outside)}`, '');
  },
  yearPieces,
  function fewYears(cands, values) {
    return values.length <= few && someYears(values);
  },
  function rhythm(cands) {
    const cadence = pick(cands, 'cadence');

    return cadence && yearCadence(cadence);
  }
];

/** The years in front. */
function sayYears(facts: ScheduleFacts): Years {
  const cands = facts.analyses.candidates.year as SetDescription[];
  const values = (pick(cands, 'values') || {values: []}).values;

  return yearKinds.reduce<Maybe<Years>>(function first(found, kind) {
    return found || kind(cands, values);
  }, null) ||
    yearParts(facts.analyses.cadencePieces.year, values.length) ||
    someYears(values);
}

function monthsIn(values: number[]): string {
  return `${lexicon.months[values[0]].w} ` +
    `${listed(values.map(function locative(month) {
      return lexicon.months[month].locative;
    }))}`;
}

function monthRange(range: RangeDescription): string {
  return `${words.from} ${lexicon.months[range.from].genitive} ` +
    `${words.to} ${lexicon.months[range.to].genitive}`;
}

function firstOf(part: RangeDescription | ValuesDescription): number {
  return (part as RangeDescription).from ??
    (part as ValuesDescription).values[0];
}

function monthPieces(cands: SetDescription[]): string {
  const found = pick(cands, 'pieces');

  return found ? pieced(found.parts.slice().sort(function byFirst(a, b) {
    return firstOf(a) - firstOf(b);
  }).map(function part(piece) {
    return piece.kind === 'range' ?
      monthRange(piece) :
      monthsIn(piece.values);
  })) : '';
}

function months(kind: MonthKind, text: string, values: number[]): Months {
  return {kind, text, values};
}

// One month, or all but one or two.
function fewMonths(cands: SetDescription[], values: number[]): Maybe<Months> {
  const outside = outsideOf(cands);

  return values.length === 1 && months('one', monthsIn(values), values) ||
    outside.length > 0 && months('outside',
      `${words.outside} ${listed(outside.map(function instrumental(month) {
        return lexicon.months[month].instrumental;
      }))}`, values);
}

/**
 * The months a description names: one, all but one or two, a run of
 * three or more, pieces, or a list however they are spaced.
 */
function sayMonths(cands: SetDescription[]): Months {
  const values = (pick(cands, 'values') || {values: []}).values;
  const range = pick(cands, 'range');
  const pieces = monthPieces(cands);

  return cands[0].kind === 'all' && months('none', '', []) ||
    fewMonths(cands, values) ||
    range && values.length >= minRun &&
      months('range', monthRange(range), values) ||
    pieces !== '' && months('pieces', pieces, values) ||
    months('list', monthsIn(values), values);
}

export {sayMonths, sayYears};
