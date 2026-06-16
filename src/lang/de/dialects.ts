// German dialect style tables. Dialect names are language-scoped; the default
// `de` style follows Duden (see notes.md). Custom objects merge over `de`.
import type {Cronli5Options} from '../../types.js';

// German's resolved style shape. Regional variation that schedule prose
// surfaces is the separator today; `de-AT`'s "Jänner" will add a month table.
export interface GermanStyle {
  // Separator between hours and minutes. Duden accepts ":" and "."; the colon
  // is the default.
  sep: string;
}

const de: GermanStyle = {
  sep: ':'
};

const dialects: {[name: string]: GermanStyle} = {
  de
};

// Resolve the `dialect` option to a style table.
function resolveDialect(dialect: Cronli5Options['dialect']): GermanStyle {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.de, ...dialect};
  }

  return dialects[dialect as string] || dialects.de;
}

export {resolveDialect};
