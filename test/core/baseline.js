import chai from 'chai';
import {allRows} from '../paradigms/grid.js';
import {baseline} from '../../tooling/scripts/baseline.mjs';

const {expect} = chai;

// Tens of thousands of renderings, slower still under coverage.
const SLOW_TEST_MS = 60000;

// A baseline records how a renderer measures today, so its replacement can
// be compared on the same terms.
describe('baseline:', function() {
  it('captures size, both scores and every grid rendering', async function() {
    const captured = await baseline('en');

    expect(captured.size.lines).to.be.above(1000);
    expect(captured.size.branches).to.be.above(50);
    expect(captured.singleCharacter.pairs).to.be.above(1000);
    expect(captured.grid.pairs).to.be.above(200);
    expect(captured.failures).to.equal(0);
    expect(captured.renderings).to.have.length(allRows().length);
    captured.renderings.forEach(function nonEmpty(row) {
      expect(row.text, row.pattern).to.be.a('string').and.not.equal('');
    });
  }, SLOW_TEST_MS);
});
