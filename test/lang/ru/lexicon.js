import chai from 'chai';
import lexicon from '../../../src/lang/ru/lexicon.js';

const {expect} = chai;

// Every string a table holds, however deep.
function strings(value) {
  if (typeof value === 'string') {
    return [value];
  }

  return value && typeof value === 'object' ?
    Object.values(value).flatMap(strings) :
    [];
}

// The lexicon holds the words the renderer says and nothing else.
describe('Russian lexicon:', function() {
  it('declines the months and gives their short forms', function() {
    expect(lexicon.months[9]).to.deep.equal({
      accusative: 'сентябрь',
      genitive: 'сентября',
      prepositional: 'сентябре',
      short: 'сент.'
    });
    expect(lexicon.months[3]).to.deep.equal({
      accusative: 'март',
      genitive: 'марта',
      prepositional: 'марте',
      short: null
    });
    expect(lexicon.months[5]).to.deep.equal({
      accusative: 'май',
      genitive: 'мая',
      prepositional: 'мае',
      short: null
    });
    expect(lexicon.months[8].genitive).to.equal('августа');
    expect(lexicon.months[0]).to.equal(null);
    expect(lexicon.months).to.have.length(13);
    expect(lexicon.months.slice(1).map(function shortOf(month) {
      return month.short;
    })).to.deep.equal([
      'янв.', 'февр.', null, 'апр.', null, null, null, 'авг.', 'сент.',
      'окт.', 'нояб.', 'дек.'
    ]);
  });

  it('declines the weekdays, from Sunday as cron counts them', function() {
    expect(lexicon.weekdays[0]).to.deep.equal({
      accusative: 'воскресенье',
      dativePlural: 'воскресеньям',
      gender: 'neuter',
      genitive: 'воскресенья',
      nominative: 'воскресенье',
      short: 'вс'
    });
    expect(lexicon.weekdays[3]).to.deep.equal({
      accusative: 'среду',
      dativePlural: 'средам',
      gender: 'feminine',
      genitive: 'среды',
      nominative: 'среда',
      short: 'ср'
    });
    expect(lexicon.weekdays[1].dativePlural).to.equal('понедельникам');
    expect(lexicon.weekdays.map(function shortOf(day) {
      return day.short;
    })).to.deep.equal(['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']);
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
    expect(lexicon.twoDigits(0)).to.equal('00');
  });

  it('has each unit after one, a few and many', function() {
    expect(lexicon.units.minute).to.deep.equal(
      {few: 'минуты', many: 'минут', one: 'минуту'});
    expect(lexicon.units.second).to.deep.equal(
      {few: 'секунды', many: 'секунд', one: 'секунду'});
    expect(lexicon.units.hour).to.deep.equal(
      {few: 'часа', many: 'часов', one: 'час'});
    expect(lexicon.units.day).to.deep.equal(
      {few: 'дня', many: 'дней', one: 'день'});
  });

  it('has each ordinal for a weekday of each gender', function() {
    expect(lexicon.nthWords[0]).to.deep.equal({
      feminine: 'первая',
      feminineAccusative: 'первую',
      masculine: 'первый',
      neuter: 'первое'
    });
    expect(lexicon.nthWords[1].masculine).to.equal('второй');
    expect(lexicon.nthWords[2]).to.deep.equal({
      feminine: 'третья',
      feminineAccusative: 'третью',
      masculine: 'третий',
      neuter: 'третье'
    });
    expect(lexicon.nthWords[3].neuter).to.equal('четвёртое');
    expect(lexicon.nthWords[4].feminineAccusative).to.equal('пятую');
    expect(lexicon.nthWords).to.have.length(5);
    expect(lexicon.words.last).to.deep.equal({
      feminine: 'последняя',
      feminineAccusative: 'последнюю',
      masculine: 'последний',
      neuter: 'последнее'
    });
  });

  it('holds words only', function() {
    strings(lexicon.words).forEach(function isWord(word) {
      expect(word).to.be.a('string').and.not.equal('');
    });
    expect(strings(lexicon.words).length).to.be.greaterThan(60);
  });

  it('writes Sunday short as Russian does, never as Ukrainian', function() {
    expect(strings(lexicon)).to.not.include('нд');
    expect(lexicon.words.in).to.equal('в');
  });
});
