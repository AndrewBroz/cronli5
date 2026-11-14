import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import cs, {styles} from '../../../src/lang/cs/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Czech module declares to the entry point: its code, its one
// region and named style, and how it presents a description in each
// form.
describe('Czech styles:', function() {
  it('declares its code, its region and its named table', function() {
    expect(cs.code).to.equal('cs');
    expect(cs.defaultStyle).to.equal('cs');
    expect(cs.regions).to.deep.equal({CZ: 'cs'});
    expect(cs.styles).to.equal(styles);
    expect(styles.cs).to.deep.equal(
      {hour12: false, separator: ':', short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.cs)).to.equal(true);
  });

  it('applies overrides to the named table', function() {
    expect(cs.style('cs')).to.deep.equal(styles.cs);
    expect(cs.style('cs', {separator: '.', short: true})).to.deep.equal(
      {hour12: false, separator: '.', short: true});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      cs.style('cs', {workday: 'pracovní'});
    }, /workday.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      cs.style('cs', {short: 'ano'});
    }, /short/u);
    throwsOption(function build() {
      cs.style('cs', {separator: '-'});
    }, /separator/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.cs};

      expect(cs.label('denně v 9:00', opts)).to.equal('Denně v 9:00');
      expect(cs.label('1. června 2030 v 9:00', opts))
        .to.equal('1. června 2030 v 9:00');
      expect(cs.sentence('denně v 9:00', opts))
        .to.equal('Spouští se denně v 9:00.');
      expect(cs.reboot(opts)).to.equal('při startu systému');
      expect(cs.fallback(opts)).to.equal('nerozpoznaný cronový výraz');
    });
});
