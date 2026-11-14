import chai from 'chai';
import lexicon from '../../../src/lang/en/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else: no
// lengths, since phrasings are chosen by how many things they name.
describe('English lexicon:', function() {
  it('writes a day of the month with its suffix', function() {
    expect([1, 2, 3, 4, 11, 12, 13, 20, 21, 22, 23, 31].map(lexicon.ordinal))
      .to.deep.equal(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th',
        '20th', '21st', '22nd', '23rd', '31st']);

    for (let n = 1; n <= 31; n += 1) {
      expect(lexicon.ordinal(n), String(n)).to.match(/^\d+(?:st|nd|rd|th)$/u);
    }
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
    expect(lexicon.twoDigits(30)).to.equal('30');
  });

  it('names months and weekdays in full and in short', function() {
    expect(lexicon.months[9]).to.deep.equal(
      {full: 'September', short: 'Sep'});
    expect(lexicon.months).to.have.length(13);
    expect(lexicon.weekdays[1]).to.deep.equal(
      {full: 'Monday', plural: 'Mondays', short: 'Mon'});
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('has each unit alone and in the plural', function() {
    expect(lexicon.units.minute).to.deep.equal(
      {many: 'minutes', one: 'minute'});
  });

  it('holds words only', function() {
    Object.values(lexicon.words).concat(lexicon.nthWords)
      .forEach(function isWord(word) {
        expect(word).to.be.a('string').and.not.equal('');
      });
  });
});
