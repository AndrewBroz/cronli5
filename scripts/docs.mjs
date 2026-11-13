// Generate every piece of documentation that is derived from live
// library output, so nothing is hand-copied and CI can prove it current.
// Two kinds of generated content, both written in place:
//
//   1. Marker-bounded tables (`<!-- BEGIN GENERATED: name -->`): the
//      cronli5-vs-cRonstrue head-to-head, the per-language locale tables,
//      and the style comparison.
//   2. Inline examples: every `cronli5(<args>); // 'output'` line in the
//      docs has its `// 'output'` comment rewritten from live output.
//      The author still chooses the example and its order (the call); the
//      machine owns the result.
//
// Usage:
//   npm run docs              regenerate all derived docs in place
//   npm run docs -- --check   exit non-zero if any derived doc is stale
//
// Curated pattern sets: `basic` shows everyday lines where the libraries
// agree on meaning and differ only in voice; `showcase` shows compound
// patterns where folded output beats fragment assembly; the language set
// shows the same schedules across languages plus a few grammar-specific
// rows; the style set exercises the US/UK/house style axes.

import {readFileSync, writeFileSync} from 'node:fs';
import cronli5 from '../src/cronli5.js';
import cronstrue from 'cronstrue';
import cronstrueI18n from 'cronstrue/i18n.js';
import en, {styles as englishStyles} from '../src/lang/en/index.js';
import es from '../src/lang/es/index.js';
import ja from '../src/lang/ja/index.js';
import pt from '../src/lang/pt/index.js';
import de from '../src/lang/de/index.js';
import fr from '../src/lang/fr/index.js';
import uk from '../src/lang/uk/index.js';
import zh from '../src/lang/zh/index.js';
import {
  comparisonPatterns, languagePatterns, stylePatterns
} from './patterns.mjs';
import {statusSummary, statusTable} from './status.mjs';
import {table as cronstrueOptions} from '../src/cronstrue/table.js';
import {classify} from '../tooling/scripts/cronstrue-divergence.mjs';

const cronstrueVersion = JSON.parse(readFileSync(
  new URL('../node_modules/cronstrue/package.json', import.meta.url),
  'utf8')).version;

const languages = [
  {code: 'en', extras: [], lang: en},
  {code: 'uk', extras: [], lang: uk},
  {code: 'zh', cronstrueLocale: 'zh_CN', extras: [], lang: zh},
  {code: 'es', cronstrueLocale: 'es', extras: [], lang: es},
  {code: 'ja', cronstrueLocale: 'ja', extras: [], lang: ja},
  {code: 'pt', cronstrueLocale: 'pt_BR', extras: [], lang: pt},
  {code: 'de', cronstrueLocale: 'de', extras: [], lang: de},
  {code: 'fr', cronstrueLocale: 'fr', extras: [], lang: fr}
];

