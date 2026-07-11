import chai from 'chai';
import cronli5 from '../src/cronli5.js';

const {expect} = chai;

// Collect mode: when tooling/scripts/corpus-lint.mjs installs a harvest sink,
// prose rows are recorded for the oracle-directed corpus checks instead of
// registering renderer assertions (the lint validates the corpus against
// itself and the core semantics, never against a renderer).
function sink() {
  return globalThis.cronli5CorpusSink || null;
}

// Runner
export function run(tests, defaultExpected) {
  tests.forEach(function(values) {
    const cronable = values[0];
    const expected = values[1] || defaultExpected;
    const options = values[2];

    equal(cronable, expected, options);
  });
}

// A language corpus's row runner: binds the language module and the localized
// it-title — the only two ways the per-language corpus helpers ever differed —
// and accepts the per-block shared defaults some corpora pass. Rows honor
// collect mode exactly as run() does.
export function makeRun(lang, reads) {
  return function corpusRun(cases, shared) {
    cases.forEach(function each(values) {
      const cronable = values[0];
      const expected = values[1];
      const options = {...shared || {}, ...values[2] || {}, lang};

      if (sink()) {
        sink().push({cronable, expected, options});

        return;
      }

      describe(JSON.stringify(cronable), function() {
        it(reads(expected), function() {
          expect(cronli5(cronable, options)).to.equal(expected);
        });
      });
    });
  };
}

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

// Check that the output matches the input for a given cron pattern.
function equal(cronable, expected, options) {
  if (sink()) {
    sink().push({cronable, expected, options: options || {}});

    return;
  }

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
