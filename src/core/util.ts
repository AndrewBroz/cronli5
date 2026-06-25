// Small shared utilities for the core.

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

// Recognize an arithmetic progression in a sorted, distinct numeric set: a
// run of length >= 5 whose consecutive gaps are all equal and >= 2. Returns
// its {start, interval, last}; null for anything shorter, with a gap of one
// (a plain run, which reads as a range), or irregular. Output-neutral and
// language-agnostic: renderers use it to speak a bounded/offset step cadence
// ("every N from M [through K]") instead of enumerating the fires. The set is
// the field's full value list, which the core has already sorted and deduped.
function arithmeticStep(values: number[]):
  {start: number; interval: number; last: number} | null {
  if (values.length < 5) {
    return null;
  }

  const interval = values[1] - values[0];

  if (interval < 2) {
    return null;
  }

  for (let i = 2; i < values.length; i += 1) {
    if (values[i] - values[i - 1] !== interval) {
      return null;
    }
  }

  return {start: values[0], interval, last: values[values.length - 1]};
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
export {
  arithmeticStep, includes, isNonNegativeInteger, toFieldNumber, unique
};
