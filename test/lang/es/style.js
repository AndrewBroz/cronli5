import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import es, {styles} from '../../../src/lang/es/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Spanish module declares to the entry point: its code, its
// regions and named styles, and how it presents a description in each
// form.
describe('Spanish styles:', function() {
  it('declares its code, its regions and its named tables', function() {
    expect(es.code).to.equal('es');
    expect(es.defaultStyle).to.equal('es');
    expect(es.regions).to.deep.equal({ES: 'es', MX: 'mx', US: 'mx'});
    expect(es.styles).to.equal(styles);
    expect(styles.es).to.deep.equal({hour12: false, short: false});
    expect(styles.mx).to.deep.equal({hour12: true, short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.es)).to.equal(true);
  });

  it('applies overrides to a named table', function() {
    expect(es.style('es')).to.deep.equal(styles.es);
    expect(es.style('mx', {short: true}))
      .to.deep.equal({hour12: true, short: true});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      es.style('es', {through: 'hasta'});
    }, /through.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      es.style('es', {short: 'sí'});
    }, /short/u);
    throwsOption(function build() {
      es.style('es', {hour12: 'no'});
    }, /hour12/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.es};

      expect(es.label('a las 9:00 todos los días', opts))
        .to.equal('A las 9:00 todos los días');
      expect(es.sentence('a las 9:00 todos los días', opts))
        .to.equal('Se ejecuta a las 9:00 todos los días.');
      expect(es.sentence('a las 5:30 p. m.', opts))
        .to.equal('Se ejecuta a las 5:30 p. m.');
      expect(es.sentence('nunca, porque junio no tiene día 31', opts))
        .to.equal('No se ejecuta nunca, porque junio no tiene día 31.');
      expect(es.reboot(opts)).to.equal('al iniciar el sistema');
      expect(es.fallback(opts)).to.equal('un patrón cron no reconocido');
    });
});
