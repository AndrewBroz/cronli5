// Public types: the options, a language module's public shape, and the
// accepted pattern shapes. The shipped declaration files are generated from
// this module plus the typed source (`npm run types`).

import type {EnglishStyle} from './lang/en/options.js';
import type {claimed} from './languages.js';

/** A style table whose fields are not known to the type system. */
export interface Cronli5AnyStyle {
  [field: string]: unknown;
}

/**
 * A language module, as imported from `cronli5/lang/<code>`. A caller
 * passes one as the `lang` option or to `create`, and may read its `code`
 * and its named `styles`; the rest is for the library. `Style` is the
 * language's style table and `Code` its code, so that a call's `style` can
 * be checked against the language it names.
 */
export interface Cronli5Language<Style = any, Code extends string = string> {
  code: Code;
  defaultStyle: string;
  describe(schedule: any, opts: any): string;
  fallback(opts: any): string;
  label(description: string, opts: any): string;
  reboot(opts: any): string;
  regions: {[region: string]: string};
  sentence(description: string, opts: any): string;
  style(base: string, overrides?: unknown): Style;
  styles: {[name: string]: Readonly<Style>};
}

/** The style table of each language an instance knows, by code. */
export type Cronli5Styles = {[code: string]: object};

// A language code as a caller may spell it: as written, or all in lower
// or upper case.
type Spelled<Code extends string> = Code | Lowercase<Code> | Uppercase<Code>;

type Joint = '-' | '_';

/**
 * A `lang` code naming a language an instance knows: its code, then an
 * optional region (and whatever else) after `-` or `_`. A language in a
 * script of its own (`zh-Hant`) is also named by its language and a region
 * that writes that script (`zh-TW`).
 */
export type Cronli5Code<Styles> = {
  [Code in keyof Styles & string]:
    Spelled<Code> | `${Spelled<Code>}${Joint}${string}` |
    (Code extends `${infer Language}-${string}` ?
      `${Spelled<Language>}${Joint}${string}` : never)
}[keyof Styles & string];

// A code with `-` between its parts, however it was spelled.
type Hyphened<Code extends string> =
  Code extends `${infer Head}_${infer Rest}` ? `${Head}-${Hyphened<Rest>}` :
    Code;

// The language a code opens with and the part after it (a script or a
// region), or nothing.
type Parts<Code extends string> =
  Code extends `${infer Language}-${infer Second}-${string}` ?
    [Language, Second] :
    Code extends `${infer Language}-${infer Second}` ? [Language, Second] :
      [Code, ''];

// The code among an instance's that a spelling names, in any case.
type Known<Styles, Code extends string> = {
  [Key in keyof Styles & string]:
    Lowercase<Key> extends Lowercase<Code> ? Key : never
}[keyof Styles & string];

// The language in another script that writes a region, if the instance
// knows it.
type Claiming<Styles, Language extends string, Region extends string> =
  Lowercase<Language> extends keyof typeof claimed ?
    Uppercase<Region> extends keyof typeof claimed[Lowercase<Language>] ?
      typeof claimed[Lowercase<Language>][Uppercase<Region>] & keyof Styles :
      never :
    never;

type Or<First, Second> = [First] extends [never] ? Second : First;

// The code of the language a spelling names: the one written in the
// script named, or the one in another script that writes the region
// named, or the plain language.
type CodeOf<Styles, Named extends [string, string]> = Or<
  Known<Styles, `${Named[0]}-${Named[1]}`>,
  Or<Claiming<Styles, Named[0], Named[1]>, Known<Styles, Named[0]>>>;

/** The style table of the language a code names. */
export type Cronli5StyleOf<Styles, Code extends string> =
  [CodeOf<Styles, Parts<Hyphened<Code>>>] extends [never] ? Cronli5AnyStyle :
    Styles[CodeOf<Styles, Parts<Hyphened<Code>>> & keyof Styles];

/** The style tables of a list of language modules, by their codes. */
export type Cronli5StylesOf<Languages extends readonly Cronli5Language[]> = {
  [Language in Languages[number] as Language['code']]:
    Language extends Cronli5Language<infer Style, string> ? Style : never
};

/** The options other than the language and its style. */
export type Cronli5CommonOptions = Omit<Cronli5Options<never>,
  'lang' | 'style'>;

/**
 * The options accepted as the second argument to `cronli5`. Every option
 * is plain data except a `lang` given as a module. An option the library
 * cannot honour throws `Cronli5OptionError`; nothing is ignored.
 *
 * `Style` is the style table of the languages in use. It is English's
 * for the default export, so a misspelt field is a type error.
 */
