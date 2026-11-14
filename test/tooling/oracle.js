import chai from 'chai';
import {analyze, denote, domainOf, prepare} from '../../src/core/index.js';
import en from '../../src/lang/en/index.js';
import {resolve} from '../../src/options.js';
import {patterns} from '../../scripts/fuzz-lang.mjs';
import {firesAt, timesOfDay} from '../../tooling/scripts/reading/oracle.mjs';

const {expect} = chai;

// A moment from [year, month, date] and [hour, minute, second].
function at(...parts) {
  const [year, month, date, hour, minute, second = 0] = parts;

  return {date, hour, minute, month, second, year};
}

// The same question answered from the core's analysis, for patterns with
// no Quartz forms: the two must agree, having no code in common.
function coreFiresAt(pattern, moment) {
  const {opts} = resolve({languages: [en], options: {}, styles: {}}, {});
  const {analyses} = analyze(prepare(pattern, opts));

  function has(field, value) {
    const candidates = analyses.candidates[field];

    return denote(candidates[candidates.length - 1], domainOf(field))
      .includes(value);
  }
  const weekday = new Date(Date.UTC(moment.year, moment.month - 1,
    moment.date)).getUTCDay();
  const {day} = analyses;
  const onDate = day.date ? has('date', moment.date) : true;
  const onWeekday = day.weekday ? has('weekday', weekday) : true;
  const onDay = day.union ? onDate || onWeekday : onDate && onWeekday;
  const real = new Date(Date.UTC(moment.year, moment.month - 1, moment.date))
    .getUTCMonth() === moment.month - 1;

  return real && onDay && has('second', moment.second) &&
    has('minute', moment.minute) && has('hour', moment.hour) &&
    has('month', moment.month) && has('year', moment.year);
}

describe('the firing oracle:', function() {
  it('reads plain fields, names, wrapping ranges and steps', function() {
    expect(firesAt('30 9 * * *', at(2030, 6, 3, 9, 30))).to.equal(true);
    expect(firesAt('30 9 * * *', at(2030, 6, 3, 9, 31))).to.equal(false);
    expect(firesAt('*/15 22-2 * * *', at(2030, 6, 3, 1, 45))).to.equal(true);
    expect(firesAt('*/15 22-2 * * *', at(2030, 6, 3, 3, 0))).to.equal(false);
    expect(firesAt('0 9 * JUN MON', at(2030, 6, 3, 9, 0))).to.equal(true);
    expect(firesAt('0 9 * * 7', at(2030, 6, 2, 9, 0))).to.equal(true);
    expect(firesAt('5/20 * * * *', at(2030, 6, 3, 4, 45))).to.equal(true);
    expect(firesAt('5/20 * * * *', at(2030, 6, 3, 4, 46))).to.equal(false);
  });

  it('reads seconds first and a year last', function() {
    expect(firesAt('30 0 9 * * *', at(2030, 6, 3, 9, 0, 30))).to.equal(true);
    expect(firesAt('30 0 9 * * *', at(2030, 6, 3, 9, 0, 0))).to.equal(false);
    expect(firesAt('0 9 * * * 2030', at(2030, 6, 3, 9, 0), {years: true}))
      .to.equal(true);
    expect(firesAt('0 0 9 * * * 2031', at(2030, 6, 3, 9, 0))).to.equal(false);
  });

  it('fires on either day field, or on both when one is starred',
    function() {
      // 1 June 2030 is a Saturday; 3 June a Monday; 4 June a Tuesday.
      expect(firesAt('0 9 1 * 1', at(2030, 6, 3, 9, 0))).to.equal(true);
      expect(firesAt('0 9 1 * 1', at(2030, 6, 1, 9, 0))).to.equal(true);
      expect(firesAt('0 9 */2 * 1', at(2030, 6, 3, 9, 0))).to.equal(true);
      expect(firesAt('0 9 */2 * 1', at(2030, 6, 10, 9, 0))).to.equal(false);
      expect(firesAt('0 9 */2 * 1', at(2030, 6, 5, 9, 0))).to.equal(false);
    });

  it('reads the Quartz day forms', function() {
    expect(firesAt('0 9 L * *', at(2030, 6, 30, 9, 0))).to.equal(true);
    expect(firesAt('0 9 L-2 * *', at(2030, 6, 28, 9, 0))).to.equal(true);
    // 15 June 2030 is a Saturday: the nearest weekday is Friday the 14th.
    expect(firesAt('0 9 15W * *', at(2030, 6, 14, 9, 0))).to.equal(true);
    expect(firesAt('0 9 15W * *', at(2030, 6, 15, 9, 0))).to.equal(false);
    // 1 June 2030 is a Saturday: 1W moves forward to Monday the 3rd.
    expect(firesAt('0 9 1W * *', at(2030, 6, 3, 9, 0))).to.equal(true);
    // 30 June 2030 is a Sunday: LW is Friday the 28th.
    expect(firesAt('0 9 LW * *', at(2030, 6, 28, 9, 0))).to.equal(true);
    expect(firesAt('0 9 * * 5L', at(2030, 6, 28, 9, 0))).to.equal(true);
    expect(firesAt('0 9 * * 5L', at(2030, 6, 21, 9, 0))).to.equal(false);
    expect(firesAt('0 9 * * 1#2', at(2030, 6, 10, 9, 0))).to.equal(true);
    expect(firesAt('0 9 31 * *', at(2030, 6, 31, 9, 0))).to.equal(false);
  });

  it('reads year ranges that run past the end of the century', function() {
    const pattern = '0 0 9 * * * 1970-2029,2031-2040,2042-9999';

    expect(firesAt(pattern, at(2030, 1, 13, 9, 0))).to.equal(false);
    expect(firesAt(pattern, at(2031, 1, 13, 9, 0))).to.equal(true);
    expect(firesAt(pattern, at(2041, 1, 13, 9, 0))).to.equal(false);
    expect(firesAt(pattern, at(2150, 1, 13, 9, 0))).to.equal(true);
  });

  it('lists the times of day in order', function() {
    expect(timesOfDay('0,30 9,17 * * *')).to.deep.equal(
      [[9, 0, 0], [9, 30, 0], [17, 0, 0], [17, 30, 0]]);
  });

  it('agrees with the core on every plain pattern it is shown', function() {
    const plain = patterns().filter((pattern) => !(/[LW#?]/u).test(pattern));
    const sample = plain.filter((_, index) => index % 37 === 0);
    const disagreements = [];

    sample.forEach(function check(pattern, index) {
      const times = timesOfDay(pattern);
      const moments = [0, 1, 2, 3].map(function pick(offset) {
        const [hour, minute, second] = times[(index + offset * 7) %
          times.length];
        const month = 1 + (index + offset) % 12;
        const date = 1 + (index * 3 + offset * 11) % 31;

        return at(2030 + offset % 2, month, date, hour, minute, second);
      });

      moments.push(at(2030, 1 + index % 12, 1 + index % 28, index % 24,
        index % 60, index % 7 * 10));
      moments.forEach(function compare(moment) {
        if (firesAt(pattern, moment) !== coreFiresAt(pattern, moment)) {
          disagreements.push(`${pattern} at ${JSON.stringify(moment)}`);
        }
      });
    });

    expect(sample.length).to.be.greaterThan(1000);
    expect(disagreements.slice(0, 5)).to.deep.equal([]);
  // Thousands of patterns, each analysed by the core: slow under the full
  // suite's load.
  }, 120000);
});
