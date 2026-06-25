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
      ['0 1,6,11,16,21 * * *',
        'todos los días a la 01:00 y a las 06:00, 11:00, 16:00 y 21:00'],
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
        'de lunes a viernes, de las 09:00 a las 17:30, cada 15 segundos del minuto 30'],
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
        'de las 9 de la mañana a las 5:30 de la tarde'],
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
        'cada minuto del 0 al 30, cada dos horas']
    ], ampm);
  });

  describe('segundos compuestos', function() {
    run([
      ['*/15 30 9 * * *',
        'cada 15 segundos de las 9:30 de la mañana, todos los días'],
      ['15 30 9 * * *', 'todos los días a las 9:30:15 de la mañana']
    ], ampm);
  });

  describe('segundo bajo un minuto pareado (* */N)', function() {
    run([
      // A wildcard second under a minute */2 binds the two cadences instead of
      // juxtaposing the contradictory "cada segundo, cada dos minutos".
      ['* */2 * * * *', 'cada segundo de cada dos minutos'],
      // Other strides keep the juxtaposed form.
      ['* */3 * * * *', 'cada segundo, cada tres minutos'],
      ['* */15 * * * *', 'cada segundo, cada 15 minutos'],
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
      // Wildcard month, step DOM, step DOW.
      ['0 0 */2 * */2',
        'a las 00:00, ya sea cada dos días del mes o los domingos, martes, jueves y sábados'],
      // Enumeration/step months (≥2): month lead with trailing comma.
      ['0 0 */2 */2 */2',
        'en enero, marzo, mayo, julio, septiembre y noviembre, a las 00:00, ' +
        'ya sea cada dos días del mes o los domingos, martes, jueves y sábados'],
      ['0 0 L */2 */2',
        'en enero, marzo, mayo, julio, septiembre y noviembre, a las 00:00, ' +
        'ya sea el último día del mes o los domingos, martes, jueves y sábados'],
      // Range month (no trailing comma).
      ['0 0 1-15 1-3 */2',
        'de enero a marzo a las 00:00, ya sea del 1 al 15 del mes o los domingos, martes, jueves y sábados'],
      ['0 0 1 1-3 0',
        'de enero a marzo a las 00:00, ya sea el día 1 o cualquier domingo'],
      // Frequency + wildcard month.
      ['*/5 */2 1 * 5',
        'cada cinco minutos, durante las horas pares, ya sea el 1 de cada mes o cualquier viernes'],
      // Mixed weekday arm (range + single): exercises the mixed-list dow branch.
      ['0 0 1 * 0,1-5',
        'a las 00:00, ya sea el 1 de cada mes o los domingos y de lunes a viernes'],
      ['0 0 1 6-9 0,1-5',
        'de junio a septiembre a las 00:00, ya sea el día 1 o los domingos y de lunes a viernes'],
      // Step hour with 1-o'clock fire: group by article in the union frame.
      ['5 1/5 1 1,7 MON',
        'en enero y julio, a la 01:05 y a las 06:05, 11:05, 16:05 y 21:05, ' +
        'ya sea el día 1 o cualquier lunes']
    ]);
  });

  describe('pasos con desfase y acotados', function() {
    run([
      ['5/15 * * * *',
        'cada 15 minutos a partir del minuto 5 de cada hora'],
      ['40/15 * * * *', 'en los minutos 40 y 55 de cada hora'],
      ['0-30/10 * * * *', 'en los minutos 0, 10, 20 y 30 de cada hora'],
      ['*/7 * * * *',
        'en los minutos 0, 7, 14, 21, 28, 35, 42, 49 y 56 de cada hora'],
      ['*/35 * * * *', 'en los minutos 0 y 35 de cada hora'],
      ['0 2/5 * * *',
        'todos los días a las 2 de la madrugada, a las 7 de la mañana, ' +
        'al mediodía, a las 5 de la tarde y a las 10 de la noche'],
      ['0 8-18/4 * * *',
        'a las 8 de la mañana, al mediodía y a las 4 de la tarde'],
      ['0 0/7 * * *',
        'todos los días a medianoche, a las 7 de la mañana, ' +
        'a las 2 de la tarde y a las 9 de la noche'],
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
      ['* 0 9-17 * * *',
        'cada segundo durante un minuto a las 9, a las 10, a las 11, ' +
        'al mediodía, a las 13, a las 14, a las 15, a las 16 y a las 17, ' +
        'todos los días'],
      ['* 0 */2 * * *',
        'cada segundo durante un minuto a medianoche, a las 2, a las 4, ' +
        'a las 6, a las 8, a las 10, al mediodía, a las 14, a las 16, ' +
        'a las 18, a las 20 y a las 22, todos los días'],
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
      // The minute-0 confinement reads with a duration frame ("durante un
      // minuto a las 9 …"), never a bare hour, which reads aloud as the whole
      // hour. The hour reads as its day-period word; "durante un minuto"
      // carries the one-minute window.
      ['* 0 9-17 * * *',
        'cada segundo durante un minuto a las 9, 10 y 11 de la mañana, ' +
        'al mediodía, y a la 1, a las 2, a las 3, a las 4 y a las 5 ' +
        'de la tarde, todos los días'],
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
        'en los minutos 0 y 30 de cada hora, a las 8 de la mañana, ' +
        'a las 10 de la mañana, al mediodía, a las 2 de la tarde, ' +
        'a las 4 de la tarde y a las 6 de la tarde'],
      ['*/15 9-20,22 * * *',
        'cada 15 minutos de las 9 de la mañana a las 8:59 de la noche ' +
        'y de las 10 a las 10:59 de la noche'],
      ['0-10,30 9 * * *',
        'en los minutos 0 a 10 y 30 de cada hora, a las 9 de la mañana'],
      ['0 0 * * 1-5,0',
        'los domingos y de lunes a viernes a medianoche'],
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
        'en el segundo 15 de cada minuto, ' +
        'en los minutos 0 y 30 de cada hora'],
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
        'cada 20 minutos, durante las horas de las 9 y 11 de la mañana y ' +
        'de la 1, las 3 y las 5 de la tarde'],
      ['* 9-17 * * *',
        'cada minuto de las 9 de la mañana a las 5:59 de la tarde'],
      ['* 0-5 * * *',
        'cada minuto de medianoche a las 5:59 de la madrugada'],
      ['0-30 9-17 * * *',
        'cada minuto del 0 al 30, de las 9 de la mañana a las 5 de la tarde'],
      ['0 */9 * * *',
        'todos los días a medianoche, a las 9 de la mañana y ' +
        'a las 6 de la tarde'],
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
        'los domingos, lunes, miércoles y viernes al mediodía'],
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
      // ya-sea frame with month fronted once and month-less arms.
      ['0 12 1 6-9 MON-FRI',
        'de junio a septiembre al mediodía, ya sea el día 1 o de lunes a viernes'],
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
