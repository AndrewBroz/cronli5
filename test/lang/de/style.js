import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import de, {styles} from '../../../src/lang/de/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the German module declares to the entry point: its code, its
// regions and named styles, and how it presents a description in each
// form.
describe('German styles:', function() {
  it('declares its code, its regions and its named tables', function() {
    expect(de.code).to.equal('de');
    expect(de.defaultStyle).to.equal('de');
    expect(de.regions)
      .to.deep.equal({AT: 'at', CH: 'ch', DE: 'de', LI: 'ch'});
    expect(de.styles).to.equal(styles);
    expect(styles.de).to.deep.equal(
      {eszett: true, hour12: false, jaenner: false, short: false});
    expect(styles.at).to.deep.equal(
      {eszett: true, hour12: false, jaenner: true, short: false});
    expect(styles.ch).to.deep.equal(
      {eszett: false, hour12: false, jaenner: false, short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.de)).to.equal(true);
  });

  it('applies overrides to a named table', function() {
    expect(de.style('de')).to.deep.equal(styles.de);
    expect(de.style('at', {short: true})).to.deep.equal(
      {eszett: true, hour12: false, jaenner: true, short: true});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      de.style('de', {through: 'bis'});
    }, /through.*eszett/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      de.style('de', {short: 'ja'});
    }, /short/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.de};

      expect(de.label('täglich um 9:00 Uhr', opts))
        .to.equal('Täglich um 9:00 Uhr');
      expect(de.label('30 Minuten nach jeder vollen Stunde', opts))
        .to.equal('30 Minuten nach jeder vollen Stunde');
      expect(de.sentence('täglich um 9:00 Uhr', opts))
        .to.equal('Läuft täglich um 9:00 Uhr.');
      expect(de.sentence('jede Minute', opts)).to.equal('Läuft jede Minute.');
      expect(de.reboot(opts)).to.equal('beim Systemstart');
      expect(de.fallback(opts)).to.equal('ein unbekanntes Cron-Muster');
    });
});
