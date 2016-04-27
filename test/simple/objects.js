var explain = require('../..').explain;
var expect = require('chai').expect;

describe('Simple valid cron-like objects:', function() {
  equal({second: '*'}, 'every second');

  equal({minute: '*'}, 'every minute');

  equal({hour: '*'}, 'every hour');
});

// Check that the output matches the input for a given cron object.
function equal(cronObject, expected) {
  describe(JSON.stringify(cronObject), function() {
    it('should return a string', function() {
      expect(explain(cronObject)).to.be.an('string');
    });

    it('should not be an empty object', function() {
      expect(explain(cronObject)).to.not.be.empty;
    });

    it('should be "' + expected + '"', function() {
      expect(explain(cronObject)).to.equal(expected);
    });
  });
}
