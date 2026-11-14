// Sets of field values, as Chinese says them: runs, lists in which a run
// is a range, and the choice between a set and a simpler set with a few
// values excepted. No words of the time or the date live here.

import type {Domain, SetDescription} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';
import lexicon from './lexicon.js';

const {marks, words} = lexicon;

/** Consecutive values, in the order they are said. */
export type Run = number[];

/** An evenly spaced set, as the core describes it. */
export type Cadence = Extract<SetDescription, {kind: 'cadence'}>;

/** A simpler set with values removed, as the core describes it. */
export type Exception = Extract<SetDescription, {kind: 'except'}>;

/** Whether a field may be said as this exception, given what fires. */
export type Allowed = (exception: Exception, kept: number[]) => boolean;

/** A set as it is said: the values named, and those excepted from them. */
export interface Chosen {
  removed: number[];
  values: number[];
}

// How many values are listed before a longer set needs another device.
const LISTED = 8;

// How many consecutive days, months or years make a range.
const RANGE = 3;

function lastOf<T>(items: T[]): T {
  return items[items.length - 1];
}

/** The text, or nothing. */
function when(applies: boolean, text: string): string {
  return applies ? text : '';
}

/** The answer of the first row that applies, as a table is read. */
function first<T>(rows: Array<[boolean, T]>): T {
  return rows.filter(function applies(row) {
    return row[0];
  })[0][1];
}

/** No exception is ever said. */
function never(): boolean {
  return false;
}

/** The maximal runs of consecutive values, ascending. */
function linearRuns(values: number[]): Run[] {
  const held = new Set(values);
  const starts = values.map((value, at) => at)
    .filter((at) => !held.has(values[at] - 1));

  return starts.map((start, at) => values.slice(start, starts[at + 1]));
}

/**
 * The runs in the order they are said: ascending by their first value.
 * Where the field may wrap, a run that leaves the top of the domain and
 * resumes at the bottom is one run of at least `least` values; it begins
 * later than every other, so it comes last.
 */
function runsOf(
  values: number[],
  domain: Domain,
  wraps: boolean,
  least = 2
): Run[] {
  const runs = linearRuns(values);
  const across = [...lastOf(runs), ...runs[0]];
  const joins = wraps && runs.length > 1 && values[0] === domain.min &&
    lastOf(values) === domain.max && across.length >= least;

  return joins ? [...runs.slice(1, -1), across] : runs;
}

/** The evenly spaced cadence a set forms, if the core finds one. */
function cadenceOf(values: number[], domain: Domain): Cadence | undefined {
  return describeSet(values, domain).find(function isCadence(found) {
    return found.kind === 'cadence';
  }) as Cadence | undefined;
}

/** Whether the values are every second one from end to end of the domain. */
function everyOther(values: number[], domain: Domain): boolean {
  return values.length > 1 && values[0] <= domain.min + 1 &&
    lastOf(values) >= domain.max - 1 &&
    values.every((value, at) => at === 0 || value - values[at - 1] === 2);
}

/** Whether the values are more than can be listed, each two apart. */
function everySecond(values: number[]): boolean {
  return values.length > LISTED &&
    values.every((value, at) => at === 0 || value - values[at - 1] === 2);
}

/**
 * The set as it is said. A single run is always itself; otherwise the
 * first exception the core offers that the field allows is taken, and the
 * set becomes that exception's base with the removed values apart.
 */
function chosen(values: number[], domain: Domain, allowed: Allowed): Chosen {
  const found = describeSet(values, domain);
  const [shortest] = found;
  const straight = shortest.kind === 'range' && shortest.from <= shortest.to;
  const exception = found.find(function fits(candidate) {
    return !straight && candidate.kind === 'except' &&
      allowed(candidate, values);
  }) as Exception | undefined;

  return exception ?
    {removed: exception.removed, values: denote(exception.base, domain)} :
    {removed: [], values};
}

/**
 * The runs as items of a list: a run of at least `least` values is a range
 * from its first to its last, and a shorter one is its values. A range
 * that wraps is marked with `next` before its end.
 */
function listed(
  runs: Run[],
  least: number,
  name: (value: number) => string,
  next = ''
): string[] {
  return runs.flatMap(function items(run) {
    return run.length >= least ?
      [name(run[0]) + words.to + when(run[0] > lastOf(run), next) +
        name(lastOf(run))] :
      run.map(name);
  });
}

/** Items after the enumeration comma. */
function series(items: string[]): string {
  return items.join(marks.list);
}

export {
  LISTED, RANGE, cadenceOf, chosen, everyOther, everySecond, first, lastOf,
  linearRuns, listed, never, runsOf, series, when
};
