// Ukrainian dialect style. notes.md ("Anchors") ratifies that Ukrainian has
// no comparable register split to en's `us`/`gb`/`house` axis — there is one
// standard modern literary voice for schedule prose, so this table is a
// single default, not a multi-dialect switchboard. Kept as a real object (not
// `{}`) so a future diaspora/regional register has a home to extend into
// without changing the `Language<Style>` contract, mirroring zh's minimal
// scaffold.

import type {Cronli5Options} from '../../types.js';

// Ukrainian's resolved style shape. Nothing in the ratified conventions
// varies by register yet; `variant` is the seam a future dialect would widen.
export interface UkrainianStyle {
  variant: 'uk';
}

const uk: UkrainianStyle = {variant: 'uk'};

const dialects: {[name: string]: UkrainianStyle} = {
  uk,
  'uk-UA': uk
};

// Resolve the `dialect` option to a style table. Custom objects are not yet
// supported (there is nothing to override); any name falls back to the
// single default.
function resolveDialect(dialect?: Cronli5Options['dialect']): UkrainianStyle {
  return dialects[dialect as string] || uk;
}

export {resolveDialect};
