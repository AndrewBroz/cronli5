#! /usr/bin/env node

// Need to sanity check a pattern before you schedule something? The cronli5
// CLI takes a cron pattern and prints a plain-language description: a complete
// sentence by default, in English by default. Given no pattern, it reads
// patterns (or a crontab) from standard input.
//
// It runs against the built dist/, so a plain `node` invocation works as
// published; in a source checkout, run `npm run build` first.
import {readFileSync, readdirSync} from 'node:fs';
import humanize, {Cronli5OptionError} from './dist/all.js';

const usage = `Usage: cronli5 [options] '<pattern>'
       cronli5 [options] < patterns.txt
       crontab -l | cronli5 --crontab [options]

Describes a cron pattern in plain language. Quote the pattern, or the shell
will expand its stars.

Options:
  --lang <code>        the language, with an optional region (en, en-GB, cs)
  --form <form>        sentence (the default), label or fragment
  --fragment           short for --form fragment
  --cron <dialect>     standard (the default) or quartz
  --style <key=value>  a choice in the language's style table, such as
                       hour12=false or short; may be repeated
  --crontab            read a crontab from standard input: each job's
                       schedule is described, then a tab and its command
  -h, --help           print this text
  -v, --version        print the version

With no pattern, each line of standard input is one pattern; blank lines
and lines that start with # are skipped, and each description follows its
pattern and a tab.

Examples:
  cronli5 '*/15 9-17 * * 1-5'
  cronli5 --lang cs --fragment '30 9 * * MON-FRI'
  cronli5 --cron quartz '0 0 0 ? * 2'
  cronli5 --style hour12=false '30 9 * * *'

Exit status: 0 on success, 1 if a pattern could not be described, 2 if the
command itself was wrong.`;

// How the command ends: a pattern that cannot be described is the data's
// fault, anything else the caller's.
const BAD_PATTERN = 1;
const BAD_USAGE = 2;

// The flags that take a value; each is the library option of the same name.
const valueFlags = ['lang', 'form', 'cron', 'style'];
const switches = {
  '--crontab': {crontab: true},
  '--fragment': {form: 'fragment'},
  '--help': {help: true},
  '--version': {version: true},
  '-h': {help: true},
  '-v': {version: true}
};
const validFlags =
  '--lang, --form, --fragment, --cron, --style, --crontab, --help, --version';

// A pattern has seven fields at most. More arguments than that are nearly
// always the shell's doing: an unquoted star became the names of the files
// in the directory.
const MOST_FIELDS = 7;

// The macro a crontab line may open with in place of five fields.
const MACRO = /^@\w+/u;

// The shippable languages are exactly the built language entry points, derived
// from dist/ so the list never drifts when a language is added or removed.
function availableLanguages() {
  return readdirSync(new URL('./dist/lang/', import.meta.url))
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.slice(0, -'.js'.length))
    .sort();
}

// One `--style` value: `key=value`, where `true` and `false` are the
// booleans and a bare key is `true`. What the keys are and what they may
// hold is the language's business; the library says so if one is wrong.
function styleOf(text) {
  const [key, value = 'true'] = text.split(/[=](.*)/su);
  const booleans = {false: false, true: true};

  return {[key]: value in booleans ? booleans[value] : value};
}

// Pull the flags out of the args; whatever remains is the cron pattern. A
// value flag is `--name value` or `--name=value`. A flag given as the final
// argument has no value to consume, which is an error rather than a silent
// fall back to the default.
function readFlags(args) {
  const found = {options: {form: 'sentence'}, problem: '', rest: []};
  const {options} = found;

  function take(name, value) {
    if (name === 'style') {
      options.style = {...options.style, ...styleOf(value)};
    }
    else {
      options[name] = value;
    }
  }

  for (let at = 0; at < args.length; at += 1) {
    const [name, inline] = args[at].replace(/^--/u, '').split(/[=](.*)/su);

    if (args[at] in switches) {
      Object.assign(options, switches[args[at]]);
    }
    else if (!args[at].startsWith('-') || args[at] === '-') {
      found.rest.push(args[at]);
    }
    else if (!args[at].startsWith('--') || !valueFlags.includes(name)) {
      // A typo or an unsupported option (e.g. `--land` for `--lang`); naming
      // it beats letting it surface as a confusing "invalid field value".
      found.problem ||= 'Unknown option: ' + args[at].replace(/[=].*/su, '') +
        ' (valid options: ' + validFlags + ')';
    }
    else if (typeof inline === 'string') {
      take(name, inline);
    }
    else if (at === args.length - 1) {
      found.problem ||= 'Missing value for --' + name;
    }
    else {
      at += 1;
      take(name, args[at]);
    }
  }

  return found;
}

