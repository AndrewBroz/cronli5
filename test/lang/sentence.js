import {expect} from 'chai';
import cronli5 from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';

// Each language owns how its fragment becomes a complete standalone sentence
// (the CLI's "Runs …." was English-only chrome); the verb leads, the fragment
// follows, a period closes.
describe('Complete-sentence wrapping (lang.sentence):', function() {
  const opts = {style: en.style(en.defaultStyle)};

  it('English', function() {
    expect(en.sentence('every minute', opts)).to.equal('Runs every minute.');
  });

  it('English does not double the period after an abbreviation', function() {
    // A fragment ending in "a.m."/"p.m." already carries a period; the
    // sentence wrapper must not append a second one.
    expect(en.sentence('at 9 a.m.', opts))
      .to.equal('Runs at 9 a.m.');
    expect(en.sentence('at 5:30 p.m.', opts))
      .to.equal('Runs at 5:30 p.m.');
  });

  it('English still closes a non-abbreviation fragment', function() {
    expect(en.sentence('at midnight every day', opts))
      .to.equal('Runs at midnight every day.');
  });
});

// The `form` option wraps cronli5's own output: the fragment by default, a
// complete sentence when asked. It wraps a schedule and @reboot, but not the
// lenient fallback (an error string, not a schedule).
describe('The sentence form:', function() {
  it('returns the fragment by default', function() {
    expect(cronli5('0 0 * * *')).to.equal('at midnight every day');
  });

  it('wraps the schedule as a sentence when set', function() {
    expect(cronli5('0 0 * * *', {form: 'sentence'}))
      .to.equal('Runs at midnight every day.');
  });

  it('wraps in the chosen language', function() {
    expect(cronli5('0 0 * * *', {form: 'sentence', lang: en}))
      .to.equal('Runs at midnight every day.');
  });

  it('wraps @reboot', function() {
    expect(cronli5('@reboot', {form: 'sentence'}))
      .to.equal('Runs at system startup.');
  });

  it('leaves the lenient fallback unwrapped', function() {
    expect(cronli5('nonsense', {form: 'sentence', lenient: true}))
      .to.equal('an unrecognizable cron pattern');
  });
});
