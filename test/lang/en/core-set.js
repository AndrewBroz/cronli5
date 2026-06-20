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

describe.skip('English core-set corrections:', function() {

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
      ['* 0 * * * *', 'every second of minute :00 of every hour'],
      ['* 1 * * * *', 'every second of minute :01 of every hour'],
      ['* 13 * * * *', 'every second of minute :13 of every hour']
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
      ['* 0 */2 * * *', 'every second of minute :00 of every other hour'],
      ['* 0 0 * * *', 'every second of minute :00 at midnight'],
      ['* 0 9,11,13,15,17,19,21 * * *',
        'every second of minute :00 during the 9 a.m., 11 a.m., 1 p.m., ' +
        '3 p.m., 5 p.m., 7 p.m., and 9 p.m. hours'],
      ['* 0 9-17 * * *',
        'every second of minute :00 from 9 a.m. until 6 p.m.'],
      ['* 0-30 * * * *',
        'every second of minutes :00 through :30 of every hour'],
      ['* 0-30 */2 * * *',
        'every second of minutes :00 through :30 of every ' +
        'other hour'],
      ['* 0-30 9,17 * * *',
        'every second of minutes :00 through :30 during the ' +
        '9 a.m. and 5 p.m. hours'],
      ['* 0-30 9-17 * * *',
        'every second of minutes :00 through :30 from 9 a.m. until 6 p.m.'],
      ['* 5,30 * * * *', 'every second of minutes :05 and :30 of every hour']
    ]);
  });

  // [c0021–c0030] seconds/sub-minute family + minute-leading cadences; the
  // during→of confinement convention applies globally.
  describe('batch 3 - minute-leading & second-step:', function() {
    run([
      ['* 5,30 */2 * * *',
        'every second of minutes :05 and :30 of every other hour'],
      ['*/15 0 * * * *', 'every 15 seconds of minute :00 of every hour'],
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
      ['0 */5 * 1 * 5', 'every five minutes on the 1st or on Fridays']
    ]);
  });

  // [c0041–c0050] minute cadence under a stepped hour; mostly during→of, plus
  // trailing-weekday plurals (range stays singular).
  describe('batch 5 - minute cadence under stepped hours:', function() {
    run([
      ['0 */5 * 1 6 5',
        'every five minutes on June 1 or on Fridays in June'],
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
        'every five minutes of every other hour on the 1st or on Fridays'],
      ['0 */5 */2 1 6 *',
        'every five minutes of every other hour on June 1'],
      ['0 */5 */2 1 6 5',
        'every five minutes of every other hour on June 1 or on Fridays ' +
        'in June'],
      ['0 */5 */2 L * *',
        'every five minutes of every other hour on the last day of the ' +
        'month'],
      ['0 */5 9,17 * * 1',
        'every five minutes during the 9 a.m. and 5 p.m. hours on Mondays']
    ]);
  });

  // [c0061–c0070] hour list keeps during; hour RANGE uses the until window
  // ("from 9 a.m. until 6 p.m.", not the spelled-out 5:55 last fire).
  describe('batch 7 - hour list vs range under a minute cadence:', function() {
    run([
      ['0 */5 9,17 1 * 5',
        'every five minutes during the 9 a.m. and 5 p.m. hours on the 1st ' +
        'or on Fridays'],
      ['0 */5 9,17 1 6 5',
        'every five minutes during the 9 a.m. and 5 p.m. hours on June 1 ' +
        'or on Fridays in June'],
      ['0 */5 9-17 * * 1',
        'every five minutes from 9 a.m. until 6 p.m. on Mondays'],
      ['0 */5 9-17 * * 1-5',
        'every five minutes from 9 a.m. until 6 p.m. on Monday through ' +
        'Friday'],
      ['0 */5 9-17 * * 5L',
        'every five minutes from 9 a.m. until 6 p.m. on the last Friday of ' +
        'the month'],
      ['0 */5 9-17 * */3 *',
        'every five minutes from 9 a.m. until 6 p.m. in January, April, ' +
        'July, and October'],
      ['0 */5 9-17 * 6 *',
        'every five minutes from 9 a.m. until 6 p.m. in June']
    ]);
  });

  // [c0071–c0080] hour-range until-window continued; leading weekday forms
  // ("every Sunday…", "every Monday through Friday") are already correct.
  describe('batch 8 - hour range until-window; leading weekdays:', function() {
    run([
      ['0 */5 9-17 */2 * *',
        'every five minutes from 9 a.m. until 6 p.m. on every other day of ' +
        'the month'],
      ['0 */5 9-17 1 * *',
        'every five minutes from 9 a.m. until 6 p.m. on the 1st'],
      ['0 */5 9-17 1 * 5',
        'every five minutes from 9 a.m. until 6 p.m. on the 1st or on ' +
        'Fridays'],
      ['0 */5 9-17 1 6 *',
        'every five minutes from 9 a.m. until 6 p.m. on June 1'],
      ['0 */5 9-17 1 6 5',
        'every five minutes from 9 a.m. until 6 p.m. on June 1 or on ' +
        'Fridays in June'],
      ['0 */5 9-17 L * *',
        'every five minutes from 9 a.m. until 6 p.m. on the last day of the ' +
        'month']
    ]);
  });

  // [c0081–c0090] midnight clock points with leading weekday/month qualifiers
  // are otherwise correct. c0086: a quartz "of the month" is redundant under an
  // explicit (distributive) month qualifier and drops. Month-range and OR
  // sub-classes are open (see docs/backlog.md).
  describe('batch 9 - quartz "of the month" redundancy:', function() {
    run([
      ['0 0 * */2 5L',
        'on the last Friday in every odd-numbered month at midnight'],
      ['0 0 * 1 5L', 'on the last Friday in January at midnight'],
      ['0 0 L */2 *',
        'on the last day in every odd-numbered month at midnight'],
      ['0 0 L 1 *', 'on the last day in January at midnight']
    ]);
  });

  // [quartz × restricted month] month-range and OR cases. PANEL-VALIDATED
  // (blind Sonnet ×3, unanimous): an OR restates the month on BOTH sides — the
  // lead-the-month form was judged INCORRECT (the post-"or" side dangles and
  // reads year-round). A month-range quartz reads "… of each month from X
  // through Y"; single/distributive months drop the bare "of the month".
  describe('quartz month-scope (restate the month per or-side):', function() {
    run([
      ['0 0 * 1-3 5L',
        'on the last Friday of each month from January through March at ' +
        'midnight'],
      ['0 0 L 1-3 *',
        'on the last day of each month from January through March at ' +
        'midnight'],
      ['0 0 */2 */2 5L',
        'on every other day in every odd-numbered month or on the last ' +
        'Friday in every odd-numbered month at midnight'],
      ['0 0 */2 1 5L',
        'on every other day in January or on the last Friday in January at ' +
        'midnight'],
      ['0 0 */2 1-3 5L',
        'on every other day in January through March or on the last Friday ' +
        'in January through March at midnight'],
      ['0 0 1 */2 5L',
        'on the 1st in every odd-numbered month or on the last Friday in ' +
        'every odd-numbered month at midnight'],
      ['0 0 1 1 5L',
        'on January 1 or on the last Friday in January at midnight'],
      ['0 0 1 1-3 5L',
        'on the 1st in January through March or on the last Friday in ' +
        'January through March at midnight'],
      ['0 0 1-15 */2 5L',
        'on the 1st through 15th in every odd-numbered month or on the last ' +
        'Friday in every odd-numbered month at midnight'],
      ['0 0 1-15 1 5L',
        'on January 1 through 15 or on the last Friday in January at ' +
        'midnight'],
      ['0 0 1-15 1-3 5L',
        'on the 1st through 15th in January through March or on the last ' +
        'Friday in January through March at midnight'],
      ['0 0 L */2 */2',
        'on the last day in every odd-numbered month or on Sunday, Tuesday, ' +
        'Thursday, and Saturday in every odd-numbered month at midnight'],
      ['0 0 L */2 0',
        'on the last day in every odd-numbered month or on Sunday in every ' +
        'odd-numbered month at midnight'],
      ['0 0 L */2 1-5',
        'on the last day in every odd-numbered month or on Monday through ' +
        'Friday in every odd-numbered month at midnight'],
      ['0 0 L */2 5L',
        'on the last day in every odd-numbered month or on the last Friday ' +
        'in every odd-numbered month at midnight'],
      ['0 0 L 1 */2',
        'on the last day in January or on Sunday, Tuesday, Thursday, and ' +
        'Saturday in January at midnight'],
      ['0 0 L 1 0',
        'on the last day in January or on Sunday in January at midnight'],
      ['0 0 L 1 1-5',
        'on the last day in January or on Monday through Friday in January ' +
        'at midnight'],
      ['0 0 L 1 5L',
        'on the last day in January or on the last Friday in January at ' +
        'midnight'],
      ['0 0 L 1-3 */2',
        'on the last day in January through March or on Sunday, Tuesday, ' +
        'Thursday, and Saturday in January through March at midnight'],
      ['0 0 L 1-3 0',
        'on the last day in January through March or on Sunday in January ' +
        'through March at midnight'],
      ['0 0 L 1-3 1-5',
        'on the last day in January through March or on Monday through ' +
        'Friday in January through March at midnight'],
      ['0 0 L 1-3 5L',
        'on the last day in January through March or on the last Friday in ' +
        'January through March at midnight']
    ]);
  });
});
