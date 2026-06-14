// Finnish dialect style tables. Dialect names are language-scoped; the
// default `fi` style follows Kielitoimiston ohjepankki and SFS 4175 (see
// notes.md). Custom objects merge over the `fi` defaults.

import type {DialectStyle} from '../../core/ir.js';
import type {Cronli5Options} from '../../../cronli5.js';

const dialects = {
  fi: {
    // Separator between hours, minutes, and seconds. The period is the
    // Finnish standard ("klo 9.30"); the colon is common on digital
    // displays.
    sep: '.'
  }
};

// Resolve the `dialect` option to a style table. Finnish reads only `sep`
// from the style; the `fi` table fills just that field, so the resolved
// object is a partial DialectStyle cast to the full contract the core
// threads as `opts.style`.
function resolveDialect(dialect?: Cronli5Options['dialect']): DialectStyle {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.fi, ...dialect} as DialectStyle;
  }

  // Named dialects are language-scoped; an unknown name falls back to `fi`.
  return (dialects[dialect as keyof typeof dialects] ||
    dialects.fi) as DialectStyle;
}

export {resolveDialect};
