// Public types: option flags, dialect overrides, and the
// accepted pattern shapes. The shipped declaration files are generated from
// this module plus the typed source (`npm run types`).

/**
 * A custom style table for the `dialect` option. Omitted fields inherit
 * the US (Chicago) defaults.
 */
export interface Cronli5Dialect {

  /** Morning meridiem, e.g. `'a.m.'`, `'am'`, or `'AM'`. */
  am?: string;

  /** Join the meridiem to the time with no space (`'9.30am'`). */
  closeUp?: boolean;

  /** Day-first dates (`'1 January'`) instead of month-first. */
  dayFirst?: boolean;

  /**
   * Spanish only: append an `h` after a 24-hour time (`'a las 14.30 h'`).
   * Off by default; opt in for an Argentine/formal style.
   */
  hSuffix?: boolean;

  /** The word for exactly 12:00 p.m., e.g. `'noon'` or `'midday'`. */
  midday?: string;

  /** The word for exactly 12:00 a.m. */
  midnight?: string;

  /** Ordinal days in month-day dates (`'January 1st'`) not cardinal. */
  ordinals?: boolean;

  /** Evening meridiem, e.g. `'p.m.'`, `'pm'`, or `'PM'`. */
  pm?: string;

  /** Separator between time parts, e.g. `':'` or `'.'`. */
  sep?: string;

  /** Use a serial comma in lists of three or more. */
  serialComma?: boolean;

  /** Range connective, e.g. `' through '`, `' to '`, or `' - '`. */
  through?: string;
}

/**
 * A language module is a renderer over the semantic IR plus the
 * language-owned strings and option normalization. The `describe`/`options`
 * payloads are the module's internal `IR`/options shapes (see
 * `core/ir.ts`). They are intentionally opaque at this public boundary,
 * which a caller passes to `cronli5` via the `lang` option but never invokes
 * directly.
 */
export interface Cronli5Language {
  describe(ir: any, opts: any): string;
  fallback: string;
  options(options?: Cronli5Options): any;
  reboot: string;
  sentence(description: string): string;
  // Optional strategy override (see `core/ir.ts` `Language.strategy`). Opaque
  // at this public boundary, like `describe`/`options`.
  strategy?(content: any, base: any): any;
}

/**
 * Option flags accepted as the second argument to `cronli5`.
 */
export interface Cronli5Options {

  /** Use 12-hour clock. Defaults to `true`; `false` uses 24-hour time. */
  ampm?: boolean;

  /**
   * Dialect, **scoped to the chosen language**. English: `'us'` (default,
   * Chicago Manual of Style), `'gb'` (Guardian style guide), `'house'`
   * (cronli5's legacy voice on a Chicago base); `'uk'` is a deprecated alias
   * for `'gb'`. Spanish: `'es-ES'` (RAE/default), `'es-MX'` (12-hour),
   * `'es-US'` (12-hour, English AM/PM). A `Cronli5Dialect` object defines a
   * custom style. A name another language owns falls back to the current
   * language's default.
   */
  dialect?: 'es-ES' | 'es-MX' | 'es-US'
    | 'gb' | 'house' | 'uk' | 'us' | Cronli5Dialect;

  /**
   * A language module (e.g. `import es from 'cronli5/lang/es'`). Defaults
   * to the bundled English module. See docs/i18n-design.md.
   */
  lang?: Cronli5Language;

  /**
   * Never throw: invalid input returns a fallback description instead.
   * Defaults to `false`.
   */
  lenient?: boolean;

  /**
   * Return a complete standalone sentence (`'Runs every day at midnight.'`)
   * instead of the embeddable fragment (`'every day at midnight'`). Each
   * language supplies its own wrapping. Wraps a schedule and `@reboot`, but
   * not the lenient `fallback`. Defaults to `false`.
   */
  sentence?: boolean;

  /**
   * Compact output: abbreviated month/weekday names and hyphenated ranges
   * ("Mon-Fri", "9 a.m.-5:45 p.m."). Defaults to `false`.
   */
  short?: boolean;

  /** Treat the first field of strings/arrays as seconds. Default `false`. */
  seconds?: boolean;

  /**
   * Read the trailing field of a six-field pattern as a year instead of
   * treating the first field as seconds. Seven-field patterns are
   * unambiguous (seconds first, year last) and need no option. Defaults to
   * `false`.
   */
  years?: boolean;
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
