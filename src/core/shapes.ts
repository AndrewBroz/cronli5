// Field-shape predicates: classify a canonical field value as a wildcard,
// single value, plain range, plain step, or list.

import {includes} from './util.js';

// Whether a field is a single concrete value (not a wildcard, list, range, or
// step).
function isSingleValue(field: string): boolean {
  return field !== '*' && !includes(field, ',') &&
    !includes(field, '-') && !includes(field, '/');
}

// Whether a field is a single plain range (not a list, step, or wildcard).
// Lists may contain range segments (e.g. "0-30,45"), so a bare `includes`
// check on "-" is not enough to treat the whole field as one range.
function isPlainRange(field: string): boolean {
  return includes(field, '-') && !includes(field, ',') &&
    !includes(field, '/');
}

// Whether a field is a single step (open or bounded), not a list. Lists may
// contain step segments (e.g. "0,30/5"), so a bare `includes` check on "/"
// is not enough to treat the whole field as one step.
function isPlainStep(field: string): boolean {
  return includes(field, '/') && !includes(field, ',');
}

// Whether a field is a single concrete value or a comma list of them.
function isDiscreteList(field: string): boolean {
  return field !== '*' && !includes(field, '-') && !includes(field, '/');
}

// Whether the hour field is discrete, a single value or a list (possibly
// containing range/step segments), rather than a wildcard, plain range, or
// plain step. Discrete hours expand into clock times.
function isDiscreteHours(hourField: string): boolean {
  return hourField !== '*' && !isPlainRange(hourField) &&
    !isPlainStep(hourField);
}

// Whether a field is an "open" step (`*/n` or `a/n`, not a bounded range or a
// list). Open steps read as a frequency rather than an enumeration.
function isOpenStep(field: string): boolean {
  return field.indexOf('/') !== -1 && field.indexOf('-') === -1 &&
    field.indexOf(',') === -1;
}
export {isDiscreteHours, isDiscreteList, isOpenStep, isPlainRange, isPlainStep,
  isSingleValue};
