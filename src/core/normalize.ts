// Canonicalize a validated cron-like object so every consumer faces
// canonical string fields: aliases applied, lists sorted and deduped,
// degenerate ranges and unit steps collapsed.

import {fieldOrder, fieldSpecs} from './specs.js';
import type {CronLike, FieldSpec} from './specs.js';
import type {Field, Pattern} from './ir.js';
import {includes, toFieldNumber, unique} from './util.js';
import {isQuartzDate, isQuartzWeekday} from './validate.js';

// The fixed-cycle time fields: their step intervals are measured against a
// closed cycle (60 seconds, 60 minutes, 24 hours), so a step is a true
// "every N" cadence only when it tiles that cycle. The calendar fields
// (date/month/weekday) have variable cycles and keep their step form.
const timeFieldCycle: Partial<Record<Field, number>> = {
  hour: 24,
  minute: 60,
  second: 60
};

// Quartz aliases: `?` reads "no specific value" (equivalent to `*`) in the
// date and weekday fields, and a bare `L` weekday means Saturday.
function applyQuartzAliases(cronPattern: CronLike): void {
  fieldOrder.forEach(function apply(field) {
    const aliases = fieldSpecs[field].aliases;
    const alias = aliases && aliases['' + cronPattern[field]];

    if (alias) {
      cronPattern[field] = alias;
    }
  });
}

// Normalize a validated cron-like object in place so the interpreters face
// canonical shapes: degenerate ranges (`9-9`) collapse to single values,
// duplicate list segments drop, and list segments sort into ascending fire
// order (so `17,9` reads "9:00 AM and 5:00 PM", not the reverse). The
// described schedule is identical; only the English reads better.
// After this pass every field is a canonical string, so the interpreters
// never need to coerce.
function normalizeCronPattern(cronPattern: CronLike): Pattern {
  fieldOrder.forEach(function normalize(field) {
    const value = '' + cronPattern[field];

    // Quartz tokens are already canonical single values.
    if (field === 'date' && isQuartzDate(value) ||
        field === 'weekday' && isQuartzWeekday(value, fieldSpecs[field])) {
      cronPattern[field] = value;

      return;
    }

    cronPattern[field] = normalizeField(value, field, fieldSpecs[field]);
  });

  // Every field is now a canonical string.
  return cronPattern as Pattern;
}

// Canonicalize a single validated field value to a string.
function normalizeField(value: string, field: Field, spec: FieldSpec): string {
  const stringValue = '' + value;

  if (stringValue === '*') {
    return stringValue;
  }

  const cycle = timeFieldCycle[field];
  const segments = stringValue.split(',').map(function canonical(segment) {
    return collapseFullSpanRange(
      enumerateNonUniformStep(
        collapseDegenerateRange(
          collapseOnceStep(collapseUnitStep(segment, spec), spec), spec),
        spec, cycle), spec);
  }).join(',').split(',');

  // A full-cycle segment covers the whole field.
  if (segments.indexOf('*') !== -1) {
    return '*';
  }

  return unique(segments).sort(function ascending(a, b) {
    return firstFire(a, spec) - firstFire(b, spec);
  }).join(',');
}

// An interval-one step enumerates every value from its start, so it reads
// as the equivalent range: `1/1` is `1-59` and `5-30/1` is `5-30`. A start
// at the bottom of the cycle covers the whole field (`0/1` is `*`).
function collapseUnitStep(segment: string, spec: FieldSpec): string {
  const parts = segment.split('/');

  if (!spec.cyclic || parts.length !== 2 || +parts[1] !== 1) {
    return segment;
  }

  const start = parts[0];

  if (includes(start, '-')) {
    return start;
  }

  if (start === '*' || toFieldNumber(start, spec.numbers) === spec.min) {
    return '*';
  }

  return start + '-' + spec.top;
}

