import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';

const {expect} = chai;

// Known, still-open English semantic problems surfaced by the 7-field
// simple-output-class review (docs/backlog.md). Skipped until fixed: un-skip
// (skip -> describe), watch red, fix the renderer, watch green. English is
// stable, so any fix must leave all other en output byte-identical — the rest
// of the corpus is that guard. These assert the defect's invariant, not a
// final wording (which is chosen when the fix lands).
describe.skip('Known issues (pending fix):', function() {

  // `* 0 * * * * *` fires every second but only during the :00 minute (60/hr),
  // yet renders "every second, every hour" — indistinguishable from the
  // continuous `* * * * * * *` ("every second", 3600/hr). The minute-0
  // confinement must be expressed.
  it('expresses the minute-0 confinement under a seconds wildcard', function() {
    expect(cronli5('* 0 * * * * *')).to.match(/minute|on the hour/u);
  });

  // A trailing weekday qualifier is recurring, so it reads plural ("on
  // Mondays"), not "on Monday". es/de/fi already do this; English is the
  // outlier. The leading "every Monday" form is already correct and frozen.
  it('pluralizes a trailing single weekday', function() {
    expect(cronli5('*/5 * * * 1')).to.match(/on Mondays\b/u);
  });

  it('pluralizes a trailing weekday list', function() {
    expect(cronli5('*/5 * * * 1,3'))
      .to.match(/on Mondays and Wednesdays\b/u);
  });

  // A stepped field coarser than the leading cadence is a confinement, like
  // the hour ("every second … during every other hour") and the month ("…in
  // every other month"). But the minute and year fields fall back to a
  // juxtaposed cadence ("every two minutes", "every two years"), which reads
  // as a second, conflicting frequency. The year form also drops the comma the
  // minute form has — a symptom of the same wrong framing, not a separate bug.
  it('confines a stepped minute under a finer cadence, like the hour field',
    function() {
      expect(cronli5('* */2 * * * * *')).to.match(/every other minute/u);
    });

  it('confines a stepped year under a finer cadence, like the month field',
    function() {
      expect(cronli5('* * * * * * */2')).to.match(/every other year/u);
    });

  // gb (day-first) folds a single day before a multi-month list as a
  // garden-path: "on 13 January, April, July and October" reads as if the 13
  // attaches only to January. Pre-existing — affects any multi-month fold
  // (lists too, not just steps). The day must attach to the whole list.
  it('disambiguates the day in a gb day-first multi-month fold', function() {
    expect(cronli5('0 0 13 1,4,7,10 *', {dialect: 'gb'}))
      .to.not.match(/^on \d+ \w+,/u);
  });

  // A year range renders with a raw hyphen ("in 2030-2035") instead of the
  // dialect's range connective ("2030 through 2035") that every other field
  // uses — the year field skips it.
  it('renders a year range with the through connective, not a hyphen',
    function() {
      expect(cronli5('0 0 1 1 * 2030-2035', {years: true}))
        .to.not.match(/\d-\d/u);
    });
});
