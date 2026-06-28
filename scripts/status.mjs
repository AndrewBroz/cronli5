// The review-status table is generated from each module's status.json so the
// stable/beta labelling stays current and public. Reused by docs.mjs, so
// `npm run docs` keeps it current and `--check` gates drift. See
// tooling/docs/language-pipeline.md.
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
    (unit.humanReview || '—') + ' | ' + (unit.modelReview || '—') + ' |';
}

// Non-default sub-units of a language whose status diverges from it: dialect
// variants (`dialects`) and script/glyph variants (`variants`, e.g. zh-Hant).
// A sub-unit whose status matches its language is captured in status.json but
// left off the table to avoid restating "stable"/"beta".
function divergentSubUnits(lang) {
  return [...Object.entries(lang.dialects || {}),
    ...Object.entries(lang.variants || {})]
    .filter(([, unit]) => unit.status !== lang.status);
}

// A markdown table of each language's status, with a sub-row for any dialect or
// variant whose status diverges from its language (e.g. an experimental variant
// of a beta language).
function statusTable() {
  const rows = [];

  for (const lang of languageStatuses()) {
    rows.push(row(lang.name, lang));

    for (const [id, unit] of divergentSubUnits(lang)) {
      rows.push(row(lang.name + ' (`' + id + '`)', unit));
    }
  }

  return ['| Language | Status | Human review | Model review |',
    '| --- | --- | --- | --- |', ...rows].join('\n');
}

// A concise at-a-glance table — just each language's status tier — for the
// README, whose scope is a user intro. The full review evidence (human/model
// columns) lives in docs/language-status.md via statusTable().
function statusSummary() {
  const rows = [];

  for (const lang of languageStatuses()) {
    rows.push('| ' + lang.name + ' | ' + lang.status + ' |');

    for (const [id, unit] of divergentSubUnits(lang)) {
      rows.push('| ' + lang.name + ' (`' + id + '`) | ' + unit.status + ' |');
    }
  }

  return ['| Language | Status |', '| --- | --- |', ...rows].join('\n');
}

export {languageStatuses, statusSummary, statusTable};
