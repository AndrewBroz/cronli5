// The copy-editor choices English offers: 12- or 24-hour times, short
// names, and a style table of word-level conventions. None of them moves
// a part of the sentence.

import type {Cronli5Options} from '../../types.js';
import type {NormalizedOptions} from '../../core/schedule.js';
import {readingOf} from '../../core/reading.js';

/** The word-level conventions of one house style. */
export interface EnglishStyle {
  am: string;
  // Whether a.m. and p.m. are joined to the time with no space.
  closeUp: boolean;
  // Whether a date puts the day before its month.
  dayFirst: boolean;
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
  midday: 'noon',
  midnight: 'midnight',
  ordinals: false,
  pm: 'p.m.',
  sep: ':',
  serialComma: true,
  through: 'through'
};

const styles = new Map<unknown, EnglishStyle>([
  // The Guardian style guide.
  ['gb', {
    ...us,
    am: 'am',
    closeUp: true,
    dayFirst: true,
    midday: 'midday',
    pm: 'pm',
    sep: '.',
    serialComma: false,
    through: 'to'
  }],
  ['house', {...us, am: 'AM', ordinals: true, pm: 'PM'}],
  ['us', us]
]);

// A custom table overrides fields of the US one. A field that is missing
// or is not of the kind the table holds is ignored. The range word may
// come padded with the spaces it is set between; the sentence supplies
// those.
function customStyle(custom: object | null): EnglishStyle {
  const given: {[field: string]: unknown} = {...custom};
  const style = Object.fromEntries(Object.entries(us).map(
    function pick([field, standard]) {
      const value = given[field];

      return [field, typeof value === typeof standard ? value : standard];
    }
  )) as unknown as EnglishStyle;

  return {...style, through: style.through.trim()};
}

function styleFor(dialect: Cronli5Options['dialect']): EnglishStyle {
  return typeof dialect === 'object' ?
    customStyle(dialect) :
    styles.get(dialect) ?? us;
}

/** The caller's options with every default filled in. */
function normalize(options?: Cronli5Options): EnglishOptions {
  const given: Cronli5Options = {...options};

  return {
    ...readingOf({
      cron: (given as {cron?: unknown}).cron ??
        ['standard', 'quartz'][Number(Boolean(given.quartz))],
      seconds: Boolean(given.seconds),
      years: Boolean(given.years)
    }),
    ampm: given.ampm !== false,
    lenient: Boolean(given.lenient),
    short: Boolean(given.short),
    style: styleFor(given.dialect)
  };
}

export {normalize};
