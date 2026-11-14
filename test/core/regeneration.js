import chai from 'chai';
import {compareRenderers} from '../../tooling/scripts/regeneration.mjs';

const {expect} = chai;

// A language's artifacts are sufficient when a second renderer, built
// from them by someone who never saw the first, says the same things.
describe('compareRenderers:', function() {
  it('counts the rows two renderers word alike and lists the rest',
    function() {
      const result = compareRenderers(
        function first(pattern) {
          return pattern === 'a' ? 'one' : 'two';
        },
        function second(pattern) {
          return pattern === 'a' ? 'one' : 'deux';
        },
        [['a'], ['b']]
      );

      expect(result).to.include({same: 1, total: 2});
      expect(result.different).to.deep.equal(
        [{first: 'two', pattern: 'b', second: 'deux'}]);
    });

  it('records a renderer that throws as a difference', function() {
    const result = compareRenderers(
      function first() {
        return 'fine';
      },
      function second() {
        throw new Error('no such device');
      },
      [['a']]
    );

    expect(result.same).to.equal(0);
    expect(result.different[0].second).to.equal('threw: no such device');
  });

  it('passes a row\'s options to both renderers', function() {
    const seen = [];

    function record(pattern, options) {
      seen.push(options);

      return pattern;
    }

    compareRenderers(record, record, [['a', 'ignored', {years: true}]]);
    expect(seen).to.deep.equal([{years: true}, {years: true}]);
  });
});
