// German dialect style tables. Dialect names are language-scoped; the default
// `de` style follows Duden (see notes.md). Custom objects merge over `de`.
import type {Cronli5Options} from '../../types.js';

// German's resolved style shape. Regional variation that schedule prose
// surfaces is the separator and the month names (Austrian "Jänner").
export interface GermanStyle {
  // Month names, 1-based (a null hole at index 0).
  months: readonly (string | null)[];
  // Separator between hours and minutes. Duden accepts ":" and "."; the colon
  // is the default.
  sep: string;
}

// The standard (de-DE) month names.
const months: readonly (string | null)[] = [
  null, 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember'
];

const de: GermanStyle = {
  months,
  sep: ':'
};

const dialects: {[name: string]: GermanStyle} = {
  de,
  // Germany is the Duden-anchored default; named explicitly so it is a
  // recognized choice and has a home if it ever diverges.
  'de-DE': de,
  // Austria names January "Jänner" (standard register; the informal "Feber"
  // for February is skipped — the renderer uses the written news register).
  'de-AT': {...de, months: months.map(
    function austrian(name, index): string | null {
      return index === 1 ? 'Jänner' : name;
    })},
  // Switzerland keeps the standard month names; its only schedule-relevant
  // divergence (ß→ss) never surfaces in this renderer's output. Named for a
  // home if it ever diverges.
  'de-CH': de
};

// Resolve the `dialect` option to a style table.
function resolveDialect(dialect: Cronli5Options['dialect']): GermanStyle {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.de, ...dialect};
  }

  return dialects[dialect as string] || dialects.de;
}

export {resolveDialect};
