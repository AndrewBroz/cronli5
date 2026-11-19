import chai from 'chai';
import lexicon from '../../../src/lang/id/lexicon.js';

const {expect} = chai;

// The lexicon holds the words the renderer says and nothing else.
describe('Indonesian lexicon:', function() {
  it('names months and weekdays in full and in short', function() {
    expect(lexicon.months[8]).to.deep.equal({full: 'Agustus', short: 'Agu'});
    expect(lexicon.months[5]).to.deep.equal({full: 'Mei', short: 'Mei'});
    expect(lexicon.months).to.have.length(13);
    expect(lexicon.weekdays[1]).to.deep.equal({full: 'Senin', short: 'Sen'});
    expect(lexicon.weekdays[0]).to.deep.equal({full: 'Minggu', short: 'Min'});
    expect(lexicon.weekdays).to.have.length(7);
  });

  it('writes the parts of a clock time in two digits', function() {
    expect(lexicon.twoDigits(5)).to.equal('05');
  });

  it('writes a position with «ke-»', function() {
    expect(lexicon.ordinal(0)).to.equal('ke-0');
    expect(lexicon.ordinal(45)).to.equal('ke-45');
  });

  it('has one form of each unit', function() {
    expect(lexicon.units).to.deep.equal({
      day: 'hari',
      hour: 'jam',
      minute: 'menit',
      month: 'bulan',
      second: 'detik',
      year: 'tahun'
    });
  });

  it('has the ordinals of a weekday in the month and the parts of the day',
    function() {
      expect(lexicon.nthWords).to.deep.equal(
        ['pertama', 'kedua', 'ketiga', 'keempat', 'kelima']);
      expect(lexicon.dayParts).to.deep.equal({
        afternoon: 'sore',
        early: 'dini hari',
        midday: 'siang',
        morning: 'pagi',
        night: 'malam'
      });
    });

  it('holds words only', function() {
    Object.values(lexicon.words).forEach(function isWord(word) {
      expect(word).to.be.a('string').and.not.equal('');
    });
  });
});
