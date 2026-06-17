import {expect} from 'chai';
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