export interface Cronli5Options<Style = EnglishStyle> {

  /**
   * The flavour of cron the pattern is written in: `'standard'` (default)
   * or `'quartz'`. Quartz numbers the day-of-week **1 = Sunday … 7 =
   * Saturday** (standard cron uses 0/7 = Sunday, 1 = Monday), including
   * inside the day-of-week operators (`6L`, `2#2`), and writes `?` ("no
   * specific value") in a day field. A flavour sets `weekdaysFrom` and
   * `questionMark`; either can also be given alone.
   */
  cron?: 'standard' | 'quartz';

  /**
   * How the description is presented: `'fragment'` (default), a lowercase
   * phrase to embed (`'at midnight every day'`); `'label'`, the same
   * capitalised to stand alone; or `'sentence'`, a complete sentence
   * (`'Runs at midnight every day.'`). The lenient fallback is never
   * wrapped.
   */
  form?: 'fragment' | 'label' | 'sentence';

  /**
   * The language: a code such as `'en'`, optionally with a script
   * (`'zh-Hant'`) and a region (`'en-GB'`, `'zh-Hant-HK'`), or a language
   * module (`import uk from 'cronli5/lang/uk'`). A code must name a
   * language this instance knows: the default export knows English,
   * `create` takes a list, and `cronli5/all` knows every language. A
   * region the language does not know is described in the language's
   * default style.
   */
  lang?: string | Cronli5Language;

  /**
   * A bad pattern returns a fallback description instead of throwing.
   * A bad option still throws. Defaults to `false`.
   */
  lenient?: boolean;

  /**
   * Whether a day field may be `?`: `'reject'` (standard cron), `'allow'`
   * (read it as `*`), or `'require'` (exactly one day field must be `?`).
   */
  questionMark?: 'reject' | 'allow' | 'require';

  /** Treat the first field of strings/arrays as seconds. Default `false`. */
  seconds?: boolean;

  /**
   * Overrides of the language's style table: its copy-editor choices,
   * such as `{hour12: false}` for 24-hour times or `{short: true}` for
   * abbreviated names in English. A language exports its named tables as
   * `styles`, to pass whole or to spread and adjust.
   */
  style?: Partial<Style>;

  /** The number that means Sunday in the day-of-week field: `0` or `1`. */
  weekdaysFrom?: 0 | 1;

  /**
   * Read the trailing field of a six-field pattern as a year instead of
   * treating the first field as seconds. Seven-field patterns are
   * unambiguous (seconds first, year last) and need no option. Defaults to
   * `false`.
   */
  years?: boolean;
}

/** What `create` is given: the languages an instance knows, and defaults. */
export interface Cronli5Setup<
  Languages extends readonly Cronli5Language[] = Cronli5Language[]> {

  /** The language modules; codes resolve among them, the first is default. */
  languages: Languages;

  /** Default options for every call. A default style goes in `styles`. */
  options?: Omit<Cronli5Options<Cronli5AnyStyle>, 'style'>;

  /** A default style for each language, by language code. */
  styles?: {
    [Code in keyof Cronli5StylesOf<Languages>]?:
      Partial<Cronli5StylesOf<Languages>[Code]>
  };
}

/**
 * A describing function: a cron pattern in, a description out. The
 * default export is one that knows English; `create` makes others.
 * `Styles` is the style table of each language it knows, by code, and
 * `Default` the code of the language it describes in when none is named;
 * a call's `style` is checked against the language it names.
 */
export interface Cronli5<
  Styles = {en: EnglishStyle},
  Default extends string = keyof Styles & string> {
  // A language passed as a module, with that language's style.
  <Style>(cronPattern: CronPattern, options: Cronli5CommonOptions & {
    lang: Cronli5Language<Style>;
    style?: Partial<Style>;
  }): string;
  // A language named by code, or the default, with that language's style.
  <Code extends string = Default>(
    cronPattern: CronPattern,
    options?: Cronli5CommonOptions & {
      lang?: Code & Cronli5Code<Styles>;
      style?: Partial<Cronli5StyleOf<Styles, Code>>;
    }): string;
}

/**
 * Object form of a cron pattern. Fields may be strings or numbers; at least
 * one of `second`, `minute`, or `hour` is required.
 */
export interface CronPatternObject {
  second?: string | number;
  minute?: string | number;
  hour?: string | number;
  date?: string | number;
  month?: string | number;
  weekday?: string | number;
  year?: string | number;
}

/**
 * A cron pattern as a whitespace-delimited string, an array of fields, or an
 * object of named fields.
 */
export type CronPattern = string | Array<string | number> | CronPatternObject;
