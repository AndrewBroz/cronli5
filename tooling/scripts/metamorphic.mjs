// Metamorphic + anti-collision bug discovery for cronli5 — oracle-free.
//
// The Schedule is the canonical semantic form: two crons that denote the SAME
// schedule must analyze() to a DEEP-EQUAL Schedule, after which identical
// rendering in every language follows for free. So the primary assertion is
// Schedule equality, not prose. A pair that renders the same but has a
// DIFFERENT Schedule is the fragile case — the equivalence is enforced
// per-renderer instead of canonicalized in the core, exactly where a language
// can later drift.
//
// Anti-collision is the dual: crons with different fire-sets must produce
// different Schedules; identical Schedules for distinct schedules is a dropped
// restriction.
//
// No model, no oracle — pure structural invariants. Run directly to print the
// report (exits non-zero on any violation); test/core/metamorphic.js gates it.

import {pathToFileURL} from 'node:url';
import {analyze, prepare} from '../../src/core/index.js';
import cronli5 from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';
import es from '../../src/lang/es/index.js';
import de from '../../src/lang/de/index.js';
import fi from '../../src/lang/fi/index.js';
import zh from '../../src/lang/zh/index.js';

const LANGS = {en, es, de, fi, zh};
const OPTS = en.options();

// [label, cronA, cronB] — A and B denote the SAME schedule; their Schedule must
// be deep-equal. Each equivalence rule we discover becomes a row, guarded
// forever.
const EQUIVALENT = [
  ['full-span minute', '0-59 * * * *', '* * * * *'],
  ['full-span hour', '0 0-23 * * *', '0 * * * *'],
  ['full-span date', '0 0 1-31 * *', '0 0 * * *'],
  ['full-span month', '0 0 * 1-12 *', '0 0 * * *'],
  ['full-span weekday 0-6', '0 0 * * 0-6', '0 0 * * *'],
  ['full-span weekday 1-7', '0 0 * * 1-7', '0 0 * * *'],
  ['full-span weekday SUN-SAT', '0 0 * * SUN-SAT', '0 0 * * *'],
  ['full-range step minute', '0-59/2 * * * *', '*/2 * * * *'],
  ['full-range step hour', '0 0-23/2 * * *', '0 */2 * * *'],
  ['weekday MON = 1', '0 0 * * MON', '0 0 * * 1'],
  ['weekday SUN: 7 = 0', '0 0 * * 7', '0 0 * * 0'],
  ['weekday FRI-SUN = 5-7', '0 0 * * FRI-SUN', '0 0 * * 5-7'],
  ['weekday SAT-SUN = 6-7', '0 0 * * SAT-SUN', '0 0 * * 6-7'],
  ['month JAN = 1', '0 0 1 JAN *', '0 0 1 1 *'],
  ['month MAR-MAY = 3-5', '0 0 1 MAR-MAY *', '0 0 1 3-5 *'],
  ['list order 17,9 = 9,17', '0 17,9 * * *', '0 9,17 * * *'],
  ['list dedupe 9,9,17 = 9,17', '0 9,9,17 * * *', '0 9,17 * * *'],
  ['degenerate range 9-9 = 9', '0 9-9 * * *', '0 9 * * *'],
  ['step-one 1/1 = 1-59', '1/1 * * * *', '1-59 * * * *'],
  ['5-field = 6-field second-0', '2 0 * * *', '0 2 0 * * *']
];

// [label, cronA, cronB] — DIFFERENT schedules; the Schedule must differ.
const DISTINCT = [
  ['minute-0 vs every-minute', '* 0 * * *', '* * * * *'],
  ['weekday 1-5 vs every', '0 0 * * 1-5', '0 0 * * *'],
  ['hour 9 vs hour 0', '0 9 * * *', '0 0 * * *'],
  ['*/7 vs */6', '*/7 * * * *', '*/6 * * * *'],
  ['minute 0-30 vs full', '0-30 * * * *', '* * * * *']
];

function irKey(cron) {
  return JSON.stringify(analyze(prepare(cron, OPTS)));
}

function renderAll(cron) {
  return Object.fromEntries(Object.entries(LANGS).map(function each(entry) {
    return [entry[0], cronli5(cron, {lang: entry[1], fragment: true})];
  }));
}

// Classify one equivalence pair against the Schedule-first invariant:
// {ok, status}.
function classifyEquivalent(a, b) {
  const irEqual = irKey(a) === irKey(b);
  const ra = renderAll(a);
  const rb = renderAll(b);
  const renderEqual = Object.keys(LANGS).every(function same(c) {
    return ra[c] === rb[c];
  });

  if (irEqual) {
    return renderEqual ?
      {ok: true, status: 'OK'} :
      {ok: false, status: 'RENDER-IMPURE (IR equal, prose differs)'};
  }

  return {
    ok: false,
    status: renderEqual ?
      'IR-GAP (prose matches, IR differs — per-renderer, fragile)' :
      'BUG (IR and prose both differ)'
  };
}

function run() {
  const violations = [];

  console.log('=== EQUIVALENCE (IR must be deep-equal) ===');

  for (const row of EQUIVALENT) {
    const verdict = classifyEquivalent(row[1], row[2]);

    console.log('  [' + (verdict.ok ? 'OK' : '!!') + '] ' + row[0] +
      (verdict.ok ? '' : ' — ' + verdict.status));

    if (!verdict.ok) {
      violations.push(row[0] + ': ' + verdict.status);
    }
  }

  console.log('=== ANTI-COLLISION (distinct schedules => distinct IR) ===');

  for (const row of DISTINCT) {
    const collide = irKey(row[1]) === irKey(row[2]);

    console.log('  [' + (collide ? '!!' : 'OK') + '] ' + row[0]);

    if (collide) {
      violations.push(row[0] + ': COLLISION (distinct schedules, equal IR)');
    }
  }

  console.log('\n' + violations.length + ' issue(s).');
  violations.forEach(function show(v) {
    console.log('  - ' + v);
  });

  return violations;
}

export {EQUIVALENT, DISTINCT, classifyEquivalent, irKey, run};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = run().length ? 1 : 0;
}
