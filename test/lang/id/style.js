import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import indonesian, {styles} from '../../../src/lang/id/index.js';

const {expect} = chai;

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Indonesian module declares to the entry point: its code, its
// region and named style, and how it presents a description in each form.
describe('Indonesian styles:', function() {
  it('declares its code, its region and its named table', function() {
    expect(indonesian.code).to.equal('id');
    expect(indonesian.defaultStyle).to.equal('id');
    expect(indonesian.regions).to.deep.equal({ID: 'id'});
    expect(indonesian.styles).to.equal(styles);
    expect(styles.id).to.deep.equal(
      {hour12: false, separator: '.', short: false});
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.id)).to.equal(true);
  });

  it('applies overrides to a named table', function() {
    expect(indonesian.style('id')).to.deep.equal(styles.id);
    expect(indonesian.style('id', {separator: ':', short: true}))
      .to.deep.equal({hour12: false, separator: ':', short: true});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      indonesian.style('id', {pukul: false});
    }, /pukul.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      indonesian.style('id', {short: 'ya'});
    }, /short/u);
    throwsOption(function build() {
      indonesian.style('id', {separator: ','});
    }, /separator/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.id};

      expect(indonesian.label('setiap hari pukul 09.00', opts))
        .to.equal('Setiap hari pukul 09.00');
      expect(indonesian.label('hari terakhir setiap bulan pukul 00.00', opts))
        .to.equal('Hari terakhir setiap bulan pukul 00.00');
      expect(indonesian.label('Jumat terakhir setiap bulan pukul 09.00', opts))
        .to.equal('Jumat terakhir setiap bulan pukul 09.00');
      expect(indonesian.sentence('setiap hari pukul 09.00', opts))
        .to.equal('Dijalankan setiap hari pukul 09.00.');
      expect(indonesian.sentence('tidak pernah: tanggalnya tidak ada', opts))
        .to.equal('Tidak pernah dijalankan: tanggalnya tidak ada.');
      expect(indonesian.sentence(
        'tidak pernah: tanggalnya tidak ada pada tahun yang dipilih', opts))
        .to.equal('Tidak pernah dijalankan: tanggalnya tidak ada pada ' +
          'tahun yang dipilih.');
      expect(indonesian.reboot(opts)).to.equal('saat sistem dinyalakan');
      expect(indonesian.fallback(opts))
        .to.equal('pola cron yang tidak dikenali');
    });
});
