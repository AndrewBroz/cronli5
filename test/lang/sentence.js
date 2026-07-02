import {expect} from 'chai';
import cronli5 from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';
import es from '../../src/lang/es/index.js';
import de from '../../src/lang/de/index.js';
import fi from '../../src/lang/fi/index.js';
import fr from '../../src/lang/fr/index.js';
import pt from '../../src/lang/pt/index.js';
import zh from '../../src/lang/zh/index.js';

// Each language owns how its fragment becomes a complete standalone sentence
// (the CLI's "Runs …." was English-only chrome); the verb leads, the fragment
// follows, a period closes.
describe('Complete-sentence wrapping (lang.sentence):', function() {
  it('English', function() {
    expect(en.sentence('every minute', en.options())).to.equal('Runs every minute.');
  });

  it('English does not double the period after an abbreviation', function() {
    // A fragment ending in "a.m."/"p.m." already carries a period; the
    // sentence wrapper must not append a second one.
    expect(en.sentence('every day at 9 a.m.', en.options()))
      .to.equal('Runs every day at 9 a.m.');
    expect(en.sentence('every Monday at 5:30 p.m.', en.options()))
      .to.equal('Runs every Monday at 5:30 p.m.');
  });

  it('English still closes a non-abbreviation fragment', function() {
    expect(en.sentence('every day at midnight', en.options()))
      .to.equal('Runs every day at midnight.');
  });

  it('German', function() {
    expect(de.sentence('täglich um Mitternacht', de.options()))
      .to.equal('Läuft täglich um Mitternacht.');
  });

  it('German does not double the period after an ordinal', function() {
    // A fragment ending in a German ordinal already carries a period
    // ("…am 8."); the sentence wrapper must not append a second one.
    expect(de.sentence('am 3., 5. und 8.', de.options()))
      .to.equal('Läuft am 3., 5. und 8.');
  });

  it('Spanish', function() {
    expect(es.sentence('cada minuto', es.options())).to.equal('Se ejecuta cada minuto.');
  });

  it('Spanish does not double a period already on the fragment', function() {
    expect(es.sentence('a las 9 a.m.', es.options()))
      .to.equal('Se ejecuta a las 9 a.m.');
  });

  it('Finnish', function() {
    expect(fi.sentence('joka minuutti', fi.options()))
      .to.equal('Suoritetaan joka minuutti.');
  });

  it('Finnish does not double a period already on the fragment', function() {
    expect(fi.sentence('kuukauden 8.', fi.options()))
      .to.equal('Suoritetaan kuukauden 8.');
  });

  it('Portuguese', function() {
    expect(pt.sentence('a cada minuto', pt.options()))
      .to.equal('Se executa a cada minuto.');
  });

  it('Portuguese does not double a period already on the fragment',
    function() {
      expect(pt.sentence('às 9 da manhã.', pt.options()))
        .to.equal('Se executa às 9 da manhã.');
    });

  it('French', function() {
    expect(fr.sentence('chaque minute', fr.options()))
      .to.equal('S\'exécute chaque minute.');
  });

  it('French does not double a period already on the fragment', function() {
    // A fr fragment ending in an abbreviation period (e.g. "9 h 30 min 15 s."
    // never carries one, but the guard mirrors the other languages) must not
    // gain a second period.
    expect(fr.sentence('tous les jours à 9 h.', fr.options()))
      .to.equal('S\'exécute tous les jours à 9 h.');
  });

  it('Chinese', function() {
    expect(zh.sentence('每分钟', zh.options())).to.equal('运行时间：每分钟。');
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

// The callable export carries two named convenience methods that are thin
// sugar over the `sentence` option: `.sentence(...)` forces the capitalized
// standalone, `.fragment(...)` forces the embeddable fragment (the default).
// There is deliberately no `toString` method — it would shadow
// `Function.prototype.toString` and break `String(cronli5)` coercion.
describe('The sentence()/fragment() convenience methods:', function() {
  it('sentence() matches the {sentence: true} call', function() {
    expect(cronli5.sentence('0 0 * * *'))
      .to.equal(cronli5('0 0 * * *', {sentence: true}));
    expect(cronli5.sentence('0 0 * * *'))
      .to.equal('Runs every day at midnight.');
  });

  it('fragment() matches the default (no-option) call', function() {
    expect(cronli5.fragment('0 0 * * *'))
      .to.equal(cronli5('0 0 * * *'));
    expect(cronli5.fragment('0 0 * * *')).to.equal('every day at midnight');
  });

  it('sentence() forwards all options (quartz)', function() {
    expect(cronli5.sentence('0 0 ? * 2', {quartz: true}))
      .to.equal(cronli5('0 0 ? * 2', {quartz: true, sentence: true}));
  });

  it('fragment() forwards all options (lang)', function() {
    expect(cronli5.fragment('0 9 * * 1', {lang: es}))
      .to.equal(cronli5('0 9 * * 1', {lang: es}));
  });

  it('sentence() forwards lang and wraps in that language', function() {
    expect(cronli5.sentence('0 0 * * *', {lang: de}))
      .to.equal('Läuft täglich um Mitternacht.');
  });

  it('an explicit sentence option is overridden by the method', function() {
    // The method's own intent wins over a passed-through `sentence` flag.
    expect(cronli5.fragment('0 0 * * *', {sentence: true}))
      .to.equal('every day at midnight');
    expect(cronli5.sentence('0 0 * * *', {sentence: false}))
      .to.equal('Runs every day at midnight.');
  });

  it('does not clobber Function.prototype.toString', function() {
    // `String(fn)` / template coercion call `toString` arg-less; it must
    // still return the function source, not throw or mis-render.
    expect(String(cronli5)).to.match(/^function cronli5\b/u);
    expect(`${cronli5}`).to.match(/^function cronli5\b/u);
  });
});