// The description of one pattern, or the reason there is none. The wording,
// the form and every check of a flag's value are the library's own, so the
// CLI stays a thin shell over the API.
function describe(pattern, options) {
  try {
    return {text: humanize(pattern, options)};
  }
  catch (error) {
    return error instanceof Cronli5OptionError ?
      {status: BAD_USAGE, trouble: error.message} :
      {
        status: BAD_PATTERN,
        trouble: 'Problem parsing the cron pattern provided: ' + error.message
      };
  }
}

// A crontab job line as its schedule and its command: five fields, or one
// macro, and then whatever is to run. Settings (`MAILTO=ops`) are not jobs.
function jobOf(line) {
  const words = line.split(/\s+/u);
  const fields = MACRO.test(line) ? 1 : 5;

  return (/^\w+\s*[=]/u).test(line) ?
    null :
    {
      command: line.replace(new RegExp(`^(?:\\S+\\s+){${fields}}`, 'u'), ''),
      pattern: words.slice(0, fields).join(' ')
    };
}

// Standard input, line by line: a pattern each, or a crontab's jobs. A line
// that cannot be described is reported by its number and the rest go on.
function describeLines(text, options) {
  const {crontab, ...library} = options;
  let status = 0;

  text.split('\n').forEach(function each(raw, index) {
    const line = raw.trim();
    const job = crontab ? jobOf(line) : {command: '', pattern: line};

    if (line === '' || line.startsWith('#') || job === null) {
      return;
    }

    const {status: failed, text: said, trouble} =
      describe(job.pattern, library);

    if (trouble) {
      status = Math.max(status, failed);
      console.error(`line ${index + 1}: ${trouble}`);
    }
    else {
      console.log(crontab ? `${said}\t${job.command}` : `${line}\t${said}`);
    }
  });

  return status;
}

// One pattern from the arguments: a single quoted argument, or its fields
// as separate arguments.
function describeArguments(rest, options) {
  const {status = 0, text, trouble} =
    describe(rest.length === 1 ? rest[0] : rest, options);
  const expanded = rest.length > MOST_FIELDS ?
    '\nDid the shell expand a star? Put the pattern in quotes: ' +
      'cronli5 \'*/5 * * * *\'' :
    '';

  if (trouble) {
    console.error(trouble + expanded);
  }
  else {
    console.log(text);
  }

  return status;
}

function versionOf() {
  return JSON.parse(readFileSync(
    new URL('./package.json', import.meta.url), 'utf8')).version;
}

// What is wrong with the command itself, if anything.
function refusal(options, problem) {
  const [language] = (options.lang || 'en').toLowerCase().split(/[-_]/u);

  return problem || (availableLanguages().includes(language) ?
    '' :
    'Unknown language: ' + options.lang + ' (available: ' +
      availableLanguages().join(', ') + ')');
}

// The patterns to describe: one from the arguments, or those on standard
// input when a crontab is asked for or nothing was given and something is
// piped in.
function describeAll(rest, options) {
  const {crontab, ...library} = options;
  const reads = crontab || rest.length === 0 && !process.stdin.isTTY;
  const input = reads ? readFileSync(0, 'utf8') : '';

  if (rest.length === 0 && input.trim() === '') {
    // Nothing to describe: say how the command is used.
    console.error(usage);

    return BAD_USAGE;
  }

  return reads ?
    describeLines(input, options) :
    describeArguments(rest, library);
}

function run(args) {
  const {options, problem, rest} = readFlags(args);
  const {help, version, ...asked} = options;
  const refused = refusal(options, problem);

  if (help || version) {
    console.log(help ? usage : versionOf());

    return 0;
  }

  if (refused) {
    console.error(refused);

    return BAD_USAGE;
  }

  return describeAll(rest, asked);
}

process.exitCode = run(process.argv.slice(2));
