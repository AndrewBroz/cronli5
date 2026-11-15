/**
 * @license MIT, Copyright (c) 2026 Andrew Brož
 */

// A stand-in for cRonstrue's `toString`, for switching with one changed
// import. It translates the call: the wording is cronli5's, and an option
// cronli5 cannot honour is refused, never ignored. Its one addition is
// English's style, set to write times and days as cRonstrue does.

import {Cronli5OptionError} from '../core/errors.js';

export {Cronli5OptionError};
import type {Translated} from './table.js';
import type {Cronli5, Cronli5Styles} from '../types.js';
import every from '../all.js';
import {table} from './table.js';

// English as cRonstrue writes it: "09:00 AM", "02:30 PM", 12:00 as
// "12:00 PM" rather than "noon", and "Monday through Friday" rather than
// "weekdays". cRonstrue has one English, so every English region takes
// it; a region keeps its own dates and range word.
const cronstrueEnglish = {
  am: 'AM',
  closeUp: false,
  midday: '',
  midnight: '',
  minutes: true,
  padHour: true,
  pm: 'PM',
  separator: ':',
  weekWords: false
};

function isEnglish(lang: string | undefined): boolean {
  return typeof lang === 'undefined' || (/^en(?:$|-)/iu).test(lang);
}

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

  // cRonstrue's locale is known only at run time, so the call is typed
  // for any language; the library checks the code and the style itself.
  const cronli5 = every as Cronli5<Cronli5Styles>;

  return cronli5(expression, {
    ...translated,
    style: isEnglish(translated.lang) ?
      {...cronstrueEnglish, ...translated.style} :
      translated.style,
    form: 'label',
    questionMark: 'allow'
  });
}

export default {toString};
export {toString};
export {Cronli5InputError} from '../core/errors.js';
