// A second reading of what a first one found misread. Each question a
// language's report lists as misread is asked again on its own: one
// description, one moment, nothing beside it, so that what the first
// reading made of the other questions in a list (their order, their dates)
// cannot decide the answer. Readers of two models answer, each as fresh and
// as isolated as in run.mjs, and the truth is worked out again by the
// oracle. A question still misread alone, by readers of both models, is a
// misreading of the description.
//
// Usage:
//   node --import tsx tooling/scripts/reading/recheck.mjs <code> [<code> …]
//     [--readers 3] [--models claude-sonnet-5-5,claude-opus-5-5]
//     [--concurrency 8] [--out tooling/readings]
//
// It reads <out>/<code>/report.md and writes <out>/<code>/recheck.md.

import {spawn} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {firesAt, hasSeconds} from './oracle.mjs';
import {answersFrom, messageFor, prompts} from './prompts.mjs';

// How many times one reader is asked before its question is left unanswered.
const ASKS = 3;

function flag(args, name, fallback) {
  const at = args.indexOf(`--${name}`);

  return at >= 0 ? args[at + 1] : fallback;
}

// A moment as the report writes it: 2030-06-28 9:37:00.
function momentOf(text) {
  const [day, time] = text.trim().split(' ');
  const [year, month, date] = day.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);

  return {date, hour, minute, month, second, year};
}

// The misread questions of a report, with each row's options.
function misreadOf(code, out) {
  const report = readFileSync(join(out, code, 'report.md'), 'utf8');
  const section = report.split('## Misread')[1].split('## Noted')[0];
  const {rows} = JSON.parse(readFileSync(`conformance/${code}.json`, 'utf8'));

  return section.split('\n')
    .filter((line) => line.startsWith('| ') && line.includes('`'))
    .map(function question(line) {
      const cells = line.split(' | ').map((cell) => cell.trim());
      const pattern = cells[1].replace(/`/gu, '');
      const row = rows.find((entry) => entry.pattern === pattern);
      const options = {
        cron: row?.options.cron,
        years: Boolean(row?.options.years)
      };
      const moment = momentOf(cells[3]);

      return {
        first: cells[0].replace(/^\|\s*/u, ''),
        fires: firesAt(pattern, moment, options),
        moment,
        pattern,
        seconds: hasSeconds(pattern, options),
        text: cells[2]
      };
    });
}

function read(message, system, model, sandbox) {
  return new Promise(function asked(done) {
    const child = spawn('claude', ['-p', '--model', model, '--tools', '',
      '--setting-sources', '', '--no-session-persistence',
      '--system-prompt', system], {cwd: sandbox});
    let output = '';

    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.on('close', () => done(output));
    child.stdin.end(message);
  });
}

// One reader's yes or no, or null. A reply with no yes or no in it is not a
// reading, so the reader is asked again rather than scored as wrong; some
// replies answer stray context the CLI adds instead of the question.
async function answerOf(code, message, model, sandbox) {
  for (let tries = 0; tries < ASKS; tries += 1) {
    const {A1} = answersFrom(code, await read(message, prompts[code].system,
      model, sandbox));

    if (typeof A1 === 'boolean') {
      return A1;
    }
  }

  return null;
}

async function pooled(jobs, limit) {
  const results = [];
  let next = 0;

  async function worker() {
    while (next < jobs.length) {
      const index = next;

      next += 1;
      results[index] = await jobs[index]();
    }
  }

  await Promise.all(Array.from({length: limit}, worker));

  return results;
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function stamp(moment) {
  return `${moment.year}-${pad(moment.month)}-${pad(moment.date)} ` +
    `${moment.hour}:${pad(moment.minute)}:${pad(moment.second)}`;
}

async function recheck(code, settings) {
  const questions = misreadOf(code, settings.out);
  const sandbox = mkdtempSync(join(tmpdir(), 'cronli5-recheck-'));
  const jobs = questions.flatMap((question, number) =>
    settings.models.flatMap((model) =>
      Array.from({length: settings.readers}, () => async function job() {
        const message = messageFor(code,
          [{...question, moments: [question.moment]}]);
        const answer = await answerOf(code, message, model, sandbox);

        return {answer, model, number};
      })));
  const results = await pooled(jobs, settings.limit);
  const lines = questions.map(function line(question, number) {
    // Each model's wrong answers out of the answers it gave.
    const tallies = settings.models.map(function tally(model) {
      const answers = results.filter((result) => result.number === number &&
        result.model === model && typeof result.answer === 'boolean');
      const missed = answers.filter((result) => result.answer !==
        question.fires).length;

      return {answered: answers.length, missed};
    });
    const counts = tallies.map(({answered, missed}) => `${missed}/${answered}`);
    const still = tallies.every(({answered, missed}) => missed > answered / 2);

    return `| ${still ? 'yes' : 'no'} | ${counts.join(' | ')} | ` +
      `${question.first} | \`${question.pattern}\` | ${question.text} | ` +
      `${stamp(question.moment)} | ` +
      `${question.fires ? 'fires' : 'does not fire'} |`;
  });

  writeFileSync(join(settings.out, code, 'recheck.md'), [
    `# Recheck: ${code}`,
    '',
    `Each misread question asked again alone, ${settings.readers} readers ` +
      `of each model (${settings.models.join(', ')}), each wrong count out ` +
      'of the readers who answered. "Still" means most readers of every ' +
      'model answered it wrongly.',
    '',
    `| still | ${settings.models.join(' | ')} | first | pattern | ` +
      'description | moment | truth |',
    `| --- | ${settings.models.map(() => '---').join(' | ')} | --- | --- | ` +
      '--- | --- | --- |',
    ...lines,
    ''
  ].join('\n'));
  process.stdout.write(`${code}: ${questions.length} rechecked\n`);
}

async function main(args) {
  const codes = args.filter((arg, index) => !arg.startsWith('--') &&
    (index === 0 || !args[index - 1].startsWith('--')));
  const settings = {
    limit: Number(flag(args, 'concurrency', 8)),
    models: flag(args, 'models', 'claude-sonnet-5-5,claude-opus-5-5')
      .split(','),
    out: flag(args, 'out', 'tooling/readings'),
    readers: Number(flag(args, 'readers', 3))
  };

  for (const code of codes) {
    // One language at a time keeps the number of readers at once bounded.
    await recheck(code, settings);
  }
}

main(process.argv.slice(2));
