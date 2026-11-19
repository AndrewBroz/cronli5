import chai from 'chai';
import lexicon from '../../../src/lang/zh-hant/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Traditional Chinese lexicon:', function() {
  it('names the weekdays by numeral, from Sunday as cron counts',
    function() {
      expect(lexicon.weekdays).to.deep.equal(
        ['日', '一', '二', '三', '四', '五', '六']);
      expect(lexicon.weekdayPrefixes).to.deep.equal(
        {星期: '星期', 週: '週'});
    });

  it('writes the parts of a colon clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
    expect(lexicon.twoDigits(17)).to.equal('17');
  });

  it('has each unit as a position and as a length', function() {
    expect(lexicon.units.minute).to.deep.equal(
      {length: '分鐘', position: '分'});
    expect(lexicon.units.hour).to.deep.equal(
      {length: '小時', position: '時'});
    expect(lexicon.units.day).to.deep.equal({length: '天', position: '日'});
    expect(lexicon.units.month).to.deep.equal({position: '月'});
  });

  it('gives the parts of the day in order of their first hour',
    function() {
      expect(lexicon.dayParts.map(function wordOf(part) {
        return part.word;
      })).to.deep.equal(['凌晨', '上午', '中午', '下午', '晚上']);
      expect(lexicon.dayParts.map(function startOf(part) {
        return part.from;
      })).to.deep.equal([0, 6, 12, 13, 18]);
    });

  it('writes 週, never 周', function() {
    expect(JSON.stringify(lexicon)).to.not.include('周');
  });

  it('holds words only', function() {
    Object.values(lexicon.words).forEach(function isWord(word) {
      expect(word).to.be.a('string').and.not.equal('');
    });
  });
});
