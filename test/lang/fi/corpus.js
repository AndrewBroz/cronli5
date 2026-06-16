import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import fi from '../../../src/lang/fi/index.js';

const {expect} = chai;

// The Finnish corpus: the reviewed expectation suite that makes the
// module trustworthy (docs/i18n-design.md §2.4). Each entry is exact
// output. Finnish is the agglutinative stress test (§5): ranges,
// distributives, and date anchors are case constructions, and `klo`
// phrases carry no case at all.

function run(cases) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...values[2] || {}, lang: fi};

    describe(JSON.stringify(pattern), function() {
      it('luetaan "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

describe('Suomi (fi):', function() {
  describe('perusfrekvenssit', function() {
    run([
      ['* * * * *', 'joka minuutti'],
      ['*/2 * * * *', 'kahden minuutin välein'],
      ['*/5 * * * *', 'viiden minuutin välein'],
      ['*/15 * * * *', '15 minuutin välein'],
      ['0 * * * *', 'joka tunti'],
      ['0 0 * * *', 'joka päivä keskiyöllä'],
      ['* * * * * *', 'joka sekunti'],
      ['*/15 * * * * *', '15 sekunnin välein'],
      ['@reboot', 'järjestelmän käynnistyessä'],
      ['nonsense', 'tunnistamaton cron-lauseke', {lenient: true}]
    ]);
  });

  describe('kellonajat', function() {
    run([
      ['0 12 * * *', 'joka päivä keskipäivällä'],
      ['0 9 * * *', 'joka päivä klo 9'],
      ['30 9 * * *', 'joka päivä klo 9.30'],
      ['30 17 * * *', 'joka päivä klo 17.30'],
      ['0 9,17 * * *', 'joka päivä klo 9 ja 17'],
      ['30 9,17 * * *', 'joka päivä klo 9.30 ja 17.30'],
      ['0 0,12 * * *', 'joka päivä klo 0 ja 12'],
      ['30 17 * * *', 'joka päivä klo 17:30', {dialect: {sep: ':'}}],
      ['30 17 * * *', 'joka päivä klo 17.30', {ampm: true}],
      ['15 30 9 * * *', 'joka päivä klo 9.30.15'],
      ['5 */6 * * *', 'joka päivä klo 0.05, 6.05, 12.05 ja 18.05']
    ]);
  });

  describe('viikonpäivät', function() {
    run([
      ['0 12 * * MON', 'maanantaisin keskipäivällä'],
      ['0 12 * * SUN', 'sunnuntaisin keskipäivällä'],
      ['0 9 * * WED', 'keskiviikkoisin klo 9'],
      ['0 9 * * MON-FRI', 'maanantaista perjantaihin klo 9'],
      ['0 0 * * FRI-MON', 'perjantaista maanantaihin keskiyöllä'],
      ['0 12 * * MON,WED,FRI',
        'maanantaisin, keskiviikkoisin ja perjantaisin keskipäivällä'],
      ['0 12 * * 0,1/2',
        'sunnuntaisin, maanantaisin, keskiviikkoisin ja perjantaisin ' +
        'keskipäivällä'],
      ['0 0 * * 1-5,0',
        'sunnuntaisin ja maanantaista perjantaihin keskiyöllä']
    ]);
  });

  describe('kuukaudet ja päivämäärät', function() {
    run([
      ['0 12 1 1 *', 'tammikuun 1. päivänä keskipäivällä'],
      ['0 0 13 * *', 'kuukauden 13. päivänä keskiyöllä'],
      ['0 * 13 * *', 'joka tunti kuukauden 13. päivänä'],
      ['0 0 1,15 * *', 'kuukauden 1. ja 15. päivänä keskiyöllä'],
      ['0 0 1-15 * *', 'kuukauden 1.–15. päivänä keskiyöllä'],
      ['0 0 1-15/3 * *',
        'kuukauden 1., 4., 7., 10. ja 13. päivänä keskiyöllä'],
      ['0 12 * 6,12 *',
        'joka päivä kesäkuussa ja joulukuussa keskipäivällä'],
      ['0 12 * 11-2 *',
        'joka päivä marraskuusta helmikuuhun keskipäivällä'],
      ['0 12 * 1,3-6 *',
        'joka päivä tammikuussa ja maaliskuusta kesäkuuhun keskipäivällä'],
      ['0 12 * 1,6/3 *',
        'joka päivä tammikuussa, kesäkuussa, syyskuussa ja joulukuussa ' +
        'keskipäivällä'],
      ['0 0 1 6-9 *',
        'kuukauden 1. päivänä kesäkuusta syyskuuhun keskiyöllä'],
      ['0 0 12 25 12 * 2030',
        'joulukuun 25. päivänä vuonna 2030 keskipäivällä'],
      ['0 0 13 * FRI',
        'kuukauden 13. päivänä tai perjantaisin keskiyöllä'],
      ['0 0 1 6-9 FRI',
        'kuukauden 1. päivänä tai perjantaisin kesäkuusta syyskuuhun ' +
        'keskiyöllä']
    ]);
  });

  describe('päivä- ja kuukausiaskeleet', function() {
    run([
      ['0 0 */2 * *', 'joka toinen päivä keskiyöllä'],
      ['0 0 */2 6 *', 'joka toinen päivä kesäkuussa keskiyöllä'],
      ['0 0 5/3 * *', 'joka kolmas päivä 5. päivästä alkaen keskiyöllä'],
      ['0 12 1 */3 *',
        'joka kolmannen kuukauden 1. päivänä keskipäivällä'],
      ['0 12 1 2/3 *',
        'joka kolmannen kuukauden 1. päivänä helmikuusta alkaen ' +
        'keskipäivällä']
    ]);
  });

  describe('Quartz', function() {
    run([
      ['0 0 L * *', 'kuukauden viimeisenä päivänä keskiyöllä'],
      ['0 0 LW * *', 'kuukauden viimeisenä arkipäivänä keskiyöllä'],
      ['0 0 L-5 * *',
        '5 päivää ennen kuukauden viimeistä päivää keskiyöllä'],
      ['0 0 L-1 * *',
        'päivää ennen kuukauden viimeistä päivää keskiyöllä'],
      ['0 0 15W * *',
        'arkipäivänä lähinnä kuukauden 15. päivää keskiyöllä'],
      ['0 0 * * 5L', 'kuukauden viimeisenä perjantaina keskiyöllä'],
      ['0 0 * * MON#2', 'kuukauden toisena maanantaina keskiyöllä'],
      // A Quartz date OR'd with a weekday under a ranged month (fuzzer-found
      // crash: the ranged-month branch assumed the date had segments).
      ['0 0 L 6-8 MON',
        'kuukauden viimeisenä päivänä tai maanantaisin kesäkuusta ' +
        'elokuuhun keskiyöllä']
    ]);
  });

  describe('ankkuroidut minuutit ja sekunnit', function() {
    run([
      ['30 * * * *', 'joka tunti 30 minuutin kohdalla'],
      ['0,30 * * * *', 'joka tunti 0 ja 30 minuutin kohdalla'],
      ['0-29 * * * *', 'joka tunti 0–29 minuutin kohdalla'],
      ['5-10,20 * * * *', 'joka tunti 5–10 ja 20 minuutin kohdalla'],
      ['5,30-40/5 * * * *',
        'joka tunti 5, 30, 35 ja 40 minuutin kohdalla'],
      ['*/31 * * * *', 'joka tunti 0 ja 31 minuutin kohdalla'],
      ['*/17 * * * *', '17 minuutin välein tasatunnista alkaen'],
      ['1/3 * * * *',
        'kolmen minuutin välein jokaisen tunnin minuutista 1 alkaen'],
      ['15 * * * * *', 'joka minuutti 15 sekunnin kohdalla'],
      ['0,30 * * * * *', 'joka minuutti 0 ja 30 sekunnin kohdalla'],
      ['0-30 * * * * *', 'joka minuutti 0–30 sekunnin kohdalla'],
      ['15 30 * * * *', 'joka tunti 30 minuutin ja 15 sekunnin kohdalla'],
      ['*/15 30 * * * *',
        '15 sekunnin välein, joka tunti 30 minuutin kohdalla'],
      ['*/7 * * * * *', 'seitsemän sekunnin välein joka minuutti']
    ]);
  });

  describe('yhdistelmät', function() {
    run([
      ['*/15 9-17 * * *', '15 minuutin välein klo 9.00–17.45'],
      ['* 9 * * *', 'joka minuutti klo 9.00–9.59'],
      ['0 9-17 * * *', 'joka tunti klo 9–17'],
      ['0 22-2 * * *', 'joka tunti klo 22–2'],
      ['30 9-17 * * *', '30 minuutin kohdalla klo 9.30–17.30'],
      ['*/15 9,17 * * *',
        '15 minuutin välein klo 9.00–9.59 ja 17.00–17.59'],
      ['*/15 9-17 * * MON-FRI',
        '15 minuutin välein klo 9.00–17.45 maanantaista perjantaihin'],
      ['* 9,17 * * *', 'joka minuutti klo 9.00–9.59 ja 17.00–17.59'],
      ['0-30 9,17 * * *', '0–30 minuutin kohdalla klo 9 ja 17'],
      ['0-30 */2 * * *', '0–30 minuutin kohdalla joka toinen tunti'],
      ['* */2 * * *', 'joka minuutti, joka toinen tunti'],
      ['* */10 * * *', 'joka minuutti, klo 0, 10 ja 20'],
      ['*/15 */2 * * *', '15 minuutin välein joka toinen tunti'],
      ['0 */2 * * *', 'kahden tunnin välein'],
      ['0 */5 * * *', 'viiden tunnin välein keskiyöstä alkaen'],
      ['0 */10 * * *', 'klo 0, 10 ja 20'],
      ['0 3/7 * * *', 'klo 3, 10 ja 17'],
      ['0 1/5 * * *', 'viiden tunnin välein klo 1 alkaen'],
      ['30 9-20,22 * * *', 'joka päivä klo 9.30–20.30 ja 22.30'],
      ['0,30 8-18/2 * * *',
        'joka tunti 0 ja 30 minuutin kohdalla, klo 8, 10, 12, 14, 16 ' +
        'ja 18'],
      ['*/15 30 9 * * *', '15 sekunnin välein, joka päivä klo 9.30'],
      ['1 1 * * * *', 'joka tunti 1 minuutin ja 1 sekunnin kohdalla'],
      ['*/15 * * * MON', '15 minuutin välein maanantaisin'],
      ['*/15 * 13 * *', '15 minuutin välein kuukauden 13. päivänä'],
      ['*/15 * * 6 *', '15 minuutin välein kesäkuussa'],
      ['*/15 * * 6-9 *', '15 minuutin välein kesäkuusta syyskuuhun'],
      ['* * * * MON', 'joka minuutti maanantaisin'],
      ['0 * * * MON', 'joka tunti maanantaisin'],
      ['*/15 * 13 * 5',
        '15 minuutin välein kuukauden 13. päivänä tai perjantaisin']
    ]);
  });

  describe('harvinaiset muodot', function() {
    run([
      ['* 30 9 * * *', 'joka sekunti, joka päivä klo 9.30'],
      ['5 0,30 * * * *',
        'joka minuutti 5 sekunnin kohdalla, ' +
        'joka tunti 0 ja 30 minuutin kohdalla'],
      ['30-40/5 * * * * *', 'joka minuutti 30, 35 ja 40 sekunnin kohdalla'],
      ['40/15 * * * *', 'joka tunti 40 ja 55 minuutin kohdalla'],
      ['* 9-17 * * *', 'joka minuutti klo 9.00–17.59'],
      ['0-30 9-17 * * *', '0–30 minuutin kohdalla klo 9.00–17.30'],
      ['0,30 9-17 * * *',
        'joka tunti 0 ja 30 minuutin kohdalla klo 9.00–17.30'],
      ['0 9-17/2 * * *', 'klo 9, 11, 13, 15 ja 17'],
      ['0-30 1/6 * * *',
        '0–30 minuutin kohdalla, kuuden tunnin välein klo 1 alkaen'],
      ['* 8-18,22 * * *',
        'joka minuutti klo 8.00–18.59 ja 22.00–22.59'],
      ['5-10 1,3,5,7,9,11,13 * * *',
        '5–10 minuutin kohdalla klo 1, 3, 5, 7, 9, 11 ja 13'],
      ['0 9 * * 7', 'sunnuntaisin klo 9'],
      ['0 0 12 1 1 * 2030-2032',
        'tammikuun 1. päivänä keskipäivällä vuosina 2030–2032'],
      ['0 0 12 1 1 * 2030,2033',
        'tammikuun 1. päivänä keskipäivällä vuosina 2030 ja 2033'],
      ['0 0 12 1 1 * */2',
        'tammikuun 1. päivänä keskipäivällä joka toinen vuosi'],
      ['0 0 12 1 1 * */1', 'tammikuun 1. päivänä keskipäivällä joka vuosi'],
      ['0 0 12 1 1 * 2030/3',
        'tammikuun 1. päivänä keskipäivällä ' +
        'joka kolmas vuosi vuodesta 2030 alkaen'],
      ['0 9 * * * 2030', 'joka päivä klo 9 vuonna 2030', {years: true}],
      ['0 0 */11 * *', 'joka 11. päivä keskiyöllä'],
      ['0 12 1 */11 *', 'joka 11. kuukauden 1. päivänä keskipäivällä'],
      ['0 0 */2 * *', 'joka 2. päivä keskiyöllä', {short: true}],
      ['*/5 * * * *', '5 minuutin välein', {short: true}],
      ['0 9-10/5 * * *', 'klo 9'],
      ['* 1-13/2,20 * * *',
        'joka minuutti klo 1.00–1.59, 3.00–3.59, 5.00–5.59, 7.00–7.59, ' +
        '9.00–9.59, 11.00–11.59, 13.00–13.59 ja 20.00–20.59']
    ]);
  });
});
