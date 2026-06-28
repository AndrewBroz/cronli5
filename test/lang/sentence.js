import {expect} from 'chai';
import cronli5 from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';
import es from '../../src/lang/es/index.js';
import de from '../../src/lang/de/index.js';
import fi from '../../src/lang/fi/index.js';
import pt from '../../src/lang/pt/index.js';
import zh from '../../src/lang/zh/index.js';

// Each language owns how its fragment becomes a complete standalone sentence
// (the CLI's "Runs …." was English-only chrome); the verb leads, the fragment
// follows, a period closes.
describe('Complete-sentence wrapping (lang.sentence):', function() {
  it('English', function() {
    expect(en.sentence('every minute')).to.equal('Runs every minute.');
  });

  it('English does not double the period after an abbreviation', function() {
    // A fragment ending in "a.m."/"p.m." already carries a period; the
    // sentence wrapper must not append a second one.
    expect(en.sentence('every day at 9 a.m.'))
      .to.equal('Runs every day at 9 a.m.');
    expect(en.sentence('every Monday at 5:30 p.m.'))
      .to.equal('Runs every Monday at 5:30 p.m.');
  });

  it('English still closes a non-abbreviation fragment', function() {
    expect(en.sentence('every day at midnight'))
      .to.equal('Runs every day at midnight.');
  });

  it('German', function() {
    expect(de.sentence('täglich um Mitternacht'))
      .to.equal('Läuft täglich um Mitternacht.');
  });

  it('German does not double the period after an ordinal', function() {
    // A fragment ending in a German ordinal already carries a period
    // ("…am 8."); the sentence wrapper must not append a second one.
    expect(de.sentence('am 3., 5. und 8.'))
      .to.equal('Läuft am 3., 5. und 8.');
  });

  it('Spanish', function() {
    expect(es.sentence('cada minuto')).to.equal('Se ejecuta cada minuto.');
  });

  it('Spanish does not double a period already on the fragment', function() {
    expect(es.sentence('a las 9 a.m.'))
      .to.equal('Se ejecuta a las 9 a.m.');
  });

  it('Finnish', function() {
    expect(fi.sentence('joka minuutti'))
      .to.equal('Suoritetaan joka minuutti.');
  });

  it('Finnish does not double a period already on the fragment', function() {
    expect(fi.sentence('kuukauden 8.'))
      .to.equal('Suoritetaan kuukauden 8.');
  });

  it('Portuguese', function() {
    expect(pt.sentence('a cada minuto'))
      .to.equal('Se executa a cada minuto.');
  });

  it('Portuguese does not double a period already on the fragment',
    function() {
      expect(pt.sentence('às 9 da manhã.'))
        .to.equal('Se executa às 9 da manhã.');
    });

  it('Chinese', function() {
    expect(zh.sentence('每分钟')).to.equal('运行时间：每分钟。');
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
