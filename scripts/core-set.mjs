// Generate the fixed core pattern set every language corpus must cover.
// Deterministically sweep a defined grid, bucket each pattern by its
// language-neutral IR cell (the branch-tuple analyze() produces), and keep one
// representative per cell. Saves test/core/core-set.json — the committed
// contract. Run: node --import tsx scripts/core-set.mjs
//
// Coverage in IR cells is option-blind, so the set also carries `variants`
// (cell-identical but render-distinct under an option — 12h, short, dialect,
// seconds, years, the half/quarter and fires-once edges), `macros` (@reboot
// etc., which bypass analyze), and `invalid` (the lenient fallback). A corpus
// must cover the cells AND test the variants/macros/invalid.
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {analyze, prepare} from '../src/core/index.js';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..',
  'test', 'core', 'core-set.json');

const FORMS = {
  second: ['*', '0', '1', '30', '*/15', '0-10', '5,30'],
  minute: ['*', '0', '1', '15', '30', '45', '*/2', '*/15', '0-30', '5,30',
    '9-17'],
  hour: ['*', '0', '1', '12', '13', '23', '*/2', '*/3', '1/2', '9-17',
    '9-17/2', '9,17', '22-2', '9,11,13,15,17,19,21'],
  date: ['*', '1', '15', '*/2', '*/3', '1-15', '1,15', 'L', '15W'],
  month: ['*', '1', '6', '*/2', '*/3', '1-3', '1,7', '6-8', '11-2'],
  weekday: ['*', '0', '1', '7', 'MON', '*/2', '1-5', '1,3', 'FRI-MON', '5L',
    '1#2'],
  year: ['2030', '*/2', '2030-2032']
};

// Representative time prefixes (second minute hour) covering the plan lattice,
// and day suffixes (date month weekday) covering the qualifier rules. Their
// cross product is the compound time x qualifier space the isolated sweeps
// never reach.
const TIME_PREFIXES = [
  '0 0 9', '0 30 14', '0 */5 *', '0 */5 9-17', '0 */5 */2', '0 */5 9,17',
  '0 0 9-17', '0 5,10 9,17', '30 5 9', '30 5,10 9,17,19,21,23', '0 0 */2',
  '0 0 22-2'
];
const DAY_SUFFIXES = [
  '* * *', '1 * *', '*/2 * *', '1 6 *', '* 6 *', '* */3 *', '* * 1',
  '* * 1-5', '1 * 5', '1 6 5', 'L * *', '* * 5L'
];

const MACROS = ['@reboot', '@daily', '@hourly', '@weekly', '@monthly',
  '@yearly', '@annually', '@midnight'];
const INVALID = ['not a cron pattern', '99 * * * *'];

// Value classes the IR cell erases (a step and a list are one cell regardless
// of their numbers), but which a corpus must test because rendering and
// correctness turn on them: divisor vs non-divisor steps, near-cycle steps
// that fire ≤2 times, list cardinality and regularity, mixed-segment fields,
// and range widths. One representative per class, across the fields whose
// rendering differs (numeric minute/hour/date vs named month/weekday).
const VALUE_CLASSES = [
  // steps: N divides the cycle (clean cadence) vs not (irregular wrap).
  {pattern: '*/7 * * * *', cls: 'minute step, non-divisor of 60'},
  {pattern: '*/11 * * * *', cls: 'minute step, non-divisor'},
  {pattern: '*/25 * * * *', cls: 'minute step fires 3× (0,25,50)'},
  {pattern: '0 */5 * * *', cls: 'hour step, non-divisor of 24'},
  {pattern: '0 */7 * * *', cls: 'hour step, non-divisor'},
  {pattern: '0 */13 * * *', cls: 'hour step fires 2× (0,13)'},
  {pattern: '*/15 */5 * * *', cls: 'minute cadence under non-divisor hours'},
  {pattern: '0 0 */7 * *', cls: 'date step, non-divisor of 31'},
  {pattern: '0 0 */10 * *', cls: 'date step (1,11,21,31)'},
  {pattern: '0 0 * */5 *', cls: 'month step, non-divisor (1,6,11)'},
  {pattern: '0 0 * */7 *', cls: 'month step fires 2× (1,8)'},
  {pattern: '0 0 * * */4', cls: 'weekday step, non-divisor of 7 (0,4)'},
  {pattern: '*/7 * * * * *', cls: 'second step, non-divisor'},
  // lists: 2 vs 3+, regular vs irregular spacing, mixed segments.
  {pattern: '4,6,9 * * * *', cls: 'minute list, 3 items irregular'},
  {pattern: '5,17,42 * * * *', cls: 'minute list, irregular'},
  {pattern: '0,20,40 * * * *', cls: 'minute list, 3 items regular'},
  {pattern: '0-10,30 * * * *', cls: 'minute list with a range segment'},
  {pattern: '0,30/5 * * * *', cls: 'minute list with a step segment'},
  {pattern: '0 0 1,3,8 * *', cls: 'date list, irregular'},
  {pattern: '0 0 * 2,5,9 *', cls: 'month list, 3 names'},
  {pattern: '0 0 * * 1,3,5', cls: 'weekday list (Mon/Wed/Fri)'},
  {pattern: '0 0 * * 0,6', cls: 'weekday list (weekend)'},
  {pattern: '0 0 1-5,10,20-25 * *', cls: 'date, multiple ranges + single'},
  // ranges: narrow / wide / near-full.
  {pattern: '* 9-10 * * *', cls: 'hour range, narrow (one hour)'},
  {pattern: '0-58 9 * * *', cls: 'minute range, wide'},
  {pattern: '0 1-23 * * *', cls: 'hour range, near-full'},
  // quartz operators beyond L/W/#: last-weekday, nth-from-last, and ? (the
  // no-specific-value alias for the date/weekday fields).
  {pattern: '0 0 LW * *', cls: 'quartz: last weekday of the month'},
  {pattern: '0 0 L-3 * *', cls: 'quartz: nth day before the last (L-3)'},
  {pattern: '0 0 ? * MON', cls: 'quartz ? (no-specific-value) date field'},
  {pattern: '0 0 1 * ?', cls: 'quartz ? weekday field'},
  // second-field value variety (parallels the minute classes).
  {pattern: '4,17,42 * * * * *', cls: 'second list, irregular'},
  // year-field value variety (7-field so the year is unambiguously last).
  {pattern: '0 0 0 1 1 * 2030,2035', cls: 'year list'},
  {pattern: '0 0 0 1 1 * 2030-2035', cls: 'year range'}
];

