// The language-agnostic relational stability engine — oracle-free, the dual
// of a corpus: a corpus pins rows point-wise; these relations pin what an
// overlay silently breaks while keeping every pinned row green.
//
// Arm stability: the day-of-month phrasing tokens (ordinals plus
// cadence/parity/Quartz markers) of a date-only rendering must survive
// unchanged when a weekday restriction turns the pattern into a DOM∨DOW
// union. The union may reframe the clause; it must not switch the arm
// between cadence and enumeration.
//
// Frame stability: the time/cadence body must appear verbatim in the
// date-only and union renderings alike — day fields extend the sentence,
// they never rewrite its time architecture.
//
// Weekday-order stability: the weekday names of a union follow the same
// display order the weekday-only rendering uses.
//
// An extractor supplies everything language-specific:
// {
//   dialects:          (string|null)[]   — null is the language default
//   render(cron, dialect): string        — the language's fragment renderer
//   dateTokens(text):  string[]          — day-of-month tokens in the
//                                          engine vocabulary: surface
//                                          ordinals plus 'cadence:<n>',
//                                          'parity:odd'|'parity:even',
//                                          'quartz:<slug>' markers
//   weekdayOrder(text): string[]         — weekday names in output order
//   timeBody(time, dialect): string      — the day-free time body (the
//                                          language's day-qualifier words
//                                          stripped)
//   parityStartTokens: string[]          — the ordinals a parity idiom
//                                          absorbs (en: ['1st', '2nd'])
// }
//
// A new language ports the donor's extractor (see
// tooling/scripts/stability/en.mjs) and gates the matrix in its test suite;
// a relation the donor held must hold in the target.

// [minute, hour] time prefixes; each renders a distinct time body.
const TIMES = [['0', '0'], ['30', '9'], ['*/10', '9-17'], ['0', '*/5']];

// Date fields spanning every arm shape: single, list, range, cadence steps,
// parity steps, Quartz.
const DATES = ['13', '1,15', '3-9', '2/3', '3/2', '*/2', '2/2', 'L', '15W'];

// Weekday fields spanning single, list, range, step.
const WEEKDAYS = ['5', 'MON,WED', '1-5', '*/2'];

// Fold the declared equivalences before comparison. The parity idiom names
// the same set the interval-2 cadence phrase does ("every other day of the
// month [from the 2nd]" == "an odd/even-numbered day"), so both normalize
// to one parity marker — and the idiom absorbs the cadence's start ordinal
// (parity starts are only 1 or 2), so the extractor's parityStartTokens
// fold away with it.
function normalized(tokens, parityStartTokens) {
  const parity = tokens.some(function odd(token) {
    return token.startsWith('parity:') || token === 'cadence:other';
  });

  return tokens
    .map(function fold(token) {
      return parity &&
        (token.startsWith('parity:') || token === 'cadence:other') ?
        'parity' :
        token;
    })
    .filter(function keep(token) {
      return !(parity && parityStartTokens.includes(token));
    })
    .sort();
}

// Bind the engine to a language extractor: checkPair verifies one
// (time, date, weekday, dialect) cell and returns violation strings; run
// sweeps the whole matrix and prints the report.
function makeStability(extractor) {
  function checkPair(time, date, weekday, dialect) {
    const violations = [];
    const label = (dialect ?? 'default') + ' ' + time.join(' ') + ' ' +
      date + ' * ' + weekday;
    const dateOnly = extractor.render(
      time[0] + ' ' + time[1] + ' ' + date + ' * *', dialect);
    const union = extractor.render(
      time[0] + ' ' + time[1] + ' ' + date + ' * ' + weekday, dialect);
    const weekdayOnly = extractor.render(
      time[0] + ' ' + time[1] + ' * * ' + weekday, dialect);

    const armBefore = normalized(extractor.dateTokens(dateOnly),
      extractor.parityStartTokens).join(',');
    const armAfter = normalized(extractor.dateTokens(union),
      extractor.parityStartTokens).join(',');

    if (armBefore !== armAfter) {
      violations.push('[arm] ' + label + ' — date tokens changed: [' +
        armBefore + '] vs [' + armAfter + ']');
    }

    const body = extractor.timeBody(time, dialect);

    if (dateOnly.indexOf(body) === -1) {
      violations.push('[frame] ' + label + ' — body "' + body +
        '" missing from date-only rendering: ' + dateOnly);
    }

    if (union.indexOf(body) === -1) {
      violations.push('[frame] ' + label + ' — body "' + body +
        '" missing from union rendering: ' + union);
    }

    const orderBase = extractor.weekdayOrder(weekdayOnly).join(',');
    const orderUnion = extractor.weekdayOrder(union).join(',');

    if (orderUnion && orderBase !== orderUnion) {
      violations.push('[weekday-order] ' + label + ' — union order [' +
        orderUnion + '] vs display order [' + orderBase + ']');
    }

    return violations;
  }

  function run() {
    const violations = [];

    for (const dialect of extractor.dialects) {
      for (const time of TIMES) {
        for (const date of DATES) {
          for (const weekday of WEEKDAYS) {
            violations.push(...checkPair(time, date, weekday, dialect));
          }
        }
      }
    }

    console.log(violations.length + ' issue(s).');
    violations.forEach(function show(violation) {
      console.log('  - ' + violation);
    });

    return violations;
  }

  return {checkPair, run};
}

export {DATES, TIMES, WEEKDAYS, makeStability, normalized};
