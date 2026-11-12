import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import en, {styles} from '../../../src/lang/en/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// The English style tables: named whole tables a caller can pass or
// adjust, and the regions that select them.
describe('English styles:', function() {
  it('declares its code, its regions and its named tables', function() {
    expect(en.code).to.equal('en');
    expect(en.defaultStyle).to.equal('us');
    expect(en.regions).to.deep.equal({GB: 'gb', US: 'us'});
    expect(en.styles).to.equal(styles);
    expect(Object.keys(styles).sort()).to.deep.equal(['gb', 'house', 'us']);
    expect(styles.us).to.include({hour12: true, short: false});
  });

  it('applies overrides to a named table', function() {
    expect(en.style('us')).to.deep.equal(styles.us);
    expect(en.style('gb', {hour12: false}))
      .to.include({hour12: false, through: 'to'});
    expect(en.style('us', {...styles.house, short: true}))
      .to.include({am: 'AM', short: true});
    expect(en.style('us', {through: ' to '}).through).to.equal('to');
  });

  it('never changes a table it was given', function() {
    en.style('us', {hour12: false});

    expect(styles.us.hour12).to.equal(true);
    expect(Object.isFrozen(styles.us)).to.equal(true);
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      en.style('us', {hour24: true});
    }, /hour24.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      en.style('us', {through: 5});
    }, /through/u);
    throwsOption(function build() {
      en.style('us', {am: null});
    }, /am/u);
    throwsOption(function build() {
      en.style('us', 'gb');
    });
  });

  it('capitalises a label and leaves the rest alone', function() {
    const opts = {style: styles.us};

    expect(en.label('at 9 a.m. every day', opts))
      .to.equal('At 9 a.m. every day');
    expect(en.label('every 5 minutes', opts)).to.equal('Every 5 minutes');
  });
});
