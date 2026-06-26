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
      // Restricted-month date-or-weekday union: month leads, time follows, joko…tai union last.
      ['0 0 1 1 MON',
        'tammikuussa keskiyöllä joko 1. päivänä tai maanantaisin'],
      ['0 0 1 6-9 FRI',
        'kesäkuusta syyskuuhun keskiyöllä joko 1. päivänä tai perjantaisin'],
      ['5 9-17 1,15 6-8 MON-FRI',
        'kesäkuusta elokuuhun 5 minuutin kohdalla klo 9.05–17.05 ' +
        'joko 1. ja 15. päivänä tai maanantaista perjantaihin'],
      // Month-list case: inessive list fronts the union.
      ['5 */5 1 1,7 MON',
        'tammikuussa ja heinäkuussa klo 0.05, 5.05, 10.05, 15.05 ja 20.05 ' +
        'joko 1. päivänä tai maanantaisin'],
      // Anchored minute step: bare hours, hours-first reorder, OR-scope.
      ['*/45 */5 1-5 6 MON-FRI',
        'kesäkuussa klo 0, 5, 10, 15 ja 20 aina minuuttien 0 ja 45 kohdalla ' +
        'joko 1.–5. päivänä tai maanantaista perjantaihin'],
      // Range+isolated hours under a restricted-month union: minute-first, sekä klo.
      ['5,10,30 9-20,22 1 1 MON',
        'tammikuussa 5, 10 ja 30 minuutin kohdalla klo 9–20 sekä klo 22 ' +
        'joko 1. päivänä tai maanantaisin']
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
        'kuukauden 15. päivää lähinnä olevana arkipäivänä keskiyöllä'],
      ['30 9 15W 6 *',
        'kuukauden 15. päivää lähinnä olevana arkipäivänä kesäkuussa klo 9.30'],
      ['0 0 * * 5L', 'kuukauden viimeisenä perjantaina keskiyöllä'],
      ['0 0 * * MON#2', 'kuukauden toisena maanantaina keskiyöllä'],
      // A Quartz date OR'd with a weekday under a ranged month (fuzzer-found
      // crash: the ranged-month branch assumed the date had segments).
      // Restricted month fronts + joko…tai union last.
      ['0 0 L 6-8 MON',
        'kesäkuusta elokuuhun keskiyöllä joko kuukauden viimeisenä päivänä ' +
        'tai maanantaisin']
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
      ['*/17 * * * *', 'joka tunti 0, 17, 34 ja 51 minuutin kohdalla'],
      ['1/3 * * * *',
        'kolmen minuutin välein jokaisen tunnin minuutista 1 alkaen'],
      // A uniform offset step (interval divides the cycle, start within the
      // first interval) wraps cleanly: name only its start ("minuutista M
      // alkaen"), keeping the cadence rather than enumerating the offset fires.
      ['5/6 * * * *',
        'kuuden minuutin välein jokaisen tunnin minuutista 5 alkaen'],
      ['11/12 * * * *',
        '12 minuutin välein jokaisen tunnin minuutista 11 alkaen'],
      // An uneven step (interval does not divide the cycle) and an offset step
      // (start >= interval) fire a non-uniform bounded set: named with its
      // interval and both endpoints ("minuutista M minuuttiin K"), not listed.
      ['*/7 * * * *',
        'seitsemän minuutin välein minuutista 0 minuuttiin 56'],
      ['3/2 * * * *',
        'kahden minuutin välein minuutista 3 minuuttiin 59'],
      ['7/9 * * * *',
        'yhdeksän minuutin välein minuutista 7 minuuttiin 52'],
      ['15 * * * * *', 'joka minuutti 15 sekunnin kohdalla'],
      ['0,30 * * * * *', 'joka minuutti 0 ja 30 sekunnin kohdalla'],
      ['0-30 * * * * *', 'joka minuutti 0–30 sekunnin kohdalla'],
      ['15 30 * * * *', 'joka tunti 30 minuutin ja 15 sekunnin kohdalla'],
      ['*/15 30 * * * *',
        '15 sekunnin välein, joka tunti 30 minuutin kohdalla'],
      ['*/7 * * * * *',
        'seitsemän sekunnin välein sekunnista 0 sekuntiin 56'],
      // Compounded: a stepped second over a stepped minute, each a cadence.
      ['3/2 1/2 * * * *',
        'kahden minuutin välein jokaisen tunnin minuutista 1 alkaen, ' +
        'kahden sekunnin välein sekunnista 3 sekuntiin 59']
    ]);
  });

  describe('yhdistelmät', function() {
    run([
      ['*/15 9-17 * * *', '15 minuutin välein klo 9.00–17.45'],
      // A single hour with a wildcard minute is the whole hour: it reads as
      // that hour ("kello 9 aikana"), not a synthesized "klo 9.00–9.59" range.
      ['* 9 * * *', 'joka minuutti kello 9 aikana'],
      ['* 0 * * *', 'joka minuutti kello 0 aikana'],
      ['* 12 * * *', 'joka minuutti kello 12 aikana'],
      ['0 9-17 * * *', 'joka tunti klo 9–17'],
      ['0 22-2 * * *', 'joka tunti klo 22–2'],
      ['30 9-17 * * *', '30 minuutin kohdalla klo 9.30–17.30'],
      // Under an hour LIST or STEP, the minute is named once and the on-the-
      // hour hours are listed; a per-hour minute span is never repeated. (A
      // real hour RANGE keeps its window — see the guards below.)
      ['*/15 9,17 * * *', '15 minuutin välein klo 9 ja 17'],
      // A uniform offset stride with many fires keeps the cadence form (not
      // an anchored list); the hour list is named once.
      ['2/3 9,17 * * *',
        'kolmen minuutin välein jokaisen tunnin minuutista 2 alkaen ' +
        'klo 9 ja 17'],
      ['*/15 9-17 * * MON-FRI',
        '15 minuutin välein klo 9.00–17.45 maanantaista perjantaihin'],
      ['* 9,17 * * *', 'joka minuutti klo 9 ja 17'],
      ['* */5 * * *', 'joka minuutti klo 0, 5, 10, 15 ja 20'],
      ['5/15 */5 * * *',
        '15 minuutin välein jokaisen tunnin minuutista 5 alkaen ' +
        'klo 0, 5, 10, 15 ja 20'],
      ['0-30 9,17 * * *', 'klo 9 ja 17 aina minuuttien 0–30 kohdalla'],
      // Minute range over range+isolated hours: minute-first, sekä klo.
      ['0-30 9-20,22 * * *', '0–30 minuutin kohdalla klo 9–20 sekä klo 22'],
      ['0-30 */2 * * *', '0–30 minuutin kohdalla joka toinen tunti'],
      // A minute list under a clean stride keeps the same step phrase the
      // range and wildcard forms do, never enumerating the hours.
      ['5,30 */2 * * *', '5 ja 30 minuutin kohdalla joka toinen tunti'],
      ['5,30 1/2 * * *',
        '5 ja 30 minuutin kohdalla, kahden tunnin välein klo 1:stä alkaen'],
      ['* */2 * * *', 'joka minuutti joka toisen tunnin aikana'],
      ['* */10 * * *', 'joka minuutti klo 0, 10 ja 20'],
      // A clean hour step confines the cadence to every Nth hour, not a
      // second, conflicting cadence ("joka toinen tunti").
      ['*/15 */2 * * *', '15 minuutin välein joka toisen tunnin aikana'],
      // An offset stride keeps the confinement and names its start.
      ['*/15 1/2 * * *',
        '15 minuutin välein joka toisen tunnin aikana kello 1:stä alkaen'],
      ['*/15 1/3 * * *',
        '15 minuutin välein joka kolmannen tunnin aikana kello 1:stä alkaen'],
      ['* 1/2 * * *', 'joka minuutti joka toisen tunnin aikana kello 1:stä alkaen'],
      // An uneven or bounded hour step lists its active hours as windows.
      ['*/20 9-17/2 * * *',
        '20 minuutin välein klo 9, 11, 13, 15 ja 17'],
      ['0 */2 * * *', 'kahden tunnin välein'],
      ['0 */5 * * *', 'joka päivä klo 0, 5, 10, 15 ja 20'],
      ['0 */10 * * *', 'joka päivä klo 0, 10 ja 20'],
      ['0 3/7 * * *', 'joka päivä klo 3, 10 ja 17'],
      ['0 1/5 * * *', 'joka päivä klo 1, 6, 11, 16 ja 21'],
      // A bounded/offset hour stride reads as a cadence with its clock-time
      // bounds, not a wall of clock times.
      ['0 11/2 * * *',
        '0 sekunnin kohdalla, kahden tunnin välein klo 11–23'],
      ['0 13/3 * * *', 'joka päivä klo 13, 16, 19 ja 22'],
      // Uniform offset strides (interval divides the cycle, start within the
      // first interval) keep the cadence form: a short minute/hour stride
      // lists its fires, a longer one names interval + start.
      ['17/20 * * * *', 'joka tunti 17, 37 ja 57 minuutin kohdalla'],
      ['0 8/12 * * *', 'klo 8 ja 20'],
      ['0 2/3 * * *', 'kolmen tunnin välein klo 2:sta alkaen'],
      // Pure-hour range+isolated enumeration: sekä klo joins the isolated value (non-window).
      ['0 9-20,22 * * *', 'joka päivä klo 9–20 sekä klo 22'],
      ['30 9-20,22 * * *', 'joka päivä klo 9.30–20.30 sekä klo 22.30'],
      ['0,30 8-18/2 * * *',
        'klo 8, 10, 12, 14, 16 ja 18 aina minuuttien 0 ja 30 kohdalla'],
      ['*/15 30 9 * * *', '15 sekunnin välein, joka päivä klo 9.30'],
      ['1 1 * * * *', 'joka tunti 1 minuutin ja 1 sekunnin kohdalla'],
      ['*/15 * * * MON', '15 minuutin välein maanantaisin'],
      ['*/15 * 13 * *', '15 minuutin välein kuukauden 13. päivänä'],
      ['*/15 * * 6 *', '15 minuutin välein kesäkuussa'],
      ['*/15 * * 6-9 *', '15 minuutin välein kesäkuusta syyskuuhun'],
      ['* * * * MON', 'joka minuutti maanantaisin'],
      ['0 * * * MON', 'joka tunti maanantaisin'],
      ['*/15 * 13 * 5',
        '15 minuutin välein kuukauden 13. päivänä tai perjantaisin'],
      // Hours-first reorder: anchored minute range/list over enumerated hours.
      // SAT,SUN + ranged month included.
      ['0-30 9-17/2 * 6-8 SAT,SUN',
        'klo 9, 11, 13, 15 ja 17 aina minuuttien 0–30 kohdalla ' +
        'sunnuntaisin ja lauantaisin kesäkuusta elokuuhun'],
      // Uneven step over list hours: enumerates into clock times.
      ['*/45 9,17 * 12 SAT,SUN',
        'sunnuntaisin ja lauantaisin joulukuussa klo 9, 9.45, 17 ja 17.45'],
      // A uniform offset step that fires few times stays an anchored kohdalla
      // list, so the hours-first reorder applies (hours lead, minutes follow).
      ['17/20 9,17 * 12 SAT,SUN',
        'klo 9 ja 17 aina minuuttien 17, 37 ja 57 kohdalla ' +
        'sunnuntaisin ja lauantaisin joulukuussa']
    ]);
  });

  // A sub-minute second with the minute pinned to 0 and a specific hour: the
  // minute-0 is a real one-minute confinement (60 fires in :00, not 3,600
  // across the hour). The clock minute must stay visible, so the seconds fire
  // "during" the explicit clock minute ("minuutin 9.00 aikana"), never the
  // bare hour ("klo 9"). The "of"-style frame, NOT a range — "minuutin
  // 9.00–9.59" would round-trip back to the whole hour.
  describe('minuutti kiinnitetty 0:aan tietyn tunnin alla', function() {
    run([
      ['* 0 0 * * *', 'joka sekunti minuutin 0.00 aikana, joka päivä'],
      ['* 0 9 * * *', 'joka sekunti minuutin 9.00 aikana, joka päivä'],
      ['* 0 12 * * *', 'joka sekunti minuutin 12.00 aikana, joka päivä'],
      ['* 0 9,11 * * *',
        'joka sekunti minuuttien 9.00 ja 11.00 aikana, joka päivä'],
      // An hour RANGE under a minute-0 confinement reads as a window, not a
      // wall of clock minutes: the one-minute window klo 9–17 (the hour-range
      // analog of the every-other-hour confinement below).
      ['* 0 9-17 * * *',
        'joka sekunti minuutin ajan klo 9–17'],
      // An hour step under a minute-0 confinement reads as a cadence, not a
      // wall of clock minutes: the one-minute window during every other hour.
      ['* 0 */2 * * *',
        'joka sekunti minuutin ajan joka toisen tunnin aikana'],
      ['* 0 9 * * MON', 'joka sekunti minuutin 9.00 aikana, maanantaisin'],
      ['*/15 0 9 * * *',
        '15 sekunnin välein minuutin 9.00 aikana, joka päivä']
    ]);
  });

  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute reads as a cadence, not a cross-product of clock times: the
  // minute/second lead clause, then the hour cadence ("kahden tunnin välein").
  // Irregular hour lists and ranges still enumerate.
  describe('tuntiaskel kadenssina tuntilistan sijaan', function() {
    run([
      ['30 0 */2 * * *',
        '30 sekunnin kohdalla, kahden tunnin välein'],
      ['5 0 */2 * * *',
        '5 sekunnin kohdalla, kahden tunnin välein'],
      ['30 */2 * * *',
        '30 minuutin kohdalla, kahden tunnin välein'],
      // An arithmetic-progression hour list compacts the same way.
      ['30 0 0,4,8,12,16,20 * * *',
        '30 sekunnin kohdalla, neljän tunnin välein'],
      // An offset stride that still tiles names only its start; a bounded one
      // pins both clock-time endpoints; the minute-0 confinement names the odd
      // stride's start, and a non-clean stride still confines to every Nth
      // hour.
      ['30 0 1/2 * * *',
        '30 sekunnin kohdalla, kahden tunnin välein klo 1:stä alkaen'],
      ['30 0 5,9,13,17,21 * * *',
        '30 sekunnin kohdalla, neljän tunnin välein klo 5–21'],
      ['* 0 1/2 * * *',
        'joka sekunti minuutin ajan joka toisen tunnin aikana ' +
        'kello 1:stä alkaen'],
      ['* 0 */3 * * *',
        'joka sekunti minuutin ajan joka kolmannen tunnin aikana'],
      // A non-zero pinned minute under an hour step: the second leads, then the
      // minute, then the hour cadence.
      ['30 5 */2 * * *',
        '30 sekunnin kohdalla, 5 minuutin kohdalla, kahden tunnin välein'],
      ['* 5 */2 * * *',
        'joka sekunti, 5 minuutin kohdalla, kahden tunnin välein'],
      // An hour RANGE reads as a window, not a wall of clock times: the
      // second/minute lead, then "klo 9–17" (see the dedicated hour-range
      // section below). Guard: an irregular hour list (no range) has no window
      // to form and still enumerates.
      ['30 0 9,17 * * *', 'joka päivä klo 9.00.30 ja 17.00.30'],
      ['30 0 9-17 * * *',
        '30 sekunnin kohdalla, klo 9–17'],
      // A clean hour step with a plain :00 stays the bare hour cadence.
      ['0 0 */2 * * *', 'kahden tunnin välein']
    ]);
  });

  // A single second under a multi-valued minute and a bounded hour step: the
  // compact clock-time rest owns the second lead, so the composer must not
  // prepend it again (which once doubled "30 sekunnin kohdalla").
  describe('sekunti minuuttiaskeleen ja rajatun tuntiaskeleen alla',
    function() {
      run([
        ['30 */25 9-17/2 * * *',
          '30 sekunnin kohdalla, klo 9, 11, 13, 15 ja 17 ' +
          'aina minuuttien 0, 25 ja 50 kohdalla']
      ]);
    });

  // An hour RANGE (or a list whose segments include a range) under minute 0
  // and a meaningful second used to expand into a wall of clock times; it now
  // reads as the hour-range window ("klo 9–17"). The hour-RANGE analog of the
  // hour-step cadence. A pure single-value hour list (9,17) has no range to
  // span and still enumerates.
  describe('tuntiväli ikkunana tuntilistan sijaan', function() {
    run([
      ['30 0 9-17 * * *',
        '30 sekunnin kohdalla, klo 9–17'],
      ['5,30 0 9-17 * * *',
        '5 ja 30 sekunnin kohdalla, klo 9–17'],
      ['0-10 0 9-17 * * *',
        '0–10 sekunnin kohdalla, klo 9–17'],
      // A wildcard or sub-minute step second is the one-minute window across
      // the range ("minuutin ajan klo 9–17"); "minuutin ajan" carries the :00,
      // distinct from the bare "joka tunti klo 9–17".
      ['* 0 9-17 * * *',
        'joka sekunti minuutin ajan klo 9–17'],
      ['*/15 0 9-17 * * *',
        '15 sekunnin välein minuutin ajan klo 9–17'],
      // A range inside a list: the contiguous span is a window, the
      // non-contiguous hour joins with "sekä klo".
      ['30 0 9-20,22 * * *',
        '30 sekunnin kohdalla, klo 9–20 sekä klo 22'],
      ['* 0 9-20,22 * * *',
        'joka sekunti minuutin ajan klo 9–20 sekä klo 22'],
      // The window carries the trailing day qualifier.
      ['30 0 9-17 * * MON',
        '30 sekunnin kohdalla, klo 9–17 maanantaisin'],
      // Guard: a pure single-value hour list (no range) still enumerates.
      ['30 0 9,17 * * *', 'joka päivä klo 9.00.30 ja 17.00.30']
    ]);
  });

  describe('harvinaiset muodot', function() {
    run([
      // Minute step leads its within-firing second anchor (comma separates).
      ['5,30 */15 9,17 1,15 * *',
        '15 minuutin välein, 5 ja 30 sekunnin kohdalla ' +
        'klo 9 ja 17 kuukauden 1. ja 15. päivänä'],
      ['* 30 9 * * *', 'joka sekunti, joka päivä klo 9.30'],
      // A wildcard second under a minute */2 binds the two cadences instead of
      // juxtaposing the contradictory "joka sekunti, kahden minuutin välein".
      ['* */2 * * * *', 'joka sekunti joka toisena minuuttina'],
      // Other strides keep the juxtaposed form.
      ['* */3 * * * *', 'joka sekunti, kolmen minuutin välein'],
      // Guards: no-seconds and restricted hour are unchanged.
      ['*/2 * * * *', 'kahden minuutin välein'],
      ['* */2 0 * * *', 'joka sekunti, kahden minuutin välein klo 0.00–0.58'],
      // Minute 0 under a sub-minute second must be stated, not absorbed into
      // an hourly idiom ("joka tunti" / "kahden tunnin välein" / a klo 9–17
      // window) that silently drops the :00.
      ['* 0 * * * *', 'joka sekunti, joka tunti 0 minuutin kohdalla'],
      // An hour RANGE under the minute-0 confinement reads as a window, not a
      // wall of clock minutes: "minuutin ajan" carries the :00, then klo 9–17,
      // distinct from the bare "joka tunti klo 9–17" so the :00 is not dropped.
      ['* 0 9-17 * * *',
        'joka sekunti minuutin ajan klo 9–17'],
      // A wildcard minute under a restricted hour: the hour window must
      // survive (it once collapsed to a bare "joka sekunti"). Fuzzer-found.
      ['* * 9 * * *', 'joka sekunti, joka minuutti kello 9 aikana'],
      // A wildcard second over a minute-step + hour-list: the hour restriction
      // must survive (it once dropped to "joka tunti"). Fuzzer-found.
      ['* */45 9,17 1 * *',
        'joka sekunti, kuukauden 1. päivänä klo 9, 9.45, 17 ja 17.45'],
      // A fixed second over the same anchored minute-step + hour-list: hours
      // must likewise survive (same dropped-hours bug). Fuzzer-found.
      ['30 */45 9,17 1 * *',
        'kuukauden 1. päivänä klo 9.00.30, 9.45.30, 17.00.30 ja 17.45.30'],
      // A uniform offset step that stays anchored under a second: the
      // hours-first reorder leads, then the minute anchors and second clause.
      ['* 17/20 9,17 1 * *',
        'joka sekunti, klo 9 ja 17 aina minuuttien 17, 37 ja 57 kohdalla ' +
        'kuukauden 1. päivänä'],
      ['30 17/20 9,17 1 * *',
        'klo 9 ja 17 aina minuuttien 17, 37 ja 57 kohdalla, ' +
        '30 sekunnin kohdalla kuukauden 1. päivänä'],
      ['*/15 * 9-17 * * *', '15 sekunnin välein, joka minuutti klo 9.00–17.59'],
      ['0-30 * 9 * * *',
        'joka minuutti 0–30 sekunnin kohdalla, joka minuutti kello 9 aikana'],
      // Minute is fixed (0, 30), so the second is not "joka minuutti" — it
      // fires within those minutes (cross-family validated).
      ['5 0,30 * * * *',
        '5 sekunnin kohdalla, joka tunti 0 ja 30 minuutin kohdalla'],
      ['30-40/5 * * * * *', 'joka minuutti 30, 35 ja 40 sekunnin kohdalla'],
      ['40/15 * * * *', 'joka tunti 40 ja 55 minuutin kohdalla'],
      ['* 9-17 * * *', 'joka minuutti klo 9.00–17.59'],
      ['0-30 9-17 * * *', 'klo 9–17 aina minuuttien 0–30 kohdalla'],
      ['0,30 9-17 * * *',
        'klo 9–17 aina minuuttien 0 ja 30 kohdalla'],
      ['0 9-17/2 * * *', 'klo 9, 11, 13, 15 ja 17'],
      ['0-30 1/6 * * *',
        '0–30 minuutin kohdalla, kuuden tunnin välein klo 1:stä alkaen'],
      ['* 8-18,22 * * *',
        'joka minuutti klo 8.00–18.59 ja 22.00–22.59'],
      // An arithmetic-progression hour list reads as an hour cadence, not a
      // wall of clock times (the single pinned minute leads).
      ['5 1,3,5,7,9,11,13 * * *',
        '5 minuutin kohdalla, kahden tunnin välein klo 1:stä alkaen'],
      ['5-10 1,3,5,7,9,11,13 * * *',
        'klo 1, 3, 5, 7, 9, 11 ja 13 aina minuuttien 5–10 kohdalla'],
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
      // An hour STEP segment fires on discrete on-the-hour hours (not a span),
      // so it lists those hours once rather than a per-hour window each. A real
      // hour RANGE segment ('8-18,22' above) keeps its window.
      ['* 1-13/2,20 * * *',
        'joka minuutti klo 1, 3, 5, 7, 9, 11, 13 ja 20']
    ]);
  });

  // Yksinkertainen alue, joka kattaa koko kentän, ei rajoita mitään, joten
  // se luetaan kuten `*`.
  describe('koko kentän kattava alue luetaan kuten jokerimerkki', function() {
    run([
      ['0-59 * * * *', 'joka minuutti'],
      ['0 0-23 * * *', 'joka tunti'],
      ['0 0 1-31 * *', 'joka päivä keskiyöllä'],
      ['0 0 * 1-12 *', 'joka päivä keskiyöllä'],
      ['0 0 * * 0-6', 'joka päivä keskiyöllä'],
      ['0 0 * * 1-7', 'joka päivä keskiyöllä'],
      ['0 0 * * SUN-SAT', 'joka päivä keskiyöllä']
    ]);
  });
});

// Tunnetut, vielä korjaamattomat virheet (katselmus + laaja pyyhkäisy;
// docs/backlog.md, "Open rendering findings"). Ohitetaan vaiheeseen C asti:
// poista skip (skip → describe) ja korjaa.
describe('Tunnetut virheet (vaihe C):', function() {
  it('ei johda harhaan sanalla "joka minuutti", kun minuutti on kiinteä',
    function() {
      expect(cronli5('30 5 9-17 * * *', {lang: fi}))
        .to.not.include('joka minuutti');
    });
});
