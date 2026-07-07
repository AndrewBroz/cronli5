import chai from 'chai';
import {
  DATES, TIMES, WEEKDAYS, makeStability
} from '../../../tooling/scripts/stability-engine.mjs';
import {de} from '../../../tooling/scripts/stability/de.mjs';

const {expect} = chai;
const {checkPair} = makeStability(de);

// Arm instabilities pinned as expected failures — empty since the `2/2`
// even-parity fix (the standalone date now speaks the union arm's parity
// class); the mechanism stays for the next real finding.
const KNOWN_UNSTABLE_DATES = new Set();

// Relational invariants over generated pattern triples — the dual of the
// point-wise corpus (see the engine's header).
describe('de stability invariants:', function() {
  de.dialects.forEach(function eachDialect(dialect) {
    TIMES.forEach(function eachTime(time) {
      DATES.forEach(function eachDate(date) {
        WEEKDAYS.forEach(function eachWeekday(weekday) {
          const label = (dialect ?? 'de') + ' ' + time.join(' ') + ' ' +
            date + ' * ' + weekday;
          const spec = KNOWN_UNSTABLE_DATES.has(date) ? it.fails : it;

          spec(label, function() {
            expect(checkPair(time, date, weekday, dialect))
              .to.deep.equal([]);
          });
        });
      });
    });
  });
});
