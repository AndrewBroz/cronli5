// The copy-editor choices English offers, as a table of word-level
// conventions: 12- or 24-hour times, short names, the words for a.m. and
// noon, the range word. None of them moves a part of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one house style. */
export interface EnglishStyle {
  am: string;
  // Whether a.m. and p.m. are joined to the time with no space.
  closeUp: boolean;
  // Whether a date puts the day before its month.
  dayFirst: boolean;
  // Whether times are 12-hour with a.m. and p.m., or 24-hour.
  hour12: boolean;
  // The word for 12:00.
  midday: string;
  // The word for 0:00.
  midnight: string;
  // Whether a day beside its month keeps its ordinal suffix.
  ordinals: boolean;
  pm: string;
  // What separates hours, minutes and seconds.
  sep: string;
  serialComma: boolean;
  // Whether weekday and month names are abbreviated.
  short: boolean;
  // The word that joins the two ends of an inclusive range.
  through: string;
}

/** The options an English description is rendered under. */
export type EnglishOptions = NormalizedOptions<EnglishStyle>;

// Chicago Manual of Style.
const us: EnglishStyle = {
  am: 'a.m.',
  closeUp: false,
  dayFirst: false,
  hour12: true,
  midday: 'noon',
  midnight: 'midnight',
  ordinals: false,
  pm: 'p.m.',
  serialComma: true,
  sep: ':',
  short: false,
  through: 'through'
};

/**
 * The named English styles, each a whole table: pass one as `style`, or
 * spread one and change the fields a house differs on.
 */
const styles: Readonly<Record<'gb' | 'house' | 'us', Readonly<EnglishStyle>>> =
Object.freeze({
  // The Guardian style guide.
  gb: Object.freeze({
    ...us,
    am: 'am',
    closeUp: true,
    dayFirst: true,
    midday: 'midday',
    pm: 'pm',
    sep: '.',
    serialComma: false,
    through: 'to'
  }),
  house: Object.freeze({...us, am: 'AM', ordinals: true, pm: 'PM'}),
  us: Object.freeze(us)
});

/** The region codes English knows, and the style each one selects. */
const regions: {[region: string]: string} = {GB: 'gb', US: 'us'};

const fields = Object.keys(us).sort();

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error:
// a mistyped style must not pass in silence. (The entry point has already
// refused anything that is not a table.) The range word may come padded
// with the spaces it is set between; the sentence supplies those.
function style(base: string, overrides?: unknown): EnglishStyle {
  const named: {[name: string]: Readonly<EnglishStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(us, field)) {
        throw new Cronli5OptionError(
          `English has no style field \`${field}\`; its fields are ` +
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

  const made = table as unknown as EnglishStyle;

  return {...made, through: made.through.trim()};
}

export {regions, style, styles};
