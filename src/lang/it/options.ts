// The choices Italian offers a caller, as a table of word-level
// conventions: the clock, short names, and the sign inside a clock time.
// None of them adds, drops or moves a part of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one Italian style. */
export interface ItalianStyle {
  // Whether times are on the spoken 12-hour clock, with the part of the
  // day after each, or on the written 24-hour clock.
  hour12: boolean;
  // What separates hours, minutes and seconds.
  separator: string;
  // Whether weekday and month names are abbreviated.
  short: boolean;
}

/** The options an Italian description is rendered under. */
export type ItalianOptions = NormalizedOptions<ItalianStyle>;

const italy: ItalianStyle = {hour12: false, separator: ':', short: false};

/**
 * The named Italian styles, each a whole table: Italy's, and Switzerland's,
 * whose official Italian writes a point inside a clock time.
 */
const styles: Readonly<Record<'ch' | 'it', Readonly<ItalianStyle>>> =
Object.freeze({
  ch: Object.freeze({...italy, separator: '.'}),
  it: Object.freeze(italy)
});

/** The region codes Italian knows, and the style each one selects. */
const regions: {[region: string]: string} = {CH: 'ch', IT: 'it'};

const fields = Object.keys(italy).sort();

// What each field accepts beyond being of the right kind.
const accepted: {[field: string]: unknown[]} = {
  hour12: [true, false],
  separator: [':', '.'],
  short: [true, false]
};

// A named table with a caller's overrides applied. A field the table does
// not have, or a value the field does not take, is an error: a mistyped
// style must not pass in silence.
function style(base: string, overrides?: unknown): ItalianStyle {
  const named: {[name: string]: Readonly<ItalianStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(italy, field)) {
        throw new Cronli5OptionError(
          `Italian has no style field \`${field}\`; its fields are ` +
          `${fields.join(', ')}.`);
      }

      if (!accepted[field].includes(value)) {
        throw new Cronli5OptionError(
          `The style field \`${field}\` takes one of ` +
          `${JSON.stringify(accepted[field])}, not ${JSON.stringify(value)}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as ItalianStyle;
}

export {regions, style, styles};
