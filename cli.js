#! /usr/bin/env node

// Need to sanity check a pattern before you schedule something? The cronli5
// CLI takes a cron pattern and prints a plain-language description. English by
// default; pass --lang <code> (de, es, fi) for another language.
//
//   cronli5 '* * * * *'             → Runs every minute.
//   cronli5 --lang de '0 0 * * *'   → täglich um Mitternacht
//
// It runs against the built dist/, so a plain `node` invocation works as
// published; in a source checkout, run `npm run build` first.
import {readdirSync} from 'node:fs';
import humanize from './dist/cronli5.js';

// The shippable languages are exactly the built language entry points, derived
// from dist/ so the list never drifts when a language is added or removed.
function availableLanguages() {
  return readdirSync(new URL('./dist/lang/', import.meta.url))
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.slice(0, -'.js'.length))
    .sort();
}

// Pull an optional `--lang <code>` or `--lang=<code>` out of the args; whatever
// remains is the cron pattern.
const args = process.argv.slice(2);
const flag = args.findIndex((a) => a === '--lang' || a.startsWith('--lang='));
let code = '';

if (flag !== -1) {
  const arg = args[flag];
  const inline = arg.indexOf('=') !== -1;

  code = inline ? arg.slice('--lang='.length) : args[flag + 1];
  args.splice(flag, inline ? 1 : 2);
}

const pattern = args.length === 1 ? args[0] : args;
const requested = code || 'en';

if (availableLanguages().includes(requested)) {
  emit(pattern, (await import('./dist/lang/' + requested + '.js')).default);
}
else {
  console.error('Unknown language: ' + code + ' (available: ' +
    availableLanguages().join(', ') + ')');
  process.exitCode = 1;
}

// Print the schedule as the language's own complete sentence.
function emit(cronPattern, language) {
  try {
    console.log(language.sentence(humanize(cronPattern, {lang: language})));
  }
  catch (error) {
    console.error('Problem parsing the cron pattern provided: ',
      error.message);
  }
}
