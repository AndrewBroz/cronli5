// Generic pure helpers shared across the core.

// Whether a string contains a substring (coercing numbers to strings).
function includes(str: string | number, sub: string): boolean {
  return ('' + str).indexOf(sub) !== -1;
}

// De-duplicate, preserving first-occurrence order.
function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

// Whether a string consists solely of digits.
function isNonNegativeInteger(value: string): boolean {
  const digits = /^\d+$/;

  return digits.test(value);
}

// Resolve a numeric or named field token (e.g. '5' or 'FRI') to its number.
function toFieldNumber(
  token: string,
  numberMap?: {[name: string]: number}
): number {
  // A non-numeric token is always a name, and only the named fields (month,
  // weekday) reach here. They always have an associated `numberMap`.
  return isNonNegativeInteger(token) ? +token : numberMap![token.toUpperCase()];
}

export {includes, isNonNegativeInteger, toFieldNumber, unique};
