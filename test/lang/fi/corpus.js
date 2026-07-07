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
        'maanantaisin, keskiviikkoisin, perjantaisin ja sunnuntaisin ' +
        'keskipäivällä'],
      ['0 0 * * 1-5,0',
        'maanantaista perjantaihin ja sunnuntaisin keskiyöllä']
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
      // A Mon–Fri weekday arm reads as the parallel recurring class "arkisin"
      // (= weekdays), matching the recurring date arm beside it.
      ['0 0 1 * 1-5',
        'kuukauden 1. päivänä tai arkisin keskiyöllä'],
      // An open */2 day-of-month is the odd-day parity class, never enumerated:
      // "kuukauden parittomina päivinä" (odd days, resetting each month), not the
      // continuous "joka toinen päivä".
      ['0 0 */2 * */2',
        'kuukauden parittomina päivinä tai tiistaisin, torstaisin, ' +
        'lauantaisin ja sunnuntaisin keskiyöllä'],
      // Restricted-month date-or-weekday union: month leads + time follows, then
      // the inclusive "tai" union last (NOT exclusive "joko … tai").
      ['0 0 1 1 MON',
        'tammikuussa keskiyöllä 1. päivänä tai maanantaisin'],
      ['0 0 1 6-9 FRI',
        'kesäkuusta syyskuuhun keskiyöllä 1. päivänä tai perjantaisin'],
      ['0 0 1 1-3 5L',
        'tammikuusta maaliskuuhun keskiyöllä 1. päivänä tai ' +
        'kuukauden viimeisenä perjantaina'],
      ['*/5 * 1 6 5',
        'kesäkuussa viiden minuutin välein 1. päivänä tai perjantaisin'],
      ['0 9-17 1 6 5',
        'kesäkuussa joka tunti klo 9–17 1. päivänä tai perjantaisin'],
      ['5 9-17 1,15 6-8 MON-FRI',
        'kesäkuusta elokuuhun 5 minuutin kohdalla klo 9.05–17.05 ' +
        '1. ja 15. päivänä tai arkisin'],
      // Month-list case: inessive list fronts the union; the uneven hour step
      // reads as its bounded cadence.
      ['5 */5 1 1,7 MON',
        'tammikuussa ja heinäkuussa 5 minuutin kohdalla, ' +
        'viiden tunnin välein klo 0–20 1. päivänä tai maanantaisin'],
      // Anchored minute step with a uneven hour cadence, OR-scope.
      ['*/45 */5 1-5 6 MON-FRI',
        'kesäkuussa 0 ja 45 minuutin kohdalla, ' +
        'viiden tunnin välein klo 0–20 ' +
        '1.–5. päivänä tai arkisin'],
      // Range+isolated hours under a restricted-month union: minute-first, sekä klo.
      ['5,10,30 9-20,22 1 1 MON',
        'tammikuussa 5, 10 ja 30 minuutin kohdalla klo 9–20 sekä klo 22 ' +
        '1. päivänä tai maanantaisin'],
      // An open day-of-month step that is NOT */2 keeps its cadence/enumeration
      // in a union (only */2 reads as the odd-day parity class): a month=*
      // union takes the plain step cadence, a fronted-month union enumerates.
      ['0 0 */3 * 5',
        'joka kolmas päivä tai perjantaisin keskiyöllä'],
      ['0 0 */3 6 5',
        'kesäkuussa keskiyöllä 1., 4., 7., 10., 13., 16., 19., 22., 25., ' +
        '28. ja 31. päivänä tai perjantaisin']
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
      // Restricted month fronts + inclusive "tai" union last.
      ['0 0 L 6-8 MON',
        'kesäkuusta elokuuhun keskiyöllä kuukauden viimeisenä päivänä ' +
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
      ['* */5 * * *', 'joka minuutti, viiden tunnin välein klo 0–20'],
      // An offset minute frequency under an open/uneven hour step drops the
      // generic "jokaisen tunnin": the hour step is the sole hour authority.
      ['5/15 */5 * * *',
        '15 minuutin välein minuutista 5 alkaen, ' +
        'viiden tunnin välein klo 0–20'],
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
      ['* */10 * * *', 'joka minuutti, kymmenen tunnin välein klo 0–20'],
      // A clean hour step confines the cadence to every Nth hour, not a
      // second, conflicting cadence ("joka toinen tunti").
      ['*/15 */2 * * *', '15 minuutin välein joka toisen tunnin aikana'],
      // An offset stride keeps the confinement and names its start.
      ['*/15 1/2 * * *',
        '15 minuutin välein joka toisen tunnin aikana kello 1:stä alkaen'],
      ['*/15 1/3 * * *',
        '15 minuutin välein joka kolmannen tunnin aikana kello 1:stä alkaen'],
      ['* 1/2 * * *', 'joka minuutti joka toisen tunnin aikana kello 1:stä alkaen'],
      // An OFFSET minute frequency under a restricted hour step drops its
      // generic "jokaisen tunnin": the hour step is the sole hour authority, so
      // an every-hour scope alongside it would conflict. This holds for an open
      // step (every Nth hour) and a bounded step (its endpoint-pinning cadence).
      ['5/10 0/4 * * *',
        'kymmenen minuutin välein minuutista 5 alkaen joka neljännen ' +
        'tunnin aikana'],
      ['5/10 9-17/2 * * *',
        'kymmenen minuutin välein minuutista 5 alkaen, ' +
        'kahden tunnin välein klo 9–17'],
      // An hour WINDOW keeps "jokaisen tunnin": the window names the hours, so
      // there is no every-hour-of-the-day conflict.
      ['5/10 1-6 * * *',
        'kymmenen minuutin välein jokaisen tunnin minuutista 5 alkaen ' +
        'klo 1.00–6.55'],
      // A uneven or bounded hour step has a distinct endpoint, so it reads as a
      // bounded cadence pinning both clock-time ends, not a wall of clock times.
      ['*/20 9-17/2 * * *',
        '20 minuutin välein, kahden tunnin välein klo 9–17'],
      ['*/25 */5 * * *',
        '0, 25 ja 50 minuutin kohdalla, viiden tunnin välein klo 0–20'],
      ['5,10 9-17/2 * * *',
        '5 ja 10 minuutin kohdalla, kahden tunnin välein klo 9–17'],
      ['0 */2 * * *', 'kahden tunnin välein'],
      ['0 0,8,16 * * *', 'joka päivä klo 0, 8 ja 16'],
      ['0 */5 * * *', 'viiden tunnin välein klo 0–20'],
      ['0 */10 * * *', 'kymmenen tunnin välein klo 0–20'],
      // An offset step too short to be a deliberate list stays an enumeration
      // (3,10,17 could be a hand list); a five-value one reads as its cadence.
      ['0 3/7 * * *', 'joka päivä klo 3, 10 ja 17'],
      ['0 1/5 * * *', 'viiden tunnin välein klo 1–21'],
      // A bounded/offset hour stride reads as a cadence with its clock-time
      // bounds, not a wall of clock times.
      ['0 11/2 * * *', 'kahden tunnin välein klo 11–23'],
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
        '0 ja 30 minuutin kohdalla, kahden tunnin välein klo 8–18'],
      // Stepped/discrete seconds at a fully fixed timestamp bind to the clock
      // time itself ("…klo 9.30") — 9.30 is a time, not a minute number, so a
      // "minuutin 9.30 aikana" frame would treat a clock time as a minute.
      ['*/15 30 9 * * *', '15 sekunnin välein, joka päivä klo 9.30'],
      ['5,10 30 9 * * MON',
        '5 ja 10 sekunnin kohdalla, maanantaisin klo 9.30'],
      ['1 1 * * * *', 'joka tunti 1 minuutin ja 1 sekunnin kohdalla'],
      ['*/15 * * * MON', '15 minuutin välein maanantaisin'],
      ['*/15 * 13 * *', '15 minuutin välein kuukauden 13. päivänä'],
      ['*/15 * * 6 *', '15 minuutin välein kesäkuussa'],
      ['*/15 * * 6-9 *', '15 minuutin välein kesäkuusta syyskuuhun'],
      ['* * * * MON', 'joka minuutti maanantaisin'],
      ['0 * * * MON', 'joka tunti maanantaisin'],
      ['*/15 * 13 * 5',
        '15 minuutin välein kuukauden 13. päivänä tai perjantaisin'],
      // A bounded hour stride reads as its bounded cadence after the minute
      // range. SAT,SUN + ranged month included.
      ['0-30 9-17/2 * 6-8 SAT,SUN',
        '0–30 minuutin kohdalla, kahden tunnin välein klo 9–17 ' +
        'lauantaisin ja sunnuntaisin kesäkuusta elokuuhun'],
      // Uneven step over list hours: enumerates into clock times.
      ['*/45 9,17 * 12 SAT,SUN',
        'lauantaisin ja sunnuntaisin joulukuussa klo 9, 9.45, 17 ja 17.45'],
      // A uniform offset step that fires few times stays an anchored kohdalla
      // list, so the hours-first reorder applies (hours lead, minutes follow).
      ['17/20 9,17 * 12 SAT,SUN',
        'klo 9 ja 17 aina minuuttien 17, 37 ja 57 kohdalla ' +
        'lauantaisin ja sunnuntaisin joulukuussa']
    ]);
  });

  // A sub-minute second with the minute pinned to 0 and a specific hour: the
  // minute-0 is a real one-minute confinement (60 fires in :00, not 3,600
  // across the hour). The confinement is stated as a duration on the clock
  // time ("minuutin ajan klo 9") — the "minuutin ajan" frame the hour-range
  // and hour-step confinements below already use — never the bare hour alone
  // ("klo 9" reads as the whole hour) and never a minute noun ("minuutin
  // 9.00" treats a clock time as a minute number).
  describe('minuutti kiinnitetty 0:aan tietyn tunnin alla', function() {
    run([
      ['* 0 0 * * *', 'joka sekunti minuutin ajan keskiyöllä, joka päivä'],
      ['* 0 9 * * *', 'joka sekunti minuutin ajan klo 9, joka päivä'],
      // A lone noon/midnight keeps its word form ("keskipäivällä"), the same
      // convention as "joka päivä keskipäivällä"; lists stay uniform digits.
      ['* 0 12 * * *',
        'joka sekunti minuutin ajan keskipäivällä, joka päivä'],
      ['* 0 9,11 * * *',
        'joka sekunti minuutin ajan klo 9 ja 11, joka päivä'],
      // An hour RANGE under a minute-0 confinement reads as a window, not a
      // wall of clock minutes: the one-minute window klo 9–17 (the hour-range
      // analog of the every-other-hour confinement below).
      ['* 0 9-17 * * *',
        'joka sekunti minuutin ajan klo 9–17'],
      // An hour step under a minute-0 confinement reads as a cadence, not a
      // wall of clock minutes: the one-minute window during every other hour.
      ['* 0 */2 * * *',
        'joka sekunti minuutin ajan joka toisen tunnin aikana'],
      ['* 0 9 * * MON', 'joka sekunti minuutin ajan klo 9, maanantaisin'],
      ['*/15 0 9 * * *',
        '15 sekunnin välein minuutin ajan klo 9, joka päivä'],
      // A single fixed NONZERO minute composes a full timestamp: the seconds
      // clause binds to that clock time ("…klo 0.02"). The minute is visible
      // in the timestamp itself, so no extra confinement frame is needed —
      // and "minuutin 0.02 aikana" would treat the clock time as a minute
      // number.
      ['* 2 0 * * 0-6', 'joka sekunti, joka päivä klo 0.02'],
      ['* 2 9 * * *', 'joka sekunti, joka päivä klo 9.02']
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
          '30 sekunnin kohdalla, 0, 25 ja 50 minuutin kohdalla, ' +
          'kahden tunnin välein klo 9–17']
      ]);
    });

  // An hour RANGE (or a list whose segments include a range) under minute 0
  // and a meaningful second used to expand into a wall of clock times; it now
  // reads as the hour-range window ("klo 9–17"). The hour-RANGE analog of the
  // hour-step cadence. A pure single-value hour list (9,17) has no range to
  // span and still enumerates.
  describe('päällekkäiset listasegmentit sulautuvat unioniksi', function() {
    run([
      // Hour 18 is covered by both list arms (step fire and range start), so
      // they merge into the union: one 18-20 window, no duplicated 18.
      ['* 2/4,18-20 * * *',
        'joka minuutti klo 2.00–2.59, 6.00–6.59, 10.00–10.59, ' +
        '14.00–14.59, 18.00–20.59 ja 22.00–22.59'],
      // A step arm in a list reads as its fires, and the display units sort
      // chronologically: the 18-20 span sits between 17 and 21, with the
      // trailing isolated hour joining via the established "sekä klo".
      ['* 1/4,18-20 * * *',
        'joka minuutti klo 1.00–1.59, 5.00–5.59, 9.00–9.59, ' +
        '13.00–13.59, 17.00–17.59, 18.00–20.59 ja 21.00–21.59'],
      ['5,30 1/4,18-20 * * *',
        '5 ja 30 minuutin kohdalla klo 1, 5, 9, 13, 17, 18–20 sekä klo 21'],
      ['0 0 1/4,18-20 * * *',
        'joka päivä klo 1, 5, 9, 13, 17, 18–20 sekä klo 21']
    ]);
  });

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

  // A second LIST, RANGE, or SINGLE under a minute restriction CONFINES that
  // restriction, never the comma juxtaposition that reads as two independent
  // schedules. A stepped minute keeps its essive ordinal frame with the seconds
  // postposition ("… sekunnin kohdalla joka kuudentena minuuttina …"); a list,
  // range, or single minute folds both fields into one shared "kohdalla" ("joka
  // tunti 0, 15 ja 30 minuutin ja 5, 10 ja 15 sekunnin kohdalla"). NOTE: mirrors
  // c0d0a1f's marker; flagged for native review at graduation (only English was
  // panel-ratified).
  describe('sekuntilista/-väli/-yksittäisarvo rajaa minuutin', function() {
    run([
      ['5,10,15 4/6 * * * *',
        '5, 10 ja 15 sekunnin kohdalla joka kuudentena minuuttina ' +
        'jokaisen tunnin minuutista 4 alkaen'],
      ['30 4/6 * * * *',
        '30 sekunnin kohdalla joka kuudentena minuuttina ' +
        'jokaisen tunnin minuutista 4 alkaen'],
      ['0-30 4/6 * * * *',
        '0–30 sekunnin kohdalla joka kuudentena minuuttina ' +
        'jokaisen tunnin minuutista 4 alkaen'],
      ['30 */6 * * * *',
        '30 sekunnin kohdalla joka kuudentena minuuttina'],
      ['30 2/7 * * * *',
        '30 sekunnin kohdalla joka seitsemäntenä minuuttina ' +
        'minuutista 2 minuuttiin 58'],
      ['5,10,15 0,15,30 * * * *',
        'joka tunti 0, 15 ja 30 minuutin ja 5, 10 ja 15 sekunnin kohdalla'],
      ['15 0,30 * * * *',
        'joka tunti 0 ja 30 minuutin ja 15 sekunnin kohdalla'],
      ['15 0-30 * * * *',
        'joka tunti 0–30 minuutin ja 15 sekunnin kohdalla'],
      ['5,10 30 * * * *',
        'joka tunti 30 minuutin ja 5 ja 10 sekunnin kohdalla'],
      ['0-30 30 * * * *',
        'joka tunti 30 minuutin ja 0–30 sekunnin kohdalla']
    ]);
  });

  describe('harvinaiset muodot', function() {
    run([
      // Minute step leads its within-firing second anchor (comma separates).
      ['5,30 */15 9,17 1,15 * *',
        '15 minuutin välein, 5 ja 30 sekunnin kohdalla ' +
        'klo 9 ja 17 kuukauden 1. ja 15. päivänä'],
      ['* 30 9 * * *', 'joka sekunti, joka päivä klo 9.30'],
      // A stepped minute under a wildcard/stepped second and wildcard hour
      // confines the second cadence to the ORDINAL minute cadence ("joka
      // sekunti joka kuudentena minuuttina …"), never the comma juxtaposition
      // that reads as two independent cadences. The offset-clean stride names
      // only its start; the uneven one pins both endpoints ("minuutista 2
      // minuuttiin 58").
      ['* 4/6 * * * *',
        'joka sekunti joka kuudentena minuuttina ' +
        'jokaisen tunnin minuutista 4 alkaen'],
      ['* 2/7 * * * *',
        'joka sekunti joka seitsemäntenä minuuttina ' +
        'minuutista 2 minuuttiin 58'],
      ['* */6 * * * *', 'joka sekunti joka kuudentena minuuttina'],
      ['*/15 4/6 * * * *',
        '15 sekunnin välein joka kuudentena minuuttina ' +
        'jokaisen tunnin minuutista 4 alkaen'],
      // A wildcard second under a minute */2 binds the two cadences instead of
      // juxtaposing the contradictory "joka sekunti, kahden minuutin välein".
      ['* */2 * * * *', 'joka sekunti joka toisena minuuttina'],
      // Other clean steps confine as the ordinal cadence.
      ['* */3 * * * *', 'joka sekunti joka kolmantena minuuttina'],
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
      // A single second under a minute list confines that minute into one
      // shared "kohdalla", never the comma juxtaposition that reads as two
      // independent schedules.
      ['5 0,30 * * * *',
        'joka tunti 0 ja 30 minuutin ja 5 sekunnin kohdalla'],
      ['30-40/5 * * * * *', 'joka minuutti 30, 35 ja 40 sekunnin kohdalla'],
      ['40/15 * * * *', 'joka tunti 40 ja 55 minuutin kohdalla'],
      ['* 9-17 * * *', 'joka minuutti klo 9.00–17.59'],
      ['0-30 9-17 * * *', 'klo 9–17 aina minuuttien 0–30 kohdalla'],
      ['0,30 9-17 * * *',
        'klo 9–17 aina minuuttien 0 ja 30 kohdalla'],
      ['0 9-17/2 * * *', 'kahden tunnin välein klo 9–17'],
      // A bounded step from midnight that stops short of the day's last tile
      // (0-20/2 fires 0,2,…,20, never 22) pins both endpoints, like 9-17/2 —
      // it must not read as the all-day "kahden tunnin välein".
      ['23 0-20/2 * * *',
        '23 minuutin kohdalla, kahden tunnin välein klo 0–20'],
      ['30 0-20/3 * * *',
        '30 minuutin kohdalla, kolmen tunnin välein klo 0–18'],
      // Guards: an open `*/n` and a full-field-equivalent step (0-22/2 ≡ `*/2`)
      // are the all-day set and stay bare.
      ['23 */2 * * *', '23 minuutin kohdalla, kahden tunnin välein'],
      ['23 0-22/2 * * *', '23 minuutin kohdalla, kahden tunnin välein'],
      ['0-30 1/6 * * *',
        '0–30 minuutin kohdalla, kuuden tunnin välein klo 1:stä alkaen'],
      ['* 8-18,22 * * *',
        'joka minuutti klo 8.00–18.59 ja 22.00–22.59'],
      // An arithmetic-progression hour list reads as an hour cadence, not a
      // wall of clock times (the single pinned minute leads). The list stops
      // at 13, short of the day's last odd hour, so the cadence is bounded
      // ("klo 1–13"), not the open "klo 1:stä alkaen" — which would recover the
      // all-day 1,3,…,23.
      ['5 1,3,5,7,9,11,13 * * *',
        '5 minuutin kohdalla, kahden tunnin välein klo 1–13'],
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

  // Lisäkattavuus: tuntilistat ja -välit sekuntien/minuuttien kadenssin kanssa.
  // Jokainen rivi kuvaa saman aikataulun kuin englanninkielinen tuloste.
  describe('lisäkattavuus (tuntilistat/-välit)', function() {
    run([
      ['0 0 9,17 * * *', 'joka päivä klo 9 ja 17'],
      ['0 9,12,17 * * *', 'joka päivä klo 9, 12 ja 17'],
      ['*/15 9,17 * * *', '15 minuutin välein klo 9 ja 17'],
      ['*/15 0,12 * * *', '15 minuutin välein klo 0 ja 12'],
      ['15 0 9-17 * * *', '15 sekunnin kohdalla, klo 9–17'],
      ['30 0 9-17/2 * * *',
        '30 sekunnin kohdalla, kahden tunnin välein klo 9–17'],
      // Siirretty tuntiaskel luettelee laukaisunsa kellonaikoina.
      ['0 0 8/4 * * *', 'joka päivä klo 8, 12, 16 ja 20'],
      ['0 30 0,8,16 * * *', 'joka päivä klo 0.30, 8.30 ja 16.30']
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

// Vuosi {years: true} -asetuksella. Taipuva muoto liittyy kalenteripäivään
// ("kuukauden 13. päivänä vuonna 2030"); kaikki muut päivämuodot — Quartz,
// avoin askel, DOM-tai-DOW-unioni — saavat vuoden loppuun ("vuonna 2030")
// sen pudottamisen sijaan: pudonnut vuosi on kadonnut rajoitus.
describe('Vuodet (fi):', function() {
  const years = {years: true};

  run([
    ['0 9 13 * * 2030', 'kuukauden 13. päivänä vuonna 2030 klo 9', years],
    ['0 0 L * * 2030',
      'kuukauden viimeisenä päivänä keskiyöllä vuonna 2030', years],
    ['*/15 30 9 15W * * 2030',
      '15 sekunnin välein, kuukauden 15. päivää lähinnä olevana ' +
      'arkipäivänä klo 9.30 vuonna 2030', {seconds: true, years: true}],
    ['0 0 2/3 * * 2030',
      'joka kolmas päivä 2. päivästä alkaen keskiyöllä vuonna 2030', years],
    ['0 0 13 * 5 2030',
      'kuukauden 13. päivänä tai perjantaisin keskiyöllä vuonna 2030', years]
  ]);
});

// A minute list mixing a range under a BOUNDED hour step: the core once
// planned this as bare whole-hour clock times, silently dropping the
// minutes (test/core/known-defects.js pinned it); the mixed list keeps
// the language's own minute devices ahead of the step cadence.
describe('sekamuotoinen minuuttilista rajatun tuntiaskelen alla', function() {
  run([
    ['5-10,20 9-17/2 * * *',
      '5–10 ja 20 minuutin kohdalla, kahden tunnin välein klo 9–17']
  ]);
});
