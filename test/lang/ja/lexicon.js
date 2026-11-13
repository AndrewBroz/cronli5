import chai from 'chai';
import lexicon from '../../../src/lang/ja/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Japanese lexicon:', function() {
  it('names the days of the week from Sunday, in full and in short',
    function() {
      expect(lexicon.weekdays[0]).to.deep.equal(
        {full: '日曜日', short: '日曜'});
      expect(lexicon.weekdays[1]).to.deep.equal(
        {full: '月曜日', short: '月曜'});
      expect(lexicon.weekdays[6]).to.deep.equal(
        {full: '土曜日', short: '土曜'});
      expect(lexicon.weekdays).to.have.length(7);
    });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
    expect(lexicon.twoDigits(30)).to.equal('30');
  });

  it('writes a span of names with the wave dash, not the full-width tilde',
    function() {
      expect(lexicon.marks.range).to.equal('〜');
      expect(lexicon.marks.list).to.equal('・');
      expect(lexicon.marks.comma).to.equal('、');
    });

  it('holds words only', function() {
    Object.values(lexicon.words).concat(Object.values(lexicon.units),
      Object.values(lexicon.marks)).forEach(function isWord(word) {
      expect(word).to.be.a('string').and.not.equal('');
    });
  });
});
