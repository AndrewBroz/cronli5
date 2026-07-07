import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import uk from '../../../src/lang/uk/index.js';

const {expect} = chai;

// CANDIDATE corpus draft (Stage 2 of the pipeline) — translated from the en
// donor rows in test/lang/en/complex/{normalization,overlapping-segments,
// wrap-around,seven-field}.js ("batch-4-structural-core"). NOT yet the
// shipped test/lang/uk/corpus.js oracle: it becomes that only after human
// review (CLAUDE.md "The corpus is the contract"). Meaning is inherited
// verbatim from the (already-validated) donor; only the wording is authored
// fresh against src/lang/uk/notes.md's RATIFIED conventions. Every
// convention that ratified AWAY from the donor's en form is pinned here so
// this translation doesn't silently inherit en's shape:
//
//  - Clock: digital colon, unpadded hour, minutes always kept on the hour
//    ("о 9:00", never "о 9"); no am/pm split at all (notes.md §1).
//  - Exact midnight/noon: asymmetric — "опівночі" for the adverbial exact
//    00:00 anchor, but numeric "о 12:00 дня" for exact noon (§1). This is
//    NOT used when midnight/noon appears merely as one point inside an
//    enumerated clock-time list (mirroring en's own choice there of "12
//    a.m."/"12 p.m." over the special words "midnight"/"noon" — e.g. the
//    22-2,12 hour list below reads "о 0:00", not "опівночі").
//  - Bare day-of-month (no month attached): fully spelled genitive ordinal
//    word ("першого", "п'ятнадцятого"), never digit+hyphen (§2) — this is
//    forced EVEN INSIDE a "з … до … включно" range, where §3's own
//    illustrative example happens to show the digit form; §2's explicit
//    ratified decision + explicit rejection of digit+hyphen governs here.
//  - Day attached to a month: digit + genitive month, forced by declension,
//    no exceptions ("1 січня", never a spelled ordinal) (§2, §5).
//  - Every range (clock, weekday, date, minute/second-of-hour position,
//    year): "з … до … включно" when the closing boundary counts as a fire
//    (§3). When en's own boundary is EXCLUSIVE ("until", the
//    continuous-timeline wrap-through-zero case), the включно tag is
//    dropped so absence-of-tag reads exclusive by construction.
//  - Weekday RANGE: genitive both ends ("з понеділка до п'ятниці включно",
//    §3/§5). Weekday LIST (individual days, incl. one arm of a mixed
//    range+single list) or a solo recurring weekday: "по" + locative
//    plural, the one ratified marked/trailing device ("по понеділках і
//    п'ятницях", "по неділях" — §4). A DOM-or-month attached to a single
//    dated weekday would be accusative "у понеділок" (§5) — not exercised
//    in this batch (no single-occurrence weekday row here).
//  - Bare month LIST: locative preposition repeated per item ("у березні і
//    вересні", §5).
//  - Numeral register: digits everywhere (cadence counts AND list/range
//    positions), never en's spelled small numbers ("5 хвилин", "30
//    секунд", never "п'ять хвилин") — except §2's bare-DOM rule above,
//    which is a separate syntactic role decided independently (§8).
//  - Numeral agreement (paucal/plural classes, §6): 1 = nom. sg.; 2-4 (and
//    N ending 2-4, not 12-14) = gen. sg. ("2 хвилини", "2 роки"); 5-20 and
//    N ending 5-9/0, and 11-14 always = gen. pl. ("15 хвилин", "7 хвилин");
//    N ending 1 (not 11) = nom. sg. ("21 хвилина" — not exercised here).
//    Fixed N=1 adverbs (щохвилини, щогодини, щодня, щороку, щосекунди)
//    bypass the table; N>1 cadence uses кожні+digit+governed noun.
//  - The N=1 step-offset minimal pair keeps the spelled ordinal
//    ("починаючи з першої хвилини", not a digit) per notes.md's own ratified
//    pairs.js form; N>1 offsets use the general digit rule
//    ("починаючи з 2-ї хвилини").
//  - Confinement (§8 confinement-vs-juxtaposition): a coarser field under a
//    finer cadence is genitive-marked subordination, never a second bare
//    adverb ("щосекунди протягом 0-ї хвилини кожної години", not
//    "щосекунди, щохвилини, щогодини").
//  - "і" is the default list/range connective; "та" only where it would
//    otherwise double an "і" in the same clause (§3) — used once below
//    (the 1/4,18-20 hourly-cadence row) to avoid stacking two "і"s.
//  - Digit-ordinal hyphen suffix: locative position always "-й"
//    (о 5-й хвилині) per notes.md's own ratified minimal pair, even though
//    that is a simplification of strict declension; genitive-governed
//    ranges use the distinct, independently-attested "-ї"
//    (з 5-ї до 10-ї хвилини) since notes.md gives no locative-only
//    universal rule for genitive position and "з 9-ї до 18-ї" is the
//    well-attested native form.
//
// Coverage: all 85 donor rows across the four files are transferable and
// translated below — none skipped. Nothing in this batch is
// donor-typography-only (the one options-bearing row, 24-hour `{ampm:
// false}`, is kept for coverage parity even though it is a no-op for uk,
// which is always 24-hour — same treatment fr/pt give their no-op {ampm}).

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

