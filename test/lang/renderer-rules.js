import chai from 'chai';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {countBranches} from '../../tooling/scripts/baseline.mjs';

const {expect} = chai;
const LANG_ROOT = new URL('../../src/lang/', import.meta.url);

// A renderer built from a lexicon chooses among the core's candidate
// descriptions. It may not go back to the pattern's text or shape, which
// is how a renderer comes to treat equal schedules differently.
const FORBIDDEN = /\.(?:pattern|shapes|segments|plan)\b/u;

// Every directory under the language root that holds a lexicon and a
// renderer built from it, with the language directory it belongs to. A
// language whose artifacts are written but whose renderer is not yet built
// has nothing to check.
function rebuiltRenderers() {
  return readdirSync(LANG_ROOT).flatMap(function perLanguage(code) {
    const home = new URL(`${code}/`, LANG_ROOT);

    return [home, new URL('next/', home)].filter(function isBuilt(dir) {
      return existsSync(new URL('lexicon.ts', dir)) &&
        existsSync(new URL('index.ts', dir));
    }).map(function describeIt(dir) {
      return {code, dir, home};
    });
  });
}

function sourcesIn(dir) {
  return readdirSync(dir).filter(function isSource(name) {
    return name.endsWith('.ts');
  }).map(function read(name) {
    return {name, text: readFileSync(new URL(name, dir), 'utf8')};
  });
}

describe('rules for a renderer built from a lexicon:', function() {
  const renderers = rebuiltRenderers();

  if (renderers.length === 0) {
    it('has no such renderer to check yet', function() {
      expect(renderers).to.deep.equal([]);
    });
  }

  renderers.forEach(function each(renderer) {
    const sources = sourcesIn(renderer.dir);

    it(`${renderer.code} never reads the pattern, its shapes or a plan`,
      function() {
        sources.forEach(function clean(source) {
          expect(FORBIDDEN.test(source.text), source.name).to.equal(false);
        });
      });

    it(`${renderer.code} stays within its branch budget`, function() {
      const status = JSON.parse(
        readFileSync(new URL('status.json', renderer.home), 'utf8'));
      const branches = sources.reduce(function total(sum, source) {
        return sum + countBranches(source.text);
      }, 0);

      // The budget is recorded once the first build shows what is
      // achievable; until then there is nothing to hold the count to.
      expect(branches).to.be.at.most(status.branchBudget || Infinity);
    });
  });
});
