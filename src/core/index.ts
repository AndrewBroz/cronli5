// The language-independent core: everything that is true about a cron
// pattern regardless of the language describing it. Language modules
// import the semantic toolkit from here and own all words themselves.
// See docs/i18n-design.md.

import {applyQuartzAliases, normalizeCronPattern} from './normalize.js';
import type {Pattern} from './schedule.js';
import type {Reading} from './reading.js';
import {applyReading} from './quartz.js';
import {parseCronPattern} from './parse.js';
import type {CronPattern} from '../types.js';
import {validateCronPattern} from './validate.js';

// Parse, apply the reading, alias, validate, and normalize cron input into
// a canonical cron-like object of string fields, ready for semantic
// analysis and rendering. The reading runs first: it settles the `?` token
// and re-indexes the day-of-week to the canonical cron numbering the rest
// of the core expects.
function prepare(cronPattern: CronPattern, opts: Partial<Reading>): Pattern {
  const pattern = parseCronPattern(cronPattern, opts);

  // A macro is written in no scheduler's numbering: `@weekly` is Sunday
  // whatever number the caller's patterns use for it.
  const macro = typeof cronPattern === 'string' &&
    cronPattern.trim().startsWith('@');

  applyReading(pattern, macro ? {...opts, weekdaysFrom: 0} : opts);
  applyQuartzAliases(pattern);
  validateCronPattern(pattern);

  return normalizeCronPattern(pattern);
}

export {prepare};
export * from './errors.js';
export * from './reading.js';
export * from './specs.js';
export * from './util.js';
export * from './analyze.js';
export * from './describe-set.js';
export * from './select.js';
export * from './fusions.js';
