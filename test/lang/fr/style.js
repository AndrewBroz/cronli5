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
    expect(fr.regions).to.deep.equal({CA: 'ca', FR: 'fr'});
    expect(fr.styles).to.equal(styles);
    expect(styles.fr).to.deep.equal(
      {hour12: false, short: false, weekend: 'le week-end'});
    expect(styles.ca).to.deep.equal(
      {hour12: false, short: false, weekend: 'la fin de semaine'});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.fr)).to.equal(true);
  });

  it('applies overrides to a named table', function() {
    expect(fr.style('fr')).to.deep.equal(styles.fr);
    expect(fr.style('ca', {short: true})).to.deep.equal(
      {hour12: false, short: true, weekend: 'la fin de semaine'});
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
    throwsOption(function build() {
      fr.style('fr', {weekend: true});
    }, /weekend/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.fr};

      expect(fr.label('à 9 h tous les jours', opts))
        .to.equal('À 9 h tous les jours');
      expect(fr.label('toutes les minutes', opts))
        .to.equal('Toutes les minutes');
      expect(fr.sentence('à 9 h tous les jours', opts))
        .to.equal('S\'exécute à 9 h tous les jours.');
      expect(fr.sentence('à 9 h tous les jours en déc.', opts))
        .to.equal('S\'exécute à 9 h tous les jours en déc.');
      expect(fr.reboot(opts)).to.equal('au démarrage du système');
      expect(fr.fallback(opts)).to.equal('une expression cron non reconnue');
    });
});
