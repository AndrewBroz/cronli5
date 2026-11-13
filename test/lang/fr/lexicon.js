import chai from 'chai';
import lexicon from '../../../src/lang/fr/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('French lexicon:', function() {
  it('names months and weekdays in full and in short', function() {
    expect(lexicon.months[9]).to.deep.equal(
      {full: 'septembre', short: 'sept.'});
    expect(lexicon.months[6]).to.deep.equal({full: 'juin', short: 'juin'});
    expect(lexicon.months).to.have.length(13);
    expect(lexicon.weekdays[1]).to.deep.equal(
      {full: 'lundi', short: 'lun.'});
    expect(lexicon.weekdays[0]).to.deep.equal(
      {full: 'dimanche', short: 'dim.'});
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
  });

  it('elides «de» before a vowel, in the full form and the short',
    function() {
      expect(lexicon.of('juin')).to.equal('de juin');
      expect(lexicon.of('avril')).to.equal('d\'avril');
      expect(lexicon.of('août')).to.equal('d\'août');
      expect(lexicon.of('oct.')).to.equal('d\'oct.');
    });

  it('marks the first day of a month, and no other', function() {
    expect(lexicon.dayNumber(1)).to.equal('1er');
    expect(lexicon.dayNumber(2)).to.equal('2');
    expect(lexicon.dayNumber(21)).to.equal('21');
    expect(lexicon.nthFromEnd(3)).to.equal('3e');
  });

  it('has each unit alone and in the plural, with its «tous les»',
    function() {
      expect(lexicon.units.minute).to.deep.equal(
        {every: 'toutes les', many: 'minutes', one: 'minute'});
      expect(lexicon.units.day).to.deep.equal(
        {every: 'tous les', many: 'jours', one: 'jour'});
    });

  it('holds words only', function() {
    Object.values(lexicon.words).concat(lexicon.nthWords)
      .forEach(function isWord(word) {
        expect(word).to.be.a('string').and.not.equal('');
      });
  });
});
