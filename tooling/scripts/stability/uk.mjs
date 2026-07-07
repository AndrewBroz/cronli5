// The Ukrainian extractor for the relational stability engine
// (tooling/scripts/stability-engine.mjs). Two declared donor-vs-target
// surface-form transformations are folded here, both from src/lang/uk/notes.md:
//
// - The bare day-of-month qualifier reads a spelled genitive ordinal
//   ("тринадцятого", "п'ятнадцятого" — notes.md §2), but the OR-union's
//   single-value predicate reads a DIGIT ordinal instead ("13-те", "15-те" —
//   index.ts's unionOrdinalDigit). Both forms name the same day, so this
//   extractor folds each to its bare digit before comparison — the same kind
//   of declared fold the engine's own `normalized()` applies to the
//   parity/cadence equivalence, just one layer earlier (surface form, not
//   engine vocabulary).
// - Weekday names decline into up to four surface forms per day (nominative,
//   genitive, accusative, locative plural — notes.md §4/§5/§7), depending on
//   which of the renderer's day-qualifier positions names them. `weekdayOrder`
//   folds every inflected form to one canonical per-day code so the order
//   check compares identity, not case.
//
// Ukrainian ships one voice — no dialect axis exists (notes.md "Anchors").

import cronli5 from '../../../src/cronli5.js';
import uk from '../../../src/lang/uk/index.js';

const dialects = [null];

// Weekday inflected forms (nominative, genitive, accusative, locative
// plural — accusative coincides with nominative for the four masculine
// weekdays, so those lists have only three distinct strings) mapped to a
// fixed per-day code.
const WEEKDAY_FORMS = {
  FRI: ['п\'ятниця', 'п\'ятниці', 'п\'ятницю', 'п\'ятницях'],
  MON: ['понеділок', 'понеділка', 'понеділках'],
  SAT: ['субота', 'суботи', 'суботу', 'суботах'],
  SUN: ['неділя', 'неділі', 'неділю', 'неділях'],
  THU: ['четвер', 'четверга', 'четвергах'],
  TUE: ['вівторок', 'вівторка', 'вівторках'],
  WED: ['середа', 'середи', 'середу', 'середах']
};

const WEEKDAY_TO_CODE = {};
const weekdayForms = [];

Object.keys(WEEKDAY_FORMS).forEach(function collect(code) {
  WEEKDAY_FORMS[code].forEach(function form(word) {
    WEEKDAY_TO_CODE[word] = code;
    weekdayForms.push(word);
  });
});

// Longest-first: some of one day's inflected forms are a literal prefix of
// another (locative plural "п'ятницях" begins with the nominative
// "п'ятниця"), so the longer form must be tried first at a shared start
// position or the shorter one wins and leaves a dangling suffix.
weekdayForms.sort(function longestFirst(a, b) {
  return b.length - a.length;
});

const WEEKDAY_NAME = new RegExp(weekdayForms.join('|'), 'g');

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect, lang: uk} : {lang: uk});
}

// The bare day-of-month qualifier's spelled genitive ordinals (index.ts's
// own dateOrdinalGenitive table, notes.md §2). The extractor duplicates the
// surface forms rather than importing the renderer's internal table, the
// same way every other language's extractor reads rendered text.
const SPELLED_ORDINALS = [
  null,
  'першого', 'другого', 'третього', 'четвертого', 'п\'ятого',
  'шостого', 'сьомого', 'восьмого', 'дев\'ятого', 'десятого',
  'одинадцятого', 'дванадцятого', 'тринадцятого', 'чотирнадцятого',
  'п\'ятнадцятого', 'шістнадцятого', 'сімнадцятого', 'вісімнадцятого',
  'дев\'ятнадцятого', 'двадцятого',
  'двадцять першого', 'двадцять другого', 'двадцять третього',
  'двадцять четвертого', 'двадцять п\'ятого', 'двадцять шостого',
  'двадцять сьомого', 'двадцять восьмого', 'двадцять дев\'ятого',
  'тридцятого', 'тридцять першого'
];

const ORDINAL_TO_NUMBER = {};

SPELLED_ORDINALS.forEach(function index(word, n) {
  if (word) {
    ORDINAL_TO_NUMBER[word] = n;
  }
});

const ordinalWords = Object.keys(ORDINAL_TO_NUMBER).sort(
  function longestFirst(a, b) {
    return b.length - a.length;
  });

const SPELLED_ORDINAL_RE = new RegExp(ordinalWords.join('|'), 'g');