describe('Українська (uk) — структурне ядро (batch 4):', function() {
  describe('Нормалізація вхідних даних:', function() {
    describe('списки сортуються у хронологічному порядку спрацювань', function() {
      run([
        ['0 17,9 * * *', 'щодня о 9:00 і о 17:00'],
        ['45,15,30 * * * *', 'о 15-й, 30-й і 45-й хвилині'],
        ['30-40,10 * * * *',
          'о 10-й хвилині і з 30-ї до 40-ї хвилини включно'],
        ['30,15 * * * * *', 'о 15-й і 30-й секунді'],
        ['0 0 * * FRI,MON', 'по понеділках і п\'ятницях опівночі'],
        ['0 0 * SEP,MAR *', 'щодня у березні і вересні опівночі'],
        ['0 0 15,1 * *', 'першого і п\'ятнадцятого числа опівночі']
      ]);
    });

    describe('однакові сегменти, що повторюються, зливаються в один',
      function() {
        run([
          ['5,5 * * * *', 'о 5-й хвилині, щогодини'],
          ['0 9,9,17 * * *', 'щодня о 9:00 і о 17:00']
        ]);
      });

    describe('крокова гілка в списку читається як власні спрацювання, ' +
      'відсортовані', function() {
      run([
        ['0 7,*/30 * * * *', 'о 0-й, 7-й і 30-й хвилині']
      ]);
    });

    describe('вироджені діапазони читаються як одне значення', function() {
      run([
        ['0 9-9 * * *', 'щодня о 9:00'],
        ['30-30 9 * * *', 'щодня о 9:30']
      ]);
    });

    describe('крок з інтервалом 1 читається як свій діапазон', function() {
      run([
        ['1/1 * * * *', 'щохвилини з 1-ї до 59-ї хвилини включно'],
        ['1/1 * * * * *', 'щосекунди з 1-ї до 59-ї секунди включно'],
        ['0/1 * * * *', 'щохвилини'],
        ['*/1 * * * *', 'щохвилини'],
        ['5-30/1 * * * *', 'щохвилини з 5-ї до 30-ї хвилини включно'],
        ['0 1/1 * * *', 'щогодини з 1:00 до 23:00 включно'],
        ['0 0 2/1 * *', 'з другого до тридцять першого числа включно опівночі'],
        ['0 0 * 3/1 *', 'щодня з березня до грудня включно опівночі'],
        ['0 0 * * 1/1', 'з понеділка до суботи включно опівночі']
      ]);
    });

    describe('крок зі зсувом граматично узгоджує свій початок', function() {
      run([
        ['1/3 * * * *', 'кожні 3 хвилини, починаючи з першої хвилини'],
        ['2/3 * * * *', 'кожні 3 хвилини, починаючи з 2-ї хвилини']
      ]);
    });

    describe('діапазон на все поле читається як зірочка', function() {
      run([
        ['0-59 * * * *', 'щохвилини'],
        ['0 0-23 * * *', 'щогодини'],
        ['0 0 1-31 * *', 'щодня опівночі'],
        ['0 0 * 1-12 *', 'щодня опівночі'],
        ['0 0 * * 0-6', 'щодня опівночі'],
        ['0 0 * * 1-7', 'щодня опівночі'],
        ['0 0 * * 0-7', 'щодня опівночі'],
        ['0 0 * * SUN-SAT', 'щодня опівночі'],
        ['0-59 * * * * *', 'щосекунди'],
        ['0-59/2 * * * *', 'кожні 2 хвилини'],
        ['0 0-23/2 * * *', 'кожні 2 години'],
        ['0-59/7 * * * *', 'кожні 7 хвилин, з 0-ї до 56-ї хвилини включно'],
        ['0 9-17/2 * * *', 'кожні 2 години з 9:00 до 17:00 включно']
      ]);
    });

    describe('крок, що спрацьовує один раз, читається як власне єдине ' +
      'значення', function() {
      run([
        ['*/15 1/24 * * *', 'кожні 15 хвилин з 1:00 до 1:45 включно'],
        ['* */24 * * *', 'щохвилини опівнічної години'],
        ['0 */24 * * *', 'щодня опівночі'],
        ['0 1/24 * * *', 'щодня о 1:00'],
        ['*/60 * * * *', 'щогодини'],
        ['0 0 1/31 * *', 'першого числа опівночі'],
        ['0 0 1 1/12 *', '1 січня опівночі'],
        ['0 0 * * */7', 'по неділях опівночі']
      ]);
    });
  });

  describe('Об\'єднання перетинних сегментів списку в їхню унію:', function() {
    describe('однакове значення, покрите двома гілками, губить дублікат',
      function() {
        run([
          ['* 2/4,18-20 * * *',
            'щохвилини о 2:00, о 6:00, о 10:00, о 14:00, з 18:00 до 20:00 ' +
            'включно і о 22:00'],
          ['0 12 * * 1-5,3', 'з понеділка до п\'ятниці включно о 12:00 дня'],
          ['0 0 1-10,5 * *', 'з першого до десятого числа включно опівночі'],
          ['0 0 1 1-3,2 *', 'першого з січня до березня включно опівночі'],
          ['5-10,7 * * * *', 'щохвилини з 5-ї до 10-ї хвилини включно'],
          ['5-10,7 * * * * *', 'щосекунди з 5-ї до 10-ї секунди включно']
        ]);
      });

    describe('гілки, що перетинаються, зливаються в один більший блок',
      function() {
        run([
          ['0 12 * * 1/2,2-4', 'з понеділка до п\'ятниці включно о 12:00 дня']
        ]);
      });

    describe('незалежні гілки зберігають власну форму, навіть суміжні',
      function() {
        run([
          ['0 12 * * 1-3,5',
            'з понеділка до середи включно і по п\'ятницях о 12:00 дня'],
          ['0 12 * * 1-3,4',
            'з понеділка до середи включно і по четвергах о 12:00 дня'],
          ['0 9,17-19 * * *',
            'щодня о 9:00, о 17:00, о 18:00 і о 19:00'],
          ['* 1/4,18-20 * * *',
            'щохвилини о 1:00, о 5:00, о 9:00, о 13:00, о 17:00, з 18:00 ' +
            'до 20:00 включно і о 21:00'],
          ['5,30 1/4,18-20 * * *',
            'о 5-й і 30-й хвилині, о 1:00, о 5:00, о 9:00, о 13:00, ' +
            'о 17:00, з 18:00 до 20:00 включно і о 21:00'],
          ['0 0 1/4,18-20 * * *',
            'щогодини з 18:00 до 20:00 включно та о 1:00, о 5:00, о 9:00, ' +
            'о 13:00, о 17:00 і о 21:00']
        ]);
      });
  });

  describe('Діапазони, що огортають цикл:', function() {
    describe('години огортають північ', function() {
      run([
        ['0 22-2 * * *', 'щогодини з 22:00 до 2:00 включно'],
        // Exclusive continuous window (en's own "until", not "through"):
        // no "включно" — absence of the tag reads exclusive by
        // construction (notes.md §3).
        ['* 22-2 * * *', 'щохвилини з 22:00 до 3:00'],
        ['*/15 22-2 * * *', 'кожні 15 хвилин з 22:00 до 2:00 включно'],
        ['0-30 22-2 * * *',
          'щохвилини з 0-ї до 30-ї хвилини включно, з 22:00 до 2:00 включно']
      ]);
    });

    describe('хвилини й секунди огортають у межах свого циклу', function() {
      run([
        ['30-10 * * * *', 'щохвилини з 30-ї до 10-ї хвилини включно'],
        ['50-10 9 * * *',
          'щохвилини з 50-ї до 10-ї хвилини включно, о 9:00'],
        ['50-10 * * * * *', 'щосекунди з 50-ї до 10-ї секунди включно']
      ]);
    });

    describe('поля рівня доби огортають', function() {
      run([
        ['0 0 20-5 * *',
          'з двадцятого до п\'ятого числа включно опівночі'],
        ['0 0 * * FRI-MON', 'з п\'ятниці до понеділка включно опівночі'],
        ['0 12 * 11-2 *',
          'щодня з листопада до лютого включно о 12:00 дня'],
        ['0 0 1 DEC-JAN *', 'першого з грудня до січня включно опівночі']
      ]);
    });

    describe('список годин, що містить діапазон, який огортає', function() {
      run([
        ['0 22-2,12 * * *',
          'щодня о 12:00, о 22:00, о 23:00, о 0:00, о 1:00 і о 2:00']
      ]);
    });

    describe('опція 24-годинного формату', function() {
      // uk has no am/pm axis at all (always 24-hour, notes.md §1), so
      // {ampm: false} is a documented no-op here — kept only for
      // options-coverage parity with the donor row (same treatment fr/pt
      // give their no-op {ampm}).
      run([
        ['0 17-9 * * *', 'щогодини з 17:00 до 9:00 включно', {ampm: false}]
      ]);
    });
  });

  describe('Семипольові патерни:', function() {
    describe('рядки', function() {
      run([
        ['0 30 9 * * * 2030', 'щодня о 9:30 у 2030 році'],
        ['0 0 12 1 1 * 2030', '1 січня 2030 року о 12:00 дня'],
        ['0 0 12 25 12 * 2030-2035',
          '25 грудня о 12:00 дня, з 2030 до 2035 року включно'],
        ['0 0 12 1 1 * */2', '1 січня о 12:00 дня, кожні 2 роки'],
        ['* * * * * * */2', 'щосекунди, кожні 2 роки'],
        ['*/15 30 9 * * * 2030',
          'кожні 15 секунд протягом 30-ї хвилини о 9:00 у 2030 році'],
        ['0 30 9 * * * *', 'щодня о 9:30']
      ]);
    });

    describe('масиви', function() {
      run([
        [['0', '30', '9', '*', '*', '*', '2030'],
          'щодня о 9:30 у 2030 році']
      ]);
    });

    describe('об\'єкти з роком', function() {
      run([
        [{minute: '30', hour: '9', year: '2030'},
          'щодня о 9:30 у 2030 році'],
        [{minute: '30', hour: '9', year: '*'}, 'щодня о 9:30']
      ]);
    });

    describe('опція years і далі розрізняє шість полів', function() {
      run([
        ['0 9 * * * 2030', 'щодня о 9:00 у 2030 році', {years: true}],
        ['30 9 * * * *', 'о 9-й хвилині і 30-й секунді, щогодини']
      ]);
    });

    // A minute of 0 under a sub-minute second is a real restriction and
    // must be stated: "протягом 0-ї хвилини" (during minute 0), genitive
    // subordination nested under the second-level cadence and again under
    // the hour-level confinement (notes.md §8 confinement-vs-juxtaposition).
    describe('хвилина 0, зазначена під секундним кроком, коротшим за хвилину',
      function() {
        run([
          ['* 0 * * * *', 'щосекунди протягом 0-ї хвилини кожної години'],
          ['* 0 * * * * 2013',
            'щосекунди протягом 0-ї хвилини кожної години у 2013 році'],
          ['* 0 9-17 * * *',
            'щосекунди протягом 0-ї хвилини з 9:00 до 17:00 включно']
        ]);
      });
  });
});
