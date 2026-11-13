import chai from 'chai';
import lexicon from '../../../src/lang/de/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('German lexicon:', function() {
  it('names months and weekdays in full and in short', function() {
    expect(lexicon.months[3]).to.deep.equal({full: 'März', short: 'März'});
    expect(lexicon.months[9]).to.deep.equal(
      {full: 'September', short: 'Sept.'});
    expect(lexicon.months).to.have.length(13);
    expect(lexicon.januaryAustrian).to.deep.equal(
      {full: 'Jänner', short: 'Jän.'});
    expect(lexicon.weekdays[1]).to.deep.equal(
      {adverb: 'montags', full: 'Montag', short: 'Mo.'});
    expect(lexicon.weekdays[3]).to.deep.equal(
      {adverb: 'mittwochs', full: 'Mittwoch', short: 'Mi.'});
    expect(lexicon.weekdays[0]).to.deep.equal(
      {adverb: 'sonntags', full: 'Sonntag', short: 'So.'});
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
  });

  it('has each unit after one and after any other number', function() {
    expect(lexicon.units.minute).to.deep.equal(
      {many: 'Minuten', one: 'Minute'});
    expect(lexicon.units.day).to.deep.equal({many: 'Tage', one: 'Tag'});
  });

  it('gives every hour of the day one part of the day', function() {
    const {dayParts} = lexicon;

    expect(dayParts[dayParts.length - 1].until).to.equal(23);
    expect(dayParts[0].word).to.equal('nachts');
    expect(dayParts[dayParts.length - 1].word).to.equal('nachts');
    dayParts.slice(1).forEach(function later(part, index) {
      expect(part.until).to.be.above(dayParts[index].until);
    });
  });

  it('holds words only', function() {
    const partWords = lexicon.dayParts.map(function wordOf(part) {
      return part.word;
    });

    Object.values(lexicon.words)
      .concat(lexicon.nthWords, lexicon.fromLastWords, partWords)
      .forEach(function isWord(word) {
        expect(word).to.be.a('string').and.not.equal('');
      });
  });
});
