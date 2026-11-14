import chai from 'chai';
import lexicon from '../../../src/lang/zh/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Chinese lexicon:', function() {
  it('names the days of the week from Sunday', function() {
    expect(lexicon.weekdays).to.deep.equal(
      ['日', '一', '二', '三', '四', '五', '六']);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
    expect(lexicon.twoDigits(30)).to.equal('30');
  });

  it('holds words only', function() {
    Object.values(lexicon.words).concat(Object.values(lexicon.units),
      Object.values(lexicon.marks)).forEach(function isWord(word) {
      expect(word).to.be.a('string').and.not.equal('');
    });
  });
});
