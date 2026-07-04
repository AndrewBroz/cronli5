// The Finnish extractor for the relational stability engine. Day ordinals
// are dotted digits ('kuukauden 13. päivänä'), cadence intervals are
// spelled ordinals ('joka kolmas päivä'), and weekday names inflect
// ('perjantaisin', 'maanantaista'), so names match on their stems.

import cronli5 from '../../../src/cronli5.js';
import fi from '../../../src/lang/fi/index.js';

// fi ships one voice; custom style objects merge over it.
const dialects = [null];

const WEEKDAY_NAME =
  /(maanantai|tiistai|keskiviikko|torstai|perjantai|lauantai|sunnuntai)\w*/g;

// Spelled cadence ordinals; 'toinen' maps to the engine's 'other' so the
// parity-cadence fold recognizes an interval-2 set.
const CADENCE_WORDS = {
  kahdeksas: '8', kolmas: '3', kuudes: '6', kymmenes: '10',
  'neljäs': '4', seitsemäs: '7', toinen: 'other', viides: '5',
  'yhdeksäs': '9'
};

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect, lang: fi} : {lang: fi});
}

// The date-arm tokens: bare digits (dotted ordinals contribute their
// digits; time digits are symmetric noise) plus normalized markers.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\d+/g)) {
    tokens.push(m[0]);
  }

  const cadence = new RegExp('joka (toinen|kolmas|neljäs|viides|kuudes|' +
    'seitsemäs|kahdeksas|yhdeksäs|kymmenes|\\d+\\.) päivä', 'g');

  for (const m of noWeekdays.matchAll(cadence)) {
    tokens.push('cadence:' + (CADENCE_WORDS[m[1]] ?? m[1]));
  }

  if ((/parittomina päivinä/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/parillisina päivinä/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/viimeisenä päivänä/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/lähinnä olevana arkipäivänä/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// The weekday display order, normalized to the name stem.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function name(m) {
    return m[1];
  });
}

// The day-free time body: the leading "joka päivä " qualifier stripped.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^joka päivä /, '');
}

// The parity idiom absorbs the cadence's start digit (parity starts are 1
// or 2).
const parityStartTokens = ['1', '2'];

const fiExtractor = {
  dateTokens, dialects, parityStartTokens, render, timeBody, weekdayOrder
};

export {fiExtractor as fi};
