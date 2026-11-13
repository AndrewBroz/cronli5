import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import ja, {styles} from '../../../src/lang/ja/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Japanese module declares to the entry point: its code, its one
// named style, and how it presents a description in each form.
describe('Japanese styles:', function() {
  it('declares its code, no regions, and one named table', function() {
    expect(ja.code).to.equal('ja');
    expect(ja.defaultStyle).to.equal('standard');
    expect(ja.regions).to.deep.equal({});
    expect(ja.styles).to.equal(styles);
    expect(styles.standard).to.deep.equal(
      {hour12: false, kanjiTime: false, short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.standard)).to.equal(true);
  });

  it('applies overrides to the table', function() {
    expect(ja.style('standard')).to.deep.equal(styles.standard);
    expect(ja.style('standard', {hour12: true}))
      .to.deep.equal({hour12: true, kanjiTime: false, short: false});
    expect(ja.style('standard', {kanjiTime: true, short: true}))
      .to.deep.equal({hour12: false, kanjiTime: true, short: true});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      ja.style('standard', {through: 'まで'});
    }, /through.*hour12.*kanjiTime.*short/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      ja.style('standard', {short: 'はい'});
    }, /short/u);
    throwsOption(function build() {
      ja.style('standard', {kanjiTime: '時'});
    }, /kanjiTime/u);
  });

  it('has no capitals for a label, and has its fixed texts', function() {
    const opts = {style: styles.standard};

    expect(ja.label('毎日9:00', opts)).to.equal('毎日9:00');
    expect(ja.reboot(opts)).to.equal('システム起動時');
    expect(ja.fallback(opts)).to.equal('認識できないcron式');
  });

  it('closes a sentence with に実行します。, whatever it ends in', function() {
    const opts = {style: styles.standard};

    expect(ja.sentence('毎日9:00', opts)).to.equal('毎日9:00に実行します。');
    expect(ja.sentence('1分ごと', opts)).to.equal('1分ごとに実行します。');
    expect(ja.sentence('毎月1日は終日、1分ごと', opts))
      .to.equal('毎月1日は終日、1分ごとに実行します。');
    expect(ja.sentence('毎時0分（3:00を除く）', opts))
      .to.equal('毎時0分（3:00を除く）に実行します。');
    expect(ja.sentence('システム起動時', opts))
      .to.equal('システム起動時に実行します。');
  });
});
