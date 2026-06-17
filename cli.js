#! /usr/bin/env node

// Need to sanity check a pattern before you schedule something? The cronli5
// CLI takes a cron pattern and prints a plain-language description: a complete
// sentence by default, or the bare fragment with --fragment. English by
// default; pass --lang <code> (de, es, fi) for another language.
//
//   cronli5 '* * * * *'                → Runs every minute.
//   cronli5 --lang de '0 0 * * *'      → Läuft täglich um Mitternacht.
//   cronli5 --fragment '0 0 * * *'     → every day at midnight
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

// Pull the optional flags out of the args; whatever remains is the cron
// pattern. --fragment prints the bare fragment instead of a full sentence.
const args = process.argv.slice(2);
const fragmentAt = args.indexOf('--fragment');
const fragment = fragmentAt !== -1;

if (fragment) {
  args.splice(fragmentAt, 1);
}

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

// Print the schedule: a complete sentence by default, the bare fragment under
// --fragment. The sentence wrapping is the library's own (the `sentence`
// option), so the CLI stays a thin shell over the API.
function emit(cronPattern, language) {
  try {
    console.log(humanize(cronPattern, {lang: language, sentence: !fragment}));
  }
  catch (error) {
    console.error('Problem parsing the cron pattern provided: ',
      error.message);
  }
}
