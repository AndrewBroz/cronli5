// The copy-editor choices Polish offers: the colloquial 12-hour clock
// with its part of the day, the abbreviations the language conventionally
// writes, and the mark between hours and minutes. None of them moves a
// part of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one house style. */
export interface PolishStyle {
  // Whether a clock time is on the 12-hour count with its part of the day.
  hour12: boolean;
  // What separates hours from minutes: a colon or a full stop.
  separator: string;
  // Whether weekday names, the month of a date and units after a number
  // are abbreviated.
  short: boolean;
}

/** The options a Polish description is rendered under. */
export type PolishOptions = NormalizedOptions<PolishStyle>;

const pl: PolishStyle = {hour12: false, separator: ':', short: false};

/** The named Polish styles, each a whole table. */
const styles: Readonly<Record<'pl', Readonly<PolishStyle>>> =
  Object.freeze({pl: Object.freeze(pl)});

/** The region codes Polish knows, and the style each one selects. */
const regions: {[region: string]: string} = {PL: 'pl'};

const fields = Object.keys(pl).sort();
const separators = [':', '.'];

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error:
// a mistyped style must not pass in silence.
function style(base: string, overrides?: unknown): PolishStyle {
  const named: {[name: string]: Readonly<PolishStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(pl, field)) {
        throw new Cronli5OptionError(
          `Polish has no style field \`${field}\`; its fields are ` +
          `${fields.join(', ')}.`);
      }

      if (typeof value !== typeof table[field] ||
          field === 'separator' && !separators.includes(value as string)) {
        throw new Cronli5OptionError(
          `The style field \`${field}\` does not take ` +
          `${JSON.stringify(value)}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as PolishStyle;
}

export {regions, style, styles};
