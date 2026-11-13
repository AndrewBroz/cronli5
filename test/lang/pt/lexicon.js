import chai from 'chai';
import lexicon from '../../../src/lang/pt/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Portuguese lexicon:', function() {
  it('names months in full and in short', function() {
    expect(lexicon.months[9]).to.deep.equal(
      {full: 'setembro', short: 'set'});
    expect(lexicon.months[5]).to.deep.equal({full: 'maio', short: 'mai'});
    expect(lexicon.months).to.have.length(13);
  });

  it('names weekdays as spoken, in full and in short, with a gender',
    function() {
      expect(lexicon.weekdays[1]).to.deep.equal({
        full: 'segunda-feira',
        fullPlural: 'segundas-feiras',
        gender: 'feminine',
        short: 'seg',
        spoken: 'segunda',
        spokenPlural: 'segundas'
      });
      expect(lexicon.weekdays[6]).to.deep.equal({
        full: 'sábado',
        fullPlural: 'sábados',
        gender: 'masculine',
        short: 'sáb',
        spoken: 'sábado',
        spokenPlural: 'sábados'
      });
      expect(lexicon.weekdays).to.have.length(7);
    });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
  });

  it('has each unit alone and in the plural', function() {
    expect(lexicon.units.minute).to.deep.equal(
      {many: 'minutos', one: 'minuto'});
    expect(lexicon.units.month).to.deep.equal({many: 'meses', one: 'mês'});
  });

  it('contracts each preposition with the article', function() {
    expect(lexicon.contractions.a.plural.feminine).to.equal('às');
    expect(lexicon.contractions.a.singular.feminine).to.equal('à');
    expect(lexicon.contractions.de.singular.feminine).to.equal('da');
    expect(lexicon.contractions.em.plural.masculine).to.equal('nos');
    expect(lexicon.articles.singular.masculine).to.equal('o');
  });

  it('has an ordinal of each gender for the nth weekday', function() {
    expect(lexicon.nthWords).to.have.length(5);
    expect(lexicon.nthWords[1]).to.deep.equal(
      {feminine: 'segunda', masculine: 'segundo'});
  });

  it('names the parts of the day in order', function() {
    expect(lexicon.dayParts.map(function start(part) {
      return part.from;
    })).to.deep.equal([0, 6, 12, 19]);
  });

  it('holds words only', function() {
    function check(entry) {
      if (typeof entry === 'string') {
        expect(entry).to.not.equal('');
      }
      else {
        expect(typeof entry).to.equal('object');
        Object.values(entry).forEach(check);
      }
    }

    check(lexicon.words);
    check(lexicon.nthWords);
    check(lexicon.contractions);
    check(lexicon.articles);
  });
});
