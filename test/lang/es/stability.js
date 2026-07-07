import chai from 'chai';
import {
  DATES, TIMES, WEEKDAYS, makeStability
} from '../../../tooling/scripts/stability-engine.mjs';
import {es} from '../../../tooling/scripts/stability/es.mjs';

const {expect} = chai;
const {checkPair} = makeStability(es);

// Relational invariants over generated pattern triples — the dual of the
// point-wise corpus (see the engine's header). The matrix runs per dialect:
// grammar is dialect-independent, so every relation the default holds must
// hold in es-MX and es-US too.
describe('es stability invariants:', function() {
  es.dialects.forEach(function eachDialect(dialect) {
    TIMES.forEach(function eachTime(time) {
      DATES.forEach(function eachDate(date) {
        WEEKDAYS.forEach(function eachWeekday(weekday) {
          it((dialect ?? 'es') + ' ' + time.join(' ') + ' ' + date + ' * ' +
            weekday, function() {
            expect(checkPair(time, date, weekday, dialect))
              .to.deep.equal([]);
          });
        });
      });
    });
  });
});
