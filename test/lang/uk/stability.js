import chai from 'chai';
import {
  DATES, TIMES, WEEKDAYS, makeStability
} from '../../../tooling/scripts/stability-engine.mjs';
import {uk} from '../../../tooling/scripts/stability/uk.mjs';

const {expect} = chai;
const {checkPair} = makeStability(uk);

// Relational invariants over generated pattern triples — the dual of the
// point-wise corpus (see the engine's header). uk ships one voice (no
// dialect axis — notes.md "Anchors"), so the matrix runs only the default.
describe('uk stability invariants:', function() {
  uk.dialects.forEach(function eachDialect(dialect) {
    TIMES.forEach(function eachTime(time) {
      DATES.forEach(function eachDate(date) {
        WEEKDAYS.forEach(function eachWeekday(weekday) {
          it((dialect ?? 'uk') + ' ' + time.join(' ') + ' ' + date + ' * ' +
            weekday, function() {
            expect(checkPair(time, date, weekday, dialect))
              .to.deep.equal([]);
          });
        });
      });
    });
  });
});
