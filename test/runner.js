import chai from 'chai';
import cronli5 from '../src/cronli5.js';

const {expect} = chai;

// Runner
export function run(tests, defaultExpected) {
  tests.forEach(function(values) {
    var cronable = values[0];
    var expected = values[1] || defaultExpected;
    var options = values[2];

    equal(cronable, expected, options);
  });
}

export function error(tests, defaultErrorText) {
  tests.forEach(function(inputAndError) {
    if (!(inputAndError instanceof Array)) {
      inputAndError = [inputAndError];
    }

    var badInput = inputAndError[0];
    var errorText = inputAndError[1] || defaultErrorText;
    var options = inputAndError[2];

    throwsError(badInput, errorText, options);
  });
}

// Stable, always-string suite title (JSON.stringify(undefined) is undefined).
function title(value) {
  return JSON.stringify(value) + '';
}

// Check that the output matches the input for a given cron pattern.
function equal(cronable, expected, options) {
  describe(title(cronable), function() {
    it('should be "' + expected + '"', function() {
      expect(cronli5(cronable, options)).to.equal(expected);
    });
  });
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
