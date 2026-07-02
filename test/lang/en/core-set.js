import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';

const {expect} = chai;

// Corrected English over the core set (test/core/core-set.json), pinned as
// EXACT strings — the intended output for entries where the current stable
// renderer is wrong, found in the batch-by-batch core-set English review.
// English is frozen, so this is skipped: un-skip, watch red, fix the renderer,
// watch green. Unlike known-issues.js (which asserts a defect invariant), this
// pins the exact corrected wording; the wording is the reviewer's proposal
// until a fix lands and the maintainer confirms it. Each row is
// [pattern, expected, opts?]; opts may be {sentence: true} to pin the CLI form.

function run(cases) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = values[2] || {};

    describe(JSON.stringify([pattern, options]), function() {
      it('reads "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

describe('English core-set corrections:', function() {

  // Under a seconds wildcard, a coarser minute/hour step is a CONFINEMENT, not
  // a second juxtaposed cadence; an unrestricted minute is redundant under
  // "every second" and is dropped. (docs/backlog.md: minute-0 confinement,
  // stepped-minute confinement, seconds+hour redundancy.) [c0002–c0010]
  describe('seconds cadence — confinement & redundancy', function() {
    run([
      ['* * */2 * * *', 'every second of every other hour'],
      ['* * 0 * * *', 'every second of the midnight hour'],
      ['* * 9-17 * * *', 'every second from 9 a.m. until 6 p.m.'],
      ['* * 9-17/2 * * *',
        'every second during the 9 a.m., 11 a.m., 1 p.m., 3 p.m., ' +
        'and 5 p.m. hours'],
      ['* */2 * * * *', 'every second of every other minute'],
      ['* */2 */2 * * *',
        'every second of every other minute of every other hour'],
      ['* */2 0 * * *',
        'every second of every other minute from midnight until ' +
        '1 a.m.'],
      ['* */2 9-17/2 * * *',
        'every second of every other minute during the 9 a.m., 11 a.m., ' +
        '1 p.m., 3 p.m., and 5 p.m. hours'],
      ['* 0 * * * *', 'every second during minute 0 of every hour'],
      ['* 1 * * * *', 'every second during minute 1 of every hour'],
      ['* 13 * * * *', 'every second during minute 13 of every hour']
    ]);
  });

  // The sentence wrapper must not double the period when the fragment already
  // ends in the abbreviation "a.m."/"p.m." (docs/backlog.md). Affects every
  // a.m./p.m.-ending time in sentence form.
  describe('sentence form — no doubled period after a.m./p.m.', function() {
    run([
      ['0 9 * * *', 'Runs every day at 9 a.m.', {sentence: true}],
      ['30 14 * * *', 'Runs every day at 2:30 p.m.', {sentence: true}]
    ]);
  });

  // [c0011–c0020] seconds wildcard, minute fixed/range, hours fixed/range/list.
  describe('batch 2 refinements - seconds in minutes:', function() {
    run([
      ['* 0 */2 * * *', 'every second during minute 0 of every other hour'],
      ['* 0 0 * * *', 'every second during minute 0 at midnight'],
      ['* 0 9,11,13,15,17,19,21 * * *',
        'every second during minute 0 during the 9 a.m., 11 a.m., 1 p.m., ' +
        '3 p.m., 5 p.m., 7 p.m., and 9 p.m. hours'],
      ['* 0 9-17 * * *',
        'every second during minute 0 from 9 a.m. through 5 p.m.'],
      ['* 0-30 * * * *',
        'every second during minutes 0 through 30 of every hour'],
      ['* 0-30 */2 * * *',
        'every second during minutes 0 through 30 of every ' +
        'other hour'],
      ['* 0-30 9,17 * * *',
        'every second during minutes 0 through 30 during the ' +
        '9 a.m. and 5 p.m. hours'],
      ['* 0-30 9-17 * * *',
        'every second during minutes 0 through 30 from 9 a.m. through 5 p.m.'],
      ['* 5,30 * * * *', 'every second during minutes 5 and 30 of every hour']
    ]);
  });

  // [c0021–c0030] seconds/sub-minute family + minute-leading cadences; the
  // during→of confinement convention applies globally.
  describe('batch 3 - minute-leading & second-step:', function() {
    run([
      ['* 5,30 */2 * * *',
        'every second during minutes 5 and 30 of every other hour'],
      ['*/15 0 * * * *', 'every 15 seconds during minute 0 of every hour'],
      ['0 * */2 * * *', 'every minute of every other hour'],
      ['0 * 0 * * *', 'every minute of the midnight hour'],
      ['0 * 9-17 * * *', 'every minute from 9 a.m. until 6 p.m.'],
      ['0 */2 */2 * * *', 'every two minutes of every other hour']
    ]);
  });

  // [c0031–c0040] minute cadence + day qualifiers. Trailing single/list
  // weekdays pluralize ("on Mondays"); weekday RANGES keep the singular idiom
  // ("on Monday through Friday" — panel-confirmed). A single hour-0 confinement
  // under a sub-hour cadence spans the hour ("from midnight until 1 a.m.").
  describe('batch 4 - minute cadence + day qualifiers:', function() {
    run([
      ['0 */2 0 * * *', 'every two minutes from midnight until 1 a.m.'],
      ['0 */5 * * * 1', 'every five minutes on Mondays'],
      ['0 */5 * 1 * 5',
        'every five minutes whenever the day is the 1st or a Friday']
    ]);
  });

  // [c0041–c0050] minute cadence under a stepped hour; mostly during→of, plus
  // trailing-weekday plurals (range stays singular).
  describe('batch 5 - minute cadence under stepped hours:', function() {
    run([
      ['0 */5 * 1 6 5',
        'in June, every five minutes whenever the day is the 1st or a Friday'],
      ['0 */5 */2 * * 1',
        'every five minutes of every other hour on Mondays'],
      ['0 */5 */2 * * 1-5',
        'every five minutes of every other hour on Monday through Friday'],
      ['0 */5 */2 * * 5L',
        'every five minutes of every other hour on the last Friday of the ' +
        'month'],
      ['0 */5 */2 * */3 *',
        'every five minutes of every other hour in January, April, July, ' +
        'and October'],
      ['0 */5 */2 * 6 *', 'every five minutes of every other hour in June'],
      ['0 */5 */2 */2 * *',
        'every five minutes of every other hour on every other day of the ' +
        'month'],
      ['0 */5 */2 1 * *', 'every five minutes of every other hour on the 1st']
    ]);
  });

  // [c0051–c0060] compound day qualifiers. during→of for the stepped hour;
  // the enumerated hour list keeps during; weekday singles/lists pluralize.
  describe('batch 6 - compound day qualifiers:', function() {
    run([
      ['0 */5 */2 1 * 5',
        'every five minutes of every other hour whenever the day is the 1st ' +
        'or a Friday'],
      ['0 */5 */2 1 6 *',
        'every five minutes of every other hour on June 1'],
      ['0 */5 */2 1 6 5',
        'in June, every five minutes of every other hour whenever the day is ' +
        'the 1st or a Friday'],
      ['0 */5 */2 L * *',
        'every five minutes of every other hour on the last day of the ' +
        'month'],
      ['0 */5 9,17 * * 1',
        'every five minutes during the 9 a.m. and 5 p.m. hours on Mondays']
    ]);
  });

  // [c0061–c0070] hour list keeps during; an hour RANGE under a RESTRICTED
  // minute (here `*/5`) reads the bare "through <last hour>" window — the run is
  // not continuous to the top of the next hour, so it is not the until-window.
  describe('batch 7 - hour list vs range under a minute cadence:', function() {
    run([
      ['0 */5 9,17 1 * 5',
        'every five minutes during the 9 a.m. and 5 p.m. hours whenever the ' +
        'day is the 1st or a Friday'],
      ['0 */5 9,17 1 6 5',
        'in June, every five minutes during the 9 a.m. and 5 p.m. hours ' +
        'whenever the day is the 1st or a Friday'],
      ['0 */5 9-17 * * 1',
        'every five minutes from 9 a.m. through 5 p.m. on Mondays'],
      ['0 */5 9-17 * * 1-5',
        'every five minutes from 9 a.m. through 5 p.m. on Monday through ' +
        'Friday'],
      ['0 */5 9-17 * * 5L',
        'every five minutes from 9 a.m. through 5 p.m. on the last Friday of ' +
        'the month'],
      ['0 */5 9-17 * */3 *',
        'every five minutes from 9 a.m. through 5 p.m. in January, April, ' +
        'July, and October'],
      ['0 */5 9-17 * 6 *',
        'every five minutes from 9 a.m. through 5 p.m. in June']
    ]);
  });

  // [c0071–c0080] hour-range "through" window (restricted `*/5` minute)
  // continued; leading weekday forms ("every Sunday…", "every Monday through
  // Friday") are already correct.
  describe('batch 8 - hour range window; leading weekdays:', function() {
    run([
      ['0 */5 9-17 */2 * *',
        'every five minutes from 9 a.m. through 5 p.m. on every other day of ' +
        'the month'],
      ['0 */5 9-17 1 * *',
        'every five minutes from 9 a.m. through 5 p.m. on the 1st'],
      ['0 */5 9-17 1 * 5',
        'every five minutes from 9 a.m. through 5 p.m. whenever the day is ' +
        'the 1st or a Friday'],
      ['0 */5 9-17 1 6 *',
        'every five minutes from 9 a.m. through 5 p.m. on June 1'],
      ['0 */5 9-17 1 6 5',
        'in June, every five minutes from 9 a.m. through 5 p.m. whenever the ' +
        'day is the 1st or a Friday'],
      ['0 */5 9-17 L * *',
        'every five minutes from 9 a.m. through 5 p.m. on the last day of the ' +
        'month']
    ]);
  });

  // Quartz/date "of the month" is redundant under an explicit month and
  // drops; a month range reads "of each month from X through Y". (non-OR)
  describe('redundancy - of the month under an explicit month:', function() {
    run([
      ['0 0 * */2 5L',
        'on the last Friday in every odd-numbered month at midnight'],
      ['0 0 * 1 5L', 'on the last Friday in January at midnight'],
      ['0 0 L */2 *',
        'on the last day in every odd-numbered month at midnight'],
      ['0 0 L 1 *', 'on the last day in January at midnight'],
      ['0 0 * 1-3 5L',
        'on the last Friday of each month from January through March at ' +
        'midnight'],
      ['0 0 L 1-3 *',
        'on the last day of each month from January through March at ' +
        'midnight'],
      ['0 0 */2 */2 *',
        'every other day in every odd-numbered month at midnight'],
      ['0 0 */2 1 *', 'every other day in January at midnight'],
      ['0 0 */2 1-3 *',
        'every other day of each month from January through March at ' +
        'midnight']
    ]);
  });

  // Trailing weekday pluralizes; a restricted-minute hour-range cadence reads
  // the "through <last hour>" window.
  // (non-OR + cadence-OR; the 30 5,10 … time clauses are live — weekday fix only.)
  describe('trailing weekday plural + hour-range window:', function() {
    run([
      ['0 0 */2 * * 1', 'every two hours on Mondays'],
      ['0 0 */2 1 * 5',
        'every two hours whenever the day is the 1st or a Friday'],
      ['0 0 */2 1 6 5',
        'in June, every two hours whenever the day is the 1st or a Friday'],
      ['0 0 9-17 * * 1', 'every hour from 9 a.m. through 5 p.m. on Mondays'],
      ['0 0 9-17 1 * 5',
        'every hour from 9 a.m. through 5 p.m. whenever the day is the 1st ' +
        'or a Friday'],
      ['0 0 9-17 1 6 5',
        'in June, every hour from 9 a.m. through 5 p.m. whenever the day is ' +
        'the 1st or a Friday'],
      ['30 5,10 9,17,19,21,23 * * 1',
        'at 30 seconds past the minute, at 5 and 10 minutes past the ' +
        'hour, at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. on Mondays'],
      ['30 5,10 9,17,19,21,23 1 * 5',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. whenever the day is ' +
        'the 1st or a Friday'],
      ['30 5,10 9,17,19,21,23 1 6 5',
        'in June, at 30 seconds past the minute, at 5 and 10 minutes past ' +
        'the hour, at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. whenever ' +
        'the day is the 1st or a Friday']
    ]);
  });

  // cron's DOM/DOW union, clock-point cases. PANEL-VALIDATED CONDITION-FRAME:
  // "[in <month>] at midnight whenever the day is <flat or-list of predicates>".
  // Reframing to a predicate over one variable ("the day is X or Y") is the only
  // form that reads as a union for naive, logical, AND technical readers — plain
  // "on X or on Y" reads as alternative, "on X and on Y" as intersection. Day
  // predicates: the 1st / from the 1st through the 15th / an odd-numbered day /
  // the last day of the month; a Friday / a weekday / the last Friday of the
  // month (each quartz keeps its full parallel phrase, no possessive). The
  // cadence
  // OR cases (in batches 4–8 above + below) use the same frame with the cadence
  // as the lead. (Note: no mainstream cron tool renders the union this way.)
  describe('OR union — condition-frame (panel-validated):', function() {
    run([
      ['0 0 */2 * */2',
        'at midnight whenever the day is an odd-numbered day, a Sunday, a ' +
        'Tuesday, a Thursday, or a Saturday'],
      ['0 0 */2 * 0',
        'at midnight whenever the day is an odd-numbered day or a Sunday'],
      ['0 0 */2 * 1-5',
        'at midnight whenever the day is an odd-numbered day or a weekday'],
      ['0 0 */2 * 5L',
        'at midnight whenever the day is an odd-numbered day or the last ' +
        'Friday of the month'],
      ['0 0 */2 */2 */2',
        'in every odd-numbered month, at midnight whenever the day is an ' +
        'odd-numbered day, a Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 */2 */2 0',
        'in every odd-numbered month, at midnight whenever the day is an ' +
        'odd-numbered day or a Sunday'],
      ['0 0 */2 */2 1-5',
        'in every odd-numbered month, at midnight whenever the day is an ' +
        'odd-numbered day or a weekday'],
      ['0 0 */2 */2 5L',
        'in every odd-numbered month, at midnight whenever the day is an ' +
        'odd-numbered day or the last Friday of the month'],
      ['0 0 */2 1 */2',
        'in January, at midnight whenever the day is an odd-numbered day, a ' +
        'Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 */2 1 0',
        'in January, at midnight whenever the day is an odd-numbered day or ' +
        'a Sunday'],
      ['0 0 */2 1 1-5',
        'in January, at midnight whenever the day is an odd-numbered day or ' +
        'a weekday'],
      ['0 0 */2 1 5L',
        'in January, at midnight whenever the day is an odd-numbered day or ' +
        'the last Friday of the month'],
      ['0 0 */2 1-3 */2',
        'in January through March, at midnight whenever the day is an ' +
        'odd-numbered day, a Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 */2 1-3 0',
        'in January through March, at midnight whenever the day is an ' +
        'odd-numbered day or a Sunday'],
      ['0 0 */2 1-3 1-5',
        'in January through March, at midnight whenever the day is an ' +
        'odd-numbered day or a weekday'],
      ['0 0 */2 1-3 5L',
        'in January through March, at midnight whenever the day is an ' +
        'odd-numbered day or the last Friday of the month'],
      ['0 0 1 * */2',
        'at midnight whenever the day is the 1st, a Sunday, a Tuesday, a ' +
        'Thursday, or a Saturday'],
      ['0 0 1 * 0', 'at midnight whenever the day is the 1st or a Sunday'],
      ['0 0 1 * 1-5', 'at midnight whenever the day is the 1st or a weekday'],
      ['0 0 1 * 5L',
        'at midnight whenever the day is the 1st or the last Friday of the ' +
        'month'],
      ['0 0 1 */2 */2',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        '1st, a Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 1 */2 0',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        '1st or a Sunday'],
      ['0 0 1 */2 1-5',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        '1st or a weekday'],
      ['0 0 1 */2 5L',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        '1st or the last Friday of the month'],
      ['0 0 1 1 * */2',
        'at 1 a.m. whenever the day is the 1st, a Sunday, a Tuesday, a ' +
        'Thursday, or a Saturday'],
      ['0 0 1 1 */2',
        'in January, at midnight whenever the day is the 1st, a Sunday, a ' +
        'Tuesday, a Thursday, or a Saturday'],
      ['0 0 1 1 0',
        'in January, at midnight whenever the day is the 1st or a Sunday'],
      ['0 0 1 1 1-5',
        'in January, at midnight whenever the day is the 1st or a weekday'],
      ['0 0 1 1 5L',
        'in January, at midnight whenever the day is the 1st or the last ' +
        'Friday of the month'],
      ['0 0 1 1-3 */2',
        'in January through March, at midnight whenever the day is the 1st, ' +
        'a Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 1 1-3 0',
        'in January through March, at midnight whenever the day is the 1st ' +
        'or a Sunday'],
      ['0 0 1 1-3 1-5',
        'in January through March, at midnight whenever the day is the 1st ' +
        'or a weekday'],
      ['0 0 1 1-3 5L',
        'in January through March, at midnight whenever the day is the 1st ' +
        'or the last Friday of the month'],
      ['0 0 1-15 * */2',
        'at midnight whenever the day is from the 1st through the 15th, a ' +
        'Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 1-15 * 0',
        'at midnight whenever the day is from the 1st through the 15th or a ' +
        'Sunday'],
      ['0 0 1-15 * 1-5',
        'at midnight whenever the day is from the 1st through the 15th or a ' +
        'weekday'],
      ['0 0 1-15 * 5L',
        'at midnight whenever the day is from the 1st through the 15th or ' +
        'the last Friday of the month'],
      ['0 0 1-15 */2 */2',
        'in every odd-numbered month, at midnight whenever the day is from ' +
        'the 1st through the 15th, a Sunday, a Tuesday, a Thursday, or a ' +
        'Saturday'],
      ['0 0 1-15 */2 0',
        'in every odd-numbered month, at midnight whenever the day is from ' +
        'the 1st through the 15th or a Sunday'],
      ['0 0 1-15 */2 1-5',
        'in every odd-numbered month, at midnight whenever the day is from ' +
        'the 1st through the 15th or a weekday'],
      ['0 0 1-15 */2 5L',
        'in every odd-numbered month, at midnight whenever the day is from ' +
        'the 1st through the 15th or the last Friday of the month'],
      ['0 0 1-15 1 */2',
        'in January, at midnight whenever the day is from the 1st through ' +
        'the 15th, a Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 1-15 1 0',
        'in January, at midnight whenever the day is from the 1st through ' +
        'the 15th or a Sunday'],
      ['0 0 1-15 1 1-5',
        'in January, at midnight whenever the day is from the 1st through ' +
        'the 15th or a weekday'],
      ['0 0 1-15 1 5L',
        'in January, at midnight whenever the day is from the 1st through ' +
        'the 15th or the last Friday of the month'],
      ['0 0 1-15 1-3 */2',
        'in January through March, at midnight whenever the day is from the ' +
        '1st through the 15th, a Sunday, a Tuesday, a Thursday, or a ' +
        'Saturday'],
      ['0 0 1-15 1-3 0',
        'in January through March, at midnight whenever the day is from the ' +
        '1st through the 15th or a Sunday'],
      ['0 0 1-15 1-3 1-5',
        'in January through March, at midnight whenever the day is from the ' +
        '1st through the 15th or a weekday'],
      ['0 0 1-15 1-3 5L',
        'in January through March, at midnight whenever the day is from the ' +
        '1st through the 15th or the last Friday of the month'],
      ['0 0 L * */2',
        'at midnight whenever the day is the last day of the month, a ' +
        'Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 L * 0',
        'at midnight whenever the day is the last day of the month or a ' +
        'Sunday'],
      ['0 0 L * 1-5',
        'at midnight whenever the day is the last day of the month or a ' +
        'weekday'],
      ['0 0 L * 5L',
        'at midnight whenever the day is the last day of the month or the ' +
        'last Friday of the month'],
      ['0 0 L */2 */2',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        'last day of the month, a Sunday, a Tuesday, a Thursday, or a ' +
        'Saturday'],
      ['0 0 L */2 0',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        'last day of the month or a Sunday'],
      ['0 0 L */2 1-5',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        'last day of the month or a weekday'],
      ['0 0 L */2 5L',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        'last day of the month or the last Friday of the month'],
      ['0 0 L 1 */2',
        'in January, at midnight whenever the day is the last day of the ' +
        'month, a Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 L 1 0',
        'in January, at midnight whenever the day is the last day of the ' +
        'month or a Sunday'],
      ['0 0 L 1 1-5',
        'in January, at midnight whenever the day is the last day of the ' +
        'month or a weekday'],
      ['0 0 L 1 5L',
        'in January, at midnight whenever the day is the last day of the ' +
        'month or the last Friday of the month'],
      ['0 0 L 1-3 */2',
        'in January through March, at midnight whenever the day is the last ' +
        'day of the month, a Sunday, a Tuesday, a Thursday, or a Saturday'],
      ['0 0 L 1-3 0',
        'in January through March, at midnight whenever the day is the last ' +
        'day of the month or a Sunday'],
      ['0 0 L 1-3 1-5',
        'in January through March, at midnight whenever the day is the last ' +
        'day of the month or a weekday'],
      ['0 0 L 1-3 5L',
        'in January through March, at midnight whenever the day is the last ' +
        'day of the month or the last Friday of the month']
    ]);
  });

  // [workflow review] restricted-minute hourly ranges read the "through"
  // window, enumerated-list 'during', and NUMERALS-MINUTE-LIST ('five and ten'
  // -> '5 and 10').
  describe('workflow-found corrections (value classes & compounds):', function() {
    run([
      ['0 0 9-17 * * *', 'every hour from 9 a.m. through 5 p.m.'],
      ['0 0 9-17 * * 1-5',
        'every hour from 9 a.m. through 5 p.m. on Monday through Friday'],
      ['0 0 9-17 * * 5L',
        'every hour from 9 a.m. through 5 p.m. on the last Friday of the ' +
        'month'],
      ['0 0 9-17 * */3 *',
        'every hour from 9 a.m. through 5 p.m. in January, April, July, and ' +
        'October'],
      ['0 0 9-17 * 6 *', 'every hour from 9 a.m. through 5 p.m. in June'],
      ['0 0 9-17 */2 * *',
        'every hour from 9 a.m. through 5 p.m. on every other day of the ' +
        'month'],
      ['0 0 9-17 1 * *', 'every hour from 9 a.m. through 5 p.m. on the 1st'],
      ['0 0 9-17 1 6 *', 'every hour from 9 a.m. through 5 p.m. on June 1'],
      ['0 0 9-17 L * *',
        'every hour from 9 a.m. through 5 p.m. on the last day of the month'],
      ['0 0-30 9,17 * * *',
        'every minute from 0 through 30 past the hour during the 9 a.m. and ' +
        '5 p.m. hours'],
      ['0 0-30 9-17 * * *',
        'every minute from 0 through 30 past the hour, from 9 a.m. through 5 p.m.'],
      ['30 5,10 9,17,19,21,23 * * 1-5',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. on Monday through ' +
        'Friday'],
      ['30 5,10 9,17,19,21,23 * * 5L',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. on the last Friday ' +
        'of the month'],
      ['30 5,10 9,17,19,21,23 * */3 *',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. in January, April, ' +
        'July, and October'],
      ['30 5,10 9,17,19,21,23 * 6 *',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. in June'],
      ['30 5,10 9,17,19,21,23 */2 * *',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. on every other day ' +
        'of the month'],
      ['30 5,10 9,17,19,21,23 1 * *',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. on the 1st'],
      ['30 5,10 9,17,19,21,23 1 6 *',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. on June 1'],
      ['30 5,10 9,17,19,21,23 L * *',
        'at 30 seconds past the minute, at 5 and 10 minutes past the hour, ' +
        'at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. on the last day of ' +
        'the month'],
      ['4,6,9 * * * *', 'at 4, 6, and 9 minutes past the hour'],
      ['* 9-10 * * *', 'every minute from 9 a.m. until 11 a.m.'],
      ['0 1-23 * * *', 'every hour from 1 a.m. through 11 p.m.'],
      ['0 0 0 1 1 * 2030-2035',
        'on January 1 at midnight in 2030 through 2035', {years: true}]
    ]);
  });
});