// Cell-identical to a pattern already in the set, but rendered differently
// under an option — so a corpus must test them explicitly.
const VARIANTS = [
  {pattern: '0 9 * * *', opts: {ampm: true}, why: '12-hour / day-period'},
  {pattern: '30 14 * * *', opts: {ampm: true}, why: 'afternoon period'},
  {pattern: '15 9 * * *', opts: {}, why: 'quarter-past idiom'},
  {pattern: '45 9 * * *', opts: {}, why: 'three-quarter idiom'},
  {pattern: '0 9-17 * * *', opts: {short: true}, why: 'short forms'},
  {pattern: '0 0 1 1 * 2030', opts: {years: true}, why: 'explicit year'},
  {pattern: '0 9 * * MON', opts: {dialect: 'gb'}, why: 'dialect'},
  {pattern: '*/24 * * * *', opts: {}, why: 'fires-once step collapses'},
  {pattern: '0 0 * * 7', opts: {}, why: 'weekday 7 = Sunday'}
];

function planKey(plan) {
  if (!plan) {
    return 'none';
  }

  const part = {kind: plan.kind};

  ['singleSecond', 'form', 'fold', 'minuteForm'].forEach(function add(field) {
    if (field in plan) {
      part[field] = plan[field];
    }
  });
  if (plan.hours) {
    part.hours = plan.hours.kind;
  }
  if (plan.rest) {
    part.rest = JSON.parse(planKey(plan.rest));
  }

  return JSON.stringify(part);
}

function bucket(field, shape) {
  if (field === '*') {
    return '-';
  }
  if (shape === 'quartz') {
    return 'quartz';
  }
  if (shape === 'step') {
    return 'step';
  }

  return shape === 'single' ? 'single' : 'multi';
}

function qualKey(ir) {
  const p = ir.pattern;
  const s = ir.shapes;

  return JSON.stringify({
    date: bucket(p.date, s.date),
    month: bucket(p.month, s.month),
    weekday: bucket(p.weekday, s.weekday),
    year: bucket(p.year, s.year),
    or: p.date !== '*' && p.weekday !== '*'
  });
}

function cellOf(pattern, opts) {
  try {
    const ir = analyze(prepare(pattern, opts));

    return planKey(ir.plan) + '||' + qualKey(ir);
  }
  catch {
    return null;
  }
}

function corpusCell(pattern) {
  // A trailing 4-digit token is a year field, not a weekday — so a 6-token
  // pattern like "0 0 1 1 * 2030" is minute..weekday + year (no seconds), and a
  // 7-token one adds seconds. Without this, the year is parsed as a weekday,
  // analyze throws, and the cell collapses to an uncoverable null.
  const tokens = pattern.trim().split(/\s+/u);
  const years = (/\d{4}/u).test(tokens[tokens.length - 1]);
  const seconds = years ? tokens.length >= 7 : tokens.length >= 6;

  return cellOf(pattern, {seconds, years});
}

function coreCells(coreSet) {
  return new Set(coreSet.patterns.map(corpusCell));
}

function *candidates() {
  for (const sec of FORMS.second) {
    for (const min of FORMS.minute) {
      for (const hr of FORMS.hour) {
        yield [`${sec} ${min} ${hr} * * *`, {seconds: true, years: false}];
      }
    }
  }
  for (const dt of FORMS.date) {
    for (const mo of FORMS.month) {
      for (const wd of FORMS.weekday) {
        yield [`0 0 ${dt} ${mo} ${wd}`, {seconds: false, years: false}];
      }
    }
  }
  for (const time of TIME_PREFIXES) {
    for (const day of DAY_SUFFIXES) {
      yield [`${time} ${day}`, {seconds: true, years: false}];
    }
  }
  for (const yr of FORMS.year) {
    yield [`0 0 1 1 * ${yr}`, {seconds: false, years: true}];
  }
  for (const {pattern} of VALUE_CLASSES) {
    yield [pattern, {seconds: pattern.split(' ').length >= 6, years: false}];
  }
}

export {cellOf, corpusCell, coreCells};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const byCell = new Map();

  for (const [pattern, opts] of candidates()) {
    const cell = cellOf(pattern, opts);

    if (cell && !byCell.has(cell)) {
      byCell.set(cell, pattern);
    }
  }

  const out = {
    generated: 'scripts/core-set.mjs',
    cells: byCell.size,
    patterns: [...byCell.values()].sort(),
    valueClasses: VALUE_CLASSES,
    variants: VARIANTS,
    macros: MACROS,
    invalid: INVALID
  };

  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log('core set: ' + byCell.size + ' cells, ' +
    VALUE_CLASSES.length + ' value classes, ' + VARIANTS.length +
    ' variants, ' + MACROS.length + ' macros → ' + OUT);
}
