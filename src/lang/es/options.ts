// The copy-editor choices Spanish offers, as a table of word-level
// conventions: 12- or 24-hour times and short names. Neither moves a part
// of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one house style. */
export interface SpanishStyle {
  // Whether times are 12-hour with «a. m.» and «p. m.», or 24-hour.
  hour12: boolean;
  // Whether weekday and month names are in their three-letter forms.
  short: boolean;
}

/** The options a Spanish description is rendered under. */
export type SpanishOptions = NormalizedOptions<SpanishStyle>;

// Spain: the 24-hour clock of timetables and interfaces.
const es: SpanishStyle = {hour12: false, short: false};

/**
 * The named Spanish styles, each a whole table: pass one as `style`, or
 * spread one and change the fields a house differs on.
 */
const styles: Readonly<Record<'es' | 'mx', Readonly<SpanishStyle>>> =
Object.freeze({
  es: Object.freeze(es),
  // Mexico and the United States: the 12-hour clock.
  mx: Object.freeze({...es, hour12: true})
});

/** The region codes Spanish knows, and the style each one selects. */
const regions: {[region: string]: string} = {ES: 'es', MX: 'mx', US: 'mx'};

// The values each field may take.
const allowed: {[field: string]: unknown[]} = {
  hour12: [true, false],
  short: [true, false]
};

function quoted(values: unknown[]): string {
  return values.map(function show(value) {
    return JSON.stringify(value);
  }).join(', ');
}

// A named table with a caller's overrides applied. A field the table does
// not have, or a value the field cannot take, is an error: a mistyped
// style must not pass in silence. (The entry point has already refused
// anything that is not a table.)
function style(base: string, overrides?: unknown): SpanishStyle {
  const named: {[name: string]: Readonly<SpanishStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(allowed, field)) {
        throw new Cronli5OptionError(
          `Spanish has no style field \`${field}\`; its fields are ` +
          `${Object.keys(allowed).join(', ')}.`);
      }

      if (!allowed[field].includes(value)) {
        throw new Cronli5OptionError(
          `The style field \`${field}\` is ${JSON.stringify(value)}; it ` +
          `may be ${quoted(allowed[field])}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as SpanishStyle;
}

export {regions, style, styles};
