import chai from 'chai';
import lexicon from '../../../src/lang/it/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Italian lexicon:', function() {
  it('names months and weekdays in full and in short', function() {
    expect(lexicon.months[9]).to.deep.equal(
      {full: 'settembre', short: 'set'});
    expect(lexicon.months).to.have.length(13);
    expect(lexicon.weekdays[1]).to.deep.equal(
      {feminine: false, full: 'lunedì', short: 'lun'});
    expect(lexicon.weekdays[0]).to.deep.equal(
      {feminine: true, full: 'domenica', short: 'dom'});
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
  });

  it('has each unit alone and in the plural', function() {
    expect(lexicon.units.minute).to.deep.equal(
      {many: 'minuti', one: 'minuto'});
    expect(lexicon.units.year).to.deep.equal({many: 'anni', one: 'anno'});
  });

  it('has each ordinal for a masculine and a feminine weekday', function() {
    expect(lexicon.nthWords[0]).to.deep.equal(
      {feminine: 'prima', masculine: 'primo'});
    expect(lexicon.nthWords[4]).to.deep.equal(
      {feminine: 'quinta', masculine: 'quinto'});
    expect(lexicon.words.last).to.deep.equal(
      {feminine: 'ultima', masculine: 'ultimo'});
  });

  it('holds words only', function() {
    const {last, ...plain} = lexicon.words;

    Object.values(plain).concat(Object.values(last))
      .forEach(function isWord(word) {
        expect(word).to.be.a('string').and.not.equal('');
      });
  });
});
