// The French extractor for the relational stability engine. Day numbers are
// bare digits ('le 13', 'du 3 au 9'; the ordinal '1er' contributes its
// digit), so time digits match the sweep too — harmlessly, since both sides
// of the arm comparison share the time body and the noise cancels.

import cronli5 from '../../../src/cronli5.js';
import fr from '../../../src/lang/fr/index.js';

// fr ships one voice; custom style objects merge over it.
const dialects = [null];

const WEEKDAY_NAME =
  /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)s?/g;

// Spelled cadence intervals; 'deux' maps to the engine's 'other' so the
// parity-cadence fold recognizes an interval-2 set.
const CADENCE_WORDS = {
  cinq: '5', deux: 'other', dix: '10', huit: '8', neuf: '9',
  quatre: '4', sept: '7', six: '6', trois: '3'
};

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect, lang: fr} : {lang: fr});
}

// The date-arm tokens: bare digits plus normalized markers.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\d+/g)) {
    tokens.push(m[0]);
  }

  const cadence = new RegExp('tous les ' +
    '(deux|trois|quatre|cinq|six|sept|huit|neuf|dix|\\d+) jours du mois', 'g');

  for (const m of noWeekdays.matchAll(cadence)) {
    tokens.push('cadence:' + (CADENCE_WORDS[m[1]] ?? m[1]));
  }

  if ((/jour impair/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/jour pair\b/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/dernier jour du mois/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/jour ouvrable le plus proche/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// The weekday display order.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function name(m) {
    return m[1];
  });
}

// The day-free time body: the leading "tous les jours " qualifier stripped.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^tous les jours /, '');
}

// The parity idiom absorbs the cadence's start digit (parity starts are 1
// or 2).
const parityStartTokens = ['1', '2'];

const frExtractor = {
  dateTokens, dialects, parityStartTokens, render, timeBody, weekdayOrder
};

export {frExtractor as fr};
