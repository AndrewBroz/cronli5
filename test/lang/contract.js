import chai from 'chai';
import de from '../../src/lang/de/index.js';
import en from '../../src/lang/en/index.js';
import es from '../../src/lang/es/index.js';
import fi from '../../src/lang/fi/index.js';
import fr from '../../src/lang/fr/index.js';
import pt from '../../src/lang/pt/index.js';
import zh from '../../src/lang/zh/index.js';

const {expect} = chai;

// The Language contract's non-describe members are options-aware: `reboot`,
// `fallback`, and `sentence` receive the normalized options, so a dialect
// that changes whole words (zh-Hant) flows through the arguments instead of
// module state.

describe('Language contract: options-aware reboot/fallback/sentence', function() {
  const languages = {de, en, es, fi, fr, pt, zh};

  Object.entries(languages).forEach(function each([code, lang]) {
    it(code + ' serves them from the opts it is given', function() {
      const opts = lang.options();

      expect(lang.reboot(opts)).to.be.a('string').that.is.not.empty;
      expect(lang.fallback(opts)).to.be.a('string').that.is.not.empty;
      expect(lang.sentence('x', opts)).to.be.a('string').that.is.not.empty;
    });
  });

  // The hazard the options-aware contract removes: with a module-private
  // latch, the most recent options() call decided the variant, so opts
  // resolved earlier could be served the wrong dialect.
  it('zh honors the opts it is given, not the last options() call',
    function() {
      const hant = zh.options({dialect: 'zh-Hant'});

      // An unrelated render resolving the default (Simplified) in between.
      zh.options();

      expect(zh.reboot(hant)).to.equal('系統啟動時');
      expect(zh.fallback(hant)).to.equal('無法識別的 cron 表達式');
      expect(zh.sentence('每分鐘', hant)).to.equal('運行時間：每分鐘。');
    });
});
