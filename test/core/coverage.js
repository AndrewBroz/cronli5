import chai from 'chai';
import {readFileSync} from 'node:fs';
import {Cronli5InputError, analyze, prepare} from '../../src/core/index.js';
import {coreSetSeeds, optionsFor}
  from '../../tooling/scripts/edit-diff.mjs';

const {expect} = chai;

// The fixed core pattern set (test/core/core-set.json) seeds the continuity
// and divergence checks. It is a committed, static set; these checks hold
// it to the core alone: every pattern it carries is one the core accepts
// and analyzes, and every input it calls invalid is one the core rejects.

const CORE = JSON.parse(readFileSync('test/core/core-set.json', 'utf8'));

function analyzed(pattern, options) {
  return analyze(prepare(pattern, {
    lenient: false, quartz: false, seconds: false, years: false, ...options
  }));
}

describe('Core pattern set:', function() {
  it('names each pattern once', function() {
    expect(new Set(CORE.patterns).size).to.equal(CORE.patterns.length);
    expect(CORE.patterns).to.have.length(CORE.cells);
  });

  it('holds only patterns the core analyzes', function() {
    coreSetSeeds().forEach(function each(seed) {
      expect(analyzed(seed.pattern, seed.options).analyses, seed.pattern)
        .to.be.an('object');
    });
  });

  it('holds only spanning, value-class and variant patterns the core ' +
    'analyzes', function() {
    CORE.spanning
      .concat(CORE.valueClasses.map((entry) => entry.pattern))
      .concat(CORE.variants.map((entry) => entry.pattern))
      .forEach(function each(pattern) {
        expect(analyzed(pattern, optionsFor(pattern)).analyses, pattern)
          .to.be.an('object');
      });
  });

  it('holds only invalid inputs the core rejects', function() {
    CORE.invalid.forEach(function each(input) {
      expect(function attempt() {
        analyzed(input);
      }, input).to.throw(Cronli5InputError);
    });
  });
});
