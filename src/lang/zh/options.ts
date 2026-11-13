// The copy-editor choices Chinese offers. Neither moves a part of the
// sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of the Chinese style. */
export interface ChineseStyle {
  // Whether times are 12-hour with the part of the day, or 24-hour.
  hour12: boolean;
  // Changes nothing: Chinese weekday and month names have no shorter
  // form. It exists so a caller can set it for every language alike.
  short: boolean;
}

/** The options a Chinese description is rendered under. */
export type ChineseOptions = NormalizedOptions<ChineseStyle>;

const standard: ChineseStyle = {hour12: false, short: false};

/** The named Chinese styles, each a whole table. */
const styles: Readonly<Record<'standard', Readonly<ChineseStyle>>> =
  Object.freeze({standard: Object.freeze(standard)});

const fields = Object.keys(standard).sort();

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error.
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

export {style, styles};
