// Loosely validate a cron-like object against the field specifications,
// including Quartz tokens and wrap-around range rules.

import {fieldOrder, fieldSpecs} from './specs.js';
import type {CronLike, FieldSpec} from './specs.js';
import type {Field} from './ir.js';
import {includes, isNonNegativeInteger, toFieldNumber} from './util.js';

// Validate every field of a cron-like object, throwing on the first
// invalid value encountered.
function validateCronPattern(cronPattern: CronLike): CronLike {
  fieldOrder.forEach(function validate(field) {
    validateField(cronPattern[field], fieldSpecs[field], field);
  });

  return cronPattern;
}

// A field value must be a string or number resolving to '*', to a Quartz
// token (date and weekday fields only), or to a comma-separated list of
// valid segments.
function validateField(
  value: string | number,
  spec: FieldSpec,
  field: Field
): void {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throwInvalidField(value, field);
  }

  const stringValue = '' + value;

  if (stringValue === '*') {
    return;
  }

  // Quartz tokens stand alone as the whole field value.
  if (field === 'date' && isQuartzDate(stringValue) ||
      field === 'weekday' && isQuartzWeekday(stringValue, spec)) {
    return;
  }

  stringValue.split(',').forEach(function check(segment) {
    if (!isValidSegment(segment, spec)) {
      throwInvalidField(segment, field);
    }
  });
}

// Quartz day-of-month forms: `L` (last day), `LW`/`WL` (last weekday),
// `L-n` (n days before the last day, 1-30), and `nW`/`Wn` (the weekday
// nearest day n). Quartz allows these only as the whole field value.
function isQuartzDate(value: string): boolean {
  if (value === 'L' || value === 'LW' || value === 'WL') {
    return true;
  }

  const offset = (/^L-(\d{1,2})$/).exec(value);

  if (offset) {
    return +offset[1] >= 1 && +offset[1] <= 30;
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(value);

  if (nearest) {
    const day = +(nearest[1] || nearest[2]);

    return day >= 1 && day <= 31;
  }

  return false;
}

// Quartz day-of-week forms: `nL` (the last <weekday> of the month) and
// `n#m` (the mth <weekday> of the month, m 1-5), where n may be a number
// or a name. A bare `L` is aliased to Saturday before validation.
function isQuartzWeekday(value: string, spec: FieldSpec): boolean {
  // A bare `L` falls out naturally: its empty stem is not a valid single.
  if ((/L$/).test(value)) {
    return isValidSingle(value.slice(0, -1), spec);
  }

  const parts = value.split('#');

  if (parts.length === 2) {
    return isValidSingle(parts[0], spec) && (/^[1-5]$/).test(parts[1]);
  }

  return false;
}

// A segment is a step (`*/5`, `2/3`), a range (`1-5`, `MON-FRI`), or a
// single value (`30`, `FRI`).
function isValidSegment(segment: string, spec: FieldSpec): boolean {
  if (includes(segment, '/')) {
    return isValidStep(segment, spec);
  }

  if (includes(segment, '-')) {
    return isValidRange(segment, spec);
  }

  return isValidSingle(segment, spec);
}

// A step is `<start>/<interval>` where start is `*`, a single, or a range
// and interval is a positive integer.
function isValidStep(segment: string, spec: FieldSpec): boolean {
  const parts = segment.split('/');

  if (parts.length !== 2 || !isNonNegativeInteger(parts[1]) ||
      +parts[1] < 1) {
    return false;
  }

  return parts[0] === '*' || isValidSingle(parts[0], spec) ||
    isValidRange(parts[0], spec, true);
}

// A range is `<start>-<end>` where both ends are valid singles. A reversed
// range wraps around the cycle (`22-2` is an overnight window) and is
// allowed in cyclic fields, but not where ordering is structural: inside
// step bounds (`requireOrdered`) or in the non-cyclic year field.
function isValidRange(
  segment: string,
  spec: FieldSpec,
  requireOrdered?: boolean
): boolean {
  const parts = segment.split('-');

  if (parts.length !== 2) {
    return false;
  }

  if (!isValidSingle(parts[0], spec) || !isValidSingle(parts[1], spec)) {
    return false;
  }

  if (spec.cyclic && !requireOrdered) {
    return true;
  }

  return toFieldNumber(parts[0], spec.numbers) <=
    toFieldNumber(parts[1], spec.numbers);
}

// A single value is an in-range integer or a recognized name.
function isValidSingle(value: string, spec: FieldSpec): boolean {
  if (value === '*') {
    return false;
  }

  if (isNonNegativeInteger(value)) {
    return +value >= spec.min && +value <= spec.max;
  }

  if (spec.numbers) {
    return value.toUpperCase() in spec.numbers;
  }

  return false;
}

// Throw a descriptive error for an invalid field value.
function throwInvalidField(value: string | number, field: Field): never {
  throw new Error('`cronli5` was passed an invalid field value "' +
    value + '" for the ' + field + ' field.');
}
export {isQuartzDate, isQuartzWeekday, validateCronPattern};
