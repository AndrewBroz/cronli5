// The Chinese extractor for the relational stability engine. Weekday lists
// collapse to bare day characters after the first ("周二、四、六、日"), so
// the order reader expands each run; day numbers are bare digits with time
// digits as symmetric noise, like every digit-numeral language.

import cronli5 from '../../../src/cronli5.js';
import zh from '../../../src/lang/zh/index.js';

// The default plus the explicit Simplified alias; the Traditional glyph map
// (zh-Hant) is experimental and joins when it stabilizes.
const dialects = [null, 'zh-Hans'];

// A weekday run: "周X" then any "、Y" continuations (bare day characters).
const WEEKDAY_RUN = /周([一二三四五六日])((?:、[一二三四五六日])*)/g;

function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect, lang: zh} : {lang: zh});
}

// The date-arm tokens: bare digits plus normalized markers, with weekday
// runs stripped first so their day characters never read as dates.
function dateTokens(text) {
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
function weekdayOrder(text) {
  const names = [];

  for (const m of text.matchAll(WEEKDAY_RUN)) {
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
