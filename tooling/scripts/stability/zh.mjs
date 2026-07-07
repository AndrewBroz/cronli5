// The Chinese extractor for the relational stability engine. Weekday lists
// collapse to bare day characters after the first ("周二、四、六、日"), so
// the order reader expands each run; day numbers are bare digits with time
// digits as symmetric noise, like every digit-numeral language.

import cronli5 from '../../../src/cronli5.js';
import zh, {HANT} from '../../../src/lang/zh/index.js';

// All three variants. zh-Hant is a pure 1:1 glyph map applied at the render
// boundary, so the extractor folds it back to Simplified with the inverse
// map before token extraction — one source of truth, no duplicate regexes.
const dialects = [null, 'zh-Hans', 'zh-Hant'];

const HANS = Object.fromEntries(
  Object.entries(HANT).map(function invert([hans, hant]) {
    return [hant, hans];
  }));

function toHans(text) {
  return Array.from(text, function fold(glyph) {
    return HANS[glyph] ?? glyph;
  }).join('');
}

// A weekday run: "周X" then any "、Y" continuations (bare day characters).
const WEEKDAY_RUN = /周([一二三四五六日])((?:、[一二三四五六日])*)/g;

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect, lang: zh} : {lang: zh});
}

// The date-arm tokens: bare digits plus normalized markers, with weekday
// runs stripped first so their day characters never read as dates.
function dateTokens(rendered) {
  const text = toHans(rendered);
  const noWeekdays = text.replace(WEEKDAY_RUN, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\d+/g)) {
    tokens.push(m[0]);
  }

  for (const m of noWeekdays.matchAll(/每(\d+)天/g)) {
    tokens.push('cadence:' + (m[1] === '2' ? 'other' : m[1]));
  }

  if ((/单数日/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/双数日/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/最后一天/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/最接近\d+日的工作日/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens;
}

// The weekday display order, each collapsed run expanded to full names.
function weekdayOrder(rendered) {
  const names = [];

  for (const m of toHans(rendered).matchAll(WEEKDAY_RUN)) {
    names.push('周' + m[1]);

    for (const bare of m[2].matchAll(/[一二三四五六日]/g)) {
      names.push('周' + bare[0]);
    }
  }

  return names;
}

// The day-free time body: the leading "每天" qualifier stripped.
function timeBody(time, dialect) {
  return render(time[0] + ' ' + time[1] + ' * * *', dialect)
    .replace(/^每天/, '');
}

// The parity idiom absorbs the cadence's start digit.
const parityStartTokens = ['1', '2'];

const zhExtractor = {
  dateTokens, dialects, parityStartTokens, render, timeBody, weekdayOrder
};

export {zhExtractor as zh};
