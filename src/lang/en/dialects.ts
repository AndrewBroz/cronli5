// English dialect style tables. `gb` is British English (Guardian style);
// `uk` is a deprecated alias for it, freed because BCP-47 `uk` is the
// Ukrainian language code (now a `cronli5/lang/uk` module).

import type {Cronli5Dialect} from '../../types.js';
import type {DialectStyle} from '../../core/ir.js';

// Style tables for the `dialect` option. `us` follows the Chicago Manual of
// Style; `gb` follows the Guardian style guide; `house` is cronli5's legacy
// voice. Each supplies the meridiem forms ("a.m." vs closed-up "am"), the
// hour separator (":" vs "."), the 12:00 words, the range connective, the
// serial-comma rule, whether dates read day-first ("1 January" vs
// "January 1"), and whether month-day dates take ordinals ("January 1st").
const dialects: Record<'gb' | 'us' | 'house', DialectStyle> = {
  gb: {
    am: 'am',
    closeUp: true,
    dayFirst: true,
    midday: 'midday',
    midnight: 'midnight',
    ordinals: false,
    pm: 'pm',
    sep: '.',
    serialComma: false,
    through: ' to '
  },
  us: {
    am: 'a.m.',
    closeUp: false,
    dayFirst: false,
    midday: 'noon',
    midnight: 'midnight',
    ordinals: false,
    pm: 'p.m.',
    sep: ':',
    serialComma: true,
    through: ' through '
  },
  house: {
    am: 'AM',
    closeUp: false,
    dayFirst: false,
    midday: 'noon',
    midnight: 'midnight',
    ordinals: true,
    pm: 'PM',
    sep: ':',
    serialComma: true,
    through: ' - '
  }
};

// Resolve the `dialect` option to a style table. Named dialects ('us',
// 'gb', 'house') look up their table; a custom object defines its own style,
// with any omitted fields inheriting the US (Chicago) defaults. The legacy
// 'uk' name resolves to 'gb'.
function resolveDialect(
  dialect?: 'gb' | 'house' | 'uk' | 'us' | Cronli5Dialect
): DialectStyle {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.us, ...dialect};
  }

  const name = dialect === 'uk' ? 'gb' : dialect;

  return name && dialects[name] || dialects.us;
}
export {resolveDialect};
