/**
 * @license MIT, Copyright (c) 2026 Andrew Brož
 */

// English number names for the integers zero through ten.
const numbers = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten'
];

// Ordinal suffixes.
const suffixes = [
  'th',
  'st',
  'nd',
  'rd'
];

// English month names.
const monthNames = [
  null,
  ['January', 'Jan'],
  ['February', 'Feb'],
  ['March', 'Mar'],
  ['April', 'Apr'],
  ['May', 'May'],
  ['June', 'Jun'],
  ['July', 'Jul'],
  ['August', 'Aug'],
  ['September', 'Sep'],
  ['October', 'Oct'],
  ['November', 'Nov'],
  ['December', 'Dec']
];

// English weekday names.
const weekdayNames = [
  ['Sunday', 'Sun'],
  ['Monday', 'Mon'],
  ['Tuesday', 'Tue'],
  ['Wednesday', 'Wed'],
  ['Thursday', 'Thu'],
  ['Friday', 'Fri'],
  ['Saturday', 'Sat']
];

// Month names by abbreviation.
const monthAbbreviations = {
  '*': ['month', 'month'],
  JAN: monthNames[1],
  FEB: monthNames[2],
  MAR: monthNames[3],
  APR: monthNames[4],
  MAY: monthNames[5],
  JUN: monthNames[6],
  JUL: monthNames[7],
  AUG: monthNames[8],
  SEP: monthNames[9],
  OCT: monthNames[10],
  NOV: monthNames[11],
  DEC: monthNames[12]
};

// Weekday name by abbreviation.
const weekdayAbbreviations = {
  '*': ['day', 'day'],
  SUN: weekdayNames[0],
  MON: weekdayNames[1],
  TUE: weekdayNames[2],
  WED: weekdayNames[3],
  THU: weekdayNames[4],
  FRI: weekdayNames[5],
  SAT: weekdayNames[6]
};

// Weekday index by abbreviation, used to resolve named step bounds.
const weekdayNumbers = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
};

// Month number by abbreviation, used to resolve named step bounds.
const monthNumbers = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12
};

// Allowed numeric ranges (and name tables, where applicable) per field.
// Cyclic fields wrap, so a reversed range (`22-2`) is a meaningful
// wrap-around window there; the year field does not wrap. `top` is the last
// value a step enumerates to — for weekdays it is Saturday (6), below the
// validation `max` of 7, which is Sunday again.
const fieldSpecs = {
  second: {cyclic: true, max: 59, min: 0, top: 59},
  minute: {cyclic: true, max: 59, min: 0, top: 59},
  hour: {cyclic: true, max: 23, min: 0, top: 23},
  date: {cyclic: true, max: 31, min: 1, top: 31},
  month: {cyclic: true, max: 12, min: 1, names: monthAbbreviations,
    numbers: monthNumbers, top: 12},
  weekday: {cyclic: true, max: 7, min: 0, names: weekdayAbbreviations,
    numbers: weekdayNumbers, top: 6},
  year: {max: 9999, min: 1970}
};

// The order in which fields are validated.
const fieldOrder = [
  'second',
  'minute',
  'hour',
  'date',
  'month',
  'weekday',
  'year'
];

// Nickname macros (e.g. `@daily`) expand to their five-field equivalents.
// `@reboot` has no time schedule and so is intentionally omitted.
const macros = {
  '@annually': '0 0 1 1 *',
  '@yearly':   '0 0 1 1 *',
  '@monthly':  '0 0 1 * *',
  '@weekly':   '0 0 * * 0',
  '@daily':    '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly':   '0 * * * *'
};

// A cron pattern to English interpreter.
//
// `options` include:
// - ampm (boolean):
//     use AM/PM instead of zero-padded 24-hour time
// - seconds (boolean):
//     always treat the first value in a string or array as a second
// - short (boolean):
//     use shorthand and numeric representations
// - years (boolean):
//     read the trailing field of a six-field pattern as a year (seven-field
//     patterns always parse seconds first and year last)
function cronli5(cronPattern, options) {
  const opts = normalizeOptions(options);

  if (!opts.lenient) {
    return interpretCronPattern(cronPattern, opts);
  }

  // Lenient mode never throws: unparseable input yields a fixed fallback
  // description instead, so arbitrary user crontabs are safe to render.
  try {
    return interpretCronPattern(cronPattern, opts);
  }
  catch {
    return 'an unrecognizable cron pattern';
  }
}

// Parse, validate, normalize, and describe a cron pattern.
function interpretCronPattern(cronPattern, opts) {
  // `@reboot` runs on startup and has no field schedule to interpret.
  if (typeof cronPattern === 'string' &&
      cronPattern.trim().toLowerCase() === '@reboot') {
    return 'at system startup';
  }

  cronPattern = parseCronPattern(cronPattern, opts);

  applyQuartzAliases(cronPattern);
  validateCronPattern(cronPattern);
  normalizeCronPattern(cronPattern);

  const description = interpretSeconds(cronPattern, opts)
      || interpretMinutes(cronPattern, opts)
      || interpretHours(cronPattern, opts);

  return applyYear(description, cronPattern, opts);
}

// A trailing day-level qualifier for bare frequencies, e.g. " on Monday",
// " on the 13th", " in January", or " on January 13th". Returns an empty
// string when no date, month, or weekday is set.
function trailingQualifier(cronPattern, opts) {
  // Standard cron fires when day-of-month OR day-of-week matches, when both
  // are restricted.
  if (cronPattern.date !== '*' && cronPattern.weekday !== '*') {
    return ' ' + interpretDateOrWeekday(cronPattern, opts);
  }

  if (cronPattern.date !== '*') {
    const quartzDate = quartzDatePhrase(cronPattern.date, opts);

    if (quartzDate) {
      return ' ' + quartzDate + monthScope(cronPattern, opts);
    }

    if (isOpenStep(cronPattern.date)) {
      return ' on ' + interpretStepDates(cronPattern.date) +
        monthScope(cronPattern, opts);
    }

    if (isOpenStep(cronPattern.month)) {
      return ' on the ' + interpretDateOrdinals(cronPattern.date) +
        monthScope(cronPattern, opts);
    }

    if (cronPattern.month !== '*') {
      return ' on ' + interpretMonthNames(cronPattern.month, opts) + ' ' +
        interpretDateOrdinals(cronPattern.date);
    }

    return ' on the ' + interpretDateOrdinals(cronPattern.date);
  }

  // A weekday qualifier, optionally scoped to a month ("on Monday in June").
  if (cronPattern.weekday !== '*') {
    const weekdays = quartzWeekdayPhrase(cronPattern.weekday, opts) ||
      'on ' + interpretWeekdays(cronPattern, opts);

    return ' ' + weekdays + monthScope(cronPattern, opts);
  }

  if (cronPattern.month !== '*') {
    return ' in ' + interpretMonthNames(cronPattern.month, opts);
  }

  return '';
}

