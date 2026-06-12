import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import es from '../../../src/lang/es/index.js';

const {expect} = chai;

// Spanish minimal pairs: the language's known hazards as targeted probes
// (docs/i18n-design.md §4, pass 4). Each pair isolates one grammatical
// trap.

function reads(pattern, expected) {
  it(pattern + ' → ' + expected, function() {
    expect(cronli5(pattern, {lang: es})).to.equal(expected);
  });
}

describe('Español (es) — pares mínimos:', function() {
  describe('artículo singular con la 1', function() {
    reads('0 13 * * *', 'todos los días a la 1 de la tarde');
    reads('0 14 * * *', 'todos los días a las 2 de la tarde');
  });

  describe('plural de los días: -s invariable, sábado/domingo en -s', function() {
    reads('0 12 * * MON', 'todos los lunes al mediodía');
    reads('0 12 * * SAT', 'todos los sábados al mediodía');
    reads('0 12 * * SUN', 'todos los domingos al mediodía');
  });

  describe('mediodía y medianoche solo en punto', function() {
    reads('0 12 * * *', 'todos los días al mediodía');
    reads('30 12 * * *', 'todos los días a las 12:30 de la tarde');
    reads('0 0 * * *', 'todos los días a medianoche');
    reads('30 0 * * *', 'todos los días a las 12:30 de la noche');
  });

  describe('franjas del día', function() {
    reads('0 5 * * *', 'todos los días a las 5 de la madrugada');
    reads('0 6 * * *', 'todos los días a las 6 de la mañana');
    reads('0 19 * * *', 'todos los días a las 7 de la tarde');
    reads('0 20 * * *', 'todos los días a las 8 de la noche');
  });

  describe('números pequeños en letras', function() {
    reads('*/2 * * * *', 'cada dos minutos');
    reads('0 */2 * * *', 'cada dos horas');
    reads('*/15 * * * *', 'cada 15 minutos');
  });
});
