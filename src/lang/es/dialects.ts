// Spanish dialect style tables. Dialect names are language-scoped; the
// default `es` style is anchored to the RAE's Diccionario panhispánico de
// dudas and FundéuRAE recommendations (see notes.md). Custom objects merge
// over the `es` defaults.
import type {Cronli5Options} from '../../types.js';

/**
 * Spanish's own resolved style shape has a separator,
 * clock default, meridiem form, and `h` suffix.
 */
export interface SpanishStyle {
  // Clock default: false renders 24-hour times (RAE/Spain), true renders
  // 12-hour times. An explicit `{ampm}` option still overrides this.
  ampm: boolean;
  // Append an "h" after a 24-hour clock time ("a las 14.30 h").
  hSuffix: boolean;
  // How a 12-hour time names its half of the day: 'descriptors' for the
  // panhispanic "de la mañana/tarde/noche", 'english' for the AM/PM
  // meridiem common in US Spanish.
  meridiem: 'descriptors' | 'english';
  // Separator between hours, minutes, and seconds. FundéuRAE accepts both
  // ":" and "."; the colon is the panhispanic default.
  sep: string;
}

// The panhispanic default, anchored to RAE/FundéuRAE: 24-hour, colon.
const es: SpanishStyle = {
  ampm: false,
  hSuffix: false,
  meridiem: 'descriptors',
  sep: ':'
};

const dialects: {[name: string]: SpanishStyle} = {
  es,
  // Spain is the RAE-anchored default; named explicitly so it is a
  // recognized choice and has a home if it ever diverges.
  'es-ES': es,
  // Mexico leans 12-hour in everyday writing.
  'es-MX': {...es, ampm: true},
  // US Spanish leans 12-hour and writes the English AM/PM meridiem.
  'es-US': {...es, ampm: true, meridiem: 'english'}
};

// Resolve the `dialect` option to a style table.
function resolveDialect(dialect: Cronli5Options['dialect']): SpanishStyle {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.es, ...dialect};
  }

  // A string dialect indexes the table; unknown names fall back to `es`.
  return dialects[dialect as string] || dialects.es;
}

export {resolveDialect};
