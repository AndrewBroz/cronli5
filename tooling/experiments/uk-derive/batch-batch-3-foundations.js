import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import uk from '../../../src/lang/uk/index.js';

const {expect} = chai;

// STAGE 2 CANDIDATE — donor batch "batch-3-foundations" translated to Ukrainian.
// Donor rows: test/lang/en/basic/strings.js, test/lang/en/basic/macros.js,
// test/lang/en/basic/weekday-seven.js, test/lang/en/simple/strings.js.
//
// This is a DRAFT, not the oracle: per CLAUDE.md / the add-language pipeline,
// it becomes test/lang/uk/corpus.js only after human review, and it is
// finalized here BEFORE the uk renderer is ported (src/lang/uk/index.js does
// not exist yet — this file will not execute until the port lands; it is
// written test-shaped so it can be dropped in as-is once it does).
//
// Meaning is inherited unchanged from the donor (already validated); this
// batch only supplies faithful, natural Ukrainian idiom per the ratified
// conventions in src/lang/uk/notes.md. Conventions pinned here that the
// donor's English forms do NOT use (do not silently inherit the donor's
// forms):
//   - Clock: digital colon, unpadded hour, on-the-hour KEEPS ":00"
//     (`о 7:00`, not `о 7`) — notes.md §1.
//   - Exact noon is the numeric `о 12:00 дня`; exact midnight is the
//     adverb `опівночі` (asymmetric by design) — notes.md §1.
//   - A trailing/marked recurring weekday (solo or listed) is
//     `по` + locative plural (`по п'ятницях`, `по понеділках, середах і
//     п'ятницях`), never `що-` + genitive singular — notes.md §4.
//   - A weekday/month RANGE is genitive on both ends with the fixed
//     `з … до … включно` connective (inclusiveness is lexical, not
//     implied) — notes.md §3, §5.
//   - Cadence counts use DIGITS even for small numbers (`кожні 2 хвилини`,
//     not a spelled "two"), unlike English's spelled-small-number cadence
//     — notes.md §8 (numeral-register).
//   - N=1 cadence uses the fixed genitive-singular adverb (щохвилини,
//     щогодини, щодня, щосекунди), never кожна/кожні + "1" — notes.md §6.
//   - A minute/second-of-hour POSITION (simple/strings.js rows) uses the
//     digit + hyphenated locative-ordinal shorthand (`о 5-й хвилині`),
//     the same device notes.md's own worked example uses — notes.md §8.
//     This is a different syntactic role from the bare day-of-month
//     ordinal (notes.md §2, spelled-out "першого"), which this batch does
//     not contain — do not conflate the two.
//   - Cardinal numeral-noun agreement (paucal/plural classes) is applied
//     throughout per notes.md §6's table (e.g. `5 хвилин` genitive
//     plural vs `2 хвилини` genitive singular vs `1 хвилина`/adverb).
//   - Weekday/month names stay lowercase (Ukrainian orthography does not
//     capitalize them), matching the donor's lowercase-fragment register
//     but for a different underlying reason.
//
// SKIPPED (not transferable, not translated below):
//   - basic/macros.js: `['@frequently', 'does not recognize']` (the
//     `error()` case). This checks src/core/parse.ts's thrown error
//     message, which is a single hard-coded English string at the core
//     layer, not a per-language renderer output — no other language corpus
//     (de/es/fr/fi/pt/zh) translates it either. 1 row skipped.

