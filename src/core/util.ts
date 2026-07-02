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

// List the values a `start/interval` step fires on from `start` up to `max`,
// stepping by `interval`.
function getOccurrences(
  start: number,
  interval: number,
  max: number
): number[] {
  const occurrences = [];
  let value = start;

  while (value <= max) {
    occurrences.push(value);
    value += interval;
  }

  return occurrences;
}

// List the values a step fires on for a day-level field. The start may be a
// wildcard (`*`, begins at `min`), a single value, or a range (`a-b`), and
// range bounds may be names resolved via `numberMap`.
function enumerateStep(
  field: string,
  min: number,
  max: number,
  numberMap?: {[name: string]: number}
): number[] {
  const parts = field.split('/');
  const interval = +parts[1];

  if (includes(parts[0], '-')) {
    const bounds = parts[0].split('-');

    return getOccurrences(toFieldNumber(bounds[0], numberMap), interval,
      toFieldNumber(bounds[1], numberMap));
  }

  const start = parts[0] === '*' ? min : toFieldNumber(parts[0], numberMap);

  return getOccurrences(start, interval, max);
}

// Enumerate the values a field fires on within [min, max], expanding list
// segments that are ranges (wrap-aware) or steps (e.g. "9,17-19" or
// "9,17/2").
function enumerateFires(field: string, min: number, max: number): number[] {
  const fires: number[] = [];

  field.split(',').forEach(function expand(segment) {
    if (includes(segment, '/')) {
      fires.push(...enumerateStep(segment, min, max));
    }
    else if (includes(segment, '-')) {
      const bounds = segment.split('-');

      if (+bounds[0] <= +bounds[1]) {
        fires.push(...getOccurrences(+bounds[0], 1, +bounds[1]));
      }
      else {
        // A wrap-around range runs to the end of the cycle and resumes
        // from the start.
        fires.push(...getOccurrences(+bounds[0], 1, max));
        fires.push(...getOccurrences(min, 1, +bounds[1]));
      }
    }
    else {
      fires.push(+segment);
    }
  });

  return unique(fires);
}

export {enumerateFires, enumerateStep, getOccurrences, includes,
  isNonNegativeInteger, toFieldNumber, unique};
