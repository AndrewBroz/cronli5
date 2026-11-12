// The Chinese (Simplified) lexicon: every word the renderer says, and
// nothing else. Chinese words do not change form, so each is one string.

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

// Indexed by cron's weekday number: 0 is Sunday. Each follows 周 or 每周.
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

// The part of the day a 12-hour time is preceded by, by its first hour.
const dayParts = [
  {from: 0, word: '凌晨'},
  {from: 6, word: '上午'},
  {from: 12, word: '中午'},
  {from: 13, word: '下午'},
  {from: 18, word: '晚上'}
];

// Units, as they follow a number.
const units = {
  date: '日',
  day: '天',
  hour: '小时',
  hourNamed: '点',
  minute: '分钟',
  minuteOfHour: '分',
  month: '月',
  second: '秒',
  year: '年'
};

// The function words and fixed phrases.
const words = {
  also: '以及',
  and: '及',
  at: '在',
  during: '期间',
  eachHourOf: '每小时的',
  eachMinuteOf: '每分钟的',
  eachTime: '每次',
  evenDays: '偶数日',
  evenHours: '偶数小时',
  evenMonths: '偶数月',
  evenYears: '偶数年',
  every: '每',
  everyDay: '每天',
  everyHourOnTheHour: '每小时整点',
  everyMinute: '每分钟',
  everyMonth: '每月',
  everySecond: '每秒',
  everyWeek: '每周',
  except: '除',
  excepted: '除外',
  exceptedEnd: '外',
  first: '前',
  fromOn: '起',
  inEachHour: '各小时',
  last: '最后',
  lastDay: '最后一天',
  lastOne: '最后一个',
  lastWorkingDay: '最后一个工作日',
  nearest: '最接近',
  next: '次',
  nextDay: '次日',
  nextYear: '次年',
  nth: '第',
  nthFromLast: '倒数第',
  nthOne: '个',
  oddDays: '奇数日',
  oddHours: '奇数小时',
  oddMonths: '奇数月',
  oddYears: '奇数年',
  of: '的',
  oneMinute: '1分钟',
  runs: '执行',
  startup: '系统启动时',
  to: '至',
  unrecognizable: '无法识别的cron表达式',
  week: '周',
  wholeMinute: '整分钟',
  within: '内',
  workingDay: '工作日'
};

// Punctuation, all full-width.
const marks = {
  close: '）',
  comma: '，',
  list: '、',
  open: '（',
  stop: '。'
};

const lexicon = {dayParts, marks, twoDigits, units, weekdays, words};

export default lexicon;
