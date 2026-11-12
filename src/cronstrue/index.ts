/**
 * @license MIT, Copyright (c) 2026 Andrew Brož
 */

// A stand-in for cRonstrue's `toString`, for switching with one changed
// import. It translates the call and adds no behaviour of its own: the
// wording is cronli5's, and an option cronli5 cannot honour is refused,
// never ignored.

import {Cronli5OptionError} from '../core/errors.js';
import type {Translated} from './table.js';
import cronli5 from '../all.js';
import {table} from './table.js';

/** cRonstrue's options, as `cronstrue.toString` takes them. */
export interface CronstrueOptions {
  dayOfWeekStartIndexZero?: boolean;
  locale?: string | null;
  logicalAndDayFields?: boolean;
  monthStartIndexZero?: boolean;
  throwExceptionOnParseError?: boolean;
  trimHoursLeadingZero?: boolean;
  tzOffset?: number;
  use24HourTimeFormat?: boolean;
  verbose?: boolean;
}

/**
 * Describe a cron expression, taking cRonstrue's options. The result is a
 * capitalised label, the closest of cronli5's forms to cRonstrue's own.
 * A `?` in a day field is read as `*` whatever the options, as cRonstrue
 * reads it.
 */
function toString(expression: string, options?: CronstrueOptions): string {
  const given: {[option: string]: unknown} = {...options};
  const translated: Translated = {style: {}};

  Object.keys(given).forEach(function known(option) {
    if (!table.some(function named(row) {
      return row.option === option;
    })) {
      throw new Cronli5OptionError(
        `\`${option}\` is not a cRonstrue option; they are ` +
        table.map(function nameOf(row) {
          return row.option;
        }).sort().join(', ') + '.');
    }
  });

  table.forEach(function each(row) {
    row.translate(given[row.option], translated, given);
  });

  return cronli5(expression, {
    ...translated,
    form: 'label',
    questionMark: 'allow'
  });
}

export default {toString};
export {toString};
