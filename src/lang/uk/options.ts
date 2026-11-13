// The choices Ukrainian offers a caller, as a table of word-level
// conventions: 12- or 24-hour times, and short names. Neither moves a part
// of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of a Ukrainian description. */
export interface UkrainianStyle {
  // Whether times are 12-hour, each with its part of the day, or 24-hour.
  hour12: boolean;
  // Whether weekday and month names are abbreviated.
  short: boolean;
}

/** The options a Ukrainian description is rendered under. */
export type UkrainianOptions = NormalizedOptions<UkrainianStyle>;

const standard: UkrainianStyle = {hour12: false, short: false};

/** The named Ukrainian styles, each a whole table. */
const styles: Readonly<Record<'standard', Readonly<UkrainianStyle>>> =
Object.freeze({standard: Object.freeze(standard)});

/** Ukrainian has no regional styles. */
const regions: {[region: string]: string} = {};

const fields = Object.keys(standard).sort();

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error:
// a mistyped style must not pass in silence.
function style(base: string, overrides?: unknown): UkrainianStyle {
  const named: {[name: string]: Readonly<UkrainianStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(standard, field)) {
        throw new Cronli5OptionError(
          `Ukrainian has no style field \`${field}\`; its fields are ` +
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

  return table as unknown as UkrainianStyle;
}

export {regions, style, styles};
