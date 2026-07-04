// The German extractor for the relational stability engine. Day ordinals
// are dotted digits ('am 13.'); the only date cadence is the odd-set
// 'jeden zweiten Tag des Monats' (other open steps enumerate their fires
// in every context, so their digit multisets carry the arm comparison).

import cronli5 from '../../../src/cronli5.js';
import de from '../../../src/lang/de/index.js';

// The default plus the shipped Austrian dialect.
const dialects = [null, 'de-AT'];

const WEEKDAY_NAME =
  /(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\w*/gi;

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect, lang: de} : {lang: de});
}

// The date-arm tokens: bare digits plus normalized markers.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\d+/g)) {
    tokens.push(m[0]);
  }

  if ((/jeden zweiten Tag/).test(noWeekdays)) {
    tokens.push('cadence:other');
  }

  if ((/ungeraden Tag/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/geraden Tag/).test(noWeekdays) &&
      !(/ungeraden Tag/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/letzten Tag des Monats/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/nächsten Werktag/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// The weekday display order, normalized to the lowercase stem.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function name(m) {
    return m[1].toLowerCase();
  });
}

// The day-free time body: the leading "täglich " qualifier stripped.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^täglich /, '');
}

// The parity idiom absorbs the cadence's start digit.
const parityStartTokens = ['1', '2'];

const deExtractor = {
  dateTokens, dialects, parityStartTokens, render, timeBody, weekdayOrder
};

export {deExtractor as de};
