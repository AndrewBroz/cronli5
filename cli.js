#! /usr/bin/env node

// Need to sanity check a pattern before you schedule something? The cronli5
// CLI takes a cron pattern and prints a plain-language description: a complete
// sentence by default. English by default.
//
//   cronli5 '* * * * *'                    → Runs every minute.
//   cronli5 --fragment '0 0 * * *'         → at midnight every day
//   cronli5 --form label '0 0 * * *'       → At midnight every day
//   cronli5 --lang en-GB '30 9 * * *'      → Runs at 9.30am every day.
//   cronli5 --cron quartz '0 0 0 ? * 2'    → Runs at midnight on Mondays.
//
// It runs against the built dist/, so a plain `node` invocation works as
// published; in a source checkout, run `npm run build` first.
import {readdirSync} from 'node:fs';
import humanize, {Cronli5OptionError} from './dist/all.js';

// The flags that take a value; each is the library option of the same name.
const valueFlags = ['lang', 'form', 'cron'];
const validFlags = '--lang, --form, --cron, --fragment';

// The shippable languages are exactly the built language entry points, derived
// from dist/ so the list never drifts when a language is added or removed.
function availableLanguages() {
  return readdirSync(new URL('./dist/lang/', import.meta.url))
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.slice(0, -'.js'.length))
    .sort();
}

// Pull the flags out of the args; whatever remains is the cron pattern. A
// value flag is `--name value` or `--name=value`. A flag given as the final
// argument has no value to consume, which is an error rather than a silent
// fall back to the default.
function readFlags(args) {
  const options = {form: 'sentence'};
  const rest = [];
  let problem = '';

  for (let at = 0; at < args.length; at += 1) {
    const [name, inline] = args[at].replace(/^--/u, '').split(/[=](.*)/su);

    if (!args[at].startsWith('--')) {
      rest.push(args[at]);
    }
    else if (name === 'fragment') {
      options.form = 'fragment';
    }
    else if (!valueFlags.includes(name)) {
      // A typo or an unsupported option (e.g. `--land` for `--lang`); naming
      // it beats letting it surface as a confusing "invalid field value".
      problem ||= 'Unknown option: --' + name +
        ' (valid options: ' + validFlags + ')';
    }
    else if (typeof inline === 'string') {
      options[name] = inline;
    }
    else if (at === args.length - 1) {
      problem ||= 'Missing value for --' + name;
    }
    else {
      at += 1;
      options[name] = args[at];
    }
  }

  return {options, problem, rest};
}

const {options, problem, rest} = readFlags(process.argv.slice(2));
const pattern = rest.length === 1 ? rest[0] : rest;
const [language] = (options.lang || 'en').toLowerCase().split(/[-_]/u);

if (problem) {
  console.error(problem);
  process.exitCode = 1;
}
else if (availableLanguages().includes(language)) {
  emit(pattern);
}
else {
  console.error('Unknown language: ' + options.lang + ' (available: ' +
    availableLanguages().join(', ') + ')');
  process.exitCode = 1;
}

// Print the schedule. The wording, the form and every check of a flag's
// value are the library's own, so the CLI stays a thin shell over the API.
function emit(cronPattern) {
  try {
    console.log(humanize(cronPattern, options));
  }
  catch (error) {
    console.error(error instanceof Cronli5OptionError ?
      error.message :
      'Problem parsing the cron pattern provided: ' + error.message);
    process.exitCode = 1;
  }
}
