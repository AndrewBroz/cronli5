import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import ko, {styles} from '../../../src/lang/ko/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Korean module declares to the entry point: its code, its
// region and named style, and how it presents a description in each form.
describe('Korean styles:', function() {
  it('declares its code, its region and its named table', function() {
    expect(ko.code).to.equal('ko');
    expect(ko.defaultStyle).to.equal('ko');
    expect(ko.regions).to.deep.equal({KR: 'ko'});
    expect(ko.styles).to.equal(styles);
    expect(styles.ko).to.deep.equal({hour12: true, short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.ko)).to.equal(true);
  });

  it('applies overrides to the named table', function() {
    expect(ko.style('ko')).to.deep.equal(styles.ko);
    expect(ko.style('ko', {short: true}))
      .to.deep.equal({hour12: true, short: true});
    expect(ko.style('ko', {hour12: false}))
      .to.deep.equal({hour12: false, short: false});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      ko.style('ko', {dayparts: true});
    }, /dayparts.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      ko.style('ko', {short: '예'});
    }, /short/u);
    throwsOption(function build() {
      ko.style('ko', {hour12: 24});
    }, /hour12/u);
  });

  // A label is the description unchanged: Hangul has no capitals. A
  // sentence ends in «실행됩니다.», after «에» unless the description's
  // last word, a closing bracket aside, ends in «마다» or «에» (answers
  // 8.8).
  it('leaves a label alone, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.ko};

      expect(ko.label('매일 오전 9시', opts)).to.equal('매일 오전 9시');
      expect(ko.sentence('매일 오전 9시', opts))
        .to.equal('매일 오전 9시에 실행됩니다.');
      expect(ko.sentence('매시 정각', opts))
        .to.equal('매시 정각에 실행됩니다.');
      expect(ko.sentence('15분마다', opts)).to.equal('15분마다 실행됩니다.');
      expect(ko.sentence('매시 5·20분, 그때와 30초 뒤에', opts))
        .to.equal('매시 5·20분, 그때와 30초 뒤에 실행됩니다.');
      expect(ko.sentence('매시 정각(오전 3시 제외)', opts))
        .to.equal('매시 정각(오전 3시 제외)에 실행됩니다.');
      expect(ko.sentence('10분마다(오전 3시대 제외)', opts))
        .to.equal('10분마다(오전 3시대 제외) 실행됩니다.');
      expect(ko.sentence('없는 날짜라 실행되지 않음', opts))
        .to.equal('없는 날짜라 실행되지 않습니다.');
      expect(ko.reboot(opts)).to.equal('시스템 시작 시');
      expect(ko.fallback(opts)).to.equal('올바르지 않은 cron 패턴');
    });
});
