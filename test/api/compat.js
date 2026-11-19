import chai from 'chai';
import {readFileSync} from 'node:fs';
import {Cronli5InputError, Cronli5OptionError} from '../../src/cronli5.js';
import compat from '../../src/compat/index.js';
import cronli5 from '../../src/all.js';
import {table} from '../../src/compat/table.js';

const {expect} = chai;

function refuses(options, pattern) {
  expect(function describeIt() {
    compat.toString('0 9 * * *', options);
  }, JSON.stringify(options)).to.throw(Cronli5OptionError, pattern);
}

// The adapter takes cRonstrue's call and translates it: every option is
// mapped onto one of ours or refused. Its one addition is English's style:
// cRonstrue's clock ("09:00 AM", "12:00 PM") and its named days.
describe('The cRonstrue adapter:', function() {
  it('describes a pattern as a label, in cronli5\'s words', function() {
    expect(compat.toString('0 9 * * *')).to.equal('At 09:00 AM every day');
    expect(compat.toString('*/5 * * * *')).to.equal('Every 5 minutes');
  });

  it('writes English as cRonstrue does: two-digit hours with minutes, ' +
    'capitals, no noon, named days',
    function() {
      expect(compat.toString('0 12 * * *')).to.equal('At 12:00 PM every day');
      expect(compat.toString('0 0 * * *')).to.equal('At 12:00 AM every day');
      expect(compat.toString('30 14 * * 1-5'))
        .to.equal('At 02:30 PM Monday through Friday');
      expect(compat.toString('0 9 * * 6,0'))
        .to.equal('At 09:00 AM on Saturdays and Sundays');
      expect(compat.toString('0 9 * * 1-5', {locale: 'en_GB'}))
        .to.equal('At 09:00 AM Monday to Friday');
    });

  it('leaves every other language in its own style', function() {
    ['de', 'fr', 'ja', 'pt_BR'].forEach(function each(locale) {
      const lang = locale.replace('_', '-');

      expect(compat.toString('0 12 * * 1-5', {locale}), locale)
        .to.equal(cronli5('0 12 * * 1-5', {form: 'label', lang}));
    });
  });

  it('maps the options it can honour', function() {
    expect(compat.toString('30 17 * * *', {use24HourTimeFormat: true}))
      .to.equal('At 17:30 every day');
    expect(compat.toString('0 9 * * 2', {dayOfWeekStartIndexZero: false}))
      .to.equal('At 09:00 AM on Mondays');
    expect(compat.toString('0 9 * * 1', {dayOfWeekStartIndexZero: true}))
      .to.equal('At 09:00 AM on Mondays');
    expect(compat.toString('nonsense', {throwExceptionOnParseError: false}))
      .to.equal('an unrecognizable cron pattern');
    expect(compat.toString('0 9 * * *', {locale: 'en'}))
      .to.equal('At 09:00 AM every day');
    expect(compat.toString('0 9 * * *', {locale: 'en_GB'}))
      .to.equal('At 09:00 AM every day');
    expect(compat.toString('0 9 * * *', {locale: null}))
      .to.equal('At 09:00 AM every day');
  });

  it('reads a switch as cRonstrue does: anything falsy is off', function() {
    expect(compat.toString('0 9 * * 2', {dayOfWeekStartIndexZero: 0}))
      .to.equal('At 09:00 AM on Mondays');
    expect(compat.toString('0 9 * * 2', {dayOfWeekStartIndexZero: null}))
      .to.equal('At 09:00 AM on Mondays');
    expect(compat.toString('nonsense', {throwExceptionOnParseError: 0}))
      .to.equal('an unrecognizable cron pattern');
    expect(compat.toString('30 17 * * *', {use24HourTimeFormat: 1}))
      .to.equal('At 17:30 every day');
  });

  it('refuses a locale that is not a code', function() {
    [42, {}, ['en'], true].forEach(function each(locale) {
      refuses({locale}, /locale/u);
    });
  });

  it('describes a macro under either weekday numbering', function() {
    expect(compat.toString('@weekly', {dayOfWeekStartIndexZero: false}))
      .to.equal('At 12:00 AM on Sundays');
  });

  it('throws on a bad pattern unless told not to, as cRonstrue does',
    function() {
      expect(function strict() {
        compat.toString('nonsense');
      }).to.throw(Cronli5InputError);
      expect(function strict() {
        compat.toString('nonsense', {throwExceptionOnParseError: true});
      }).to.throw(Cronli5InputError);
    });

  it('reads a question mark as an asterisk under any settings', function() {
    expect(compat.toString('0 9 ? * 1')).to.equal('At 09:00 AM on Mondays');
    expect(compat.toString('0 9 1 * ?')).to.equal('At 09:00 AM on the 1st of every month');
    expect(compat.toString('0 9 ? * 2', {dayOfWeekStartIndexZero: false}))
      .to.equal('At 09:00 AM on Mondays');
  });

  it('accepts an option it cannot honour when it is switched off',
    function() {
      expect(compat.toString('0 9 * * *', {
        logicalAndDayFields: false,
        monthStartIndexZero: false,
        trimHoursLeadingZero: false,
        tzOffset: 0,
        verbose: false
      })).to.equal('At 09:00 AM every day');
      expect(compat.toString('0 9 * * *', {trimHoursLeadingZero: true}))
        .to.equal('At 9:00 AM every day');
    });

  it('refuses what it cannot honour, saying why', function() {
    refuses({verbose: true}, /verbose/u);
    refuses({tzOffset: 2}, /tzOffset/u);
    refuses({monthStartIndexZero: true}, /monthStartIndexZero/u);
    refuses({logicalAndDayFields: true}, /logicalAndDayFields/u);
    refuses({trimHoursLeadingZero: true, use24HourTimeFormat: true},
      /trimHoursLeadingZero/u);
    refuses({locale: 'zz'}, /zz/u);
    refuses({notAnOption: 1}, /notAnOption/u);
  });

  it('refuses them in lenient mode too', function() {
    refuses({throwExceptionOnParseError: false, verbose: true}, /verbose/u);
  });

  it('knows every option cRonstrue has', function() {
    const declared = readFileSync(
      'node_modules/cronstrue/dist/options.d.ts', 'utf8');
    const theirs = [...declared.matchAll(/^\s+(\w+)\?:/gmu)]
      .map(function nameOf(match) {
        return match[1];
      }).sort();
    const ours = table.map(function nameOf(row) {
      return row.option;
    }).sort();

    expect(theirs.length).to.be.greaterThan(5);
    expect(ours).to.deep.equal(theirs);
  });
});
