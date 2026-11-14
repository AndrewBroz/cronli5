// Which form of a word is said: a unit by its count, a name by whether
// names are abbreviated.

import type {Name} from './lexicon.js';
import type {EnglishOptions} from './options.js';
import lexicon from './lexicon.js';

type UnitName = keyof typeof lexicon.units;

/** A unit after "every" or the number one, or after any other number. */
function unit(name: UnitName, count: number): string {
  return lexicon.units[name][count === 1 ? 'one' : 'many'];
}

/**
 * A month or a weekday by name: in its `long` form (in full, or the
 * plural a recurring weekday takes), or abbreviated, which has one form.
 */
function named<N extends Name>(name: N, long: keyof N, opts: EnglishOptions):
  N[keyof N] {
  return name[opts.style.short ? 'short' : long];
}

export type {UnitName};
export {named, unit};
