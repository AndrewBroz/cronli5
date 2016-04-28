var explain = require('../..').explain;
var expect = require('chai').expect;
var errors = require('../error-types');

describe('Invalid arrays:', function() {
  throws([], errors.empty);

  throws(['*', '*', '*', '*', '*', '*', '*'], errors.length);

  throws(['*', '*', '*', '*', 7], errors.invalidField);

  throws([-33, '*', '*', '*', '*'], errors.invalidField);

  throws(['*', 'a', '*', '*', '*'], errors.invalidField);

  throws(['CAT', '*', '*', '*', '*', '*'], errors.invalidField);

  throws(['*', '*', 'hamburger', '*', '*'], errors.invalidField);

  throws(['*', '*', '*', '/', '*'], errors.invalidField);

  throws(['//', '*', '*', '*', '*'], errors.invalidField);

  throws(['*', '-', '*', '*', '*'], errors.invalidField);

  throws(['*', '*', '*', '*', '--'], errors.invalidField);

  throws([',', '*', '*', '*', '*'], errors.invalidField);

  throws(['*', '*', '*', '*', '*', ',,'], errors.invalidField);

  throws(['*', '*', '*', '*', {}], errors.invalidField);

  throws(['*', new Date(), '*', '*', '*', '*'], errors.invalidField);

  throws(['*', '*', '*', new Error('*'), '*', '*'], errors.invalidField);
});

function throws(badArray, errorText) {
  describe(JSON.stringify(badArray), function() {
    it('should throw an error', function() {
      expect(explain.bind(null, badArray)).to.throw(Error);
    });

    it('should throw "' + errorText + '".', function() {
      expect(explain.bind(null, [])).to.throw(errorText);
    });
  });
}
