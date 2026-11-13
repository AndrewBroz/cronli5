import chai from 'chai';
import lexicon from '../../../src/lang/uk/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says, in the forms its phrases
// need, and nothing else.
describe('Ukrainian lexicon:', function() {
  it('sorts a number into one, few or many', function() {
    const sorted = [1, 2, 4, 5, 11, 12, 14, 15, 20, 21, 22, 25, 30, 31, 59]
      .map(lexicon.category);

    expect(sorted).to.deep.equal(['one', 'few', 'few', 'many', 'many', 'many',
      'many', 'many', 'many', 'one', 'few', 'many', 'many', 'one', 'many']);
  });

  it('names months and weekdays in each case a phrase takes', function() {
    expect(lexicon.months[6]).to.deep.equal(
      {genitive: 'червня', locative: 'червні', short: 'черв.'});
    expect(lexicon.months).to.have.length(13);
    expect(lexicon.weekdays[1]).to.deep.equal({
      accusative: 'понеділок',
      every: 'щопонеділка',
      feminine: false,
      genitive: 'понеділка',
      nominative: 'понеділок',
      short: 'пн'
    });
    expect(lexicon.weekdays[5].every).to.equal('щоп\'ятниці');
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('has each unit in the forms a cadence takes', function() {
    expect(lexicon.units.minute).to.include(
      {few: 'хвилини', locative: 'хвилині', many: 'хвилин', one: 'хвилину'});
    expect(lexicon.units.day).to.include(
      {few: 'дні', many: 'днів', one: 'день'});
  });

  it('holds words only', function() {
    Object.values(lexicon.words)
      .concat(lexicon.nthWords.feminine, lexicon.nthWords.masculine)
      .forEach(function isWord(word) {
        expect(word).to.be.a('string').and.not.equal('');
      });
  });
});
