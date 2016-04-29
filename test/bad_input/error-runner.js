var cronli5 = require('../..');
var expect = require('chai').expect;

module.exports = {
  run: function runErrorTests(tests, defaultErrorText) {
    tests.forEach(function(inputAndError) {
      if (!(inputAndError instanceof Array)) {
        inputAndError = [inputAndError];
      }

      var badInput = inputAndError[0];
      var errorText = inputAndError[1] || defaultErrorText;

      throwsError(badInput, errorText);
    });
  }
};

function throwsError(badInput, errorText) {
  describe(JSON.stringify(badInput), function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, badInput)).to.throw(Error);
    });

    if (errorText) {
      it('should throw "' + errorText + '".', function() {
        expect(cronli5.bind(null, badInput)).to.throw(errorText);
      });
    }
  });
}
