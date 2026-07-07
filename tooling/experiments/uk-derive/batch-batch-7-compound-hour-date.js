import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import uk from '../../../src/lang/uk/index.js';

const {expect} = chai;

// CANDIDATE corpus batch (Stage 2: corpus translation) — NOT reviewed yet.
// Donor: test/lang/en/complex/compound/{strings,clock-time-cap,
// date-and-weekday,deferral,dense-cadence,hour-range-cadence,
// hour-range-qualifiers,hour-step-cadence}.js. Translated against
// src/lang/uk/notes.md (RATIFIED Stage-1 conventions) and
// .claude/skills/add-language/playbook.json. Meaning is inherited from the
// donor; only wording/case/agreement are authored fresh. This file is a
// working draft under tooling/experiments/ — it becomes part of the shipped
// oracle only after human review per CLAUDE.md's corpus rule.
//
// Conventions pinned from notes.md, applied uniformly below (do NOT let any
// row silently drift back to the donor's en forms):
// - Clock: digital colon, unpadded hour, 24-hour ("о 9:30", "о 14:00");
//   on-the-hour KEEPS ":00". Exact midnight -> "опівночі"; exact noon (hour
//   12, minute 0 precisely) -> "о 12:00 дня". Every other clock value is
//   plain digital, with no "дня"/"ранку" disambiguator (notes §1).
// - Bare day-of-month (no month, OUTSIDE the DOM-or-DOW union frame): the
//   fully spelled genitive ordinal word. "1st" alone -> "першого" (no
//   trailing "числа" — the panel's own quoted single-day example for this
//   value). Every other single value, and every list, takes a trailing
//   "числа" once ("п'ятнадцятого числа", "першого і п'ятнадцятого числа")
//   (notes §2).
// - Date + month -> cardinal digit + genitive month, no ordinal word
//   ("1 січня", "25 грудня", "13 червня") (notes §2, forced by grammar).
// - Range connective, EVERYWHERE (clock/weekday/date) -> "з … до …
//   включно" (notes §3).
// - Standalone month -> locative with у/в ("у червні"). Month LIST -> one
//   "у" governing the whole list, each month declined locative
//   ("у січні, травні й вересні" — the panel's own quoted example) (notes
//   §5).
// - Trailing/marked recurring weekday -> "по" + locative plural
//   ("по понеділках"); a weekday RANGE or a leading form stays the
//   unmarked genitive range ("з понеділка до п'ятниці включно") (notes
//   §4).
// - The DOM-or-DOW union's VALUE-type predicate frame (notes §7, the
//   panel's own worked example for `0 0 13 * FRI`) -> "щоразу, коли
//   настає <X> або <Y>", worked against en's own anchor pattern. Inside
//   THIS frame the day-of-month figure is the abbreviated digit + suffixed
//   nominative/genitive ordinal ("13-те число місяця", "2-го понеділка
//   місяця", "до 15-го") — a distinct register from the plain spelled-word
//   bare-day rule above, matching the panel's own literal worked form. A
//   restricted month fronts once, scoping the whole union (never stranded
//   on one arm).
// - A CADENCE-shaped date arm inside the union (open step, no parity idiom)
//   keeps its cadence phrase and drops the value-predicate frame; "any"
//   carries the union: "<cadence>, починаючи з <start>, або в
//   будь-<weekday>" (notes §7's cadence-arm discussion; "в" after "або"
//   per vowel-final euphony).
// - Day-of-month PARITY idiom (*/2, 1/2 = odd; 2/2 = even) -> "непарний
//   день" / "парний день" (nominative, no "місяця" — mirrors en's own
//   economy).
// - Numeral register -> digits everywhere (cadence counts AND list/position
//   values): "кожні 5 хвилин", "о 5-й та 10-й хвилині" — this does not
//   override the separately-ratified bare-day-of-month spelled-word rule
//   above (notes §8).
// - Numeral agreement (paucal 2–4 vs plural 5–20/0/11–14 vs singular 1, 21,
//   31…) is threaded through every cadence count exactly per notes §6's
//   table (кожні 2 години / кожні 3 години / кожні 6 годин / кожні 5
//   хвилин, etc.).
// - Confinement register: "past the hour/minute" filler that is itself
//   unanchored (no concrete "every hour"/"every minute" cadence backing
//   it) is dropped rather than invented ("о 30-й секунді, о 5-й хвилині,
//   кожні 2 години", not a spurious "кожної хвилини"/"кожної години" that
//   would overclaim a cadence en itself doesn't state there).
//
// No rows were skipped: every donor row in this batch carries transferable
// field-combination meaning (no donor-dialect-typography-only rows in this
// slice).

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

