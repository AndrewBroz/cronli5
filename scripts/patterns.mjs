// Curated cron pattern sets, shared by the docs generator and the language
// pipeline (so they stay a single source of truth). `basic` shows everyday
// lines where libraries agree on meaning and differ only in voice;
// `showcase` shows compound patterns where folded output beats fragment
// assembly. `languagePatterns` is the shared cross-language set; the dialect
// set exercises the US/UK/house style axes.

const tables = {
  basic: [
    '* * * * *', '*/5 * * * *', '0 12 * * *', '30 9 * * MON-FRI',
    '0 9,17 * * *', '0 9-17 * * *', '0-29 * * * *', '0 0 1,15 * *',
    '0 12 1 1 *', '@daily', '*/30 * * * * *', '0 0 * * 5L'
  ],
  showcase: [
    '5,10 30 9 * * MON', '*/15 30 9-17 * * MON-FRI', '15 30 9 * * MON',
    '45 17,9 0 * * *', '0-30 9,17-19 * * *', '0 22-2,12 * * *',
    '0 9-20,22 * * *', '* 9,12,17 * * MON-FRI', '30 9 15W 6 *',
    '0 0 29 2 *', '0 9-9 * * *', '1/1 * * * *', '1 1 * * * *',
    '59 23 31 12 5'
  ]
};

const languagePatterns = [
  '*/5 * * * *', '0 0 * * *', '30 9 * * MON-FRI', '0 9,17 * * *',
  '0 22-2 * * *', '*/15 9-17 * * *', '0 0 1,15 * *', '0 12 1 1 *',
  '0 12 * 11-2 *', '0 0 * * 5L', '5,10 30 9 * * MON', '1/1 * * * *'
];

const dialectPatterns = [
  '0 9,12,17 * * *', '30 9 * * MON-FRI', '0 12 1 1 *',
  '*/15 9-17 * * *', '0 0 12 25 12 * 2030'
];

// The cRonstrue head-to-head display set, grouped by how a user perceives the
// pattern (simple/medium/complex per the divergence engine's `classify`). Each
// row is rendered cronli5-in-sentence-form vs. cRonstrue (English) so it is a
// fair like-for-like, and the groups are chosen to be representative AND to
// surface the real divergences: the OR-union (`0 0 1,15 * 3`), a bounded step
// (`0 0 9-17/2 * *`), a step-in-range hour (`23 0-20/2 * * *`), month and
// day-of-month enumerations, weekday ranges, and everyday cadences. Every
// pattern's class is asserted by the docs generator against `classify`, so a
// mis-grouped row fails the build rather than shipping.
const comparisonPatterns = {
  simple: [
    '* * * * *', '*/5 * * * *', '*/15 * * * *', '0 */6 * * *',
    '0 9 * * *', '0 12 * * *', '0 0 * * *'
  ],
  medium: [
    '30 9 * * MON-FRI', '0 9-17 * * *', '0 9,17 * * *', '0 0 1,15 * *',
    '0 9 * * 1', '0 12 * * SAT', '0 0 1 1 *', '0-29 * * * *'
  ],
  complex: [
    '0 0 1,15 * 3', '0 0 9-17/2 * *', '23 0-20/2 * * *', '0 0 * * 5L',
    '5,10 30 9 * * MON', '59 23 31 12 5', '30 9 15W 6 *', '15 30 9 * * MON'
  ]
};

// Breadth fillers that top up the PlanNode kinds the curated `basic`/`showcase`
// sets don't reach (verified by spanning-set.mjs's coverage report).
const coverageExtras = [
  '* * * * * *', '5 * * * * *', '5 * * * *', '5,10 * * * *',
  '0-30 9 * * *', '0-30 */2 * * *', '0 * * * *', '0 */3 * * *'
];

// The spanning set: curated simple + compound patterns, simple-first, that
// exercise every rendering plan. Folded into the core set's `spanning`
// field and reviewed alongside the cell sweep.
const spanningSet = [...tables.basic, ...tables.showcase, ...coverageExtras];

export {
  comparisonPatterns, coverageExtras, dialectPatterns, languagePatterns,
  spanningSet, tables
};
