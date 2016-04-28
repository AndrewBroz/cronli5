var cronli5 = require('../../..');
var expect = require('chai').expect;

describe('Simple valid strings:', function() {
  describe('5-part strings', function() {
    equal('*/2 * * * *', 'every two minutes');

    equal('0/2 * * * *', 'every two minutes');

    equal('*/3 * * * *', 'every three minutes');

    equal('0/3 * * * *', 'every three minutes');

    equal('2/3 * * * *', 'every three minutes from two minutes past the hour');

    equal('*/4 * * * *', 'every four minutes past the hour');

    equal('0/4 * * * *', 'every four minutes past the hour');

    equal('*/5 * * * *', 'every five minutes');

    equal('0/5 * * * *', 'every five minutes');

    equal('*/7 * * * *', 'every seven minutes past the hour');

    equal('0/7 * * * *', 'every seven minutes past the hour');

    equal('*/10 * * * *', 'every ten minutes');

    equal('*/17 * * * *', 'every 17 minutes past the hour');

    equal('*/20 * * * *', 'every 20 minutes');

    equal('17/20 * * * *', 'at 17, 37 and 57 minutes past the hour');

    equal('*/21 * * * *', 'every 21 minutes past the hour');

    equal('*/30 * * * *', 'every 30 minutes');

    equal('*/31 * * * *', 'at zero and 31 minutes past the hour');

    equal('0 */2 * * *', 'every two hours');

    equal('0 */3 * * *', 'every three hours');

    equal('0 2/3 * * * *', 'every three hours from 2:00 AM');

    equal('0 */5 * * *', 'every five hours from midnight');

    equal('0 */7 * * *', 'every seven hours from midnight');

    equal('0 */8 * * *', 'every eight hours');

    equal('0 */10 * * *', 'at 10:00 AM and 8:00 PM');

    equal('0 */12 * * *', 'every 12 hours');

    equal('0 */17 * * *', 'at 12:00 AM and 5:00 PM');

    equal('0 */20 * * *', 'at 12:00 AM and 8:00 PM');

    equal('0 17/20 * * *', 'every 20 minutes past minute 17 of the hour');

    equal('0 */21 * * *', 'every 21 minutes past the hour');

    equal('0 */30 * * *', 'every 30 minutes');
  });

  describe('6-part strings', function() {
    equal('* * * * * *', 'every second');
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