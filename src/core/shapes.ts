// Field-shape predicates over a canonical field value.

import {includes} from './util.js';

// Whether a field is a single concrete value (not a wildcard, list, range, or
// step).
function isSingleValue(field: string): boolean {
  return field !== '*' && !includes(field, ',') &&
    !includes(field, '-') && !includes(field, '/');
}

export {isSingleValue};
