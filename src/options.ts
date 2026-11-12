// What a caller's options mean: which language and style describe the
// pattern, how the pattern is read, and how the description is presented.
// Anything that cannot be honoured is an error with a message that says
// what to do; nothing is ignored.

import {Cronli5OptionError} from './core/errors.js';
import type {Language, NormalizedOptions} from './core/schedule.js';
import {readingOf} from './core/reading.js';

/** How a description is presented. */
export type Form = 'fragment' | 'label' | 'sentence';

/** A language with its options resolved, ready to describe a pattern. */
export interface Resolved {
  form: Form;
  language: Language;
  opts: NormalizedOptions;
}

/** The languages an instance knows, and its defaults. */
export interface Setup {
  languages: Language[];
  options: {[option: string]: unknown};
  styles: {[code: string]: unknown};
}

type Options = {[option: string]: unknown};

const forms: unknown[] = ['fragment', 'label', 'sentence'];

const known = [
  'cron', 'form', 'lang', 'lenient', 'questionMark', 'seconds', 'style',
  'weekdaysFrom', 'years'
];

// Options that existed before 1.0, each with what replaces it.
const removed: {[option: string]: string} = {
  ampm: 'use `style: {hour12: false}` for 24-hour times',
  dialect: 'use `lang: \'en-GB\'` for a region, `style: styles.house` ' +
    'for a named table, or `style: {…}` for a custom one',
  quartz: 'use `cron: \'quartz\'`',
  sentence: 'use `form: \'sentence\'`',
  short: 'use `style: {short: true}`'
};

// Reject any option this version does not have.
function checkNames(options: Options, names: string[], what: string): void {
  Object.keys(options).forEach(function check(name) {
    if (Object.hasOwn(removed, name)) {
      throw new Cronli5OptionError(
        `\`${name}\` was removed in 1.0: ${removed[name]}.`);
    }

    if (!names.includes(name)) {
      throw new Cronli5OptionError(
        `\`${name}\` is not ${what}; they are ${names.join(', ')}.`);
    }
  });
}

function notATable(what: string): Cronli5OptionError {
  return new Cronli5OptionError(
    `${what} is a table of style fields to override, such as ` +
    '{hour12: false}; a language exports its named tables as `styles`.');
}

function unavailable(code: string): Cronli5OptionError {
  return new Cronli5OptionError(
    `cronli5 has no language '${code}' here. Import it (import ${code} ` +
    `from 'cronli5/lang/${code}') and pass it as \`lang\`, give it to ` +
    'create({languages}), or import from \'cronli5/all\'.');
}

// The language a `lang` option selects and the named style it starts
// from. A code is a language and an optional region, joined by `-` or
// `_`, in any case; a region the language does not know takes its default
// style. A module is used as it is.
function languageFor(setup: Setup, lang: unknown):
  {base: string; language: Language} {
  if (typeof lang === 'undefined') {
    const [language] = setup.languages;

    return {base: language.defaultStyle, language};
  }

  if (typeof lang === 'object' && lang !== null) {
    const language = lang as Language;

    return {base: language.defaultStyle, language};
  }

  if (typeof lang !== 'string' || !lang) {
    throw new Cronli5OptionError(
      '`lang` is a language code such as \'en\' or \'en-GB\', or an ' +
      'imported language module.');
  }

  const [code, region = ''] = lang.toLowerCase().split(/[-_]/u);
  const language = setup.languages.find(function named(candidate) {
    return candidate.code === code;
  });

  if (!language) {
    throw unavailable(code);
  }

  return {
    base: language.regions[region.toUpperCase()] ?? language.defaultStyle,
    language
  };
}

// A caller's options resolved against an instance's setup.
function resolve(setup: Setup, given?: unknown): Resolved {
  const call: Options = {...given as object};

  checkNames(call, known, 'an option');

  const options = {...setup.options, ...call};
  const {form = 'fragment', lenient = false} = options;

  if (!forms.includes(form)) {
    throw new Cronli5OptionError(
      `\`form\` is ${JSON.stringify(form)}; it may be ` +
      '\'fragment\', \'label\', or \'sentence\'.');
  }

  if (typeof lenient !== 'boolean') {
    throw new Cronli5OptionError('`lenient` is true or false.');
  }

  if (typeof (call.style ?? {}) !== 'object') {
    throw notATable('`style`');
  }

  const {base, language} = languageFor(setup, options.lang);
  // A call's style overrides the instance's for the same language.
  const overrides = {
    ...setup.styles[language.code] as object,
    ...call.style as object
  };

  return {
    form: form as Form,
    language,
    opts: {
      ...readingOf(options),
      lenient,
      style: language.style(base, overrides)
    }
  };
}

// An instance's setup, checked once when the instance is made.
function setupOf(given: unknown): Setup {
  const raw: Options = {...given as object};

  checkNames(raw, ['languages', 'options', 'styles'], 'part of a setup');

  const languages = (raw.languages ?? []) as Language[];
  const options: Options = {...raw.options as object};
  const styles: Options = {...raw.styles as object};

  if (!Array.isArray(languages) || !languages.length) {
    throw new Cronli5OptionError(
      '`languages` is the list of language modules the instance knows, ' +
      'and needs at least one.');
  }

  languages.forEach(function unique(language, index) {
    const first = languages.findIndex(function same(other) {
      return other.code === language.code;
    });

    if (first !== index) {
      throw new Cronli5OptionError(
        `The language '${language.code}' is in \`languages\` twice.`);
    }
  });

  checkNames(options, known.filter(function general(name) {
    return name !== 'style';
  }), 'a default option (a default style goes in `styles`, by language ' +
    'code)');

  Object.keys(styles).forEach(function check(code) {
    const language = languages.find(function named(candidate) {
      return candidate.code === code;
    });

    if (!language) {
      throw unavailable(code);
    }

    if (typeof styles[code] !== 'object') {
      throw notATable(`\`styles.${code}\``);
    }

    language.style(language.defaultStyle, styles[code]);
  });

  const setup = {languages, options, styles};

  // Resolving the defaults once reports a bad default when the instance
  // is made, not at its first call.
  resolve(setup);

  return setup;
}

export {resolve, setupOf};
