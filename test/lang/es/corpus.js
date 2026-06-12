import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import es from '../../../src/lang/es/index.js';

const {expect} = chai;

// The Spanish corpus: the reviewed expectation suite that makes the module
// trustworthy (docs/i18n-design.md §2.4). Each entry is exact output.

function run(cases) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...values[2] || {}, lang: es};

    describe(JSON.stringify(pattern), function() {
      it('se lee "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

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

  describe('horas del día', function() {
    run([
      ['0 12 * * *', 'todos los días al mediodía'],
      ['0 0 * * *', 'todos los días a medianoche'],
      ['0 9 * * *', 'todos los días a las 9 de la mañana'],
      ['30 9 * * *', 'todos los días a las 9:30 de la mañana'],
      ['0 13 * * *', 'todos los días a la 1 de la tarde'],
      ['0 1 * * *', 'todos los días a la 1 de la madrugada'],
      ['0 22 * * *', 'todos los días a las 10 de la noche'],
      ['0 9,17 * * *',
        'todos los días a las 9 de la mañana y a las 5 de la tarde'],
      ['30 17 * * *', 'todos los días a las 17:30', {ampm: false}]
    ]);
  });

  describe('días de la semana', function() {
    run([
      ['0 9 * * MON', 'todos los lunes a las 9 de la mañana'],
      ['30 9 * * MON-FRI', 'de lunes a viernes a las 9:30 de la mañana'],
      ['0 14 * * 1,3,5',
        'todos los lunes, miércoles y viernes a las 2 de la tarde'],
      ['*/15 * * * MON', 'cada 15 minutos los lunes'],
      ['*/15 * * * MON-FRI', 'cada 15 minutos de lunes a viernes'],
      ['0 0 * * FRI-MON', 'de viernes a lunes a medianoche']
    ]);
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
        'todos los días de noviembre a febrero al mediodía']
    ]);
  });

  describe('minutos y segundos anclados', function() {
    run([
      ['30 * * * *', 'en el minuto 30 de cada hora'],
      ['0,30 * * * *', 'en los minutos 0 y 30 de cada hora'],
      ['0-29 * * * *', 'cada minuto del 0 al 29 de cada hora'],
      ['15 * * * * *', 'en el segundo 15 de cada minuto'],
      ['15 30 * * * *', 'en el minuto 30 y segundo 15 de cada hora']
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
        'cada minuto del 0 al 30 de cada hora, ' +
        'a las 9 de la mañana y a las 5 de la tarde'],
      ['0-30 */2 * * *',
        'cada minuto del 0 al 30 de cada hora, cada dos horas']
    ]);
  });

  describe('segundos compuestos', function() {
    run([
      ['*/15 30 9 * * *',
        'cada 15 segundos, todos los días a las 9:30 de la mañana'],
      ['15 30 9 * * *', 'todos los días a las 9:30:15 de la mañana']
    ]);
  });

  describe('fichas Quartz', function() {
    run([
      ['0 0 L * *', 'el último día del mes a medianoche'],
      ['0 0 * * 5L', 'el último viernes del mes a medianoche'],
      ['0 0 * * 1#2', 'el segundo lunes del mes a medianoche'],
      ['0 0 15W * *', 'el día laborable más cercano al 15 a medianoche']
    ]);
  });

  describe('años', function() {
    run([
      ['0 0 12 25 12 * 2030', 'el 25 de diciembre de 2030 al mediodía'],
      ['0 0 9 * * * 2030', 'todos los días a las 9 de la mañana en 2030']
    ]);
  });

  describe('fecha o día de la semana', function() {
    run([
      ['59 23 31 12 5',
        'el 31 de diciembre o los viernes de diciembre ' +
        'a las 11:59 de la noche']
    ]);
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
      ['* */2 * * *', 'cada minuto, cada dos horas'],
      ['0 12 */2 * *', 'cada dos días del mes al mediodía'],
      ['0 12 5/3 * *', 'cada tres días del mes desde el 5 al mediodía']
    ]);
  });

  describe('segundos independientes y compuestos', function() {
    run([
      ['0-30 * * * * *', 'cada segundo del 0 al 30 de cada minuto'],
      ['5,10 * * * * *', 'en los segundos 5 y 10 de cada minuto'],
      ['*/15 30 * * * *',
        'cada 15 segundos, en el minuto 30 de cada hora'],
      ['* 30 9 * * *',
        'cada segundo, todos los días a las 9:30 de la mañana']
    ]);
  });

  describe('formas compactas y listas mixtas', function() {
    run([
      ['30 9-20,22 * * *',
        'todos los días de las 9:30 de la mañana a las 8:30 de la noche ' +
        'y a las 10:30 de la noche'],
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
    ]);
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
    ]);
  });

  describe('cobertura de ramas', function() {
    run([
      ['15 0,30 * * * *',
        'en el segundo 15 de cada minuto, ' +
        'en los minutos 0 y 30 de cada hora'],
      ['*/15 */2 * * *', 'cada 15 minutos, cada dos horas'],
      ['* 9-17 * * *',
        'cada minuto de las 9 de la mañana a las 5:59 de la tarde'],
      ['* 0-5 * * *',
        'cada minuto de medianoche a las 5:59 de la madrugada'],
      ['0-30 9-17 * * *',
        'cada minuto del 0 al 30 de cada hora, ' +
        'de las 9 de la mañana a las 5:30 de la tarde'],
      ['0 */9 * * *',
        'a medianoche, a las 9 de la mañana y a las 6 de la tarde'],
      ['0-30 9-20,22 * * *',
        'cada minuto del 0 al 30 de cada hora, ' +
        'de las 9 de la mañana a las 8 de la noche y a las 10 de la noche'],
      ['* 1,6/3 * * *',
        'cada minuto de la 1 a la 1:59 de la madrugada y ' +
        'de las 6 a las 6:59 de la mañana, de las 9 a las 9:59 de la ' +
        'mañana, del mediodía a las 12:59 de la tarde, de las 3 a las ' +
        '3:59 de la tarde, de las 6 a las 6:59 de la tarde y de las 9 ' +
        'a las 9:59 de la noche'],
      ['*/15 9-17 * * *', 'cada 15 minutos de las 9:00 a las 17:45',
        {ampm: false}],
      ['*/15 * 13 * 5',
        'cada 15 minutos el 13 de cada mes o los viernes'],
      ['*/15 * * 6 *', 'cada 15 minutos en junio'],
      ['0 12 * * 0,1/2',
        'los domingos y los lunes, miércoles y viernes al mediodía'],
      ['0 12 * 1,6/3 *',
        'todos los días de enero y junio, septiembre y diciembre ' +
        'al mediodía'],
      ['0,30/15 * * * *', 'en los minutos 0 y 30/15 de cada hora'],
      ['*/5 * * * *', 'cada 5 minutos', {short: true}],
      ['0 12 * * 7', 'todos los domingos al mediodía'],
      ['5 9 * * *', 'todos los días a las 9:05 de la mañana']
    ]);
  });

  describe('dialecto personalizado', function() {
    run([
      ['30 17 * * *', 'todos los días a las 17.30',
        {ampm: false, dialect: {sep: '.'}}]
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
