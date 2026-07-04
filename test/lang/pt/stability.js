import chai from 'chai';
import {
  DATES, TIMES, WEEKDAYS, makeStability
} from '../../../tooling/scripts/stability-engine.mjs';
import {pt} from '../../../tooling/scripts/stability/pt.mjs';

const {expect} = chai;
const {checkPair} = makeStability(pt);

// Relational invariants over generated pattern triples — the dual of the
// point-wise corpus (see the engine's header). The matrix runs per dialect:
// grammar is dialect-independent, so every relation the default holds must
// hold in every shipped dialect too.
describe('pt stability invariants:', function() {
  pt.dialects.forEach(function eachDialect(dialect) {
    TIMES.forEach(function eachTime(time) {
      DATES.forEach(function eachDate(date) {
        WEEKDAYS.forEach(function eachWeekday(weekday) {
          it((dialect ?? 'pt') + ' ' + time.join(' ') + ' ' + date + ' * ' +
            weekday, function() {
            expect(checkPair(time, date, weekday, dialect))
              .to.deep.equal([]);
          });
        });
      });
    });
  });
});
