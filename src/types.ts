// Public types: the options, a language module's public shape, and the
// accepted pattern shapes. The shipped declaration files are generated from
// this module plus the typed source (`npm run types`).

import type {EnglishStyle} from './lang/en/options.js';

/** A style table whose fields are not known to the type system. */
export interface Cronli5AnyStyle {
  [field: string]: unknown;
}

/**
 * A language module, as imported from `cronli5/lang/<code>`. A caller
 * passes one as the `lang` option or to `create`, and may read its `code`
 * and its named `styles`; the rest is for the library.
 */
export interface Cronli5Language {
  code: string;
  defaultStyle: string;
  describe(schedule: any, opts: any): string;
  fallback(opts: any): string;
  label(description: string, opts: any): string;
  reboot(opts: any): string;
  regions: {[region: string]: string};
  sentence(description: string, opts: any): string;
  style(base: string, overrides?: unknown): any;
  styles: {[name: string]: any};
}

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
   * The language: a code such as `'en'`, optionally with a region
   * (`'en-GB'`), or a language module (`import uk from
   * 'cronli5/lang/uk'`). A code must name a language this instance knows:
   * the default export knows English, `create` takes a list, and
   * `cronli5/all` knows every language. A region the language does not
   * know is described in the language's default style.
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
export interface Cronli5Setup {

  /** The language modules; codes resolve among them, the first is default. */
  languages: Cronli5Language[];

  /** Default options for every call. A default style goes in `styles`. */
  options?: Omit<Cronli5Options<Cronli5AnyStyle>, 'style'>;

  /** A default style for each language, by language code. */
  styles?: {[code: string]: Cronli5AnyStyle};
}

/**
 * A describing function: a cron pattern in, a description out. The
 * default export is one that knows English; `create` makes others.
 */
export interface Cronli5<Style = EnglishStyle> {
  (cronPattern: CronPattern, options?: Cronli5Options<Style>): string;
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
