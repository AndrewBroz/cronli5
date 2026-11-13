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
  hoursCounted: '个小时',
  minute: '分钟',
  month: '月',
  round: '轮',
  second: '秒',
  year: '年'
};

// The function words and fixed phrases.
const words = {
  alsoPoints: '以及',
  andDays: '和',
  andExceptions: '及',
  at: '在',
  eachHour: '每小时',
  eachHourOf: '每小时的',
  eachMinuteOf: '每分钟的',
  eachRound: '每轮',
  eachTime: '每次',
  eachYear: '每年',
  evenDays: '逢双日',
  evenMonths: '双月',
  evenYears: '偶数年',
  every: '每',
  everyDay: '每天',
  everyHourOnTheHour: '每小时整点',
  everyMonth: '每月',
  except: '除',
  excepted: '除外',
  exceptedEnd: '外',
  lastDay: '最后一天',
  lastOne: '最后一个',
  mondayToFriday: '周一至周五',
  nearestFridayOrMonday: '遇周六、周日改在最近的周五或周一',
  nextDay: '次日',
  nextYear: '次年',
  nth: '第',
  nthFromLast: '倒数第',
  nthOne: '个',
  oddDays: '逢单日',
  oddMonths: '单月',
  oddYears: '奇数年',
  of: '的',
  once: '一次',
  oneRound: '一轮',
  runsAt: '执行时间',
  sameDay: '当天',
  sameMonth: '当月',
  startup: '系统启动时',
  thatMinute: '该分钟',
  these: '这',
  theseMinutes: '这些分钟',
  thisHour: '这一小时',
  thisMinute: '这一分钟',
  to: '至',
  unrecognizable: '无法识别的cron表达式',
  week: '周',
  within: '内',
  workingDay: '工作日'
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
