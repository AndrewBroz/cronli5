// The choices Russian offers a copy editor, as a table of word-level
// conventions. None of them moves a part of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of the one Russian style. */
export interface RussianStyle {
  // Whether an hour is said with its part of the day («9 часов утра»).
  hour12: boolean;
  // Whether a 24-hour time writes its hour in two digits («09:00»).
  padHour: boolean;
  // The sign inside a clock time.
  separator: ':' | '.';
  // Whether weekday and month names are abbreviated.
  short: boolean;
}

/** The options a Russian description is rendered under. */
export type RussianOptions = NormalizedOptions<RussianStyle>;

const ru: RussianStyle = {
  hour12: false,
  padHour: false,
  separator: ':',
  short: false
};

/** The named Russian styles: one table. */
const styles: Readonly<Record<'ru', Readonly<RussianStyle>>> =
  Object.freeze({ru: Object.freeze(ru)});

const fields = Object.keys(ru).sort();
const separators: unknown[] = [':', '.'];

// Whether a value is of the kind a field holds: a boolean, or one of the
// two signs a clock time is written with.
function fits(field: string, value: unknown): boolean {
  const kinds: {[field: string]: boolean} = {
    separator: separators.includes(value)
  };

  return kinds[field] ?? typeof value === 'boolean';
}

// The named table with a caller's overrides applied. A field the table
// does not have, or a value of another kind, is an error: a mistyped
// style must not pass in silence.
function style(base: string, overrides?: unknown): RussianStyle {
  const named: {[name: string]: Readonly<RussianStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(ru, field)) {
        throw new Cronli5OptionError(
          `Russian has no style field \`${field}\`; its fields are ` +
          `${fields.join(', ')}.`);
      }

      if (!fits(field, value)) {
        throw new Cronli5OptionError(
          `The style field \`${field}\` does not take ` +
          `${JSON.stringify(value)}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as RussianStyle;
}

export {style, styles};
