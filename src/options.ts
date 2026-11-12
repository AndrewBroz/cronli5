// What a caller's options mean: which language and style describe the
// pattern, how the pattern is read, and how the description is presented.
// Anything that cannot be honoured is an error with a message that says
// what to do; nothing is ignored.

import {Cronli5OptionError} from './core/errors.js';
import type {Language, NormalizedOptions} from './core/schedule.js';
import {readingOf} from './core/reading.js';
import {shipped} from './languages.js';

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

// A table of named values a caller wrote: an object literal or the like,
// not an array, a Map, a Date or a function.
function isTable(value: unknown): value is Options {
  const prototype: unknown = typeof value === 'object' && value !== null ?
    Reflect.getPrototypeOf(value) :
    0;

  return prototype === Object.prototype || prototype === null;
}

// The entries a caller gave. An option given as `undefined` was not given:
// `{lang: user.locale}` must not erase a default when the user has none.
function given(value: unknown, what: string): Options {
  if (typeof value === 'undefined' || value === null) {
    return {};
  }

  if (!isTable(value)) {
    throw new Cronli5OptionError(
      `${what} is a table such as {form: 'label'}, not ` +
      `${JSON.stringify(value) ?? typeof value}.`);
  }

  return Object.fromEntries(Object.entries(value).filter(
    function present(entry) {
      return typeof entry[1] !== 'undefined';
    }
  ));
}

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

function notALanguage(what: string): Cronli5OptionError {
  return new Cronli5OptionError(
    `${what} a language module: the default export of ` +
    '\'cronli5/lang/<code>\' (import en from \'cronli5/lang/en\').');
}

function notACode(what: string): Cronli5OptionError {
  return new Cronli5OptionError(
    `${what} is a language code such as 'en' or 'en-GB'.`);
}

// A language the instance cannot describe in: one it was not given, or
// one cronli5 does not have at all. Only the first can be fixed by an
// import.
function unavailable(code: string, setup: Setup): Cronli5OptionError {
  const here = setup.languages.map(function named(language) {
    return language.code;
  }).join(', ');

  return new Cronli5OptionError(shipped.includes(code) ?
    `This instance does not have the language '${code}' (it has: ${here}). ` +
    `Import it (import ${code} from 'cronli5/lang/${code}') and pass it as ` +
    '`lang`, give it to create({languages}), or import from ' +
    '\'cronli5/all\'.' :
    `cronli5 does not ship '${code}'. It ships: ${shipped.join(', ')}. ` +
    `This instance has: ${here}.`);
}

function isLanguage(value: unknown): value is Language {
  const candidate = value as Partial<Language> | null;

  return typeof candidate === 'object' && candidate !== null &&
    typeof candidate.code === 'string' &&
    typeof candidate.style === 'function' &&
    typeof candidate.describe === 'function';
}

// A language code and its region, or nothing if the text is not shaped
// like a code.
function codeOf(text: unknown): {code: string; region: string} | null {
  const parts = typeof text === 'string' &&
    (/^([a-z]{2,3})(?:[-_]([a-z0-9]+))?(?:[-_][a-z0-9]+)*$/iu).exec(text);

  return parts ?
    {code: parts[1].toLowerCase(), region: (parts[2] ?? '').toUpperCase()} :
    null;
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
    if (!isLanguage(lang)) {
      throw notALanguage('`lang`, when it is not a code, is');
    }

    return {base: lang.defaultStyle, language: lang};
  }

  const named = codeOf(lang);

  if (!named) {
    throw notACode('`lang`');
  }

  const language = setup.languages.find(function match(candidate) {
    return candidate.code === named.code;
  });

  if (!language) {
    throw unavailable(named.code, setup);
  }

  return {
    base: language.regions[named.region] ?? language.defaultStyle,
    language
  };
}

// A caller's options resolved against an instance's setup.
function resolve(setup: Setup, options?: unknown): Resolved {
  const call = given(options, 'The options argument');

  checkNames(call, known, 'an option');

  const merged = {...setup.options, ...call};
  const {form = 'fragment', lenient = false} = merged;

  if (!forms.includes(form)) {
    throw new Cronli5OptionError(
      `\`form\` is ${JSON.stringify(form)}; it may be ` +
      '\'fragment\', \'label\', or \'sentence\'.');
  }

  if (typeof lenient !== 'boolean') {
    throw new Cronli5OptionError('`lenient` is true or false.');
  }

  if (Object.hasOwn(call, 'style') && !isTable(call.style)) {
    throw notATable('`style`');
  }

  const {base, language} = languageFor(setup, merged.lang);
  // A call's style overrides the instance's for the same language.
  const overrides = {
    ...setup.styles[language.code] as object,
    ...call.style as object
  };

  return {
    form: form as Form,
    language,
    opts: {
      ...readingOf(merged),
      lenient,
      style: language.style(base, overrides)
    }
  };
}

// An instance's setup, checked once when the instance is made.
function setupOf(setup: unknown): Setup {
  const raw = given(setup, 'What `create` is given');

  checkNames(raw, ['languages', 'options', 'styles'], 'part of a setup');

  if (!Array.isArray(raw.languages) || !raw.languages.length ||
      !raw.languages.every(isLanguage)) {
    throw notALanguage(
      '`languages` is a list of at least one language module, each');
  }

  // The instance keeps its own list: the caller's array may change later.
  const languages: Language[] = [...raw.languages];
  const options = given(raw.options, '`options`');
  const styles = given(raw.styles, '`styles`');

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

  const made = {languages, options, styles};

  Object.keys(styles).forEach(function check(code) {
    const language = languages.find(function match(candidate) {
      return candidate.code === code;
    });

    if (!codeOf(code) || codeOf(code)?.region) {
      throw notACode(`A key of \`styles\` (${JSON.stringify(code)})`);
    }

    if (!language) {
      throw unavailable(code, made);
    }

    if (!isTable(styles[code])) {
      throw notATable(`\`styles.${code}\``);
    }

    language.style(language.defaultStyle, styles[code]);
  });

  // Resolving the defaults once reports a bad default when the instance
  // is made, not at its first call.
  resolve(made);

  return made;
}

export {resolve, setupOf};