function describe(fn, pattern) {
  try {
    return fn(pattern);
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '' + error;

    return '*error: ' + message.replace(/`/g, '\'') + '*';
  }
}

// A markdown table; the separator row matches the header's column count.
function tableFrom(header, rows) {
  const cols = header.split('|').length - 2;
  const sep = '|' + ' --- |'.repeat(cols);

  return [header, sep, ...rows].join('\n');
}

// The class-grouped head-to-head: cronli5 in SENTENCE form (the capitalized
// standalone, `{form: 'sentence'}`) vs. cRonstrue (English), which always
// returns a capitalized sentence — a fair like-for-like. One markdown table
// per class, each preceded by an H3 heading, in simple -> medium -> complex
// order. Every pattern's group is asserted against the divergence engine's
// `classify`, so a mis-bucketed row fails `npm run docs` instead of shipping.
const comparisonHeadings = {
  simple: '### Simple &mdash; everyday cadences',
  medium: '### Medium &mdash; a specific schedule',
  complex: '### Complex &mdash; advanced operators and unions'
};

function comparisonTable(patterns) {
  const rows = patterns.map(function compare(pattern) {
    return '| `' + pattern + '` | ' +
      describe((p) => cronli5(p, {form: 'sentence'}), pattern) + ' | ' +
      describe((p) => cronstrue.toString(p), pattern) + ' |';
  });

  return tableFrom(
    '| Pattern | cronli5 (sentence form) | cRonstrue ' + cronstrueVersion +
    ' |', rows);
}

function renderComparison() {
  const sections = ['simple', 'medium', 'complex'].map(function section(cls) {
    const patterns = comparisonPatterns[cls];
    const misgrouped = patterns.filter((p) => classify(p) !== cls);

    if (misgrouped.length > 0) {
      throw new Error('comparisonPatterns.' + cls + ' contains rows that do ' +
        'not classify as ' + cls + ': ' + misgrouped.join(', '));
    }

    return comparisonHeadings[cls] + '\n\n' + comparisonTable(patterns);
  });

  return sections.join('\n\n');
}

function renderLanguageTable(language) {
  const rows = [...languagePatterns, ...language.extras].map(
    function compare(pattern) {
      return '| `' + pattern + '` | ' + describe(function ours(p) {
        return cronli5(p, {lang: language.lang});
      }, pattern) + ' | ' + describe(function their(p) {
        return cronstrueI18n.toString(p,
          {locale: language.cronstrueLocale || language.code});
      }, pattern) + ' |';
    });

  return tableFrom('| Pattern | cronli5 (' + language.code +
    ') | cRonstrue ' + cronstrueVersion + ' (' +
    (language.cronstrueLocale || language.code) + ' locale) |', rows);
}

// cRonstrue's description, via the i18n build for a locale (the default build
// for English, matching the head-to-head locale tables).
function cronstrueFor(code, pattern) {
  if (code === 'en') {
    return cronstrue.toString(pattern);
  }

  return cronstrueI18n.toString(pattern, {locale: code});
}

// One compound pattern, every language side by side against its cRonstrue
// locale — the head-to-head that shows folding vs. per-field assembly at a
// glance. Each row names the cronli5 module and the matching cRonstrue
// locale.
const headToHead = '5,10 30 9 * * MON';
const headToHeadRows = [
  {name: 'English', code: 'en'},
  {name: 'Ukrainian', code: 'uk'},
  {name: 'Chinese (Simplified)', code: 'zh', cronstrueLocale: 'zh_CN'},
  {name: 'Spanish', code: 'es', cronstrueLocale: 'es'},
  {name: 'Japanese', code: 'ja', cronstrueLocale: 'ja'},
  {name: 'Portuguese', code: 'pt', cronstrueLocale: 'pt_BR'},
  {name: 'German', code: 'de', cronstrueLocale: 'de'},
  {name: 'French', code: 'fr', cronstrueLocale: 'fr'}
];

function renderHeadToHead() {
  const byCode = Object.fromEntries(languages.map((l) => [l.code, l]));
  const rows = headToHeadRows.map(function row(entry) {
    const opts = {lang: byCode[entry.code].lang};

    return '| ' + entry.name + ' | ' +
      describe((p) => cronli5(p, opts), headToHead) + ' | ' +
      describe((p) => cronstrueFor(entry.cronstrueLocale || entry.code, p),
        headToHead) + ' |';
  });

  return tableFrom('| Language | cronli5 | cRonstrue ' + cronstrueVersion +
    ' |', rows);
}

// The named English styles, each as the options that select it.
const styleColumns = [
  ['us', {}],
  ['gb', {lang: 'en-GB'}],
  ['house', {style: englishStyles.house}]
];

function renderStyleTable() {
  const rows = stylePatterns.map(function compare(pattern) {
    return '| `' + pattern + '` | ' +
      styleColumns.map(function cell(column) {
        return describe((p) => cronli5(p, column[1]), pattern);
      }).join(' | ') + ' |';
  });

  return tableFrom('| Pattern | ' + styleColumns.map(function name(column) {
    return '`' + column[0] + '`';
  }).join(' | ') + ' |', rows);
}

// What the cRonstrue adapter does with each of cRonstrue's options, from
// the table the adapter itself runs on.
function renderCronstrueOptions() {
  return tableFrom('| cRonstrue option | In cronli5 | Notes |',
    cronstrueOptions.map(function row(entry) {
      return '| `' + entry.option + '` | ' + entry.becomes + ' | ' +
        entry.note + ' |';
    }));
}

// Replace the body between a table's BEGIN/END markers.
function inject(content, name, body, docName) {
  const begin = '<!-- BEGIN GENERATED: ' + name + ' -->';
  const end = '<!-- END GENERATED: ' + name + ' -->';
  const beginAt = content.indexOf(begin);
  const endAt = content.indexOf(end);

  if (beginAt === -1 || endAt === -1) {
    throw new Error('Missing GENERATED markers for "' + name + '" in ' +
      docName);
  }

  return content.slice(0, beginAt + begin.length) + '\n' + body + '\n' +
    content.slice(endAt);
}

// Collect simple `const name = <string|object|array literal>` bindings
// from a doc so example args that reference them (e.g. a reused pattern
// variable) can be evaluated. Only plain literals are matched, so the
// values are always safe to evaluate and `cronli5(...)` result bindings
// are naturally excluded.
function collectVars(text) {
  const vars = {};
  const re =
    /const\s+(\w+)(?::[^=]+)?\s*=\s*('[^']*'|\{[^}]*\}|\[[^\]]*\]);/g;

  for (let m = re.exec(text); m; m = re.exec(text)) {
    // eslint-disable-next-line no-new-func
    vars[m[1]] = Function('return (' + m[2] + ');')();
  }

  return vars;
}

// Evaluate a `cronli5(<args>)` example with the language modules and any
// doc-local bindings in scope; returns the description string, or null if
// the args reference something we cannot evaluate.
function evaluateExample(args, vars) {
  const names = Object.keys(vars);

  try {
    // eslint-disable-next-line no-new-func
    const run = Function('cronli5', 'en', ...names,
      'return cronli5(' + args + ');');

    return run(cronli5, en, ...names.map(function value(n) {
      return vars[n];
    }));
  }
  catch {
    return null;
  }
}

// Rewrite the `// 'output'` comment after each `cronli5(<args>)` example
// from live output. The author chooses the example; the machine owns the
// result.
function rewriteExamples(text) {
  const vars = collectVars(text);
  const re =
    /(cronli5\(([^)]*)\)[^\S\n]*;?[^\S\n]*(?:\n[^\S\n]*)?\/\/ ')([^']*)(')/g;
  let result = '';
  let last = 0;

  for (let m = re.exec(text); m; m = re.exec(text)) {
    const got = evaluateExample(m[2], vars);
    const replacement = typeof got === 'string' && !got.includes('\'') ?
      m[1] + got + m[4] :
      m[0];

    result += text.slice(last, m.index) + replacement;
    last = m.index + m[0].length;
  }

  return result + text.slice(last);
}

const tableJobs = {
  'README.md': {
    'cronstrue-head-to-head': renderHeadToHead(),
    'language-status': statusSummary()
  },
  'docs/language-status.md': {'language-status-detail': statusTable()},
  'docs/cronli5-vs-cronstrue.md': {comparison: renderComparison()},
  'docs/styles.md': {styles: renderStyleTable()},
  'docs/migrating-from-cronstrue.md': {
    'cronstrue-options': renderCronstrueOptions()
  }
};

for (const language of languages) {
  tableJobs['docs/lang/' + language.code + '.md'] = {
    comparison: renderLanguageTable(language)
  };
}

const docs = [
  'README.md', 'docs/language-status.md', 'docs/cronli5-vs-cronstrue.md',
  'docs/styles.md', 'docs/migrating-from-cronstrue.md',
  ...languages.map((language) => 'docs/lang/' + language.code + '.md')
];

const check = process.argv.includes('--check');
const stale = [];
let written = 0;

for (const doc of docs) {
  const url = new URL('../' + doc, import.meta.url);
  const current = readFileSync(url, 'utf8');
  let updated = current;

  for (const [name, body] of Object.entries(tableJobs[doc] || {})) {
    updated = inject(updated, name, body, doc);
  }

  updated = rewriteExamples(updated);

  if (updated !== current && check) {
    stale.push(doc);
  }
  else if (updated !== current) {
    writeFileSync(url, updated);
    written += 1;
    console.log('Updated ' + doc + '.');
  }
}

// What the 1.0 API replaced. A user-facing page that still shows one of
// these is teaching a call that now throws. The 0.x migration page and the
// changelog name them on purpose and are not checked.
const removedApi = [
  [/\bdialect:/u, '`dialect:`'],
  [/\bampm:/u, '`ampm:`'],
  [/\bsentence: true/u, '`sentence: true`'],
  [/\bquartz: true/u, '`quartz: true`'],
  [/\.sentence\(/u, '`.sentence(`'],
  [/\.fragment\(/u, '`.fragment(`']
];
const userFacing = docs;
const outdated = userFacing.flatMap(function scan(doc) {
  const text = readFileSync(new URL('../' + doc, import.meta.url), 'utf8');

  return removedApi.filter(function shown(entry) {
    return entry[0].test(text);
  }).map(function report(entry) {
    return doc + ' shows ' + entry[1];
  });
});

if (outdated.length > 0) {
  console.error('Docs show an API that 1.0 removed: ' + outdated.join('; ') +
    '.');
  process.exitCode = 1;
}

if (check && stale.length > 0) {
  console.error('Stale generated docs: ' + stale.join(', ') +
    '; run `npm run docs` to regenerate.');
  process.exitCode = 1;
}
else if (check) {
  console.log('All generated documentation is up to date.');
}
else {
  console.log(written ? 'Regenerated against cronstrue ' + cronstrueVersion +
    '.' : 'Documentation already up to date.');
}
