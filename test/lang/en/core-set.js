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
});
