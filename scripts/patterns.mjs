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

export {dialectPatterns, languagePatterns, tables};
