import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';

const {expect} = chai;

// Known, still-open English semantic problems surfaced by the 7-field
// simple-output-class review (docs/backlog.md). Skipped until fixed: un-skip
// (skip -> describe), watch red, fix the renderer, watch green. English is
// stable, so any fix must leave all other en output byte-identical — the rest
// of the corpus is that guard. These assert the defect's invariant, not a
// final wording (which is chosen when the fix lands).
describe('Known issues (pending fix):', function() {

  // Under a seconds wildcard the leading "every second" makes every coarser
  // field a confinement joined by "of" (… of minute :00 of every hour, … of
  // every other minute, … of the midnight hour) — never a juxtaposed or
  // redundant second cadence ("every second, every hour"/"every two minutes").
  // The exact intended strings are in core-set.js; this guards the root-cause
  // invariant across the minute-0 / fixed / range / step family.
  it('confines coarser fields with "of" under a seconds wildcard', function() {
    ['* 0 * * * * *', '* 1 * * * * *', '* */2 * * * * *', '* * 0 * * * *']
      .forEach((p) => expect(cronli5(p), p).to.match(/ of /u));
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

  // A stepped year coarser than the leading cadence is a confinement, like the
  // month ("…in every other month"), but falls back to a juxtaposed cadence
  // ("every second every two years") and drops the comma the minute form has.
  // (The stepped-minute case is covered by the seconds-confinement test above.)
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