// The union frame's day predicate reads a digit ordinal instead of the
// spelled genitive word ("13-те число", "1-ше число" — notes.md's
// unionOrdinalDigit): folded back to the bare digit(s) by this extractor. A
// multi-value date list shares one trailing "число місяця" across every
// comma-joined ordinal ("1-ше, 15-те число") — the capture group spans the
// whole run so every value in it surfaces, not just the one immediately
// before "число".
const DIGIT_ORDINAL_RE = /((?:\d+-[а-яіїєґ']+(?:,\s*)?)+) число/g;

// The day-of-month cadence marker: "кожного 3-го дня місяця" (digit
// interval) or "кожного другого дня місяця" (the spelled interval-2 idiom,
// mirroring en's "every other day").
const CADENCE_RE = /кожного (?:(\d+)-[а-яіїєґ']+|другого) дня місяця/g;

// A cadence's own explicit start offset, named separately after the cadence
// itself ("...дня місяця, починаючи з 2-го," — index.ts's
// unionCadenceDateClause/positionOrdinalM): the masculine "-го" digit
// ordinal is used only for this day-count offset, never a time-of-day
// offset (those take a feminine "-ї" suffix plus a unit noun), so it cannot
// collide with the clock-side "починаючи з" idioms.
const CADENCE_START_RE = /починаючи з (\d+)-го/g;

// The date-arm tokens: spelled and digit-ordinal day numbers (folded to bare
// digit strings), plus normalized cadence/parity/Quartz markers. Weekdays
// are stripped first so the same extractor serves date-only and union
// renderings.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(CADENCE_RE)) {
    tokens.push('cadence:' + (m[1] ?? 'other'));
  }

  for (const m of noWeekdays.matchAll(CADENCE_START_RE)) {
    tokens.push(m[1]);
  }

  // The interval-2 cadence spells its count as "другого" ("кожного другого
  // дня місяця") — the same word the bare start-ordinal offset uses ("...
  // починаючи з другого"). Strip the matched cadence phrase before scanning
  // for ordinals, or the interval's own "другого" would double-count as a
  // second start-ordinal token.
  const noCadence = noWeekdays.replace(CADENCE_RE, '');

  for (const m of noCadence.matchAll(SPELLED_ORDINAL_RE)) {
    tokens.push('' + ORDINAL_TO_NUMBER[m[0]]);
  }

  for (const m of noCadence.matchAll(DIGIT_ORDINAL_RE)) {
    for (const n of m[1].matchAll(/\d+/g)) {
      tokens.push(n[0]);
    }
  }

  // The union frame's nearest-workday appositive names its day in the
  // digit register ("робочий день, найближчий до 15-го") — a declared
  // register split against the spelled genitive/accusative qualifier forms
  // ("до п'ятнадцятого числа"); both carry the same date token.
  const appositive = (/робочий день, найближчий до (\d+)-го/)
    .exec(noWeekdays);

  if (appositive) {
    tokens.push(appositive[1]);
  }

  if ((/непарний день місяця/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  // "парний" ("even") is a literal suffix of "непарний" ("odd"), so the
  // even check must refuse a position preceded by "не".
  if ((/(?<!не)парний день місяця/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  // The bare, unqualified `L` (no month attached) reads the shorter
  // "останнього числа" (no trailing "місяця" — notes.md §2's bare
  // day-of-month idiom, reconciled round 3); a month-attached or
  // otherwise-qualified last-day reads the fuller "останнього дня місяця"/
  // "останній день місяця". Both name the same quartz:last-day landmark.
  if ((/останн(?:ього числа(?: місяця)?|ій день місяця)/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  // The nearest-workday landmark declines by position (a declared
  // transformation, not drift): genitive as the leading anchor
  // ("найближчого робочого дня до …"), accusative as a mid-sentence dated
  // qualifier ("у найближчий робочий день до …"), and a nominative
  // appositive inside the union frame ("робочий день, найближчий до
  // 15-го,"). All three name the same landmark token.
  const nearestForms = new RegExp('найближчого робочого дня до|' +
    'найближчий робочий день до|робочий день, найближчий до');

  if (nearestForms.test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// The weekday display order of a rendering, normalized to one code per day
// regardless of which grammatical case surfaced it.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function code(m) {
    return WEEKDAY_TO_CODE[m[0]];
  });
}

// The day-free time body: the leading "щодня " qualifier stripped when
// present. A cadence-framed time (a stepped/ranged hour or minute) carries
// no such qualifier to begin with, so the regex is a no-op there, mirroring
// en's own not-always-present strips.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^щодня\s+/, '');
}

// The parity idiom absorbs the cadence's start ordinal (parity starts are
// only 1 or 2 — notes.md §6/§8).
const parityStartTokens = ['1', '2'];

const ukExtractor = {
  dateTokens, dialects, parityStartTokens, render, timeBody, weekdayOrder
};

export {ukExtractor as uk};
