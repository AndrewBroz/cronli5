import chai from 'chai';
import lexicon from '../../../src/lang/es/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Spanish lexicon:', function() {
  it('names months and weekdays in full and in short', function() {
    expect(lexicon.months[9]).to.deep.equal(
      {full: 'septiembre', short: 'sep'});
    expect(lexicon.months).to.have.length(13);
    expect(lexicon.weekdays[1]).to.deep.equal(
      {full: 'lunes', plural: 'lunes', short: 'lun'});
    expect(lexicon.weekdays[6]).to.deep.equal(
      {full: 'sábado', plural: 'sábados', short: 'sáb'});
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
  });

  it('has each unit alone and in the plural', function() {
    expect(lexicon.units.minute).to.deep.equal(
      {many: 'minutos', one: 'minuto'});
  });

  it('holds words only', function() {
    Object.values(lexicon.words).concat(lexicon.nthWords)
      .forEach(function isWord(word) {
        expect(word).to.be.a('string').and.not.equal('');
      });
  });
});
