/**
 * Option flags accepted as the second argument to `cronli5`.
 */
export interface Cronli5Options {
  /** Use 12-hour clock with AM/PM. Defaults to `true`; `false` uses 24-hour. */
  ampm?: boolean;
  /**
   * Never throw: invalid input returns a fallback description instead.
   * Defaults to `false`.
   */
  lenient?: boolean;
  /**
   * Compact output: abbreviated month/weekday names and hyphenated ranges
   * ("Mon-Fri", "9:00 AM-5:45 PM"). Defaults to `false`.
   */
  short?: boolean;
  /** Treat the first field of strings/arrays as seconds. Defaults to `false`. */
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

/**
 * Generate a plain-English description of a cron pattern.
 *
 * @param pattern - The cron pattern to describe.
 * @param options - Optional formatting flags.
 * @returns An English description, e.g. `"every five minutes"`.
 */
export default function cronli5(
  pattern: CronPattern,
  options?: Cronli5Options
): string;
