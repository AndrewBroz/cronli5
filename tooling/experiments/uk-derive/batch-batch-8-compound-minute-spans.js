import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import uk from '../../../src/lang/uk/index.js';

const {expect} = chai;

// CANDIDATE corpus batch — batch-8-compound-minute-spans. Translated from the
// donor `en` fixtures (never generated from the uk renderer itself, per
// CLAUDE.md's corpus-is-the-contract rule): every English row was re-derived
// in Ukrainian against src/lang/uk/notes.md (Stage 1, RATIFIED), not carried
// over as a structural copy. This file is a pipeline draft under
// tooling/experiments/ — it becomes test/lang/uk/corpus.js only after human
// review (see tooling/docs/language-pipeline.md).
//
// Donor files translated: test/lang/en/complex/compound/
//   minute-range-across-hours.js, minute-span-across-hour-range.js,
//   minute-span-across-hour-step.js, minute-span-in-hour.js,
//   minute-step-across-hours.js, minute-step-specific-hour.js,
//   minute-wildcard-across-hours.js, mixed-lists.js, qualifier-retention.js
//
// Conventions pinned from notes.md (differ from the en donor — do not let
// the translation silently inherit en's forms):
//   - clock: digital colon, unpadded hour, on-the-hour keeps ":00"
//     (о 9:30, о 14:00) — no a.m./p.m., ampm option is a no-op for uk, so
//     every donor "24-hour option" sub-block is SKIPPED (see report).
//   - опівночі (exact midnight) vs the numeric о 12:00 дня (exact noon) —
//     ratified asymmetric pair; south/"південь" is a false-friend trap,
//     never used.
//   - range connective: "з … до … включно" whenever the closing boundary is
//     a real fire (range-boundary trap); a continuous wildcard-across-hours
//     window that stops short of its stated round-hour end (en's "until")
//     is mirrored as a bare "з … до …" with NO "включно" tag, since that
//     endpoint never actually fires.
//   - trailing/marked recurring weekday: "по" + locative plural
//     (по понеділках); a weekday RANGE stays genitive-genitive
//     (з понеділка до п'ятниці включно) regardless of position; a fronted
//     "every Monday" reading uses "кожного понеділка" (leading, singular).
//   - bare day-of-month keeps the fully spelled genitive ordinal
//     (першого, п'ятнадцятого числа); a day paired with a month is the
//     forced digit + genitive month (1 січня); the DOM∨DOW union frame's
//     own ratified worked example uses a digit + neuter ordinal suffix
//     instead ("13-те число місяця") — a distinct nominal-subject role,
//     mirrored literally here as "1-ше число місяця".
//   - numeral register: digits everywhere for cadence counts and list/
//     position values (кожні 15 хвилин, о 5-й та 10-й хвилині) — never
//     spelled, unlike en's small-cadence-count spelling.
//   - confinement is genitive with no extra word (щохвилини кожної години),
//     never a second juxtaposed nominative cadence.
//   - the union frame is the event-framed clause ratified in §7
//     (щоразу, коли настає … або …), with any shared qualifier (a month
//     spanning both arms) fronted once before it.
//
// Design choices made for constructions notes.md doesn't spell out
// verbatim (kept internally consistent across this whole batch):
//   - "та" joins a NUMERAL/clock list (о 5-й та 10-й хвилині, годин 9:00
//     та 17:00); "і"/"й" (euphony) joins a WORD list (weekdays, months,
//     spelled ordinals); different fields are comma-juxtaposed, never
//     joined by і/та.
//   - a discrete single minute/second value confined to a generic hour
//     mirrors the donor's own separate ", every hour" clause with the
//     щогодини/щохвилини N=1 adverb; a minute/second RANGE or LIST under
//     a generic (unrestricted) hour instead takes the "кожної години" /
//     "кожної хвилини" genitive confinement tail, matching donor's
//     "past the hour" filler.
//   - a specific single hour genitivizes as "<N>-ї години" (9-ї, 17-ї);
//     the midnight hour is "опівнічної години" (a distinct adjective from
//     the опівночі adverb); the noon hour keeps §1's numeric fallback,
//     "12-ї години дня".
//   - an "during the <hours>" confinement (hour LIST under a continuous
//     minute cadence) renders as "протягом годин <clock1> та <clock2>";
//     the same hour list under a discrete minute LIST instead stays a
//     flat "о <clock1> та <clock2>" clock-time list (matching the donor's
//     own split between "during the … hours" and a bare "at" list).

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

