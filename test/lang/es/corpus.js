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
      ['0 22-2 * * *', 'cada hora de las 22:00 a las 02:00'],
      ['0 9-20,22 * * *',
        'cada hora de las 09:00 a las 20:00 y también a las 22:00'],
      ['* 1 * * *', 'cada minuto de la 01:00 a la 01:59']
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
      ['0 9,17 * * *',
        'todos los días a las 9 de la mañana y 5 de la tarde']
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
        'de junio a septiembre a medianoche, ya sea el día 1 o un viernes'],
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
      ['1 1 * * * *', 'en el minuto 1 y el segundo 1 de cada hora']
    ]);
  });

  describe('patrones compuestos', function() {
    run([
      ['*/15 9-17 * * *',
        'cada 15 minutos de las 9 de la mañana a las 5:45 de la tarde'],
      ['* 9 * * *', 'cada minuto de las 9 a las 9:59 de la mañana'],
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
        'cada minuto del 0 al 30, ' +
        'a las 9 de la mañana y 5 de la tarde'],
      ['0-30 */2 * * *',
        'cada minuto del 0 al 30, cada dos horas']
    ], ampm);
  });

  describe('segundos compuestos', function() {
    run([
      ['*/15 30 9 * * *',
        'cada 15 segundos, todos los días a las 9:30 de la mañana'],
      ['15 30 9 * * *', 'todos los días a las 9:30:15 de la mañana']
    ], ampm);
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
    run([
      ['59 23 31 12 5',
        'en diciembre a las 11:59 de la noche, ya sea el día 31 o un viernes'],
      ['59 23 31 12 5',
        'en diciembre a las 23:59, ya sea el día 31 o un viernes',
        {ampm: false}]
    ], ampm);
  });

  describe('pasos con desfase y acotados', function() {
    run([
      ['5/15 * * * *',
        'cada 15 minutos a partir del minuto 5 de cada hora'],
      ['40/15 * * * *', 'en los minutos 40 y 55 de cada hora'],
      ['0-30/10 * * * *', 'en los minutos 0, 10, 20 y 30 de cada hora'],
      ['*/7 * * * *', 'cada siete minutos de cada hora'],
      ['*/35 * * * *', 'en los minutos 0 y 35 de cada hora'],
      ['0 2/5 * * *',
        'cada cinco horas a partir de las 2 de la madrugada'],
      ['0 8-18/4 * * *',
        'a las 8 de la mañana, al mediodía y a las 4 de la tarde'],
      ['0 0/7 * * *', 'cada siete horas desde medianoche'],
      ['* */2 * * *', 'cada minuto, durante las horas pares'],
      ['0 12 */2 * *', 'cada dos días del mes al mediodía'],
      ['0 12 5/3 * *', 'cada tres días del mes desde el 5 al mediodía']
    ], ampm);
  });

  describe('segundos independientes y compuestos', function() {
    run([
      ['0-30 * * * * *', 'cada segundo del 0 al 30 de cada minuto'],
      ['5,10 * * * * *', 'en los segundos 5 y 10 de cada minuto'],
      ['*/15 30 * * * *',
        'cada 15 segundos, en el minuto 30 de cada hora'],
      ['* 30 9 * * *',
        'cada segundo, todos los días a las 9:30 de la mañana'],
      // A wildcard minute under a restricted hour: the hour window must
      // survive (it once collapsed to a bare "cada segundo"). Fuzzer-found.
      ['* * 9 * * *',
        'cada segundo, cada minuto de las 9 a las 9:59 de la mañana'],
      ['*/15 * 9-17 * * *',
        'cada 15 segundos, cada minuto de las 9 de la mañana ' +
        'a las 5:59 de la tarde'],
      ['0-30 * 9 * * *',
        'cada segundo del 0 al 30 de cada minuto, ' +
        'cada minuto de las 9 a las 9:59 de la mañana']
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
        'cada minuto del 0 al 30, ' +
        'de las 9 de la mañana a las 5:30 de la tarde'],
      ['0 */9 * * *',
        'a medianoche, a las 9 de la mañana y a las 6 de la tarde'],
      ['0-30 9-20,22 * * *',
        'cada minuto del 0 al 30, ' +
        'de las 9 de la mañana a las 8 de la noche y también a las 10 de la noche'],
      ['* 1,6/3 * * *',
        'cada minuto de la 1 a la 1:59 de la madrugada y ' +
        'de las 6 a las 6:59 de la mañana, de las 9 a las 9:59 de la ' +
        'mañana, del mediodía a las 12:59 de la tarde, de las 3 a las ' +
        '3:59 de la tarde, de las 6 a las 6:59 de la tarde y de las 9 ' +
        'a las 9:59 de la noche'],
      ['*/15 9-17 * * *', 'cada 15 minutos de las 09:00 a las 17:45',
        {ampm: false}],
      ['*/15 * 13 * 5',
        'cada 15 minutos el 13 de cada mes o los viernes'],
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
      // Non-RULE-E restricted-month OR union: multi-token weekday bypasses
      // the ya-sea frame and keeps the old dateOrWeekday path.
      ['0 12 1 6-9 MON-FRI',
        'el 1 de cada mes o de lunes a viernes, de junio a septiembre ' +
        'al mediodía'],
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
      // es-US: 12-hour with the English AM/PM meridiem (no "de la").
      ['30 9 * * *', 'todos los días a las 9:30 AM', {dialect: 'es-US'}],
      ['0 22 * * *', 'todos los días a las 10 PM', {dialect: 'es-US'}],
      // es-ES: the RAE-anchored 24-hour default (same as neutral `es`).
      ['30 9 * * *', 'todos los días a las 09:30', {dialect: 'es-ES'}]
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
  it('usa "a la" singular para la una en una lista', function() {
    expect(cronli5('0 1,13 * * *', {lang: es}))
      .to.equal('todos los días a la 01:00 y a las 13:00');
    expect(cronli5('0 1,13 * * *', {lang: es, ...ampm}))
      .to.equal('todos los días a la 1 de la madrugada y a la 1 de la tarde');
  });

  it('usa el reloj del dialecto en la lista de horas, no 24 h', function() {
    expect(cronli5('*/15 14,18,20,22 * * *', {dialect: 'es-MX', lang: es}))
      .to.not.include('las 14');
  });
});