// English ordinals for Quartz `#` weekday occurrences (1-5).
const nthWeekdayNames = [null, 'first', 'second', 'third', 'fourth', 'fifth'];

// The day-qualifier phrase for a Quartz date field (e.g. "on the last day
// of the month"), or undefined when the field is not a Quartz form.
function quartzDatePhrase(dateField, opts) {
  dateField = '' + dateField;

  if (dateField === 'L') {
    return 'on the last day of the month';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'on the last weekday of the month';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    const unit = +offset[1] === 1 ? 'day' : 'days';

    return getNumber(+offset[1], opts) + ' ' + unit +
      ' before the last day of the month';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    return 'on the weekday nearest the ' +
      getOrdinal(nearest[1] || nearest[2]);
  }
}

// The day-qualifier phrase for a Quartz weekday field (e.g. "on the last
// Friday of the month"), or undefined when the field is not a Quartz form.
function quartzWeekdayPhrase(weekdayField, opts) {
  weekdayField = '' + weekdayField;

  const parts = weekdayField.split('#');

  if (parts.length === 2) {
    return 'on the ' + nthWeekdayNames[+parts[1]] + ' ' +
      getWeekday(parts[0], opts) + ' of the month';
  }

  if (weekdayField !== 'L' && (/L$/).test(weekdayField)) {
    return 'on the last ' +
      getWeekday(weekdayField.slice(0, -1), opts) + ' of the month';
  }
}

// Append or fold the year field into a finished description. An explicitly
// supplied year is always rendered. A single year reads naturally folded
// into a specific calendar date ("on January 1st, 2030 at noon"); otherwise
// it trails the description ("every Friday at 1:00 PM in 2030").
function applyYear(description, cronPattern, opts) {
  const yearField = '' + cronPattern.year;

  if (yearField === '*') {
    return description;
  }

  if (includes(yearField, '/')) {
    return description + ' ' + interpretStepYears(yearField, opts);
  }

  const label = interpretYearLabel(yearField);

  if (!includes(yearField, '-') && !includes(yearField, ',') &&
      cronPattern.date !== '*' && includes(description, ' at ')) {
    return description.replace(' at ', ', ' + label + ' at ');
  }

  return description + ' in ' + label;
}

// Turn a single year, a range, or a list into a noun phrase.
function interpretYearLabel(yearField) {
  if (includes(yearField, ',')) {
    return joinList(yearField.split(','));
  }

  return yearField;
}

// Describe a repeating year step, e.g. "every two years" or, with a start,
// "every two years from 2030".
function interpretStepYears(yearField, opts) {
  const parts = yearField.split('/');
  const interval = +parts[1];
  const start = parts[0];

  if (interval <= 1) {
    return 'every year';
  }

  let phrase = 'every ' + getNumber(interval, opts) + ' years';

  if (start !== '*' && start !== '0') {
    phrase += ' from ' + start;
  }

  return phrase;
}

// Normalize raw user options into a complete options object that is threaded
// through interpretation instead of relying on shared module-level state.
function normalizeOptions(options) {
  options = options || {};

  return {
    ampm: typeof options.ampm === 'boolean' ? options.ampm : true,
    lenient: !!options.lenient,
    seconds: !!options.seconds,
    short: !!options.short,
    years: !!options.years
  };
}

// Take a cron pattern as, a cron pattern string, an array of cron fields, a
// cron-like object (see the final return statement for the format of a
// cron-like object), or a stringable object that evaluates to a cron pattern
// string. Returns a cron-like object.
function parseCronPattern(cronPattern, opts) {
  const isArray = cronPattern instanceof Array;
  const isEmpty = cronPattern === null ||
    typeof cronPattern === 'undefined' ||
    cronPattern === '' ||
    isArray && cronPattern.length === 0;

  // Throw if null or empty.
  if (isEmpty) {
    throw new Error(
      '`cronli5` expects a non-empty cron pattern as the first argument.');
  }

  if (isArray) {
    return cronifyArray(cronPattern, opts);
  }

  if (typeof cronPattern === 'object') {
    return cronifyObject(cronPattern);
  }

  if (typeof cronPattern === 'string') {
    return cronifyString(cronPattern, opts);
  }

  throw new Error('`cronli5` was passed an unexpected type.');
}

// Turn a cronable array into a cron-like object. A seven-field pattern is
// unambiguous (seconds first, year last); six fields default to seconds
// first, with the `years` option reading the trailing field as a year
// instead.
function cronifyArray(cronlikeArray, opts) {
  if (cronlikeArray.length > 7) {
    throw new Error('`cronli5` was passed a cron pattern with more than ' +
      getNumber(7, opts) + ' fields.');
  }

  if (!opts.seconds && cronlikeArray.length < (opts.years ? 7 : 6)) {
    cronlikeArray.unshift('0');
  }

  return {
    second:  cronlikeArray[0] || '0',
    minute:  cronlikeArray[1] || '*',
    hour:    cronlikeArray[2] || '*',
    date:    cronlikeArray[3] || '*',
    month:   cronlikeArray[4] || '*',
    weekday: cronlikeArray[5] || '*',
    year:    cronlikeArray[6] || '*'
  };
}

// Turn an object that's already cron-like into a populated cron-like object.
function cronifyObject(cronable) {
  if (!cronable.second && !cronable.minute && !cronable.hour) {
    throw new Error(
      '`cronli5` expects that any object being interpreted as a cron ' +
      'pattern have at least one of the following properties: `second`, ' +
      '`minute`, or `hour`');
  }

  const hasSecond = typeof cronable.second !== 'undefined';
  const hasMinute = typeof cronable.minute !== 'undefined';
  const defaultMinute = hasSecond ? '*' : '0';
  const defaultHour = hasSecond || hasMinute ? '*' : '0';

  return {
    second:  pick(cronable.second, '0'),
    minute:  pick(cronable.minute, defaultMinute),
    hour:    pick(cronable.hour, defaultHour),
    date:    pick(cronable.date, '*'),
    month:   pick(cronable.month, '*'),
    weekday: pick(cronable.weekday, '*'),
    year:    pick(cronable.year, '*')
  };
}

