// Months, and the tight way calendar numbers are written: values and
// ranges joined with «·», a range with «~».

import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {Described} from './sets.js';
import {choose, ofKind, parityOf, setOf} from './sets.js';

const {units, words} = lexicon;

const monthParities = [words.evenMonths, words.oddMonths];

const tightSayers: {[kind: string]: (form: never) => string[]} = {
  pieces(form: {parts: Described[]}) {
    return form.parts.flatMap(function each(part) {
      return tightParts(part);
    });
  },
  range(form: {from: number; to: number}) {
    return [`${form.from}${words.rangeMark}${form.to}`];
  },
  values(form: {values: number[]}) {
    return form.values.map(String);
  }
};

/** The items of a tight list: each value, and each run as «a~b». */
function tightParts(form: Described): string[] {
  return tightSayers[form.kind](form as never);
}

/**
 * A set of months: «홀수 달», or its months and runs with «월» on every
 * item («6~8월·12월»). A cadence of months is always a list.
 */
function monthsSaid(months: number[]): string {
  const set = setOf(months, domainOf('month'));
  const form = choose(set, {ceiling: 12, few: 12});
  const parity = parityOf(ofKind(set.candidates, 'cadence') ?? form,
    set.domain, monthParities);

  return parity || tightParts(form).map(function unit(item) {
    return `${item}${units.month}`;
  }).join(words.listMark);
}

// What a month phrase takes before a date: «매월» after one written with
// `~`, «의» after a list, nothing after one month or a named set.
function tieOf(months: string): string {
  return months.includes(words.rangeMark) && ` ${words.everyMonth}` ||
    months.includes(words.listMark) && words.of || '';
}

/**
 * A day phrase under its months: «매월 1일» when every month fires,
 * «6월 1일», «1월·7월의 1일», «6~8월 매월 1일».
 */
function dated(months: number[] | null, day: string): string {
  const said = months && monthsSaid(months);

  return said ? `${said}${tieOf(said)} ${day}` : `${words.everyMonth} ${day}`;
}

export {dated, monthsSaid, tightParts};
