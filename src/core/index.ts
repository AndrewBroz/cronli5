// The language-independent core: everything that is true about a cron
// pattern regardless of the language describing it. Language modules
// import the semantic toolkit from here and own all words themselves.
// See docs/i18n-design.md.

import {applyQuartzAliases, normalizeCronPattern} from './normalize.js';
import type {NormalizedOptions, Pattern} from './schedule.js';
import {parseCronPattern} from './parse.js';
import type {CronPattern} from '../types.js';
import {validateCronPattern} from './validate.js';

// Parse, alias, validate, and normalize cron input into a canonical
// cron-like object of string fields, ready for semantic analysis and
// rendering.
function prepare(cronPattern: CronPattern, opts: NormalizedOptions): Pattern {
  const pattern = parseCronPattern(cronPattern, opts);

  applyQuartzAliases(pattern);
  validateCronPattern(pattern);

  return normalizeCronPattern(pattern);
}

export {prepare};
export * from './specs.js';
export * from './util.js';
export * from './weekday.js';
export * from './cadence.js';
export * from './shapes.js';
export * from './analyze.js';
