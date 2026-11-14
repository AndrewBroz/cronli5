import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import zh, {styles} from '../../../src/lang/zh/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Chinese module declares to the entry point: its code, its one
// named style, and how it presents a description in each form.
describe('Chinese styles:', function() {
  it('declares its code, no regions, and one named table', function() {
    expect(zh.code).to.equal('zh');
    expect(zh.defaultStyle).to.equal('standard');
    expect(zh.regions).to.deep.equal({});
    expect(zh.styles).to.equal(styles);
    expect(styles.standard).to.deep.equal({hour12: false, short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.standard)).to.equal(true);
  });

  it('applies overrides to the table', function() {
    expect(zh.style('standard')).to.deep.equal(styles.standard);
    expect(zh.style('standard', {hour12: true}))
      .to.deep.equal({hour12: true, short: false});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      zh.style('standard', {through: '到'});
    }, /through.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      zh.style('standard', {short: '是'});
    }, /short/u);
  });

  it('has no capitals for a label, leads a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.standard};

      expect(zh.label('每天9:00', opts)).to.equal('每天9:00');
      expect(zh.sentence('每天9:00', opts)).to.equal('执行时间：每天9:00。');
      expect(zh.reboot(opts)).to.equal('系统启动时');
      expect(zh.fallback(opts)).to.equal('无法识别的cron表达式');
    });
});
