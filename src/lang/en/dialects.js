// English dialect style tables. Dialect names are language-scoped: en's
// 'uk' means British English (BCP-47 'uk' is Ukrainian).

// Style tables for the `dialect` option. `us` follows the Chicago Manual of
// Style; `uk` follows the Guardian style guide; `house` is cronli5's legacy
// voice. Each supplies the meridiem forms ("a.m." vs closed-up "am"), the
// hour separator (":" vs "."), the 12:00 words, the range connective, the
// serial-comma rule, whether dates read day-first ("1 January" vs
// "January 1"), and whether month-day dates take ordinals ("January 1st").
const dialects = {
  uk: {
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
// 'uk', 'house') look up their table; a custom object defines its own
// style, with any omitted fields inheriting the US (Chicago) defaults.
function resolveDialect(dialect) {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.us, ...dialect};
  }

  return dialects[dialect] || dialects.us;
}
export {resolveDialect};
