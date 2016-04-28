/**
 * @license
 * Copyright (c) 2016 Andrew Broz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

(function(root) {
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

  // English ordinal names for the integers zero through ten.
  var ordinals = [
    null,
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth'
  ];

  // Ordianl suffixes.
  var suffixes = [
    'th',
    'st',
    'nd',
    'rd'
  ];

  // English month names.
  var monthNames = [
    null,
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // English weekday names.
  var weekdayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  // Month names by abbreviation.
  var monthAbbreviations = {
    JAN:  monthNames[1],
    FEB:  monthNames[2],
    MAR:  monthNames[3],
    APR:  monthNames[4],
    MAY:  monthNames[5],
    JUN:  monthNames[6],
    JUL:  monthNames[7],
    AUG:  monthNames[8],
    SEP:  monthNames[9],
    OCT:  monthNames[10],
    NOV:  monthNames[11],
    DEC:  monthNames[12]
  };

  // Weekday name by abbreviation.
  var weekdayAbbreviations = {
    SUN: weekdayNames[0],
    MON: weekdayNames[1],
    TUE: weekdayNames[2],
    WED: weekdayNames[3],
    THU: weekdayNames[4],
    FRI: weekdayNames[5],
    SAT: weekdayNames[6]
  };

  // A cron pattern to English interpreter.
  //
  // NOTE: `options` includes:
  // - second (boolean): always treat the first value as a second
  // - year (boolean): parse with year
  function cronli5(cronPattern, options) {
    options = parseOptions(options);

    cronPattern = parseCronPattern(cronPattern, options);

    return interpretSeconds(cronPattern) + ' ' +
      interpretMinutes(cronPattern) + ' ' +
      interpretHours(cronPattern) + ' ' +
      interpretDates(cronPattern) + ' ' +
      interpretMonths(cronPattern) + ' ' +
      interpretWeekdays(cronPattern);
  }

  // Second field.
  function interpretSeconds(cronPattern) {
    var secondField = cronPattern.second;

    return interpretRangeOfSeconds(secondField) ||
      interpretRepeatingSeconds(secondField) ||
      interpretMultipleSeconds(secondField) ||
      interpretSingleSecond(secondField);
  }

  function interpretRangeOfSeconds(secondField) {
    if (!secondField.includes('-')) {
      // Not a range pattern.
      return;
    }

    var result = 'every second between ';

    secondField = secondField.split('-');

    var start = secondField[0];
    var interval = secondField[1];

    if (interval > 1) {
      result += getNumber(interval) + ' seconds';
    }
    else if (interval == 1 || interval == 0) {
      result += 'second';
    }

    if (start !== '*' && start !== '0') {
      result += ' past second ' + getNumber(start);
    }

    return result;
  }

  function interpretRepeatingSeconds(secondField) {
    if (!secondField.includes('/')) {
      // Not a repeating interval pattern.
      return;
    }

    var result = 'every ';

    secondField = secondField.split('/');

    var start = secondField[0];
    var interval = secondField[1];

    if (interval > 1) {
      result += getNumber(interval) + ' seconds';
    }
    else if (interval == 1 || interval == 0) {
      result += 'second';
    }

    if (start !== '*' && start !== '0') {
      result += ' past second ' + getNumber(start);
    }

    return result;
  }

  function interpretMultipleSeconds(secondField) {
    if (!secondField.includes(',')) {
      // Not a multiple second pattern.
      return;
    }

    return 'on seconds ' +
      secondField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(secondField.slice(-1)[0]);
  }

  function interpretSingleSecond(secondField) {
    if (secondField === '*') {
      return 'every second';
    }

    if (secondField === '0') {
      return '';
    }

    return 'on second ' + getNumber(secondField);
  }

  // Minute field.
  function interpretMinutes(cronPattern) {
    return interpretMultipleMinutes(cronPattern.minute) ||
      interpretRepeatingMinutes(cronPattern.minute) ||
      interpretSingleMinute(cronPattern.minute);
  }

  function interpretMultipleMinutes(minuteField) {
    if (!minuteField.includes(',')) {
      // Not a multiple minute pattern.
      return;
    }

    minuteField = minuteField.split(',');

    return 'on minutes ' +
      minuteField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(minuteField.slice(-1)[0]);
  }

  function interpretRepeatingMinutes(secondField) {
    if (!secondField.includes('/')) {
      // Not a repeating interval pattern.
      return;
    }

    var result = 'every ';

    secondField = secondField.split('/');

    var start = secondField[0];
    var interval = secondField[1];

    if (interval > 1) {
      result += getNumber(interval) + ' seconds';
    }
    else if (interval == 1 || interval == 0) {
      result += 'second';
    }

    if (start !== '*' && start !== '0') {
      result += ' past second ' + getNumber(start);
    }

    return result;
  }

  function interpretSingleMinute(minuteField) {
    if (minuteField === '*') {
      return 'every minute';
    }

    if (minuteField === '0') {
      return '';
    }

    return 'on minute ' + getNumber(minuteField);
  }

  // Hour field.
  function interpretHours(cronPattern) {
    return interpretMultipleHours(cronPattern.hour) ||
      interpretRepeatingHours(cronPattern.hour) ||
      interpretSingleHour(cronPattern.hour);
  }

  function interpretMultipleHours(hourField) {
    if (!hourField.includes(',')) {
      // Not a multiple minute pattern.
      return;
    }

    hourField = hourField.split(',');

    return 'on hours ' +
      hourField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(hourField.slice(-1)[0]);
  }

  function interpretRepeatingHours(hourField) {
    if (!hourField.includes('/')) {
      // Not a repeating interval pattern.
      return;
    }

    var result = 'every ';

    hourField = hourField.split('/');

    var start = hourField[0];
    var interval = hourField[1];

    if (interval > 1) {
      result += getNumber(interval) + ' hours';
    }
    else if (interval == 1 || interval == 0) {
      result += 'hour';
    }

    if (start !== '*' && start !== '0') {
      result += ' past hour ' + getNumber(start);
    }

    return result;
  }

  function interpretSingleHour(hourField) {
    if (hourField === '*') {
      return 'every hour';
    }

    return 'at ' + getHour(hourField);
  }

  // Date field.
  function interpretDates(cronPattern) {
    return getOrdinal(cronPattern);
  }

  // Month field.
  function interpretMonths(cronPattern) {
    return getMonth(cronPattern.month);
  }

  // Weekday field.
  function interpretWeekdays(cronPattern) {
    return getWeekday(cronPattern.weekday);
  }

  // Turn a simple hour field into 12-hour representation.
  function getHour(n) {
    if (n >= 12) {
      return n - 12 || n + ':00 PM';
    }

    if (n >= 0) {
      return +n || 12 + ':00 AM';
    }

    throw new Error(
      'Tried to interpret "' + JSON.stringify(n) + '" as an hour and failed.');
  }

  // Get English number names for the integers zero through ten.
  function getNumber(n) {
    return numbers[n] || n;
  }

  // Get English ordinals from integers.
  function getOrdinal(n) {
    return ordinals[n] || ordinalize(n);
  }

  // Get suffixed ordinals from integers.
  function ordinalize(n) {
    var m = Math.abs(n);
    var suffix = suffixes[m];

    if (!suffix) {
      m = (m % 100 - 20) % 10;
      suffix = suffixes[m];
    }

    if (!suffix) {
      suffix = suffixes[0];
    }

    return n + suffix;
  }

  // Get English month names from a number or from an abbreviation.
  function getMonth(m) {
    return monthNames[m] || monthAbbreviations[m];
  }

  // Get English weekday names from a number or from an abbreviation.
  function getWeekday(d) {
    return weekdayNames[d] || weekdayAbbreviations[d];
  }

  // Return a parsed options object.
  function parseOptions(options) {
    options = options || {};

    return {
      second: !!options.second,
      year: !!options.year
    };
  }

  // Take a cron pattern as, a cron pattern string, an array of cron fields, a
  // cron-like object (see the final return statement for the format of a
  // cron-like object), or a stringable object that evaluates to a cron pattern
  // string. Returns a cron-like object.
  function parseCronPattern(cronPattern, options) {
    var isArray = cronPattern instanceof Array;

    // Throw if null or empty.
    if (!cronPattern || isArray && cronPattern.length === 0) {
      throw new Error(
        '`cronli5` expects a non-empty cron pattern as the first argument.');
    }

    if (isArray) {
      return cronifyArray(cronPattern, options);
    }

    if (typeof cronPattern === 'object') {
      return cronifyObject(cronPattern);
    }

    if (typeof cronPattern === 'string') {
      return cronifyString(cronPattern, options);
    }

    throw new Error('`cronli5` was passed an unexpected type.');
  }

  // Turn a cronable array into a cron-like object.
  function cronifyArray(cronlikeArray, options) {
    if (cronlikeArray.length > 6) {
      throw new Error('`cronli5` expects a five or six-part cron pattern.');
    }

    if (!options.second && cronlikeArray.length < 6) {
      cronlikeArray.unshift('0');
    }

    return {
      second:  cronlikeArray[0] || '0',
      minute:  cronlikeArray[1] || '*',
      hour:    cronlikeArray[2] || '*',
      date:    cronlikeArray[3] || '*',
      month:   cronlikeArray[4] || '*',
      weekday: cronlikeArray[5] || '*'
    };
  }

  // Turn an object that's already cron-like into a populated cron-like object.
  function cronifyObject(cronlikeObject) {
    if (
      !cronlikeObject.second &&
      !cronlikeObject.minute &&
      !cronlikeObject.hour
    ) {
      throw new Error(
        '`cronli5` expects that any object being interpreted as a cron ' +
        'pattern have at least one of the following properties: `second`, ' +
        '`minute`, or `hour`');
    }

    return {
      second:  cronlikeObject.second || '0',
      minute:  cronlikeObject.minute || cronlikeObject.second ? '*' : '0',
      hour:    cronlikeObject.hour   || '*',
      date:    cronlikeObject.date   || '*',
      month:   cronlikeObject.month  || '*',
      weekday: cronlikeObject.weeday || '*'
    };
  }

  // Turn a string into a cron-like object.
  function cronifyString(cronString, options) {
    var cronlikeArray = cronString.split(/\s+/);

    return cronifyArray(cronlikeArray, options);
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
