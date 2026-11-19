// The small phrases every part of the sentence is made of: a list, a
// spread of values with its runs and stray values, and an exception.

import lexicon from './lexicon.js';
import type {Spread} from './sets.js';
import {even} from './sets.js';

const {marks, words} = lexicon;

/** The text, or nothing. */
function when(condition: boolean, text: string): string {
  return condition ? text : '';
}

/** Whole items standing in parallel: 1日・15日. */
function listOf(items: string[]): string {
  return items.join(marks.list);
}

/** What is left out, each kind of thing joined to the next: 3時台と毎時30分を除く. */
function leftOut(items: string[]): string {
  const said = items.filter(Boolean);

  return when(said.length > 0, said.join(words.and) + words.excepted);
}

/** An exception in brackets, after what it is taken from. */
function bracketed(items: string[]): string {
  const said = leftOut(items);

  return when(said.length > 0, marks.open + said + marks.close);
}

/** Notes on what stands before them, in one pair of brackets. */
function noted(notes: string[]): string {
  const said = notes.filter(Boolean);

  return when(said.length > 0,
    marks.open + said.join(marks.comma) + marks.close);
}

/**
 * A spread in words. Each run names both ends. Runs of one step share it
 * after それぞれ; runs that differ each say their own and are joined, like
 * the values that stand alone after them, by および. `next` is the word
 * for an end that falls after the cycle turns.
 */
function saySpread(
  spread: Spread,
  say: (value: number) => string,
  unit: string,
  next = ''
): string {
  const windows = spread.runs.map(function window([from, to]) {
    return say(from) + words.from + when(from > to, next) + say(to) +
      words.to;
  });
  const paces = spread.runs.map((run) => run[2] + unit + words.each);
  const shared = when(windows.length > 1, marks.comma + words.eachOne);
  const cadences = even(spread) ?
    [when(windows.length > 0, windows.join(words.and) + shared + paces[0])] :
    windows.map((window, index) => window + paces[index]);
  const strays = listOf(spread.strays.map((value) => say(value)));

  return [...cadences, strays].filter(Boolean).join(marks.comma + words.also);
}

export {bracketed, leftOut, listOf, noted, saySpread, when};
