// Spanish dialect style tables. Dialect names are language-scoped; the
// default `es` style is anchored to the RAE's Diccionario panhispánico de
// dudas and FundéuRAE recommendations (see notes.md). Custom objects merge
// over the `es` defaults.
import type {Cronli5Options} from '../../../cronli5.js';
import type {DialectStyle} from '../../core/ir.js';

const dialects: {[name: string]: DialectStyle} = {
  es: {
    // Separator between hours, minutes, and seconds. FundéuRAE accepts
    // both ":" and "."; the colon is the panhispanic default.
    sep: ':'
  } as DialectStyle
};

// Resolve the `dialect` option to a style table.
function resolveDialect(dialect: Cronli5Options['dialect']): DialectStyle {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.es, ...dialect};
  }

  // A string dialect indexes the table; unknown names fall back to `es`.
  return dialects[dialect as string] || dialects.es;
}

export {resolveDialect};
