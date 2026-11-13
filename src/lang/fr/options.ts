// The copy-editor choices French offers: the spoken 12-hour clock in
// place of the written 24-hour one, and short names. Neither moves a part
// of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one style. */
export interface FrenchStyle {
  // Whether times are said on the 12-hour clock with the part of the day.
  hour12: boolean;
  // Whether weekday and month names are abbreviated.
  short: boolean;
}

/** The options a French description is rendered under. */
export type FrenchOptions = NormalizedOptions<FrenchStyle>;

// The Lexique of the Imprimerie nationale.
const fr: FrenchStyle = {hour12: false, short: false};

/** The named French styles, each a whole table. */
const styles: Readonly<Record<'fr', Readonly<FrenchStyle>>> =
  Object.freeze({fr: Object.freeze(fr)});

/** The region codes French knows, and the style each one selects. */
const regions: {[region: string]: string} = {FR: 'fr'};

const fields = Object.keys(fr).sort();

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error:
// a mistyped style must not pass in silence.
function style(base: string, overrides?: unknown): FrenchStyle {
  const named: {[name: string]: Readonly<FrenchStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(fr, field)) {
        throw new Cronli5OptionError(
          `French has no style field \`${field}\`; its fields are ` +
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

  return table as unknown as FrenchStyle;
}

export {regions, style, styles};
