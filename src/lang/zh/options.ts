// The copy-editor choices Chinese offers, as a table of word-level
// conventions. Neither moves a part of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of the one Chinese style. */
export interface ChineseStyle {
  // Whether times are 12-hour, each with its part of the day before it.
  hour12: boolean;
  // Accepted so a caller can set it for every language alike: Chinese
  // names of weekdays and months have no shorter written form.
  short: boolean;
}

/** The options a Chinese description is rendered under. */
export type ChineseOptions = NormalizedOptions<ChineseStyle>;

// Mainland software and timetables: the 24-hour clock.
const standard: ChineseStyle = {hour12: false, short: false};

/** The named Chinese styles, each a whole table. */
const styles: Readonly<Record<'standard', Readonly<ChineseStyle>>> =
Object.freeze({standard: Object.freeze(standard)});

/** The region codes Chinese knows: none yet. */
const regions: {[region: string]: string} = {};

const fields = Object.keys(standard).sort();

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error:
// a mistyped style must not pass in silence.
function style(base: string, overrides?: unknown): ChineseStyle {
  const named: {[name: string]: Readonly<ChineseStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(standard, field)) {
        throw new Cronli5OptionError(
          `Chinese has no style field \`${field}\`; its fields are ` +
          `${fields.join(', ')}.`);
      }

      if (typeof value !== typeof table[field]) {
        throw new Cronli5OptionError(
          `The style field \`${field}\` takes a ${typeof table[field]}, ` +
          `not ${JSON.stringify(value)}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as ChineseStyle;
}

export {regions, style, styles};
