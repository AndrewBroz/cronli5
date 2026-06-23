// Derive playbook.json from the human-authored playbook.md (source of truth).
// The add-language workflow reads the json to know which universal traps to
// panel and which detectors to run. Run: node --import tsx scripts/playbook.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const base = join(dir, '..', '..', '.claude', 'skills', 'add-language');
const md = readFileSync(join(base, 'playbook.md'), 'utf8');

const parts = md.split(/\n## /u);

function sec(prefix) {
  return parts.find((p) => p.startsWith(prefix)) || '';
}

function bullets(body) {
  return body.split(/\n- /u).slice(1);
}

function tidy(s) {
  return s.replace(/\s+/gu, ' ').trim();
}

const traps = bullets(sec('Universal traps')).map(function trap(b) {
  const m = (/^\*\*`([a-z-]+)`\*\*\s*[—-]?\s*([\s\S]*)/u).exec(b);

  return m ? {id: m[1], summary: tidy(m[2])} : null;
}).filter(Boolean);

const detectors = bullets(sec('Detectors')).map(function det(b) {
  const m = (/^\*\*([a-z -]+)\*\*/u).exec(b);

  return m ? m[1].trim() : null;
}).filter(Boolean);

const lessons = bullets(sec('Appended lessons')).map(function lesson(b) {
  const m = (/^\*\((\d{4}-\d{2}-\d{2}), ([a-z-]+)\)\*\s*([\s\S]*)/u).exec(b);

  return m ? {date: m[1], lang: m[2], text: tidy(m[3])} : null;
}).filter(Boolean);

const json = {
  generated: 'scripts/playbook.mjs from playbook.md',
  traps, detectors, lessons
};

writeFileSync(join(base, 'playbook.json'),
  JSON.stringify(json, null, 2) + '\n');
console.log('playbook.json:', traps.length, 'traps,', detectors.length,
  'detectors,', lessons.length, 'lessons');
console.log('traps:', traps.map((t) => t.id).join(', '));
