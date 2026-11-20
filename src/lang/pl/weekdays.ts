// The days of the week, walked from Monday: one day, a run, pieces, a
// list, the six or five days left when one or two are missing, and the
// nth or last such day of a month.

import type {
  QuartzWeekday, RangeDescription, ScheduleFacts, SetDescription,
  ValuesDescription
} from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import lexicon from './lexicon.js';
import type {WeekdayName} from './lexicon.js';
import {listed, pieced, words} from './text.js';

/** A weekday phrase, and whether it is compound (pieces, an exception). */
export interface WeekdaysSaid {
  text: string;
  compound: boolean;
}

type Maybe<T> = T | false | null | undefined;
type Part = RangeDescription | ValuesDescription;
type NameCase = 'accusativePlural' | 'accusativeSingular' |
  'genitivePlural' | 'genitiveSingular';

// The candidates from Monday, and the style.
interface WeekSet {
  cands: SetDescription[];
  short: boolean;
  // Whether an exception may be said: never inside a union.
  subtracts: boolean;
}

const minRun = 3;

function pick<K extends SetDescription['kind']>(
  cands: SetDescription[],
  kind: K
): Extract<SetDescription, {kind: K}> | undefined {
  return cands.find(function ofKind(cand) {
    return cand.kind === kind;
  }) as Extract<SetDescription, {kind: K}> | undefined;
}

function valuesOf(set: WeekSet): number[] {
  return (pick(set.cands, 'values') as ValuesDescription).values;
}

// A weekday's name in a case, or its abbreviation, which has one form.
function name(day: number, form: NameCase, short: boolean): string {
  const weekday: WeekdayName = lexicon.weekdays[day];

  return [weekday[form], weekday.short][Number(short)];
}

/** «od poniedziałku do piątku». */
function fromTo(from: number, to: number, short: boolean): string {
  return `${words.from} ${name(from, 'genitiveSingular', short)} ` +
    `${words.to} ${name(to, 'genitiveSingular', short)}`;
}

// «w poniedziałki, środy i piątki»: the preposition is that of the first
// day's full name.
function days(values: number[], short: boolean): string {
  return `${lexicon.weekdays[values[0]].w} ` +
    `${listed(values.map(function plural(day) {
      return name(day, 'accusativePlural', short);
    }))}`;
}

// One day missing, or two when the five left are not one run.
function allBut(set: WeekSet): Maybe<WeekdaysSaid> {
  const found = set.cands.find(function fromAll(cand) {
    return cand.kind === 'except' && cand.base.kind === 'all';
  }) as Extract<SetDescription, {kind: 'except'}> | undefined;
  const missing = found ? found.removed : [];
  const applies = set.subtracts &&
    (missing.length === 1 ||
      missing.length === 2 && !pick(set.cands, 'range'));

  return applies && {
    compound: true,
    text: `${words.daily} ${words.except} ` +
      `${listed(missing.map(function plural(day) {
        return name(day, 'genitivePlural', set.short);
      }))}`
  };
}

// A run of three or more, round the week's end or not.
function run(set: WeekSet): Maybe<WeekdaysSaid> {
  const range = pick(set.cands, 'range');

  return range && valuesOf(set).length >= minRun &&
    {compound: false, text: fromTo(range.from, range.to, set.short)};
}

function firstOf(part: Part): number {
  return lexicon.weekOrder.indexOf(
    (part as RangeDescription).from ?? (part as ValuesDescription).values[0]);
}

function pieces(set: WeekSet): Maybe<WeekdaysSaid> {
  const found = pick(set.cands, 'pieces');

  return found && {
    compound: true,
    text: pieced(found.parts.slice().sort(function byWeek(a, b) {
      return firstOf(a) - firstOf(b);
    }).map(function part(piece) {
      return piece.kind === 'range' ?
        fromTo(piece.from, piece.to, set.short) :
        days(piece.values, set.short);
    }))
  };
}

function list(set: WeekSet): WeekdaysSaid {
  return {compound: false, text: days(valuesOf(set), set.short)};
}

const kinds = [allBut, run, pieces, list];

/** A plain set of weekdays. */
function sayWeekdays(
  facts: ScheduleFacts,
  subtracts: boolean,
  short: boolean
): WeekdaysSaid {
  const set = {
    cands: candidatesAs(facts, 'weekday', {first: 1}) as SetDescription[],
    short,
    subtracts
  };

  return kinds.reduce<Maybe<WeekdaysSaid>>(function first(found, kind) {
    return found || kind(set);
  }, null) as WeekdaysSaid;
}

/**
 * The nth or the last such weekday: «w drugi poniedziałek», «w ostatnią
 * sobotę». The ordinal agrees with the weekday's gender.
 */
function sayNthWeekday(form: QuartzWeekday, short: boolean): string {
  const feminine = Number(lexicon.weekdays[form.weekday].feminine);
  const nth = (form as {nth?: number}).nth;
  const ordinal = nth ?
    [lexicon.ordinals.nthMasculine, lexicon.ordinals.nthFeminine][
      feminine][nth - 1] :
    [words.lastMasculine, words.lastFeminine][feminine];

  return `${words.in} ${ordinal} ` +
    `${name(form.weekday, 'accusativeSingular', short)}`;
}

export {fromTo, sayNthWeekday, sayWeekdays};
