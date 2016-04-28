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
  // Use English number names for the integers zero through ten.
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

  // Look up a month name by number or by abbreviation.
  var months = {
    '1':  'January',
    JAN:  'January',
    '2':  'February',
    FEB:  'February',
    '3':  'March',
    MAR:  'March',
    '4':  'April',
    APR:  'April',
    '5':  'May',
    MAY:  'May',
    '6':  'June',
    JUN:  'June',
    '7':  'July',
    JUL:  'July',
    '8':  'August',
    AUG:  'August',
    '9':  'September',
    SEP:  'September',
    '10': 'October',
    OCT:  'October',
    '11': 'November',
    NOV:  'November',
    '12': 'December',
    DEC:  'December'
  };

  // Look up a week name by number or by abbreviation.
  var weekdays = {
    '0': 'Sunday',
    SUN: 'Sunday',
    '1': 'Monday',
    MON: 'Monday',
    '2': 'Tuesday',
    TUE: 'Tuesday',
    '3': 'Wednesday',
    WED: 'Wednesday',
    '4': 'Thursday',
    THU: 'Thursday',
    '5': 'Friday',
    FRI: 'Friday',
    '6': 'Saturday',
    SAT: 'Saturday'
  };

  // A cron pattern to English interpreter.
  function explainCron(cronPattern, options) {
    cronPattern = parseCronPattern(cronPattern);

    return interpretSeconds(cronPattern) + ' ' +
      interpretMinutes(cronPattern) + ' ' +
      interpretHours(cronPattern) + ' ' +
      interpretDates(cronPattern) + ' ' +
      interpretMonths(cronPattern) + ' ' +
      interpretWeekdays(cronPattern);
  }

  // Describe the next run time.
  function nextCron(cronPattern, options) {}

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
    return interpretRepeatingMinutes(cronPattern.minute) ||
      interpretMultipleMinutes(cronPattern.minute) ||
      interpretSingleMinute(cronPattern.minute);
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

  function interpretMultipleMinutes(minuteField) {
    if (!minuteField.includes(',')) {
      // Not a multiple minute pattern.
      return;
    }

    return 'on minutes ' +
      minuteField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(minuteField.slice(-1)[0]);
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
    var hourField = cronPattern.hour;
  }

  function interpretSingleHour(hourField) {
    if (hourField === '*') {
      return 'every hour';
    }

    return 'at ' + getHour(hourField);
  }

  // Times (from hour, minute, and second fields).
  function interpretTimes(cronPattern) {

  }

  // Date field.
  function interpretDates(cronPattern) {
    var dateField = cronPattern.date;
  }

  // Month field.
  function interpretMonths(cronPattern) {
    var monthField = cronPattern.month;
  }

  // Weekday field.
  function interpretWeekdays(cronPattern) {
    var weekdayField = cronPattern.weekday;
  }

  // Use English number names for the integers zero through ten.
  function getNumber(n) {
    numbers[n] || n;
  }

  // Turn a simple hour field into 12-hour representation.
  function getHour(n) {
    if (n >= 12) {
      return n - 12 || n + ':00 pm';
    }

    if (n >= 0) {
      return +n || 12 + ':00 am';
    }

    throw new Error(
      'Tried to interpret "' + JSON.stringify(n) + '" as an hour and failed.');
  }

  // Take a cron pattern as, a cron pattern string, an array of cron fields, a
  // cron-like object (see the final return statement for the format of a
  // cron-like object), or a stringable object that evaluates to a cron pattern
  // string. Returns a cron-like object.
  function parseCronPattern(cronPattern) {
    var isArray = cronPattern instanceof Array;

    // Throw if null or empty.
    if (!cronPattern || isArray && cronPattern.length === 0) {
      throw new Error(
        'cronli5 expects a non-empty cron pattern as the first argument.');
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
  }

  function cronifyString(cronString) {
    var cronlikeArray = cronString.split(/\s+/);

    return cronifyArray(cronlikeArray);
  }

  function cronifyArray(cronlikeArray) {
    // Check that the length makes sense.
    if (cronlikeArray.length > 6) {
      throw new Error('cronli5 expects a five or six-part cron pattern.');
    }

    // Normalize to pattern that includes seconds.
    if (cronlikeArray.length < 6) {
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

  function cronifyObject(cronlikeObject) {
    if (
      !cronlikeObject.second &&
      !cronlikeObject.minute &&
      !cronlikeObject.hour
    ) {
      throw new Error(
        '`cronli5` expects that any object to be interpreted as a cron ' +
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

  // Export cronli5
  var cronli5 = {
    explain: explainCron,
    next: nextCron
  };

  /* global define */
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return cronli5;
    });
  }
  else if (typeof exports === 'object') {
    module.exports = cronli5;
  }
  else {
    root.cronli5 = cronli5;
  }
}(this));