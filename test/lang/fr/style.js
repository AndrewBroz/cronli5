import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import fr, {styles} from '../../../src/lang/fr/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the French module declares to the entry point: its code, its
// regions and named styles, and how it presents a description in each
// form.
describe('French styles:', function() {
  it('declares its code, its regions and its named tables', function() {
    expect(fr.code).to.equal('fr');
    expect(fr.defaultStyle).to.equal('fr');
    expect(fr.regions).to.deep.equal({FR: 'fr'});
    expect(fr.styles).to.equal(styles);
    expect(styles.fr).to.deep.equal({hour12: false, short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.fr)).to.equal(true);
  });

  it('applies overrides to a named table', function() {
    expect(fr.style('fr')).to.deep.equal(styles.fr);
    expect(fr.style('fr', {short: true}))
      .to.deep.equal({hour12: false, short: true});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      fr.style('fr', {through: 'jusqu\'à'});
    }, /through.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      fr.style('fr', {short: 'oui'});
    }, /short/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.fr};

      expect(fr.label('à 30 de chaque heure', opts))
        .to.equal('À 30 de chaque heure');
      expect(fr.label('toutes les minutes', opts))
        .to.equal('Toutes les minutes');
      expect(fr.label('30 secondes après le début de chaque minute', opts))
        .to.equal('30 secondes après le début de chaque minute');
      expect(fr.sentence('tous les jours à 9 h', opts))
        .to.equal('S\'exécute tous les jours à 9 h.');
      expect(fr.sentence('en déc.', opts))
        .to.equal('S\'exécute en déc.');
      expect(fr.reboot(opts)).to.equal('au démarrage du système');
      expect(fr.fallback(opts)).to.equal('une expression cron non reconnue');
    });
});
