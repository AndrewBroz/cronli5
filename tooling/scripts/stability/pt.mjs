// The Portuguese extractor for the relational stability engine. Like es,
// day numbers are bare digits ('no dia 13', 'do dia 3 ao dia 9'), so time
// digits match the sweep too — harmlessly, since both sides of the arm
// comparison share the time body and the noise cancels. The ordinal '1º'
// contributes its digit.

import cronli5 from '../../../src/cronli5.js';
import pt from '../../../src/lang/pt/index.js';

// pt ships one voice (pt-BR norm); pt-PT is a future dialect axis.
const dialects = [null];

const WEEKDAY_NAME =
  /(segunda|terça|quarta|quinta|sexta|sábado|domingo)s?(?:-feiras?)?/g;

// Spelled cadence intervals; 'dois' maps to the engine's 'other' so the
// parity-cadence fold recognizes an interval-2 set.
const CADENCE_WORDS = {
  cinco: '5', dez: '10', dois: 'other', nove: '9', oito: '8',
  quatro: '4', seis: '6', sete: '7', 'três': '3'
};

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect, lang: pt} : {lang: pt});
}

// The date-arm tokens: bare digits plus normalized markers.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\d+/g)) {
    tokens.push(m[0]);
  }

  const cadence =
    /a cada (dois|três|quatro|cinco|seis|sete|oito|nove|dez|\d+) dias do mês/g;

  for (const m of noWeekdays.matchAll(cadence)) {
    tokens.push('cadence:' + (CADENCE_WORDS[m[1]] ?? m[1]));
  }

  if ((/dia ímpar/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/dia par\b/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/último dia do mês/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/dia útil mais próximo/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// The weekday display order, normalized to the singular stem.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function name(m) {
    return m[1];
  });
}

// The day-free time body: the leading "todos os dias " qualifier stripped.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^todos os dias /, '');
}

// The parity idiom absorbs the cadence's start digit (parity starts are 1
// or 2).
const parityStartTokens = ['1', '2'];

const ptExtractor = {
  dateTokens, dialects, parityStartTokens, render, timeBody, weekdayOrder
};

export {ptExtractor as pt};
