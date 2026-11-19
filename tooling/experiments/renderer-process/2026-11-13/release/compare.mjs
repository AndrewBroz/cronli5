// Compares recovered patterns with the originals by the schedule they fire.
import {readFileSync, existsSync} from 'node:fs';
import {analyze, prepare, denote, domainOf} from '/Users/andrewbroz/Code/personal/cronli5/src/core/index.ts';
import * as english from '/Users/andrewbroz/Code/personal/cronli5/src/lang/en/index.ts';
import {resolve} from '/Users/andrewbroz/Code/personal/cronli5/src/options.ts';
const D = process.argv[2];
const SETUP = {languages: [english.default], options: {}, styles: {}};
const FIELDS = ['second', 'minute', 'hour', 'month', 'year'];
const LEN = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const leap = (y) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
function keyOf(pattern) {
  if (pattern === 'NEVER') return 'NEVER';
  const {opts} = resolve(SETUP, {});
  const a = analyze(prepare(pattern, opts)).analyses;
  const vals = (f) => { const c = a.candidates[f]; return c ? denote(c[0], domainOf(f)) : null; };
  const all = (f) => { const d = domainOf(f); const out = []; for (let v = d.min; v <= d.max; v += 1) out.push(v); return out; };
  const months = vals('month') || all('month');
  let years = (vals('year') || []).filter((y) => y <= 2099);
  const day = a.day;
  let date = '*'; let weekday = '*';
  if (day.weekday) weekday = day.weekday.kind === 'quartz' ? JSON.stringify(day.weekday.form) : (vals('weekday') || []).join(',');
  if (day.date && day.date.kind === 'quartz') {
    const f = day.date.form; const need = f.kind === 'beforeLast' ? f.days + 1 : f.kind === 'nearestWeekday' ? f.day : 1;
    const ok = months.filter((m) => LEN[m] >= need);
    date = ok.length ? JSON.stringify(f) + '@' + ok.join(',') : 'NONE';
    if (ok.length === 1 && ok[0] === 2 && need === 29 && years.length) years = years.filter(leap);
  }
  else if (day.date) {
    const pairs = [];
    months.forEach((m) => (vals('date') || []).forEach((d) => { if (d <= LEN[m]) pairs.push(`${m}-${d}`); }));
    const whole = months.every((m) => { for (let d = 1; d <= LEN[m]; d += 1) if (!pairs.includes(`${m}-${d}`) && !(m === 2 && d === 29)) return false; return true; });
    date = pairs.length === 0 ? 'NONE' : whole ? '*' : pairs.join(',');
    if (pairs.length && pairs.every((x) => x === '2-29') && years.length) years = years.filter(leap);
  }
  if (day.dateAddsNothing) date = 'NONE';
  if (date === 'NONE' && weekday === '*') return 'NEVER';
  if (date === 'NONE') date = '';
  const hadYears = (vals('year') || []).length > 0;
  if (hadYears && years.length === 0) return 'NEVER';
  const dayKey = weekday === '*' ? date : date === '*' || date === '' ? `|${weekday}` : `${date}|${weekday}`;
  const monthKey = weekday !== '*' || date === '*' ? months.join(',') : '';
  return JSON.stringify([vals('second'), vals('minute'), vals('hour'), monthKey, dayKey, years.join(',')]);
}
const codes = process.argv.slice(3);
for (const code of codes) {
  const rec = `${D}/recovery/${code}.recovered.tsv`;
  if (!existsSync(rec)) { console.log(code, 'no file'); continue; }
  const key = new Map(readFileSync(`${D}/recovery-keys/${code}.key.tsv`, 'utf8').trim().split('\n').map((l) => l.split('\t')));
  const sent = new Map(readFileSync(`${D}/recovery/${code}.sentences.txt`, 'utf8').trim().split('\n').map((l) => [l.slice(0, l.indexOf('.')), l.slice(l.indexOf('.') + 2)]));
  let same = 0; const diff = []; const notes = [];
  for (const line of readFileSync(rec, 'utf8').trim().split('\n')) {
    const [n, got = '', note = ''] = line.split('\t');
    const want = key.get(n); if (!want) continue;
    let a; let b;
    try { a = keyOf(want); } catch (e) { a = 'ERR ' + e.message; }
    try { b = keyOf(got.trim()); } catch (e) { b = 'BAD ' + e.message.slice(0, 60); }
    if (a === b) { same += 1; if (/ALSO:/u.test(note)) notes.push(`${n}\t${want}\t${sent.get(n)}\t${note}`); }
    else diff.push(`${n}\t${want}\t=> ${got}\t${sent.get(n)}\t${note}${b.startsWith('BAD') ? '\t[' + b + ']' : ''}`);
  }
  console.log(`\n=== ${code}: ${same} of ${same + diff.length} recovered; ${diff.length} differ; ${notes.length} agree but note a second reading`);
  diff.forEach((d) => console.log('DIFF\t' + d));
  notes.forEach((d) => console.log('ALSO\t' + d));
}
