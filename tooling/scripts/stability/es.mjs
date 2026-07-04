// The Spanish extractor for the relational stability engine
// (tooling/scripts/stability-engine.mjs). Spanish day numbers are bare
// digits ('el 13', 'del 3 al 9'), so time digits match the ordinal sweep
// too — harmlessly: the date-only and union renderings share the same time
// body (frame stability), so time digits contribute equal tokens to both
// sides of the arm comparison and cancel.

import cronli5 from '../../../src/cronli5.js';
import es from '../../../src/lang/es/index.js';

// The neutral default plus the shipped regional dialects.
const dialects = [null, 'es-MX', 'es-US'];

const WEEKDAY_NAME =
  /(lunes|martes|miércoles|jueves|viernes|sábados?|domingos?)/g;

// Spelled cadence intervals (numero() spells one through ten; larger
// intervals stay digits). 'dos' maps to the engine's 'other' so the
// parity-cadence fold recognizes an interval-2 set.
const CADENCE_WORDS = {
  cinco: '5', cuatro: '4', diez: '10', dos: 'other', nueve: '9',
  ocho: '8', seis: '6', siete: '7', tres: '3'
};

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect, lang: es} : {lang: es});
}

// The date-arm tokens: bare digits (day numbers plus symmetric time noise)
// and the normalized cadence/parity/Quartz markers.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\d+/g)) {
    tokens.push(m[0]);
  }

  const cadence =
    /cada (dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+) días del mes/g;

  for (const m of noWeekdays.matchAll(cadence)) {
    tokens.push('cadence:' + (CADENCE_WORDS[m[1]] ?? m[1]));
  }

  if ((/día impar/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/día par\b/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/último día del mes/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/día laborable más cercano/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// The weekday display order, normalized to singular names.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function name(m) {
    return m[1].replace(/(sábado|domingo)s$/, '$1');
  });
}

// The day-free time body: the leading "todos los días " qualifier stripped.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^todos los días /, '');
}

// The parity idiom absorbs the cadence's start digit (parity starts are 1
// or 2: 'cada dos días del mes desde el 2' == 'un día par del mes').
const parityStartTokens = ['1', '2'];

const esExtractor = {
  dateTokens, dialects, parityStartTokens, render, timeBody, weekdayOrder
};

export {esExtractor as es};
