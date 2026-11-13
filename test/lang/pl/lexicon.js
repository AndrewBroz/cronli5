import chai from 'chai';
import lexicon from '../../../src/lang/pl/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Polish lexicon:', function() {
  it('names months in the genitive, the locative and as a numeral',
    function() {
      expect(lexicon.months[6]).to.deep.equal(
        {genitive: 'czerwca', locative: 'czerwcu', roman: 'VI', w: 'w'});
      expect(lexicon.months[9]).to.deep.equal(
        {genitive: 'września', locative: 'wrześniu', roman: 'IX', w: 'we'});
      expect(lexicon.months).to.have.length(13);
    });

  it('names weekdays in every form the answers use', function() {
    expect(lexicon.weekdays[2]).to.deep.equal({
      accusativePlural: 'wtorki',
      accusativeSingular: 'wtorek',
      feminine: false,
      genitivePlural: 'wtorków',
      genitiveSingular: 'wtorku',
      short: 'wt.',
      w: 'we'
    });
    expect(lexicon.weekdays[3].genitivePlural).to.equal('śród');
    expect(lexicon.weekdays[0].feminine).to.equal(true);
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('orders the week from Monday to Sunday', function() {
    expect(lexicon.weekOrder).to.deep.equal([1, 2, 3, 4, 5, 6, 0]);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
  });

  it('has each unit in its three forms and in short', function() {
    expect(lexicon.units.minute).to.deep.equal(
      {few: 'minuty', many: 'minut', one: 'minutę', short: 'min'});
    expect(lexicon.units.hour.short).to.equal('godz.');
  });

  it('has the ordinals of an nth weekday and of every nth period',
    function() {
      expect(lexicon.ordinals.nthMasculine).to.have.length(5);
      expect(lexicon.ordinals.nthFeminine[1]).to.equal('drugą');
      expect(lexicon.ordinals.everyMasculine[0]).to.equal('drugim');
      expect(lexicon.ordinals.everyFeminine[0]).to.equal('drugiej');
    });

  it('holds words only', function() {
    Object.values(lexicon.words)
      .concat(Object.values(lexicon.dayParts))
      .concat(...Object.values(lexicon.ordinals))
      .forEach(function isWord(word) {
        expect(word).to.be.a('string').and.not.equal('');
      });
  });
});
