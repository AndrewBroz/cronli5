import chai from 'chai';
import {readFileSync} from 'node:fs';
import {Cronli5InputError, Cronli5OptionError} from '../../src/cronli5.js';
import cronstrue from '../../src/cronstrue/index.js';
import {table} from '../../src/cronstrue/table.js';

const {expect} = chai;

function refuses(options, pattern) {
  expect(function describeIt() {
    cronstrue.toString('0 9 * * *', options);
  }, JSON.stringify(options)).to.throw(Cronli5OptionError, pattern);
}

// The adapter takes cRonstrue's call and translates it. It adds no
// behaviour: every option is mapped onto one of ours or refused.
describe('The cRonstrue adapter:', function() {
  it('describes a pattern as a label, in cronli5\'s words', function() {
    expect(cronstrue.toString('0 9 * * *')).to.equal('At 9 a.m. every day');
    expect(cronstrue.toString('*/5 * * * *')).to.equal('Every 5 minutes');
  });

  it('maps the options it can honour', function() {
    expect(cronstrue.toString('30 17 * * *', {use24HourTimeFormat: true}))
      .to.equal('At 17:30 every day');
    expect(cronstrue.toString('0 9 * * 2', {dayOfWeekStartIndexZero: false}))
      .to.equal('At 9 a.m. on Mondays');
    expect(cronstrue.toString('0 9 * * 1', {dayOfWeekStartIndexZero: true}))
      .to.equal('At 9 a.m. on Mondays');
    expect(cronstrue.toString('nonsense', {throwExceptionOnParseError: false}))
      .to.equal('an unrecognizable cron pattern');
    expect(cronstrue.toString('0 9 * * *', {locale: 'en'}))
      .to.equal('At 9 a.m. every day');
    expect(cronstrue.toString('0 9 * * *', {locale: 'en_GB'}))
      .to.equal('At 9am every day');
    expect(cronstrue.toString('0 9 * * *', {locale: null}))
      .to.equal('At 9 a.m. every day');
  });

  it('throws on a bad pattern unless told not to, as cRonstrue does',
    function() {
      expect(function strict() {
        cronstrue.toString('nonsense');
      }).to.throw(Cronli5InputError);
      expect(function strict() {
        cronstrue.toString('nonsense', {throwExceptionOnParseError: true});
      }).to.throw(Cronli5InputError);
    });

  it('reads a question mark as an asterisk under any settings', function() {
    expect(cronstrue.toString('0 9 ? * 1')).to.equal('At 9 a.m. on Mondays');
    expect(cronstrue.toString('0 9 1 * ?')).to.equal('At 9 a.m. on the 1st');
    expect(cronstrue.toString('0 9 ? * 2', {dayOfWeekStartIndexZero: false}))
      .to.equal('At 9 a.m. on Mondays');
  });

  it('accepts an option it cannot honour when it is switched off',
    function() {
      expect(cronstrue.toString('0 9 * * *', {
        logicalAndDayFields: false,
        monthStartIndexZero: false,
        trimHoursLeadingZero: false,
        tzOffset: 0,
        verbose: false
      })).to.equal('At 9 a.m. every day');
      expect(cronstrue.toString('0 9 * * *', {trimHoursLeadingZero: true}))
        .to.equal('At 9 a.m. every day');
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
