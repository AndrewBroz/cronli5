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

const stylePatterns = [
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
    '0 9 * * 1', '0 12 * * SAT', '0 0 1 1 *', '0-29 * * * *',
    '*/10 6-8,17-19 * * 1-5', '0 0-6,22,23 * * *', '*/20 */2 */2 */3 *',
    '0 12 1-5,10,20-25 * *'
  ],
  complex: [
    '0 0 1,15 * 3', '0 0 9-17/2 * *', '23 0-20/2 * * *', '0 0 * * 5L',
    '5,10 30 9 * * MON', '59 23 31 12 5', '30 9 15W 6 *', '15 30 9 * * MON',
    '7 4-22/6 1 */2 *', '15,45 */4 1-10 1,4,7,10 *',
    '0,30 8-18/2 1,15 * 1-5', '0 18 15W 3,6,9,12 *', '30 4 1-7 * 1',
    '0 9-17/2 * 1-6 1-5', '30 */15 9-17 1,15 6-8 1-5'
  ]
};

// Breadth fillers: shapes of time field the curated `basic`/`showcase` sets
// don't reach.
const coverageExtras = [
  '* * * * * *', '5 * * * * *', '5 * * * *', '5,10 * * * *',
  '0-30 9 * * *', '0-30 */2 * * *', '0 * * * *', '0 */3 * * *'
];

// The spanning set: curated simple + compound patterns, simple-first, that
// span the shapes a time can take. Folded into the core set's `spanning`
// field and reviewed alongside the cell sweep.
const spanningSet = [...tables.basic, ...tables.showcase, ...coverageExtras];

export {
  comparisonPatterns, coverageExtras, stylePatterns, languagePatterns,
  spanningSet, tables
};
