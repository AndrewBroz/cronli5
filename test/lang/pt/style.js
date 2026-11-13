import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import pt, {styles} from '../../../src/lang/pt/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Portuguese module declares to the entry point: its code, its
// regions and named styles, and how it presents a description in each
// form.
describe('Portuguese styles:', function() {
  it('declares its code, its regions and its named tables', function() {
    expect(pt.code).to.equal('pt');
    expect(pt.defaultStyle).to.equal('br');
    expect(pt.regions)
      .to.deep.equal({AO: 'pt', BR: 'br', MZ: 'pt', PT: 'pt'});
    expect(pt.styles).to.equal(styles);
    expect(styles.br).to.deep.equal({
      feira: false,
      firstOrdinal: true,
      hour12: false,
      madrugada: true,
      short: false
    });
    expect(styles.pt).to.deep.equal({
      feira: true,
      firstOrdinal: false,
      hour12: false,
      madrugada: false,
      short: false
    });
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.br)).to.equal(true);
  });

  it('applies overrides to a named table', function() {
    expect(pt.style('br')).to.deep.equal(styles.br);
    expect(pt.style('pt', {short: true})).to.deep.equal({
      feira: true,
      firstOrdinal: false,
      hour12: false,
      madrugada: false,
      short: true
    });
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      pt.style('br', {through: 'até'});
    }, /through.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      pt.style('br', {short: 'sim'});
    }, /short/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.br};

      expect(pt.label('todos os dias, às 09:00', opts))
        .to.equal('Todos os dias, às 09:00');
      expect(pt.label('às 09:00', opts)).to.equal('Às 09:00');
      expect(pt.sentence('todos os dias, às 09:00', opts))
        .to.equal('Ocorre todos os dias, às 09:00.');
      expect(pt.sentence('todos os dias de jun.', opts))
        .to.equal('Ocorre todos os dias de jun.');
      expect(pt.reboot(opts)).to.equal('ao iniciar o sistema');
      expect(pt.fallback(opts)).to.equal('um padrão cron não reconhecido');
    });
});
