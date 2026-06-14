/**
 * @license MIT, Copyright (c) 2026 Andrew Brož
 */

// A cron pattern to English interpreter. The language-independent core
// (parsing, validation, normalization, analysis) lives in ./core; the
// English renderer lives in ./lang/en. See docs/i18n-design.md.
//
// `options` include:
// - ampm (boolean):
//     use AM/PM instead of zero-padded 24-hour time
// - dialect ('us' | 'uk' | 'house' | object):
//     'us' (default) follows the Chicago Manual of Style; 'uk' follows the
//     Guardian style guide; 'house' is the legacy cronli5 voice; an object
//     defines a custom style over the US defaults (see docs/dialects.md)
// - lenient (boolean):
//     never throw; invalid input returns a fallback description
// - seconds (boolean):
//     always treat the first value in a string or array as a second
// - short (boolean):
//     use shorthand, numeric representations, and hyphenated ranges
// - years (boolean):
//     read the trailing field of a six-field pattern as a year (seven-field
//     patterns always parse seconds first and year last)

import {analyze, prepare} from './core/index.js';
import en from './lang/en/index.js';

function cronli5(cronPattern, options) {
  // A language module is a value (docs/i18n-design.md §3); English is the
  // bundled default.
  const lang = options && options.lang || en;
  const opts = lang.options(options);

  if (!opts.lenient) {
    return interpretCronPattern(cronPattern, lang, opts);
  }

  // Lenient mode never throws: unparseable input yields a fixed fallback
  // description instead, so arbitrary user crontabs are safe to render.
  try {
    return interpretCronPattern(cronPattern, lang, opts);
  }
  catch {
    return lang.fallback;
  }
}

// Prepare (parse, validate, normalize), analyze, and describe a cron
// pattern.
function interpretCronPattern(cronPattern, lang, opts) {
  // `@reboot` runs on startup and has no field schedule to interpret.
  if (typeof cronPattern === 'string' &&
      cronPattern.trim().toLowerCase() === '@reboot') {
    return lang.reboot;
  }

  return lang.describe(analyze(prepare(cronPattern, opts)), opts);
}

export default cronli5;
