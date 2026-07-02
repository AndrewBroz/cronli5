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
      // A single hour with a wildcard minute is the whole hour: it reads as
      // that hour ("der 9-Uhr-Stunde"), not a synthesized "von 9:00 bis 9:59"
      // range. An hour RANGE keeps its window.
      ['* 9 * * *', 'jede Minute der 9-Uhr-Stunde'],
      ['* 0 * * *', 'jede Minute der Mitternachtsstunde'],
      ['* 12 * * *', 'jede Minute der Mittagsstunde'],
      ['* 9-17 * * *', 'jede Minute von 9 bis 17:59 Uhr'],
      ['*/15 9-17 * * *', 'alle 15 Minuten von 9 bis 17:45 Uhr'],
      ['*/30 9-17 * * *', 'alle 30 Minuten von 9 bis 17:30 Uhr'],
      // Hour 18 is covered by both list arms (step fire and range start), so
      // they merge into the union: one 18-20 window, no duplicated 18.
      ['* 2/4,18-20 * * *',
        'jede Minute von 2 bis 2:59 Uhr, von 6 bis 6:59 Uhr, ' +
        'von 10 bis 10:59 Uhr, von 14 bis 14:59 Uhr, von 18 bis 20:59 Uhr ' +
        'und von 22 bis 22:59 Uhr'],
      // A step arm in a list reads as its fires, and the display units sort
      // chronologically: the 18-20 window sits between 17 and 21. Runs of
      // adjacent single hours still group into one "um … Uhr" phrase.
      ['* 1/4,18-20 * * *',
        'jede Minute von 1 bis 1:59 Uhr, von 5 bis 5:59 Uhr, ' +
        'von 9 bis 9:59 Uhr, von 13 bis 13:59 Uhr, von 17 bis 17:59 Uhr, ' +
        'von 18 bis 20:59 Uhr und von 21 bis 21:59 Uhr'],
      ['5,30 1/4,18-20 * * *',
        'in den Minuten 5 und 30, um 1, 5, 9, 13 und 17 Uhr, ' +
        'von 18 bis 20 Uhr und um 21 Uhr'],
      ['0 0 1/4,18-20 * * *',
        'stündlich um 1, 5, 9, 13 und 17 Uhr, von 18 bis 20 Uhr ' +
        'und um 21 Uhr']
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
      // A list of seconds over a single fixed minute fuses to the clock minute
      // just like the minute-0 case below ("der Minute 9:00"), rather than
      // floating ("…, um 9:05 Uhr").
      ['0,30 5 9 * * *', 'täglich in den Sekunden 0 und 30 der Minute 9:05'],
      ['*/15 0 9 * * *', 'täglich alle 15 Sekunden der Minute 9:00']
    ]);
  });

  // The "jeder Minute" scope on a seconds clause means the seconds fire in
  // every minute — true only when the minute is a wildcard. When the minute is
  // fixed (single/list/range/step) its own clause names it, so the scope is
  // dropped: "in Sekunde 30 jeder Minute, in Minute 30" claimed every minute
  // while firing only at second 30 of minute 30.
  describe('Sekundenklausel ohne "jeder Minute" bei fixierter Minute',
    function() {
      run([
        // The reported case: minute fixed to 30, so the seconds clause is bare.
        ['30 30 9-17/2 * * *',
          'in Sekunde 30, in Minute 30, alle 2 Stunden von 9 bis 17 Uhr'],
        // A fully pinned clock time folds into the clock form — no scope at all.
        ['30 30 9 * * *', 'täglich um 9:30:30 Uhr'],
        ['30 5 9 * * *', 'täglich um 9:05:30 Uhr'],
        // Guards: the minute IS a wildcard, so "jeder Minute" is legitimate and
        // stays — the seconds really do fire in every minute.
        ['30 * 9 * * *',
          'in Sekunde 30 jeder Minute, jede Minute der 9-Uhr-Stunde'],
        ['5/15 * * * * *', 'alle 15 Sekunden ab Sekunde 5 jeder Minute']
      ]);
    });

  // A sub-minute second with the minute pinned to 0 and a specific hour: the
  // minute-0 is a real one-minute confinement (60 fires in :00, not 3,600
  // across the hour). The clock minute must stay visible, so the seconds bind
  // to the explicit clock minute in the genitive ("der Minute 9:00") under the
  // recurring "täglich" frame, never the bare hour ("um 9 Uhr").
  describe('Minute auf 0 fixiert unter einer bestimmten Stunde', function() {
    run([
      ['* 0 0 * * *', 'täglich jede Sekunde der Minute 0:00'],
      ['* 0 9 * * *', 'täglich jede Sekunde der Minute 9:00'],
      ['* 0 12 * * *', 'täglich jede Sekunde der Minute 12:00'],
      ['* 0 9,11 * * *',
        'täglich jede Sekunde der Minuten 9:00 und 11:00'],
      // An hour RANGE under a minute-0 confinement reads as a window, not a
      // wall of clock minutes: the one-minute window from 9 to 17h (the
      // hour-range analog of the every-other-hour confinement below).
      ['* 0 9-17 * * *',
        'jede Sekunde für eine Minute, von 9 bis 17 Uhr'],
      // An hour step under a minute-0 confinement reads as a cadence, not a
      // wall of clock minutes: the one-minute window in every other hour.
      ['* 0 */2 * * *',
        'jede Sekunde für eine Minute in jeder zweiten Stunde'],
      ['* 0 9 * * MON', 'montags jede Sekunde der Minute 9:00'],
      // A single fixed NONZERO minute is a single fixed timestamp just like
      // minute 0: the seconds fuse to that explicit clock minute in the
      // genitive ("der Minute 0:02"), matching the minute-0 form above, never
      // floating as a separate apposition ("um 0:02 Uhr").
      ['* 2 0 * * 0-6', 'täglich jede Sekunde der Minute 0:02'],
      ['* 2 9 * * *', 'täglich jede Sekunde der Minute 9:02']
    ]);
  });

  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute reads as a cadence, not a cross-product of clock times: the
  // minute/second lead clause, then the hour cadence ("alle 2 Stunden").
  // Irregular hour lists and ranges still enumerate.
  describe('Stundenschritt als Kadenz statt Stundenliste', function() {
    run([
      ['30 0 */2 * * *', 'in Sekunde 30 jeder Stunde, alle 2 Stunden'],
      ['5 0 */2 * * *', 'in Sekunde 5 jeder Stunde, alle 2 Stunden'],
      ['30 */2 * * *', 'in Minute 30, alle 2 Stunden'],
      // An arithmetic-progression hour list compacts the same way.
      ['30 0 0,4,8,12,16,20 * * *',
        'in Sekunde 30 jeder Stunde, alle 4 Stunden'],
      // An offset stride that still tiles names only its start; a bounded one
      // pins both clock-time endpoints; the minute-0 confinement names the odd
      // stride's start, and a non-clean stride keeps enumerating its fires.
      ['30 0 1/2 * * *',
        'in Sekunde 30 jeder Stunde, alle 2 Stunden ab 1 Uhr'],
      ['30 0 5,9,13,17,21 * * *',
        'in Sekunde 30 jeder Stunde, alle 4 Stunden von 5 bis 21 Uhr'],
      ['* 0 1/2 * * *',
        'jede Sekunde für eine Minute in jeder zweiten Stunde ab 1 Uhr'],
      ['* 0 */3 * * *',
        'jede Sekunde für eine Minute in jeder dritten Stunde'],
      // A non-zero pinned minute under an hour step: the second leads, then the
      // minute, then the hour cadence.
      ['30 5 */2 * * *',
        'in Sekunde 30, in Minute 5, alle 2 Stunden'],
      ['* 5 */2 * * *', 'jede Sekunde, in Minute 5, alle 2 Stunden'],
      // An hour RANGE reads as a window, not a wall of clock times: the
      // second/minute lead, then "von 9 bis 17 Uhr" (see the dedicated
      // hour-range section below). Guard: an irregular hour list (no range)
      // has no window to form and still enumerates.
      ['30 0 9,17 * * *', 'täglich um 9:00:30 und 17:00:30 Uhr'],
      ['30 0 9-17 * * *',
        'in Sekunde 30 jeder Stunde, von 9 bis 17 Uhr'],
      // A clean hour step with a plain :00 stays the bare hour cadence.
      ['0 0 */2 * * *', 'alle 2 Stunden']
    ]);
  });

  // A single second under a multi-valued minute and a bounded hour step: the
  // compact clock-time rest owns the second lead ("in Sekunde 30"), so the
  // composer must not prepend its own lead, which once doubled the second.
  describe('Sekunde unter Minutenschritt und begrenztem Stundenschritt',
    function() {
      run([
        ['30 */25 9-17/2 * * *',
          'in Sekunde 30, in den Minuten 0, 25 und 50, ' +
          'alle 2 Stunden von 9 bis 17 Uhr']
      ]);
    });

  // An hour RANGE (or a list whose segments include a range) under minute 0
  // and a meaningful second used to expand into a wall of clock times; it now
  // reads as the hour-range window ("von 9 bis 17 Uhr"). The hour-RANGE analog
  // of the hour-step cadence. A pure single-value hour list (9,17) has no
  // range to span and still enumerates.
  describe('Stundenbereich als Fenster statt Stundenliste', function() {
    run([
      ['30 0 9-17 * * *',
        'in Sekunde 30 jeder Stunde, von 9 bis 17 Uhr'],
      ['5,30 0 9-17 * * *',
        'in den Sekunden 5 und 30 jeder Stunde, von 9 bis 17 Uhr'],
      ['0-10 0 9-17 * * *',
        'in den Sekunden 0 bis 10 jeder Stunde, von 9 bis 17 Uhr'],
      // A wildcard or sub-minute step second is the one-minute window across
      // the range ("für eine Minute, von 9 bis 17 Uhr"); "für eine Minute"
      // carries the :00 confinement, distinct from the bare "stündlich …".
      ['* 0 9-17 * * *',
        'jede Sekunde für eine Minute, von 9 bis 17 Uhr'],
      ['*/15 0 9-17 * * *',
        'alle 15 Sekunden für eine Minute, von 9 bis 17 Uhr'],
      // A range inside a list: the contiguous span is a window, the
      // non-contiguous hour trails as "und um 22 Uhr".
      ['30 0 9-20,22 * * *',
        'in Sekunde 30 jeder Stunde, von 9 bis 20 Uhr und um 22 Uhr'],
      ['* 0 9-20,22 * * *',
        'jede Sekunde für eine Minute, von 9 bis 20 Uhr und um 22 Uhr'],
      // The window carries the trailing day qualifier (no "täglich").
      ['30 0 9-17 * * MON',
        'montags in Sekunde 30 jeder Stunde, von 9 bis 17 Uhr'],
      // Guard: a pure single-value hour list (no range) still enumerates.
      ['30 0 9,17 * * *', 'täglich um 9:00:30 und 17:00:30 Uhr']
    ]);
  });

  describe('Verbundmuster', function() {
    run([
      ['0-30 9,17 * * *', 'in den Minuten 0 bis 30, um 9 und 17 Uhr'],
      ['0-30 9-17/2 * * *',
        'in den Minuten 0 bis 30, alle 2 Stunden von 9 bis 17 Uhr'],
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
      // A uniform offset step (interval divides the cycle, start within the
      // first interval) wraps cleanly: name only its start ("ab Minute M"),
      // keeping the cadence rather than enumerating the offset fires.
      ['5/6 * * * *',
        'alle 6 Minuten ab Minute 5 jeder Stunde'],
      ['11/12 * * * *',
        'alle 12 Minuten ab Minute 11 jeder Stunde'],
      // A minute step under a FIXED hour drops the "jeder Stunde" tail — the
      // hour window already names the single hour, so "jeder Stunde" (every
      // hour) would contradict it. The wildcard-hour guard above keeps it.
      ['5/15 0 1,15 1,7 0',
        'im Januar und Juli alle 15 Minuten ab Minute 5, von 0 bis 0:50 Uhr ' +
        'am 1. und 15. oder sonntags'],
      ['5/15 9 * * *',
        'alle 15 Minuten ab Minute 5, von 9 bis 9:50 Uhr'],
      // A RANGE of hours keeps "jeder Stunde": the cadence really does repeat
      // across each hour of the window, so the tail is true, not contradictory.
      ['5/15 9-17 * * *',
        'alle 15 Minuten ab Minute 5 jeder Stunde, von 9 bis 17:50 Uhr'],
      // An uneven step (interval does not divide the cycle) and an offset step
      // (start >= interval) fire a non-uniform bounded set: named with its
      // interval and both endpoints ("von Minute M bis K"), not enumerated.
      ['*/7 * * * *',
        'alle 7 Minuten von Minute 0 bis 56 jeder Stunde'],
      ['3/2 * * * *',
        'alle 2 Minuten von Minute 3 bis 59 jeder Stunde'],
      ['7/9 * * * *',
        'alle 9 Minuten von Minute 7 bis 52 jeder Stunde'],
      // Compounded: a stepped second over a stepped minute, each a cadence.
      ['3/2 1/2 * * * *',
        'alle 2 Sekunden von Sekunde 3 bis 59, ' +
        'alle 2 Minuten ab Minute 1 jeder Stunde'],
      // A uneven hour step (24 not divisible by the step) has no clean wrap, so
      // it reads as a bounded cadence pinning both endpoints, not a clock list.
      ['0 */5 * * *', 'alle 5 Stunden von 0 bis 20 Uhr'],
      ['0 */9 * * *', 'alle 9 Stunden von 0 bis 18 Uhr'],
      // An OPEN offset-clean hour step (`m/n`, m < n dividing 24) wraps the day
      // with no endpoint: name only its start ("alle N Stunden ab M Uhr"), the
      // cadence the compose paths and en/fi/zh already speak — never the
      // enumerated hour list, and no "täglich" frame (it is a frequency).
      ['0 1/2 * * *', 'alle 2 Stunden ab 1 Uhr'],
      ['0 2/6 * * *', 'alle 6 Stunden ab 2 Uhr'],
      ['0 5/6 * * *', 'alle 6 Stunden ab 5 Uhr'],
      // Guard: an explicitly bounded step (`a-b/n`) keeps its enumerated hours,
      // even when its fires happen to span a clean wrap.
      ['0 1-23/2 * * *',
        'um 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21 und 23 Uhr']
    ]);
  });

  // A bounded or uneven hour stride reads as its endpoint-pinning cadence
  // across the minute paths; an offset-clean bounded step keeps its fires, and
  // a single-fire bounded step is just that value.
  describe('Stundenkadenz über die Minutenpfade', function() {
    run([
      ['0 9-17/2 * * *', 'alle 2 Stunden von 9 bis 17 Uhr'],
      ['0 0,8,16 * * *', 'täglich um 0, 8 und 16 Uhr'],
      ['* */5 * * *', 'jede Minute, alle 5 Stunden von 0 bis 20 Uhr'],
      ['*/25 */5 * * *',
        'in den Minuten 0, 25 und 50, alle 5 Stunden von 0 bis 20 Uhr'],
      ['0-30 */5 * * *',
        'in den Minuten 0 bis 30, alle 5 Stunden von 0 bis 20 Uhr'],
      ['* 9-17/2 * * *', 'jede Minute, alle 2 Stunden von 9 bis 17 Uhr'],
      ['0-30 9-17/2 * * *',
        'in den Minuten 0 bis 30, alle 2 Stunden von 9 bis 17 Uhr'],
      ['0 1-23/2 * * *',
        'um 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21 und 23 Uhr'],
      ['0 9-10/5 * * *', 'täglich um 9 Uhr'],
      // A bounded step from midnight that stops short of the day's last tile
      // (0-20/2 fires 0,2,…,20, never 22) pins both endpoints, like 9-17/2 —
      // it must not read as the all-day "alle 2 Stunden".
      ['23 0-20/2 * * *', 'in Minute 23, alle 2 Stunden von 0 bis 20 Uhr'],
      ['30 0-20/3 * * *', 'in Minute 30, alle 3 Stunden von 0 bis 18 Uhr'],
      // Guards: an open `*/n` and a full-field-equivalent step (0-22/2 ≡ `*/2`)
      // are the all-day set and stay bare.
      ['23 */2 * * *', 'in Minute 23, alle 2 Stunden'],
      ['23 0-22/2 * * *', 'in Minute 23, alle 2 Stunden']
    ]);
  });

  // A stepped minute under a wildcard second and wildcard hour confines the
  // second cadence to the ORDINAL minute cadence ("jede Sekunde in jeder
  // sechsten Minute …"), never the comma juxtaposition that reads as two
  // independent cadences. The offset-clean stride names only its start; the
  // uneven one pins both endpoints ("von Minute 2 bis 58").
  describe('Sekunde unter gestufter Minute (Einschluss)', function() {
    run([
      ['* 4/6 * * * *',
        'jede Sekunde in jeder sechsten Minute ab Minute 4 jeder Stunde'],
      ['* 2/7 * * * *',
        'jede Sekunde in jeder siebten Minute von Minute 2 bis 58 ' +
        'jeder Stunde'],
      ['* */6 * * * *', 'jede Sekunde in jeder sechsten Minute jeder Stunde'],
      ['*/15 4/6 * * * *',
        'alle 15 Sekunden in jeder sechsten Minute ab Minute 4 jeder Stunde']
    ]);
  });

  // A second LIST, RANGE, or SINGLE under a minute restriction CONFINES that
  // restriction in the genitive, never the comma juxtaposition that reads as two
  // independent schedules ("in den Sekunden 5, 10 und 15, alle 6 Minuten …").
  // The seconds clause leads (bare, no "jeder Minute"), then the minute in the
  // genitive ("jeder sechsten Minute …", "der Minuten 0, 15 und 30 …"). NOTE:
  // mirrors c0d0a1f's marker; flagged for native review at graduation (only
  // English was panel-ratified).
  describe('Sekundenliste/-bereich/-einzelwert schließt die Minute ein',
    function() {
      run([
        ['5,10,15 4/6 * * * *',
          'in den Sekunden 5, 10 und 15 jeder sechsten Minute ' +
          'ab Minute 4 jeder Stunde'],
        ['30 4/6 * * * *',
          'in Sekunde 30 jeder sechsten Minute ab Minute 4 jeder Stunde'],
        ['0-30 4/6 * * * *',
          'in den Sekunden 0 bis 30 jeder sechsten Minute ' +
          'ab Minute 4 jeder Stunde'],
        ['30 */6 * * * *',
          'in Sekunde 30 jeder sechsten Minute jeder Stunde'],
        ['30 2/7 * * * *',
          'in Sekunde 30 jeder siebten Minute ' +
          'von Minute 2 bis 58 jeder Stunde'],
        ['5,10,15 0,15,30 * * * *',
          'in den Sekunden 5, 10 und 15 der Minuten 0, 15 und 30 jeder Stunde'],
        ['15 0,30 * * * *',
          'in Sekunde 15 der Minuten 0 und 30 jeder Stunde'],
        ['15 0-30 * * * *',
          'in Sekunde 15 der Minuten 0 bis 30 jeder Stunde'],
        ['5,10 30 * * * *',
          'in den Sekunden 5 und 10 der Minute 30 jeder Stunde'],
        ['0-30 30 * * * *',
          'in den Sekunden 0 bis 30 der Minute 30 jeder Stunde']
      ]);
    });

  describe('Sekunde unter gepaarter Minute (* */N)', function() {
    run([
      // A wildcard second under a minute */2 binds the two cadences instead of
      // juxtaposing the contradictory "jede Sekunde, alle 2 Minuten".
      ['* */2 * * * *', 'jede Sekunde jeder zweiten Minute'],
      // Other clean steps confine as the ordinal cadence.
      ['* */3 * * * *', 'jede Sekunde in jeder dritten Minute jeder Stunde'],
      // Guards: no-seconds and restricted hour are unchanged.
      ['*/2 * * * *', 'alle 2 Minuten'],
      ['* */2 0 * * *', 'jede Sekunde, alle 2 Minuten von 0 bis 0:58 Uhr']
    ]);
  });

  // A CADENCE/STEPPED second under a minute LIST or SINGLE and a wildcard hour
  // leads straight into the locative "in …" minute phrase with NO comma. The
  // locative already binds the two specs; a comma read as two independent
  // specifications and is inconsistent with the no-comma stepped-minute and
  // list-tier (genitive "der") confinements. The preposition split — locative
  // "in" here, genitive "der" for the clock-point list tier — is correct German
  // and stays.
  describe('Sekunden-Kadenz/-Schritt unter Minuten-Liste/-Einzelwert (kein ' +
    'Komma)', function() {
    run([
      ['* 0,15,30 * * * *',
        'jede Sekunde in den Minuten 0, 15 und 30 jeder Stunde'],
      ['* 30 * * * *', 'jede Sekunde in Minute 30 jeder Stunde'],
      ['* 5,30 * * * *', 'jede Sekunde in den Minuten 5 und 30 jeder Stunde'],
      ['*/6 0,15,30 * * * *',
        'alle 6 Sekunden in den Minuten 0, 15 und 30 jeder Stunde']
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
      ['0 9 * * SAT,SUN', 'samstags und sonntags um 9 Uhr'],
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
      ['30 9-17 * * *', 'in Minute 30 jeder Stunde, von 9 bis 17 Uhr'],
      ['5 9-17 * * *', 'in Minute 5 jeder Stunde, von 9 bis 17 Uhr'],
      ['5 9-17 * 1 *', 'in Minute 5 jeder Stunde, von 9 bis 17 Uhr im Januar'],
      ['15,45 9-17 * * *',
        'in den Minuten 15 und 45 jeder Stunde, von 9 bis 17 Uhr'],
      // A non-uniform minute step under an hour range is a cadence, not the wall
      // of fires the core enumerated: the minute leads with its bounded stride
      // ("alle 2 Minuten von Minute 3 bis 59 jeder Stunde"), then the window.
      ['3/2 9-17 * * *',
        'alle 2 Minuten von Minute 3 bis 59 jeder Stunde, von 9 bis 17 Uhr'],
      ['*/7 9-17 * * *',
        'alle 7 Minuten von Minute 0 bis 56 jeder Stunde, von 9 bis 17 Uhr'],
      // A wildcard second over the same shape leads its own clause, then the
      // minute cadence and window.
      ['* 3/2 9-17 * * *',
        'jede Sekunde, alle 2 Minuten von Minute 3 bis 59 jeder Stunde, ' +
        'von 9 bis 17 Uhr'],
      // Guard: an irregular (non-progression) minute list under an hour range
      // still enumerates its fires; only an arithmetic progression compacts.
      ['5,10,30 9-17 * * *',
        'in den Minuten 5, 10 und 30 jeder Stunde, von 9 bis 17 Uhr'],
      ['0 9-20,22 * * *', 'stündlich von 9 bis 20 Uhr und um 22 Uhr'],
      ['0 9 1 * MON', 'am 1. oder montags um 9 Uhr'],
      ['59 23 31 12 5', 'im Dezember am 31. oder freitags um 23:59 Uhr'],
      // Panel: "every minute during the X o'clock hours" is hour windows,
      // not points; a clean hour step is "alle N Stunden", not enumerated.
      ['* 9,12,17 * * *',
        'jede Minute von 9 bis 9:59 Uhr, von 12 bis 12:59 Uhr und von 17 ' +
        'bis 17:59 Uhr'],
      // A range or list under a clean stride trails the same cadence the
      // wildcard form and the minute-step compositions use ("in jeder zweiten
      // Stunde"), never an enumerated hour list or a juxtaposed "alle 2 Stunden".
      ['0-30 */2 * * *', 'in den Minuten 0 bis 30, in jeder zweiten Stunde'],
      ['0-30 1/2 * * *',
        'in den Minuten 0 bis 30, in jeder zweiten Stunde ab 1 Uhr'],
      ['5,30 */2 * * *', 'in den Minuten 5 und 30, in jeder zweiten Stunde'],
      ['5,30 1/2 * * *',
        'in den Minuten 5 und 30, in jeder zweiten Stunde ab 1 Uhr']
    ]);
  });

  describe('Komplexe Muster', function() {
    run([
      ['15 8,12,17 * * *', 'täglich um 8:15, 12:15 und 17:15 Uhr'],
      ['0 0 1 */3 *', 'am 1. Januar, April, Juli und Oktober um Mitternacht'],
      ['0,30 5 9,18 * * *',
        'täglich in den Sekunden 0 und 30 der Minuten 9:05 und 18:05'],
      ['0 0 29 2 *', 'am 29. Februar um Mitternacht'],
      ['0 12 25 12 *', 'am 25. Dezember um 12 Uhr']
    ]);
  });

  describe('Randfälle (vollständige Abdeckung)', function() {
    run([
      // minuteFrequency across discrete hours (each a full hour) / a step.
      ['*/15 9,17 * * *',
        'alle 15 Minuten von 9 bis 9:59 Uhr und von 17 bis 17:59 Uhr'],
      // A bounded hour step has a distinct endpoint, so it reads as a bounded
      // cadence pinning both ends rather than listing its active hours.
      ['*/20 9-17/2 * * *',
        'alle 20 Minuten, alle 2 Stunden von 9 bis 17 Uhr'],
      // A clean (unbounded) hour step confines the cadence to every Nth hour,
      // not a juxtaposed second cadence ("alle 2 Stunden").
      ['*/15 */2 * * *', 'alle 15 Minuten in jeder zweiten Stunde'],
      ['*/15 */3 * * *', 'alle 15 Minuten in jeder dritten Stunde'],
      // An offset stride keeps the confinement and names its start.
      ['*/15 1/2 * * *', 'alle 15 Minuten in jeder zweiten Stunde ab 1 Uhr'],
      ['*/15 1/3 * * *', 'alle 15 Minuten in jeder dritten Stunde ab 1 Uhr'],
      ['* 1/2 * * *', 'jede Minute in jeder zweiten Stunde ab 1 Uhr'],
      // An OFFSET minute frequency under a restricted hour step drops its
      // generic "jeder Stunde": the hour step is the sole hour authority, so
      // an every-hour scope alongside it would conflict. This holds for an open
      // step (every Nth hour) and a bounded step (its endpoint-pinning cadence).
      ['5/10 0/4 * * *',
        'alle 10 Minuten ab Minute 5 in jeder vierten Stunde'],
      ['5/10 9-17/2 * * *',
        'alle 10 Minuten ab Minute 5, alle 2 Stunden von 9 bis 17 Uhr'],
      // An hour WINDOW keeps "jeder Stunde": the window names the hours, so
      // there is no every-hour-of-the-day conflict.
      ['5/10 1-6 * * *',
        'alle 10 Minuten ab Minute 5 jeder Stunde, von 1 bis 6:55 Uhr'],
      // A uneven hour step reads as its bounded cadence the same way.
      ['*/15 */5 * * *',
        'alle 15 Minuten, alle 5 Stunden von 0 bis 20 Uhr'],
      // The same clean hour step composed with a second clause.
      ['0-10 */15 */2 L * *',
        'in den Sekunden 0 bis 10, ' +
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
      // secondsWithinMinute with a non-single second: the range confines the
      // single minute in the genitive, never the comma juxtaposition.
      ['0-10 0 * * * *',
        'in den Sekunden 0 bis 10 der Minute 0 jeder Stunde'],
      // date+weekday OR where the weekday is a Quartz form.
      ['0 9 1 * 5L', 'am 1. oder am letzten Freitag des Monats um 9 Uhr'],
      // A wildcard second composed with a minute-0 clock time: the pinned
      // clock minute surfaces in the genitive under the "täglich" frame, never
      // the bare hour ("um 9 Uhr"), which would hide the :00.
      ['* 0 9 * * *', 'täglich jede Sekunde der Minute 9:00'],
      // Minute 0 under a sub-minute second must be stated, not absorbed into
      // a bare hourly idiom ("jede Stunde" / "alle 2 Stunden" / "stündlich von
      // 9 bis 17 Uhr") that silently drops the :00. An hour range surfaces it
      // with the "für eine Minute" frame, then the window.
      ['* 0 * * * *', 'jede Sekunde in Minute 0 jeder Stunde'],
      ['* 0 9-17 * * *',
        'jede Sekunde für eine Minute, von 9 bis 17 Uhr'],
      // A wildcard minute under a restricted hour: the hour window must
      // survive (it once collapsed to a bare "jede Sekunde"). Fuzzer-found.
      ['* * 9 * * *', 'jede Sekunde, jede Minute der 9-Uhr-Stunde'],
      ['*/15 * 9-17 * * *',
        'alle 15 Sekunden, jede Minute von 9 bis 17:59 Uhr'],
      ['0-30 * 9 * * *',
        'in den Sekunden 0 bis 30 jeder Minute, ' +
        'jede Minute der 9-Uhr-Stunde'],
      // during-hours given as segments (a range must not collapse to its
      // start), found by the fuzzer.
      ['*/15 9-20,22 * * *',
        'alle 15 Minuten von 9 bis 20:59 Uhr und von 22 bis 22:59 Uhr'],
      // A clock time carrying a second must not drop it (or read Mitternacht).
      ['30 0 0 * * *', 'täglich um 0:00:30 Uhr'],
      // compactClockTimes: a range among the hours reads as a window.
      ['5,10,30 9-20,22 * * *',
        'in den Minuten 5, 10 und 30, von 9 bis 20 Uhr und um 22 Uhr'],
      // A range inside a list under a meaningful second reads as the window
      // cadence: the second/minute lead, then "von 9 bis 20 Uhr und um 22 Uhr"
      // (the hour-range section covers the family).
      ['30 0 9-20,22 * * *',
        'in Sekunde 30 jeder Stunde, von 9 bis 20 Uhr und um 22 Uhr']
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

  // Tag-Vereinigung (OR-Tag): ist sowohl der Tag des Monats als auch der
  // Wochentag eingeschränkt, feuert cron an der VEREINIGUNG beider Mengen. Das
  // "… oder …"-Gerüst liest sich als einschließende Vereinigung. Ein etwaiger
  // Monat umklammert die GANZE Vereinigung, also führt er den Satz an ("im
  // Januar am 1. oder sonntags"), statt nur dem letzten Glied anzuhängen ("am
  // 1. oder sonntags im Januar" läse sich, als gälte der 1. ganzjährig). Ein
  // offener `*/2`-Schritt im Tagesfeld liest sich als ungerade-Tage-Klasse, nie
  // als 16-fache Datumsaufzählung.
  describe('Tag-Vereinigung (OR-Tag)', function() {
    run([
      ['0 0 1 * 5', 'am 1. oder freitags um Mitternacht'],
      // Wochentagsspanne als Klasse, parallel zur Datumsangabe.
      ['0 0 1 * 1-5', 'am 1. oder an einem Wochentag (Mo–Fr) um Mitternacht'],
      ['0 0 1 * 5L',
        'am 1. oder am letzten Freitag des Monats um Mitternacht'],
      // `*/2` im Tagesfeld: ungerade-Tage-Prädikat statt 16-Datums-Liste.
      ['0 0 */2 * */2',
        'an jedem ungeraden Tag des Monats oder dienstags, donnerstags, ' +
        'samstags und sonntags um Mitternacht'],
      // `2/2` ist die Klasse der geraden Tage; ein anderer offener Schritt
      // (`*/3`) trägt keine Paritäts-Klasse und zählt seine Tage auf.
      ['0 0 2/2 * 0',
        'an jedem geraden Tag des Monats oder sonntags um Mitternacht'],
      ['0 0 */3 * 0',
        'am 1., 4., 7., 10., 13., 16., 19., 22., 25., 28. und 31. oder ' +
        'sonntags um Mitternacht'],
      ['0 0 1-15 * 0', 'vom 1. bis zum 15. oder sonntags um Mitternacht'],
      ['0 0 L * 5L',
        'am letzten Tag des Monats oder am letzten Freitag des Monats ' +
        'um Mitternacht'],
      ['0 0 L * 0', 'am letzten Tag des Monats oder sonntags um Mitternacht'],
      // Monat umklammert beide Glieder: er führt den Satz an.
      ['0 0 1 1 0', 'im Januar am 1. oder sonntags um Mitternacht'],
      ['0 0 1 1-3 5L',
        'von Januar bis März am 1. oder am letzten Freitag des Monats ' +
        'um Mitternacht'],
      ['*/5 * 1 * 5', 'alle 5 Minuten am 1. oder freitags'],
      ['*/5 * 1 6 5', 'im Juni alle 5 Minuten am 1. oder freitags'],
      ['0 9-17 1 6 5',
        'im Juni stündlich von 9 bis 17 Uhr am 1. oder freitags']
    ]);
  });

  describe('Sonderfälle', function() {
    run([
      ['@reboot', 'beim Systemstart'],
      ['kein Cron', 'ein unlesbares Cron-Muster', {lenient: true}]
    ]);
  });

  // Zusätzliche Abdeckung: Stundenlisten und -bereiche mit Sekunden/Minuten-
  // Kadenz. Jede Zeile beschreibt denselben Zeitplan wie die englische Ausgabe.
  describe('zusätzliche Abdeckung (Stundenlisten/-bereiche)', function() {
    run([
      ['0 0 9,17 * * *', 'täglich um 9 und 17 Uhr'],
      ['0 9,12,17 * * *', 'täglich um 9, 12 und 17 Uhr'],
      ['* 9,17 * * *',
        'jede Minute von 9 bis 9:59 Uhr und von 17 bis 17:59 Uhr'],
      ['*/15 0,12 * * *',
        'alle 15 Minuten von 0 bis 0:59 Uhr und von 12 bis 12:59 Uhr'],
      ['15 0 9-17 * * *',
        'in Sekunde 15 jeder Stunde, von 9 bis 17 Uhr'],
      ['30 0 9-17/2 * * *',
        'in Sekunde 30 jeder Stunde, alle 2 Stunden von 9 bis 17 Uhr'],
      // An offset-clean hour step enumerates its fires as clock times.
      ['0 0 8/4 * * *', 'täglich um 8, 12, 16 und 20 Uhr'],
      ['0 30 0,8,16 * * *', 'täglich um 0:30, 8:30 und 16:30 Uhr']
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

  // Der offene Tages-Schritt `*/2` liest sich als Kadenz, nicht als 16-fache
  // Aufzählung (die die Vereinigung im OR-Fall begrübe).
  it('liest den Tages-Schritt als Kadenz, nicht als Aufzählung', function() {
    const text = cronli5('0 0 */2 * *', {lang: de});

    expect(text).to.not.include('29.');
    expect(text).to.equal('jeden zweiten Tag des Monats um Mitternacht');
  });
});
