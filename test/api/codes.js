import chai from 'chai';
import cronli5, {Cronli5OptionError, create} from '../../src/cronli5.js';
import {claimed, scripts, shipped} from '../../src/languages.js';
import en from '../../src/lang/en/index.js';
import everyLanguage from '../../src/all.js';
import zh from '../../src/lang/zh/index.js';
import zhHant from '../../src/lang/zh-hant/index.js';
import {vi} from 'vitest';

const {expect} = chai;

const pattern = '30 17 * * 1';

// What each module says, asked for as a module: the codes below must
// select the same module and style.
const simplified = cronli5(pattern, {lang: zh});
const taiwan = cronli5(pattern, {lang: zhHant});
const hongKong = cronli5(pattern, {lang: zhHant, style: zhHant.styles.hk});

function said(describeIt, lang) {
  return describeIt(pattern, {lang});
}

function throwsOption(build, message) {
  expect(build).to.throw(Cronli5OptionError, message);
}

// A language written in a script of its own, under a code the library
// does not ship: English under another name, with one region.
const cyrillic = {
  ...en,
  code: 'sr-Cyrl',
  regions: {BA: 'gb'},
  sentence(description) {
    return `CYRL ${description}`;
  }
};
const serbian = {
  ...en,
  code: 'sr',
  regions: {ME: 'gb'},
  sentence(description) {
    return `SR ${description}`;
  }
};

