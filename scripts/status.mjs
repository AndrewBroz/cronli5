// The review-status table is generated from each module's status.json so the
// stable/beta labelling stays current and public. Reused by docs.mjs, so
// `npm run docs` keeps it current and `--check` gates drift. See
// docs/language-pipeline.md.
//
// Each status.json carries the language's headline status (its default
// dialect) and review evidence, plus an optional `dialects` map of
// non-default dialect variants, each with its own status — so the table can
// surface a dialect whose maturity diverges from its language. Per-language
// PlanNode-kind coverage is a planned addition; it needs the corpora to
// export their pattern lists (today embedded in the test files).

import {existsSync, readdirSync, readFileSync} from 'node:fs';

const LANG_DIR = new URL('../src/lang/', import.meta.url);

// Each language module's status.json, in directory order.
function languageStatuses() {
  return readdirSync(LANG_DIR, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() &&
      existsSync(new URL('./' + entry.name + '/status.json', LANG_DIR)))
    .map((entry) => ({
      code: entry.name,
      ...JSON.parse(readFileSync(
        new URL('./' + entry.name + '/status.json', LANG_DIR), 'utf8'))
    }));
}

// One markdown row of status and review evidence for a reviewed unit.
function row(label, unit) {
  return '| ' + label + ' | ' + unit.status + ' | ' +
    (unit.humanReview || '—') + ' | ' + (unit.crossFamilyReview || '—') + ' |';
}

// A markdown table of each language's status, with a sub-row for any dialect
// whose status diverges from its language (e.g. a beta dialect of a stable
// language). Dialects that match their language are captured in status.json
// but left off the table to avoid restating "stable".
function statusTable() {
  const rows = [];

  for (const lang of languageStatuses()) {
    rows.push(row(lang.name, lang));

    for (const [id, dialect] of Object.entries(lang.dialects || {})) {
      if (dialect.status !== lang.status) {
        rows.push(row(lang.name + ' (`' + id + '`)', dialect));
      }
    }
  }

  return ['| Language | Status | Human review | Cross-family review |',
    '| --- | --- | --- | --- |', ...rows].join('\n');
}

export {languageStatuses, statusTable};
