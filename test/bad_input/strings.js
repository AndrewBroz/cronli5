var cronli5 = require('../..');
var expect = require('chai').expect;
var errors = require('../error-types');

describe('Invalid strings:', function() {
  throws('', errors.empty);

  throws('* * * * * * * * * * *', errors.length);

  throws('%%% & ### 33a idfa', errors.invalidField);
});

function throws(badString, errorText) {
  describe(JSON.stringify(badString), function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, badString)).to.throw(Error);
    });

    it('should throw "' + errorText + '".', function() {
      expect(cronli5.bind(null, badString)).to.throw(errorText);
    });
  });
}
