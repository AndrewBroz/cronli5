// Canonicalize a validated cron-like object so every consumer faces
// canonical string fields: aliases applied, lists sorted and deduped,
// degenerate ranges and unit steps collapsed.

import {fieldOrder, fieldSpecs} from './specs.js';
import type {CronLike, FieldSpec} from './specs.js';
import type {Pattern} from './ir.js';
import {includes, toFieldNumber, unique} from './util.js';
import {isQuartzDate, isQuartzWeekday} from './validate.js';

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

    cronPattern[field] = normalizeField(value, fieldSpecs[field]);
  });

  // Every field is now a canonical string.
  return cronPattern as Pattern;
}

// Canonicalize a single validated field value to a string.
function normalizeField(value: string, spec: FieldSpec): string {
  const stringValue = '' + value;

  if (stringValue === '*') {
    return stringValue;
  }

  const segments = stringValue.split(',').map(function canonical(segment) {
    return collapseDegenerateRange(collapseUnitStep(segment, spec), spec);
  });

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
