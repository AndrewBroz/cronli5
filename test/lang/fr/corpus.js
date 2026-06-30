import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import fr from '../../../src/lang/fr/index.js';

const {expect} = chai;

// ===========================================================================
// REVIEWED ORACLE — fr-FR (donor: es). Ratified by the blind fr-FR panel.
// ===========================================================================
//
// This is the fr-FR reviewed oracle the renderer will chase (corpus -> review
// -> port; see tooling/docs/language-pipeline.md Stage 2). It was drafted by
// translating the reviewed es corpus (test/lang/es/corpus.js) into fr-FR idiom
// per src/lang/fr/notes.md — the sanctioned drafting method for a
// sibling-derived language (CLAUDE.md: the "never generated" rule governs the
// *shipped* oracle; translating a reviewed sibling's reviewed corpus to a
// target candidate is explicitly sanctioned) — and then FINALIZED by the blind
// 3-persona fr-FR native panel (everyday / copy-editor / technical,
// 2026-06-27). The panel found ZERO misreads (every fire set correct), ratified
// all seven contested conventions, and agreed five naturalness/consistency
// fixes (now applied): zero-minute suppression in the seconds-clock;
// minuit/midi as exact-point only (numeric hour-ranges); singular-definite
// multi-day weekday lists; "ouvrable" for the W operator; "h" on bare-numeral
// hour lists. See src/lang/fr/notes.md for the resolved conventions.
//
// NO RENDERER EXISTS YET. fr has no status.json, so the suite enumeration
// skips it; this file imports src/lang/fr/index.js (which does not exist yet),
// so it is in vitest.config.ts `exclude` until the port stage wires it in
// (exactly as pt's Stage-2 candidate was, then removed at the port).
//
// fr-FR contract applied uniformly (notes.md), each form pinned rather than
// trusted to the translation (the pt-run inheritance lesson: a translated
// corpus silently keeps the donor's conventions — pin the ratified forms):
//   - 24-HOUR ONLY. {ampm} is a documented NO-OP for fr (notes.md). The es
//     "horas del día (reloj de 12 horas)" block and every {ampm:true}
//     day-period entry have NO fr analog and are DROPPED — a justified
//     coverage divergence (like pt dropping regional dialects). Full 24h
//     coverage is kept.
//   - Clock: spaced "h", UNPADDED hour, NO definite article on the time, NO
//     zero-padding: "à 9 h 30", "à 1 h", bare "9 h" at the top of the hour
//     (no "h 00"). Spaced "9 h 30" is the ratified default; unspaced "9h30" is
//     the opt-in dialect register.
//   - minuit / midi for exact 0:00 / 12:00 — bare nouns, no article, no "h"
//     ("à minuit", "à midi"). EXACT-POINT only: a per-hour window over the
//     midnight/noon hour is numeric ("de 0 h à 0 h 59", "de 12 h à 12 h 59").
//   - Per-VALUE ordinal: the 1st is "le 1er"; every other day is the bare
//     cardinal with the article ("le 2", "le 15", "le 31"). The "1er" carries
//     into ranges (first term only), lists, and OR-union date arms.
//   - Contractions: de+le=du, de+les=des, à+le=au, à+les=aux; "de la"/"à la"/
//     "de l'"/"à l'" stay unfused; "de chaque" unfused. On date/scope nouns,
//     NOT the clock (no article on a clock time).
//   - Gender: masculine weekdays (le lundi), masculine months; gendered nth
//     ordinals (premier/première, dernier/dernière) agreeing with the target
//     noun; "le dernier jour", "tous les jours", "chaque heure"/"chaque mois",
//     the agreeing cadence determiner (toutes les heures / tous les mois).
//   - Seconds-clock "H h MM min SS s", with the zero-minute suppressed
//     ("9 h 30 s", not "9 h 0 min 30 s"); "min" kept only when minutes are
//     non-zero ("9 h 30 min 15 s").
//   - W operator: "ouvrable" (the legally-workable day the token selects), not
//     "ouvré" (a worked-time term).
//   - Bare-numeral active-hour lists carry the "h": "pendant les heures de
//     0 h, 3 h, 6 h, …".
//   - Weekday recurrence: "le lundi" (= every Monday, singular definite, the
//     habitual reading — NOT "les lundis"). Ranges "du lundi au vendredi".
//     Multi-day lists stay singular-definite, repeating the article ("le lundi,
//     le mercredi et le vendredi") — NOT the es-style plural "les lundis".
//   - OR-union frame: "soit X soit Y" (the fr inclusive either-or correlative;
//     month fronted once, arms month-less, exactly as es). A single-weekday arm
//     reads "n'importe quel lundi"; a range arm reads "n'importe quel jour du
//     lundi au vendredi".
//   - Connectives: et / ou; range "de … à …", "du … au …"; "jusqu'à" only where
//     a terminal "until" reads better (default to "à", mirroring es). No
//     RAE-style comma before "et" (the es "coma ante 'y'" is DROPPED — moot
//     anyway: fr has no day periods).
//   - Lowercase month and weekday names.
//   - Ported re-strategies (language-neutral, fr form): per-hour windows for
//     wildcard minutes ("de 9 h à 9 h 59"), no-fold month range, step-flattening,
//     anchored "à la minute 30 de chaque heure".
//
// es-MX / es-US regional-dialect rows are REMOVED: fr has no regional dialect
// yet (fr-CA is a future axis, notes.md §"Dialect axis"). The es custom-style
// block ("dialecto personalizado") is kept, translated to "style personnalisé".
// ===========================================================================

