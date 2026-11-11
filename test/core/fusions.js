import chai from 'chai';
import {analyze, clockTimes, prepare} from '../../src/core/index.js';

const {expect} = chai;

function times(pattern, limit) {
  const opts = {quartz: false, seconds: false, years: false};

  return clockTimes(analyze(prepare(pattern, opts)), limit);
}

// A fusion is where two fields are said as one phrase. Clock times are the
// one every language has: a minute set crossed with an hour set.
describe('clockTimes:', function() {
  it('crosses a minute set with an hour set', function() {
    const found = times('0,30 9,17 * * *', 6);

    expect(found.map(function clock(time) {
      return [time.hour, time.minute];
    })).to.deep.equal([[9, 0], [9, 30], [17, 0], [17, 30]]);
    found.forEach(function noSecond(time) {
      expect(typeof time.second).to.equal('undefined');
    });
  });

  it('is null past the limit, and for a whole field however it is written',
    function() {
      expect(times('0,30 9,17 * * *', 3)).to.equal(null);
      expect(times('* 9 * * *', 100)).to.equal(null);
      expect(times('0 * * * *', 100)).to.equal(null);
      expect(times('0-59 9 * * *', 100)).to.equal(null);
    });

  it('counts a stepped field by the values it fires on', function() {
    expect(times('*/30 */12 * * *', 6)).to.have.length(4);
  });

  it('carries a single second', function() {
    expect(times('15 30 9 * * *', 6)).to.deep.equal(
      [{hour: 9, minute: 30, second: 15}]);
  });
});
