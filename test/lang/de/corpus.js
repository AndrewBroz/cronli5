import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import de from '../../../src/lang/de/index.js';

const {expect} = chai;

// BETA / PROVISIONAL corpus — model-validated (cross-family review panel),
// NOT human-reviewed. "Fool's gold": useful for pinning regressions, not a
// verified oracle. See tooling/docs/language-pipeline.md. The "every" forms are the
// design crux: "jede <unit>" agrees with gender at interval 1; "alle N
// <units>" is invariant for interval > 1 (see notes.md).

function run(cases) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...values[2] || {}, lang: de};

    describe(JSON.stringify(pattern), function() {
      it('liest sich "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

describe('Deutsch (de):', function() {
  describe('Häufigkeiten', function() {
    run([
      ['* * * * *', 'jede Minute'],
      ['* * * * * *', 'jede Sekunde'],
      ['0 * * * *', 'jede Stunde'],
      ['*/5 * * * *', 'alle 5 Minuten'],
      ['*/15 * * * *', 'alle 15 Minuten'],
      ['0 */6 * * *', 'alle 6 Stunden'],
      ['*/30 * * * * *', 'alle 30 Sekunden']
    ]);
  });

  describe('Uhrzeiten', function() {
    run([
      ['0 9 * * *', 'täglich um 9 Uhr'],
      ['30 14 * * *', 'täglich um 14:30 Uhr'],
      ['0 0 * * *', 'täglich um Mitternacht'],
      ['0 12 * * *', 'täglich um 12 Uhr'],
      ['0 9,17 * * *', 'täglich um 9 und 17 Uhr']
    ]);
  });

  describe('Wochentage', function() {
    run([
      ['30 9 * * MON', 'montags um 9:30 Uhr'],
      ['0 9 * * MON-FRI', 'montags bis freitags um 9 Uhr'],
      ['0 9 * * 1,3,5', 'montags, mittwochs und freitags um 9 Uhr']
    ]);
  });

  describe('Datum und Monat', function() {
    run([
      // Date / month qualifiers lead a clock time, but trail a frequency.
      ['0 9 1 * *', 'am 1. um 9 Uhr'],
      ['0 9 15 * *', 'am 15. um 9 Uhr'],
      ['0 9 1,15 * *', 'am 1. und 15. um 9 Uhr'],
      ['0 9 1-5 * *', 'vom 1. bis zum 5. um 9 Uhr'],
      ['0 9 * 1 *', 'im Januar um 9 Uhr'],
      ['0 9 * 1,7 *', 'im Januar und Juli um 9 Uhr'],
      ['0 9 * 6-8 *', 'von Juni bis August um 9 Uhr'],
      ['0 9 1 1 *', 'am 1. Januar um 9 Uhr'],
      ['0 9 * 1 MON', 'montags im Januar um 9 Uhr'],
      ['* * * 1 *', 'jede Minute im Januar']
    ]);
  });

  describe('Stundenfenster', function() {
    run([
      ['0 9-17 * * *', 'stündlich von 9 bis 17 Uhr'],
      ['* 9-17 * * *', 'jede Minute von 9 bis 17:59 Uhr'],
      ['*/15 9-17 * * *', 'alle 15 Minuten von 9 bis 17:45 Uhr'],
      ['*/30 9-17 * * *', 'alle 30 Minuten von 9 bis 17:30 Uhr']
    ]);
  });

  describe('Minuten und Sekunden', function() {
    run([
      ['5 * * * *', 'in Minute 5 jeder Stunde'],
      ['0-30 * * * *', 'in den Minuten 0 bis 30 jeder Stunde'],
      ['5,10,30 * * * *', 'in den Minuten 5, 10 und 30 jeder Stunde'],
      ['15 * * * * *', 'in Sekunde 15 jeder Minute'],
      ['5,30 * * * * *', 'in den Sekunden 5 und 30 jeder Minute'],
      ['30 0 * * * *', 'in Minute 0 und Sekunde 30 jeder Stunde'],
      ['0-30 9 * * *', 'jede Minute von 9:00 bis 9:30 Uhr'],
      ['0,30 5 9 * * *', 'in den Sekunden 0 und 30 jeder Minute, um 9:05 Uhr'],
      ['*/15 0 9 * * *', 'alle 15 Sekunden, um 9 Uhr']
    ]);
  });

  describe('Verbundmuster', function() {
    run([
      ['0-30 9,17 * * *', 'in den Minuten 0 bis 30, um 9 und 17 Uhr'],
      ['0-30 9-17/2 * * *',
        'in den Minuten 0 bis 30, um 9, 11, 13, 15 und 17 Uhr'],
      ['5,10 9,17/2 * * *',
        'in den Minuten 5 und 10, um 9, 17, 19, 21 und 23 Uhr'],
      ['0,30 9,17/2 * * *',
        'in den Minuten 0 und 30, um 9, 17, 19, 21 und 23 Uhr']
    ]);
  });

  describe('Weitere Häufigkeiten', function() {
    run([
      ['*/2 * * * *', 'alle 2 Minuten'],
      ['*/10 * * * *', 'alle 10 Minuten'],
      ['0 */2 * * *', 'alle 2 Stunden'],
      ['0 */3 * * *', 'alle 3 Stunden'],
      ['0 */12 * * *', 'alle 12 Stunden'],
      ['*/10 * * * * *', 'alle 10 Sekunden'],
      // Non-dividing steps fire at discrete points, not on an even cadence.
      ['*/45 * * * * *', 'in den Sekunden 0 und 45 jeder Minute'],
      ['*/45 * * * *', 'in den Minuten 0 und 45 jeder Stunde'],
      ['*/25 * * * *', 'in den Minuten 0, 25 und 50 jeder Stunde'],
      // A divisor step that starts off the top of the cycle still fires at
      // discrete offset points, so German lists them rather than reading
      // "alle 6 Minuten" (which would lose the offset).
      ['5/6 * * * *',
        'in den Minuten 5, 11, 17, 23, 29, 35, 41, 47, 53 und 59 jeder Stunde'],
      // Uneven hour steps render as their fire list, so they take the daily
      // frame too (a bare clock list, like clockTimes).
      ['0 */5 * * *', 'täglich um 0, 5, 10, 15 und 20 Uhr'],
      ['0 */9 * * *', 'täglich um 0, 9 und 18 Uhr']
    ]);
  });

  describe('Weitere Uhrzeiten', function() {
    run([
      ['0 1 * * *', 'täglich um 1 Uhr'],
      ['0 13 * * *', 'täglich um 13 Uhr'],
      ['0 23 * * *', 'täglich um 23 Uhr'],
      ['15 6 * * *', 'täglich um 6:15 Uhr'],
      ['5 0 * * *', 'täglich um 0:05 Uhr'],
      ['45 23 * * *', 'täglich um 23:45 Uhr'],
      ['0 6,12,18 * * *', 'täglich um 6, 12 und 18 Uhr'],
      ['30 8,20 * * *', 'täglich um 8:30 und 20:30 Uhr'],
      ['0 0,12 * * *', 'täglich um 0 und 12 Uhr']
    ]);
  });

  describe('Weitere Wochentage und Daten', function() {
    run([
      ['0 9 * * SUN', 'sonntags um 9 Uhr'],
      ['0 9 * * 7', 'sonntags um 9 Uhr'],
      ['0 9 * * SAT', 'samstags um 9 Uhr'],
      ['0 9 * * TUE-THU', 'dienstags bis donnerstags um 9 Uhr'],
      ['0 9 * * SAT,SUN', 'sonntags und samstags um 9 Uhr'],
      ['0 9 31 * *', 'am 31. um 9 Uhr'],
      ['0 9 * 12 *', 'im Dezember um 9 Uhr'],
      ['0 9 * 3 *', 'im März um 9 Uhr'],
      ['0 9 * JAN *', 'im Januar um 9 Uhr'],
      ['0 9 * 11,12 *', 'im November und Dezember um 9 Uhr'],
      ['0 9 24 12 *', 'am 24. Dezember um 9 Uhr'],
      ['0 0 1 1 *', 'am 1. Januar um Mitternacht']
    ]);
  });

  describe('Weitere Minuten und Fenster', function() {
    run([
      ['30 * * * *', 'in Minute 30 jeder Stunde'],
      ['0,15,30,45 * * * *', 'in den Minuten 0, 15, 30 und 45 jeder Stunde'],
      ['10-20 * * * *', 'in den Minuten 10 bis 20 jeder Stunde'],
      ['0 8-18 * * *', 'stündlich von 8 bis 18 Uhr'],
      ['*/10 6-22 * * *', 'alle 10 Minuten von 6 bis 22:50 Uhr']
    ]);
  });

  describe('Jahr', function() {
    run([
      ['0 0 9 * * * 2026', 'täglich um 9 Uhr im Jahr 2026'],
      ['0 0 9 1 1 * 2026', 'am 1. Januar um 9 Uhr im Jahr 2026'],
      ['0 0 9 * * * 2025,2027', 'täglich um 9 Uhr in den Jahren 2025 und 2027'],
      ['0 0 9 * * * 2025-2027', 'täglich um 9 Uhr von 2025 bis 2027']
    ]);
  });

  describe('Quartz (L / W / #)', function() {
    run([
      ['0 0 * * 5L', 'am letzten Freitag des Monats um Mitternacht'],
      ['0 0 * * MON#2', 'am zweiten Montag des Monats um Mitternacht'],
      ['0 0 * * 1#3', 'am dritten Montag des Monats um Mitternacht'],
      ['30 9 15W 6 *', 'am nächsten Werktag zum 15. im Juni um 9:30 Uhr'],
      ['0 0 L * *', 'am letzten Tag des Monats um Mitternacht'],
      ['0 0 LW * *', 'am letzten Werktag des Monats um Mitternacht']
    ]);
  });

  describe('Stundenfenster mit Minute, Faltung, ODER', function() {
    run([
      ['30 9-17 * * *', 'in Minute 30 jeder Stunde, von 9 bis 17:30 Uhr'],
      ['15,45 9-17 * * *',
        'in den Minuten 15 und 45 jeder Stunde, von 9 bis 17 Uhr'],
      ['0 9-20,22 * * *', 'stündlich von 9 bis 20 Uhr und um 22 Uhr'],
      ['0 9 1 * MON', 'am 1. oder montags um 9 Uhr'],
      ['59 23 31 12 5', 'am 31. oder freitags im Dezember um 23:59 Uhr'],
      // Panel: "every minute during the X o'clock hours" is hour windows,
      // not points; a clean hour step is "alle N Stunden", not enumerated.
      ['* 9,12,17 * * *',
        'jede Minute von 9 bis 9:59 Uhr, von 12 bis 12:59 Uhr und von 17 ' +
        'bis 17:59 Uhr'],
      ['0-30 */2 * * *', 'in den Minuten 0 bis 30, alle 2 Stunden']
    ]);
  });

  describe('Komplexe Muster', function() {
    run([
      ['15 8,12,17 * * *', 'täglich um 8:15, 12:15 und 17:15 Uhr'],
      ['0 0 1 */3 *', 'am 1. Januar, April, Juli und Oktober um Mitternacht'],
      ['0,30 5 9,18 * * *',
        'in den Sekunden 0 und 30 jeder Minute, um 9:05 und 18:05 Uhr'],
      ['0 0 29 2 *', 'am 29. Februar um Mitternacht'],
      ['0 12 25 12 *', 'am 25. Dezember um 12 Uhr']
    ]);
  });

  describe('Randfälle (vollständige Abdeckung)', function() {
    run([
      // minuteFrequency across discrete hours (each a full hour) / a step.
      ['*/15 9,17 * * *',
        'alle 15 Minuten von 9 bis 9:59 Uhr und von 17 bis 17:59 Uhr'],
      // A bounded hour step lists its active hours; beyond three a compact
      // list reads better than sprawling windows (panel-preferred).
      ['*/20 9-17/2 * * *',
        'alle 20 Minuten in den Stunden 9, 11, 13, 15 und 17 Uhr'],
      // A clean (unbounded) hour step confines the cadence to every Nth hour,
      // not a juxtaposed second cadence ("alle 2 Stunden").
      ['*/15 */2 * * *', 'alle 15 Minuten in jeder zweiten Stunde'],
      ['*/15 */3 * * *', 'alle 15 Minuten in jeder dritten Stunde'],
      // An offset stride keeps the confinement and names its start.
      ['*/15 1/2 * * *', 'alle 15 Minuten in jeder zweiten Stunde ab 1 Uhr'],
      ['*/15 1/3 * * *', 'alle 15 Minuten in jeder dritten Stunde ab 1 Uhr'],
      ['* 1/2 * * *', 'jede Minute in jeder zweiten Stunde ab 1 Uhr'],
      // An uneven hour step lists its active hours the same way.
      ['*/15 */5 * * *',
        'alle 15 Minuten in den Stunden 0, 5, 10, 15 und 20 Uhr'],
      // The same clean hour step composed with a second clause.
      ['0-10 */15 */2 L * *',
        'in den Sekunden 0 bis 10 jeder Minute, ' +
        'alle 15 Minuten in jeder zweiten Stunde am letzten Tag des Monats'],
      // Uneven minute step within a window.
      ['*/45 9-17 * * *',
        'in den Minuten 0 und 45 jeder Stunde, von 9 bis 17 Uhr'],
      // hourRange with a minute range.
      ['0-30 9-17 * * *',
        'in den Minuten 0 bis 30 jeder Stunde, von 9 bis 17 Uhr'],
      // minutesAcrossHours over hour segments (range + single).
      ['0-30 9-20,22 * * *',
        'in den Minuten 0 bis 30, von 9 bis 20 Uhr und um 22 Uhr'],
      // Folded compactClockTimes with a non-zero minute.
      ['5 9-20,22 * * *', 'stündlich von 9:05 bis 20:05 Uhr und um 22:05 Uhr'],
      // secondsWithinMinute with a non-single second.
      ['0-10 0 * * * *',
        'in den Sekunden 0 bis 10 jeder Minute, in Minute 0 jeder Stunde'],
      // date+weekday OR where the weekday is a Quartz form.
      ['0 9 1 * 5L', 'am 1. oder am letzten Freitag des Monats um 9 Uhr'],
      // A wildcard second composed with a clock time.
      ['* 0 9 * * *', 'jede Sekunde, um 9 Uhr'],
      // Minute 0 under a sub-minute second must be stated, not absorbed into
      // an hourly idiom ("jede Stunde" / "alle 2 Stunden" / a 9-bis-17 window)
      // that silently drops the :00.
      ['* 0 * * * *', 'jede Sekunde, in Minute 0 jeder Stunde'],
      ['* 0 9-17 * * *',
        'jede Sekunde, um 9, 10, 11, 12, 13, 14, 15, 16 und 17 Uhr'],
      // A wildcard minute under a restricted hour: the hour window must
      // survive (it once collapsed to a bare "jede Sekunde"). Fuzzer-found.
      ['* * 9 * * *', 'jede Sekunde, jede Minute von 9:00 bis 9:59 Uhr'],
      ['*/15 * 9-17 * * *',
        'alle 15 Sekunden, jede Minute von 9 bis 17:59 Uhr'],
      ['0-30 * 9 * * *',
        'in den Sekunden 0 bis 30 jeder Minute, ' +
        'jede Minute von 9:00 bis 9:59 Uhr'],
      // during-hours given as segments (a range must not collapse to its
      // start), found by the fuzzer.
      ['*/15 9-20,22 * * *',
        'alle 15 Minuten von 9 bis 20:59 Uhr und von 22 bis 22:59 Uhr'],
      // A clock time carrying a second must not drop it (or read Mitternacht).
      ['30 0 0 * * *', 'täglich um 0:00:30 Uhr'],
      // compactClockTimes: a range among the hours reads as a window.
      ['5,10,30 9-20,22 * * *',
        'in den Minuten 5, 10 und 30, von 9 bis 20 Uhr und um 22 Uhr'],
      // A folded compact must keep its clock second.
      ['30 0 9-20,22 * * *',
        'stündlich von 9:00:30 bis 20:00:30 Uhr und um 22:00:30 Uhr']
    ]);
  });

  describe('Dialekt', function() {
    run([
      ['30 14 * * *', 'täglich um 14.30 Uhr', {dialect: {sep: '.'}}],
      // de-AT: Austrian German names January "Jänner".
      ['0 0 1 1 *', 'am 1. Jänner um Mitternacht', {dialect: 'de-AT'}],
      ['0 0 * 1,7 *', 'im Jänner und Juli um Mitternacht', {dialect: 'de-AT'}],
      ['0 0 * 1-3 *', 'von Jänner bis März um Mitternacht', {dialect: 'de-AT'}],
      // de-CH: Swiss German keeps the standard month names (its ß→ss
      // divergence never surfaces in schedule prose); same as de-DE here.
      ['0 0 1 1 *', 'am 1. Januar um Mitternacht', {dialect: 'de-CH'}]
    ]);
  });

  // Ein einfacher Bereich über das ganze Feld schränkt nichts ein und liest
  // sich daher genau wie `*`.
  describe('Vollständiger Bereich liest sich wie der Platzhalter', function() {
    run([
      ['0-59 * * * *', 'jede Minute'],
      ['0 0-23 * * *', 'jede Stunde'],
      ['0 0 1-31 * *', 'täglich um Mitternacht'],
      ['0 0 * 1-12 *', 'täglich um Mitternacht'],
      ['0 0 * * 0-6', 'täglich um Mitternacht'],
      ['0 0 * * 1-7', 'täglich um Mitternacht'],
      ['0 0 * * SUN-SAT', 'täglich um Mitternacht']
    ]);
  });

  describe('Sonderfälle', function() {
    run([
      ['@reboot', 'beim Systemstart'],
      ['kein Cron', 'ein unlesbares Cron-Muster', {lenient: true}]
    ]);
  });
});

// Bekannte, noch offene Fehler (Code-Review + Wide-Sweep; docs/backlog.md,
// "Open rendering findings"). Übersprungen bis Schritt C: wieder aktivieren
// (skip → describe) und beheben. Geprüft wird die Fehler-Invariante, nicht der
// exakte Wortlaut — der wird in C per Panel festgelegt.
describe('Bekannte offene Fehler (Schritt C):', function() {
  it('keine doppelte Präposition "am vom" bei Bereich in Liste', function() {
    expect(cronli5('0 0 1-5,10 * *', {lang: de})).to.not.include('am vom');
  });

  it('klebt den Monatsbereich nicht direkt an "am 1."', function() {
    expect(cronli5('0 0 1 6-8 *', {lang: de}))
      .to.not.include('am 1. von Juni');
  });

  it('verschluckt die Sekunde im kompakten Uhrzeit-Pfad nicht', function() {
    expect(cronli5('30 5,10 9,17,19,21,23 * * *', {lang: de, seconds: true}))
      .to.include('Sekunde 30');
  });

  it('nennt einen Mehr-Stunden-Schritt nicht "stündlich"', function() {
    expect(cronli5('5 */2 * * *', {lang: de})).to.not.include('stündlich');
  });

  // Verschoben auf die IR-Kadenz-Arbeit (betrifft alle Sprachen + stabiles en).
  it.skip('liest den Tages-Schritt als Kadenz, nicht als Aufzählung',
    function() {
      expect(cronli5('0 0 */2 * *', {lang: de})).to.not.include('29.');
    });
});
