// The copy-editor choices German offers, as a table of word-level
// conventions: 12- or 24-hour times, short names, Austria's January and
// Switzerland's spelling without «ß». None of them moves a part of the
// sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one house style. */
export interface GermanStyle {
  // Whether «außer» keeps its «ß» (Switzerland writes «ausser»).
  eszett: boolean;
  // Whether times are 12-hour with a part of the day, or 24-hour.
  hour12: boolean;
  // Whether January is «Jänner», as in Austria.
  jaenner: boolean;
  // Whether weekday and month names are abbreviated.
  short: boolean;
}

/** The options a German description is rendered under. */
export type GermanOptions = NormalizedOptions<GermanStyle>;

// Duden, as written in Germany.
const de: GermanStyle = {
  eszett: true,
  hour12: false,
  jaenner: false,
  short: false
};

/**
 * The named German styles, each a whole table: pass one as `style`, or
 * spread one and change the fields a house differs on.
 */
const styles: Readonly<Record<'at' | 'ch' | 'de', Readonly<GermanStyle>>> =
Object.freeze({
  at: Object.freeze({...de, jaenner: true}),
  ch: Object.freeze({...de, eszett: false}),
  de: Object.freeze(de)
});

/** The region codes German knows, and the style each one selects. */
const regions: {[region: string]: string} =
  {AT: 'at', CH: 'ch', DE: 'de', LI: 'ch'};

const fields = Object.keys(de).sort();

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error:
// a mistyped style must not pass in silence. (The entry point has already
// refused anything that is not a table.)
function style(base: string, overrides?: unknown): GermanStyle {
  const named: {[name: string]: Readonly<GermanStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(de, field)) {
        throw new Cronli5OptionError(
          `German has no style field \`${field}\`; its fields are ` +
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

  return table as unknown as GermanStyle;
}

export {regions, style, styles};
