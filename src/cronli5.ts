/**
 * @license MIT, Copyright (c) 2026 Andrew Brož
 */

// A cron pattern to plain language interpreter. The language-independent
// code (parsing, validation, normalization, analysis) is in ./core.
// Language-specific renderers live in ./lang. See docs/i18n-design.md.
//
// `options` include:
// - lang (string | module):
//     a language code, with an optional region ('en', 'en-GB'), or an
//     imported language module
// - style (object):
//     overrides of the language's style table, such as {hour12: false}
// - form ('fragment' | 'label' | 'sentence'):
//     an embeddable fragment ("at midnight every day"), a capitalised
//     label, or a complete sentence ("Runs at midnight every day.")
// - cron ('standard' | 'quartz'):
//     the flavour of cron the pattern is written in; `seconds`, `years`,
//     `weekdaysFrom` and `questionMark` set one fact of the reading each
// - lenient (boolean):
//     a bad pattern returns a fallback description instead of throwing

import {analyze, prepare} from './core/index.js';
import {Cronli5InputError} from './core/errors.js';
import type {Cronli5, Cronli5AnyStyle, CronPattern, Cronli5Setup}
  from './types.js';
import type {Resolved, Setup} from './options.js';
import {resolve, setupOf} from './options.js';
import en from './lang/en/index.js';

// Prepare (parse, validate, normalize), analyze, and describe a cron
// pattern, presented in the form asked for.
function interpret(cronPattern: CronPattern, resolved: Resolved): string {
  const {form, language, opts} = resolved;
  // `@reboot` runs on startup and has no field schedule to interpret.
  const startup = typeof cronPattern === 'string' &&
    cronPattern.trim().toLowerCase() === '@reboot';
  const description = startup ?
    language.reboot(opts) :
    language.describe(analyze(prepare(cronPattern, opts)), opts);

  return {
    fragment: description,
    label: language.label(description, opts),
    sentence: language.sentence(description, opts)
  }[form];
}

function describeWith(
  setup: Setup,
  cronPattern: CronPattern,
  options?: unknown
): string {
  // Options are resolved before anything can be forgiven: a bad option is
  // the caller's code, and lenient mode is only about the pattern.
  const resolved = resolve(setup, options);

  if (!resolved.opts.lenient) {
    return interpret(cronPattern, resolved);
  }

  // Lenient mode never throws on bad INPUT: unparseable input yields a fixed
  // fallback description instead, so arbitrary user crontabs are safe to
  // render. The fallback is an error string, not a schedule, so it is never
  // wrapped. Only the typed input rejection is converted — any other
  // exception is a genuine defect (e.g. a renderer bug on a valid pattern)
  // and must propagate rather than masquerade as the fallback.
  try {
    return interpret(cronPattern, resolved);
  }
  catch (error) {
    if (error instanceof Cronli5InputError) {
      return resolved.language.fallback(resolved.opts);
    }

    throw error;
  }
}

/**
 * Make a describing function that knows the given languages: codes passed
 * as `lang` resolve among them, and the first is the default. `options`
 * and `styles` (by language code) are defaults a call can override.
 */
function create(given: Cronli5Setup): Cronli5<Cronli5AnyStyle> {
  const setup = setupOf(given);

  return function describePattern(cronPattern, options) {
    return describeWith(setup, cronPattern, options);
  };
}

const cronli5: Cronli5 = create({languages: [en]});

export default cronli5;
export {create};
export {Cronli5InputError, Cronli5OptionError} from './core/errors.js';
export type {
  Cronli5, Cronli5AnyStyle, Cronli5Language, Cronli5Options, Cronli5Setup,
  CronPattern, CronPatternObject
} from './types.js';
