// Which of the day's changes removed a real enumeration, and which only
// shortened or reworded a sentence the original budget never flagged?
// Renders the fuzz corpus with the renderers as they were before the
// length work (a checkout at BASE) and as they are now, and sorts every
// changed sentence shape by whether the OLD sentence was over the original
// budget of things named. Usage: node --import tsx audit.mjs <base-dir>
import {writeFileSync} from 'node:fs';
const [base] = process.argv.slice(2);
const here = process.cwd();
const {budget} = await import(here + '/tooling/scripts/conciseness.mjs');
const {patterns} = await import(here + '/scripts/fuzz-lang.mjs');
const before = (await import(base + '/src/all.ts')).default;
const after = (await import(here + '/src/all.ts')).default;
const THING = /\d+(?:(?::|\.(?=\d)| h | min |[時时点分月])\d+)*/gu;
const things = (text) => (text.match(THING) || []).length;
const shape = (text) => text.replace(/\d+/gu, 'N');
const say = (fn, cron, lang) => {
  const t = cron.trim().split(/\s+/u);
  try { return fn(cron, {lang, ...(t.length === 6 && /\d{4}/u.test(t[5]) ? {years: true} : {})}); }
  catch { return null; }
};
for (const lang of ['cs', 'de', 'es', 'fr', 'it', 'ja', 'pt', 'uk', 'zh']) {
  const seen = new Set(); const rows = [];
  for (const cron of patterns()) {
    const was = say(before, cron, lang); const now = say(after, cron, lang);
    if (!was || !now || was === now) continue;
    const key = shape(was) + '→' + shape(now);
    if (seen.has(key)) continue;
    seen.add(key);
    const over = things(was) - budget(cron) > 6;
    const kind = over ? 'ENUMERATION' : now.length > was.length ? 'LONGER' : 'ONLY-SHORTER';
    rows.push([kind, cron, was, now]);
  }
  const count = (k) => rows.filter((r) => r[0] === k).length;
  console.log(`${lang}: ${rows.length} changed shapes — enumeration removed ${count('ENUMERATION')}, only shorter ${count('ONLY-SHORTER')}, longer ${count('LONGER')}`);
  rows.sort((a, b) => a[0].localeCompare(b[0]));
  writeFileSync(`${here}/tooling/experiments/renderer-process/2026-11-13/audit/${lang}.tsv`,
    rows.map((r) => r.join('\t')).join('\n') + '\n');
}
