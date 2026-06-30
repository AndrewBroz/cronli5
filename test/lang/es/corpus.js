import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import es from '../../../src/lang/es/index.js';

const {expect} = chai;

// The Spanish corpus: the reviewed expectation suite that makes the module
// trustworthy (docs/i18n-design.md §2.4). Each entry is exact output.
//
// Spanish defaults to the 24-hour clock (RAE). Blocks whose expectations
// exercise the 12-hour day-period forms pass `{ampm: true}` as the shared
// option; a per-entry option object still overrides it.

function run(cases, shared) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...shared || {}, ...values[2] || {}, lang: es};

    describe(JSON.stringify(pattern), function() {
      it('se lee "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

// 12-hour day-period blocks pass this shared option.
const ampm = {ampm: true};

describe('Español (es):', function() {
  describe('frecuencias básicas', function() {
    run([
      ['* * * * *', 'cada minuto'],
      ['*/5 * * * *', 'cada cinco minutos'],
      ['*/15 * * * *', 'cada 15 minutos'],
      ['0 * * * *', 'cada hora'],
      ['0 */6 * * *', 'cada seis horas'],
      ['* * * * * *', 'cada segundo'],
      ['*/30 * * * * *', 'cada 30 segundos']
    ]);
  });

  describe('horas del día (reloj de 24 horas, por defecto)', function() {
    run([
      ['0 9 * * *', 'todos los días a las 09:00'],
      ['30 9 * * *', 'todos los días a las 09:30'],
      ['30 17 * * *', 'todos los días a las 17:30'],
      ['0 0 * * *', 'todos los días a las 00:00'],
      ['0 12 * * *', 'todos los días a las 12:00'],
      ['0 1 * * *', 'todos los días a la 01:00'],
      ['0 13 * * *', 'todos los días a las 13:00'],
      ['0 9,17 * * *', 'todos los días a las 09:00 y 17:00'],
      // Mixed article: 1-o'clock (a la) followed by other hours (a las).
      // la-group first, then las-group; comma connector when las has exactly 2.
      ['0 1,13 * * *', 'todos los días a la 01:00 y a las 13:00'],
      // An irregular five-value list (not an arithmetic progression, so it
      // stays an enumeration) exercises the la/las grouping at length five.
      ['0 1,6,11,16,22 * * *',
        'todos los días a la 01:00 y a las 06:00, 11:00, 16:00 y 22:00'],
      ['0 1,2,3 * * *', 'todos los días a la 01:00, a las 02:00 y 03:00'],
      ['30 1,5,13 * * *', 'todos los días a la 01:30, a las 05:30 y 13:30'],
      ['0 22-2,12 * * *',
        'todos los días a la 01:00 y a las 12:00, 22:00, 23:00, 00:00 y 02:00'],
      ['0 22-2 * * *', 'cada hora de las 22:00 a las 02:00'],
      ['0 9-20,22 * * *',
        'cada hora de las 09:00 a las 20:00 y también a las 22:00'],
      // A single hour with a wildcard minute is the whole hour: it reads as
      // that hour ("la hora de las 09:00"), not a synthesized "de las HH:00 a
      // las HH:59" range the source never stated.
      ['* 9 * * *', 'cada minuto de la hora de las 09:00'],
      ['* 0 * * *', 'cada minuto de la hora de las 00:00'],
      ['* 12 * * *', 'cada minuto de la hora de las 12:00'],
      ['* 1 * * *', 'cada minuto de la hora de la 01:00']
    ]);
  });

  describe('horas del día (reloj de 12 horas)', function() {
    run([
      ['0 12 * * *', 'todos los días al mediodía'],
      ['0 0 * * *', 'todos los días a medianoche'],
      ['0 9 * * *', 'todos los días a las 9 de la mañana'],
      ['30 9 * * *', 'todos los días a las 9:30 de la mañana'],
      ['0 13 * * *', 'todos los días a la 1 de la tarde'],
      ['0 1 * * *', 'todos los días a la 1 de la madrugada'],
      ['0 22 * * *', 'todos los días a las 10 de la noche'],
      // Two periods, one value each: article repeated per period (no factoring
      // across periods), chronological order preserved.
      ['0 9,17 * * *',
        'todos los días a las 9 de la mañana y a las 5 de la tarde'],
      // Three periods, one value each: article repeated per period.
      ['0 1,9,13 * * *',
        'todos los días a la 1 de la madrugada, a las 9 de la mañana y ' +
        'a la 1 de la tarde'],
      // Elision: two CONSECUTIVE single-value clauses sharing a value factor
      // the value, naming each period once.
      ['0 1,13 * * *',
        'todos los días a la 1 de la madrugada y de la tarde'],
      ['0 2,14 * * *',
        'todos los días a las 2 de la madrugada y de la tarde'],
      ['30 1,13 * * *',
        'todos los días a la 1:30 de la madrugada y de la tarde'],
      // A multi-value period clause (internal 'y') followed by nothing here;
      // the madrugada single then a 2-value tarde run. RAE coma ante 'y'
      // before the clause carrying an internal 'y'.
      ['0 2,14,18 * * *',
        'todos los días a las 2 de la madrugada, y a las 2 y 6 de la tarde'],
      // Two multi-value period clauses: each names its period once, article
      // shared within the run; coma ante 'y' before the second (internal 'y').
      ['0 2,3,15,18 * * *',
        'todos los días a las 2 y 3 de la madrugada, y a las 3 y 6 de la tarde'],
      // No consecutive same-value clauses: article repeated per period.
      ['0 3,9,15 * * *',
        'todos los días a las 3 de la madrugada, a las 9 de la mañana y ' +
        'a las 3 de la tarde'],
      // One period (madrugada), two values, shared article: value elision is
      // for the SINGLE-value case only; multi-value runs name the period once
      // and keep both values.
      ['0,30 1 * * *',
        'todos los días a la 1 y 1:30 de la madrugada'],
      // Three single-value clauses across three periods, no elision.
      ['0 9,15,21 * * *',
        'todos los días a las 9 de la mañana, a las 3 de la tarde y ' +
        'a las 9 de la noche'],
      // Elision pair across mañana/noche.
      ['0 11,23 * * *',
        'todos los días a las 11 de la mañana y de la noche'],
      // Mixed article WITHIN one period (1 → 'a la', 2 → 'a las'): the period
      // is named once, the article repeats per value.
      ['0 13,14 * * *',
        'todos los días a la 1 y a las 2 de la tarde'],
      ['0 1,2 * * *',
        'todos los días a la 1 y a las 2 de la madrugada'],
      // Mediodía is its own clause; the following multi-value tarde run carries
      // an internal 'y', so the join uses the RAE coma ante 'y'.
      ['0 12,13,14 * * *',
        'todos los días al mediodía, y a la 1 y a las 2 de la tarde']
    ], ampm);
  });

  describe('días de la semana', function() {
    run([
      ['0 9 * * MON', 'los lunes a las 9 de la mañana'],
      ['30 9 * * MON-FRI', 'de lunes a viernes a las 9:30 de la mañana'],
      ['0 14 * * 1,3,5',
        'los lunes, miércoles y viernes a las 2 de la tarde'],
      ['*/15 * * * MON', 'cada 15 minutos los lunes'],
      ['*/15 * * * MON-FRI', 'cada 15 minutos de lunes a viernes'],
      ['0 0 * * FRI-MON', 'de viernes a lunes a medianoche']
    ], ampm);
  });

  describe('fechas y meses', function() {
    run([
      ['0 12 1 1 *', 'el 1 de enero al mediodía'],
      ['0 0 13 * *', 'el 13 de cada mes a medianoche'],
      ['0 * 13 * *', 'cada hora el 13 de cada mes'],
      ['0 0 1,15 * *', 'los días 1 y 15 de cada mes a medianoche'],
      ['0 0 1-15 * *', 'del 1 al 15 de cada mes a medianoche'],
      ['0 0 1-15/3 * *',
        'los días 1, 4, 7, 10 y 13 de cada mes a medianoche'],
      ['0 0 1,20-28/4 * *',
        'los días 1, 20, 24 y 28 de cada mes a medianoche'],
      ['0 0 1-15/3 6 *', 'los días 1, 4, 7, 10 y 13 de junio a medianoche'],
      ['0 12 * 6,12 *',
        'todos los días de junio y diciembre al mediodía'],
      ['0 12 * 11-2 *',
        'todos los días de noviembre a febrero al mediodía'],
      ['0 12 * 1,3-6 *',
        'todos los días de enero y de marzo a junio al mediodía'],
      ['0 0 1 6-9 *',
        'el 1 de cada mes, de junio a septiembre a medianoche'],
      ['0 0 1,15 6-9 *',
        'los días 1 y 15 de cada mes, de junio a septiembre a medianoche'],
      ['0 0 1-15 6-9 *',
        'del 1 al 15 de cada mes, de junio a septiembre a medianoche'],
      ['0 0 1 12-1 *',
        'el 1 de cada mes, de diciembre a enero a medianoche'],
      ['0 0 1 1,3-6 *',
        'el 1 de cada mes, de enero y de marzo a junio a medianoche'],
      ['0 0 1 1-11/3 *',
        'el 1 de enero, abril, julio y octubre a medianoche'],
      ['0 0 1 6-9 FRI',
        'de junio a septiembre a medianoche, ya sea el día 1 o cualquier viernes'],
      ['0 0 L 6-9 *',
        'el último día del mes, de junio a septiembre a medianoche'],
      ['0 0 */2 6-9 *',
        'cada dos días del mes, de junio a septiembre a medianoche'],
      ['0 12 * 6-9 MON',
        'los lunes, de junio a septiembre al mediodía']
    ], ampm);
  });

  describe('minutos y segundos anclados', function() {
    run([
      ['30 * * * *', 'en el minuto 30 de cada hora'],
      ['0,30 * * * *', 'en los minutos 0 y 30 de cada hora'],
      ['0-29 * * * *', 'cada minuto del 0 al 29 de cada hora'],
      ['15 * * * * *', 'en el segundo 15 de cada minuto'],
      ['15 30 * * * *', 'en el minuto 30 y el segundo 15 de cada hora'],
      ['1 1 * * * *', 'en el minuto 1 y el segundo 1 de cada hora'],
      // Seconds list + fixed clock time: nest seconds into the time with
      // genitive "de las HH:MM"; never "de cada minuto" when the minute is fixed.
      ['5,10 30 9 * * MON', 'los lunes, en los segundos 5 y 10 de las 09:30'],
      // A date-OR-weekday union drops the day frame here; the unified frame
      // supplies the day-level suffix, so the seconds clause leads it.
      ['5,10 0 9 1 * MON',
        'en los segundos 5 y 10 de las 09:00, ya sea el 1 de cada mes ' +
        'o cualquier lunes'],
      // Guard: wildcard minute keeps "de cada minuto".
      // (5,10 * * * * * is already covered in segundos independientes y compuestos)
      // Second-step + fixed minute + hour range + weekday: anchor cadence to the minute.
      ['*/15 30 9-17 * * MON-FRI',
        'de lunes a viernes, de las 09:00 a las 17:00, cada 15 segundos del minuto 30'],
      // Minute window confined to specific hours.
      ['0-30 9,17-19 * * *',
        'cada minuto del 0 al 30, a las 09:00, 17:00, 18:00 y 19:00'],
      // Seconds list + multi-time clock list: seconds must nest into ALL clock
      // times, not just the first. Fuzzer-found (dropped times bug).
      ['5,30 0 9,17 1 * *',
        'el 1 de cada mes, en los segundos 5 y 30 de las 09:00 y 17:00'],
      ['5,30 5,10,30 0 1 * *',
        'el 1 de cada mes, en los segundos 5 y 30 de las 00:05, 00:10 y 00:30']
    ]);
  });

  describe('patrones compuestos', function() {
    run([
      ['*/15 9-17 * * *',
        'cada 15 minutos de las 9 de la mañana a las 5:45 de la tarde'],
      ['* 9 * * *', 'cada minuto de la hora de las 9 de la mañana'],
      ['0 9-17 * * *',
        'cada hora de las 9 de la mañana a las 5 de la tarde'],
      ['30 9-17 * * *',
        'en el minuto 30 de cada hora, ' +
        'de las 9 de la mañana a las 5 de la tarde'],
      ['5 9-17 * * *',
        'en el minuto 5 de cada hora, ' +
        'de las 9 de la mañana a las 5 de la tarde'],
      ['5 9-17 * 1 *',
        'en el minuto 5 de cada hora, ' +
        'de las 9 de la mañana a las 5 de la tarde en enero'],
      ['0 22-2 * * *',
        'cada hora de las 10 de la noche a las 2 de la madrugada'],
      ['*/15 9,17 * * *',
        'cada 15 minutos de las 9 a las 9:59 de la mañana ' +
        'y de las 5 a las 5:59 de la tarde'],
      ['* 9,17 * * *',
        'cada minuto de las 9 a las 9:59 de la mañana ' +
        'y de las 5 a las 5:59 de la tarde'],
      ['0-30 9,17 * * *',
        'cada minuto del 0 al 30, a las 9 de la mañana y 5 de la tarde'],
      ['0-30 */2 * * *',
        'cada minuto del 0 al 30, cada dos horas'],
      // A minute list under a clean stride keeps the same cadence the range
      // and wildcard forms do, never enumerating the hours. Under an hour STEP
      // the minute clause drops "de cada hora": the step is the sole hour
      // authority, so the cadence binds to it (as in de/fi). "de cada hora"
      // alongside "cada dos horas" would be a conflicting every-hour scope.
      ['5,30 */2 * * *',
        'en los minutos 5 y 30, cada dos horas'],
      ['5,30 1/2 * * *',
        'en los minutos 5 y 30, ' +
        'cada dos horas a partir de la 1 de la madrugada']
    ], ampm);
  });

  // A minute CADENCE under an hour STEP must not assert a generic every-hour
  // scope ("de cada hora"): the hour step is the sole hour authority. An hour
  // WINDOW (9-17) and the hour=* case keep "de cada hora" — the window names
  // the hours, so "de cada hora ... de las 09:00 a las 17:00" recovers the
  // window with no conflict.
  describe('la cadencia de minutos se ata al paso horario, sin alcance ' +
    'genérico', function() {
    run([
      ['2/7 0/4 * * *',
        'cada siete minutos del minuto 2 al 58, cada cuatro horas'],
      ['5/10 0/4 * * *',
        'cada diez minutos a partir del minuto 5, ' +
        'durante las horas de las 0, 4, 8, 12, 16 y 20'],
      ['3/2 1/2 * * *',
        'cada dos minutos del minuto 3 al 59, ' +
        'cada dos horas a partir de la 01:00'],
      // A bounded hour step is the sole hour authority, so a minute cadence or
      // list drops its generic "de cada hora" (the every-hour scope conflicts
      // with the step).
      ['3/2 9-17/2 * * *',
        'cada dos minutos del minuto 3 al 59, ' +
        'cada dos horas de las 09:00 a las 17:00'],
      ['2/7 9-17/2 * * *',
        'cada siete minutos del minuto 2 al 58, ' +
        'cada dos horas de las 09:00 a las 17:00'],
      ['5,30 9-17/2 * * *',
        'en los minutos 5 y 30, ' +
        'cada dos horas de las 09:00 a las 17:00'],
      // Hour WINDOW keeps "de cada hora".
      ['2/7 9-17 * * *',
        'cada siete minutos del minuto 2 al 58 de cada hora, ' +
        'de las 09:00 a las 17:00'],
      ['5/10 1-6 * * *',
        'cada diez minutos a partir del minuto 5 de cada hora ' +
        'de la 01:00 a las 06:55'],
      // hour=* keeps "de cada hora" (the only hour statement).
      ['2/7 * * * *',
        'cada siete minutos del minuto 2 al 58 de cada hora']
    ], {ampm: false});
  });

  describe('segundos compuestos', function() {
    run([
      ['*/15 30 9 * * *',
        'cada 15 segundos de las 9:30 de la mañana, todos los días'],
      ['15 30 9 * * *', 'todos los días a las 9:30:15 de la mañana']
    ], ampm);

    // A fixed hour under a stepped minute (six-field, seconds wildcard) names
    // the hour — "al mediodía" — not a false "a las 12:00" the minute never
    // fires at.
    run([
      ['* 3/2 12 1-5 * *',
        'cada segundo, cada dos minutos del minuto 3 al 59 de cada hora, ' +
        'al mediodía del 1 al 5 de cada mes']
    ]);
  });

  // A stepped minute under a wildcard second and wildcard hour confines the
  // second cadence to the ORDINAL minute cadence ("cada segundo en cada sexto
  // minuto …"), never the comma juxtaposition that reads as two independent
  // cadences. The offset-clean stride names only its start; the uneven one pins
  // both endpoints ("del minuto 2 al 58"), mirroring the standalone cadence.
  describe('segundo bajo un minuto escalonado (confinamiento)', function() {
    run([
      ['* 4/6 * * * *',
        'cada segundo en cada sexto minuto a partir del minuto 4 de cada hora'],
      ['* 2/7 * * * *',
        'cada segundo en cada séptimo minuto del minuto 2 al 58 de cada hora'],
      ['* */6 * * * *', 'cada segundo en cada sexto minuto de cada hora'],
      ['*/15 4/6 * * * *',
        'cada 15 segundos en cada sexto minuto a partir del minuto 4 ' +
        'de cada hora']
    ]);
  });

  // A second LIST, RANGE, or SINGLE under a minute restriction CONFINES that
  // restriction with the genitive "de", never the comma juxtaposition that
  // reads as two independent schedules ("en los segundos 5, 10 y 15 de cada
  // minuto, cada seis minutos…"). The seconds clause leads, anchored to the
  // CONFINED minute ("de cada sexto minuto…", "de los minutos 0, 15 y 30…")
  // rather than the generic "de cada minuto"; the stepped minute keeps the
  // ordinal cadence form c0d0a1f introduced. NOTE: mirrors c0d0a1f's marker;
  // flagged for native review at graduation (only English was panel-ratified).
  describe('segundo lista/rango/único confina la restricción del minuto',
    function() {
      run([
        ['5,10,15 4/6 * * * *',
          'en los segundos 5, 10 y 15 de cada sexto minuto ' +
          'a partir del minuto 4 de cada hora'],
        ['30 4/6 * * * *',
          'en el segundo 30 de cada sexto minuto ' +
          'a partir del minuto 4 de cada hora'],
        ['0-30 4/6 * * * *',
          'cada segundo del 0 al 30 de cada sexto minuto ' +
          'a partir del minuto 4 de cada hora'],
        ['30 */6 * * * *',
          'en el segundo 30 de cada sexto minuto de cada hora'],
        ['30 2/7 * * * *',
          'en el segundo 30 de cada séptimo minuto ' +
          'del minuto 2 al 58 de cada hora'],
        ['5,10,15 0,15,30 * * * *',
          'en los segundos 5, 10 y 15 de los minutos 0, 15 y 30 de cada hora'],
        ['15 0-30 * * * *',
          'en el segundo 15 de cada minuto del 0 al 30 de cada hora'],
        ['5,10 30 * * * *',
          'en los segundos 5 y 10 del minuto 30 de cada hora'],
        ['0-30 30 * * * *',
          'cada segundo del 0 al 30 del minuto 30 de cada hora']
      ]);
    });

  describe('segundo bajo un minuto pareado (* */N)', function() {
    run([
      // A wildcard second under a minute */2 binds the two cadences instead of
      // juxtaposing the contradictory "cada segundo, cada dos minutos".
      ['* */2 * * * *', 'cada segundo de cada dos minutos'],
      // Other clean steps confine as the ordinal cadence.
      ['* */3 * * * *', 'cada segundo en cada tercer minuto de cada hora'],
      ['* */15 * * * *',
        'cada segundo en cada decimoquinto minuto de cada hora'],
      // Guards: no-seconds, restricted hour, hour cadence are unchanged.
      ['*/2 * * * *', 'cada dos minutos'],
      ['* */2 0 * * *',
        'cada segundo, cada dos minutos de las 00:00 a las 00:58'],
      ['* */2 */2 * * *',
        'cada segundo, cada dos minutos, durante las horas pares']
    ]);
  });

  describe('fichas Quartz', function() {
    run([
      ['0 0 L * *', 'el último día del mes a medianoche'],
      ['0 0 * * 5L', 'el último viernes del mes a medianoche'],
      ['0 0 * * 1#2', 'el segundo lunes del mes a medianoche'],
      ['0 0 15W * *', 'el día laborable más cercano al 15 a medianoche']
    ], ampm);
  });

  describe('años', function() {
    run([
      ['0 0 12 25 12 * 2030', 'el 25 de diciembre de 2030 al mediodía'],
      ['0 0 9 * * * 2030', 'todos los días a las 9 de la mañana en 2030']
    ], ampm);
  });

  describe('fecha o día de la semana', function() {
    // 12-hour entries (ampm: true shared).
    run([
      // Single month, single DOM, single DOW.
      ['59 23 31 12 5',
        'en diciembre a las 11:59 de la noche, ya sea el día 31 o cualquier viernes'],
      ['59 23 31 12 5',
        'en diciembre a las 23:59, ya sea el día 31 o cualquier viernes',
        {ampm: false}]
    ], ampm);

    // 24-hour entries (default clock; no ampm override).
    run([
      // Single month — el día N arm.
      ['0 0 1 1 0', 'en enero a las 00:00, ya sea el día 1 o cualquier domingo'],
      // Wildcard month — el N de cada mes arm.
      ['0 0 1 * 5L', 'a las 00:00, ya sea el 1 de cada mes o el último viernes del mes'],
      // Wildcard month, step DOM, step DOW. In the OR union the `*/2` day-of-
      // month is the parity predicate "un día impar del mes" (the odd days
      // 1,3,…,31 resetting each month), not the durative "cada dos días".
      ['0 0 */2 * */2',
        'a las 00:00, ya sea un día impar del mes o los martes, jueves, sábados y domingos'],
      // Even-day start (`2/2`) selects the complementary parity predicate
      // "un día par del mes" in the OR union, mirroring the en even-day arm.
      ['0 0 2/2 * 0',
        'a las 00:00, ya sea un día par del mes o cualquier domingo'],
      // Enumeration/step months (≥2): month lead with trailing comma.
      ['0 0 */2 */2 */2',
        'en enero, marzo, mayo, julio, septiembre y noviembre, a las 00:00, ' +
        'ya sea un día impar del mes o los martes, jueves, sábados y domingos'],
      ['0 0 L */2 */2',
        'en enero, marzo, mayo, julio, septiembre y noviembre, a las 00:00, ' +
        'ya sea el último día del mes o los martes, jueves, sábados y domingos'],
      // Range month (no trailing comma).
      ['0 0 1-15 1-3 */2',
        'de enero a marzo a las 00:00, ya sea del 1 al 15 del mes o los martes, jueves, sábados y domingos'],
      ['0 0 1 1-3 0',
        'de enero a marzo a las 00:00, ya sea el día 1 o cualquier domingo'],
      // Frequency + wildcard month.
      ['*/5 */2 1 * 5',
        'cada cinco minutos, durante las horas pares, ya sea el 1 de cada mes o cualquier viernes'],
      // Mixed weekday arm (range + single): exercises the mixed-list dow branch.
      ['0 0 1 * 0,1-5',
        'a las 00:00, ya sea el 1 de cada mes o de lunes a viernes y los domingos'],
      ['0 0 1 6-9 0,1-5',
        'de junio a septiembre a las 00:00, ya sea el día 1 o de lunes a viernes y los domingos'],
      // Irregular hour list with a 1-o'clock fire (not a progression, so it
      // stays an enumeration): group by article in the union frame.
      ['5 1,6,11,16,22 1 1,7 MON',
        'en enero y julio, a la 01:05 y a las 06:05, 11:05, 16:05 y 22:05, ' +
        'ya sea el día 1 o cualquier lunes']
    ]);
  });

  describe('pasos con desfase y acotados', function() {
    run([
      ['5/15 * * * *',
        'cada 15 minutos a partir del minuto 5 de cada hora'],
      ['40/15 * * * *', 'en los minutos 40 y 55 de cada hora'],
      ['0-30/10 * * * *', 'en los minutos 0, 10, 20 y 30 de cada hora'],
      // An uneven step (interval does not divide the cycle) and an offset step
      // (start >= interval) fire a non-uniform bounded set: named with its
      // interval and both endpoints ("del minuto M al K"), not enumerated.
      ['*/7 * * * *',
        'cada siete minutos del minuto 0 al 56 de cada hora'],
      ['3/2 * * * *',
        'cada dos minutos del minuto 3 al 59 de cada hora'],
      ['7/9 * * * *',
        'cada nueve minutos del minuto 7 al 52 de cada hora'],
      // A uniform offset step (interval divides the cycle, start within the
      // first interval) wraps cleanly: name only its start, no endpoint.
      ['5/6 * * * *',
        'cada seis minutos a partir del minuto 5 de cada hora'],
      ['11/12 * * * *',
        'cada 12 minutos a partir del minuto 11 de cada hora'],
      // A clean stride from the top of the cycle keeps the bare cadence.
      ['*/2 * * * *', 'cada dos minutos'],
      // Compounded: a stepped second over a stepped minute, each a cadence.
      ['3/2 1/2 * * * *',
        'cada dos segundos del segundo 3 al 59 de cada minuto, ' +
        'cada dos minutos a partir del minuto 1 de cada hora'],
      ['*/35 * * * *', 'en los minutos 0 y 35 de cada hora'],
      // A uneven or bounded hour step has a distinct endpoint, so it reads as a
      // bounded cadence pinning both clock-time ends, not a wall of clock times.
      ['0 2/5 * * *',
        'cada cinco horas de las 2 de la madrugada a las 10 de la noche'],
      ['0 8-18/4 * * *',
        'cada cuatro horas de las 8 de la mañana a las 4 de la tarde'],
      ['0 0/7 * * *',
        'cada siete horas de medianoche a las 9 de la noche'],
      ['* */2 * * *', 'cada minuto, durante las horas pares'],
      ['0 12 */2 * *', 'cada dos días del mes al mediodía'],
      ['0 12 5/3 * *', 'cada tres días del mes desde el 5 al mediodía'],
      // Uniform steps that start off the top of the cycle keep the cadence
      // form (interval divides the cycle, start within the first interval): a
      // short one lists its fires, a longer one names interval + start.
      ['17/20 * * * *', 'en los minutos 17, 37 y 57 de cada hora'],
      ['0 8/12 * * *', 'a las 8 de la mañana y 8 de la noche'],
      ['0 2/3 * * *', 'cada tres horas a partir de las 2 de la madrugada'],
      // A uniform step segment beside a range, rendered as per-hour windows.
      ['* 2/4,18-20 * * *',
        'cada minuto de las 2 a las 2:59 de la madrugada, ' +
        'de las 6 a las 6:59 de la mañana, de las 10 a las 10:59 de la ' +
        'mañana, de las 2 a las 2:59 de la tarde, de las 6 a las 6:59 de la ' +
        'tarde y de las 10 a las 10:59 de la noche y de las 6 de la tarde a ' +
        'las 8:59 de la noche']
    ], ampm);
  });

  // A fixed hour under a stepped/listed minute names the HOUR, never a false
  // "a las HH:00" clock instant the minute never fires at: midnight and noon
  // read as the hour word ("a medianoche"/"al mediodía"), any other hour as
  // "de la hora de las HH:00". A minute that IS a single value keeps the real
  // clock time ("a las HH:MM"). 24-hour default (no ampm shared option).
  describe('hora fija bajo un minuto en paso (lee la hora, no las HH:00)',
    function() {
      run([
        ['3/2 0 * 1 5L',
          'cada dos minutos del minuto 3 al 59 de cada hora, a medianoche ' +
          'el último viernes del mes de enero'],
        ['3/2 12 * * *',
          'cada dos minutos del minuto 3 al 59 de cada hora, al mediodía'],
        ['3/2 9 * * *',
          'cada dos minutos del minuto 3 al 59 de cada hora, ' +
          'de la hora de las 09:00'],
        // Several fixed hours each read as their own whole hour; an all
        // noon/midnight set keeps the word forms.
        ['3/2 9,12 * * *',
          'cada dos minutos del minuto 3 al 59 de cada hora, ' +
          'de la hora de las 09:00 y de la hora de las 12:00'],
        ['3/2 0,12 * * *',
          'cada dos minutos del minuto 3 al 59 de cada hora, ' +
          'a medianoche y al mediodía'],
        // A fixed hour beside an hour range: the range stays a whole-hour
        // window, the point its own whole hour — never a dropped range.
        ['3/2 9-11,15 * * *',
          'cada dos minutos del minuto 3 al 59 de cada hora, ' +
          'de las 09:00 a las 11:00 y de la hora de las 15:00'],
        // The guard: a single-value minute is a real clock time — keep HH:MM.
        ['5 9 * * *', 'todos los días a las 09:05']
      ]);
    });

  // A sub-minute second with the minute pinned to 0 and a specific hour: the
  // minute-0 is a real one-minute confinement (60 fires in :00, not 3,600
  // across the hour). A bare hour ("a las 9") reads aloud as the whole hour,
  // so the confinement is stated outright with a duration frame ("durante un
  // minuto a las 9") and the day qualifier trails (24-hour clock, RAE default).
  describe('minuto fijado a 0 bajo una hora concreta (24 horas)', function() {
    run([
      ['* 0 0 * * *',
        'cada segundo durante un minuto a medianoche, todos los días'],
      ['* 0 9 * * *',
        'cada segundo durante un minuto a las 9, todos los días'],
      ['* 0 12 * * *',
        'cada segundo durante un minuto al mediodía, todos los días'],
      ['* 0 9,11 * * *',
        'cada segundo durante un minuto a las 9 y 11, todos los días'],
      // An hour RANGE under a minute-0 confinement reads as a window, not a
      // wall of clock times: the one-minute window during the 09:00-17:00
      // hours (the hour-range analog of the even-hours confinement below).
      ['* 0 9-17 * * *',
        'cada segundo durante un minuto, durante las horas de las 09:00 ' +
        'a las 17:00'],
      // An hour step under a minute-0 confinement reads as a cadence, not a
      // wall of clock times: the one-minute window during the even hours.
      ['* 0 */2 * * *',
        'cada segundo durante un minuto, durante las horas pares'],
      ['* 0 9 * * MON',
        'cada segundo durante un minuto a las 9, los lunes'],
      ['*/15 0 9 * * *',
        'cada 15 segundos durante un minuto a las 9, todos los días'],
      // One o'clock takes the singular article ("a la 1") even on the 24-hour
      // clock.
      ['* 0 1 * * *',
        'cada segundo durante un minuto a la 1, todos los días'],
      // A date-OR-weekday union drops the day trail here (the unified frame
      // supplies the day-level suffix), so the confinement leads the frame.
      ['* 0 9 1 * MON',
        'cada segundo durante un minuto a las 9, ya sea el 1 de cada mes ' +
        'o cualquier lunes']
    ]);
  });

  // A non-zero pinned minute is an unambiguous clock time: the genitive
  // "de las 09:05" form reads as the minute, never the hour, so it generalizes
  // the confinement without the duration frame the minute-0 case needs.
  describe('minuto fijado distinto de 0 bajo una hora concreta (24 horas)',
    function() {
      run([
        ['* 5 0 * * *', 'cada segundo de las 00:05, todos los días'],
        ['* 5 9 * * *', 'cada segundo de las 09:05, todos los días'],
        // One o'clock takes the singular article ("de la 01:05").
        ['* 5 1 * * *', 'cada segundo de la 01:05, todos los días'],
        ['* 5 9,11 * * *',
          'cada segundo de las 09:05 y 11:05, todos los días'],
        ['* 5 9 * * MON', 'cada segundo de las 09:05, los lunes']
      ]);
    });

  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute reads as a cadence, not a cross-product of clock times: the
  // minute/second lead clause, then the hour cadence ("cada dos horas").
  // Irregular hour lists and ranges still enumerate.
  describe('paso horario como cadencia en vez de lista de horas', function() {
    run([
      ['30 0 */2 * * *',
        'en el segundo 30 de cada hora, cada dos horas'],
      ['5 0 */2 * * *',
        'en el segundo 5 de cada hora, cada dos horas'],
      ['30 */2 * * *',
        'en el minuto 30, cada dos horas'],
      // An arithmetic-progression hour list compacts the same way.
      ['30 0 0,4,8,12,16,20 * * *',
        'en el segundo 30 de cada hora, cada cuatro horas'],
      // An offset stride that still tiles names only its start; a bounded one
      // pins both clock-time endpoints; the minute-0 confinement reuses the
      // odd-hours idiom for an odd stride.
      ['30 0 1/2 * * *',
        'en el segundo 30 de cada hora, cada dos horas a partir de la 01:00'],
      ['30 0 5,9,13,17,21 * * *',
        'en el segundo 30 de cada hora, cada cuatro horas de las 05:00 ' +
        'a las 21:00'],
      ['* 0 1/2 * * *',
        'cada segundo durante un minuto, durante las horas impares'],
      ['* 0 */3 * * *',
        'cada segundo durante un minuto, durante las horas de las 0, 3, 6, ' +
        '9, 12, 15, 18 y 21'],
      // A non-zero pinned minute under an hour step: the second leads, then the
      // minute, then the hour cadence.
      ['30 5 */2 * * *',
        'en el segundo 30 de cada minuto, en el minuto 5, cada dos horas'],
      ['* 5 */2 * * *', 'cada segundo, en el minuto 5, cada dos horas'],
      // An hour RANGE reads as a window, not a wall of clock times: the
      // second/minute lead, then "de las 09:00 a las 17:00" (see the
      // dedicated hour-range section below). Guard: an irregular hour list
      // (no range) has no window to form and still enumerates.
      ['30 0 9,17 * * *', 'todos los días a las 09:00:30 y 17:00:30'],
      ['30 0 9-17 * * *',
        'en el segundo 30 de cada hora, de las 09:00 a las 17:00'],
      // A clean hour step with a plain :00 stays the bare hour cadence.
      ['0 0 */2 * * *', 'cada dos horas']
    ]);
  });

  // A single second under a multi-valued minute and a bounded hour step: the
  // compact clock-time rest owns the second lead, so the composer must not
  // prepend it again (which once doubled "en el segundo 30 de cada minuto").
  describe('segundo bajo paso de minuto y paso horario acotado', function() {
    run([
      ['30 */25 9-17/2 * * *',
        'en el segundo 30 de cada minuto, ' +
        'en los minutos 0, 25 y 50, ' +
        'cada dos horas de las 09:00 a las 17:00']
    ]);
  });

  // A wildcard or stepped second under a MINUTE LIST across specific hours is a
  // wall of distinct clock times, not a one-minute confinement: each minute is
  // named ("09:25"), never collapsed to the bare hour (which once repeated the
  // hour once per minute, "a las 9, 9, 9, ...").
  describe('segundo subminuto bajo lista de minutos en horas concretas',
    function() {
      run([
        ['* */25 9,17 * * *',
          'cada segundo de las 09:00, 09:25, 09:50, ' +
          '17:00, 17:25 y 17:50, todos los días'],
        ['*/15 */25 9,17 * * *',
          'cada 15 segundos de las 09:00, 09:25, 09:50, ' +
          '17:00, 17:25 y 17:50, todos los días']
      ]);
    });

  // An hour RANGE (or a list whose segments include a range) under minute 0
  // and a meaningful second used to expand into a wall of clock times; it now
  // reads as the hour-range window ("de las 09:00 a las 17:00"). The
  // hour-RANGE analog of the hour-step cadence. A pure single-value hour list
  // (9,17) has no range to span and still enumerates.
  describe('rango horario como ventana en vez de lista de horas', function() {
    run([
      ['30 0 9-17 * * *',
        'en el segundo 30 de cada hora, de las 09:00 a las 17:00'],
      ['5,30 0 9-17 * * *',
        'en los segundos 5 y 30 de cada hora, de las 09:00 a las 17:00'],
      ['0-10 0 9-17 * * *',
        'cada segundo del 0 al 10 de cada hora, de las 09:00 a las 17:00'],
      // A wildcard or sub-minute step second is the one-minute window confined
      // to the hour range ("durante las horas …"), distinct from the bare
      // minute-0 window so the confinement is never heard as it.
      ['* 0 9-17 * * *',
        'cada segundo durante un minuto, durante las horas de las 09:00 ' +
        'a las 17:00'],
      ['*/15 0 9-17 * * *',
        'cada 15 segundos durante un minuto, durante las horas de las 09:00 ' +
        'a las 17:00'],
      // A range inside a list: the contiguous span is a window, the
      // non-contiguous hour joins with "y también".
      ['30 0 9-20,22 * * *',
        'en el segundo 30 de cada hora, de las 09:00 a las 20:00 ' +
        'y también a las 22:00'],
      ['* 0 9-20,22 * * *',
        'cada segundo durante un minuto, durante las horas de las 09:00 ' +
        'a las 20:00 y también a las 22:00'],
      // The window carries the trailing day qualifier.
      ['30 0 9-17 * * MON',
        'en el segundo 30 de cada hora, de las 09:00 a las 17:00 los lunes'],
      // Guard: a pure single-value hour list (no range) still enumerates.
      ['30 0 9,17 * * *', 'todos los días a las 09:00:30 y 17:00:30']
    ]);
  });

  describe('segundos independientes y compuestos', function() {
    run([
      ['0-30 * * * * *', 'cada segundo del 0 al 30 de cada minuto'],
      ['5,10 * * * * *', 'en los segundos 5 y 10 de cada minuto'],
      ['*/15 30 * * * *',
        'cada 15 segundos, en el minuto 30 de cada hora'],
      ['* 30 9 * * *',
        'cada segundo de las 9:30 de la mañana, todos los días'],
      // Minute 0 under a sub-minute second must be stated, not absorbed into
      // an hourly idiom ("cada hora" / "cada dos horas" / a 9-a-17 window)
      // that silently drops the :00.
      ['* 0 * * * *', 'cada segundo, en el minuto 0 de cada hora'],
      // An hour RANGE under the minute-0 confinement reads as a window
      // ("durante las horas …"), not a wall of clock times; the window honors
      // the 12-hour dialect ("de las 9 de la mañana a las 5 de la tarde").
      ['* 0 9-17 * * *',
        'cada segundo durante un minuto, durante las horas de las 9 ' +
        'de la mañana a las 5 de la tarde'],
      // A wildcard minute under a restricted hour: the hour window must
      // survive (it once collapsed to a bare "cada segundo"). Fuzzer-found.
      ['* * 9 * * *',
        'cada segundo, cada minuto de la hora de las 9 de la mañana'],
      ['*/15 * 9-17 * * *',
        'cada 15 segundos, cada minuto de las 9 de la mañana ' +
        'a las 5:59 de la tarde'],
      ['0-30 * 9 * * *',
        'cada segundo del 0 al 30 de cada minuto, ' +
        'cada minuto de la hora de las 9 de la mañana']
    ], ampm);
  });

  describe('formas compactas y listas mixtas', function() {
    run([
      ['30 9-20,22 * * *',
        'cada hora de las 9:30 de la mañana a las 8:30 de la noche ' +
        'y también a las 10:30 de la noche'],
      ['0,30 8-18/2 * * *',
        'en los minutos 0 y 30, ' +
        'cada dos horas de las 8 de la mañana a las 6 de la tarde'],
      ['*/15 9-20,22 * * *',
        'cada 15 minutos de las 9 de la mañana a las 8:59 de la noche ' +
        'y de las 10 a las 10:59 de la noche'],
      ['0-10,30 9 * * *',
        'en los minutos 0 a 10 y 30 de cada hora, a las 9 de la mañana'],
      ['0 0 * * 1-5,0',
        'de lunes a viernes y los domingos a medianoche'],
      ['50-10 * * * *', 'cada minuto del 50 al 10 de cada hora']
    ], ampm);
  });

  describe('más fichas Quartz y años', function() {
    run([
      ['0 0 LW * *', 'el último día laborable del mes a medianoche'],
      ['0 0 L-5 * *',
        '5 días antes del último día del mes a medianoche'],
      ['0 0 L-1 * *',
        'un día antes del último día del mes a medianoche'],
      ['*/15 * * * 5L', 'cada 15 minutos el último viernes del mes'],
      ['0 0 9 * * * 2030,2031',
        'todos los días a las 9 de la mañana en 2030 y 2031'],
      ['0 0 9 * * * 2030-2035',
        'todos los días a las 9 de la mañana en 2030-2035'],
      ['0 0 12 1 1 * */2', 'el 1 de enero al mediodía cada dos años'],
      ['0 0 12 1 1 * */1', 'el 1 de enero al mediodía cada año'],
      ['0 0 12 1 1 * 2030/2',
        'el 1 de enero al mediodía cada dos años desde 2030']
    ], ampm);
  });

  describe('cobertura de ramas', function() {
    run([
      ['15 0,30 * * * *',
        'en el segundo 15 de los minutos 0 y 30 de cada hora'],
      // A stride of two over the whole day reads as the even/odd hours; any
      // other step names its active hours, which pins the schedule precisely
      // (a panel found ordinal/colloquial forms imprecise).
      ['*/15 */2 * * *', 'cada 15 minutos, durante las horas pares'],
      ['*/15 1/2 * * *', 'cada 15 minutos, durante las horas impares'],
      // 12-hour dialect: active hours grouped by day period, each period named
      // once, noon/midnight as their own markers (cross-family validated).
      ['*/15 */3 * * *',
        'cada 15 minutos, durante las horas de medianoche, de las 3 de la ' +
        'madrugada, de las 6 y 9 de la mañana, del mediodía, de las 3 y 6 ' +
        'de la tarde y de las 9 de la noche'],
      ['*/15 1/3 * * *',
        'cada 15 minutos, durante las horas de la 1 y las 4 de la ' +
        'madrugada, de las 7 y 10 de la mañana, de la 1, las 4 y las 7 de ' +
        'la tarde y de las 10 de la noche'],
      ['*/20 9-17/2 * * *',
        'cada 20 minutos, ' +
        'cada dos horas de las 9 de la mañana a las 5 de la tarde'],
      ['* 9-17 * * *',
        'cada minuto de las 9 de la mañana a las 5:59 de la tarde'],
      ['* 0-5 * * *',
        'cada minuto de medianoche a las 5:59 de la madrugada'],
      ['0-30 9-17 * * *',
        'cada minuto del 0 al 30, de las 9 de la mañana a las 5 de la tarde'],
      ['0 */9 * * *',
        'cada nueve horas de medianoche a las 6 de la tarde'],
      ['0-30 9-20,22 * * *',
        'cada minuto del 0 al 30, de las 9 de la mañana a las 8 de la noche y también a las 10 de la noche'],
      ['* 1,6/3 * * *',
        'cada minuto de la 1 a la 1:59 de la madrugada, ' +
        'de las 6 a las 6:59 de la mañana, de las 9 a las 9:59 de la ' +
        'mañana, del mediodía a las 12:59 de la tarde, de las 3 a las ' +
        '3:59 de la tarde, de las 6 a las 6:59 de la tarde y de las 9 ' +
        'a las 9:59 de la noche'],
      ['*/15 9-17 * * *', 'cada 15 minutos de las 09:00 a las 17:45',
        {ampm: false}],
      ['*/15 * 13 * 5',
        'cada 15 minutos, ya sea el 13 de cada mes o cualquier viernes'],
      ['*/15 * * 6 *', 'cada 15 minutos en junio'],
      ['0 12 * * 0,1/2',
        'los lunes, miércoles, viernes y domingos al mediodía'],
      ['0 12 * 1,6/3 *',
        'todos los días de enero, junio, septiembre y diciembre ' +
        'al mediodía'],
      ['0,30/15 * * * *', 'en los minutos 0, 30 y 45 de cada hora'],
      ['5,30-40/5 * * * *',
        'en los minutos 5, 30, 35 y 40 de cada hora'],
      ['*/5 * * * *', 'cada 5 minutos', {short: true}],
      ['0 12 * * 7', 'los domingos al mediodía'],
      ['5 9 * * *', 'todos los días a las 9:05 de la mañana'],
      // Restricted-month OR union with a range weekday: now uses the unified
      // ya-sea frame with month fronted once and month-less arms. The weekday
      // range arm reads "cualquier día de lunes a viernes" so the union "o"
      // joins two parallel day predicates (a nominal day vs. a weekday range).
      ['0 12 1 6-9 MON-FRI',
        'de junio a septiembre al mediodía, ya sea el día 1 o cualquier día de lunes a viernes'],
      // Wildcard-month OR union with a range weekday (the panel's n2 case):
      // "el 1 de cada mes" or "cualquier día de lunes a viernes".
      ['0 0 1 * 1-5',
        'a medianoche, ya sea el 1 de cada mes o cualquier día de lunes a viernes'],
      // Single restricted month + weekday (no date): exercises monthScope
      // with a non-ranged month.
      ['0 9 * 6 MON', 'los lunes de junio a las 9 de la mañana']
    ], ampm);
  });

  describe('dialecto personalizado', function() {
    run([
      ['30 17 * * *', 'todos los días a las 17.30', {dialect: {sep: '.'}}],
      // The "h" suffix is opt-in via a custom style (it is not a dialect
      // default — the native panel found it reads as formal, not natural).
      ['0 9 * * *', 'todos los días a las 09:00 h', {dialect: {hSuffix: true}}],
      ['30 14 * * *', 'todos los días a las 14.30 h',
        {dialect: {hSuffix: true, sep: '.'}}]
    ]);
  });

  // Regional dialects (cross-family panel attested, 2026-06-15): Mexico and
  // US lean 12-hour, US writes the English AM/PM meridiem; Spain (es-ES) is
  // the RAE-anchored 24-hour default.
  describe('dialectos regionales', function() {
    run([
      // es-MX: 12-hour by default, day-period descriptors.
      ['30 9 * * *', 'todos los días a las 9:30 de la mañana',
        {dialect: 'es-MX'}],
      ['30 14 * * *', 'todos los días a las 2:30 de la tarde',
        {dialect: 'es-MX'}],
      // es-MX default 12h: elision fires without explicit ampm option.
      ['0 1,13 * * *', 'todos los días a la 1 de la madrugada y de la tarde',
        {dialect: 'es-MX'}],
      // es-US: 12-hour with the English AM/PM meridiem (no "de la").
      ['30 9 * * *', 'todos los días a las 9:30 AM', {dialect: 'es-US'}],
      ['0 22 * * *', 'todos los días a las 10 PM', {dialect: 'es-US'}],
      // es-US minute-0 confinement: the duration frame ("durante un minuto a
      // las 9 AM") states the one-minute window so the bare hour cannot be
      // heard as the whole hour, under the English meridiem.
      ['* 0 9 * * *',
        'cada segundo durante un minuto a las 9 AM, todos los días',
        {dialect: 'es-US'}],
      // es-ES: the RAE-anchored 24-hour default (same as neutral `es`).
      ['30 9 * * *', 'todos los días a las 09:30', {dialect: 'es-ES'}]
    ]);
  });

  // Un rango simple que abarca todo el campo no impone restricción alguna,
  // así que se lee igual que `*`.
  describe('un rango sobre todo el campo se lee como el comodín', function() {
    run([
      ['0-59 * * * *', 'cada minuto'],
      ['0 0-23 * * *', 'cada hora'],
      ['0 0 1-31 * *', 'todos los días a las 00:00'],
      ['0 0 * 1-12 *', 'todos los días a las 00:00'],
      ['0 0 * * 0-6', 'todos los días a las 00:00'],
      ['0 0 * * 1-7', 'todos los días a las 00:00'],
      ['0 0 * * SUN-SAT', 'todos los días a las 00:00']
    ]);
  });

  describe('casos especiales', function() {
    it('describe @reboot', function() {
      expect(cronli5('@reboot', {lang: es}))
        .to.equal('al arrancar el sistema');
    });

    it('usa el texto de reserva en modo lenient', function() {
      expect(cronli5('no es cron', {lang: es, lenient: true}))
        .to.equal('un patrón cron irreconocible');
    });
  });

  // A bounded or uneven hour stride reads as its endpoint-pinning cadence
  // across the minute paths; an offset-clean bounded step keeps its fires, and
  // a single-fire bounded step is just that value.
  describe('cadencia horaria por los pasos de minuto', function() {
    run([
      ['0 0,8,16 * * *', 'todos los días a las 00:00, 08:00 y 16:00'],
      ['* */5 * * *', 'cada minuto, cada cinco horas de las 00:00 a las 20:00'],
      ['*/25 */5 * * *',
        'en los minutos 0, 25 y 50, ' +
        'cada cinco horas de las 00:00 a las 20:00'],
      ['0-30 */5 * * *',
        'cada minuto del 0 al 30, cada cinco horas de las 00:00 a las 20:00'],
      ['* 9-17/2 * * *', 'cada minuto, cada dos horas de las 09:00 a las 17:00'],
      ['0-30 9-17/2 * * *',
        'cada minuto del 0 al 30, cada dos horas de las 09:00 a las 17:00'],
      ['5,10 9-17/2 * * *',
        'en los minutos 5 y 10, ' +
        'cada dos horas de las 09:00 a las 17:00'],
      ['0 1-23/2 * * *',
        'a la 01:00 y a las 03:00, 05:00, 07:00, 09:00, 11:00, 13:00, 15:00, ' +
        '17:00, 19:00, 21:00 y 23:00'],
      ['0 9-10/5 * * *', 'a las 09:00'],
      // A bounded step from midnight that stops short of the day's last tile
      // (0-20/2 fires 0,2,…,20, never 22) pins both endpoints, like 9-17/2 —
      // it must not read as the all-day "cada dos horas".
      ['23 0-20/2 * * *', 'en el minuto 23, cada dos horas de las 00:00 a las 20:00'],
      ['30 0-20/3 * * *',
        'en el minuto 30, cada tres horas de las 00:00 a las 18:00'],
      // Guards: an open `*/n` and a full-field-equivalent step (0-22/2 ≡ `*/2`)
      // are the all-day set and stay bare.
      ['23 */2 * * *', 'en el minuto 23, cada dos horas'],
      ['23 0-22/2 * * *', 'en el minuto 23, cada dos horas']
    ]);
  });

  // Cobertura adicional: listas y rangos de hora con cadencia de segundos /
  // minutos. Cada fila describe el mismo horario que la salida en inglés.
  describe('cobertura adicional (listas/rangos de hora)', function() {
    run([
      ['0 0 9,17 * * *', 'todos los días a las 09:00 y 17:00'],
      ['0 9,12,17 * * *', 'todos los días a las 09:00, 12:00 y 17:00'],
      ['*/15 0,12 * * *',
        'cada 15 minutos de las 00:00 a las 00:59 y de las 12:00 a las 12:59'],
      ['15 0 9-17 * * *',
        'en el segundo 15 de cada hora, de las 09:00 a las 17:00'],
      ['30 0 9-17/2 * * *',
        'en el segundo 30 de cada hora, ' +
        'cada dos horas de las 09:00 a las 17:00'],
      // Un paso de hora con desfase enumera sus disparos como horas de reloj.
      ['0 0 8/4 * * *', 'todos los días a las 08:00, 12:00, 16:00 y 20:00'],
      ['0 30 0,8,16 * * *', 'todos los días a las 00:30, 08:30 y 16:30']
    ]);
  });
});

// Errores conocidos, aún sin corregir (revisión + barrido amplio;
// docs/backlog.md, "Open rendering findings"). Omitidos hasta el paso C:
// reactivar (skip → describe) y corregir.
describe('Errores conocidos (paso C):', function() {
  it('usa el reloj del dialecto en la lista de horas, no 24 h', function() {
    expect(cronli5('*/15 14,18,20,22 * * *', {dialect: 'es-MX', lang: es}))
      .to.not.include('las 14');
  });
});