// A step whose interval overshoots the field before a second fire enumerates
// only its start, so it reads as that single value: `*/24` is `0` and `1/24`
// is `1` (the next hour, 24 or 25, is out of range). Bounded steps (`9-17/24`)
// and the non-cyclic year field are left alone.
function collapseOnceStep(segment: string, spec: FieldSpec): string {
  const parts = segment.split('/');

  if (!spec.cyclic || typeof spec.top !== 'number' || parts.length !== 2 ||
      includes(parts[0], '-')) {
    return segment;
  }

  const start = parts[0];
  const first = start === '*' ? spec.min : toFieldNumber(start, spec.numbers);

  if (first + +parts[1] <= spec.top) {
    return segment;
  }

  return start === '*' ? '' + spec.min : start;
}

// An unbounded step in a fixed-cycle time field is a true "every N" cadence
// only when it tiles the cycle: the interval divides it evenly and the start
// falls within the first interval (`*/15`, `5/6`). A step that fails either
// test fires at irregular points within the cycle, so it reads as the literal
// list of those fires (`*/7` is `0,7,14,…`), the same as if it were written
// out. Calendar fields (no `cycle`), bounded steps (`9-17/2`, a per-window
// stride), and non-step segments are left untouched.
function enumerateNonUniformStep(
  segment: string,
  spec: FieldSpec,
  cycle: number | undefined
): string {
  const parts = segment.split('/');

  if (typeof cycle !== 'number' || parts.length !== 2 ||
      includes(parts[0], '-')) {
    return segment;
  }

  const interval = +parts[1];
  const start = parts[0] === '*' ? spec.min : toFieldNumber(parts[0]);

  if (cycle % interval === 0 && start < interval) {
    return segment;
  }

  const fires = [];

  for (let value = start; value <= (spec.top as number); value += interval) {
    fires.push(value);
  }

  return fires.join(',');
}

// A plain range whose enumerated values cover the whole field imposes no
// restriction, so it reads identically to `*` (`0-59` minute, `0-23` hour,
// `1-31` date, `1-12` month, and every seven-day weekday range — `0-6`,
// `1-7`, `0-7`, `SUN-SAT` — since cron's 7 is Sunday again, folding to the
// field minimum). Only bare ranges qualify: a step (`0-59/2`) keeps its
// cadence, so segments carrying a `/` are left untouched.
function collapseFullSpanRange(segment: string, spec: FieldSpec): string {
  if (typeof spec.top !== 'number' || includes(segment, '/') ||
      !includes(segment, '-')) {
    return segment;
  }

  const bounds = segment.split('-');
  const low = toFieldNumber(bounds[0], spec.numbers);
  const high = toFieldNumber(bounds[1], spec.numbers);

  if (low > high) {
    return segment;
  }

  // The full field is min..top; a value above top (weekday 7) folds to min.
  const top = spec.top as number;
  const fired: Record<number, boolean> = {};

  for (let value = low; value <= high; value += 1) {
    fired[value > top ? spec.min : value] = true;
  }

  for (let value = spec.min; value <= top; value += 1) {
    if (!fired[value]) {
      return segment;
    }
  }

  return '*';
}

// A degenerate range (`9-9`) fires once, so it reads as its single value.
// A stepped degenerate range (`9-9/5`) likewise fires only at its start.
function collapseDegenerateRange(segment: string, spec: FieldSpec): string {
  const start = segment.split('/')[0];

  if (!includes(start, '-')) {
    return segment;
  }

  const bounds = start.split('-');

  if (toFieldNumber(bounds[0], spec.numbers) !==
      toFieldNumber(bounds[1], spec.numbers)) {
    return segment;
  }

  return bounds[0];
}

// The first value a segment fires on, used to order list segments.
function firstFire(segment: string, spec: FieldSpec): number {
  const start = segment.split('/')[0].split('-')[0];

  return start === '*' ? spec.min : toFieldNumber(start, spec.numbers);
}
export {applyQuartzAliases, normalizeCronPattern};
