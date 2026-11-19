import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import pl, {styles} from '../../../src/lang/pl/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Polish module declares to the entry point: its code, its
// region and named style, and how it presents a description in each
// form.
describe('Polish styles:', function() {
  it('declares its code, its region and its named table', function() {
    expect(pl.code).to.equal('pl');
    expect(pl.defaultStyle).to.equal('pl');
    expect(pl.regions).to.deep.equal({PL: 'pl'});
    expect(pl.styles).to.equal(styles);
    expect(styles.pl).to.deep.equal(
      {hour12: false, separator: ':', short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.pl)).to.equal(true);
  });

  it('applies overrides to the named table', function() {
    expect(pl.style('pl')).to.deep.equal(styles.pl);
    expect(pl.style('pl', {separator: '.', short: true}))
      .to.deep.equal({hour12: false, separator: '.', short: true});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      pl.style('pl', {workday: 'roboczy'});
    }, /workday.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      pl.style('pl', {short: 'tak'});
    }, /short/u);
    throwsOption(function build() {
      pl.style('pl', {separator: '-'});
    }, /separator/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.pl};

      expect(pl.label('codziennie o 9:00', opts))
        .to.equal('Codziennie o 9:00');
      expect(pl.label('pierwszego dnia każdego miesiąca o 0:00', opts))
        .to.equal('Pierwszego dnia każdego miesiąca o 0:00');
      expect(pl.label('5, 20 i 45 minut po każdej pełnej godzinie', opts))
        .to.equal('5, 20 i 45 minut po każdej pełnej godzinie');
      expect(pl.sentence('codziennie o 9:00', opts))
        .to.equal('Uruchamia się codziennie o 9:00.');
      expect(pl.sentence('codziennie co 2 godz.', opts))
        .to.equal('Uruchamia się codziennie co 2 godz.');
      expect(pl.reboot(opts)).to.equal('po starcie systemu');
      expect(pl.fallback(opts)).to.equal('nierozpoznane wyrażenie cron');
    });
});
