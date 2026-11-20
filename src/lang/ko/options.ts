// The copy-editor choices Korean offers: the 12-hour words or the 24-hour
// digits, and weekday names with or without «요일» in a list. Neither
// moves a part of the sentence.

import {Cronli5OptionError} from '../../core/errors.js';
import type {NormalizedOptions} from '../../core/schedule.js';

/** The word-level conventions of one Korean style. */
export interface KoreanStyle {
  // Whether a time carries «오전», «낮» or «오후», or is the hour from 0
  // to 23.
  hour12: boolean;
  // Whether a list or a range of weekdays after «매주» drops «요일».
  short: boolean;
}

/** The options a Korean description is rendered under. */
export type KoreanOptions = NormalizedOptions<KoreanStyle>;

const ko: KoreanStyle = {hour12: true, short: false};

/** The named Korean styles, each a whole table. */
const styles: Readonly<Record<'ko', Readonly<KoreanStyle>>> =
  Object.freeze({ko: Object.freeze(ko)});

/** The region codes Korean knows, and the style each one selects. */
const regions: {[region: string]: string} = {KR: 'ko'};

const fields = Object.keys(ko).sort();

// A named table with a caller's overrides applied. A field the table does
// not have, or a value of another kind than the table holds, is an error:
// a mistyped style must not pass in silence.
function style(base: string, overrides?: unknown): KoreanStyle {
  const named: {[name: string]: Readonly<KoreanStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(ko, field)) {
        throw new Cronli5OptionError(
          `Korean has no style field \`${field}\`; its fields are ` +
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

  return table as unknown as KoreanStyle;
}

export {regions, style, styles};
