import chai from 'chai';
import {create} from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';
import cs from '../../src/lang/cs/index.js';
import de from '../../src/lang/de/index.js';
import es from '../../src/lang/es/index.js';
import fr from '../../src/lang/fr/index.js';
import italian from '../../src/lang/it/index.js';
import ja from '../../src/lang/ja/index.js';
import pt from '../../src/lang/pt/index.js';
import uk from '../../src/lang/uk/index.js';
import zh from '../../src/lang/zh/index.js';
import zhHant from '../../src/lang/zh-hant/index.js';

const {expect} = chai;

// What every language module declares, so the entry point can find it by
// code, pick a regional style, and present a description in each form.

describe('Language contract:', function() {
  const languages = [en, cs, de, es, fr, italian, ja, pt, uk, zh, zhHant];

  languages.forEach(function each(lang) {
    describe(lang.code, function() {
      const opts = {style: lang.style(lang.defaultStyle)};

      it('has a lower-case code, with its script if it names one',
        function() {
          expect(lang.code).to.match(/^[a-z]{2,3}(?:-[A-Z][a-z]{3})?$/u);
        });

      it('is found by its code', function() {
        const describeIt = create({languages: [lang]});

        expect(describeIt('30 9 * * 1', {lang: lang.code}))
          .to.equal(describeIt('30 9 * * 1'));
      });

      it('has a default style, and every region names a style', function() {
        expect(lang.styles[lang.defaultStyle]).to.be.an('object');
        Object.entries(lang.regions).forEach(function region([code, name]) {
          expect(code, code).to.match(/^[A-Z]{2}$/u);
          expect(lang.styles[name], name).to.be.an('object');
        });
      });

      it('says each form, the startup text and the fallback', function() {
        expect(lang.reboot(opts)).to.be.a('string').that.is.not.empty;
        expect(lang.fallback(opts)).to.be.a('string').that.is.not.empty;
        expect(lang.sentence('x', opts)).to.be.a('string').that.is.not.empty;
        expect(lang.label('x', opts)).to.be.a('string').that.is.not.empty;
      });
    });
  });
});
