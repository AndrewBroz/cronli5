import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import es from '../../../src/lang/es/index.js';

const {expect} = chai;

// Spanish minimal pairs: the language's known hazards as targeted probes
// (docs/i18n-design.md §4, pass 4). Each pair isolates one grammatical
// trap. Spanish defaults to the 24-hour clock (`reads`); the 12-hour
// day-period forms are probed explicitly with `reads12`.

function reads(pattern, expected) {
  it(pattern + ' → ' + expected, function() {
    expect(cronli5(pattern, {lang: es})).to.equal(expected);
  });
}

function reads12(pattern, expected) {
  it(pattern + ' (ampm) → ' + expected, function() {
    expect(cronli5(pattern, {lang: es, ampm: true})).to.equal(expected);
  });
}

describe('Español (es) — pares mínimos:', function() {
  describe('reloj de 24 horas por defecto', function() {
    reads('0 9 * * *', 'todos los días a las 09:00');
    reads('30 17 * * *', 'todos los días a las 17:30');
    reads('0 0 * * *', 'todos los días a las 00:00');
    reads('0 12 * * *', 'todos los días a las 12:00');
  });

  describe('artículo singular solo con la 1 (24 h y 12 h)', function() {
    reads('0 1 * * *', 'todos los días a la 01:00');
    reads('0 13 * * *', 'todos los días a las 13:00');
    reads('0 2 * * *', 'todos los días a las 02:00');
    reads12('0 13 * * *', 'todos los días a la 1 de la tarde');
    reads12('0 14 * * *', 'todos los días a las 2 de la tarde');
  });

  describe('la hora completa conserva el artículo singular de la 1', function() {
    reads('* 1 * * *', 'cada minuto de la hora de la 01:00');
  });

  describe('plural de los días: -s invariable, sábado/domingo en -s', function() {
    reads('0 12 * * MON', 'los lunes a las 12:00');
    reads('0 12 * * SAT', 'los sábados a las 12:00');
    reads('0 12 * * SUN', 'los domingos a las 12:00');
    reads12('0 12 * * MON', 'los lunes al mediodía');
    reads12('0 12 * * SAT', 'los sábados al mediodía');
    reads12('0 12 * * SUN', 'los domingos al mediodía');
  });

  describe('mediodía y medianoche solo en punto (12 h)', function() {
    reads12('0 12 * * *', 'todos los días al mediodía');
    reads12('30 12 * * *', 'todos los días a las 12:30 de la tarde');
    reads12('0 0 * * *', 'todos los días a medianoche');
    reads12('30 0 * * *', 'todos los días a las 12:30 de la noche');
  });

  describe('franjas del día (12 h)', function() {
    reads12('0 5 * * *', 'todos los días a las 5 de la madrugada');
    reads12('0 6 * * *', 'todos los días a las 6 de la mañana');
    reads12('0 19 * * *', 'todos los días a las 7 de la tarde');
    reads12('0 20 * * *', 'todos los días a las 8 de la noche');
  });

  describe('números pequeños en letras', function() {
    reads('*/2 * * * *', 'cada dos minutos');
    reads('0 */2 * * *', 'cada dos horas');
    reads('*/15 * * * *', 'cada 15 minutos');
  });
});
