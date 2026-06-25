import chai from 'chai';
import {
  DISTINCT, EQUIVALENT, classifyEquivalent, irKey
} from '../../tooling/scripts/metamorphic.mjs';

const {expect} = chai;

// The IR is the canonical semantic form (docs/i18n-design.md): crons that mean
// the same schedule must analyze() to a deep-equal IR, so the equivalence is
// enforced once in the core rather than re-derived in every renderer. Each row
// of the relation table is a discovered rule, guarded here forever. The
// explorer that prints the full report is tooling/scripts/metamorphic.mjs.
describe('metamorphic invariants:', function() {
  describe('equivalent crons analyze to a deep-equal IR', function() {
    EQUIVALENT.forEach(function each(row) {
      it(row[0], function() {
        const verdict = classifyEquivalent(row[1], row[2]);

        expect(verdict.ok, verdict.status).to.equal(true);
      });
    });
  });

  describe('distinct schedules analyze to distinct IR', function() {
    DISTINCT.forEach(function each(row) {
      it(row[0], function() {
        expect(irKey(row[1])).to.not.equal(irKey(row[2]));
      });
    });
  });
});
