// The English extractor for the relational stability engine
// (tooling/scripts/stability-engine.mjs): the render binding, the token
// regexes, the day-free strip patterns, and the dialect list. A new
// language ports this file, swapping the surface forms for its own; the
// engine vocabulary ('cadence:<n>', 'parity:odd|even', 'quartz:<slug>')
// stays fixed.

import cronli5 from '../../../src/cronli5.js';

// The default (us) plus each named dialect. Grammar is dialect-independent;
// only typography varies, and the extractor reads day words, which no
// English dialect restyles.
const dialects = [null, 'gb', 'house'];

const WEEKDAY_NAME =
  /(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)s?/g;

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect} : {});
}

// The date-arm tokens of a rendering: day ordinals plus normalized
// cadence/parity/Quartz markers. Weekday names are stripped first so the
// same extractor serves date-only and union renderings; the engine's time
// prefixes never produce ordinals, so every ordinal present is the date's.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\b(\d+(?:st|nd|rd|th))\b/g)) {
    tokens.push(m[1]);
  }

  for (const m of noWeekdays.matchAll(
    /every (other|\d+(?:st|nd|rd|th)) day/g)) {
    tokens.push('cadence:' + m[1]);
  }

  if ((/odd-numbered day/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/even-numbered day/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/last day of the month/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/weekday nearest the/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// The weekday display order of a rendering, as a name list.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function name(m) {
    return m[1];
  });
}

// The time body of a [minute, hour] prefix: its day-free rendering with the
// day-qualifier words stripped. This exact string must survive in every
// day-restricted rendering of the same time.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^every day at /, 'at ')
    .replace(/,? every day$/, '')
    .replace(/^every day /, '');
}

// The parity idiom absorbs its start ordinal (parity starts are 1 or 2).
const parityStartTokens = ['1st', '2nd'];

const en = {
  dateTokens, dialects, parityStartTokens, render, timeBody, weekdayOrder
};

export {en};
