import chai from 'chai';
import lexicon from '../../../src/lang/cs/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Czech lexicon:', function() {
  it('names months in the two cases a description uses', function() {
    expect(lexicon.months[6]).to.deep.equal(
      {genitive: 'června', locative: 'červnu'});
    expect(lexicon.months[9]).to.deep.equal(
      {genitive: 'září', locative: 'září'});
    expect(lexicon.months).to.have.length(13);
  });

  it('names weekdays by case, gender and short form, Sunday at 0',
    function() {
      expect(lexicon.weekdays[0]).to.deep.equal({
        accusative: 'neděli', gender: 'feminine', genitive: 'neděle',
        short: 'Ne'
      });
      expect(lexicon.weekdays[4]).to.deep.equal({
        accusative: 'čtvrtek', gender: 'masculine', genitive: 'čtvrtka',
        short: 'Čt'
      });
      expect(lexicon.weekdays.map(function shortOf(day) {
        return day.short;
      })).to.deep.equal(['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So']);
    });

  it('agrees «každý» and the ordinals with a weekday\'s gender', function() {
    expect(lexicon.every[lexicon.weekdays[1].gender]).to.equal('každé');
    expect(lexicon.every[lexicon.weekdays[3].gender]).to.equal('každou');
    expect(lexicon.every[lexicon.weekdays[5].gender]).to.equal('každý');
    expect(lexicon.nthWords[1]).to.deep.equal(
      {feminine: 'druhou', masculine: 'druhý', neuter: 'druhé'});
    expect(lexicon.nthWords).to.have.length(5);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
  });

  it('has each unit after one, after two to four, and after five',
    function() {
      expect(lexicon.units.minute).to.deep.equal(
        {few: 'minuty', many: 'minut', one: 'minutu'});
      expect(lexicon.units.second).to.deep.equal(
        {few: 'sekundy', many: 'sekund', one: 'sekundu'});
      expect(lexicon.units.day).to.deep.equal(
        {few: 'dny', many: 'dní', one: 'den'});
    });

  it('has the step of a cadence as a word, from the second to the tenth',
    function() {
      expect(lexicon.stepWords[0]).to.equal('druhý');
      expect(lexicon.stepWords).to.have.length(9);
    });

  it('names the parts of the day in the order of the day', function() {
    const starts = lexicon.dayPeriods.map(function fromOf(period) {
      return period.from;
    });

    expect(starts).to.deep.equal([0, 4, 9, 12, 18, 22]);
    expect(lexicon.dayPeriods[0].word).to.equal(lexicon.dayPeriods[5].word);
  });

  it('holds words only', function() {
    const said = Object.values(lexicon.words)
      .concat(Object.values(lexicon.every))
      .concat(lexicon.nthWords.flatMap(Object.values))
      .concat(lexicon.stepWords)
      .concat(lexicon.dayPeriods.map(function wordOf(period) {
        return period.word;
      }));

    said.forEach(function isWord(word) {
      expect(word).to.be.a('string').and.not.equal('');
    });
  });
});
