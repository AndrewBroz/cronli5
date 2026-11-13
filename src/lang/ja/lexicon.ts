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
  // A day of the month (15日).
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
  after: 'の場合は',
  allDay: '終日',
  allTheWhile: 'その間は',
  alsoBeing: 'で',
  also: 'および',
  am: '午前',
  and: 'と',
  but: 'ただし',
  dayBefore: '前日',
  daysBefore: '日前',
  each: 'ごと',
  eachGets: 'ずつ',
  eachOne: 'それぞれ',
  evenDays: '偶数日',
  evenHours: '偶数の時間帯',
  evenMonths: '偶数月',
  evenYears: '偶数年',
  everyDay: '毎日',
  everyHour: '毎時',
  everyMinute: '毎分',
  everyMonth: '毎月',
  everyWeek: '毎週',
  everyYear: '毎年',
  excepted: 'を除く',
  forOneMinute: '1分間',
  fromThen: 'からの',
  from: 'から',
  fromOn: '以降',
  inEach: 'いずれも',
  inMonthsWith: 'のある月',
  inYearsWith: 'のある年',
  justAfter: '直後の',
  justBefore: '直前の',
  lacks: 'はありません',
  lastDay: '末日',
  lastNamed: '最終',
  leapYear: 'うるう年',
  never: '実行なし',
  neverRuns: '実行しません',
  nextDay: '翌日',
  nextMonth: '翌月',
  nextYear: '翌年',
  noon: '正午',
  nth: '第',
  oddDays: '奇数日',
  oddHours: '奇数の時間帯',
  oddMonths: '奇数月',
  oddYears: '奇数年',
  of: 'の',
  only: 'のみ',
  pm: '午後',
  runs: '実行します',
  runsAt: 'に',
  startup: 'システム起動時',
  subject: 'が',
  to: 'まで',
  topic: 'は',
  unrecognizable: '認識できないcron式',
  yearsEvery: 'ごとの年'
};

// Punctuation. The colon is half-width; every other mark is full-width.
// The range mark is the wave dash U+301C, not the full-width tilde.
const marks = {
  close: '）',
  colon: ':',
  comma: '、',
  ellipsis: '…',
  list: '・',
  open: '（',
  range: '〜',
  stop: '。'
};

const lexicon = {marks, twoDigits, units, weekdays, words};

export type {WeekdayName};
export default lexicon;