describe('Українська (uk) — batch-8-compound-minute-spans:', function() {
  // donor: minute-range-across-hours.js
  // A minute range confined by a discrete hour list — the hour list reads
  // as a "протягом годин …" confinement, never a discrete clock-time list.
  describe('Хвилинний діапазон під списком годин', function() {
    describe('базові', function() {
      run([
        ['0-30 9,17 * * *',
          'щохвилини з 0 до 30 хвилини протягом годин 9:00 та 17:00'],
        ['0-15 0,12 * * *',
          'щохвилини з 0 до 15 хвилини протягом годин опівночі та 12:00 дня']
      ]);
    });

    describe('з денним кваліфікатором', function() {
      run([
        ['0-30 9,17 * * MON',
          'щохвилини з 0 до 30 хвилини протягом годин 9:00 та 17:00 ' +
          'по понеділках']
      ]);
    });

    // Donor's "24-hour option" block ({ampm: false}) is SKIPPED — uk has
    // no a.m./p.m. register to toggle away from (notes.md §1: the digital
    // 24-hour clock is the only uk clock form), so the option is a no-op
    // and the row would be byte-identical to the basic-block row above it.
  });

  // donor: minute-span-across-hour-range.js
  describe('Хвилинний проміжок під діапазоном годин', function() {
    describe('хвилина-вайлдкард', function() {
      run([
        ['* 9-17 * * *', 'щохвилини з 9:00 до 18:00'],
        ['* 0-5 * * *', 'щохвилини з опівночі до 6:00']
      ]);
    });

    describe('діапазон хвилин', function() {
      run([
        ['0-30 9-17 * * *',
          'щохвилини з 0 до 30 хвилини, з 9:00 до 17:00 включно']
      ]);
    });

    describe('з денним кваліфікатором', function() {
      run([
        ['* 9-17 * * MON', 'щохвилини з 9:00 до 18:00 по понеділках'],
        ['0-30 9-17 * * MON-FRI',
          'щохвилини з 0 до 30 хвилини, з 9:00 до 17:00 включно, ' +
          'з понеділка до п\'ятниці включно']
      ]);
    });

    // 24-hour option block SKIPPED — same reason as above.
  });

  // donor: minute-span-across-hour-step.js
  describe('Хвилинний проміжок під кроком годин', function() {
    describe('діапазон хвилин', function() {
      run([
        ['0-30 */2 * * *',
          'щохвилини з 0 до 30 хвилини, кожні 2 години'],
        ['0-30 9-17/2 * * *',
          'щохвилини з 0 до 30 хвилини, ' +
          'кожні 2 години з 9:00 до 17:00 включно']
      ]);
    });

    describe('список хвилин (зберігає каденцію)', function() {
      run([
        ['5,30 1/2 * * *',
          'о 5-й та 30-й хвилині, кожні 2 години починаючи з 1:00'],
        ['3/2 1/2 * * *',
          'кожні 2 хвилини з 3 до 59 хвилини включно, ' +
          'кожні 2 години починаючи з 1:00'],
        ['5,30 */2 * * *', 'о 5-й та 30-й хвилині, кожні 2 години'],
        ['3/2 9-17/2 * * *',
          'кожні 2 хвилини з 3 до 59 хвилини включно, ' +
          'кожні 2 години з 9:00 до 17:00 включно'],
        ['2/7 9-17/2 * * *',
          'кожні 7 хвилин з 2 до 58 хвилини включно, ' +
          'кожні 2 години з 9:00 до 17:00 включно'],
        ['5,30 9-17/2 * * *',
          'о 5-й та 30-й хвилині, кожні 2 години з 9:00 до 17:00 включно']
      ]);
    });

    describe('хвилина-вайлдкард (обмежена активними годинами)', function() {
      run([
        ['* */2 * * *', 'щохвилини кожної другої години'],
        ['* */3 * * *', 'щохвилини кожної третьої години'],
        ['* 1/2 * * *',
          'щохвилини кожної другої години, починаючи з 1:00'],
        ['* */10 * * *',
          'щохвилини, кожні 10 годин з опівночі до 20:00 включно']
      ]);
    });

    describe('з денним кваліфікатором', function() {
      run([
        ['0-30 */2 * * MON',
          'щохвилини з 0 до 30 хвилини, кожні 2 години по понеділках']
      ]);
    });
  });

  // donor: minute-span-in-hour.js
  describe('Хвилинний проміжок у межах конкретної години', function() {
    describe('хвилина-вайлдкард читається як сама година', function() {
      run([
        ['* 9 * * *', 'щохвилини 9-ї години'],
        ['* 0 * * *', 'щохвилини опівнічної години'],
        ['* 12 * * *', 'щохвилини 12-ї години дня'],
        ['* 17 * * *', 'щохвилини 17-ї години']
      ]);
    });

    describe('діапазон хвилин зберігає вікно', function() {
      run([
        ['0-29 9 * * *', 'щохвилини з 9:00 до 9:29 включно'],
        ['0-30 17 * * *', 'щохвилини з 17:00 до 17:30 включно']
      ]);
    });

    describe('крок "кожна друга хвилина" в межах однієї години', function() {
      run([
        ['0 */2 0 * * *', 'кожні 2 хвилини з опівночі до 1:00'],
        ['0 */2 9 * * *', 'кожні 2 хвилини з 9:00 до 10:00']
      ]);
    });

    describe('з денним кваліфікатором', function() {
      run([
        ['* 9 * * MON', 'щохвилини 9-ї години по понеділках']
      ]);
    });

    // 24-hour option block SKIPPED — same reason as above.
  });

  // donor: minute-step-across-hours.js
  describe('Крок хвилин під кількома годинами', function() {
    describe('список годин', function() {
      run([
        ['*/15 9,17 * * *',
          'кожні 15 хвилин протягом годин 9:00 та 17:00'],
        ['*/30 0,12 * * *',
          'кожні 30 хвилин протягом годин опівночі та 12:00 дня']
      ]);
    });

    describe('чистий крок годин (обмежений кожною N-ю годиною)', function() {
      run([
        ['*/15 */2 * * *', 'кожні 15 хвилин кожної другої години'],
        ['*/15 */3 * * *', 'кожні 15 хвилин кожної третьої години'],
        ['*/15 */4 * * *', 'кожні 15 хвилин кожної четвертої години']
      ]);
    });

    describe('зсунутий чистий крок (обмежений, з точкою відліку)', function() {
      run([
        ['*/15 1/2 * * *',
          'кожні 15 хвилин кожної другої години, починаючи з 1:00'],
        ['*/15 1/3 * * *',
          'кожні 15 хвилин кожної третьої години, починаючи з 1:00'],
        ['*/15 2/4 * * *',
          'кожні 15 хвилин кожної четвертої години, починаючи з 2:00']
      ]);
    });

    describe('нерівний крок годин (обмежена каденція)', function() {
      run([
        ['*/15 */10 * * *',
          'кожні 15 хвилин, кожні 10 годин з опівночі до 20:00 включно']
      ]);
    });

    describe('обмежений крок годин (обмежена каденція)', function() {
      run([
        ['*/20 9-17/2 * * *',
          'кожні 20 хвилин, кожні 2 години з 9:00 до 17:00 включно']
      ]);
    });

    describe('з денним кваліфікатором', function() {
      run([
        ['*/15 9,17 * * MON-FRI',
          'кожні 15 хвилин протягом годин 9:00 та 17:00 ' +
          'з понеділка до п\'ятниці включно']
      ]);
    });

    // 24-hour option block SKIPPED — same reason as above.
  });

  // donor: minute-step-specific-hour.js
  describe('Крок хвилин у межах конкретної години', function() {
    describe('базові', function() {
      run([
        ['*/15 9 * * *', 'кожні 15 хвилин з 9:00 до 9:45 включно'],
        ['*/30 9 * * *', 'кожні 30 хвилин з 9:00 до 9:30 включно'],
        ['*/15 0 * * *', 'кожні 15 хвилин з опівночі до 0:45 включно']
      ]);
    });

    describe('з денним кваліфікатором', function() {
      run([
        ['*/15 9 * * MON',
          'кожні 15 хвилин з 9:00 до 9:45 включно по понеділках']
      ]);
    });

    // 24-hour option block SKIPPED — same reason as above.
  });

  // donor: minute-wildcard-across-hours.js
  describe('Хвилина-вайлдкард під списком годин', function() {
    describe('базові', function() {
      run([
        ['* 9,17 * * *', 'щохвилини протягом годин 9:00 та 17:00'],
        ['* 0,12 * * *', 'щохвилини протягом годин опівночі та 12:00 дня']
      ]);
    });

    describe('з денним кваліфікатором', function() {
      run([
        ['* 9,17 * * MON',
          'щохвилини протягом годин 9:00 та 17:00 по понеділках']
      ]);
    });

    // 24-hour option block SKIPPED — same reason as above.
  });

  // donor: mixed-lists.js
  describe('Списки, що змішують значення з діапазонами чи кроками', function() {
    describe('список хвилин, що містить діапазон', function() {
      run([
        ['5-10,20 * * * *',
          'з 5 до 10 хвилини включно та о 20-й хвилині кожної години'],
        ['0-30,45 9 * * *',
          'з 0 до 30 хвилини включно та о 45-й хвилині, о 9:00'],
        ['5-10,20 9,17 * * *',
          'з 5 до 10 хвилини включно та о 20-й хвилині, о 9:00 та 17:00'],
        ['0-10,30 9-17 * * *',
          'з 0 до 10 хвилини включно та о 30-й хвилині, ' +
          'з 9:00 до 17:00 включно']
      ]);
    });

    describe('список секунд, що містить діапазон', function() {
      run([
        ['0-30,45 * * * * *',
          'з 0 до 30 секунди включно та о 45-й секунді кожної хвилини'],
        ['5-10,20 30 * * * *',
          'з 5 до 10 секунди включно та о 20-й секунді, ' +
          'протягом 30-ї хвилини кожної години']
      ]);
    });

    describe('список годин, що містить діапазон чи крок', function() {
      run([
        ['0 9,17-19 * * *',
          'щодня о 9:00, 17:00, 18:00 та 19:00'],
        ['0 9,17/2 * * *',
          'щодня о 9:00, 17:00, 19:00, 21:00 та 23:00'],
        ['0-30 9,17-19 * * *',
          'щохвилини з 0 до 30 хвилини протягом годин ' +
          '9:00, 17:00, 18:00 та 19:00'],
        ['*/15 9,17/2 * * *',
          'кожні 15 хвилин протягом годин ' +
          '9:00, 17:00, 19:00, 21:00 та 23:00']
      ]);
    });

    describe('обмежений крок годин під кроком хвилин', function() {
      run([
        ['*/15 9-17/2 * * *',
          'кожні 15 хвилин, кожні 2 години з 9:00 до 17:00 включно']
      ]);
    });

    describe('списки на рівні дня, що містять діапазон чи крок', function() {
      run([
        ['0 0 1-5,15 * *',
          'з першого до п\'ятого включно і п\'ятнадцятого числа, опівночі'],
        ['0 0 * 1-3,6 *',
          'щодня з січня до березня включно й у червні, опівночі'],
        ['0 0 * 1,6/3 *',
          'щодня у січні, червні, вересні й грудні, опівночі'],
        ['0 0 * * 1-5,0',
          'з понеділка до п\'ятниці включно й у неділю, опівночі']
      ]);
    });

    describe('список хвилин чи секунд, що містить крок', function() {
      run([
        ['5,30-40/5 * * * *',
          'о 5-й, 30-й, 35-й та 40-й хвилині кожної години'],
        ['0,10-58/12 * * * *',
          'о 0, 10-й, 22-й, 34-й, 46-й та 58-й хвилині кожної години'],
        ['5,30-40/5 * * * * *',
          'о 5-й, 30-й, 35-й та 40-й секунді кожної хвилини']
      ]);
    });

    describe('конкретні дати під не-єдиним місяцем', function() {
      run([
        ['0 0 1 6-9 *',
          'першого числа, з червня до вересня включно, опівночі'],
        ['0 0 1,15 6-9 *',
          'першого і п\'ятнадцятого числа, з червня до вересня включно, ' +
          'опівночі'],
        ['0 0 1-15 6-9 *',
          'з першого до п\'ятнадцятого числа включно, ' +
          'з червня до вересня включно, опівночі'],
        ['0 0 1 1,3-6 *',
          'першого числа, у січні й з березня до червня включно, опівночі'],
        ['0 0 1 1-11/3 *',
          '1 січня, 1 квітня, 1 липня й 1 жовтня, опівночі'],
        ['0 0 1 6-9 FRI',
          'з червня до вересня включно, опівночі, щоразу коли настає ' +
          '1-ше число місяця або п\'ятниця']
      ]);
    });
  });

  // donor: qualifier-retention.js
  describe('Денні кваліфікатори на хвилинних і секундних якорях', function() {
    describe('хвилинні якорі', function() {
      run([
        ['0 30 * * * MON', 'о 30-й хвилині щогодини по понеділках'],
        ['0-30 * * * MON',
          'щохвилини з 0 до 30 хвилини кожної години по понеділках'],
        ['0,30 * * * MON',
          'о 0 та 30-й хвилині кожної години по понеділках']
      ]);
    });

    describe('секундні якорі', function() {
      run([
        ['15 * * * * MON', 'о 15-й секунді щохвилини по понеділках'],
        ['*/15 * * * * MON', 'кожні 15 секунд по понеділках'],
        ['0-30 * * * * MON',
          'щосекунди з 0 до 30 секунди кожної хвилини по понеділках'],
        ['5,10 * * * * MON',
          'о 5-й та 10-й секунді кожної хвилини по понеділках']
      ]);
    });

    describe('день тижня разом із місяцем', function() {
      run([
        ['0 0 * 6 MON', 'кожного понеділка у червні опівночі'],
        ['*/15 * * 6 MON', 'кожні 15 хвилин по понеділках у червні']
      ]);
    });

    describe('секунди в межах хвилини', function() {
      run([
        ['15 30 * * * MON',
          'о 15-й секунді 30-ї хвилини щогодини по понеділках'],
        ['5,10 30 * * * MON',
          'о 5-й та 10-й секунді 30-ї хвилини щогодини по понеділках']
      ]);
    });
  });
});
