import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import uk from '../../../src/lang/uk/index.js';

const {expect} = chai;

// STAGE 2 CANDIDATE — donor batch "batch-10-options" translated to Ukrainian.
// Donor rows: test/lang/en/options/ampm.js, test/lang/en/options/lenient.js,
// test/lang/en/options/seconds.js, test/lang/en/options/short.js,
// test/lang/en/options/years.js.
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
//     п'ятницях`), never `що-` + genitive singular — notes.md §4. This
//     covers donor's en "every <Weekday>" AND "on <Weekday>s" alike — uk
//     has one recurring-weekday device, not two.
//   - A weekday/month RANGE is genitive on both ends with the fixed
//     `з … до … включно` connective (inclusiveness is lexical, not
//     implied) — notes.md §3, §5.
//   - Cadence counts use DIGITS even for small numbers (`кожні 2 хвилини`,
//     not a spelled "two"), unlike English's spelled-small-number cadence
//     — notes.md §8 (numeral-register).
//   - N=1 cadence uses the fixed genitive-singular adverb (щохвилини,
//     щогодини, щодня, щосекунди, щороку), never кожна/кожні + "1" —
//     notes.md §6.
//   - Cardinal numeral-noun agreement (paucal/plural classes) is applied
//     throughout per notes.md §6's table (e.g. `5 хвилин` genitive plural
//     vs `2 хвилини` genitive singular vs `1 хвилина`); рік (year) is
//     irregular at 2-4 (`2 роки`, not `2 року`), matching masculine
//     і-stem nouns like день.
//   - A year trails as `у <year> році` (locative) UNLESS it is the single
//     year folded onto a LEADING date phrase, where it fuses genitive
//     onto the date (`1 січня 2030 року`) — years.js's own "the year fold
//     is exactly the leading date phrase" rule, ported structurally.
//   - The DOM∨DOW union is the event-framed clause `щоразу, коли настає
//     <DOM> або <weekday>` (notes.md §7, ratified), never a bare
//     "or"/"and" connective; a shared restricted month fronts once before
//     it (`у червні, щоразу …`), never straddling one arm only.
//   - Weekday/month names stay lowercase in full form (Ukrainian
//     orthography does not capitalize them); short.js's abbreviations are
//     a distinct, deliberately capitalized token set (below).
//
// Two option axes are STRUCTURAL NO-OPS for Ukrainian and are called out
// per-row rather than silently reproducing the donor's reason for the
// option existing:
//   - `ampm` (options/ampm.js): notes.md's Anchors section is explicit that
//     uk has no am/pm register to toggle — the ratified clock (§1) is
//     always the 24-hour digital colon. `{ampm: false}` is threaded
//     through these rows only for structural/coverage parity with the
//     donor's option surface (so a future uk renderer is exercised with
//     the option present); the rendered Ukrainian is identical to what
//     the option-free default already produces.
//   - the digit-vs-word half of `short` (options/short.js): notes.md §8
//     already ratified "digits everywhere" for cadence/list positions, so
//     `short`'s number-spelling effect is likewise a no-op for uk. What
//     `short` DOES change meaningfully for uk (translated below, since it
//     is genuinely transferable) is abbreviating weekday/month NAMES and
//     compacting ranges to a bare hyphen-token, mirroring the donor's own
//     "ranges compact with hyphens" behavior. These abbreviation and
//     range-compaction choices are NOT panel-ratified in notes.md (no
//     `short` section exists there yet) — they are this translator's
//     best-effort, internally-consistent draft, flagged for panel review
//     alongside the rest of this candidate:
//       - Standard Ukrainian calendar weekday abbreviations, capitalized,
//         case-invariant stems: Пн, Вт, Ср, Чт, Пт, Сб, Нд.
//       - Standard Ukrainian month abbreviations, lowercase, no period
//         (mirroring the donor's own unpunctuated "Jan"/"Jun"), case-
//         invariant stems: січ, лют, бер, квіт, трав, черв, лип, серп,
//         вер, жовт, лист, груд.
//       - EVERY range (weekday, month, date, clock-time, bare value)
//         compacts to a bare `A–B` (en dash, no spaces) under short,
//         dropping the `з … до … включно` scaffolding entirely — the
//         direct structural mirror of the donor dropping "through" for a
//         bare hyphen. A bare-day-of-month value keeps the fully spelled
//         ordinal word (never a digit marker or a plain cardinal digit)
//         even compacted, since notes.md §2's spelled-ordinal mandate for
//         a bare DOM is NOT superseded by `short` (en's own short output
//         keeps "1st"/"5th" as ordinal words, never bare "1"/"5" either —
//         see the DOM rows below). The union frame's own logical
//         connective ("щоразу, коли настає…") is never compacted away —
//         only the weekday/month TOKENS inside it abbreviate; the
//         disambiguating construction itself is meaning-load-bearing
//         (notes.md §7), not typography.
//       - A single-position digit-ordinal (`5-й хвилині`, `30-й секунді`)
//         reuses the invariant `-й` marker notes.md's own numeral-register
//         example and the shipped batch-3-foundations candidate already
//         use, rather than a fully case/gender-agreeing spelled suffix.
//
// SKIPPED (not transferable, not translated below):
//   - options/lenient.js's "a failing renderer is not masked" describe
//     block (2 `it` cases, not `[pattern, expected]` corpus rows): it
//     hardcodes the EN language object into a broken mock
//     (`{...en, describe: () => throw}`) to assert that core error
//     propagation isn't swallowed by `lenient`. This is core plumbing
//     behavior common to every language, not uk-specific renderer output
//     — no sibling corpus (de/es/fr/fi/pt/zh) translates it either.
//     2 cases skipped.
//   2 rows skipped total (0 pattern/expected rows; the 2 skipped are
//   `it()` cases, counted separately from the row tally below).

