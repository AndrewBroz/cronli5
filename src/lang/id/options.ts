// The choices Indonesian offers a caller, as a table of word-level
// conventions (answers 1.2). None of them adds, drops or moves a part of
// the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one style. */
export interface IndonesianStyle {
  // The spoken 12-hour clock with the part of the day: «pukul 9 pagi».
  hour12: boolean;
  // The sign between hours, minutes and seconds: «09.00» or «09:00».
  separator: string;
  // Short weekday and month names: «Sen», «Jun».
  short: boolean;
}

/** The options an Indonesian description is rendered under. */
export type IndonesianOptions = NormalizedOptions<IndonesianStyle>;

// The written norm (EYD): the 24-hour clock with a full stop.
const standard: IndonesianStyle = {
  hour12: false,
  separator: '.',
  short: false
};

/** The named Indonesian styles; there is one norm for the whole country. */
const styles: Readonly<Record<'id', Readonly<IndonesianStyle>>> =
  Object.freeze({id: Object.freeze(standard)});

/** The region codes Indonesian knows, and the style each one selects. */
const regions: {[region: string]: string} = {ID: 'id'};

// What each field may be set to.
const allowed: {[field: string]: unknown[]} = {
  hour12: [true, false],
  separator: ['.', ':'],
  short: [true, false]
};

const fields = Object.keys(allowed).sort();

/**
 * A named table with a caller's overrides applied. A field the table does
 * not have, or a value it does not take, is an error: a mistyped style
 * must not pass in silence.
 */
function style(base: string, overrides?: unknown): IndonesianStyle {
  const named: {[name: string]: Readonly<IndonesianStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(allowed, field)) {
        throw new Cronli5OptionError(
          `Indonesian has no style field \`${field}\`; its fields are ` +
          `${fields.join(', ')}.`);
      }

      if (!allowed[field].includes(value)) {
        throw new Cronli5OptionError(
          `The style field \`${field}\` takes ` +
          `${allowed[field].map(String).join(' or ')}, not ` +
          `${JSON.stringify(value)}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as IndonesianStyle;
}

export {regions, style, styles};
