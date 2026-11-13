import chai from 'chai';
import lexicon from '../../../src/lang/ko/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Korean lexicon:', function() {
  it('names weekdays in full and in short, from Sunday', function() {
    expect(lexicon.weekdays[0]).to.deep.equal({full: '일요일', short: '일'});
    expect(lexicon.weekdays[1]).to.deep.equal({full: '월요일', short: '월'});
    expect(lexicon.weekdays[6]).to.deep.equal({full: '토요일', short: '토'});
    expect(lexicon.weekdays).to.have.length(7);
    expect(lexicon.weekdaySuffix).to.equal('요일');
  });

  it('lists the week from Monday to Sunday', function() {
    expect(lexicon.weekOrder).to.deep.equal([1, 2, 3, 4, 5, 6, 0]);
  });

  it('has each unit as it follows a numeral', function() {
    expect(lexicon.units).to.deep.equal({
      date: '일',
      hour: '시',
      hourBlock: '시대',
      hours: '시간',
      minute: '분',
      month: '월',
      second: '초',
      year: '년'
    });
  });

  it('has the five ordinals of an nth weekday', function() {
    expect(lexicon.nthWords)
      .to.deep.equal(['첫째', '둘째', '셋째', '넷째', '다섯째']);
  });

  it('holds words only', function() {
    Object.values(lexicon.words)
      .concat(lexicon.nthWords, Object.values(lexicon.units))
      .forEach(function isWord(word) {
        expect(word).to.be.a('string').and.not.equal('');
      });
  });
});
