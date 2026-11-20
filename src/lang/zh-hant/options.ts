// The copy-editor choices Traditional Chinese offers, as a table of
// word-level conventions: 12- or 24-hour times, times in digits with a
// colon or in the units of the clock, the word a weekday begins with,
// whether a weekday range repeats it, and the era the even and the odd
// years are counted in. None of them moves a part of the
// sentence.

import {Cronli5OptionError} from '../../core/errors.js';

/** The word-level conventions of one regional style. */
export interface ZhHantStyle {
  // The era named before the even or the odd years, or nothing.
  era: '' | '公元' | '西元';
  // Whether times are 12-hour with the part of the day first, or 24-hour.
  hour12: boolean;
  // A clock time in digits with a colon, or in hours, minutes and seconds.
  separator: ':' | '時';
  // Whether the end of a weekday range drops the word a weekday begins with.
  short: boolean;
  // The word a weekday begins with.
  weekday: '星期' | '週';
}

// Taiwan: the Executive Yuan's rules for numbers in official documents.
const tw: ZhHantStyle = {
  era: '西元',
  hour12: false,
  separator: ':',
  short: false,
  weekday: '週'
};

/**
 * The named Traditional Chinese styles, each a whole table: pass one as
 * `style`, or spread one and change the fields a house differs on.
 */
const styles: Readonly<Record<'hk' | 'tw', Readonly<ZhHantStyle>>> =
Object.freeze({
  // Hong Kong government usage, which Macau's public notices follow.
  hk: Object.freeze({
    era: '',
    hour12: true,
    separator: '時',
    short: true,
    weekday: '星期'
  }),
  tw: Object.freeze(tw)
});

/** The region codes the language knows, and the style each one selects. */
const regions: {[region: string]: string} = {HK: 'hk', MO: 'hk', TW: 'tw'};

// The values each field may take.
const allowed: {[field: string]: unknown[]} = {
  era: ['西元', '公元', ''],
  hour12: [true, false],
  separator: [':', '時'],
  short: [true, false],
  weekday: ['週', '星期']
};

function quoted(values: unknown[]): string {
  return values.map(function show(value) {
    return JSON.stringify(value);
  }).join(' or ');
}

// A named table with a caller's overrides applied. A field the table does
// not have, or a value the field does not take, is an error: a mistyped
// style must not pass in silence.
function style(base: string, overrides?: unknown): ZhHantStyle {
  const named: {[name: string]: Readonly<ZhHantStyle>} = styles;
  const table: {[field: string]: unknown} = {...named[base]};

  Object.entries({...overrides as object}).forEach(
    function apply([field, value]) {
      if (!Object.hasOwn(allowed, field)) {
        throw new Cronli5OptionError(
          `Traditional Chinese has no style field \`${field}\`; its fields ` +
          `are ${Object.keys(allowed).join(', ')}.`);
      }

      if (!allowed[field].includes(value)) {
        throw new Cronli5OptionError(
          `The style field \`${field}\` takes ${quoted(allowed[field])}, ` +
          `not ${JSON.stringify(value)}.`);
      }

      table[field] = value;
    }
  );

  return table as unknown as ZhHantStyle;
}

export {regions, style, styles};
