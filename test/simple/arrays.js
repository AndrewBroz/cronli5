var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Simple valid arrays:', function() {
  describe('5-part arrays', function() {
    equal(['*', '*', '*', '*', '*'], 'every minute');

    equal(['0', '*', '*', '*', '*'], 'every hour');

    equal(['1', '*', '*', '*', '*'], 'one minute past the hour, every hour');

    equal(['5', '*', '*', '*', '*'], 'five minutes past the hour, every hour');

    equal(['10', '*', '*', '*', '*'], 'ten minutes past the hour, every hour');

    equal(['15', '*', '*', '*', '*'], '15 minutes past the hour, every hour');

    equal(['30', '*', '*', '*', '*'], '30 minutes past the hour, every hour');
  });

  describe('6-part arrays', function() {
    equal(['*', '*', '*', '*', '*', '*'], 'every second');

    equal(['0', '*', '*', '*', '*', '*'], 'every minute');

    equal(['1', '*', '*', '*', '*', '*'], 'one second past the minute, every minute');

    equal(['5', '*', '*', '*', '*', '*'], 'five seconds past the minute, every minute');

    equal(['10', '*', '*', '*', '*', '*'], 'ten seconds past the minute, every minute');

    equal(['15', '*', '*', '*', '*', '*'], '15 seconds past the minute, every minute');

    equal(['30', '*', '*', '*', '*', '*'], '30 seconds past the minute, every minute');

    equal(['0', '0', '*', '*', '*', '*'], 'every hour');

    equal(['0', '1', '*', '*', '*', '*'], 'one minute past the hour, every hour');

    equal(['0', '5', '*', '*', '*', '*'], 'five minutes past the hour, every hour');

    equal(['0', '10', '*', '*', '*', '*'], 'ten minutes past the hour, every hour');

    equal(['0', '15', '*', '*', '*', '*'], '15 minutes past the hour, every hour');

    equal(['0', '30', '*', '*', '*', '*'], '30 minutes past the hour, every hour');
  });
});

// Check that the output matches the input for a given cron string.
function equal(cronString, expected) {
  describe('"' + cronString + '"', function() {
    it('should return a string', function() {
      expect(cronli5(cronString)).to.be.a('string');
    });

    it('should not be an empty string', function() {
      expect(cronli5(cronString)).to.not.be.empty;
    });

    it('should be "' + expected + '"', function() {
      expect(cronli5(cronString)).to.equal(expected);
    });
  });
}