function run(cases) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...values[2] || {}, lang: uk};

    describe(JSON.stringify(pattern), function() {
      it('читається як "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

describe('Українська (uk) — batch-3-foundations candidate:', function() {
  // from test/lang/en/basic/strings.js: surrounding whitespace is ignored
  describe('зайві пробіли навколо шаблону ігноруються', function() {
    run([
      ['0 12 * * * ', 'щодня о 12:00 дня'],
      [' 0 12 * * *', 'щодня о 12:00 дня'],
      ['  0 12 * * *  ', 'щодня о 12:00 дня'],
      ['0 12 * * *\n', 'щодня о 12:00 дня'],
      ['\t0 12 * * *\t', 'щодня о 12:00 дня']
    ]);
  });

  // from test/lang/en/basic/strings.js: 5-part strings
  describe('рядки з 5 полів', function() {
    run([
      ['* * * * *', 'щохвилини'],
      ['*/2 * * * *', 'кожні 2 хвилини'],
      ['*/5 * * * *', 'кожні 5 хвилин'],
      ['*/10 * * * *', 'кожні 10 хвилин'],
      ['*/15 * * * *', 'кожні 15 хвилин'],
      ['*/20 * * * *', 'кожні 20 хвилин'],
      ['*/30 * * * *', 'кожні 30 хвилин'],
      ['0 * * * *', 'щогодини'],
      ['0 */2 * * *', 'кожні 2 години'],
      ['0 */4 * * *', 'кожні 4 години'],
      ['0 */6 * * *', 'кожні 6 годин'],
      ['0 */8 * * *', 'кожні 8 годин'],
      ['0 */12 * * *', 'кожні 12 годин'],
      ['0 12 * * *', 'щодня о 12:00 дня'],
      ['0 0 * * *', 'щодня опівночі'],
      ['0 7 * * *', 'щодня о 7:00'],
      ['0 13 * * FRI', 'по п\'ятницях о 13:00'],
      ['0 2 * * MON-FRI', 'з понеділка до п\'ятниці включно о 2:00'],
      ['0 15 * * TUE', 'по вівторках о 15:00'],
      ['0 14 * * MON,WED,FRI', 'по понеділках, середах і п\'ятницях о 14:00'],
      ['0 23 * * THU', 'по четвергах о 23:00'],
      ['0 6 * * SAT', 'по суботах о 6:00'],
      ['0 13 * * 5', 'по п\'ятницях о 13:00'],
      ['0 2 * * 1-5', 'з понеділка до п\'ятниці включно о 2:00'],
      ['0 15 * * 2', 'по вівторках о 15:00'],
      ['0 14 * * 1,3,5', 'по понеділках, середах і п\'ятницях о 14:00'],
      ['0 23 * * 4', 'по четвергах о 23:00'],
      ['0 6 * * 6', 'по суботах о 6:00']
    ]);
  });

  // from test/lang/en/basic/strings.js: 6-part strings
  describe('рядки з 6 полів', function() {
    run([
      ['* * * * * *', 'щосекунди'],
      ['*/2 * * * * *', 'кожні 2 секунди'],
      ['*/5 * * * * *', 'кожні 5 секунд'],
      ['*/10 * * * * *', 'кожні 10 секунд'],
      ['*/15 * * * * *', 'кожні 15 секунд'],
      ['*/20 * * * * *', 'кожні 20 секунд'],
      ['*/30 * * * * *', 'кожні 30 секунд'],
      ['0 * * * * *', 'щохвилини'],
      ['0 */2 * * * *', 'кожні 2 хвилини'],
      ['0 */5 * * * *', 'кожні 5 хвилин'],
      ['0 */10 * * * *', 'кожні 10 хвилин'],
      ['0 */15 * * * *', 'кожні 15 хвилин'],
      ['0 */20 * * * *', 'кожні 20 хвилин'],
      ['0 */30 * * * *', 'кожні 30 хвилин'],
      ['0 0 * * * *', 'щогодини'],
      ['0 0 */2 * * *', 'кожні 2 години'],
      ['0 0 */4 * * *', 'кожні 4 години'],
      ['0 0 */6 * * *', 'кожні 6 годин'],
      ['0 0 */8 * * *', 'кожні 8 годин'],
      ['0 0 */12 * * *', 'кожні 12 годин'],
      ['0 0 12 * * *', 'щодня о 12:00 дня'],
      ['0 0 0 * * *', 'щодня опівночі'],
      ['0 0 7 * * *', 'щодня о 7:00'],
      ['0 0 13 * * FRI', 'по п\'ятницях о 13:00'],
      ['0 0 2 * * MON-FRI', 'з понеділка до п\'ятниці включно о 2:00'],
      ['0 0 15 * * TUE', 'по вівторках о 15:00'],
      ['0 0 14 * * MON,WED,FRI', 'по понеділках, середах і п\'ятницях о 14:00'],
      ['0 0 23 * * THU', 'по четвергах о 23:00'],
      ['0 0 6 * * SAT', 'по суботах о 6:00'],
      ['0 0 13 * * 5', 'по п\'ятницях о 13:00'],
      ['0 0 2 * * 1-5', 'з понеділка до п\'ятниці включно о 2:00'],
      ['0 0 15 * * 2', 'по вівторках о 15:00'],
      ['0 0 14 * * 1,3,5', 'по понеділках, середах і п\'ятницях о 14:00'],
      ['0 0 23 * * 4', 'по четвергах о 23:00'],
      ['0 0 6 * * 6', 'по суботах о 6:00']
    ]);
  });

  // from test/lang/en/basic/macros.js: nickname macros
  describe('макроси-скорочення', function() {
    run([
      ['@yearly', '1 січня опівночі'],
      ['@annually', '1 січня опівночі'],
      ['@monthly', 'першого числа опівночі'],
      ['@weekly', 'по неділях опівночі'],
      ['@daily', 'щодня опівночі'],
      ['@midnight', 'щодня опівночі'],
      ['@hourly', 'щогодини'],
      ['@reboot', 'під час запуску системи']
    ]);

    // Macros are recognized case-insensitively and tolerate surrounding space.
    run([
      ['@DAILY', 'щодня опівночі'],
      ['  @hourly  ', 'щогодини'],
      ['@REBOOT', 'під час запуску системи']
    ]);

    // SKIPPED: ['@frequently', 'does not recognize'] — src/core/parse.ts's
    // thrown error string is a single hard-coded English message at the core
    // layer, not per-language renderer output; no sibling corpus translates
    // it either. 1 row skipped, not written below.
  });

  // from test/lang/en/basic/weekday-seven.js: standard cron accepts 0-7 for
  // the weekday field, where both 0 and 7 mean Sunday.
  describe('Неділя як 7 (і як 0)', function() {
    describe('одне значення', function() {
      run([
        ['0 0 * * 7', 'по неділях опівночі'],
        ['0 0 * * 0', 'по неділях опівночі']
      ]);
    });

    describe('у діапазоні', function() {
      run([
        ['0 0 * * 5-7', 'з п\'ятниці до неділі включно опівночі']
      ]);
    });
  });

  // from test/lang/en/simple/strings.js: 5-part strings
  describe('прості дійсні рядки — 5 полів', function() {
    run([
      ['* * * * *', 'щохвилини'],
      ['0 * * * *', 'щогодини'],
      ['1 * * * *', 'щогодини о 1-й хвилині'],
      ['5 * * * *', 'щогодини о 5-й хвилині'],
      ['10 * * * *', 'щогодини о 10-й хвилині'],
      ['15 * * * *', 'щогодини о 15-й хвилині'],
      ['30 * * * *', 'щогодини о 30-й хвилині']
    ]);
  });

  // from test/lang/en/simple/strings.js: 6-part strings
  describe('прості дійсні рядки — 6 полів', function() {
    run([
      ['* * * * * *', 'щосекунди'],
      ['0 * * * * *', 'щохвилини'],
      ['1 * * * * *', 'щохвилини о 1-й секунді'],
      ['5 * * * * *', 'щохвилини о 5-й секунді'],
      ['10 * * * * *', 'щохвилини о 10-й секунді'],
      ['15 * * * * *', 'щохвилини о 15-й секунді'],
      ['30 * * * * *', 'щохвилини о 30-й секунді'],
      ['0 0 * * * *', 'щогодини'],
      ['0 1 * * * *', 'щогодини о 1-й хвилині'],
      ['0 5 * * * *', 'щогодини о 5-й хвилині'],
      ['0 10 * * * *', 'щогодини о 10-й хвилині'],
      ['0 15 * * * *', 'щогодини о 15-й хвилині'],
      ['0 30 * * * *', 'щогодини о 30-й хвилині']
    ]);
  });
});
