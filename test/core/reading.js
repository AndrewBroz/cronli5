import chai from 'chai';
import {
  Cronli5InputError, Cronli5OptionError, analyze, prepare, readingOf
} from '../../src/core/index.js';

const {expect} = chai;

function facts(pattern, options) {
  const schedule = analyze(prepare(pattern, readingOf(options)));

  return JSON.stringify([schedule.pattern, schedule.analyses.day]);
}

function same(a, optionsA, b, optionsB) {
  expect(facts(a, optionsA), `${a} ${JSON.stringify(optionsA)}`)
    .to.equal(facts(b, optionsB));
}

function throwsInput(pattern, options) {
  expect(function read() {
    facts(pattern, options);
  }, `${pattern} ${JSON.stringify(options)}`).to.throw(Cronli5InputError);
}

// How a pattern is read is a few independent facts about the scheduler it
// came from. A flavour names a set of them; each can also be given alone.
describe('Reading a pattern:', function() {
  it('a flavour sets the flags and a flag overrides it', function() {
    expect(readingOf({})).to.deep.equal(
      {questionMark: 'reject', seconds: false, weekdaysFrom: 0, years: false});
    expect(readingOf({cron: 'quartz'}).weekdaysFrom).to.equal(1);
    expect(readingOf({cron: 'quartz'}).questionMark).to.equal('allow');
    expect(readingOf({cron: 'quartz', weekdaysFrom: 0}).weekdaysFrom)
      .to.equal(0);
    expect(readingOf({seconds: true, years: true}))
      .to.include({seconds: true, years: true});
  });

  it('an option error is recognized by instanceof, and nothing else is',
    function() {
      let caught = null;

      try {
        readingOf({cron: 'spring'});
      }
      catch (error) {
        caught = error;
      }

      expect(caught instanceof Cronli5OptionError).to.equal(true);
      expect(caught instanceof Cronli5InputError).to.equal(false);
      expect(new Error('other') instanceof Cronli5OptionError).to.equal(false);
    });

  it('rejects a flavour or flag value it does not know', function() {
    [{cron: 'spring'}, {weekdaysFrom: 2}, {questionMark: 'maybe'},
      {seconds: 'yes'}].forEach(function each(options) {
      expect(function read() {
        readingOf(options);
      }, JSON.stringify(options)).to.throw(Cronli5OptionError);
    });
  });

  it('numbers weekdays from 1 wherever a weekday number appears', function() {
    same('0 0 * * 2', {weekdaysFrom: 1}, '0 0 * * 1', {});
    same('0 0 * * 2-6', {weekdaysFrom: 1}, '0 0 * * 1-5', {});
    same('0 0 * * 6L', {weekdaysFrom: 1}, '0 0 * * 5L', {});
    same('0 0 * * 2#2', {weekdaysFrom: 1}, '0 0 * * 1#2', {});
    same('0 0 * * L', {weekdaysFrom: 1}, '0 0 * * L', {});
    same('0 0 * * MON', {weekdaysFrom: 1}, '0 0 * * 1', {});
    throwsInput('0 0 * * 0', {weekdaysFrom: 1});
    throwsInput('0 0 * * 8', {weekdaysFrom: 1});
  });

  it('keeps 0 and 7 as Sunday when weekdays are numbered from 0', function() {
    same('0 0 * * 7', {}, '0 0 * * 0', {});
    same('0 0 * * 7', {cron: 'quartz', weekdaysFrom: 0}, '0 0 * * 0', {});
  });

  it('rejects, allows or requires a question mark', function() {
    throwsInput('0 0 ? * 1', {});
    throwsInput('0 0 1 * ?', {});
    same('0 0 ? * 1', {questionMark: 'allow'}, '0 0 * * 1', {});
    same('0 0 1 * ?', {questionMark: 'allow'}, '0 0 1 * *', {});
    same('0 0 1 * 1', {questionMark: 'allow'}, '0 0 1 * 1', {});
    same('0 0 ? * 1', {questionMark: 'require'}, '0 0 * * 1', {});
    throwsInput('0 0 1 * 1', {questionMark: 'require'});
    throwsInput('0 0 * * *', {questionMark: 'require'});
    throwsInput('0 0 ? * ?', {questionMark: 'require'});
  });

  it('reads a macro the same whatever the weekday numbering', function() {
    same('@weekly', {weekdaysFrom: 1}, '0 0 * * 0', {});
    same('@weekly', {cron: 'quartz'}, '@weekly', {});
    same('  @daily ', {cron: 'quartz'}, '0 0 * * *', {});
  });

  it('reads a Quartz pattern as today', function() {
    same('0 0 ? * 2', {cron: 'quartz'}, '0 0 * * 1', {});
    same('0 0 * * 2', {cron: 'quartz'}, '0 0 * * 1', {});
  });
});