const FALLBACK = 'нерозпізнаний шаблон cron';

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

describe('Українська (uk) — batch-10-options candidate:', function() {
  // from test/lang/en/options/ampm.js — 24-hour option. STRUCTURAL NO-OP for
  // uk (see header): rendered form is identical to the option-free default.
  describe('24-годинний формат (ampm: false) — без ефекту для uk', function() {
    const options = {ampm: false};

    run([
      ['0 12 * * *', 'щодня о 12:00 дня', options],
      ['0 0 * * *', 'щодня опівночі', options],
      ['0 7 * * *', 'щодня о 7:00', options],
      ['0 13 * * FRI', 'по п\'ятницях о 13:00', options],
      ['0 2 * * MON-FRI', 'з понеділка до п\'ятниці включно о 2:00', options],
      ['0 15 * * TUE', 'по вівторках о 15:00', options],
      ['0 14 * * MON,WED,FRI',
        'по понеділках, середах і п\'ятницях о 14:00', options],
      ['0 23 * * THU', 'по четвергах о 23:00', options],
      ['0 6 * * SAT', 'по суботах о 6:00', options]
    ]);
  });

  // from test/lang/en/options/lenient.js
  describe('Опція lenient:', function() {
    describe('дійсний вхід не змінюється', function() {
      run([
        ['30 9 * * *', 'щодня о 9:30', {lenient: true}],
        ['*/15 * * * *', 'кожні 15 хвилин', {lenient: true}]
      ]);
    });

    describe('недійсний вхід повертає запасний опис', function() {
      run([
        ['5-1/2 * * * *', FALLBACK, {lenient: true}],
        ['61 * * * *', FALLBACK, {lenient: true}],
        ['not cron', FALLBACK, {lenient: true}],
        ['', FALLBACK, {lenient: true}],
        [null, FALLBACK, {lenient: true}],
        ['@huh', FALLBACK, {lenient: true}]
      ]);
    });

    // SKIPPED: the "a failing renderer is not masked" block (2 `it` cases)
    // — core error-propagation plumbing hardcoded to the `en` language
    // object, not uk-specific renderer output. See header note.
  });

  // from test/lang/en/options/seconds.js
  describe('Опція seconds:', function() {
    const options = {seconds: true};

    run([
      ['* * * * *', 'щосекунди', options],
      ['*/2 * * * *', 'кожні 2 секунди', options],
      ['*/5 * * * *', 'кожні 5 секунд', options],
      ['*/15 * * * *', 'кожні 15 секунд', options],
      ['*/30 * * * *', 'кожні 30 секунд', options],
      ['*/7 * * * *',
        'кожні 7 секунд з 0-ї до 56-ї секунди включно щохвилини', options],
      ['30 * * * *', 'на 30-й секунді щохвилини', options],
      ['0 * * * *', 'щохвилини', options],
      ['0 30 * * *', 'на 30-й хвилині щогодини', options],
      ['0 0 * * *', 'щогодини', options],
      ['0 0 12 * *', 'щодня о 12:00 дня', options]
    ]);
  });

  // from test/lang/en/options/short.js
  describe('Опція short:', function() {
    const options = {short: true};

    run([
      ['* * * * *', 'щохвилини', options],
      ['*/2 * * * *', 'кожні 2 хвилини', options],
      ['*/5 * * * *', 'кожні 5 хвилин', options],
      ['*/10 * * * *', 'кожні 10 хвилин', options],
      ['*/15 * * * *', 'кожні 15 хвилин', options],
      ['0 * * * *', 'щогодини', options],
      ['0 */2 * * *', 'кожні 2 години', options],
      ['0 */4 * * *', 'кожні 4 години', options],
      ['0 */6 * * *', 'кожні 6 годин', options],
      ['0 */8 * * *', 'кожні 8 годин', options],
      ['0 */12 * * *', 'кожні 12 годин', options],
      ['0 13 * * FRI', 'по Пт о 13:00', options],
      ['0 2 * * MON-FRI', 'Пн–Пт о 2:00', options],
      ['0 6 * * SAT', 'по Сб о 6:00', options],
      ['0 13 * * 5', 'по Пт о 13:00', options],
      ['0 2 * * 1-5', 'Пн–Пт о 2:00', options],
      ['0 14 * * 1,3,5', 'по Пн, Ср і Пт о 14:00', options],
      ['0 23 * * 4', 'по Чт о 23:00', options],
      ['0 6 * * 6', 'по Сб о 6:00', options],
      // The `7`-for-Sunday alias resolves to Sunday, abbreviated under short.
      ['0 9 * * 7', 'по Нд о 9:00', options],
      // A plain weekday list pluralizes per name, abbreviated under short;
      // weekday lists display Monday-first with Sunday last.
      ['0 9 * * 0,2', 'по Вт і Нд о 9:00', options]
    ]);

    // The short flag compacts every "A through B" range to a bare "A–B"
    // (en dash) for uk: weekday, month, and date ranges, value ranges
    // within lists, and clock-time windows all drop the `з…до…включно`
    // scaffolding. A bare day-of-month keeps its fully spelled ordinal
    // (never a digit marker or a plain cardinal) even compacted —
    // notes.md §2 is not superseded.
    describe('діапазони стискаються дефісом (не панельовано)', function() {
      run([
        ['0 0 1 JAN-MAR *', 'першого числа січ–бер опівночі', options],
        ['0 12 * 11-2 *', 'щодня лист–лют о 12:00 дня', options],
        ['0 0 1-5 * *', 'першого–п\'ятого числа опівночі', options],
        ['0 0 13 * 1-5',
          'щоразу, коли настає тринадцяте число місяця або один із днів ' +
          'Пн–Пт, опівночі', options],
        // A restricted month fronts the whole union once.
        ['0 0 13 6 5L',
          'у черв, щоразу, коли настає тринадцяте число місяця або остання ' +
          'Пт місяця, опівночі', options],
        ['0 0 * * FRI-MON', 'Пт–Пн опівночі', options],
        ['0-29 * * * *', 'щохвилини 0–29 щогодини', options],
        ['0-30,45 9 * * *', 'хвилини 0–30 і 45 о 9:00', options],
        ['*/15 9-17 * * *', 'кожні 15 хвилин 9:00–17:45', options],
        ['* 9 * * *', 'щохвилини 9-ї години', options],
        ['30 9-20,22 * * *',
          'на 30-й хвилині 9–20:30 і о 22:30', options]
      ]);
    });

    // A recurring weekday (no time anchor) uses `по` + locative plural in
    // full; under short the name is abbreviated and the case marking drops
    // (abbreviations are case-invariant stems). The `7`-for-Sunday alias
    // resolves to Sunday.
    describe('щотижнева повторюваність скорочується без відмінкового закінчення',
      function() {
        run([
          ['*/5 * * * 1', 'кожні 5 хвилин по Пн', options],
          ['*/5 * * * 1,3', 'кожні 5 хвилин по Пн і Ср', options],
          ['*/5 * * * 7', 'кожні 5 хвилин по Нд', options]
        ]);
      });
  });

  // from test/lang/en/options/years.js
  describe('Опція years:', function() {
    const options = {years: true};

    run([
      ['0 0 12 1 1 * 2030', '1 січня 2030 року о 12:00 дня', options],
      ['0 12 1 1 * 2030', '1 січня 2030 року о 12:00 дня', options],
      ['0 0 12 25 12 * 2030', '25 грудня 2030 року о 12:00 дня', options],
      ['0 0 1 6 * 2030', '1 червня 2030 року опівночі', options],
      ['0 13 * * FRI 2030', 'по п\'ятницях о 13:00 у 2030 році', options],
      ['0 9 * * * 2030', 'щодня о 9:00 у 2030 році', options],
      ['*/5 * * * * 2030', 'кожні 5 хвилин у 2030 році', options],
      [
        '0 0 12 25 12 * 2030-2035',
        '25 грудня о 12:00 дня з 2030 до 2035 року включно',
        options
      ],
      [
        '0 0 12 1 1 * 2030,2031,2032',
        '1 січня о 12:00 дня у 2030, 2031 і 2032 роках',
        options
      ]
    ]);

    // The single-year fold belongs to the LEADING date phrase (`1 січня
    // 2030 року о 12:00 дня`). A description whose date rides elsewhere —
    // a trailing qualifier under a confinement frame, a day-union
    // condition — trails the year as ` у 2030 році` like every other year
    // form; it is never spliced mid-sentence and never dropped.
    describe('фолд року — точно провідна дата', function() {
      run([
        ['* 0 9 13 * * 2030',
          'щосекунди 0-ї хвилини о 9:00 тринадцятого числа у 2030 році',
          options],
        ['*/15 30 9 15W * * 2030',
          'кожні 15 секунд 30-ї хвилини о 9:00 у найближчий робочий ' +
          'день до п\'ятнадцятого числа у 2030 році', options],
        ['0 0 13 6 5 2030',
          'у червні, опівночі, щоразу, коли настає тринадцяте число ' +
          'місяця або п\'ятниця, у 2030 році', options]
      ]);
    });

    describe('кроки років', function() {
      run([
        [
          '0 0 12 1 1 * */2',
          '1 січня о 12:00 дня, кожні 2 роки',
          options
        ],
        [
          '0 0 12 1 1 * */5',
          '1 січня о 12:00 дня, кожні 5 років',
          options
        ],
        [
          '0 0 12 1 1 * */1',
          '1 січня о 12:00 дня, щороку',
          options
        ],
        [
          '0 0 12 1 1 * 2030/2',
          '1 січня о 12:00 дня, кожні 2 роки починаючи з 2030 року',
          options
        ],
        ['0 13 * * FRI */2', 'по п\'ятницях о 13:00, кожні 2 роки', options],
        ['0 9 * * * */10', 'щодня о 9:00, кожні 10 років', options],
        ['*/5 * * * * */3', 'кожні 5 хвилин, кожні 3 роки', options]
      ]);
    });
  });
});
