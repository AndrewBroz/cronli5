import chai from 'chai';
import {comparison} from '../../tooling/scripts/compare-baseline.mjs';

const {expect} = chai;

function measures(lines, median, violations) {
  return {
    failures: 0,
    grid: {median, p90: median},
    singleCharacter: {
      equivalentViolations: new Array(violations).fill({}),
      median,
      p90: median
    },
    size: {branches: 10, lines}
  };
}

// The comparison sets a rebuilt renderer beside the one it replaced.
describe('compare-baseline:', function() {
  it('lays each measure out as before and now', function() {
    const rows = comparison(measures(3000, 0.5, 309), measures(2000, 0.25, 0));

    expect(rows[0]).to.deep.equal(['Lines', 3000, 2000]);
    expect(rows).to.deep.include(['Grid, median change', '50%', '25%']);
    expect(rows).to.deep.include(
      ['Equal schedules worded differently', 309, 0]);
  });
});