describe('uk candidate corpus — batch-7-compound-hour-date:', function() {
  // donor: strings.js
  describe('compound strings', function() {
    describe('already-supported combinations', function() {
      run([
        ['30 9 * * MON-FRI', 'з понеділка до п\'ятниці включно о 9:30'],
        ['0 22 * * 1-5', 'з понеділка до п\'ятниці включно о 22:00'],
        ['0 0 25 12 *', '25 грудня опівночі']
      ]);
    });

    describe('specific date without month', function() {
      run([
        ['15 14 1 * *', 'першого о 14:15'],
        ['0 0 15 * *', 'п\'ятнадцятого числа опівночі']
      ]);
    });

    describe('minute list/range with specific hours', function() {
      run([
        ['0,30 9 * * *', 'щодня о 9:00 і 9:30'],
        ['0,30 9 * * MON-FRI',
          'з понеділка до п\'ятниці включно о 9:00 і 9:30'],
        ['0,30 9,17 * * *', 'щодня о 9:00, 9:30, 17:00 і 17:30']
      ]);
    });

    describe('frequency within an hour range', function() {
      run([
        ['*/15 9-17 * * *', 'кожні 15 хвилин з 9:00 до 17:00 включно'],
        ['*/15 9-17 * * MON-FRI',
          'кожні 15 хвилин з 9:00 до 17:00 включно, ' +
          'з понеділка до п\'ятниці включно']
      ]);
    });

    describe('specific minute(s) within an hour range', function() {
      run([
        ['0 9-17 * * *', 'щогодини з 9:00 до 17:00 включно'],
        ['5 9-17 * * *', 'о 5-й хвилині щогодини з 9:00 до 17:00 включно'],
        ['5 9-17 * 1 *',
          'о 5-й хвилині щогодини з 9:00 до 17:00 включно у січні'],
        ['30 9-17 * * *', 'о 30-й хвилині щогодини з 9:00 до 17:00 включно'],
        ['0,30 9-17 * * *',
          'о 0 і 30 хвилинах щогодини з 9:00 до 17:00 включно'],
        ['15 9-17 * * MON-FRI',
          'о 15-й хвилині щогодини з 9:00 до 17:00 включно, ' +
          'з понеділка до п\'ятниці включно']
      ]);
    });

    describe('date and month together', function() {
      run([
        ['0 12 1 1 *', '1 січня о 12:00 дня'],
        ['0 12 25 12 *', '25 грудня о 12:00 дня']
      ]);
    });

    describe('frequency with a day qualifier', function() {
      run([
        ['* * * * MON', 'щохвилини по понеділках'],
        ['0 * * * MON', 'щогодини по понеділках'],
        ['* * * * MON-FRI', 'щохвилини з понеділка до п\'ятниці включно'],
        ['* * 13 * *', 'щохвилини тринадцятого числа'],
        ['0 * 13 * *', 'щогодини тринадцятого числа'],
        ['0 * * 1 *', 'щогодини у січні'],
        ['0 * 13 1 *', 'щогодини 13 січня'],
        ['0 * 1,15 * *', 'щогодини першого і п\'ятнадцятого числа']
      ]);
    });
  });

  // donor: clock-time-cap.js
  describe('clock-time enumeration cap', function() {
    describe('at or under the cap, times enumerate', function() {
      run([
        ['0,30 9,17 * * *', 'щодня о 9:00, 9:30, 17:00 і 17:30'],
        ['0,30 8-18/4 * * *',
          'щодня о 8:00, 8:30, 12:00, 12:30, 16:00 і 16:30']
      ]);
    });

    describe('a single minute folds into segment windows', function() {
      run([
        ['0 9-20,22 * * *',
          'щогодини з 9:00 до 20:00 включно та о 22:00'],
        ['30 9-20,22 * * *',
          'о 30-й хвилині щогодини з 9:00 до 20:00 включно та о 22:30'],
        ['30 12,20-2 * * *',
          'о 30-й хвилині щогодини з 20:00 до 2:00 включно та о 12:30']
      ]);
    });

    describe('a minute list leads with its own clause', function() {
      run([
        ['0,30 8-18/2 * * *',
          'о 0 і 30 хвилинах, кожні 2 години з 8:00 до 18:00 включно'],
        ['0,15,30,45 9,17 * * MON',
          'о 0, 15, 30 і 45 хвилинах, о 9:00 і 17:00, по понеділках']
      ]);
    });

    describe('a folded second survives compaction', function() {
      run([
        ['15 30 9-20,22 * * *',
          'щодня з 9:30:15 до 20:30:15 включно та о 22:30:15'],
        ['15 0,30 8,10,12,14 * * *',
          'о 15-й секунді, о 0 і 30 хвилинах, о 8:00, 10:00, 12:00 і 14:00']
      ]);
    });

    describe('long hour-window phrases compact too', function() {
      run([
        ['*/15 9-20,22 * * *',
          'кожні 15 хвилин протягом годин з 9:00 до 20:00 включно і 22:00'],
        ['0-30 9-20,22 * * *',
          'щохвилини з 0-ї до 30-ї хвилини включно протягом годин ' +
          'з 9:00 до 20:00 включно і 22:00']
      ]);
    });
  });

  // donor: date-and-weekday.js — the DOM-or-DOW union. Inside this
  // describe block the day-of-month figure uses the abbreviated
  // digit+suffix register (notes §7's own worked form), NOT the spelled
  // bare-day word used everywhere else in this batch.
  describe('day-of-month or day-of-week (both restricted)', function() {
    describe('time-anchored', function() {
      run([
        ['0 0 13 * 5',
          'опівночі щоразу, коли настає 13-те число місяця або п\'ятниця'],
        ['0 0 13 * FRI',
          'опівночі щоразу, коли настає 13-те число місяця або п\'ятниця'],
        ['0 0 13 * MON-FRI',
          'опівночі щоразу, коли настає 13-те число місяця або будній день'],
        ['0 0 1,15 * 5',
          'опівночі щоразу, коли настає 1-ше, 15-те число місяця ' +
          'або п\'ятниця'],
        ['0 0 13 6 5',
          'у червні, опівночі щоразу, коли настає 13-те число місяця ' +
          'або п\'ятниця']
      ]);
    });

    describe('bare frequency', function() {
      run([
        ['* * 13 * 5',
          'щохвилини щоразу, коли настає 13-те число місяця або п\'ятниця'],
        ['0 * 13 * 5',
          'щогодини щоразу, коли настає 13-те число місяця або п\'ятниця']
      ]);
    });

    describe('month scopes the whole union', function() {
      run([
        ['0 0 15W 6 MON#2',
          'у червні, опівночі щоразу, коли настає будній день, ' +
          'найближчий до 15-го, або 2-го понеділка місяця'],
        ['*/45 9-17/2 15W 6-8 MON#2',
          'з червня до серпня включно, о 0 і 45 хвилинах, кожні 2 години ' +
          'з 9:00 до 17:00 включно, щоразу, коли настає будній день, ' +
          'найближчий до 15-го, або 2-го понеділка місяця'],
        ['0 0 L 6 5',
          'у червні, опівночі щоразу, коли настає останній день місяця ' +
          'або п\'ятниця'],
        ['0 0 1/2 6 5',
          'у червні, опівночі щоразу, коли настає непарний день ' +
          'або п\'ятниця'],
        ['0 0 13 6-8 5',
          'з червня до серпня включно, опівночі щоразу, коли настає ' +
          '13-те число місяця або п\'ятниця'],
        ['0 0 13 */2 5',
          'у кожному непарному місяці, опівночі щоразу, коли настає ' +
          '13-те число місяця або п\'ятниця']
      ]);
    });

    describe('day-of-month parity in a union', function() {
      run([
        ['0 0 */2 * 5',
          'опівночі щоразу, коли настає непарний день або п\'ятниця'],
        ['0 0 1/2 * 5',
          'опівночі щоразу, коли настає непарний день або п\'ятниця'],
        ['0 0 2/2 * 5',
          'опівночі щоразу, коли настає парний день або п\'ятниця']
      ]);
    });

    describe('cadence date arms in a union', function() {
      run([
        ['0 0 3/2 * 5',
          'опівночі кожного 2-го дня місяця, починаючи з 3-го, ' +
          'або в будь-яку п\'ятницю'],
        ['0 9 2/3 * 0',
          'о 9:00 кожного 3-го дня місяця, починаючи з 2-го, ' +
          'або в будь-яку неділю'],
        ['0 0 3/2 6 5',
          'у червні, опівночі кожного 2-го дня, починаючи з 3-го, ' +
          'або в будь-яку п\'ятницю'],
        ['0 0 2/3 * 1-5',
          'опівночі кожного 3-го дня місяця, починаючи з 2-го, ' +
          'або в будь-який будній день'],
        ['0 0 2/3 * MON,WED',
          'опівночі кожного 3-го дня місяця, починаючи з 2-го, ' +
          'або в будь-який понеділок або будь-яку середу'],
        ['0 0 2/3 * 5L',
          'опівночі кожного 3-го дня місяця, починаючи з 2-го, ' +
          'або в останню п\'ятницю місяця'],
        ['* 0 */5 2/3 */4 */4',
          'у січні, травні й вересні, щосекунди протягом 0-ї хвилини, ' +
          'протягом годин 0:00, 5:00, 10:00, 15:00 і 20:00, кожного 3-го ' +
          'дня, починаючи з 2-го, або в будь-який четвер або будь-яку неділю']
      ]);
    });

    describe('weekday forms in a union', function() {
      run([
        ['0 0 15 * MON,WED',
          'опівночі щоразу, коли настає 15-те число місяця, понеділок ' +
          'або середа'],
        ['0 0 15 * 7',
          'опівночі щоразу, коли настає 15-те число місяця або неділя'],
        ['0 0 15 * 2-4',
          'опівночі щоразу, коли настає 15-те число місяця або ' +
          'будь-який день з вівторка до четверга включно'],
        ['0 0 15 * */2',
          'опівночі щоразу, коли настає 15-те число місяця, вівторок, ' +
          'четвер, субота або неділя']
      ]);
    });
  });

  // donor: deferral.js
  describe('compound patterns that fold into a higher field', function() {
    describe('a single minute folds into a specific hour', function() {
      run([
        ['30 9 * * *', 'щодня о 9:30'],
        ['15 14 * * *', 'щодня о 14:15']
      ]);
    });
  });

  // donor: dense-cadence.js
  describe('dense multi-cadence patterns', function() {
    describe('anchor-led, second nested under the minute', function() {
      run([
        ['0-10 */7 */5 LW * *',
          'останнього буднього дня місяця, кожні 5 годин з півночі ' +
          'до 20:00 включно, кожні 7 хвилин з 0-ї до 56-ї хвилини ' +
          'включно, і в межах кожної з цих хвилин, щосекунди з 0-ї ' +
          'до 10-ї секунди включно'],
        ['0-10 */7 */5 * * 1#2',
          'другого понеділка місяця, кожні 5 годин з півночі до 20:00 ' +
          'включно, кожні 7 хвилин з 0-ї до 56-ї хвилини включно, і в ' +
          'межах кожної з цих хвилин, щосекунди з 0-ї до 10-ї секунди ' +
          'включно'],
        ['30-59 */20 */6 L * *',
          'останнього дня місяця, кожні 6 годин, кожні 20 хвилин, і в ' +
          'межах кожної з цих хвилин, щосекунди з 30-ї до 59-ї секунди ' +
          'включно'],
        ['0-30 */12 */8 * * 2',
          'по вівторках, кожні 8 годин, кожні 12 хвилин, і в межах ' +
          'кожної з цих хвилин, щосекунди з 0-ї до 30-ї секунди включно'],
        ['5-30 */10 */3 1-5 * *',
          'з першого до п\'ятого включно, кожні 3 години, кожні 10 ' +
          'хвилин, і в межах кожної з цих хвилин, щосекунди з 5-ї до ' +
          '30-ї секунди включно'],
        ['15-50 */6 */3 15 * *',
          'п\'ятнадцятого числа, кожні 3 години, кожні 6 хвилин, і в ' +
          'межах кожної з цих хвилин, щосекунди з 15-ї до 50-ї секунди ' +
          'включно'],
        ['10-40 */5 */2 * 1,4,7 *',
          'у січні, квітні й липні, кожні 2 години, кожні 5 хвилин, і ' +
          'в межах кожної з цих хвилин, щосекунди з 10-ї до 40-ї ' +
          'секунди включно'],
        ['0-45 */9 */4 L 3 *',
          'останнього дня березня, кожні 4 години, кожні 9 хвилин з 0-ї ' +
          'до 54-ї хвилини включно, і в межах кожної з цих хвилин, ' +
          'щосекунди з 0-ї до 45-ї секунди включно']
      ]);
    });

    describe('anchor-led with an hour-range window', function() {
      run([
        ['0-20/2 */15 8-18 1 * *',
          'першого, з 8:00 до 18:00 включно, кожні 15 хвилин, і в межах ' +
          'кожної з цих хвилин, о 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 і ' +
          '20 секундах'],
        ['0-30 */10 9-17 1-5 * *',
          'з першого до п\'ятого включно, з 9:00 до 17:00 включно, ' +
          'кожні 10 хвилин, і в межах кожної з цих хвилин, щосекунди ' +
          'з 0-ї до 30-ї секунди включно']
      ]);
    });

    describe('anchor-led with a list/range-with-outlier hour window',
      function() {
        run([
          ['0-10 */7 9-20,22 LW * *',
            'останнього буднього дня місяця, протягом годин з 9:00 до ' +
            '20:00 включно і 22:00, кожні 7 хвилин з 0-ї до 56-ї ' +
            'хвилини включно, і в межах кожної з цих хвилин, щосекунди ' +
            'з 0-ї до 10-ї секунди включно'],
          ['0-10 5/15 9-20,22 LW * *',
            'останнього буднього дня місяця, протягом годин з 9:00 до ' +
            '20:00 включно і 22:00, кожні 15 хвилин починаючи з 5-ї ' +
            'хвилини, і в межах кожної з цих хвилин, щосекунди з 0-ї ' +
            'до 10-ї секунди включно'],
          ['0-10 0-30 9-20,22 LW * *',
            'останнього буднього дня місяця, протягом годин з 9:00 до ' +
            '20:00 включно і 22:00, щохвилини з 0-ї до 30-ї хвилини ' +
            'включно, і в межах кожної з цих хвилин, щосекунди з 0-ї ' +
            'до 10-ї секунди включно']
        ]);
      });

    describe('no anchor: lead with the hour cadence', function() {
      run([
        ['0-10 */7 */5 * * *',
          'кожні 5 годин з півночі до 20:00 включно, кожні 7 хвилин ' +
          'з 0-ї до 56-ї хвилини включно, і в межах кожної з цих ' +
          'хвилин, щосекунди з 0-ї до 10-ї секунди включно'],
        ['20-40 */8 8-20 * * *',
          'з 8:00 до 20:00 включно, кожні 8 хвилин з 0-ї до 56-ї ' +
          'хвилини включно, і в межах кожної з цих хвилин, щосекунди ' +
          'з 20-ї до 40-ї секунди включно']
      ]);
    });

    describe('minute as a non-stride list', function() {
      run([
        ['*/15 1,2,5 */2 * * *',
          'кожні 2 години, о 1, 2 і 5 хвилинах, і в межах кожної з цих ' +
          'хвилин, кожні 15 секунд']
      ]);
    });
  });

  // donor: hour-range-cadence.js
  describe('hour range under a fixed minute and a second reads as a window',
    function() {
      describe('minute 0 (folds into the hour)', function() {
        run([
          ['30 0 9-17 * * *',
            'о 30-й секунді, щогодини з 9:00 до 17:00 включно'],
          ['5 0 9-17 * * *',
            'о 5-й секунді, щогодини з 9:00 до 17:00 включно'],
          ['5,30 0 9-17 * * *',
            'о 5 і 30 секундах, щогодини з 9:00 до 17:00 включно'],
          ['0-10 0 9-17 * * *',
            'щосекунди з 0-ї до 10-ї секунди включно, щогодини з 9:00 ' +
            'до 17:00 включно'],
          ['* 0 9-17 * * *',
            'щосекунди протягом 0-ї хвилини з 9:00 до 17:00 включно'],
          ['*/15 0 9-17 * * *',
            'кожні 15 секунд протягом 0-ї хвилини з 9:00 до 17:00 включно']
        ]);
      });

      describe('a range inside a list (window + single)', function() {
        run([
          ['30 0 9-20,22 * * *',
            'о 30-й секунді, щогодини з 9:00 до 20:00 включно та о 22:00'],
          ['* 0 9-20,22 * * *',
            'щосекунди протягом 0-ї хвилини протягом годин з 9:00 до ' +
            '20:00 включно і 22:00']
        ]);
      });

      describe('non-zero pinned minute leads, window names the boundary',
        function() {
          run([
            ['30 5 9-17 * * *',
              'о 30-й секунді, о 5-й хвилині щогодини з 9:00 до 17:00 ' +
              'включно']
          ]);
        });

      describe('with a day qualifier', function() {
        run([
          ['30 0 9-17 * * MON',
            'о 30-й секунді, щогодини з 9:00 до 17:00 включно по ' +
            'понеділках']
        ]);
      });

      describe('guard — a pure list still enumerates', function() {
        run([
          ['30 0 9,17 * * *', 'щодня о 9:00:30 і 17:00:30']
        ]);
      });
    });

  // donor: hour-range-qualifiers.js
  describe('hour-range and frequency day qualifiers', function() {
    describe('hour range with a date and/or month', function() {
      run([
        ['0 9-17 13 * *',
          'щогодини з 9:00 до 17:00 включно тринадцятого числа'],
        ['0 9-17 * 6 *', 'щогодини з 9:00 до 17:00 включно у червні'],
        ['0 9-17 13 6 *', 'щогодини з 9:00 до 17:00 включно 13 червня'],
        ['0 9-17 13 * 5',
          'щогодини з 9:00 до 17:00 включно, щоразу, коли настає ' +
          '13-те число місяця або п\'ятниця']
      ]);
    });

    describe('step frequency with a date or weekday (no hour range)',
      function() {
        run([
          ['*/15 * * * MON', 'кожні 15 хвилин по понеділках'],
          ['*/15 * 13 * *', 'кожні 15 хвилин тринадцятого числа'],
          ['*/15 9-17 13 * *',
            'кожні 15 хвилин з 9:00 до 17:00 включно тринадцятого числа']
        ]);
      });
  });

  // donor: hour-step-cadence.js
  describe('hour step under a fixed minute and a second reads as a cadence',
    function() {
      describe('minute 0 (folds into the hour)', function() {
        run([
          ['30 0 */2 * * *', 'о 30-й секунді, кожні 2 години'],
          ['5 0 */2 * * *', 'о 5-й секунді, кожні 2 години'],
          ['* 0 */2 * * *',
            'щосекунди протягом 0-ї хвилини кожної другої години'],
          ['*/15 0 */2 * * *',
            'кожні 15 секунд протягом 0-ї хвилини кожної другої години'],
          ['5,30 0 */2 * * *', 'о 5 і 30 секундах, кожні 2 години'],
          ['0-10 0 */2 * * *',
            'щосекунди з 0-ї до 10-ї секунди включно, кожні 2 години']
        ]);
      });

      describe('offset, bounded, and non-tiling hour strides', function() {
        run([
          ['30 0 2/6 * * *',
            'о 30-й секунді, кожні 6 годин починаючи з 2:00'],
          ['30 0 */5 * * *',
            'о 30-й секунді, кожні 5 годин з півночі до 20:00 включно'],
          ['30 0 9-17/2 * * *',
            'о 30-й секунді, кожні 2 години з 9:00 до 17:00 включно']
        ]);
      });

      describe('bounded step from midnight (start 0, stops short)',
        function() {
          run([
            ['23 0-20/2 * * *',
              'о 23-й хвилині, кожні 2 години з півночі до 20:00 включно'],
            ['30 0-20/3 * * *',
              'о 30-й хвилині, кожні 3 години з півночі до 18:00 включно']
          ]);
        });

      describe('non-zero pinned minute', function() {
        run([
          ['* 5 */2 * * *',
            'щосекунди протягом 5-ї хвилини кожної другої години'],
          ['5,30 5 */2 * * *',
            'о 5 і 30 секундах, о 5-й хвилині, кожні 2 години'],
          ['30 5 */2 * * *', 'о 30-й секунді, о 5-й хвилині, кожні 2 години']
        ]);
      });

      describe('with a day qualifier', function() {
        run([
          ['30 0 */2 1 * *', 'о 30-й секунді, кожні 2 години першого'],
          ['30 0 */2 * * MON', 'о 30-й секунді, кожні 2 години по понеділках']
        ]);
      });

      describe('guards — not a stride, or no second', function() {
        run([
          ['30 0 9,17 * * *', 'щодня о 9:00:30 і 17:00:30'],
          ['0 0 */2 * * *', 'кожні 2 години'],
          ['23 */2 * * *', 'о 23-й хвилині, кожні 2 години'],
          ['23 0-22/2 * * *', 'о 23-й хвилині, кожні 2 години'],
          ['23 0-23/2 * * *', 'о 23-й хвилині, кожні 2 години']
        ]);
      });
    });
});
