import chai from 'chai';
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {corpusCell, coreCells} from '../../scripts/core-set.mjs';

const {expect} = chai;

// The fixed core pattern set (scripts/core-set.mjs) is the contract every
// language corpus must cover. This gate enforces it:
//   - a NEW language at beta/stable must cover ALL core cells;
//   - the existing languages carry a documented coverage debt (their corpora
//     predate the core set), grandfathered to a baseline they may not regress
//     below — a ratchet toward full coverage;
//   - scaffolds are exempt (incomplete by definition).
// Coverage is measured in language-neutral IR cells, so a language's own
// representative patterns count — it need not test the exact core strings.

const CORE = JSON.parse(readFileSync('test/core/core-set.json', 'utf8'));
const CELLS = coreCells(CORE);

// Grandfathered debt: minimum core cells each pre-core-set language must keep
// covering (of CELLS.size total). Raise toward full as corpora are expanded;
// the goal is to delete this map (every language at full coverage).
const BASELINE = {de: 44, en: 76, es: 53, fi: 50};

// String patterns a language's corpus tests (first quoted token of each entry;
// array/object-form patterns are a rare minority and not in the core set).
function corpusPatterns(code) {
  const found = new Set();
  const re = /\[\s*'((?:[^'\\]|\\.)*)'/gu;

  function walk(dir) {
    readdirSync(dir).forEach(function each(name) {
      const path = join(dir, name);

      if (statSync(path).isDirectory()) {
        walk(path);
      }
      else if (name.endsWith('.js')) {
        const text = readFileSync(path, 'utf8');

        for (let m = re.exec(text); m !== null; m = re.exec(text)) {
          if ((/^[\d*/,\- A-Z?LW#]+$/u).test(m[1]) &&
              (/[\d*]/u).test(m[1])) {
            found.add(m[1]);
          }
        }
      }
    });
  }

  walk(join('test/lang', code));

  return [...found];
}

function coveredCells(code) {
  const covered = new Set();

  corpusPatterns(code).forEach(function hit(pattern) {
    const cell = corpusCell(pattern);

    if (cell && CELLS.has(cell)) {
      covered.add(cell);
    }
  });

  return covered;
}

describe('Core pattern-set coverage:', function() {
  // Enumerate shipped languages — those carrying a status.json marker — not
  // every directory on disk. A language is built incrementally (notes ->
  // corpus -> renderer), so src/lang/<code>/ briefly exists with only notes.md
  // and no status.json; such an in-progress dir is not yet shipped and has no
  // corpus to cover, so it is skipped. A dir that ships (has status.json) is
  // still fully enforced below.
  const codes = readdirSync('src/lang', {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((code) => existsSync(join('src/lang', code, 'status.json')));

  codes.forEach(function each(code) {
    const statusPath = join('src/lang', code, 'status.json');
    const status = JSON.parse(readFileSync(statusPath, 'utf8')).status;

    if (status === 'scaffold') {
      it(code + ' is a scaffold — exempt from the core gate');

      return;
    }

    it(code + ' tests @reboot and the lenient fallback', function() {
      const dir = join('test/lang', code);
      const text = readdirSync(dir, {recursive: true})
        .filter((name) => String(name).endsWith('.js'))
        .map((name) => readFileSync(join(dir, String(name)), 'utf8'))
        .join('\n');

      expect(text, code + ' must test @reboot').to.include('@reboot');
      expect(text, code + ' must test lenient fallback')
        .to.match(/lenient|reserva|无法识别|unlesbar|unrecogni|tunnista/u);
    });

    if (!(code in BASELINE)) {
      it(code + ' (new) covers every core cell', function() {
        const missing = CELLS.size - coveredCells(code).size;

        expect(missing, code + ' is missing ' + missing + ' core cells')
          .to.equal(0);
      });

      it(code + ' (new) tests every value class, variant, and macro',
        function() {
          const tested = new Set(corpusPatterns(code));
          const explicit = CORE.valueClasses.concat(CORE.variants)
            .map((entry) => entry.pattern)
            .filter((pattern) => !tested.has(pattern));

          expect(explicit, 'untested: ' + explicit.join('; '))
            .to.have.length(0);

          const dir = join('test/lang', code);
          const text = readdirSync(dir, {recursive: true})
            .filter((name) => String(name).endsWith('.js'))
            .map((name) => readFileSync(join(dir, String(name)), 'utf8'))
            .join('\n');

          CORE.macros.forEach(function macro(name) {
            expect(text, code + ' must test ' + name).to.include(name);
          });
        });

      return;
    }

    it(code + ' holds its core-coverage baseline (' + BASELINE[code] + ')',
      function() {
        expect(coveredCells(code).size).to.be.at.least(BASELINE[code]);
      });
  });
});
