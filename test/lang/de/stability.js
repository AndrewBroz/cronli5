import chai from 'chai';
import {
  DATES, TIMES, WEEKDAYS, makeStability
} from '../../../tooling/scripts/stability-engine.mjs';
import {de} from '../../../tooling/scripts/stability/de.mjs';

const {expect} = chai;
const {checkPair} = makeStability(de);

// KNOWN arm instability, pinned as expected failures: a standalone `2/2`
// date enumerates its 15 fires ("am 2., 4., … und 30.") while the union arm
// reads the parity class ("an jedem geraden Tag des Monats") — the same
// field at two fidelities. The odd set is consistent (cadence ↔ parity, a
// declared fold); only the even set lacks a standalone cadence/parity form.
// Fixing it is a German corpus decision (see docs/backlog.md); when it
// lands, these it.fails flip and this set empties.
const KNOWN_UNSTABLE_DATES = new Set(['2/2']);

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
