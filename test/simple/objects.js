var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Simple valid cron-like objects:', function() {
  equal({second: '*'}, 'every second');

  equal({second: '1'}, 'one second past the minute, every minute');

  equal({second: '5'}, 'five seconds past the minute, every minute');

  equal({second: '10'}, 'ten seconds past the minute, every minute');

  equal({second: '15'}, '15 seconds past the minute, every minute');

  equal({second: '30'}, '30 seconds past the minute, every minute');

  equal({minute: '*'}, 'every minute');

  equal({minute: '1'}, 'one minute past the hour, every hour');

  equal({minute: '5'}, 'five minutes past the hour, every hour');

  equal({minute: '10'}, 'ten minutes past the hour, every hour');

  equal({minute: '15'}, '15 minutes past the hour, every hour');

  equal({minute: '30'}, '30 minutes past the hour, every hour');

  equal({hour: '*'}, 'every hour');
});

// Check that the output matches the input for a given cron object.
function equal(cronObject, expected) {
  describe(JSON.stringify(cronObject), function() {
    it('should return a string', function() {
      expect(cronli5(cronObject)).to.be.an('string');
    });

    it('should not be an empty object', function() {
      expect(cronli5(cronObject)).to.not.be.empty;
    });

    it('should be "' + expected + '"', function() {
      expect(cronli5(cronObject)).to.equal(expected);
    });
  });
}
