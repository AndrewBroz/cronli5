import chai from 'chai';
import {prepare} from '../../src/core/index.js';
import {
  allRows, families, heldOutPatterns, heldOutRows, pairs, visiblePatterns,
  visibleRows
} from './grid.js';

const {expect} = chai;
const FIELDS = ['second', 'minute', 'hour', 'date', 'month', 'weekday'];

// A grid pattern as six fields; a five-field pattern has the implied
// zero second.
function fieldsOf(pattern) {
  const parts = pattern.split(' ');

  return parts.length === 6 ? parts : ['0', ...parts];
}

// The paradigm grid is language-independent: families of patterns that
// vary one field while the rest hold. These are its structural guarantees.
describe('paradigm grid:', function() {
  it('has one family per context and field', function() {
    expect(families).to.have.length(24);
  });

  it('varies exactly one field per row', function() {
    families.forEach(function check(family) {
      const base = fieldsOf(family.context);

      family.rows.forEach(function oneField(row) {
        const changed = fieldsOf(row.pattern)
          .map(function indexIfChanged(value, index) {
            return value === base[index] ? -1 : index;
          })
          .filter(function isChanged(index) {
            return index >= 0;
          });

        expect(changed, row.pattern).to.have.length(1);
        expect(FIELDS[changed[0]], row.pattern).to.equal(family.field);
      });
    });
  });

  it('holds only patterns the core accepts', function() {
    allRows().forEach(function accepted(row) {
      expect(function run() {
        prepare(row.pattern, {seconds: false, years: false});
      }, row.pattern).to.not.throw();
    });
  });

  it('marks the rows holding a Quartz token', function() {
    allRows().forEach(function marked(row) {
      expect(row.quartz, row.pattern).to.equal((/[LW#]/u).test(row.pattern));
    });
  });

  it('splits rows into disjoint visible and held-out sets', function() {
    const total = allRows().length;

    expect(visibleRows().length + heldOutRows().length).to.equal(total);
    expect(heldOutRows().length / total).to.be.within(0.55, 0.7);
  });

  it('pairs each context with its rows and each row with the next',
    function() {
      const clockHours = families.find(function byId(family) {
        return family.id === 'clock/hour';
      });

      expect(pairs()).to.deep.include(['0 9 * * *', '0 * * * *']);
      expect(pairs()).to.deep.include(
        [clockHours.rows[0].pattern, clockHours.rows[1].pattern]);
    });

  it('gives each distinct pattern to exactly one side of the split',
    function() {
      const visible = visiblePatterns();
      const heldOut = heldOutPatterns();
      const distinct = new Set(allRows().map(function patternOf(row) {
        return row.pattern;
      }));

      expect(new Set(visible).size).to.equal(visible.length);
      expect(visible.length + heldOut.length).to.equal(distinct.size);
      heldOut.forEach(function notVisible(pattern) {
        expect(visible).to.not.include(pattern);
      });

      // Visible in one family is visible everywhere: a builder that has
      // seen a pattern cannot be judged on it.
      visibleRows().forEach(function isVisible(row) {
        expect(visible).to.include(row.pattern);
      });
    });
});
