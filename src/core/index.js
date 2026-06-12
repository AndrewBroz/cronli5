// The language-independent core: everything that is true about a cron
// pattern regardless of the language describing it. Language modules
// import the semantic toolkit from here and own all words themselves.
// See docs/i18n-design.md.

import {applyQuartzAliases, normalizeCronPattern} from './normalize.js';
import {parseCronPattern} from './parse.js';
import {validateCronPattern} from './validate.js';

// Parse, alias, validate, and normalize cron input into a canonical
// cron-like object of string fields, ready for semantic analysis and
// rendering.
function prepare(cronPattern, opts) {
  const pattern = parseCronPattern(cronPattern, opts);

  applyQuartzAliases(pattern);
  validateCronPattern(pattern);
  normalizeCronPattern(pattern);

  return pattern;
}

export {prepare};
export * from './specs.js';
export * from './util.js';
export * from './shapes.js';
export * from './analyze.js';
