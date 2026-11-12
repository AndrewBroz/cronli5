import chai from 'chai';
import lexicon from '../../../src/lang/en/lexicon.js';

const {expect} = chai;

// The lexicon carries each word with its length as spoken, in syllables.
// Phrasings are chosen by that length, so "27" (four syllables) is longer
// than "7th" (two) however they look on the page.
describe('English lexicon:', function() {
  it('counts syllables as spoken, not characters', function() {
    expect(lexicon.cardinal(7)).to.deep.equal({length: 2, text: '7'});
    expect(lexicon.cardinal(27).length).to.equal(4);
    expect(lexicon.cardinal(11).length).to.equal(3);
    expect(lexicon.cardinal(0).length).to.equal(2);
    expect(lexicon.ordinal(15)).to.deep.equal({length: 2, text: '15th'});
    expect(lexicon.ordinal(21)).to.deep.equal({length: 3, text: '21st'});
    expect(lexicon.ordinal(2)).to.deep.equal({length: 2, text: '2nd'});
    expect(lexicon.ordinal(13)).to.deep.equal({length: 2, text: '13th'});
    expect(lexicon.months[9].full).to.deep.equal(
      {length: 3, text: 'September'});
    expect(lexicon.weekdays[3].full).to.deep.equal(
      {length: 2, text: 'Wednesday'});
  });

  it('has every number a field can hold', function() {
    for (let n = 0; n <= 59; n += 1) {
      expect(lexicon.cardinal(n).length, String(n)).to.be.above(0);
    }

    for (let n = 1; n <= 31; n += 1) {
      expect(lexicon.ordinal(n).text, String(n)).to.match(/^\d+(?:st|nd|rd|th)$/u);
    }
  });

  it('reads the minutes of a time and a year the way they are said',
    function() {
      expect(lexicon.clockMinute(5)).to.deep.equal({length: 2, text: '05'});
      expect(lexicon.clockMinute(30)).to.deep.equal({length: 2, text: '30'});
      expect(lexicon.year(2030)).to.deep.equal({length: 4, text: '2030'});
      expect(lexicon.year(2007).length).to.equal(5);
    });

  it('abbreviates names without changing how long they are said', function() {
    expect(lexicon.months[6].short).to.deep.equal({length: 1, text: 'Jun'});
    expect(lexicon.weekdays[1].short).to.deep.equal({length: 2, text: 'Mon'});
    expect(lexicon.weekdays[1].plural).to.deep.equal(
      {length: 2, text: 'Mondays'});
    expect(lexicon.weekdays[1].shortPlural).to.deep.equal(
      {length: 2, text: 'Mons'});
  });

  it('names an interval as a word', function() {
    expect(lexicon.intervalWord(2)).to.deep.equal({length: 2, text: 'other'});
    expect(lexicon.intervalWord(3)).to.deep.equal({length: 1, text: 'third'});
    expect(lexicon.intervalWord(12)).to.deep.equal(
      {length: 1, text: 'twelfth'});
  });

  it('reads round and early years, and tens, as they are said', function() {
    expect(lexicon.year(1900).length).to.equal(4);
    expect(lexicon.year(2000).length).to.equal(3);
    expect(lexicon.year(1905).length).to.equal(4);
    expect(lexicon.year(1999).length).to.equal(5);
    expect(lexicon.cardinal(50).length).to.equal(2);
    expect(lexicon.ordinal(20)).to.deep.equal({length: 3, text: '20th'});
    expect(lexicon.ordinal(11).text).to.equal('11th');
    expect(lexicon.ordinal(22).text).to.equal('22nd');
    expect(lexicon.ordinal(23).text).to.equal('23rd');
    expect(lexicon.ordinal(31)).to.deep.equal({length: 3, text: '31st'});
  });

  it('estimates a word it does not hold', function() {
    expect(lexicon.estimateSyllables('through')).to.equal(1);
    expect(lexicon.estimateSyllables('until')).to.equal(2);
    expect(lexicon.estimateSyllables('-')).to.equal(1);
  });
});
