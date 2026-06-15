// The spanning set for the language pipeline: simple (basic) + compound
// (showcase) cron patterns, reused from the curated docs sets, ordered
// simple-first. It also reports which `PlanNode` kinds the set exercises, so
// a language is reviewed against the full breadth of the core's rendering
// strategies. Run directly to print the coverage report.

import {pathToFileURL} from 'node:url';
import {analyze, prepare} from '../src/core/index.js';
import en from '../src/lang/en/index.js';
import {tables} from './patterns.mjs';

// Breadth fillers: the curated docs sets don't exercise every rendering
// strategy, so these top up the uncovered PlanNode kinds (verified by the
// coverage report below).
const coverageExtras = [
  '* * * * * *', '5 * * * * *', '5 * * * *', '5,10 * * * *',
  '0-30 9 * * *', '0-30 */2 * * *', '0 * * * *', '0 */3 * * *'
];

const spanningSet = [...tables.basic, ...tables.showcase, ...coverageExtras];

// Every rendering strategy the core can select (see src/core/ir.ts). The
// spanning set should exercise each one.
const PLAN_KINDS = [
  'everySecond', 'standaloneSeconds', 'secondPastMinute',
  'secondsWithinMinute', 'composeSeconds', 'everyMinute', 'singleMinute',
  'rangeOfMinutes', 'multipleMinutes', 'minuteFrequency', 'minuteSpanInHour',
  'minutesAcrossHours', 'minuteSpanAcrossHourStep', 'everyHour', 'hourRange',
  'hourStep', 'clockTimes', 'compactClockTimes'
];

// The plan kind(s) a pattern exercises. `composeSeconds` also exposes the
// underlying minute/hour plan via `rest`, so both are counted.
function planKinds(pattern) {
  const {plan} = analyze(prepare(pattern, en.options()));
  const kinds = [plan.kind];

  if (plan.kind === 'composeSeconds') {
    kinds.push(plan.rest.kind);
  }

  return kinds;
}

// Which patterns exercise each kind, and which kinds nothing covers.
function coverage() {
  const covered = {};

  for (const pattern of spanningSet) {
    for (const kind of planKinds(pattern)) {
      if (!covered[kind]) {
        covered[kind] = [];
      }

      covered[kind].push(pattern);
    }
  }

  return {covered, missing: PLAN_KINDS.filter((kind) => !covered[kind])};
}

export {coverage, planKinds, PLAN_KINDS, spanningSet};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const {missing} = coverage();

  console.log('Spanning set: ' + spanningSet.length + ' patterns (' +
    tables.basic.length + ' simple, ' + tables.showcase.length +
    ' compound, ' + coverageExtras.length + ' breadth fillers).');
  console.log('PlanNode kinds covered: ' +
    (PLAN_KINDS.length - missing.length) + '/' + PLAN_KINDS.length + '.');

  if (missing.length) {
    console.log('Uncovered kinds: ' + missing.join(', '));
  }
  else {
    console.log('Every PlanNode kind is exercised.');
  }
}
