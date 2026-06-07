/**
 * @license MIT, Copyright (c) 2026 Andrew Broz
 */

(function(root) {
  // Options flags.
  var AMPM = true;
  var SECONDS = false;
  var SHORT = false;
  var YEARS = false;

  // English number names for the integers zero through ten.
  var numbers = [
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
  var suffixes = [
    'th',
    'st',
    'nd',
    'rd'
  ];

  // English month names.
  var monthNames = [
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
  var weekdayNames = [
    ['Sunday', 'Sun'],
    ['Monday', 'Mon'],
    ['Tuesday', 'Tue'],
    ['Wednesday', 'Wed'],
    ['Thursday', 'Thu'],
    ['Friday', 'Fri'],
    ['Saturday', 'Sat']
  ];

  // Month names by abbreviation.
  var monthAbbreviations = {
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
  var weekdayAbbreviations = {
    '*': ['day', 'day'],
    SUN: weekdayNames[0],
    MON: weekdayNames[1],
    TUE: weekdayNames[2],
    WED: weekdayNames[3],
    THU: weekdayNames[4],
    FRI: weekdayNames[5],
    SAT: weekdayNames[6]
  };

  // Allowed numeric ranges (and name tables, where applicable) per field.
  var fieldSpecs = {
    second: {max: 59, min: 0},
    minute: {max: 59, min: 0},
    hour: {max: 23, min: 0},
    date: {max: 31, min: 1},
    month: {max: 12, min: 1, names: monthAbbreviations},
    weekday: {max: 6, min: 0, names: weekdayAbbreviations},
    year: {max: 9999, min: 1970}
  };

  // The order in which fields are validated.
  var fieldOrder = [
    'second',
    'minute',
    'hour',
    'date',
    'month',
    'weekday',
    'year'
  ];

  // A cron pattern to English interpreter.
  //
  // `options` include:
  // - ampm (boolean):
  //     use AM/PM instead of zero-padded 24-hour time
  // - seconds (boolean):
  //     always treat the first value in a string or array as a second
  // - short (boolean):
  //     use shorthand and numeric representations
  // - year (boolean):
  //     parse with year
  function cronli5(cronPattern, options) {
    setOptions(options);

    cronPattern = parseCronPattern(cronPattern);

    validateCronPattern(cronPattern);

    var description = interpretSeconds(cronPattern)
        || interpretMinutes(cronPattern)
        || interpretHours(cronPattern);

    return applyYear(description, cronPattern);
  }

  // A trailing day-level qualifier for bare frequencies, e.g. " on Monday",
  // " on the 13th", " in January", or " on January 13th". Returns an empty
  // string when no date, month, or weekday is set.
  function trailingQualifier(cronPattern) {
    if (cronPattern.date !== '*') {
      if (cronPattern.month !== '*') {
        return ' on ' + interpretMonthNames(cronPattern.month) + ' ' +
          interpretDateOrdinals(cronPattern.date);
      }

      return ' on the ' + interpretDateOrdinals(cronPattern.date);
    }

    if (cronPattern.month !== '*') {
      return ' in ' + interpretMonthNames(cronPattern.month);
    }

    if (cronPattern.weekday !== '*') {
      return ' on ' + interpretWeekdays(cronPattern);
    }

    return '';
  }

  // Append or fold the year field into a finished description. The year is
  // only rendered when the `years` option is enabled and a specific year is
  // set. A single year reads naturally folded into a specific calendar date
  // ("on January 1st, 2030 at noon"); otherwise it trails the description
  // ("every Friday at 1:00 PM in 2030").
  function applyYear(description, cronPattern) {
    var yearField = '' + cronPattern.year;

    if (!YEARS || yearField === '*') {
      return description;
    }

    if (includes(yearField, '/')) {
      return description + ' ' + interpretStepYears(yearField);
    }

    var label = interpretYearLabel(yearField);

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
  function interpretStepYears(yearField) {
    var parts = yearField.split('/');
    var interval = +parts[1];
    var start = parts[0];

    if (interval <= 1) {
      return 'every year';
    }

    var phrase = 'every ' + getNumber(interval) + ' years';

    if (start !== '*' && start !== '0') {
      phrase += ' from ' + start;
    }

    return phrase;
  }

  // Set option flags.
  function setOptions(options) {
    options = options || {};

    AMPM = typeof options.ampm === 'boolean' ? options.ampm : true;
    SECONDS = !!options.seconds;
    SHORT = !!options.short;
    YEARS = !!options.years;
  }

  // Take a cron pattern as, a cron pattern string, an array of cron fields, a
  // cron-like object (see the final return statement for the format of a
  // cron-like object), or a stringable object that evaluates to a cron pattern
  // string. Returns a cron-like object.
  function parseCronPattern(cronPattern) {
    var isArray = cronPattern instanceof Array;
    var isEmpty = cronPattern === null ||
      typeof cronPattern === 'undefined' ||
      cronPattern === '' ||
      isArray && cronPattern.length === 0;

    // Throw if null or empty.
    if (isEmpty) {
      throw new Error(
        '`cronli5` expects a non-empty cron pattern as the first argument.');
    }

    if (isArray) {
      return cronifyArray(cronPattern);
    }

    if (typeof cronPattern === 'object') {
      return cronifyObject(cronPattern);
    }

    if (typeof cronPattern === 'string') {
      return cronifyString(cronPattern);
    }

    throw new Error('`cronli5` was passed an unexpected type.');
  }

  // Turn a cronable array into a cron-like object.
  function cronifyArray(cronlikeArray) {
    var max = YEARS ? 7 : 6;

    if (cronlikeArray.length > max) {
      throw new Error('`cronli5` was passed a cron pattern with more than ' +
        getNumber(max) + ' fields.');
    }

    if (!SECONDS && cronlikeArray.length < max) {
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
  function cronifyObject(cronable) { // eslint-disable-line complexity
    if (!cronable.second && !cronable.minute && !cronable.hour) {
      throw new Error(
        '`cronli5` expects that any object being interpreted as a cron ' +
        'pattern have at least one of the following properties: `second`, ' +
        '`minute`, or `hour`');
    }

    var hasSecond = typeof cronable.second !== 'undefined';
    var hasMinute = typeof cronable.minute !== 'undefined';
    var defaultMinute = hasSecond ? '*' : '0';
    var defaultHour = hasSecond || hasMinute ? '*' : '0';

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
  function cronifyString(cronString) {
    var cronlikeArray = cronString.split(/\s+/);

    return cronifyArray(cronlikeArray);
  }

  // Validate every field of a cron-like object, throwing on the first
  // invalid value encountered.
  function validateCronPattern(cronPattern) {
    fieldOrder.forEach(function validate(field) {
      validateField(cronPattern[field], fieldSpecs[field], field);
    });

    return cronPattern;
  }

  // A field value must be a string or number resolving to '*' or to a
  // comma-separated list of valid segments.
  function validateField(value, spec, field) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      throwInvalidField(value, field);
    }

    var stringValue = '' + value;

    if (stringValue === '*') {
      return;
    }

    stringValue.split(',').forEach(function check(segment) {
      if (!isValidSegment(segment, spec)) {
        throwInvalidField(segment, field);
      }
    });
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
    var parts = segment.split('/');

    if (parts.length !== 2 || !isNonNegativeInteger(parts[1]) ||
        +parts[1] < 1) {
      return false;
    }

    return parts[0] === '*' || isValidSingle(parts[0], spec) ||
      isValidRange(parts[0], spec);
  }

  // A range is `<start>-<end>` where both ends are valid singles.
  function isValidRange(segment, spec) {
    var parts = segment.split('-');

    if (parts.length !== 2) {
      return false;
    }

    return isValidSingle(parts[0], spec) && isValidSingle(parts[1], spec);
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
    var digits = /^\d+$/;

    return digits.test(value);
  }

  // Throw a descriptive error for an invalid field value.
  function throwInvalidField(value, field) {
    throw new Error('`cronli5` was passed an invalid field value "' +
      value + '" for the ' + field + ' field.');
  }

  // Second field.
  function interpretSeconds(cronPattern) {
    return interpretRangeOfSeconds(cronPattern) ||
      interpretRepeatingSeconds(cronPattern.second) ||
      interpretMultipleSeconds(cronPattern) ||
      interpretSingleSecond(cronPattern);
  }

  function interpretRangeOfSeconds(cronPattern) {
    var secondField = cronPattern.second;

    if (!includes(secondField, '-')) {
      // Not a range pattern.
      return;
    }

    // A second range only stands on its own when the minute is a wildcard.
    if (cronPattern.minute !== '*') {
      return;
    }

    var bounds = secondField.split('-');

    return 'every second from ' + getNumber(bounds[0]) + ' through ' +
      getNumber(bounds[1]) + ' past the minute';
  }

  function interpretRepeatingSeconds(secondField) {
    if (!includes(secondField, '/')) {
      // Not a repeating interval pattern.
      return;
    }

    return interpretStepCycle60(secondField, 'second', 'minute');
  }

  function interpretMultipleSeconds(cronPattern) {
    var secondField = cronPattern.second;

    if (!includes(secondField, ',')) {
      // Not a multiple second pattern.
      return;
    }

    // A second list only stands on its own when the minute is a wildcard.
    if (cronPattern.minute !== '*') {
      return;
    }

    return listPastThe(secondField.split(','), 'second', 'minute');
  }

  function interpretSingleSecond(cronPattern) {
    var secondField = cronPattern.second;

    if (secondField === '*') {
      return 'every second' + trailingQualifier(cronPattern);
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

    var unit = +secondField === 1 ? 'second' : 'seconds';

    return getNumber(secondField) + ' ' + unit +
      ' past the minute, every minute';
  }

  // Minute field.
  function interpretMinutes(cronPattern) {
    return interpretMinuteFrequency(cronPattern) ||
      interpretRangeOfMinutes(cronPattern) ||
      interpretMultipleMinutes(cronPattern) ||
      interpretSingleMinute(cronPattern);
  }

  // A repeating minute step. When the hour field is a range the cadence is
  // qualified by the active window, e.g. "every 15 minutes from 9:00 AM
  // through 5:00 PM", optionally trailing the weekday.
  function interpretMinuteFrequency(cronPattern) {
    var minuteField = cronPattern.minute;

    if (!includes(minuteField, '/')) {
      // Not a repeating interval pattern.
      return;
    }

    var phrase = interpretStepCycle60(minuteField, 'minute', 'hour');

    if (includes(cronPattern.hour, '-')) {
      var bounds = cronPattern.hour.split('-');

      phrase += ' from ' + getTime(bounds[0], 0) + ' through ' +
        getTime(bounds[1], 0);

      if (cronPattern.weekday !== '*') {
        phrase += ' on ' + interpretWeekdays(cronPattern);
      }
    }

    return phrase;
  }

  function interpretRangeOfMinutes(cronPattern) {
    var minuteField = cronPattern.minute;

    if (!includes(minuteField, '-')) {
      // Not a range pattern.
      return;
    }

    // A minute range only stands on its own when the hour is a wildcard.
    if (cronPattern.hour !== '*') {
      return;
    }

    var bounds = minuteField.split('-');

    return 'every minute from ' + getNumber(bounds[0]) + ' through ' +
      getNumber(bounds[1]) + ' past the hour';
  }

  function interpretMultipleMinutes(cronPattern) {
    var minuteField = cronPattern.minute;

    if (!includes(minuteField, ',')) {
      // Not a multiple minute pattern.
      return;
    }

    // A minute list only stands on its own when the hour is a wildcard;
    // otherwise the hours expand it into a set of clock times.
    if (cronPattern.hour !== '*') {
      return;
    }

    return listPastThe(minuteField.split(','), 'minute', 'hour');
  }

  function interpretSingleMinute(cronPattern) {
    var minuteField = cronPattern.minute;

    if (minuteField === '*') {
      // Only describe "every minute" when the hour is also a wildcard;
      // otherwise defer to the hour field.
      if (cronPattern.hour === '*') {
        return 'every minute' + trailingQualifier(cronPattern);
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

    var unit = +minuteField === 1 ? 'minute' : 'minutes';

    return getNumber(minuteField) + ' ' + unit +
      ' past the hour, every hour';
  }

  // Hour field.
  function interpretHours(cronPattern) {
    return interpretRangeOfHours(cronPattern) ||
      interpretRepeatingHours(cronPattern) ||
      interpretClockTimes(cronPattern);
  }

  // An hour range fires within a window. On the hour it reads "every hour from
  // 9:00 AM through 5:00 PM"; a specific minute (or minute list) anchors it as
  // "at 30 minutes past the hour from 9:00 AM through 5:00 PM".
  function interpretRangeOfHours(cronPattern) {
    var hourField = cronPattern.hour;

    if (!includes(hourField, '-')) {
      // Not a range pattern.
      return;
    }

    var bounds = hourField.split('-');
    var window = 'from ' + getTime(bounds[0], 0) +
      ' through ' + getTime(bounds[1], 0);
    var phrase = interpretRangeMinuteLead(cronPattern.minute) + ' ' + window;

    if (cronPattern.weekday !== '*') {
      phrase += ' on ' + interpretWeekdays(cronPattern);
    }

    return phrase;
  }

  // Lead phrase for a minute field within an hour range. On-the-hour (or a
  // non-discrete minute) reads "every hour"; otherwise the minutes anchor it.
  function interpretRangeMinuteLead(minuteField) {
    minuteField = '' + minuteField;

    if (minuteField === '*' || minuteField === '0' ||
        includes(minuteField, '-') || includes(minuteField, '/')) {
      return 'every hour';
    }

    return listPastThe(minuteField.split(','), 'minute', 'hour');
  }

  function interpretRepeatingHours(cronPattern) {
    var hourField = cronPattern.hour;

    if (!includes(hourField, '/')) {
      // Not a repeating interval pattern.
      return;
    }

    return interpretStepHours(hourField);
  }

  // Interpret a `start/interval` step for a field that cycles every 60 units
  // (seconds and minutes). `unit` is the singular noun and `anchor` is the
  // larger unit the values are counted against.
  function interpretStepCycle60(field, unit, anchor) {
    var parts = field.split('/');
    var interval = +parts[1];
    var start = parts[0] === '*' ? 0 : +parts[0];

    if (interval <= 1) {
      return 'every ' + unit;
    }

    var occurrences = getOccurrences(start, interval, 59);

    if (start !== 0) {
      if (occurrences.length <= 3) {
        return listPastThe(occurrences, unit, anchor);
      }

      return 'every ' + getNumber(interval) + ' ' + unit + 's from ' +
        getNumber(start) + ' ' + unit + 's past the ' + anchor;
    }

    // A step reads as a natural cadence ("every N minutes") only when it
    // divides the cycle evenly, mirroring the hour field's `24 % n` rule.
    if (60 % interval === 0) {
      return 'every ' + getNumber(interval) + ' ' + unit + 's';
    }

    if (occurrences.length <= 2) {
      return listPastThe(occurrences, unit, anchor);
    }

    return 'every ' + getNumber(interval) + ' ' + unit + 's past the ' + anchor;
  }

  // Interpret a `start/interval` step for the hour field (cycles every 24).
  function interpretStepHours(field) {
    var parts = field.split('/');
    var interval = +parts[1];
    var start = parts[0] === '*' ? 0 : +parts[0];

    if (interval <= 1) {
      return 'every hour';
    }

    var occurrences = getOccurrences(start, interval, 23);

    if (start === 0 && 24 % interval === 0) {
      return 'every ' + getNumber(interval) + ' hours';
    }

    if (occurrences.length <= 3) {
      return listHourTimes(occurrences);
    }

    if (start === 0) {
      return 'every ' + getNumber(interval) + ' hours from midnight';
    }

    return 'every ' + getNumber(interval) + ' hours from ' + getTime(start, 0);
  }

  // Enumerate fire values as "at A, B and C <unit>s past the <anchor>".
  function listPastThe(occurrences, unit, anchor) {
    return 'at ' + joinList(occurrences.map(getNumber)) + ' ' + unit +
      's past the ' + anchor;
  }

  // Enumerate fire hours as "at T1 and T2 ...", dropping a leading midnight
  // when there are more than two times.
  function listHourTimes(occurrences) {
    var hours = occurrences;

    if (hours.length > 2 && hours[0] === 0) {
      hours = hours.slice(1);
    }

    return 'at ' + joinList(hours.map(toHourTime));
  }

  // Format an hour value as a clock time (ignoring extra `map` arguments).
  function toHourTime(hour) {
    return getTime(hour, 0);
  }

  // List the values a `start/interval` step fires on within [0, max].
  function getOccurrences(start, interval, max) {
    var occurrences = [];
    var value = start;

    while (value <= max) {
      occurrences.push(value);
      value += interval;
    }

    return occurrences;
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
  function interpretClockTimes(cronPattern) {
    if (cronPattern.hour === '*') {
      return 'every hour' + trailingQualifier(cronPattern);
    }

    var hours = enumerateValues(cronPattern.hour);
    var minutes = enumerateValues(cronPattern.minute);
    var times = [];

    hours.forEach(function(h) {
      minutes.forEach(function(m) {
        times.push(getTime(h, m));
      });
    });

    return interpretDayQualifier(cronPattern) + 'at ' + joinList(times);
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
  function interpretDayQualifier(cronPattern) {
    if (cronPattern.date !== '*') {
      if (cronPattern.month !== '*') {
        return 'on ' + interpretMonthNames(cronPattern.month) + ' ' +
          interpretDateOrdinals(cronPattern.date) + ' ';
      }

      return 'on the ' + interpretDateOrdinals(cronPattern.date) + ' ';
    }

    if (cronPattern.month !== '*') {
      return 'every day in ' + interpretMonthNames(cronPattern.month) + ' ';
    }

    if (cronPattern.weekday !== '*') {
      return 'every ' + interpretWeekdays(cronPattern) + ' ';
    }

    return 'every day ';
  }

  // Render a date field (single, list, or range) as suffixed ordinals.
  function interpretDateOrdinals(dateField) {
    if (includes(dateField, '-')) {
      var bounds = dateField.split('-');

      return getOrdinal(bounds[0]) + ' through ' + getOrdinal(bounds[1]);
    }

    return joinList(dateField.split(',').map(toOrdinal));
  }

  // Render a month field (single, list, or range) as names.
  function interpretMonthNames(monthField) {
    if (includes(monthField, '-')) {
      var bounds = monthField.split('-');

      return getMonth(bounds[0]) + ' through ' + getMonth(bounds[1]);
    }

    return joinList(monthField.split(',').map(toMonthName));
  }

  // `map`-safe wrappers that ignore the index/array arguments.
  function toOrdinal(value) {
    return getOrdinal(value);
  }

  function toMonthName(value) {
    return getMonth(value);
  }

  // Weekday field.
  function interpretWeekdays(cronPattern) {
    var weekdayField = cronPattern.weekday;

    if (includes(weekdayField, '-')) {
      return weekdayField.split('-').map(getWeekday).join('-');
    }
    else if (includes(weekdayField, ',')) {
      weekdayField = weekdayField.split(',').map(getWeekday);

      return weekdayField.slice(0, -1).join(', ') + ', and ' +
        weekdayField[weekdayField.length - 1];
    }

    return getWeekday(cronPattern.weekday);
  }

  // Turn an hour field (and optional minute field) into a clock time, e.g.
  // "3:45 PM" with AM/PM, or "15:45" in 24-hour mode.
  function getTime(h, m) {
    if (isNaN(h)) {
      throw new Error('Tried to interpret "' + JSON.stringify(h) +
        '" as an hour and failed.');
    }

    if (m === '*' || typeof m === 'undefined' || m === null) {
      m = 0;
    }

    if (!AMPM) {
      return pad(h) + ':' + pad(m);
    }

    var period = h < 12 ? 'AM' : 'PM';

    return (h % 12 || 12) + ':' + pad(m) + ' ' + period;
  }

  // Get English number names for the integers zero through ten.
  function getNumber(n) {
    if (SHORT) {
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
    var m = Math.abs(n);
    var suffix = suffixes[m];

    if (!suffix) {
      m = (m % 100 - 20) % 10;
      suffix = suffixes[m] || suffixes[0];
    }

    return n + suffix;
  }

  // Get English month names from a number or from an abbreviation.
  function getMonth(m) {
    var month = monthNames[m] || monthAbbreviations[m];

    return month && month[SHORT ? 1 : 0];
  }

  // Get English weekday names from a number or from an abbreviation.
  function getWeekday(d) {
    var weekday = weekdayNames[d] || weekdayAbbreviations[d];

    return weekday && weekday[SHORT ? 1 : 0];
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

  /* global define */
  if (typeof define === 'function' && define.amd) {
    // Export in AMD.
    define([], function() {
      return cronli5;
    });
  }
  else if (typeof exports === 'object') {
    // Export in Node.js.
    module.exports = cronli5;
  }
  else {
    // Export in the browser.
    root.cronli5 = cronli5;
  }
}(this));