describe('Language codes:', function() {
  it('the three texts differ, so a code is seen to choose among them',
    function() {
      expect(new Set([simplified, taiwan, hongKong]).size).to.equal(3);
    });

  describe('with a script', function() {
    it('names the language written in that script', function() {
      ['zh-Hant', 'zh-hant', 'ZH_HANT', 'zh-Hant-x-private'].forEach(
        function each(code) {
          expect(said(everyLanguage, code), code).to.equal(taiwan);
        }
      );
    });

    it('takes the style of a region the language knows, or its default',
      function() {
        expect(said(everyLanguage, 'zh-Hant-TW')).to.equal(taiwan);
        expect(said(everyLanguage, 'zh_hant_tw')).to.equal(taiwan);
        expect(said(everyLanguage, 'zh-Hant-HK')).to.equal(hongKong);
        expect(said(everyLanguage, 'zh-Hant-MO')).to.equal(hongKong);
        expect(said(everyLanguage, 'zh-Hant-US')).to.equal(taiwan);
        expect(said(everyLanguage, 'zh-Hant-419')).to.equal(taiwan);
      });

    it('finds a language the library does not ship, given to an instance',
      function() {
        const describeIt = create({languages: [serbian, cyrillic]});

        expect(describeIt('30 9 * * *', {form: 'sentence', lang: 'sr-cyrl'}))
          .to.equal('CYRL at 9:30 a.m. every day');
        expect(describeIt('30 9 * * *',
          {form: 'sentence', lang: 'SR_CYRL_BA'}))
          .to.equal('CYRL at 9.30am every day');
        expect(describeIt('30 9 * * *', {form: 'sentence', lang: 'sr'}))
          .to.equal('SR at 9:30 a.m. every day');
      });

    it('that the library does not ship is read as if it were not there',
      function() {
        const describeIt = create({languages: [serbian, zh, zhHant]});

        expect(said(describeIt, 'zh-Latn')).to.equal(simplified);
        expect(said(describeIt, 'zh-Latn-TW')).to.equal(taiwan);
        expect(describeIt('30 9 * * *', {form: 'sentence', lang: 'sr-Cyrl'}))
          .to.equal('SR at 9:30 a.m. every day');
        expect(describeIt('30 9 * * *',
          {form: 'sentence', lang: 'sr-Cyrl-ME'}))
          .to.equal('SR at 9.30am every day');
      });

    it('that a language is written in by default names that language',
      function() {
        expect(said(everyLanguage, 'zh-Hans')).to.equal(simplified);
        expect(said(everyLanguage, 'zh-Hans-CN')).to.equal(simplified);
        expect(said(everyLanguage, 'zh_hans_sg')).to.equal(simplified);
        // The script is stated, so a region does not choose another.
        expect(said(everyLanguage, 'zh-Hans-TW')).to.equal(simplified);
        expect(said(create({languages: [zh]}), 'zh-Hans'))
          .to.equal(simplified);
      });
  });

  describe('with a region and no script', function() {
    it('goes to the script variant that claims the region', function() {
      expect(said(everyLanguage, 'zh-TW')).to.equal(taiwan);
      expect(said(everyLanguage, 'zh_tw')).to.equal(taiwan);
      expect(said(everyLanguage, 'zh-HK')).to.equal(hongKong);
      expect(said(everyLanguage, 'zh-MO')).to.equal(hongKong);
    });

    it('goes to the plain language otherwise, as before', function() {
      expect(said(everyLanguage, 'zh-CN')).to.equal(simplified);
      expect(said(everyLanguage, 'zh-SG')).to.equal(simplified);
      expect(said(everyLanguage, 'zh-US')).to.equal(simplified);
      expect(everyLanguage('30 9 * * *', {lang: 'en-GB'}))
        .to.equal('at 9.30am every day');
    });

    it('asks the instance\'s own languages which regions they claim',
      function() {
        const describeIt = create({languages: [serbian, cyrillic]});

        expect(describeIt('30 9 * * *', {form: 'sentence', lang: 'sr-BA'}))
          .to.equal('CYRL at 9.30am every day');
        expect(describeIt('30 9 * * *', {form: 'sentence', lang: 'sr-ME'}))
          .to.equal('SR at 9.30am every day');
        expect(describeIt('30 9 * * *', {form: 'sentence', lang: 'sr-RS'}))
          .to.equal('SR at 9:30 a.m. every day');
      });
  });

  describe('with a language alone', function() {
    it('names the plain language in its default style', function() {
      expect(said(everyLanguage, 'zh')).to.equal(simplified);
      expect(said(everyLanguage, 'ZH')).to.equal(simplified);
    });

    it('never names a script variant', function() {
      throwsOption(function describeIt() {
        said(create({languages: [zhHant]}), 'zh');
      }, /does not have the language 'zh' .*cronli5\/lang\/zh'/su);
    });
  });

  describe('a script variant the instance was not given', function() {
    const withoutIt = create({languages: [zh]});

    it('is a language the instance does not have, never another script',
      function() {
        ['zh-Hant', 'zh-TW', 'zh-HK', 'zh_mo', 'zh-Hant-HK', 'zh-hant-us']
          .forEach(function each(code) {
            throwsOption(function describeIt() {
              said(withoutIt, code);
            }, /does not have the language 'zh-Hant' \(it has: zh\)/u);
          });
      });

    it('says how to import it', function() {
      throwsOption(function describeIt() {
        said(withoutIt, 'zh-TW');
      }, /import zhHant from 'cronli5\/lang\/zh-hant'.*cronli5\/all/su);
      throwsOption(function describeIt() {
        cronli5(pattern, {lang: 'zh-HK'});
      }, /'zh-Hant' \(it has: en\)/u);
    });

    it('is refused when the instance is made, as a default', function() {
      throwsOption(function build() {
        create({languages: [zh], options: {lang: 'zh-TW'}});
      }, /zh-Hant/u);
    });

    it('is reached by its own code and regions when it is all there is',
      function() {
        const only = create({languages: [zhHant]});

        expect(said(only, 'zh-Hant')).to.equal(taiwan);
        expect(said(only, 'zh-HK')).to.equal(hongKong);
        throwsOption(function describeIt() {
          said(only, 'zh-CN');
        }, /does not have the language 'zh'/u);
      });
  });

  it('says nothing on the console', function() {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => null);

    try {
      said(everyLanguage, 'zh-Hant');
      said(everyLanguage, 'zh-TW');
      expect(warn.mock.calls).to.deep.equal([]);
    }
    finally {
      warn.mockRestore();
    }
  });

  it('carries a default style for a script variant, by its code',
    function() {
      const describeIt = create({
        languages: [zh, zhHant],
        styles: {'zh-Hant': {hour12: true}}
      });

      expect(said(describeIt, 'zh-TW'))
        .to.equal(cronli5(pattern, {lang: zhHant, style: {hour12: true}}));
      expect(said(describeIt, 'zh')).to.equal(simplified);
      throwsOption(function build() {
        create({languages: [zh], styles: {'zh-Hant': {hour12: true}}});
      }, /does not have the language 'zh-Hant'/u);
      throwsOption(function build() {
        create({languages: [zh, zhHant], styles: {'zh-Hant-HK': {}}});
      }, /language code/u);
    });

  describe('what the library knows of codes without their modules',
    function() {
      it('ships every script variant it lists, and the module agrees',
        function() {
          const modules = {zh, 'zh-Hant': zhHant};

          expect(scripts.zh).to.deep.equal({Hans: 'zh', Hant: 'zh-Hant'});
          Object.values(scripts.zh).forEach(function each(code) {
            expect(shipped).to.include(code);
            expect(modules[code].code).to.equal(code);
          });
          Object.entries(claimed.zh).forEach(function each([region, code]) {
            expect(modules[code].regions, region).to.have.property(region);
          });
          expect(Object.keys(claimed.zh).sort())
            .to.deep.equal(Object.keys(zhHant.regions).sort());
        });
    });
});
