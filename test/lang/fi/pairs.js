import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import fi from '../../../src/lang/fi/index.js';

const {expect} = chai;

// Finnish minimal pairs: the language's known hazards as targeted probes
// (docs/i18n-design.md §4, pass 4). Each pair isolates one morphological
// trap.

function reads(pattern, expected, options) {
  it(pattern + ' → ' + expected, function() {
    expect(cronli5(pattern, {...options || {}, lang: fi}))
      .to.equal(expected);
  });
}

describe('Suomi (fi) — minimiparit:', function() {
  describe('astevaihtelu: keskiviikko taipuu k:lla, maanantai ei', function() {
    reads('0 9 * * WED-FRI', 'keskiviikosta perjantaihin klo 9');
    reads('0 9 * * MON-WED', 'maanantaista keskiviikkoon klo 9');
    reads('0 9 * * MON-FRI', 'maanantaista perjantaihin klo 9');
  });

  describe('genetiivilukusanat välein-rakenteessa, numerot yli 10:n', function() {
    reads('*/2 * * * *', 'kahden minuutin välein');
    reads('*/10 * * * *', 'kymmenen minuutin välein');
    reads('*/15 * * * *', '15 minuutin välein');
  });

  describe('keskiyö ja keskipäivä vain tasan 12.00 ja 0.00', function() {
    reads('0 0 * * *', 'joka päivä keskiyöllä');
    reads('1 0 * * *', 'joka päivä klo 0.01');
    reads('0 12 * * *', 'joka päivä keskipäivällä');
    reads('1 12 * * *', 'joka päivä klo 12.01');
  });

  describe('klo: tasatunti ilman minuutteja', function() {
    reads('0 9 * * *', 'joka päivä klo 9');
    reads('30 9 * * *', 'joka päivä klo 9.30');
  });

  describe('distributiivi -isin vs. essiivi Quartz-muodoissa', function() {
    reads('0 0 * * MON', 'maanantaisin keskiyöllä');
    reads('0 0 * * 1L', 'kuukauden viimeisenä maanantaina keskiyöllä');
  });

  describe('inessiivi yhdessä kuussa, elatiivi–illatiivi välillä', function() {
    reads('0 12 * 6 *', 'joka päivä kesäkuussa keskipäivällä');
    reads('0 12 * 6-9 *',
      'joka päivä kesäkuusta syyskuuhun keskipäivällä');
  });

  describe('ampm-asetus ohitetaan: suomi on aina 24-tuntinen', function() {
    reads('30 17 * * *', 'joka päivä klo 17.30', {ampm: true});
    reads('30 17 * * *', 'joka päivä klo 17.30', {ampm: false});
  });

  describe('joka toinen päivä vs. kahden tunnin välein', function() {
    reads('0 0 */2 * *', 'joka toinen päivä keskiyöllä');
    reads('0 */2 * * *', 'kahden tunnin välein');
  });
});
