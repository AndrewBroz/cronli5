/**
 * @license MIT, Copyright (c) 2026 Andrew Brož
 */

// A cron pattern to plain language interpreter. The language-independent
// code (parsing, validation, normalization, analysis) is in ./core.
// Language-specific renderers live in ./lang. See docs/i18n-design.md.
//
// `options` include:
// - ampm (boolean):
//     use AM/PM instead of zero-padded 24-hour time
// - dialect ('us' | 'gb' | 'house' | object):
//     'us' (default) follows the Chicago Manual of Style; 'gb' follows the
//     Guardian style guide; 'house' is the legacy cronli5 voice; an object
//     defines a custom style over the US defaults (see docs/dialects.md).
//     'uk' is a deprecated alias for 'gb'
// - lenient (boolean):
//     never throw; invalid input returns a fallback description
// - sentence (boolean):
//     return a complete sentence ("Runs every day at midnight.") instead of
//     the embeddable fragment; wraps a schedule and @reboot, not the fallback
// - seconds (boolean):
//     always treat the first value in a string or array as a second
// - short (boolean):
//     use shorthand, numeric representations, and hyphenated ranges
// - years (boolean):
//     read the trailing field of a six-field pattern as a year (seven-field
//     patterns always parse seconds first and year last)

import {analyze, prepare} from './core/index.js';
import {Cronli5InputError} from './core/errors.js';
import type {NormalizedOptions} from './core/schedule.js';
import type {Cronli5, CronPattern, Cronli5Language, Cronli5Options}
  from './types.js';
import en from './lang/en/index.js';

function cronli5(cronPattern: CronPattern, options?: Cronli5Options): string {
  // A language module is a value (docs/i18n-design.md §3); English is the
  // bundled default.
  const lang = options && options.lang || en;
  const opts = lang.options(options) as NormalizedOptions;

  if (!opts.lenient) {
    return present(
      interpretCronPattern(cronPattern, lang, opts), lang, options, opts);
  }

  // Lenient mode never throws on bad INPUT: unparseable input yields a fixed
  // fallback description instead, so arbitrary user crontabs are safe to
  // render. The fallback is an error string, not a schedule, so it is never
  // wrapped. Only the typed input rejection is converted — any other
  // exception is a genuine defect (e.g. a renderer bug on a valid pattern)
  // and must propagate rather than masquerade as the fallback.
  try {
    return present(
      interpretCronPattern(cronPattern, lang, opts), lang, options, opts);
  }
  catch (error) {
    if (error instanceof Cronli5InputError) {
      return lang.fallback(opts);
    }

    throw error;
  }
}

// With the `sentence` option, wrap a schedule (or `@reboot`) description as the
// language's complete sentence; otherwise return the embeddable fragment.
function present(
  description: string,
  lang: Cronli5Language,
  options: Cronli5Options | undefined,
  opts: NormalizedOptions
): string {
  return options && options.sentence ?
    lang.sentence(description, opts) :
    description;
}

// Prepare (parse, validate, normalize), analyze, and describe a cron
// pattern.
function interpretCronPattern(
  cronPattern: CronPattern,
  lang: Cronli5Language,
  opts: NormalizedOptions
): string {
  // `@reboot` runs on startup and has no field schedule to interpret.
  if (typeof cronPattern === 'string' &&
      cronPattern.trim().toLowerCase() === '@reboot') {
    return lang.reboot(opts);
  }

  // Analyze into the neutral facts + the core's suggested plan, then let the
  // language optionally override the plan before rendering. A language
  // without a `plan` hook renders the core's suggestion unchanged.
  const schedule = analyze(prepare(cronPattern, opts));
  const plan = lang.plan ? lang.plan(schedule, schedule.plan) : schedule.plan;

  return lang.describe({...schedule, plan}, opts);
}

// Two named convenience methods are attached to the callable export as sugar
// over the `sentence` option: `.sentence(...)` forces the capitalized
// standalone, `.fragment(...)` forces the embeddable fragment (the default).
// The method's own intent wins, so a passed-through `sentence` flag is
// overridden. There is no `toString` method on purpose — it would shadow
// `Function.prototype.toString` (called arg-less by `String()`, template
// literals, and console/debug) and break coercion; named methods sidestep that.
function sentence(cronPattern: CronPattern, options?: Cronli5Options): string {
  return cronli5(cronPattern, {...options, sentence: true});
}

function fragment(cronPattern: CronPattern, options?: Cronli5Options): string {
  return cronli5(cronPattern, {...options, sentence: false});
}

const callable: Cronli5 = Object.assign(cronli5, {sentence, fragment});

export default callable;
export {Cronli5InputError} from './core/errors.js';
export type {
  Cronli5, Cronli5Dialect, Cronli5Language, Cronli5Options, CronPattern,
  CronPatternObject
} from './types.js';
