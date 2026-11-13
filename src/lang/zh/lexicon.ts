// The Chinese (Simplified) lexicon: every word the renderer says, and
// nothing else. Chinese words do not change form, so each is one string.

/** The minutes or seconds of a clock time, always two digits: "05". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

// Indexed by cron's weekday number: 0 is Sunday. Each follows 周 or 每周.
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

// The part of the day a 12-hour time is preceded by, by its first hour.
const dayParts = [
  {from: 0, word: '凌晨'},
  {from: 5, word: '早上'},
  {from: 8, word: '上午'},
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
  round: '轮',
  second: '秒',
  year: '年'
};

// The function words and fixed phrases.
const words = {
  alsoPoints: '以及',
  at: '在',
  being: '为',
  andDays: '以及',
  andExceptions: '及',
  bothAt: '均在',
  eachHourOf: '每小时的',
  eachMinuteOf: '每分钟的',
  eachOfTheMonths: '各月',
  eachMinuteOfThem: '每一分钟',
  eachSecondOfThem: '每一秒',
  eachOfDays: '每逢',
  eachOneRound: '各一轮',
  eachRound: '每轮',
  eachYear: '每年',
  evenDays: '逢双日',
  evenDaysOfMonth: '双日',
  evenHours: '偶数小时',
  evenYears: '每逢偶数年',
  every: '每',
  everySecondOnce: '每秒一次',
  everyDay: '每天',
  everyHourOnTheHour: '每小时整点',
  everyMonth: '每月',
  except: '除',
  excepted: '除外',
  exceptedEnd: '外',
  first: '首',
  firstAt: '首次在',
  fromYear: '自',
  hasNo: '没有',
  inItsMinute: '所在分钟的',
  inside: '内',
  interval: '间隔',
  last: '末',
  lastDay: '最后一天',
  lastOne: '最后一个',
  leapYearsOnly: '仅闰年',
  movedBackToFriday: '遇周六、周日提前至周五',
  movedOnToMonday: '遇周六、周日顺延至周一',
  nearestFridayOrMonday: '遇周六、周日改在当月最近的周五或周一',
  neverRuns: '永不执行',
  nextDay: '次日',
  nextYear: '次年',
  nth: '第',
  nthFromLast: '倒数第',
  nthOne: '个',
  oddDays: '逢单日',
  oddDaysOfMonth: '单日',
  oddHours: '奇数小时',
  oddYears: '每逢奇数年',
  of: '的',
  or: '或',
  once: '一次',
  oneRound: '一轮',
  oneYearIn: '中的一年',
  onwards: '起',
  runsAt: '执行时间',
  skippedWhereMissing: '当月无此日则不执行',
  startup: '系统启动时',
  thatYear: '当年',
  times: '次',
  to: '至',
  unrecognizable: '无法识别的cron表达式',
  week: '周',
  whenItIs: '时'
};

// Punctuation, all full-width but the colon of a clock time.
const marks = {
  close: '）',
  colon: ':',
  comma: '，',
  ellipsis: '……',
  lead: '：',
  list: '、',
  open: '（',
  stop: '。'
};

const lexicon = {dayParts, marks, twoDigits, units, weekdays, words};

export default lexicon;
