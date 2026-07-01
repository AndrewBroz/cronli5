// Parse cron input (string, array, or object) into a cron-like object.

import {Cronli5InputError} from './errors.js';
import {macros} from './specs.js';
import type {CronLike} from './specs.js';
import type {NormalizedOptions} from './schedule.js';
import type {CronPattern, CronPatternObject} from '../types.js';

// Take a cron pattern as a cron pattern string, an array of cron fields, a
// cron-like object (see the final return statement for the format of a
// cron-like object), or a stringable object that evaluates to a cron pattern
// string. Returns a cron-like object.
function parseCronPattern(
  cronPattern: CronPattern,
  opts: NormalizedOptions
): CronLike {
  const isArray = cronPattern instanceof Array;
  const isEmpty = cronPattern === null ||
    typeof cronPattern === 'undefined' ||
    typeof cronPattern === 'string' && cronPattern.trim() === '' ||
    isArray && cronPattern.length === 0;

  // Throw if null or empty.
  if (isEmpty) {
    throw new Cronli5InputError(
      '`cronli5` expects a non-empty cron pattern as the first argument.');
  }

  if (isArray) {
    return cronifyArray(cronPattern, opts);
  }

  if (typeof cronPattern === 'object') {
    return cronifyObject(cronPattern);
  }

  if (typeof cronPattern === 'string') {
    return cronifyString(cronPattern, opts);
  }

  throw new Cronli5InputError('`cronli5` was passed an unexpected type.');
}

// Turn a cronable array into a cron-like object. A seven-field pattern is
// unambiguous (seconds first, year last). Six fields default to seconds
// first. With the `years` option it reads the trailing field as a year
// instead.
function cronifyArray(
  cronlikeArray: Array<string | number>,
  opts: NormalizedOptions
): CronLike {
  if (cronlikeArray.length > 7) {
    // Error messages are English for now (docs/i18n-design.md §7).
    throw new Cronli5InputError(
      '`cronli5` was passed a cron pattern with more than seven fields.');
  }

  if (!opts.seconds && cronlikeArray.length < (opts.years ? 7 : 6)) {
    cronlikeArray.unshift('0');
  }

  return {
    second:  elementOrDefault(cronlikeArray[0], '0'),
    minute:  elementOrDefault(cronlikeArray[1], '*'),
    hour:    elementOrDefault(cronlikeArray[2], '*'),
    date:    elementOrDefault(cronlikeArray[3], '*'),
    month:   elementOrDefault(cronlikeArray[4], '*'),
    weekday: elementOrDefault(cronlikeArray[5], '*'),
    year:    elementOrDefault(cronlikeArray[6], '*')
  };
}

// An array element is absent when missing, `null`, or the empty string —
// those take the field default (so sparse arrays read as "every minute").
// A falsy-but-present value is kept: `0` is a real field value, and a `NaN`
// or `false` must reach validation to be flagged, not silently defaulted.
function elementOrDefault(
  value: string | number | null | undefined,
  fallback: string
): string | number {
  if (value === null || typeof value === 'undefined' || value === '') {
    return fallback;
  }

  return value;
}

// Turn an object that's already cron-like into a populated cron-like object.
function cronifyObject(cronable: CronPatternObject): CronLike {
  const hasSecond = typeof cronable.second !== 'undefined';
  const hasMinute = typeof cronable.minute !== 'undefined';
  const hasHour = typeof cronable.hour !== 'undefined';

  // Presence, not truthiness: a numeric `0` names a real field value
  // ({hour: 0} is midnight), so only a genuinely missing property counts
  // as absent.
  if (!hasSecond && !hasMinute && !hasHour) {
    throw new Cronli5InputError(
      '`cronli5` expects that any object being interpreted as a cron ' +
      'pattern have at least one of the following properties: `second`, ' +
      '`minute`, or `hour`');
  }

  const defaultMinute = hasSecond ? '*' : '0';
  const defaultHour = hasSecond || hasMinute ? '*' : '0';

  return {
    second:  pick(cronable.second, '0'),
    minute:  pick(cronable.minute, defaultMinute),
    hour:    pick(cronable.hour, defaultHour),
    date:    pick(cronable.date, '*'),
    month:   pick(cronable.month, '*'),
    weekday: pick(cronable.weekday, '*'),
    year:    pick(cronable.year, '*')
  };
}

// Return a provided field value, or a fallback when the value is absent.
// Unlike `||`, this preserves falsy-but-present values (e.g. `0`, `NaN`)
// so that they can be flagged as invalid during validation.
function pick(
  value: string | number | undefined,
  fallback: string
): string | number {
  return typeof value === 'undefined' ? fallback : value;
}

// Turn a string into a cron-like object.
function cronifyString(cronString: string, opts: NormalizedOptions): CronLike {
  // Trim first: crontab lines copied from files routinely carry surrounding
  // whitespace, and a trailing space would otherwise split into a phantom
  // field that shifts the meaning of every field before it.
  const cronlikeArray = expandMacro(cronString).trim().split(/\s+/);

  return cronifyArray(cronlikeArray, opts);
}

// Expand a recognized nickname macro (e.g. `@daily`) into its equivalent
// cron string, leaving any other string untouched. `@reboot` has no field
// schedule and is handled directly in `cronli5`, before this point.
function expandMacro(cronString: string): string {
  const trimmed = cronString.trim();

  if (trimmed.charAt(0) !== '@') {
    return cronString;
  }

  const macro = trimmed.toLowerCase();

  if (Object.hasOwn(macros, macro)) {
    return macros[macro];
  }

  throw new Cronli5InputError(
    '`cronli5` does not recognize the macro `' + trimmed + '`.');
}
export {parseCronPattern};
