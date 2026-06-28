// Portuguese dialect style tables. Dialect names are language-scoped; the
// default `pt` style is anchored to the Brazilian norm (VOLP / Academia
// Brasileira de Letras, plus cronstrue `pt_BR`); see notes.md. Custom objects
// merge over the `pt` defaults. pt-PT is a future dialect axis (notes.md
// §"Dialect axis"); no regional dialect ships yet.
import type {Cronli5Options} from '../../types.js';

/**
 * Portuguese's own resolved style shape has a separator,
 * clock default, meridiem form, and `h` suffix.
 */
export interface PortugueseStyle {
  // Clock default: false renders 24-hour times (pt-BR norm), true renders
  // 12-hour day-period times. An explicit `{ampm}` option still overrides this.
  ampm: boolean;
  // Append an "h" after a clock time ("às 09:00 h"). Opt-in only — the "h"
  // register reads colloquial/formal in pt-BR, deferred per notes.md.
  hSuffix: boolean;
  // How a 12-hour time names its half of the day: 'descriptors' for the
  // pt-BR "da madrugada/manhã/tarde/noite", 'english' for the AM/PM meridiem.
  // No shipped dialect uses 'english'; kept for parity with the donor scaffold.
  meridiem: 'descriptors' | 'english';
  // Separator between hours, minutes, and seconds. The colon is the pt-BR
  // default; a custom style can opt into the period.
  sep: string;
}

// The pt-BR default: 24-hour, colon.
const pt: PortugueseStyle = {
  ampm: false,
  hSuffix: false,
  meridiem: 'descriptors',
  sep: ':'
};

// One `pt` table today = pt-BR. pt-PT is a future dialect axis (notes.md);
// it would clear its own native panel before shipping, so it is not declared
// here yet.
const dialects: {[name: string]: PortugueseStyle} = {
  pt,
  // Brazil is the default; named explicitly so it is a recognized choice and
  // has a home if it ever diverges.
  'pt-BR': pt
};

// Resolve the `dialect` option to a style table.
function resolveDialect(dialect: Cronli5Options['dialect']): PortugueseStyle {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.pt, ...dialect};
  }

  // A string dialect indexes the table; unknown names fall back to `pt`.
  return dialects[dialect as string] || dialects.pt;
}

export {resolveDialect};
