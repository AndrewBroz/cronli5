// The copy-editor choices Portuguese offers, as a table of word-level
// conventions: 12- or 24-hour times, short names, weekday names with or
// without «-feira», and the mark on the first day of a month. None of
// them moves a part of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one house style. */
export interface PortugueseStyle {
  // Whether every weekday name is written with «-feira».
  feira: boolean;
  // Whether the first day of a month is «1º» and not «1».
  firstOrdinal: boolean;
  // Whether times are 12-hour with the part of the day, or 24-hour.
  hour12: boolean;
  // Whether weekday and month names are abbreviated.
  short: boolean;
}

/** The options a Portuguese description is rendered under. */
export type PortugueseOptions = NormalizedOptions<PortugueseStyle>;

// Portuguese as Brazil writes it.
const br: PortugueseStyle = {
  feira: false,
  firstOrdinal: true,
  hour12: false,
  short: false
};

/**
 * The named Portuguese styles, each a whole table: pass one as `style`, or
 * spread one and change the fields a house differs on.
 */
const styles: Readonly<Record<'br' | 'pt', Readonly<PortugueseStyle>>> =
Object.freeze({
  br: Object.freeze(br),
  // The European norm, which Angola and Mozambique follow.
  pt: Object.freeze({...br, feira: true, firstOrdinal: false})
});

/** The region codes Portuguese knows, and the style each one selects. */
const regions: {[region: string]: string} =
  {AO: 'pt', BR: 'br', MZ: 'pt', PT: 'pt'};

const fields = Object.keys(br).sort();

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error:
// a mistyped style must not pass in silence.
function style(base: string, overrides?: unknown): PortugueseStyle {
  const named: {[name: string]: Readonly<PortugueseStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(br, field)) {
        throw new Cronli5OptionError(
          `Portuguese has no style field \`${field}\`; its fields are ` +
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

  return table as unknown as PortugueseStyle;
}

export {regions, style, styles};