// Return a provided field value, or a fallback when the value is absent.
// Unlike `||`, this preserves falsy-but-present values (e.g. `0`, `NaN`)
// so that they can be flagged as invalid during validation.
function pick(value, fallback) {
  return typeof value === 'undefined' ? fallback : value;
}

// Turn a string into a cron-like object.
function cronifyString(cronString, opts) {
  const cronlikeArray = expandMacro(cronString).split(/\s+/);

  return cronifyArray(cronlikeArray, opts);
}

// Expand a recognized nickname macro (e.g. `@daily`) into its equivalent
// cron string, leaving any other string untouched. `@reboot` has no field
// schedule and is handled directly in `cronli5`, before this point.
function expandMacro(cronString) {
  const trimmed = cronString.trim();

  if (trimmed.charAt(0) !== '@') {
    return cronString;
  }

  const macro = trimmed.toLowerCase();

  if (Object.hasOwn(macros, macro)) {
    return macros[macro];
  }

  throw new Error('`cronli5` does not recognize the macro `' + trimmed + '`.');
}

// Validate every field of a cron-like object, throwing on the first
// invalid value encountered.
function validateCronPattern(cronPattern) {
  fieldOrder.forEach(function validate(field) {
    validateField(cronPattern[field], fieldSpecs[field], field);
  });

  return cronPattern;
}

// Quartz aliases: `?` reads "no specific value" (equivalent to `*`) in the
// date and weekday fields, and a bare `L` weekday means Saturday.
function applyQuartzAliases(cronPattern) {
  if ('' + cronPattern.date === '?') {
    cronPattern.date = '*';
  }

  if ('' + cronPattern.weekday === '?') {
    cronPattern.weekday = '*';
  }

  if ('' + cronPattern.weekday === 'L') {
    cronPattern.weekday = '6';
  }
}

// Normalize a validated cron-like object in place so the interpreters face
// canonical shapes: degenerate ranges (`9-9`) collapse to single values,
// duplicate list segments drop, and list segments sort into ascending fire
// order (so `17,9` reads "9:00 AM and 5:00 PM", not the reverse). The
// described schedule is identical; only the English reads better.
function normalizeCronPattern(cronPattern) {
  fieldOrder.forEach(function normalize(field) {
    const value = '' + cronPattern[field];

    // Quartz tokens are already canonical single values.
    if (field === 'date' && isQuartzDate(value) ||
        field === 'weekday' && isQuartzWeekday(value, fieldSpecs[field])) {
      return;
    }

    cronPattern[field] = normalizeField(value, fieldSpecs[field]);
  });

  return cronPattern;
}

// Canonicalize a single validated field value to a string.
function normalizeField(value, spec) {
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

  return segments.filter(function unique(segment, index) {
    return segments.indexOf(segment) === index;
  }).sort(function ascending(a, b) {
    return firstFire(a, spec) - firstFire(b, spec);
  }).join(',');
}

