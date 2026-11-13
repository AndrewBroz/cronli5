import chai from 'chai';
import cronli5, {Cronli5InputError, Cronli5OptionError}
  from '../../src/cronli5.js';
import en, {styles} from '../../src/lang/en/index.js';

const {expect} = chai;

function throwsOption(options, pattern) {
  expect(function describeIt() {
    cronli5('0 9 * * *', options);
  }, JSON.stringify(options)).to.throw(Cronli5OptionError, pattern);
}

describe('The options:', function() {
  describe('form', function() {
    it('is a fragment unless asked otherwise', function() {
      expect(cronli5('0 9 * * *')).to.equal('at 9 a.m. every day');
      expect(cronli5('0 9 * * *', {form: 'fragment'}))
        .to.equal('at 9 a.m. every day');
    });

    it('is a capitalised label or a whole sentence', function() {
      expect(cronli5('0 9 * * *', {form: 'label'}))
        .to.equal('At 9 a.m. every day');
      expect(cronli5('0 9 * * *', {form: 'sentence'}))
        .to.equal('Runs at 9 a.m. every day.');
      expect(cronli5('@reboot', {form: 'label'})).to.equal('At system startup');
      expect(cronli5('@reboot', {form: 'sentence'}))
        .to.equal('Runs at system startup.');
    });

    it('rejects any other form', function() {
      throwsOption({form: 'title'}, /form/u);
    });
  });

  describe('lang', function() {
    it('takes a code, with a region in any common spelling', function() {
      expect(cronli5('30 9 * * *', {lang: 'en'}))
        .to.equal('at 9:30 a.m. every day');
      expect(cronli5('30 9 * * *', {lang: 'en-GB'}))
        .to.equal('at 9.30am every day');
      expect(cronli5('30 9 * * *', {lang: 'EN_gb'}))
        .to.equal('at 9.30am every day');
      expect(cronli5('30 9 * * *', {lang: 'en-US'}))
        .to.equal('at 9:30 a.m. every day');
    });

    it('describes an unknown region in the language\'s default style',
      function() {
        expect(cronli5('30 9 * * *', {lang: 'en-AU'}))
          .to.equal('at 9:30 a.m. every day');
      });

    it('takes a module, as before', function() {
      expect(cronli5('30 9 * * *', {lang: en}))
        .to.equal('at 9:30 a.m. every day');
      expect(cronli5('30 9 * * *', {lang: en, style: styles.gb}))
        .to.equal('at 9.30am every day');
    });

    it('rejects a language it does not have, saying what it does have',
      function() {
        throwsOption({lang: 'tlh'}, /does not ship 'tlh'/u);
        throwsOption({lang: 'tlh', lenient: true}, /ships: en/u);
        throwsOption({lang: 'uk'}, /cronli5\/lang\/uk.*cronli5\/all/su);
        throwsOption({lang: ''}, /lang/u);
        throwsOption({lang: 5}, /lang/u);
      });
  });

  describe('style', function() {
    it('overrides fields of the selected table', function() {
      expect(cronli5('30 17 * * *', {style: {hour12: false}}))
        .to.equal('at 17:30 every day');
      expect(cronli5('30 17 * * *', {lang: 'en-GB', style: {hour12: false}}))
        .to.equal('at 17.30 every day');
      expect(cronli5('0 9 * 6 1', {style: {short: true}}))
        .to.equal('at 9 a.m. on Mon in Jun');
      expect(cronli5('0 9 * * *', {style: styles.house}))
        .to.equal('at 9 AM every day');
      expect(cronli5('30 17 * * *', {style: {...styles.house, hour12: false}}))
        .to.equal('at 17:30 every day');
    });

    it('rejects a field the language does not have, or a wrong value',
      function() {
        throwsOption({style: {hour24: true}}, /hour24/u);
        throwsOption({style: {am: null, through: 5}});
        throwsOption({style: 'gb'}, /style/u);
      });
  });

  describe('how the pattern is read', function() {
    it('takes a flavour and separate flags', function() {
      expect(cronli5('0 0 ? * 2', {cron: 'quartz'}))
        .to.equal('at midnight on Mondays');
      expect(cronli5('0 0 * * 2', {weekdaysFrom: 1}))
        .to.equal('at midnight on Mondays');
      expect(cronli5('0 0 ? * 1', {questionMark: 'allow'}))
        .to.equal('at midnight on Mondays');
      expect(cronli5('0 0 9 * * *', {seconds: true}))
        .to.equal('at 9 a.m. every day');
      expect(cronli5('0 9 * * * 2030', {years: true}))
        .to.equal('at 9 a.m. every day in 2030');
    });

    it('rejects a flavour or flag value it does not know', function() {
      throwsOption({cron: 'spring'}, /quartz/u);
      throwsOption({weekdaysFrom: 2});
      throwsOption({questionMark: 'maybe'});
    });
  });

  describe('lenient', function() {
    it('turns a bad pattern into the fallback, in any form', function() {
      expect(cronli5('nonsense', {lenient: true}))
        .to.equal('an unrecognizable cron pattern');
      expect(cronli5('nonsense', {form: 'sentence', lenient: true}))
        .to.equal('an unrecognizable cron pattern');
      expect(function strict() {
        cronli5('nonsense');
      }).to.throw(Cronli5InputError);
    });

    it('never hides a bad option', function() {
      throwsOption({lenient: true, style: {nope: 1}});
      throwsOption({cron: 'spring', lenient: true});
      throwsOption({lenient: 'yes'}, /lenient/u);
    });
  });

  describe('options that 1.0 removed', function() {
    [
      ['dialect', 'gb', /lang: 'en-GB'/u],
      ['ampm', false, /hour12/u],
      ['short', true, /style: \{short: true\}/u],
      ['sentence', true, /form: 'sentence'/u],
      ['quartz', true, /cron: 'quartz'/u]
    ].forEach(function each([name, value, message]) {
      it(`${name} is an error that names its replacement`, function() {
        throwsOption({[name]: value}, message);
      });
    });

    it('any other unknown option is an error that lists the options',
      function() {
        throwsOption({colour: 1}, /colour.*lang/su);
      });

    it('the convenience methods are gone', function() {
      expect(cronli5.sentence).to.be.an('undefined');
      expect(cronli5.fragment).to.be.an('undefined');
    });
  });

  describe('pattern forms', function() {
    it('still takes an array or an object of fields', function() {
      expect(cronli5(['0', '9', '*', '*', '*']))
        .to.equal('at 9 a.m. every day');
      expect(cronli5({hour: 9, minute: 0})).to.equal('at 9 a.m. every day');
    });
  });
});
