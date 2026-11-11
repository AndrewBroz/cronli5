import chai from 'chai';
import en from '../../src/lang/en/index.js';

const {expect} = chai;

// The Language contract's non-describe members are options-aware: `reboot`,
// `fallback`, and `sentence` receive the normalized options, so a dialect
// that changes whole words (zh-Hant) flows through the arguments instead of
// module state.

describe('Language contract: options-aware reboot/fallback/sentence', function() {
  const languages = {en};

  Object.entries(languages).forEach(function each([code, lang]) {
    it(code + ' serves them from the opts it is given', function() {
      const opts = lang.options();

      expect(lang.reboot(opts)).to.be.a('string').that.is.not.empty;
      expect(lang.fallback(opts)).to.be.a('string').that.is.not.empty;
      expect(lang.sentence('x', opts)).to.be.a('string').that.is.not.empty;
    });
  });
});
