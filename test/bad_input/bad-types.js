var cronli5 = require('../..');
var expect = require('chai').expect;
var errors = require('../error-types');

describe('Invalid types:', function() {
  throws(undefined, errors.empty); // eslint-disable-line no-undefined

  throws(null, errors.empty);

  describe('booleans', function() {
    throws(true);

    throws(false);
  });

  describe('integers', function() {
    throws(0);

    throws(1);

    throws(-1);

    throws(12345);

    throws(123456);

    throws(-1234);

    throws(-12345);

    throws(NaN);

    throws(Infinity);

    throws(-Infinity);
  });

  describe('Date', function() {
    throws(new Date());
  });

  describe('Error', function() {
    throws(new Error());
  });
});

function throws(badType, errorText) {
  describe(JSON.stringify(badType), function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, badType)).to.throw(Error);
    });

    if (errorText) {
      it('should throw "' + errorText + '".', function() {
        expect(cronli5.bind(null, badType)).to.throw(errorText);
      });
    }
  });
}