// An interval-one step enumerates every value from its start, so it reads
// as the equivalent range: `1/1` is `1-59` and `5-30/1` is `5-30`. A start
// at the bottom of the cycle covers the whole field (`0/1` is `*`).
function collapseUnitStep(segment, spec) {
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
function collapseDegenerateRange(segment, spec) {
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
function firstFire(segment, spec) {
  const start = segment.split('/')[0].split('-')[0];

  return start === '*' ? spec.min : toFieldNumber(start, spec.numbers);
}

// A field value must be a string or number resolving to '*', to a Quartz
// token (date and weekday fields only), or to a comma-separated list of
// valid segments.
function validateField(value, spec, field) {
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
function isQuartzDate(value) {
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
function isQuartzWeekday(value, spec) {
  if (value !== 'L' && (/L$/).test(value)) {
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
function isValidSegment(segment, spec) {
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
function isValidStep(segment, spec) {
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
function isValidRange(segment, spec, requireOrdered) {
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
function isValidSingle(value, spec) {
  if (value === '*') {
    return false;
  }

  if (isNonNegativeInteger(value)) {
    return +value >= spec.min && +value <= spec.max;
  }

  if (spec.names) {
    return Boolean(spec.names[value.toUpperCase()]);
  }

  return false;
}

// Whether a string consists solely of digits.
function isNonNegativeInteger(value) {
  const digits = /^\d+$/;

  return digits.test(value);
}

// Throw a descriptive error for an invalid field value.
function throwInvalidField(value, field) {
  throw new Error('`cronli5` was passed an invalid field value "' +
    value + '" for the ' + field + ' field.');
}

// Second field.
function interpretSeconds(cronPattern, opts) {
  return interpretRangeOfSeconds(cronPattern, opts) ||
    interpretRepeatingSeconds(cronPattern, opts) ||
    interpretMultipleSeconds(cronPattern, opts) ||
    interpretSingleSecond(cronPattern, opts) ||
    interpretSecondsWithinMinute(cronPattern, opts) ||
    interpretSecondsWithRest(cronPattern, opts);
}

function interpretRangeOfSeconds(cronPattern, opts) {
  const secondField = cronPattern.second;

  if (!isPlainRange(secondField)) {
    // Not a plain range pattern (steps and lists are handled separately).
    return;
  }

  // A second range only stands on its own when the minute is a wildcard.
  if (cronPattern.minute !== '*') {
    return;
  }

  const bounds = secondField.split('-');

  return 'every second from ' + getNumber(bounds[0], opts) + ' through ' +
    getNumber(bounds[1], opts) + ' past the minute' +
    trailingQualifier(cronPattern, opts);
}

function interpretRepeatingSeconds(cronPattern, opts) {
  const secondField = cronPattern.second;

  if (!isPlainStep(secondField)) {
    // Not a repeating interval pattern (a list containing a step segment
    // reads as a discrete list instead).
    return;
  }

  // A repeating second only stands on its own when the minute is a wildcard;
  // otherwise the rest of the pattern anchors the description.
  if (cronPattern.minute !== '*') {
    return;
  }

  return interpretStepCycle60(secondField, 'second', 'minute', opts) +
    trailingQualifier(cronPattern, opts);
}

function interpretMultipleSeconds(cronPattern, opts) {
  const secondField = cronPattern.second;

  if (!includes(secondField, ',')) {
    // Not a multiple second pattern.
    return;
  }

  // A second list only stands on its own when the minute is a wildcard.
  if (cronPattern.minute !== '*') {
    return;
  }

  return listPastThe(secondField.split(','), 'second', 'minute', opts) +
    trailingQualifier(cronPattern, opts);
}

function interpretSingleSecond(cronPattern, opts) {
  const secondField = cronPattern.second;

  if (secondField === '*') {
    // A wildcard second only stands on its own when the minute is also a
    // wildcard; otherwise the rest of the pattern anchors the description.
    if (cronPattern.minute === '*') {
      return 'every second' + trailingQualifier(cronPattern, opts);
    }

    return;
  }

  if (secondField === '0') {
    return '';
  }

  // A specific second only stands on its own when the minute is a
  // wildcard. Otherwise the more significant minute field anchors the
  // description.
  if (cronPattern.minute !== '*') {
    return;
  }

  const unit = +secondField === 1 ? 'second' : 'seconds';

  return getNumber(secondField, opts) + ' ' + unit +
    ' past the minute, every minute' + trailingQualifier(cronPattern, opts);
}

// A meaningful second combined with a single specific minute (and an open
// hour). A single second folds into the minute anchor ("30 minutes and 15
// seconds past the hour, every hour"); a list, range, or step leads with its
// own clause ("at 5 and 10 seconds past the minute, 30 minutes past the hour,
// every hour"). Without this the second would be silently dropped.
function interpretSecondsWithinMinute(cronPattern, opts) {
  const secondField = '' + cronPattern.second;
  const minuteField = '' + cronPattern.minute;

  if (cronPattern.hour !== '*' || !isSingleValue(minuteField) ||
      secondField === '*' || secondField === '0') {
    return;
  }

  const minuteWord = getNumber(minuteField, opts);
  const minuteUnit = +minuteField === 1 ? 'minute' : 'minutes';

  if (isSingleValue(secondField)) {
    const secondUnit = +secondField === 1 ? 'second' : 'seconds';

    return minuteWord + ' ' + minuteUnit + ' and ' +
      getNumber(secondField, opts) + ' ' + secondUnit +
      ' past the hour, every hour' + trailingQualifier(cronPattern, opts);
  }

  return secondsLeadClause(secondField, opts) + ', ' + minuteWord + ' ' +
    minuteUnit + ' past the hour, every hour' +
    trailingQualifier(cronPattern, opts);
}

// Final seconds stage: a meaningful second under minute/hour shapes the
// earlier stages deferred on. The second leads with its own clause and the
// rest of the pattern follows, e.g. "every 15 seconds, every day at
// 9:30 AM". Without this the second would be silently dropped.
function interpretSecondsWithRest(cronPattern, opts) {
  const secondField = '' + cronPattern.second;

  if (secondField === '0') {
    return;
  }

  // A single second under discrete minutes and hours folds into the clock
  // time downstream instead (e.g. "every day at 9:30:15 AM").
  if (isSingleValue(secondField) && isDiscreteList(cronPattern.minute) &&
      foldsToClockTime(cronPattern.hour)) {
    return;
  }

  const rest = interpretMinutes(cronPattern, opts) ||
    interpretHours(cronPattern, opts);

  return secondsLeadClause(secondField, opts) + ', ' + rest;
}

// Whether the hour field reaches the clock-time interpreter (it is a single
// value or a list, rather than a wildcard, plain range, or step).
function foldsToClockTime(hourField) {
  hourField = '' + hourField;

  return hourField !== '*' && !isPlainRange(hourField) &&
    !(includes(hourField, '/') && !includes(hourField, ','));
}

// The leading clause describing a second field relative to the minute, e.g.
// "at 5 and 10 seconds past the minute" or "every second from zero through
// 30 past the minute".
function secondsLeadClause(secondField, opts) {
  if (secondField === '*') {
    return 'every second';
  }

  if (isPlainStep(secondField)) {
    return interpretStepCycle60(secondField, 'second', 'minute', opts);
  }

  if (isPlainRange(secondField)) {
    const bounds = secondField.split('-');

    return 'every second from ' + getNumber(bounds[0], opts) + ' through ' +
      getNumber(bounds[1], opts) + ' past the minute';
  }

  if (isSingleValue(secondField)) {
    const unit = +secondField === 1 ? 'second' : 'seconds';

    return 'at ' + getNumber(secondField, opts) + ' ' + unit +
      ' past the minute';
  }

  return listPastThe(secondField.split(','), 'second', 'minute', opts);
}

// Minute field.
function interpretMinutes(cronPattern, opts) {
  return interpretMinuteFrequency(cronPattern, opts) ||
    interpretMinuteSpanInHour(cronPattern, opts) ||
    interpretMinuteRangeAcrossHours(cronPattern, opts) ||
    interpretMinuteSpanAcrossHourStep(cronPattern, opts) ||
    interpretRangeOfMinutes(cronPattern, opts) ||
    interpretMultipleMinutes(cronPattern, opts) ||
    interpretSingleMinute(cronPattern, opts);
}

// A minute window combined with discrete hours fires within that window
// during each hour. A wildcard reads "every minute during the <times>
// hours"; a plain range reads "every minute from <a> through <b> past the
// hour, at <times>"; a list containing ranges reads its discrete spans.
// Without this the minute field would collapse and only the clock hours
// would survive.
function interpretMinuteRangeAcrossHours(cronPattern, opts) {
  const minuteField = '' + cronPattern.minute;
  const hourField = '' + cronPattern.hour;

  // Discrete hour shapes only: a wildcard, plain range, or step hour is
  // handled elsewhere.
  if (hourField === '*' || isPlainRange(hourField) ||
      includes(hourField, '/') && !includes(hourField, ',')) {
    return;
  }

  if (minuteField === '*') {
    return 'every minute during the ' + hourTimesList(hourField, opts) +
      ' hours' + trailingQualifier(cronPattern, opts);
  }

  if (isPlainRange(minuteField)) {
    return minuteRangeLead(minuteField, opts) + ', at ' +
      hourTimesList(hourField, opts) + trailingQualifier(cronPattern, opts);
  }

  // A list containing ranges reads as discrete spans; a pure list defers to
  // the clock-time interpreter, which expands it.
  if (includes(minuteField, '-') && !includes(minuteField, '/')) {
    return listPastThe(minuteField.split(','), 'minute', 'hour', opts) +
      ', at ' + hourTimesList(hourField, opts) +
      trailingQualifier(cronPattern, opts);
  }
}

// A minute wildcard or plain range under an hour step fires within its
// window each active hour; the hour cadence trails as its own clause, e.g.
// "every minute from zero through 30 past the hour, every two hours".
function interpretMinuteSpanAcrossHourStep(cronPattern, opts) {
  const minuteField = '' + cronPattern.minute;
  const hourField = '' + cronPattern.hour;

  if (!isPlainStep(hourField)) {
    return;
  }

  const lead = minuteField === '*' ?
    'every minute' :
    isPlainRange(minuteField) && minuteRangeLead(minuteField, opts);

  if (!lead) {
    return;
  }

  return lead + ', ' + interpretStepHours(hourField, opts) +
    trailingQualifier(cronPattern, opts);
}

// The last minute a minute field fires on within an hour. Hour windows end
// at the final fire, so `*/15` over `9-17` reads "through 5:45 PM" rather
// than overstating (":59") or understating (":00") the window.
function lastMinuteFire(minuteField) {
  minuteField = '' + minuteField;

  if (minuteField === '*') {
    return 59;
  }

  const fires = minuteField.split(',').map(function lastIn(segment) {
    if (includes(segment, '/')) {
      const occurrences = enumerateStep(segment, 0, 59);

      return occurrences[occurrences.length - 1];
    }

    if (includes(segment, '-')) {
      const bounds = segment.split('-');

      // A wrap-around minute range reaches the top of the cycle.
      return +bounds[0] <= +bounds[1] ? +bounds[1] : 59;
    }

    return +segment;
  });

  return Math.max(...fires);
}

// Lead phrase for a plain minute range: "every minute from <a> through <b>
// past the hour".
function minuteRangeLead(minuteField, opts) {
  const bounds = minuteField.split('-');

  return 'every minute from ' + getNumber(bounds[0], opts) + ' through ' +
    getNumber(bounds[1], opts) + ' past the hour';
}

// A minute wildcard or plain range under a single specific hour fires every
// minute within a window inside that hour, e.g. "every minute from 9:00 AM
// through 9:29 AM". Without this the description would collapse to a single
// clock time and silently drop the minute field.
function interpretMinuteSpanInHour(cronPattern, opts) {
  if (!isSingleValue(cronPattern.hour)) {
    return;
  }

  const span = minuteSpan('' + cronPattern.minute);

  if (!span) {
    return;
  }

  return 'every minute from ' + getTime(cronPattern.hour, span[0], opts) +
    ' through ' + getTime(cronPattern.hour, span[1], opts) +
    trailingQualifier(cronPattern, opts);
}

// The [low, high] minute window a field spans, or null when the field is a
// single value, list, step, or wrap-around range (which do not describe a
// continuous window within one hour).
function minuteSpan(minuteField) {
  if (minuteField === '*') {
    return [0, 59];
  }

  if (isPlainRange(minuteField)) {
    const bounds = minuteField.split('-');

    if (+bounds[0] <= +bounds[1]) {
      return [+bounds[0], +bounds[1]];
    }
  }

  return null;
}

// A repeating minute step. When the hour field is restricted the cadence is
// qualified by the active window(s): a range or single hour trails with
// "from 9:00 AM through 5:00 PM", an hour list with "during the 9:00 AM and
// 5:00 PM hours", and an hour step with its own trailing clause.
function interpretMinuteFrequency(cronPattern, opts) {
  const minuteField = cronPattern.minute;

  if (!isPlainStep(minuteField)) {
    // Not a repeating interval pattern (a list containing a step segment
    // reads as a discrete list instead).
    return;
  }

  const hourField = '' + cronPattern.hour;
  let phrase = interpretStepCycle60(minuteField, 'minute', 'hour', opts);

  if (includes(hourField, ',')) {
    // An hour list confines the cadence to each listed hour's window.
    phrase += ' during the ' + hourTimesList(hourField, opts) + ' hours';
  }
  else if (isPlainRange(hourField)) {
    const bounds = hourField.split('-');

    phrase += ' from ' + getTime(bounds[0], 0, opts) + ' through ' +
      getTime(bounds[1], lastMinuteFire(minuteField), opts);
  }
  else if (isSingleValue(hourField)) {
    // A specific hour confines the cadence to that hour's window.
    phrase += ' from ' + getTime(hourField, 0, opts) + ' through ' +
      getTime(hourField, lastMinuteFire(minuteField), opts);
  }
  else if (includes(hourField, '/')) {
    // An hour step rides alongside the minute cadence.
    phrase += ', ' + interpretStepHours(hourField, opts);
  }

  return phrase + trailingQualifier(cronPattern, opts);
}

// Render an hour field's fire hours as a joined list of clock times, e.g.
// "9:00 AM and 5:00 PM", expanding range and step segments.
function hourTimesList(hourField, opts) {
  return hourTimes(enumerateHours(hourField), opts);
}

function interpretRangeOfMinutes(cronPattern, opts) {
  const minuteField = cronPattern.minute;

  if (!isPlainRange(minuteField)) {
    // Not a plain range pattern (steps and lists are handled separately).
    return;
  }

  // A minute range only stands on its own when the hour is a wildcard.
  if (cronPattern.hour !== '*') {
    return;
  }

  return minuteRangeLead(minuteField, opts) +
    trailingQualifier(cronPattern, opts);
}

function interpretMultipleMinutes(cronPattern, opts) {
  const minuteField = cronPattern.minute;

  if (!includes(minuteField, ',')) {
    // Not a multiple minute pattern.
    return;
  }

  // A minute list only stands on its own when the hour is a wildcard;
  // otherwise the hours expand it into a set of clock times.
  if (cronPattern.hour !== '*') {
    return;
  }

  return listPastThe(minuteField.split(','), 'minute', 'hour', opts) +
    trailingQualifier(cronPattern, opts);
}

function interpretSingleMinute(cronPattern, opts) {
  const minuteField = cronPattern.minute;

  if (minuteField === '*') {
    // Only describe "every minute" when the hour is also a wildcard;
    // otherwise defer to the hour field.
    if (cronPattern.hour === '*') {
      return 'every minute' + trailingQualifier(cronPattern, opts);
    }

    return;
  }

  if (minuteField === '0') {
    return '';
  }

  // A specific minute only stands on its own when the hour is a wildcard.
  // Otherwise the hour field anchors the description and folds the minute
  // into the time.
  if (cronPattern.hour !== '*') {
    return;
  }

  const unit = +minuteField === 1 ? 'minute' : 'minutes';

  return getNumber(minuteField, opts) + ' ' + unit +
    ' past the hour, every hour' + trailingQualifier(cronPattern, opts);
}

// Hour field.
function interpretHours(cronPattern, opts) {
  return interpretRangeOfHours(cronPattern, opts) ||
    interpretRepeatingHours(cronPattern, opts) ||
    interpretClockTimes(cronPattern, opts);
}

// An hour range fires within a window. On the hour it reads "every hour from
// 9:00 AM through 5:00 PM"; a specific minute (or minute list) anchors it as
// "at 30 minutes past the hour from 9:00 AM through 5:00 PM". A minute
// wildcard or range fires every minute, so it reads "every minute from ...".
function interpretRangeOfHours(cronPattern, opts) {
  const hourField = cronPattern.hour;

  if (!isPlainRange(hourField)) {
    // Not a plain range pattern (steps and lists are handled separately).
    return;
  }

  const minuteField = '' + cronPattern.minute;
  const bounds = hourField.split('-');

  // A minute wildcard fires every minute across the whole window, which ends
  // at :59 of the final hour.
  if (minuteField === '*') {
    return 'every minute from ' + getTime(bounds[0], 0, opts) +
      ' through ' + getTime(bounds[1], 59, opts) +
      trailingQualifier(cronPattern, opts);
  }

  // A minute range fires every minute within that window during each hour.
  if (isPlainRange(minuteField)) {
    return minuteRangeLead(minuteField, opts) +
      ', from ' + getTime(bounds[0], 0, opts) + ' through ' +
      getTime(bounds[1], lastMinuteFire(minuteField), opts) +
      trailingQualifier(cronPattern, opts);
  }

  const window = 'from ' + getTime(bounds[0], 0, opts) +
    ' through ' + getTime(bounds[1], lastMinuteFire(minuteField), opts);
  const phrase =
    interpretRangeMinuteLead(minuteField, opts) + ' ' + window;

  return phrase + trailingQualifier(cronPattern, opts);
}

// Lead phrase for a minute field within an hour range. A minute wildcard and
// range are handled by the caller; on-the-hour reads "every hour"; otherwise
// the minute list anchors it.
function interpretRangeMinuteLead(minuteField, opts) {
  if (minuteField === '0') {
    return 'every hour';
  }

  return listPastThe(minuteField.split(','), 'minute', 'hour', opts);
}

function interpretRepeatingHours(cronPattern, opts) {
  const hourField = cronPattern.hour;

  if (!includes(hourField, '/') || includes(hourField, ',')) {
    // Not a repeating interval pattern (a list containing a step segment
    // expands into clock times instead).
    return;
  }

  return interpretStepHours(hourField, opts);
}

// Interpret a `start/interval` step for a field that cycles every 60 units
// (seconds and minutes). `unit` is the singular noun and `anchor` is the
// larger unit the values are counted against.
function interpretStepCycle60(field, unit, anchor, opts) {
  const parts = field.split('/');
  const interval = +parts[1];

  // A bounded start (`a-b/n`) applies the interval within the range.
  if (includes(parts[0], '-')) {
    const bounds = parts[0].split('-');

    if (interval <= 1) {
      return 'every ' + unit + ' from ' + getNumber(+bounds[0], opts) +
        ' through ' + getNumber(+bounds[1], opts) + ' past the ' + anchor;
    }

    return listPastThe(getOccurrences(+bounds[0], interval, +bounds[1]),
      unit, anchor, opts);
  }

  const start = parts[0] === '*' ? 0 : +parts[0];

  if (interval <= 1) {
    return 'every ' + unit;
  }

  const occurrences = getOccurrences(start, interval, 59);

  if (start !== 0) {
    if (occurrences.length <= 3) {
      return listPastThe(occurrences, unit, anchor, opts);
    }

    return 'every ' + getNumber(interval, opts) + ' ' + unit + 's from ' +
      getNumber(start, opts) + ' ' +
      (start === 1 ? unit : unit + 's') + ' past the ' + anchor;
  }

  // A step reads as a natural cadence ("every N minutes") only when it
  // divides the cycle evenly, mirroring the hour field's `24 % n` rule.
  if (60 % interval === 0) {
    return 'every ' + getNumber(interval, opts) + ' ' + unit + 's';
  }

  if (occurrences.length <= 2) {
    return listPastThe(occurrences, unit, anchor, opts);
  }

  return 'every ' + getNumber(interval, opts) + ' ' + unit +
    's past the ' + anchor;
}

// Interpret a `start/interval` step for the hour field (cycles every 24).
function interpretStepHours(field, opts) {
  const parts = field.split('/');
  const interval = +parts[1];

  // A bounded start (`a-b/n`) applies the interval within the range.
  if (includes(parts[0], '-')) {
    const bounds = parts[0].split('-');

    return listHourTimes(getOccurrences(+bounds[0], interval, +bounds[1]),
      opts);
  }

  const start = parts[0] === '*' ? 0 : +parts[0];

  if (interval <= 1) {
    return 'every hour';
  }

  const occurrences = getOccurrences(start, interval, 23);

  if (start === 0 && 24 % interval === 0) {
    return 'every ' + getNumber(interval, opts) + ' hours';
  }

  if (occurrences.length <= 3) {
    return listHourTimes(occurrences, opts);
  }

  if (start === 0) {
    return 'every ' + getNumber(interval, opts) + ' hours from midnight';
  }

  return 'every ' + getNumber(interval, opts) + ' hours from ' +
    getTime(start, 0, opts);
}

// Enumerate fire values as "at A, B and C <unit>s past the <anchor>". Range
// segments within a list (e.g. "5-10,20") read as "five through 10 and 20".
function listPastThe(occurrences, unit, anchor, opts) {
  const values = occurrences.map(function(value) {
    if (isPlainRange(value)) {
      const bounds = ('' + value).split('-');

      return getNumber(bounds[0], opts) + ' through ' +
        getNumber(bounds[1], opts);
    }

    return getNumber(value, opts);
  });

  return 'at ' + joinList(values) + ' ' + unit + 's past the ' + anchor;
}

// Render hours as a joined list of clock times, e.g. "9:00 AM and 5:00 PM".
function hourTimes(hours, opts) {
  const times = hours.map(function(hour) {
    return getTime(hour, 0, opts);
  });

  return joinList(times);
}

// Enumerate fire hours as "at T1 and T2 ...".
function listHourTimes(occurrences, opts) {
  return 'at ' + hourTimes(occurrences, opts);
}

// Enumerate the hours an hour field fires on, expanding list segments that
// are ranges or steps (e.g. "9,17-19" or "9,17/2"). The 24-hour cycle keeps
// the expansion readable.
function enumerateHours(hourField) {
  const hours = [];

  ('' + hourField).split(',').forEach(function expand(segment) {
    if (includes(segment, '/')) {
      hours.push(...enumerateStep(segment, 0, 23));
    }
    else if (includes(segment, '-')) {
      const bounds = segment.split('-');

      if (+bounds[0] <= +bounds[1]) {
        hours.push(...getOccurrences(+bounds[0], 1, +bounds[1]));
      }
      else {
        // A wrap-around range runs to the end of the cycle and resumes
        // from the start.
        hours.push(...getOccurrences(+bounds[0], 1, 23));
        hours.push(...getOccurrences(0, 1, +bounds[1]));
      }
    }
    else {
      hours.push(+segment);
    }
  });

  return hours.filter(function unique(hour, index) {
    return hours.indexOf(hour) === index;
  });
}

// List the values a `start/interval` step fires on within [0, max].
function getOccurrences(start, interval, max) {
  const occurrences = [];
  let value = start;

  while (value <= max) {
    occurrences.push(value);
    value += interval;
  }

  return occurrences;
}

// Resolve a numeric or named field token (e.g. '5' or 'FRI') to its number.
function toFieldNumber(token, numberMap) {
  return isNonNegativeInteger(token) ? +token : numberMap[token.toUpperCase()];
}

// List the values a step fires on for a day-level field. The start may be a
// wildcard (`*`, begins at `min`), a single value, or a range (`a-b`), and
// range bounds may be names resolved via `numberMap`.
function enumerateStep(field, min, max, numberMap) {
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

// Whether a field is an "open" step (start is `*` or a single value, not a
// bounded range or a list). Open steps read as a frequency rather than an
// enumeration.
function isOpenStep(field) {
  return includes(field, '/') && !includes(field, '-') &&
    !includes(field, ',');
}

// Whether a field is a single concrete value (not a wildcard, list, range, or
// step).
function isSingleValue(field) {
  return field !== '*' && !includes(field, ',') &&
    !includes(field, '-') && !includes(field, '/');
}

// Whether a field is a single plain range (not a list, step, or wildcard).
// Lists may contain range segments (e.g. "0-30,45"), so a bare `includes`
// check on "-" is not enough to treat the whole field as one range.
function isPlainRange(field) {
  return includes(field, '-') && !includes(field, ',') &&
    !includes(field, '/');
}

// Whether a field is a single step (open or bounded), not a list. Lists may
// contain step segments (e.g. "0,30/5"), so a bare `includes` check on "/"
// is not enough to treat the whole field as one step.
function isPlainStep(field) {
  return includes(field, '/') && !includes(field, ',');
}

// Whether a field is a single concrete value or a comma list of them.
function isDiscreteList(field) {
  field = '' + field;

  return field !== '*' && !includes(field, '-') && !includes(field, '/');
}

// Join a list with commas and a terminal "and".
function joinList(items) {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + ' and ' + items[1];
  }

  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

// Expand a discrete set of hours and minutes into clock times prefixed by a
// day-level qualifier, e.g. "every day at 9:00 AM and 9:30 AM" or "on the
// 1st at 2:15 PM".
function interpretClockTimes(cronPattern, opts) {
  if (cronPattern.hour === '*') {
    return 'every hour' + trailingQualifier(cronPattern, opts);
  }

  const hours = enumerateHours(cronPattern.hour);
  const minutes = enumerateValues(cronPattern.minute);
  const second = clockSecond(cronPattern.second);
  const times = [];

  hours.forEach(function(h) {
    minutes.forEach(function(m) {
      times.push(getTime(h, m, opts, second));
    });
  });

  return interpretDayQualifier(cronPattern, opts) + 'at ' + joinList(times);
}

// A single specific non-zero second to fold into a clock time (e.g. "9:00:15
// AM"), or undefined when the second is zero, a wildcard, or non-discrete.
function clockSecond(secondField) {
  secondField = '' + secondField;

  if (isSingleValue(secondField) && secondField !== '0') {
    return +secondField;
  }
}

// Enumerate a discrete field (single value or comma list) as numbers. A
// wildcard or any non-discrete form collapses to the top of the unit (0).
function enumerateValues(field) {
  field = '' + field;

  if (field === '*' || includes(field, '-') || includes(field, '/')) {
    return [0];
  }

  return field.split(',').map(Number);
}

// Build the day-level qualifier that precedes a specific time, e.g.
// "every day ", "every Friday ", "on January 13th ", "on the 1st and 15th ",
// or "every day in June and December ".
function interpretDayQualifier(cronPattern, opts) {
  // Standard cron fires when day-of-month OR day-of-week matches, when both
  // are restricted.
  if (cronPattern.date !== '*' && cronPattern.weekday !== '*') {
    return interpretDateOrWeekday(cronPattern, opts) + ' ';
  }

  if (cronPattern.date !== '*') {
    const quartzDate = quartzDatePhrase(cronPattern.date, opts);

    if (quartzDate) {
      return quartzDate + monthScope(cronPattern, opts) + ' ';
    }

    if (isOpenStep(cronPattern.date)) {
      return interpretStepDates(cronPattern.date) +
        monthScope(cronPattern, opts) + ' ';
    }

    if (isOpenStep(cronPattern.month)) {
      return 'on the ' + interpretDateOrdinals(cronPattern.date) +
        monthScope(cronPattern, opts) + ' ';
    }

    if (cronPattern.month !== '*') {
      return 'on ' + interpretMonthNames(cronPattern.month, opts) + ' ' +
        interpretDateOrdinals(cronPattern.date) + ' ';
    }

    return 'on the ' + interpretDateOrdinals(cronPattern.date) + ' ';
  }

  // A weekday qualifier, optionally scoped to a month ("every Monday in
  // June").
  if (cronPattern.weekday !== '*') {
    const quartzWeekday = quartzWeekdayPhrase(cronPattern.weekday, opts);

    if (quartzWeekday) {
      return quartzWeekday + monthScope(cronPattern, opts) + ' ';
    }

    return 'every ' + interpretWeekdays(cronPattern, opts) +
      monthScope(cronPattern, opts) + ' ';
  }

  if (cronPattern.month !== '*') {
    return 'every day in ' +
      interpretMonthNames(cronPattern.month, opts) + ' ';
  }

  return 'every day ';
}

// Compose the "day-of-month or day-of-week" phrase used when both fields are
// restricted (specified as non-wildcard values). Cron fires when either is a
// match. A restricted month scopes both the day of month and the day of week.
function interpretDateOrWeekday(cronPattern, opts) {
  const weekdayPart = quartzWeekdayPhrase(cronPattern.weekday, opts) ||
    'on ' + interpretWeekdays(cronPattern, opts);
  const quartzDate = quartzDatePhrase(cronPattern.date, opts);

  if (quartzDate) {
    return quartzDate + monthScope(cronPattern, opts) + ' or ' + weekdayPart;
  }

  if (isOpenStep(cronPattern.date)) {
    return interpretStepDates(cronPattern.date) +
      monthScope(cronPattern, opts) + ' or ' + weekdayPart;
  }

  const ordinals = interpretDateOrdinals(cronPattern.date);

  if (cronPattern.month !== '*') {
    const month = interpretMonthNames(cronPattern.month, opts);

    return 'on ' + month + ' ' + ordinals + ' or ' + weekdayPart +
      ' in ' + month;
  }

  return 'on the ' + ordinals + ' or ' + weekdayPart;
}

// A trailing " in <month>" scope, or an empty string when the month is a
// wildcard. Used to scope an open day-of-month step to a specific month.
function monthScope(cronPattern, opts) {
  if (cronPattern.month === '*') {
    return '';
  }

  return ' in ' + interpretMonthNames(cronPattern.month, opts);
}

// Frequency phrase for an open day-of-month step, e.g. "every other day of
// the month" or "every 3rd day of the month from the 5th".
function interpretStepDates(dateField) {
  const parts = dateField.split('/');
  const interval = +parts[1];
  const start = parts[0];
  const cadence = interval === 2 ?
    'every other' :
    'every ' + getOrdinal(interval);
  let phrase = cadence + ' day of the month';

  if (start !== '*' && start !== '1') {
    phrase += ' from the ' + getOrdinal(start);
  }

  return phrase;
}

// Render a date field (single, list, range, or bounded step) as suffixed
// ordinals. List segments may themselves be ranges or steps. Open steps are
// handled separately as a frequency phrase.
function interpretDateOrdinals(dateField) {
  const pieces = [];

  ('' + dateField).split(',').forEach(function render(segment) {
    if (includes(segment, '/')) {
      pieces.push(...enumerateStep(segment, 1, 31).map(toOrdinal));
    }
    else if (includes(segment, '-')) {
      const bounds = segment.split('-');

      pieces.push(getOrdinal(bounds[0]) + ' through ' +
        getOrdinal(bounds[1]));
    }
    else {
      pieces.push(getOrdinal(segment));
    }
  });

  return joinList(pieces);
}

// Render a month field (single, list, range, or bounded step) as names. List
// segments may themselves be ranges or steps. Open steps are handled
// separately as a frequency phrase.
function interpretMonthNames(monthField, opts) {
  if (isOpenStep(monthField)) {
    return interpretStepMonths(monthField, opts);
  }

  const pieces = [];

  ('' + monthField).split(',').forEach(function render(segment) {
    if (includes(segment, '/')) {
      pieces.push(...enumerateStep(segment, 1, 12, monthNumbers)
        .map(function(value) {
          return getMonth(value, opts);
        }));
    }
    else if (includes(segment, '-')) {
      const bounds = segment.split('-');

      pieces.push(getMonth(bounds[0], opts) + ' through ' +
        getMonth(bounds[1], opts));
    }
    else {
      pieces.push(getMonth(segment, opts));
    }
  });

  return joinList(pieces);
}

// Frequency phrase for an open month step, e.g. "every other month" or
// "every 3rd month from February".
function interpretStepMonths(monthField, opts) {
  const parts = monthField.split('/');
  const interval = +parts[1];
  const start = parts[0];
  let phrase = interval === 2 ?
    'every other month' :
    'every ' + getOrdinal(interval) + ' month';

  if (start !== '*' && start !== '1') {
    phrase += ' from ' + getMonth(start, opts);
  }

  return phrase;
}

// `map`-safe wrapper that ignores the index/array arguments.
function toOrdinal(value) {
  return getOrdinal(value);
}

// Weekday field. List segments may themselves be ranges or steps.
function interpretWeekdays(cronPattern, opts) {
  const weekdayField = '' + cronPattern.weekday;
  const pieces = [];

  weekdayField.split(',').forEach(function render(segment) {
    if (includes(segment, '/')) {
      pieces.push(...enumerateStep(segment, 0, 6, weekdayNumbers)
        .map(function(value) {
          return getWeekday(value, opts);
        }));
    }
    else if (includes(segment, '-')) {
      pieces.push(segment.split('-').map(function(value) {
        return getWeekday(value, opts);
      }).join('-'));
    }
    else {
      pieces.push(getWeekday(segment, opts));
    }
  });

  return joinList(pieces);
}

// Turn an hour field (and optional minute field) into a clock time, e.g.
// "3:45 PM" with AM/PM, or "15:45" in 24-hour mode.
function getTime(h, m, opts, s) {
  if (isNaN(h)) {
    throw new Error('Tried to interpret "' + JSON.stringify(h) +
      '" as an hour and failed.');
  }

  if (m === '*' || typeof m === 'undefined' || m === null) {
    m = 0;
  }

  // Seconds are only shown when a specific non-zero value is supplied.
  const seconds = typeof s === 'number' && s > 0 ? ':' + pad(s) : '';

  if (!opts.ampm) {
    return pad(h) + ':' + pad(m) + seconds;
  }

  const period = h < 12 ? 'AM' : 'PM';

  return (h % 12 || 12) + ':' + pad(m) + seconds + ' ' + period;
}

// Get English number names for the integers zero through ten.
function getNumber(n, opts) {
  if (opts.short) {
    return n;
  }

  return numbers[n] || n;
}

// Get English ordinals from integers. Dates always use the suffixed numeric
// form (1st, 2nd, ... 31st) for consistency.
function getOrdinal(n) {
  return getSuffixedOrdinal(n);
}

// Get suffixed ordinals from integers.
function getSuffixedOrdinal(n) {
  let m = Math.abs(n);
  let suffix = suffixes[m];

  if (!suffix) {
    m = (m % 100 - 20) % 10;
    suffix = suffixes[m] || suffixes[0];
  }

  return n + suffix;
}

// Get English month names from a number or from an abbreviation.
function getMonth(m, opts) {
  const month = monthNames[m] || monthAbbreviations[m];

  return month && month[opts.short ? 1 : 0];
}

// Get English weekday names from a number or from an abbreviation. Standard
// cron treats `7` as Sunday (the same as `0`), so it is normalized here.
function getWeekday(d, opts) {
  const day = d === 7 || d === '7' ? 0 : d;
  const weekday = weekdayNames[day] || weekdayAbbreviations[day];

  return weekday && weekday[opts.short ? 1 : 0];
}

// Stringify and add a zero pad to integers.
function pad(n) {
  n = '' + n;

  if (n.length < 2) {
    n = '0' + n;
  }

  return n;
}

function includes(str, sub) {
  str += '';

  return str.indexOf(sub) !== -1;
}

export default cronli5;
