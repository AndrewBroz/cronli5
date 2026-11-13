// The Japanese lexicon: every word the renderer says, and nothing else.
// Japanese words do not change form, so each is one string; only a weekday
// has a second, shorter name.

/** A weekday in its full and short written forms. */
interface WeekdayName {
  full: string;
  short: string;
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

// The short name is the full one without its last character, 日.
function weekday(full: string): WeekdayName {
  return {full, short: full.slice(0, -1)};
}

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: WeekdayName[] = [
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
].map(weekday);

// Units, as they follow a number.
const units = {
  // A day of the month (15日) and a length in days (5日ごと).
  day: '日',
  // An hour of the day, as a moment (9時).
  hour: '時',
  // A length in hours (2時間ごと).
  hourLength: '時間',
  // An hour of the day as a stretch (9時台).
  hourStretch: '時台',
  // A minute of the hour (30分) and a length in minutes (15分ごと).
  minute: '分',
  month: '月',
  second: '秒',
  year: '年'
};

// The function words and fixed phrases.
const words = {
  also: 'に加えて',
  am: '午前',
  and: 'および',
  before: '前',
  bothAt: 'いずれも',
  each: 'ごと',
  eachTime: '各回',
  evenDays: '偶数日',
  evenHours: '偶数時',
  evenMonths: '偶数月',
  evenYears: '偶数年',
  everyDay: '毎日',
  everyHour: '毎時',
  everyMinute: '毎分',
  everyMonth: '毎月',
  everySecond: '毎秒',
  everyWeek: '毎週',
  everyYear: '毎年',
  excepted: 'を除く',
  exceptedAnd: 'と',
  forOneMinute: '1分間',
  from: 'から',
  fromOn: '以降',
  lastDay: '末日',
  lastNamed: '最終',
  lastOf: '最後の',
  nearest: 'に最も近い',
  nextDay: '翌日',
  nextMonth: '翌月',
  nextYear: '翌年',
  nth: '第',
  oddDays: '奇数日',
  oddHours: '奇数時',
  oddMonths: '奇数月',
  oddYears: '奇数年',
  of: 'の',
  otherThan: '以外',
  pm: '午後',
  runs: '実行します',
  runsAt: 'に',
  startup: 'システム起動時',
  to: 'まで',
  topic: 'は',
  unrecognizable: '認識できないcron式',
  workingDay: '平日'
};

// Punctuation. The colon is half-width; every other mark is full-width.
// The range mark is the wave dash U+301C, not the full-width tilde.
const marks = {
  close: '）',
  colon: ':',
  comma: '、',
  list: '・',
  open: '（',
  range: '〜',
  stop: '。'
};

const lexicon = {marks, twoDigits, units, weekdays, words};

export type {WeekdayName};
export default lexicon;
