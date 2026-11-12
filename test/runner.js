import chai from 'chai';
import cronli5 from '../src/cronli5.js';

const {expect} = chai;

export function error(tests, defaultErrorText) {
  tests.forEach(function(inputAndError) {
    if (!(inputAndError instanceof Array)) {
      inputAndError = [inputAndError];
    }

    const badInput = inputAndError[0];
    const errorText = inputAndError[1] || defaultErrorText;
    const options = inputAndError[2];

    throwsError(badInput, errorText, options);
  });
}

// Stable, always-string suite title (JSON.stringify(undefined) is undefined).
function title(value) {
  return JSON.stringify(value) + '';
}

// Check that bad input throws the expected error.
function throwsError(badInput, errorText, options) {
  describe(title(badInput), function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, badInput, options)).to.throw(Error);
    });

    if (errorText) {
      it('should throw "' + errorText + '".', function() {
        expect(cronli5.bind(null, badInput, options)).to.throw(errorText);
      });
    }
  });
}
