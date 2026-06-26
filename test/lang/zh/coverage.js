import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import zh from '../../../src/lang/zh/index.js';

const {expect} = chai;

// Supplementary branch coverage for the zh renderer — hand-verified edge cases
// the core-set corpus does not reach (every 12-hour day period, the even-month
// idiom, the quartz #/W operators). NOT the panel oracle; that is corpus.js.

function run(cases) {
  cases.forEach(function each([pattern, expected, options]) {
    describe(JSON.stringify([pattern, options || {}]), function() {
      it('读作 "' + expected + '"', function() {
        expect(cronli5(pattern, {...options || {}, lang: zh})).to.equal(expected);
      });
    });
  });
}

describe('中文 (zh) — branch coverage:', function() {
  describe('12 小时制日段 (ampm day periods)', function() {
    run([
      ['0 3 * * *', '每天凌晨3点', {ampm: true}],
      ['0 7 * * *', '每天早上7点', {ampm: true}],
      ['30 12 * * *', '每天中午12点30分', {ampm: true}],
      ['0 20 * * *', '每天晚上8点', {ampm: true}],
      ['0 8,20 * * *', '每天早上8点和晚上8点', {ampm: true}]
    ]);
  });

  describe('偶数月与 Quartz #/W (even months, quartz operators)', function() {
    run([
      ['0 0 1 2/2 *', '每个偶数月1日凌晨0点'],
      ['0 0 * 2/2 *', '每个偶数月每天凌晨0点'],
      ['0 0 * * 1#2', '第2个周一凌晨0点'],
      ['0 0 15W * *', '本月最接近15日的工作日凌晨0点']
    ]);
  });
});
