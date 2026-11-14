// Readers say when each description fires; their answers are scored
// against the true schedule. For one language: render every row of its
// conformance suite as the sentence a user sees, choose the moments to ask
// about (probes.mjs), and ask several readers, each a fresh model briefed
// only in that language (prompts.mjs), with no tools, no settings and an
// empty working directory, so it knows nothing but the text in front of it.
// A probe most readers answer wrongly is a misreading of the description;
// one reader alone is a note.
//
// Usage:
//   node --import tsx tooling/scripts/reading/run.mjs <code>
//     [--sample N] [--readers 3] [--model claude-sonnet-5-5]
//     [--concurrency 6] [--out tooling/readings]
//
// It writes <out>/<code>/ : the questions, each reader's raw answer, and
// report.md. Reading costs model calls (rows / 5 x readers); start with
// --sample.

import {spawn} from 'node:child_process';
import {mkdirSync, mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import cronli5 from '../../../src/all.js';
import {hasSeconds} from './oracle.mjs';
import {probesFor} from './probes.mjs';
import {LETTERS, answersFrom, messageFor, prompts} from './prompts.mjs';

const PER_BATCH = 5;

function flag(args, name, fallback) {
  const at = args.indexOf(`--${name}`);

  return at >= 0 ? args[at + 1] : fallback;
}

// The rows to read, each with the sentence a user sees and its probes.
function tasksOf(code, sample) {
  const {rows} = JSON.parse(readFileSync(`conformance/${code}.json`, 'utf8'));
  const every = sample ? Math.max(1, Math.floor(rows.length / sample)) : 1;

  return rows.filter((_, index) => index % every === 0)
    .slice(0, sample || rows.length)
    .flatMap(function task(row, index) {
      const options = {years: Boolean(row.options.years)};

      try {
        return [{
          moments: [],
          options: row.options,
          pattern: row.pattern,
          probes: probesFor(row.pattern, options, index),
          seconds: hasSeconds(row.pattern, options),
          text: cronli5(row.pattern, {...row.options, form: 'sentence'})
        }];
      }
      catch {
        return [];
      }
    })
    .map((task) => ({...task, moments: task.probes.map((p) => p.moment)}));
}

// One reader's answer to one message.
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

// Run jobs with at most `limit` at once.
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

function report(code, tasks, readers) {
  const rows = [];
  const byKind = {};
  let misread = 0;
  let noted = 0;
  let asked = 0;

  tasks.forEach(function scored(task) {
    task.probes.forEach(function probe(entry, number) {
      const wrong = entry.answers.filter((answer) => answer !== entry.fires)
        .length;
      const kind = byKind[entry.kind] || {asked: 0, wrong: 0};

      asked += 1;
      kind.asked += 1;
      kind.wrong += wrong > readers / 2 ? 1 : 0;
      byKind[entry.kind] = kind;

      if (wrong > 0) {
        const line = `| ${wrong}/${entry.answers.length} | ` +
          `\`${task.pattern}\` ` +
          `| ${task.text} | ${task.moments[number].year}-` +
          `${String(task.moments[number].month).padStart(2, '0')}-` +
          `${String(task.moments[number].date).padStart(2, '0')} ` +
          `${task.moments[number].hour}:` +
          `${String(task.moments[number].minute).padStart(2, '0')}:` +
          `${String(task.moments[number].second).padStart(2, '0')} | ` +
          `${entry.fires ? 'fires' : 'does not fire'} | ${entry.kind} |`;

        rows.push({line, wrong});
        misread += wrong > readers / 2 ? 1 : 0;
        noted += wrong > readers / 2 ? 0 : 1;
      }
    });
  });

  const kinds = Object.entries(byKind).map(([kind, count]) =>
    `| ${kind} | ${count.asked} | ${count.wrong} |`);
  const table = '| wrong | pattern | description | moment | truth | probe |\n' +
    '| --- | --- | --- | --- | --- | --- |\n';

  return [
    `# Reading report: ${code}`,
    '',
    `${tasks.length} descriptions, ${asked} questions, ${readers} readers ` +
      'each. A question most readers got wrong is a misreading; one ' +
      'reader alone is a note.',
    '',
    `Misread: ${misread}. Noted: ${noted}.`,
    '',
    '| probe | asked | misread |',
    '| --- | --- | --- |',
    ...kinds,
    '',
    '## Misread',
    '',
    table + rows.filter((row) => row.wrong > readers / 2)
      .map((row) => row.line).join('\n'),
    '',
    '## Noted by one reader',
    '',
    table + rows.filter((row) => row.wrong <= readers / 2)
      .map((row) => row.line).join('\n'),
    ''
  ].join('\n');
}

async function main(args) {
  const [code] = args;
  const sample = Number(flag(args, 'sample', 0));
  const readers = Number(flag(args, 'readers', 3));
  const model = flag(args, 'model', 'claude-sonnet-5-5');
  const limit = Number(flag(args, 'concurrency', 6));
  const out = join(flag(args, 'out', 'tooling/readings'), code);

  if (!prompts[code]) {
    throw new Error(`no reader prompt for "${code}"`);
  }

  mkdirSync(join(out, 'raw'), {recursive: true});

  const tasks = tasksOf(code, sample);
  const batches = [];

  for (let at = 0; at < tasks.length; at += PER_BATCH) {
    batches.push(tasks.slice(at, at + PER_BATCH));
  }

  const sandbox = mkdtempSync(join(tmpdir(), 'cronli5-reader-'));
  const jobs = batches.flatMap((batch, number) =>
    Array.from({length: readers}, (_, reader) => async function job() {
      const message = messageFor(code, batch);
      const said = await read(message, prompts[code].system, model, sandbox);

      writeFileSync(join(out, 'raw', `${number}-${reader}.txt`),
        `${message}\n\n=====\n\n${said}`);

      return {answers: answersFrom(code, said), number};
    }));
  const results = await pooled(jobs, limit);

  batches.forEach(function score(batch, number) {
    const answered = results.filter((result) => result.number === number);

    batch.forEach(function each(task, index) {
      task.probes.forEach(function probe(entry, question) {
        const key = `${LETTERS[index]}${question + 1}`;

        entry.answers = answered.map((result) => result.answers[key])
          .filter((answer) => typeof answer === 'boolean');
      });
    });
  });

  writeFileSync(join(out, 'tasks.json'), JSON.stringify(tasks, null, 1));
  writeFileSync(join(out, 'report.md'), report(code, tasks, readers));
  process.stdout.write(`${join(out, 'report.md')}\n`);
}

await main(process.argv.slice(2));
