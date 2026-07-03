// Relational stability checks for the English renderer — oracle-free, the
// dual of the corpus: the corpus pins rows point-wise; these pin the
// RELATIONS between rows an overlay silently breaks.
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
// Run directly to print the report (non-zero exit on any violation);
// test/lang/en/stability.js gates it.

import {pathToFileURL} from 'node:url';
import cronli5 from '../../src/cronli5.js';

// [minute, hour] time prefixes; each renders a distinct time body.
const TIMES = [['0', '0'], ['30', '9'], ['*/10', '9-17'], ['0', '*/5']];

// Date fields spanning every arm shape: single, list, range, cadence steps,
// parity steps, Quartz.
const DATES = ['13', '1,15', '3-9', '2/3', '3/2', '*/2', '2/2', 'L', '15W'];

// Weekday fields spanning single, list, range, step.
const WEEKDAYS = ['5', 'MON,WED', '1-5', '*/2'];

// Dialects the matrix runs under: the default (us) plus each named dialect.
// Grammar is dialect-independent; only typography varies, and the token
// extractor reads day words, which no dialect restyles.
const DIALECTS = [null, 'gb', 'house'];

const WEEKDAY_NAME =
  /(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)s?/g;

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect} : {});
}

// The date-arm tokens of a rendering: day ordinals plus normalized
// cadence/parity/Quartz markers. Weekday names are stripped first so the
// same extractor serves date-only and union renderings; the time prefixes
// above never produce ordinals, so every ordinal present is the date's.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\b(\d+(?:st|nd|rd|th))\b/g)) {
    tokens.push(m[1]);
  }

  for (const m of noWeekdays.matchAll(
    /every (other|\d+(?:st|nd|rd|th)) day/g)) {
    tokens.push('cadence:' + m[1]);
  }

  if ((/odd-numbered day/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/even-numbered day/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/last day of the month/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/weekday nearest the/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// Fold the declared equivalences before comparison. The parity idiom names
// the same set the interval-2 cadence phrase does ("every other day of the
// month [from the 2nd]" == "an odd/even-numbered day"), so both normalize
// to one parity marker — and the idiom absorbs the cadence's start ordinal
// (parity starts are only 1 or 2), so those ordinals fold away with it.
function normalized(tokens) {
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
      return !(parity && (token === '1st' || token === '2nd'));
    })
    .sort();
}

// The time body of a [minute, hour] prefix: its day-free rendering with the
// day-qualifier words stripped. This exact string must survive in every
// day-restricted rendering of the same time.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^every day at /, 'at ')
    .replace(/,? every day$/, '')
    .replace(/^every day /, '');
}

// The weekday display order of a rendering, as a name list.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function name(m) {
    return m[1];
  });
}

// Check one (time, date, weekday, dialect) cell; returns violation strings.
function checkPair(time, date, weekday, dialect) {
  const violations = [];
  const label = (dialect ?? 'us') + ' ' + time.join(' ') + ' ' + date +
    ' * ' + weekday;
  const dateOnly = render(time[0] + ' ' + time[1] + ' ' + date + ' * *',
    dialect);
  const union = render(
    time[0] + ' ' + time[1] + ' ' + date + ' * ' + weekday, dialect);
  const weekdayOnly = render(time[0] + ' ' + time[1] + ' * * ' + weekday,
    dialect);

  const armBefore = normalized(dateTokens(dateOnly)).join(',');
  const armAfter = normalized(dateTokens(union)).join(',');

  if (armBefore !== armAfter) {
    violations.push('[arm] ' + label + ' — date tokens changed: [' +
      armBefore + '] vs [' + armAfter + ']');
  }

  const body = timeBody(time, dialect);

  if (dateOnly.indexOf(body) === -1) {
    violations.push('[frame] ' + label + ' — body "' + body +
      '" missing from date-only rendering: ' + dateOnly);
  }

  if (union.indexOf(body) === -1) {
    violations.push('[frame] ' + label + ' — body "' + body +
      '" missing from union rendering: ' + union);
  }

  const orderBase = weekdayOrder(weekdayOnly).join(',');
  const orderUnion = weekdayOrder(union).join(',');

  if (orderUnion && orderBase !== orderUnion) {
    violations.push('[weekday-order] ' + label + ' — union order [' +
      orderUnion + '] vs display order [' + orderBase + ']');
  }

  return violations;
}

function run() {
  const violations = [];

  for (const dialect of DIALECTS) {
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

export {DIALECTS, TIMES, DATES, WEEKDAYS, checkPair, dateTokens, run};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = run().length ? 1 : 0;
}
