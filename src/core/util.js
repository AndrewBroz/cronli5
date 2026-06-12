// Small shared utilities for the core.

function includes(str, sub) {
  str += '';

  return str.indexOf(sub) !== -1;
}

// De-duplicate, preserving first-occurrence order.
function unique(items) {
  return Array.from(new Set(items));
}

// Whether a string consists solely of digits.
function isNonNegativeInteger(value) {
  const digits = /^\d+$/;

  return digits.test(value);
}

// Resolve a numeric or named field token (e.g. '5' or 'FRI') to its number.
function toFieldNumber(token, numberMap) {
  return isNonNegativeInteger(token) ? +token : numberMap[token.toUpperCase()];
}
export {includes, isNonNegativeInteger, toFieldNumber, unique};
