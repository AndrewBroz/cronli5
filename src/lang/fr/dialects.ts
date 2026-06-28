// French dialect style tables. Dialect names are language-scoped; the default
// `fr` style is anchored to the fr-FR norm (Imprimerie nationale / Académie
// française, plus cronstrue `fr`); see notes.md. Custom objects merge over the
// `fr` defaults. fr-CA is a future dialect axis (notes.md §"Dialect axis"); no
// regional dialect ships yet.
import type {Cronli5Options} from '../../types.js';

/**
 * French's own resolved style shape: a separator and the spacing of the `h`
 * clock mark. fr is 24-hour only, so there is no `ampm`/`meridiem` axis.
 */
export interface FrenchStyle {
  // The mark between hour and minute on the default clock. fr-FR writes the
  // typographic "h" ("9 h 30"); a custom style can opt into a colon or other
  // separator ("9:30"), which replaces the spaced "h" form entirely.
  sep: string;
  // When `sep` is the default "h", whether to drop the surrounding spaces. The
  // spaced "9 h 30" is the ratified fr-FR default; the unspaced "9h30" is the
  // opt-in casual register (notes.md §Dialect axis).
  unspaced: boolean;
}

// The fr-FR default: the spaced "h" clock mark.
const fr: FrenchStyle = {
  sep: 'h',
  unspaced: false
};

// One `fr` table today = fr-FR. fr-CA is a future dialect axis (notes.md);
// it would clear its own native panel before shipping, so it is not declared
// here yet.
const dialects: {[name: string]: FrenchStyle} = {
  fr,
  // France is the default; named explicitly so it is a recognized choice and
  // has a home if it ever diverges.
  'fr-FR': fr
};

// Resolve the `dialect` option to a style table.
function resolveDialect(dialect: Cronli5Options['dialect']): FrenchStyle {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.fr, ...dialect};
  }

  // A string dialect indexes the table; unknown names fall back to `fr`.
  return dialects[dialect as string] || dialects.fr;
}

export {resolveDialect};
