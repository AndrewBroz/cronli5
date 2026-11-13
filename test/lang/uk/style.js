import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import uk, {styles} from '../../../src/lang/uk/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Ukrainian module declares to the entry point: its code, its
// one named style, and how it presents a description in each form.
describe('Ukrainian styles:', function() {
  it('declares its code, no regions, and one named table', function() {
    expect(uk.code).to.equal('uk');
    expect(uk.defaultStyle).to.equal('standard');
    expect(uk.regions).to.deep.equal({});
    expect(uk.styles).to.equal(styles);
    expect(styles.standard).to.deep.equal({hour12: false, short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.standard)).to.equal(true);
  });

  it('applies overrides to the table', function() {
    expect(uk.style('standard')).to.deep.equal(styles.standard);
    expect(uk.style('standard', {hour12: true}))
      .to.deep.equal({hour12: true, short: false});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      uk.style('standard', {through: 'по'});
    }, /through.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      uk.style('standard', {short: 'так'});
    }, /short/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.standard};

      expect(uk.label('щодня о 9:00', opts)).to.equal('Щодня о 9:00');
      expect(uk.label('щохвилини', opts)).to.equal('Щохвилини');
      expect(uk.sentence('щодня о 9:00', opts))
        .to.equal('Виконується щодня о 9:00.');
      // A description that already ends in a full stop gets no second one.
      expect(uk.sentence('у груд.', opts)).to.equal('Виконується у груд.');
      expect(uk.reboot(opts)).to.equal('під час запуску системи');
      expect(uk.fallback(opts)).to.equal('нерозпізнаний шаблон cron');
    });
});
