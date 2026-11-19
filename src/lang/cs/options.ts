// The choices Czech offers a house: a 12-hour clock with the parts of the
// day, the table forms of the weekdays with months as numbers in a date,
// and the sign between hours and minutes. None moves a part of the
// sentence.

import {Cronli5OptionError} from '../../core/errors.js';

/** The word-level conventions of one house style. */
export interface CzechStyle {
  // Whether times are written from 1 to 12 with the part of the day.
  hour12: boolean;
  // The sign between hours and minutes.
  separator: string;
  // Whether weekdays take their table forms and a date's month its number.
  short: boolean;
}

const written: CzechStyle = {hour12: false, separator: ':', short: false};

/** The named Czech styles: Czech is written one way. */
const styles: Readonly<Record<'cs', Readonly<CzechStyle>>> =
  Object.freeze({cs: Object.freeze(written)});

/** The region codes Czech knows, and the style each one selects. */
const regions: {[region: string]: string} = {CZ: 'cs'};

// The values each field takes.
const accepted: {[field: string]: unknown[]} = {
  hour12: [true, false],
  separator: [':', '.'],
  short: [true, false]
};

// A named table with a caller's overrides applied. A field the table does
// not have, or a value it does not take, is an error: a mistyped style
// must not pass in silence.
function style(base: string, overrides?: unknown): CzechStyle {
  const named: {[name: string]: Readonly<CzechStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(accepted, field)) {
        throw new Cronli5OptionError(
          `Czech has no style field \`${field}\`; its fields are ` +
          `${Object.keys(accepted).join(', ')}.`);
      }

      if (!accepted[field].includes(value)) {
        throw new Cronli5OptionError(
          `The style field \`${field}\` takes ` +
          `${accepted[field].map(String).join(' or ')}, not ` +
          `${JSON.stringify(value)}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as CzechStyle;
}

export {regions, style, styles};
