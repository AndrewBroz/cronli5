import chai from 'chai';
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

const {expect} = chai;

// What every language module declares, so the entry point can find it by
// code, pick a regional style, and present a description in each form.

describe('Language contract:', function() {
  const languages = [en, cs, de, es, fr, italian, ja, pt, uk, zh];

  languages.forEach(function each(lang) {
    describe(lang.code, function() {
      const opts = {style: lang.style(lang.defaultStyle)};

      it('has a lower-case code', function() {
        expect(lang.code).to.match(/^[a-z]{2,3}$/u);
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
