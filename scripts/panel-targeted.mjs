// Run the cross-family panel over a targeted set of patterns rather than the
// spanning set — used to validate new phrasings (here, the hour-step
// confinement forms). Emits blind slates for Claude judges and saves each
// language's items (slate + key + Gemma verdict) for re-aggregation. Temporary.
//
// Usage:
//   node --import tsx scripts/panel-targeted.mjs           build + print slates
//   node --import tsx scripts/panel-targeted.mjs --aggregate <code> <judges>

import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {aggregate, anonymize, buildField, gemmaJudge} from './panel.mjs';

const PATTERNS = [
  '*/15 */2 * * *',
  '* */2 * * *',
  '*/15 */3 * * *',
  '*/20 9-17/2 * * *',
  '* */5 * * *'
];

const CODES = ['en', 'es', 'de', 'fi'];
const NAMES = {en: 'English', es: 'Spanish', de: 'German', fi: 'Finnish'};
const JUDGE = 'a native speaker judging schedule descriptions for ' +
  'naturalness and correctness';

// Build and print blind slates; save items (with Gemma verdict) per language.
async function build() {
  mkdirSync('tmp', {recursive: true});

  for (const code of CODES) {
    const items = [];

    console.log('\n========== ' + NAMES[code] + ' (' + code + ') ==========');

    for (const pattern of PATTERNS) {
      const {meaning, field} = await buildField(code, pattern, '');
      const {slate, key} = anonymize(field);
      const verdict = await gemmaJudge(meaning, slate, NAMES[code], JUDGE)
        .catch(() => null);

      items.push({pattern, meaning, slate, key,
        gemmaVerdicts: verdict ? [verdict] : []});

      console.log('\n[' + pattern + '] meaning: "' + meaning + '"');
      slate.forEach((entry) => console.log('  ' + entry.letter + ') ' +
        entry.text));
    }

    writeFileSync('tmp/targeted-' + code + '.json',
      JSON.stringify(items, null, 2));
  }

  console.log('\nSaved tmp/targeted-<code>.json. Add Claude judges, then ' +
    'aggregate with --aggregate <code> <judgesFile>.');
}

// Re-aggregate one language's saved items with a Claude judges file (keyed by
// pattern → array of verdicts), printing the 4-judge median gate.
function aggregateJudges(code, judgesPath) {
  const items = JSON.parse(readFileSync('tmp/targeted-' + code + '.json',
    'utf8'));
  const judges = JSON.parse(readFileSync(judgesPath, 'utf8'));
  let passes = 0;

  console.log('\n=== ' + NAMES[code] + ' (4-judge gate) ===');

  for (const item of items) {
    const verdicts = [...item.gemmaVerdicts, ...judges[item.pattern] || []];
    const result = aggregate(item, verdicts);
    const stats = result.stats.cronli5;

    passes += result.pass ? 1 : 0;
    console.log((result.pass ? 'PASS ' : 'FAIL ') + item.pattern +
      '  natural=' + stats.natural + ' correct=' + stats.correct.toFixed(2) +
      ' rank=' + result.rank + '/' + result.candidates);
  }

  console.log(passes + '/' + items.length + ' pass the beta gate.');
}

const aggArg = process.argv.indexOf('--aggregate');

if (aggArg === -1) {
  await build();
}
else {
  aggregateJudges(process.argv[aggArg + 1], process.argv[aggArg + 2]);
}
