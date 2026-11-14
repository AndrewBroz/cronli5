import chai from 'chai';
import cronli5, {Cronli5OptionError, create} from '../../src/cronli5.js';
import en, * as enNamespace from '../../src/lang/en/index.js';
import {styles} from '../../src/lang/en/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// Nothing a caller passes is ignored or met with a raw TypeError: found by
// an independent review of the finished API.
describe('Strictness:', function() {
  it('refuses a `lang` that is not a language, saying what one is',
    function() {
      [{}, styles, [], enNamespace].forEach(function each(lang) {
        throwsOption(function describeIt() {
          cronli5('0 9 * * *', {lang});
        }, /default export/u);
      });
      throwsOption(function describeIt() {
        cronli5('0 9 * * *', {lang: null});
      }, /lang/u);
    });

  it('refuses `languages` that are not languages', function() {
    [['en'], [null], [{}], [enNamespace], 'en'].forEach(function each(list) {
      throwsOption(function build() {
        create({languages: list});
      }, /languages/u);
    });
  });

  it('tells a language this instance lacks from one cronli5 does not ship',
    function() {
      const none = create({languages: [{...en, code: 'xx', regions: {}}]});

      throwsOption(function describeIt() {
        none('0 9 * * *', {lang: 'en'});
      }, /cronli5\/lang\/en.*cronli5\/all/su);
      throwsOption(function describeIt() {
        cronli5('0 9 * * *', {lang: 'tlh'});
      }, /does not ship 'tlh'.*ships: en/su);
      expect(function describeIt() {
        cronli5('0 9 * * *', {lang: 'tlh'});
      }).to.not.throw(/import tlh/u);
    });

  it('refuses a code that is not shaped like one', function() {
    ['-GB', '__proto__', 'e', 'english!', 'en-'].forEach(function each(lang) {
      throwsOption(function describeIt() {
        cronli5('0 9 * * *', {lang});
      }, /language code/u);
    });
    throwsOption(function build() {
      create({languages: [en], styles: {'en-GB': {}}});
    }, /language code|styles/u);
  });

  it('treats an option given as undefined as not given', function() {
    const labels = create({
      languages: [en],
      options: {form: 'label', lang: 'en-GB'}
    });
    const user = {};

    expect(labels('30 9 * * *', {form: user.form, lang: user.locale}))
      .to.equal('At 9.30am every day');
    expect(cronli5('0 9 * * *', {cron: user.cron, style: user.style}))
      .to.equal('at 9 a.m. every day');
  });

  it('refuses options that are not a table of options', function() {
    [42, true, 'sentence', ['form'], function noop() {
      return null;
    }].forEach(function each(options) {
      throwsOption(function describeIt() {
        cronli5('0 9 * * *', options);
      }, /options/u);
    });
    expect(cronli5('0 9 * * *', null)).to.equal('at 9 a.m. every day');
  });

  it('refuses null where an option takes a value', function() {
    ['cron', 'form', 'seconds', 'lenient'].forEach(function each(name) {
      throwsOption(function describeIt() {
        cronli5('0 9 * * *', {[name]: null});
      }, new RegExp(name, 'u'));
    });
  });

  it('refuses a style that is not a plain table', function() {
    [new Map([['hour12', false]]), [], new Date()].forEach(
      function each(style) {
        throwsOption(function describeIt() {
          cronli5('0 9 * * *', {style});
        }, /style/u);
      }
    );
  });

  it('keeps its own copy of the languages it was made with', function() {
    const languages = [en];
    const describeIt = create({languages});

    languages.length = 0;

    expect(describeIt('0 9 * * *')).to.equal('at 9 a.m. every day');
  });

  it('the named styles cannot be replaced from outside', function() {
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.keys(styles).sort()).to.deep.equal(['gb', 'house', 'us']);
  });
});