function run(cases, shared) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...shared || {}, ...values[2] || {}, lang: fr};

    describe(JSON.stringify(pattern), function() {
      it('se lit « ' + expected + ' »', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

describe('Français (fr):', function() {
  describe('fréquences de base', function() {
    run([
      ['* * * * *', 'chaque minute'],
      ['*/5 * * * *', 'toutes les cinq minutes'],
      ['*/15 * * * *', 'toutes les 15 minutes'],
      ['0 * * * *', 'chaque heure'],
      ['0 */6 * * *', 'toutes les six heures'],
      ['* * * * * *', 'chaque seconde'],
      ['*/30 * * * * *', 'toutes les 30 secondes']
    ]);
  });

  describe('heures de la journée (horloge de 24 heures, par défaut)', function() {
    // Clock: unpadded, spaced "h", no article, no padding; bare "9 h" at
    // the top of the hour; minuit/midi for 0:00/12:00.
    run([
      ['0 9 * * *', 'tous les jours à 9 h'],
      ['30 9 * * *', 'tous les jours à 9 h 30'],
      ['30 17 * * *', 'tous les jours à 17 h 30'],
      // 0:00 and 12:00 read as the bare nouns minuit / midi.
      ['0 0 * * *', 'tous les jours à minuit'],
      ['0 12 * * *', 'tous les jours à midi'],
      // One o'clock is just "1 h" (no article on the time, unlike es "a la").
      ['0 1 * * *', 'tous les jours à 1 h'],
      ['0 13 * * *', 'tous les jours à 13 h'],
      ['0 9,17 * * *', 'tous les jours à 9 h et 17 h'],
      // fr has no la/las article split: every clock value reads with bare "à".
      ['0 1,13 * * *', 'tous les jours à 1 h et 13 h'],
      // An irregular five-value list (not an arithmetic progression, so it
      // stays an enumeration). No article grouping; "à" once, comma series.
      ['0 1,6,11,16,22 * * *',
        'tous les jours à 1 h, 6 h, 11 h, 16 h et 22 h'],
      ['0 1,2,3 * * *', 'tous les jours à 1 h, 2 h et 3 h'],
      ['30 1,5,13 * * *', 'tous les jours à 1 h 30, 5 h 30 et 13 h 30'],
      // A wrap range folded into a list; midnight reads "minuit" inside the list.
      ['0 22-2,12 * * *',
        'tous les jours à 1 h, 12 h, 22 h, 23 h, minuit et 2 h'],
      ['0 22-2 * * *', 'chaque heure de 22 h à 2 h'],
      ['0 9-20,22 * * *',
        'chaque heure de 9 h à 20 h et aussi à 22 h'],
      // A single hour with a wildcard minute is the whole hour: it reads as
      // that hour ("l'heure de 9 h"), not a synthesized "de 9 h à 9 h 59"
      // range the source never stated. de+l' stays unfused.
      ['* 9 * * *', 'chaque minute de l\'heure de 9 h'],
      ['* 0 * * *', 'chaque minute de l\'heure de minuit'],
      ['* 12 * * *', 'chaque minute de l\'heure de midi'],
      ['* 1 * * *', 'chaque minute de l\'heure de 1 h']
    ]);
  });

  describe('jours de la semaine', function() {
    // "le lundi" = every Monday (singular definite, habitual). Ranges
    // "du lundi au vendredi" (du/au contractions). Lists repeat the article,
    // singular-definite ("le lundi, le mercredi et le vendredi").
    run([
      ['0 9 * * MON', 'le lundi à 9 h'],
      ['30 9 * * MON-FRI', 'du lundi au vendredi à 9 h 30'],
      ['0 14 * * 1,3,5',
        'le lundi, le mercredi et le vendredi à 14 h'],
      ['*/15 * * * MON', 'toutes les 15 minutes le lundi'],
      ['*/15 * * * MON-FRI', 'toutes les 15 minutes du lundi au vendredi'],
      ['0 0 * * FRI-MON', 'du vendredi au lundi à minuit']
    ]);
  });

  describe('dates et mois', function() {
    // Per-VALUE ordinal: the 1st is "le 1er"; every other day cardinal
    // ("le 2", "le 15"). Contractions du/des on
    // date/scope nouns; "de chaque mois" unfused. midi/minuit pinned.
    run([
      ['0 12 1 1 *', 'le 1er janvier à midi'],
      ['0 0 13 * *', 'le 13 de chaque mois à minuit'],
      ['0 * 13 * *', 'chaque heure le 13 de chaque mois'],
      ['0 0 1,15 * *', 'le 1er et le 15 de chaque mois à minuit'],
      ['0 0 1-15 * *', 'du 1er au 15 de chaque mois à minuit'],
      ['0 0 1-15/3 * *',
        'le 1er, le 4, le 7, le 10 et le 13 de chaque mois à minuit'],
      ['0 0 1,20-28/4 * *',
        'le 1er, le 20, le 24 et le 28 de chaque mois à minuit'],
      ['0 0 1-15/3 6 *', 'le 1er, le 4, le 7, le 10 et le 13 juin à minuit'],
      ['0 12 * 6,12 *',
        'tous les jours de juin et décembre à midi'],
      // No-fold month range: "de novembre à février" never folds.
      ['0 12 * 11-2 *',
        'tous les jours de novembre à février à midi'],
      ['0 12 * 1,3-6 *',
        'tous les jours de janvier et de mars à juin à midi'],
      ['0 0 1 6-9 *',
        'le 1er de chaque mois, de juin à septembre à minuit'],
      ['0 0 1,15 6-9 *',
        'le 1er et le 15 de chaque mois, de juin à septembre à minuit'],
      ['0 0 1-15 6-9 *',
        'du 1er au 15 de chaque mois, de juin à septembre à minuit'],
      ['0 0 1 12-1 *',
        'le 1er de chaque mois, de décembre à janvier à minuit'],
      ['0 0 1 1,3-6 *',
        'le 1er de chaque mois, de janvier et de mars à juin à minuit'],
      ['0 0 1 1-11/3 *',
        'le 1er janvier, avril, juillet et octobre à minuit'],
      // OR-union: "soit X soit Y"; the day-1 arm "le 1er"; weekday arm
      // "n'importe quel vendredi" (es "cualquier viernes").
      ['0 0 1 6-9 FRI',
        'de juin à septembre à minuit, soit le 1er, soit n\'importe quel vendredi'],
      // "le dernier jour" (jour masculine), du/des contractions on the scope.
      ['0 0 L 6-9 *',
        'le dernier jour du mois, de juin à septembre à minuit'],
      ['0 0 */2 6-9 *',
        'tous les deux jours du mois, de juin à septembre à minuit'],
      ['0 12 * 6-9 MON',
        'le lundi, de juin à septembre à midi']
    ]);
  });

  describe('minutes et secondes ancrées', function() {
    // Anchored minute reads "à la minute 30 de chaque heure" (à+la unfused,
    // de+chaque unfused) — the donor's "en el minuto 30 de cada hora".
    run([
      ['30 * * * *', 'à la minute 30 de chaque heure'],
      ['0,30 * * * *', 'aux minutes 0 et 30 de chaque heure'],
      ['0-29 * * * *', 'chaque minute de 0 à 29 de chaque heure'],
      ['15 * * * * *', 'à la seconde 15 de chaque minute'],
      ['15 30 * * * *', 'à la minute 30 et à la seconde 15 de chaque heure'],
      ['1 1 * * * *', 'à la minute 1 et à la seconde 1 de chaque heure'],
      // Seconds list + fixed clock time: nest seconds into the time with
      // genitive "de 9 h 30"; never "de chaque minute" when the minute is fixed.
      ['5,10 30 9 * * MON', 'le lundi, aux secondes 5 et 10 de 9 h 30'],
      // A date-OR-weekday union drops the day frame here; the unified frame
      // supplies the day-level suffix, so the seconds clause leads it.
      ['5,10 0 9 1 * MON',
        'aux secondes 5 et 10 de 9 h, soit le 1er de chaque mois, ' +
        'soit n\'importe quel lundi'],
      // Guard: wildcard minute keeps "de chaque minute".
      // Second-step + fixed minute + hour range + weekday: anchor cadence to the minute.
      ['*/15 30 9-17 * * MON-FRI',
        'du lundi au vendredi, de 9 h à 17 h, toutes les 15 secondes de la minute 30'],
      // Minute window confined to specific hours.
      ['0-30 9,17-19 * * *',
        'chaque minute de 0 à 30, à 9 h, 17 h, 18 h et 19 h'],
      // Seconds list + multi-time clock list: seconds must nest into ALL clock
      // times, not just the first.
      ['5,30 0 9,17 1 * *',
        'le 1er de chaque mois, aux secondes 5 et 30 de 9 h et 17 h'],
      ['5,30 5,10,30 0 1 * *',
        'le 1er de chaque mois, aux secondes 5 et 30 de 0 h 5, 0 h 10 et 0 h 30']
    ]);
  });

  describe('motifs composés', function() {
    run([
      ['*/15 9-17 * * *',
        'toutes les 15 minutes de 9 h à 17 h 45'],
      ['* 9 * * *', 'chaque minute de l\'heure de 9 h'],
      ['0 9-17 * * *',
        'chaque heure de 9 h à 17 h'],
      ['30 9-17 * * *',
        'à la minute 30 de chaque heure, ' +
        'de 9 h à 17 h'],
      ['5 9-17 * * *',
        'à la minute 5 de chaque heure, ' +
        'de 9 h à 17 h'],
      ['5 9-17 * 1 *',
        'à la minute 5 de chaque heure, ' +
        'de 9 h à 17 h en janvier'],
      ['0 22-2 * * *',
        'chaque heure de 22 h à 2 h'],
      // Per-hour windows for wildcard/step minutes over hour lists (notes.md):
      // "de 9 h à 9 h 59" (bare hours, de/à, no article).
      ['*/15 9,17 * * *',
        'toutes les 15 minutes de 9 h à 9 h 59 ' +
        'et de 17 h à 17 h 59'],
      ['* 9,17 * * *',
        'chaque minute de 9 h à 9 h 59 ' +
        'et de 17 h à 17 h 59'],
      ['0-30 9,17 * * *',
        'chaque minute de 0 à 30, à 9 h et 17 h'],
      ['0-30 */2 * * *',
        'chaque minute de 0 à 30, toutes les deux heures'],
      // A minute list under a clean stride keeps the same cadence the range
      // and wildcard forms do, never enumerating the hours. Under an hour STEP
      // the minute clause drops "de chaque heure": the step is the sole hour
      // authority, so the cadence binds to it (as in de/fi). "de chaque heure"
      // alongside "toutes les deux heures" would be a conflicting every-hour
      // scope.
      ['5,30 */2 * * *',
        'aux minutes 5 et 30, toutes les deux heures'],
      ['5,30 1/2 * * *',
        'aux minutes 5 et 30, ' +
        'toutes les deux heures à partir de 1 h']
    ]);
  });

  // A minute CADENCE under an hour STEP must not assert a generic every-hour
  // scope ("de chaque heure"): the hour step is the sole hour authority. An
  // hour WINDOW (9-17) and the hour=* case keep "de chaque heure" — the window
  // names the hours, so there is no every-hour-of-the-day conflict.
  describe('la cadence des minutes se lie au pas horaire, sans portée ' +
    'générique', function() {
    run([
      ['2/7 0/4 * * *',
        'toutes les sept minutes de la minute 2 à 58, toutes les quatre heures'],
      ['5/10 0/4 * * *',
        'toutes les dix minutes à partir de la minute 5, ' +
        'pendant les heures de 0 h, 4 h, 8 h, 12 h, 16 h et 20 h'],
      ['3/2 1/2 * * *',
        'toutes les deux minutes de la minute 3 à 59, ' +
        'toutes les deux heures à partir de 1 h'],
      // A bounded hour step is the sole hour authority, so a minute cadence or
      // list drops its generic "de chaque heure".
      ['3/2 9-17/2 * * *',
        'toutes les deux minutes de la minute 3 à 59, ' +
        'toutes les deux heures de 9 h à 17 h'],
      ['2/7 9-17/2 * * *',
        'toutes les sept minutes de la minute 2 à 58, ' +
        'toutes les deux heures de 9 h à 17 h'],
      ['5,30 9-17/2 * * *',
        'aux minutes 5 et 30, ' +
        'toutes les deux heures de 9 h à 17 h'],
      // Hour WINDOW keeps "de chaque heure".
      ['2/7 9-17 * * *',
        'toutes les sept minutes de la minute 2 à 58 de chaque heure, ' +
        'de 9 h à 17 h'],
      ['5/10 1-6 * * *',
        'toutes les dix minutes à partir de la minute 5 de chaque heure ' +
        'de 1 h à 6 h 55'],
      // hour=* keeps "de chaque heure" (the only hour statement).
      ['2/7 * * * *',
        'toutes les sept minutes de la minute 2 à 58 de chaque heure']
    ]);
  });

  describe('secondes composées', function() {
    run([
      ['*/15 30 9 * * *',
        'toutes les 15 secondes de 9 h 30, tous les jours'],
      ['15 30 9 * * *', 'tous les jours à 9 h 30 min 15 s']
    ]);

    // A fixed hour under a stepped minute (six-field, seconds wildcard) names
    // the hour — "à midi" — not a false "à 12 h" the minute never fires at.
    run([
      ['* 3/2 12 1-5 * *',
        'chaque seconde, toutes les deux minutes de la minute 3 à 59 de chaque heure, ' +
        'à midi du 1er au 5 de chaque mois']
    ]);
  });

  // A stepped minute under a wildcard second and wildcard hour confines the
  // second cadence to the ORDINAL minute cadence ("chaque seconde à la sixième
  // minute …"), never the comma juxtaposition that reads as two independent
  // cadences. The offset-clean stride names only its start; the uneven one pins
  // both endpoints ("de la minute 2 à 58").
  describe('seconde sous une minute échelonnée (confinement)', function() {
    run([
      ['* 4/6 * * * *',
        'chaque seconde à la sixième minute à partir de la minute 4 ' +
        'de chaque heure'],
      ['* 2/7 * * * *',
        'chaque seconde à la septième minute de la minute 2 à 58 ' +
        'de chaque heure'],
      ['* */6 * * * *', 'chaque seconde à la sixième minute de chaque heure'],
      ['*/15 4/6 * * * *',
        'toutes les 15 secondes à la sixième minute à partir de la minute 4 ' +
        'de chaque heure']
    ]);
  });

  // A second LIST, RANGE, or SINGLE under a minute restriction CONFINES that
  // restriction in the genitive, never the comma juxtaposition that reads as two
  // independent schedules ("aux secondes 5, 10 et 15 de chaque minute, toutes
  // les six minutes …"). The seconds clause leads (bare, no "de chaque
  // minute"), then the minute in the genitive ("de la sixième minute …", "des
  // minutes 0, 15 et 30 …"). NOTE: mirrors c0d0a1f's marker; flagged for native
  // review at graduation (only English was panel-ratified).
  describe('seconde liste/plage/unité confine la restriction de la minute',
    function() {
      run([
        ['5,10,15 4/6 * * * *',
          'aux secondes 5, 10 et 15 de la sixième minute ' +
          'à partir de la minute 4 de chaque heure'],
        ['30 4/6 * * * *',
          'à la seconde 30 de la sixième minute ' +
          'à partir de la minute 4 de chaque heure'],
        ['0-30 4/6 * * * *',
          'chaque seconde de 0 à 30 de la sixième minute ' +
          'à partir de la minute 4 de chaque heure'],
        ['30 */6 * * * *',
          'à la seconde 30 de la sixième minute de chaque heure'],
        ['30 2/7 * * * *',
          'à la seconde 30 de la septième minute ' +
          'de la minute 2 à 58 de chaque heure'],
        ['5,10,15 0,15,30 * * * *',
          'aux secondes 5, 10 et 15 des minutes 0, 15 et 30 de chaque heure'],
        ['15 0-30 * * * *',
          'à la seconde 15 de chaque minute de 0 à 30 de chaque heure'],
        ['5,10 30 * * * *',
          'aux secondes 5 et 10 de la minute 30 de chaque heure'],
        ['0-30 30 * * * *',
          'chaque seconde de 0 à 30 de la minute 30 de chaque heure']
      ]);
    });

  describe('seconde sous une minute appariée (* */N)', function() {
    run([
      // A wildcard second under a minute */2 binds the two cadences instead of
      // juxtaposing the contradictory "chaque seconde, toutes les deux minutes".
      ['* */2 * * * *', 'chaque seconde de chaque deux minutes'],
      // Other clean steps confine as the ordinal cadence.
      ['* */3 * * * *', 'chaque seconde à la troisième minute de chaque heure'],
      ['* */15 * * * *',
        'chaque seconde à la quinzième minute de chaque heure'],
      // Guards: no-seconds, restricted hour, hour cadence are unchanged.
      ['*/2 * * * *', 'toutes les deux minutes'],
      ['* */2 0 * * *',
        'chaque seconde, toutes les deux minutes de 0 h à 0 h 58'],
      ['* */2 */2 * * *',
        'chaque seconde, toutes les deux minutes, pendant les heures paires']
    ]);
  });

  describe('jetons Quartz', function() {
    // Gendered nth ordinals agreeing with the (masculine) weekday/jour:
    // "le dernier jour", "le dernier vendredi", "le deuxième lundi".
    run([
      ['0 0 L * *', 'le dernier jour du mois à minuit'],
      ['0 0 * * 5L', 'le dernier vendredi du mois à minuit'],
      ['0 0 * * 1#2', 'le deuxième lundi du mois à minuit'],
      ['0 0 15W * *', 'le jour ouvrable le plus proche du 15 à minuit']
    ]);
  });

  describe('années', function() {
    run([
      ['0 0 12 25 12 * 2030', 'le 25 décembre 2030 à midi'],
      ['0 0 9 * * * 2030', 'tous les jours à 9 h en 2030']
    ]);
  });

  describe('date ou jour de la semaine', function() {
    // OR-union: "soit X soit Y". Single-weekday arm "n'importe quel X" (es
    // "cualquier X"); range arm "n'importe quel jour du lundi au vendredi".
    // 24-hour only (the 12-hour ampm rows from es are DROPPED).
    run([
      // Single month, single DOM, single DOW. (es 12h row dropped; 24h kept.)
      ['59 23 31 12 5',
        'en décembre à 23 h 59, soit le 31, soit n\'importe quel vendredi'],
      // Single month — le N arm.
      ['0 0 1 1 0', 'en janvier à minuit, soit le 1er, soit n\'importe quel dimanche'],
      // Wildcard month — le N de chaque mois arm.
      ['0 0 1 * 5L', 'à minuit, soit le 1er de chaque mois, soit le dernier vendredi du mois'],
      // Wildcard month, step DOM, step DOW. In the OR union the `*/2` day-of-
      // month is the parity predicate "un jour impair du mois" (the odd days
      // 1,3,…,31 resetting each month), not the durative "tous les deux jours".
      ['0 0 */2 * */2',
        'à minuit, soit un jour impair du mois, soit le mardi, le jeudi, le samedi et le dimanche'],
      // Even-day start (`2/2`) selects the complementary parity predicate
      // "un jour pair du mois" in the OR union.
      ['0 0 2/2 * 0',
        'à minuit, soit un jour pair du mois, soit n\'importe quel dimanche'],
      // Enumeration/step months (>=2): month lead with trailing comma.
      ['0 0 */2 */2 */2',
        'en janvier, mars, mai, juillet, septembre et novembre, à minuit, ' +
        'soit un jour impair du mois, soit le mardi, le jeudi, le samedi et le dimanche'],
      ['0 0 L */2 */2',
        'en janvier, mars, mai, juillet, septembre et novembre, à minuit, ' +
        'soit le dernier jour du mois, soit le mardi, le jeudi, le samedi et le dimanche'],
      // Range month (no trailing comma).
      ['0 0 1-15 1-3 */2',
        'de janvier à mars à minuit, soit du 1er au 15 du mois, soit le mardi, le jeudi, le samedi et le dimanche'],
      ['0 0 1 1-3 0',
        'de janvier à mars à minuit, soit le 1er, soit n\'importe quel dimanche'],
      // Frequency + wildcard month.
      ['*/5 */2 1 * 5',
        'toutes les cinq minutes, pendant les heures paires, soit le 1er de chaque mois, soit n\'importe quel vendredi'],
      // Mixed weekday arm (range + single): exercises the mixed-list dow branch.
      ['0 0 1 * 0,1-5',
        'à minuit, soit le 1er de chaque mois, soit du lundi au vendredi et le dimanche'],
      ['0 0 1 6-9 0,1-5',
        'de juin à septembre à minuit, soit le 1er, soit du lundi au vendredi et le dimanche'],
      // Irregular hour list with a 1-o'clock fire (not a progression, so it
      // stays an enumeration). No fr article split; bare "à" once.
      ['5 1,6,11,16,22 1 1,7 MON',
        'en janvier et juillet, à 1 h 5, 6 h 5, 11 h 5, 16 h 5 et 22 h 5, ' +
        'soit le 1er, soit n\'importe quel lundi']
    ]);
  });

  describe('pas avec décalage et bornés', function() {
    run([
      ['5/15 * * * *',
        'toutes les 15 minutes à partir de la minute 5 de chaque heure'],
      ['40/15 * * * *', 'aux minutes 40 et 55 de chaque heure'],
      ['0-30/10 * * * *', 'aux minutes 0, 10, 20 et 30 de chaque heure'],
      // An uneven step / offset step fire a non-uniform bounded set: named with
      // its interval and both endpoints ("de la minute M à K"), not enumerated.
      ['*/7 * * * *',
        'toutes les sept minutes de la minute 0 à 56 de chaque heure'],
      ['3/2 * * * *',
        'toutes les deux minutes de la minute 3 à 59 de chaque heure'],
      ['7/9 * * * *',
        'toutes les neuf minutes de la minute 7 à 52 de chaque heure'],
      // A uniform offset step wraps cleanly: name only its start, no endpoint.
      ['5/6 * * * *',
        'toutes les six minutes à partir de la minute 5 de chaque heure'],
      ['11/12 * * * *',
        'toutes les 12 minutes à partir de la minute 11 de chaque heure'],
      // A clean stride from the top of the cycle keeps the bare cadence.
      ['*/2 * * * *', 'toutes les deux minutes'],
      // Compounded: a stepped second over a stepped minute, each a cadence.
      ['3/2 1/2 * * * *',
        'toutes les deux secondes de la seconde 3 à 59 de chaque minute, ' +
        'toutes les deux minutes à partir de la minute 1 de chaque heure'],
      ['*/35 * * * *', 'aux minutes 0 et 35 de chaque heure'],
      // A bounded hour step pins both clock-time ends (24h).
      ['0 2/5 * * *',
        'toutes les cinq heures de 2 h à 22 h'],
      ['0 8-18/4 * * *',
        'toutes les quatre heures de 8 h à 16 h'],
      ['0 0/7 * * *',
        'toutes les sept heures de minuit à 21 h'],
      ['* */2 * * *', 'chaque minute, pendant les heures paires'],
      ['0 12 */2 * *', 'tous les deux jours du mois à midi'],
      ['0 12 5/3 * *', 'tous les trois jours du mois à partir du 5 à midi'],
      // Uniform steps that start off the top of the cycle keep the cadence form.
      ['17/20 * * * *', 'aux minutes 17, 37 et 57 de chaque heure'],
      ['0 8/12 * * *', 'à 8 h et 20 h'],
      ['0 2/3 * * *', 'toutes les trois heures à partir de 2 h'],
      // A uniform step segment beside a range, rendered as per-hour windows.
      ['* 2/4,18-20 * * *',
        'chaque minute de 2 h à 2 h 59, ' +
        'de 6 h à 6 h 59, de 10 h à 10 h 59, ' +
        'de 14 h à 14 h 59, de 18 h à 18 h 59 et de 22 h à 22 h 59 ' +
        'et de 18 h à 20 h 59']
    ]);
  });

  // A fixed hour under a stepped/listed minute names the HOUR, never a false
  // "à HH h 00" clock instant the minute never fires at: midnight and noon
  // read as the word ("à minuit"/"à midi"), any other hour as "de l'heure de
  // HH h". A minute that IS a single value keeps the real clock time ("à HH h MM").
  describe('heure fixe sous une minute en pas (lit l\'heure, pas HH h 00)',
    function() {
      run([
        ['3/2 0 * 1 5L',
          'toutes les deux minutes de la minute 3 à 59 de chaque heure, à minuit ' +
          'le dernier vendredi du mois de janvier'],
        ['3/2 12 * * *',
          'toutes les deux minutes de la minute 3 à 59 de chaque heure, à midi'],
        ['3/2 9 * * *',
          'toutes les deux minutes de la minute 3 à 59 de chaque heure, ' +
          'de l\'heure de 9 h'],
        // Several fixed hours each read as their own whole hour; an all
        // noon/midnight set keeps the word forms.
        ['3/2 9,12 * * *',
          'toutes les deux minutes de la minute 3 à 59 de chaque heure, ' +
          'de l\'heure de 9 h et de l\'heure de midi'],
        ['3/2 0,12 * * *',
          'toutes les deux minutes de la minute 3 à 59 de chaque heure, ' +
          'à minuit et à midi'],
        // A fixed hour beside an hour range: the range stays a whole-hour
        // window, the point its own whole hour — never a dropped range.
        ['3/2 9-11,15 * * *',
          'toutes les deux minutes de la minute 3 à 59 de chaque heure, ' +
          'de 9 h à 11 h et de l\'heure de 15 h'],
        // The guard: a single-value minute is a real clock time — keep HH h MM.
        ['5 9 * * *', 'tous les jours à 9 h 5']
      ]);
    });

  // A sub-minute second with the minute pinned to 0 and a specific hour: the
  // minute-0 is a real one-minute confinement (60 fires in :00, not 3,600
  // across the hour). A bare hour ("à 9 h") reads aloud as the whole hour, so
  // the confinement is stated outright with a duration frame ("pendant une
  // minute à 9 h") and the day qualifier trails (24-hour clock).
  describe('minute fixée à 0 sous une heure précise (24 heures)', function() {
    run([
      ['* 0 0 * * *',
        'chaque seconde pendant une minute à minuit, tous les jours'],
      ['* 0 9 * * *',
        'chaque seconde pendant une minute à 9 h, tous les jours'],
      ['* 0 12 * * *',
        'chaque seconde pendant une minute à midi, tous les jours'],
      ['* 0 9,11 * * *',
        'chaque seconde pendant une minute à 9 h et 11 h, tous les jours'],
      // An hour RANGE under a minute-0 confinement reads as a window, not a
      // wall of clock times.
      ['* 0 9-17 * * *',
        'chaque seconde pendant une minute, pendant les heures de 9 h ' +
        'à 17 h'],
      // An hour step under a minute-0 confinement reads as a cadence.
      ['* 0 */2 * * *',
        'chaque seconde pendant une minute, pendant les heures paires'],
      ['* 0 9 * * MON',
        'chaque seconde pendant une minute à 9 h, le lundi'],
      ['*/15 0 9 * * *',
        'toutes les 15 secondes pendant une minute à 9 h, tous les jours'],
      // One o'clock is just "1 h" (no article on the time).
      ['* 0 1 * * *',
        'chaque seconde pendant une minute à 1 h, tous les jours'],
      // A date-OR-weekday union drops the day trail here (the unified frame
      // supplies the day-level suffix), so the confinement leads the frame.
      ['* 0 9 1 * MON',
        'chaque seconde pendant une minute à 9 h, soit le 1er de chaque mois, ' +
        'soit n\'importe quel lundi']
    ]);
  });

  // A non-zero pinned minute is an unambiguous clock time: the genitive
  // "de 9 h 5" form reads as the minute, never the hour, so it generalizes
  // the confinement without the duration frame the minute-0 case needs.
  describe('minute fixée différente de 0 sous une heure précise (24 heures)',
    function() {
      run([
        ['* 5 0 * * *', 'chaque seconde de 0 h 5, tous les jours'],
        ['* 5 9 * * *', 'chaque seconde de 9 h 5, tous les jours'],
        // One o'clock is just "1 h 5".
        ['* 5 1 * * *', 'chaque seconde de 1 h 5, tous les jours'],
        ['* 5 9,11 * * *',
          'chaque seconde de 9 h 5 et 11 h 5, tous les jours'],
        ['* 5 9 * * MON', 'chaque seconde de 9 h 5, le lundi']
      ]);
    });

  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute reads as a cadence, not a cross-product of clock times: the
  // minute/second lead clause, then the hour cadence ("toutes les deux heures").
  // Irregular hour lists and ranges still enumerate.
  describe('pas horaire comme cadence au lieu d\'une liste d\'heures', function() {
    run([
      ['30 0 */2 * * *',
        'à la seconde 30 de chaque heure, toutes les deux heures'],
      ['5 0 */2 * * *',
        'à la seconde 5 de chaque heure, toutes les deux heures'],
      ['30 */2 * * *',
        'à la minute 30, toutes les deux heures'],
      // An arithmetic-progression hour list compacts the same way.
      ['30 0 0,4,8,12,16,20 * * *',
        'à la seconde 30 de chaque heure, toutes les quatre heures'],
      // An offset stride that still tiles names only its start; a bounded one
      // pins both clock-time endpoints.
      ['30 0 1/2 * * *',
        'à la seconde 30 de chaque heure, toutes les deux heures à partir de 1 h'],
      ['30 0 5,9,13,17,21 * * *',
        'à la seconde 30 de chaque heure, toutes les quatre heures de 5 h ' +
        'à 21 h'],
      ['* 0 1/2 * * *',
        'chaque seconde pendant une minute, pendant les heures impaires'],
      ['* 0 */3 * * *',
        'chaque seconde pendant une minute, pendant les heures de 0 h, 3 h, ' +
        '6 h, 9 h, 12 h, 15 h, 18 h et 21 h'],
      // A non-zero pinned minute under an hour step: the second leads, then the
      // minute, then the hour cadence.
      ['30 5 */2 * * *',
        'à la seconde 30 de chaque minute, à la minute 5, toutes les deux heures'],
      ['* 5 */2 * * *', 'chaque seconde, à la minute 5, toutes les deux heures'],
      // An hour RANGE reads as a window. Guard: an irregular hour list
      // (no range) has no window to form and still enumerates.
      ['30 0 9,17 * * *', 'tous les jours à 9 h 30 s et 17 h 30 s'],
      ['30 0 9-17 * * *',
        'à la seconde 30 de chaque heure, de 9 h à 17 h'],
      // A clean hour step with a plain :00 stays the bare hour cadence.
      ['0 0 */2 * * *', 'toutes les deux heures']
    ]);
  });

  // A single second under a multi-valued minute and a bounded hour step: the
  // compact clock-time rest owns the second lead, so the composer must not
  // prepend it again.
  describe('seconde sous pas de minute et pas horaire borné', function() {
    run([
      ['30 */25 9-17/2 * * *',
        'à la seconde 30 de chaque minute, ' +
        'aux minutes 0, 25 et 50, ' +
        'toutes les deux heures de 9 h à 17 h']
    ]);
  });

  // A wildcard or stepped second under a MINUTE LIST across specific hours is a
  // wall of distinct clock times, not a one-minute confinement: each minute is
  // named ("9 h 25"), never collapsed to the bare hour.
  describe('seconde sous-minute sous une liste de minutes à des heures précises',
    function() {
      run([
        ['* */25 9,17 * * *',
          'chaque seconde de 9 h, 9 h 25, 9 h 50, ' +
          '17 h, 17 h 25 et 17 h 50, tous les jours'],
        ['*/15 */25 9,17 * * *',
          'toutes les 15 secondes de 9 h, 9 h 25, 9 h 50, ' +
          '17 h, 17 h 25 et 17 h 50, tous les jours']
      ]);
    });

  // An hour RANGE (or a list whose segments include a range) under minute 0
  // and a meaningful second reads as the hour-range window ("de 9 h à 17 h").
  // A pure single-value hour list (9,17) has no range to span and still
  // enumerates.
  describe('intervalle horaire comme fenêtre au lieu d\'une liste d\'heures', function() {
    run([
      ['30 0 9-17 * * *',
        'à la seconde 30 de chaque heure, de 9 h à 17 h'],
      ['5,30 0 9-17 * * *',
        'aux secondes 5 et 30 de chaque heure, de 9 h à 17 h'],
      ['0-10 0 9-17 * * *',
        'chaque seconde de 0 à 10 de chaque heure, de 9 h à 17 h'],
      // A wildcard or sub-minute step second is the one-minute window confined
      // to the hour range ("pendant les heures …").
      ['* 0 9-17 * * *',
        'chaque seconde pendant une minute, pendant les heures de 9 h ' +
        'à 17 h'],
      ['*/15 0 9-17 * * *',
        'toutes les 15 secondes pendant une minute, pendant les heures de 9 h ' +
        'à 17 h'],
      // A range inside a list: the contiguous span is a window, the
      // non-contiguous hour joins with "et aussi".
      ['30 0 9-20,22 * * *',
        'à la seconde 30 de chaque heure, de 9 h à 20 h ' +
        'et aussi à 22 h'],
      ['* 0 9-20,22 * * *',
        'chaque seconde pendant une minute, pendant les heures de 9 h ' +
        'à 20 h et aussi à 22 h'],
      // The window carries the trailing day qualifier.
      ['30 0 9-17 * * MON',
        'à la seconde 30 de chaque heure, de 9 h à 17 h le lundi'],
      // Guard: a pure single-value hour list (no range) still enumerates.
      ['30 0 9,17 * * *', 'tous les jours à 9 h 30 s et 17 h 30 s']
    ]);
  });

  describe('secondes indépendantes et composées', function() {
    run([
      ['0-30 * * * * *', 'chaque seconde de 0 à 30 de chaque minute'],
      ['5,10 * * * * *', 'aux secondes 5 et 10 de chaque minute'],
      ['*/15 30 * * * *',
        'toutes les 15 secondes, à la minute 30 de chaque heure'],
      ['* 30 9 * * *',
        'chaque seconde de 9 h 30, tous les jours'],
      // Minute 0 under a sub-minute second must be stated, not absorbed into
      // an hourly idiom that silently drops the :00.
      ['* 0 * * * *', 'chaque seconde, à la minute 0 de chaque heure'],
      // An hour RANGE under the minute-0 confinement reads as a window
      // ("pendant les heures …").
      ['* 0 9-17 * * *',
        'chaque seconde pendant une minute, pendant les heures de 9 h ' +
        'à 17 h'],
      // A wildcard minute under a restricted hour: the hour window must
      // survive (it once collapsed to a bare "chaque seconde").
      ['* * 9 * * *',
        'chaque seconde, chaque minute de l\'heure de 9 h'],
      ['*/15 * 9-17 * * *',
        'toutes les 15 secondes, chaque minute de 9 h ' +
        'à 17 h 59'],
      ['0-30 * 9 * * *',
        'chaque seconde de 0 à 30 de chaque minute, ' +
        'chaque minute de l\'heure de 9 h']
    ]);
  });

  describe('formes compactes et listes mixtes', function() {
    run([
      ['30 9-20,22 * * *',
        'chaque heure de 9 h 30 à 20 h 30 ' +
        'et aussi à 22 h 30'],
      ['0,30 8-18/2 * * *',
        'aux minutes 0 et 30, ' +
        'toutes les deux heures de 8 h à 18 h'],
      ['*/15 9-20,22 * * *',
        'toutes les 15 minutes de 9 h à 20 h 59 ' +
        'et de 22 h à 22 h 59'],
      ['0-10,30 9 * * *',
        'aux minutes 0 à 10 et 30 de chaque heure, à 9 h'],
      ['0 0 * * 1-5,0',
        'du lundi au vendredi et le dimanche à minuit'],
      ['50-10 * * * *', 'chaque minute de 50 à 10 de chaque heure']
    ]);
  });

  describe('autres jetons Quartz et années', function() {
    run([
      ['0 0 LW * *', 'le dernier jour ouvrable du mois à minuit'],
      ['0 0 L-5 * *',
        '5 jours avant le dernier jour du mois à minuit'],
      ['0 0 L-1 * *',
        'un jour avant le dernier jour du mois à minuit'],
      ['*/15 * * * 5L', 'toutes les 15 minutes le dernier vendredi du mois'],
      ['0 0 9 * * * 2030,2031',
        'tous les jours à 9 h en 2030 et 2031'],
      ['0 0 9 * * * 2030-2035',
        'tous les jours à 9 h en 2030-2035'],
      ['0 0 12 1 1 * */2', 'le 1er janvier à midi tous les deux ans'],
      ['0 0 12 1 1 * */1', 'le 1er janvier à midi chaque année'],
      ['0 0 12 1 1 * 2030/2',
        'le 1er janvier à midi tous les deux ans à partir de 2030']
    ]);
  });

  describe('couverture des branches', function() {
    run([
      ['15 0,30 * * * *',
        'à la seconde 15 des minutes 0 et 30 de chaque heure'],
      // A stride of two over the whole day reads as the even/odd hours; any
      // other step names its active hours, which pins the schedule precisely.
      ['*/15 */2 * * *', 'toutes les 15 minutes, pendant les heures paires'],
      ['*/15 1/2 * * *', 'toutes les 15 minutes, pendant les heures impaires'],
      // An odd stride over the day: 24h-only, so the active hours are named
      // outright (no day-period grouping — fr has none).
      ['*/15 */3 * * *',
        'toutes les 15 minutes, pendant les heures de 0 h, 3 h, 6 h, ' +
        '9 h, 12 h, 15 h, 18 h et 21 h'],
      ['*/15 1/3 * * *',
        'toutes les 15 minutes, pendant les heures de 1 h, 4 h, 7 h, 10 h, 13 h, ' +
        '16 h, 19 h et 22 h'],
      ['*/20 9-17/2 * * *',
        'toutes les 20 minutes, ' +
        'toutes les deux heures de 9 h à 17 h'],
      ['* 9-17 * * *',
        'chaque minute de 9 h à 17 h 59'],
      ['* 0-5 * * *',
        'chaque minute de minuit à 5 h 59'],
      ['0-30 9-17 * * *',
        'chaque minute de 0 à 30, de 9 h à 17 h'],
      ['0 */9 * * *',
        'toutes les neuf heures de minuit à 18 h'],
      ['0-30 9-20,22 * * *',
        'chaque minute de 0 à 30, de 9 h à 20 h et aussi à 22 h'],
      ['* 1,6/3 * * *',
        'chaque minute de 1 h à 1 h 59, ' +
        'de 6 h à 6 h 59, de 9 h à 9 h 59, ' +
        'de 12 h à 12 h 59, de 15 h à 15 h 59, de 18 h à 18 h 59 et de 21 h ' +
        'à 21 h 59'],
      ['*/15 9-17 * * *', 'toutes les 15 minutes de 9 h à 17 h 45'],
      ['*/15 * 13 * 5',
        'toutes les 15 minutes, soit le 13 de chaque mois, soit n\'importe quel vendredi'],
      ['*/15 * * 6 *', 'toutes les 15 minutes en juin'],
      ['0 12 * * 0,1/2',
        'le lundi, le mercredi, le vendredi et le dimanche à midi'],
      ['0 12 * 1,6/3 *',
        'tous les jours de janvier, juin, septembre et décembre ' +
        'à midi'],
      ['0,30/15 * * * *', 'aux minutes 0, 30 et 45 de chaque heure'],
      ['5,30-40/5 * * * *',
        'aux minutes 5, 30, 35 et 40 de chaque heure'],
      ['*/5 * * * *', 'toutes les 5 minutes', {short: true}],
      ['0 12 * * 7', 'le dimanche à midi'],
      ['5 9 * * *', 'tous les jours à 9 h 5'],
      // Restricted-month OR union with a range weekday: the unified "soit" frame
      // with month fronted once and month-less arms. The weekday range arm reads
      // "n'importe quel jour du lundi au vendredi" (a RANGE arm keeps a nominal
      // head, unlike the single-weekday arms) so the union joins two parallel
      // day predicates.
      ['0 12 1 6-9 MON-FRI',
        'de juin à septembre à midi, soit le 1er, soit n\'importe quel jour du lundi au vendredi'],
      // Wildcard-month OR union with a range weekday.
      ['0 0 1 * 1-5',
        'à minuit, soit le 1er de chaque mois, soit n\'importe quel jour du lundi au vendredi'],
      // Single restricted month + weekday (no date): exercises monthScope
      // with a non-ranged month.
      ['0 9 * 6 MON', 'le lundi de juin à 9 h']
    ]);
  });

  // Coverage of reachable renderer branches the rows above do not yet reach.
  // Each form is the faithful fr translation of the es donor's output for the
  // same pattern (the es corpus exercises these branches; fr inherits the
  // structure, so the same patterns must reach them here). Not separate
  // conventions — the same fr-FR rules applied to less-common shapes.
  describe('couverture des branches du moteur', function() {
    run([
      // A single hour with a minute RANGE is a one-hour window (minuteSpanInHour
      // with a real range, not the whole-hour wildcard form).
      ['0-30 9 * * *', 'chaque minute de 9 h à 9 h 30'],
      // A wildcard minute over an odd hour step names the active hours; the
      // single-step confinement branch of the across-hours wildcard form.
      ['* */3 * * *',
        'chaque minute, pendant les heures de 0 h, 3 h, 6 h, 9 h, 12 h, ' +
        '15 h, 18 h et 21 h'],
      // OR union, open-step date that is NOT a parity (step 3): the durative
      // "tous les trois jours du mois à partir du 5" arm.
      ['0 0 5/3 * 5',
        'à minuit, soit tous les trois jours du mois à partir du 5, ' +
        'soit n\'importe quel vendredi'],
      // OR union, multi-value date list arm ("le 1er, le 15 et le 20 du mois").
      ['0 0 1,15,20 * 5',
        'à minuit, soit le 1er, le 15 et le 20 du mois, ' +
        'soit n\'importe quel vendredi'],
      // A date list mixing a single and a range carries the per-value ordinal
      // and the "du A au B" contraction within the list.
      ['0 0 1,10-15 * *',
        'le 1er et du 10 au 15 de chaque mois à minuit'],
      // A minute list over a fixed hour list folds the minutes into each clock
      // time (compact-clock non-fold path).
      ['0,30 8,12,16 * * *',
        'tous les jours à 8 h, 8 h 30, 12 h, 12 h 30, 16 h et 16 h 30'],
      // A stepped minute over an hour step names each fixed hour as its whole
      // hour ("de l'heure de 8 h …"), noon as "de l'heure de midi".
      ['3/2 8/4 * * *',
        'toutes les deux minutes de la minute 3 à 59 de chaque heure, ' +
        'de l\'heure de 8 h, de l\'heure de midi, de l\'heure de 16 h ' +
        'et de l\'heure de 20 h'],
      // A wildcard minute over a 4+-hour list reads the compact active-hours
      // list, not a sprawl of per-hour windows.
      ['* 0,4,8,12 * * *',
        'chaque minute pendant les heures de 0 h, 4 h, 8 h et 12 h'],
      // A sub-minute second at minute 0 over a BOUNDED hour step: the duration
      // frame with the endpoint-pinning bounded cadence (not the clean-stride
      // "pendant les heures" confinement).
      ['* 0 0-20/2 * * *',
        'chaque seconde pendant une minute, ' +
        'toutes les deux heures de minuit à 20 h'],
      // An offset hour step with a folded second enumerates its fires as clock
      // times carrying the seconds ("8 h 30 s …").
      ['30 0 8/4 * * *',
        'tous les jours à 8 h 30 s, 12 h 30 s, 16 h 30 s et 20 h 30 s'],
      // A step SEGMENT beside a range in the hour field (the step survives, not
      // enumerated to singles): under a minute list each step fire reads as its
      // whole hour and the range stays a window (compact-clock non-fold path).
      ['5,30 2/4,18-20 * * *',
        'aux minutes 5 et 30 de chaque heure, de l\'heure de 2 h, ' +
        'de l\'heure de 6 h, de l\'heure de 10 h, de l\'heure de 14 h, ' +
        'de l\'heure de 18 h, de l\'heure de 22 h et de 18 h à 20 h'],
      // The same hour shape under minute 0: each step fire is a clock time and
      // the range a window (hour-segment clock times, fold path).
      ['0 0 2/4,18-20 * * *',
        'chaque heure à 2 h, à 6 h, à 10 h, à 14 h, à 18 h, à 22 h ' +
        'et de 18 h à 20 h']
    ]);
  });

  describe('style personnalisé', function() {
    run([
      // A custom separator replaces the spaced "h" with the chosen mark.
      ['30 17 * * *', 'tous les jours à 17:30', {dialect: {sep: ':'}}],
      // An unspaced "h" register is opt-in via a custom style (the spaced "h"
      // is the default fr-FR norm — notes.md; the unspaced "9h30" is casual).
      ['30 14 * * *', 'tous les jours à 14h30', {dialect: {unspaced: true}}]
    ]);
  });

  // A simple range spanning the whole field imposes no restriction, so it
  // reads the same as `*`.
  describe('un intervalle sur tout le champ se lit comme le joker', function() {
    run([
      ['0-59 * * * *', 'chaque minute'],
      ['0 0-23 * * *', 'chaque heure'],
      ['0 0 1-31 * *', 'tous les jours à minuit'],
      ['0 0 * 1-12 *', 'tous les jours à minuit'],
      ['0 0 * * 0-6', 'tous les jours à minuit'],
      ['0 0 * * 1-7', 'tous les jours à minuit'],
      ['0 0 * * SUN-SAT', 'tous les jours à minuit']
    ]);
  });

  describe('cas particuliers', function() {
    it('décrit @reboot', function() {
      expect(cronli5('@reboot', {lang: fr}))
        .to.equal('au démarrage du système');
    });

    it('utilise le texte de repli en mode lenient', function() {
      expect(cronli5('ce n\'est pas du cron', {lang: fr, lenient: true}))
        .to.equal('un motif cron non reconnu');
    });
  });

  // A bounded or uneven hour stride reads as its endpoint-pinning cadence
  // across the minute paths; an offset-clean bounded step keeps its fires, and
  // a single-fire bounded step is just that value.
  describe('cadence horaire par les pas de minute', function() {
    run([
      ['0 0,8,16 * * *', 'tous les jours à minuit, 8 h et 16 h'],
      ['* */5 * * *', 'chaque minute, toutes les cinq heures de minuit à 20 h'],
      ['*/25 */5 * * *',
        'aux minutes 0, 25 et 50, ' +
        'toutes les cinq heures de minuit à 20 h'],
      ['0-30 */5 * * *',
        'chaque minute de 0 à 30, toutes les cinq heures de minuit à 20 h'],
      ['* 9-17/2 * * *', 'chaque minute, toutes les deux heures de 9 h à 17 h'],
      ['0-30 9-17/2 * * *',
        'chaque minute de 0 à 30, toutes les deux heures de 9 h à 17 h'],
      ['5,10 9-17/2 * * *',
        'aux minutes 5 et 10, ' +
        'toutes les deux heures de 9 h à 17 h'],
      ['0 1-23/2 * * *',
        'à 1 h, 3 h, 5 h, 7 h, 9 h, 11 h, 13 h, 15 h, ' +
        '17 h, 19 h, 21 h et 23 h'],
      ['0 9-10/5 * * *', 'à 9 h'],
      // A bounded step from midnight that stops short of the day's last tile
      // (0-20/2 fires 0,2,…,20, never 22) pins both endpoints, like 9-17/2 —
      // it must not read as the all-day "toutes les deux heures".
      ['23 0-20/2 * * *', 'à la minute 23, toutes les deux heures de minuit à 20 h'],
      ['30 0-20/3 * * *',
        'à la minute 30, toutes les trois heures de minuit à 18 h'],
      // Guards: an open `*/n` and a full-field-equivalent step (0-22/2 ≡ `*/2`)
      // are the all-day set and stay bare.
      ['23 */2 * * *', 'à la minute 23, toutes les deux heures'],
      ['23 0-22/2 * * *', 'à la minute 23, toutes les deux heures']
    ]);
  });

  // Additional coverage: hour lists and ranges with second / minute cadences.
  describe('couverture supplémentaire (listes/intervalles d\'heures)', function() {
    run([
      ['0 0 9,17 * * *', 'tous les jours à 9 h et 17 h'],
      ['0 9,12,17 * * *', 'tous les jours à 9 h, 12 h et 17 h'],
      ['*/15 0,12 * * *',
        'toutes les 15 minutes de 0 h à 0 h 59 et de 12 h à 12 h 59'],
      ['15 0 9-17 * * *',
        'à la seconde 15 de chaque heure, de 9 h à 17 h'],
      ['30 0 9-17/2 * * *',
        'à la seconde 30 de chaque heure, ' +
        'toutes les deux heures de 9 h à 17 h'],
      // An offset hour step enumerates its fires as clock times.
      ['0 0 8/4 * * *', 'tous les jours à 8 h, 12 h, 16 h et 20 h'],
      ['0 30 0,8,16 * * *', 'tous les jours à 0 h 30, 8 h 30 et 16 h 30']
    ]);
  });
});
