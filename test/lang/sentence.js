import {expect} from 'chai';
import cronli5 from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';
import es from '../../src/lang/es/index.js';
import de from '../../src/lang/de/index.js';
import fi from '../../src/lang/fi/index.js';

// Each language owns how its fragment becomes a complete standalone sentence
// (the CLI's "Runs …." was English-only chrome); the verb leads, the fragment
// follows, a period closes.
describe('Complete-sentence wrapping (lang.sentence):', function() {
  it('English', function() {
    expect(en.sentence('every minute')).to.equal('Runs every minute.');
  });

  it('German', function() {
    expect(de.sentence('täglich um Mitternacht'))
      .to.equal('Läuft täglich um Mitternacht.');
  });

  it('Spanish', function() {
    expect(es.sentence('cada minuto')).to.equal('Se ejecuta cada minuto.');
  });

  it('Finnish', function() {
    expect(fi.sentence('joka minuutti'))
      .to.equal('Suoritetaan joka minuutti.');
  });
});

// The `sentence` option wraps cronli5's own output: the fragment by default, a
// complete sentence when set. It wraps a schedule and @reboot, but not the
// lenient fallback (an error string, not a schedule).
describe('The sentence option:', function() {
  it('returns the fragment by default', function() {
    expect(cronli5('0 0 * * *')).to.equal('every day at midnight');
  });

  it('wraps the schedule as a sentence when set', function() {
    expect(cronli5('0 0 * * *', {sentence: true}))
      .to.equal('Runs every day at midnight.');
  });

  it('wraps in the chosen language', function() {
    expect(cronli5('0 0 * * *', {lang: de, sentence: true}))
      .to.equal('Läuft täglich um Mitternacht.');
  });

  it('wraps @reboot', function() {
    expect(cronli5('@reboot', {sentence: true}))
      .to.equal('Runs at system startup.');
  });

  it('leaves the lenient fallback unwrapped', function() {
    expect(cronli5('nonsense', {lenient: true, sentence: true}))
      .to.equal('an unrecognizable cron pattern');
  });
});
