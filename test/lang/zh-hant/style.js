import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import zhHant, {styles} from '../../../src/lang/zh-hant/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Traditional Chinese module declares to the entry point: its
// code, its regions and named styles, and how it presents a description
// in each form.
describe('Traditional Chinese styles:', function() {
  it('declares its code, its regions and its named tables', function() {
    expect(zhHant.code).to.equal('zh-Hant');
    expect(zhHant.defaultStyle).to.equal('tw');
    expect(zhHant.regions).to.deep.equal({HK: 'hk', MO: 'hk', TW: 'tw'});
    expect(zhHant.styles).to.equal(styles);
    expect(styles.tw).to.deep.equal(
      {hour12: false, separator: ':', short: false, weekday: '週'});
    expect(styles.hk).to.deep.equal(
      {hour12: true, separator: '時', short: true, weekday: '星期'});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.tw)).to.equal(true);
  });

  it('applies overrides to a named table', function() {
    expect(zhHant.style('tw')).to.deep.equal(styles.tw);
    expect(zhHant.style('hk', {short: false})).to.deep.equal(
      {hour12: true, separator: '時', short: false, weekday: '星期'});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      zhHant.style('tw', {workday: '平日'});
    }, /workday.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      zhHant.style('tw', {short: '是'});
    }, /short/u);
    throwsOption(function build() {
      zhHant.style('tw', {separator: '點'});
    }, /separator/u);
    throwsOption(function build() {
      zhHant.style('tw', {weekday: '周'});
    }, /weekday/u);
  });

  it('leaves a label as it is, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.tw};

      expect(zhHant.label('每天 09:00', opts)).to.equal('每天 09:00');
      expect(zhHant.sentence('每天 09:00', opts))
        .to.equal('執行時間：每天 09:00。');
      expect(zhHant.sentence('每天（週三除外）09:00', opts))
        .to.equal('執行時間：每天（週三除外）09:00。');
      expect(zhHant.sentence('永不執行（沒有這個日期）', opts))
        .to.equal('永不執行（沒有這個日期）。');
      expect(zhHant.sentence('永不執行（指定的年份沒有這個日期）', opts))
        .to.equal('永不執行（指定的年份沒有這個日期）。');
      expect(zhHant.reboot(opts)).to.equal('系統啟動時');
      expect(zhHant.fallback(opts)).to.equal('無法辨識的排程');
    });
});
