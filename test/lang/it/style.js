import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import italian, {styles} from '../../../src/lang/it/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Italian module declares to the entry point: its code, its
// regions and named styles, and how it presents a description in each
// form.
describe('Italian styles:', function() {
  it('declares its code, its regions and its named tables', function() {
    expect(italian.code).to.equal('it');
    expect(italian.defaultStyle).to.equal('it');
    expect(italian.regions).to.deep.equal({CH: 'ch', IT: 'it'});
    expect(italian.styles).to.equal(styles);
    expect(styles.it).to.deep.equal(
      {hour12: false, separator: ':', short: false});
    expect(styles.ch).to.deep.equal(
      {hour12: false, separator: '.', short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.it)).to.equal(true);
  });

  it('applies overrides to a named table', function() {
    expect(italian.style('it')).to.deep.equal(styles.it);
    expect(italian.style('ch', {short: true}))
      .to.deep.equal({hour12: false, separator: '.', short: true});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      italian.style('it', {workday: 'feriale'});
    }, /workday.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      italian.style('it', {short: 'sì'});
    }, /short/u);
    throwsOption(function build() {
      italian.style('it', {separator: ','});
    }, /separator/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.it};

      expect(italian.label('tutti i giorni alle 9:00', opts))
        .to.equal('Tutti i giorni alle 9:00');
      expect(italian.label('l\'ultimo giorno di ogni mese alle 0:00', opts))
        .to.equal('L\'ultimo giorno di ogni mese alle 0:00');
      expect(italian.sentence('tutti i giorni alle 9:00', opts))
        .to.equal('Viene eseguito tutti i giorni alle 9:00.');
      expect(italian.sentence('mai: la data indicata non esiste', opts))
        .to.equal('Non viene mai eseguito: la data indicata non esiste.');
      expect(italian.reboot(opts)).to.equal('all\'avvio del sistema');
      expect(italian.fallback(opts))
        .to.equal('un\'espressione cron non riconosciuta');
    });
});
