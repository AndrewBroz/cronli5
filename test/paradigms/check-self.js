import chai from 'chai';
import {oracleProblems} from './check.js';

const {expect} = chai;
const GRID = [{pattern: '0 9 * * *'}, {pattern: '0 8 * * *'}];

// The oracle is itself under test: these are the checks a language's
// paradigm rows must pass before any renderer is built against them.
describe('paradigm oracle checks:', function() {
  it('accepts rows that cover the grid consistently', function() {
    expect(oracleProblems(
      [['0 9 * * *', 'at 9'], ['0 8 * * *', 'at 8']], GRID)).to.deep.equal([]);
  });

  it('reports a duplicate, a missing row and a stray row', function() {
    const found = oracleProblems(
      [['0 9 * * *', 'a'], ['0 9 * * *', 'b'], ['0 7 * * *', 'c']], GRID);

    expect(found).to.have.length(3);
  });

  it('reports equal schedules that are worded differently', function() {
    const grid = [{pattern: '*/2 * * * *'}, {pattern: '0/2 * * * *'}];
    const found = oracleProblems(
      [['*/2 * * * *', 'every other minute'],
        ['0/2 * * * *', 'every two minutes']], grid);

    expect(found).to.have.length(1);
  });
});
