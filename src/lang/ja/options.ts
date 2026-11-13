// The choices Japanese offers: the 12- or 24-hour clock, times written
// with a colon or with their units, and weekday names with or without 日.
// None of them moves a part of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of a Japanese description. */
export interface JapaneseStyle {
  // Whether times are 12-hour, each led by 午前 or 午後.
  hour12: boolean;
  // Whether a time is written with its units (9時30分) or a colon (9:30).
  kanjiTime: boolean;
  // Whether a weekday is named without its last 日.
  short: boolean;
}

/** The options a Japanese description is rendered under. */
export type JapaneseOptions = NormalizedOptions<JapaneseStyle>;

const standard: JapaneseStyle = {
  hour12: false,
  kanjiTime: false,
  short: false
};

/** The named Japanese styles: there is one. */
const styles: Readonly<Record<'standard', Readonly<JapaneseStyle>>> =
  Object.freeze({standard: Object.freeze(standard)});

/** Japanese is written one way wherever it is used. */
const regions: {[region: string]: string} = {};

const fields = Object.keys(standard).sort();

// The named table with a caller's overrides applied. A field the table
// does not have, or a value that is not true or false, is an error: a
// mistyped style must not pass in silence.
function style(base: string, overrides?: unknown): JapaneseStyle {
  const named: {[name: string]: Readonly<JapaneseStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(standard, field)) {
        throw new Cronli5OptionError(
          `Japanese has no style field \`${field}\`; its fields are ` +
          `${fields.join(', ')}.`);
      }

      if (typeof value !== 'boolean') {
        throw new Cronli5OptionError(
          `The style field \`${field}\` takes true or false, not ` +
          `${JSON.stringify(value)}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as JapaneseStyle;
}

export {regions, style, styles};
