import chai from 'chai';
import {
  DATES, TIMES, WEEKDAYS, checkPair
} from '../../../tooling/scripts/stability.mjs';

const {expect} = chai;

// Relational invariants over generated pattern triples — the dual of the
// point-wise corpus. An overlay is precisely a change that keeps corpus rows
// green while breaking a relation (an arm switching from cadence to
// enumeration, a time body rewritten under a day-field change, a weekday
// order forked between contexts); these fail it mechanically. The report
// form is tooling/scripts/stability.mjs.
describe('en stability invariants:', function() {
  TIMES.forEach(function eachTime(time) {
    DATES.forEach(function eachDate(date) {
      WEEKDAYS.forEach(function eachWeekday(weekday) {
        it(time.join(' ') + ' ' + date + ' * ' + weekday, function() {
          expect(checkPair(time, date, weekday)).to.deep.equal([]);
        });
      });
    });
  });
});
