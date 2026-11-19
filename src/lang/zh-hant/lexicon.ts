// The Traditional Chinese lexicon: every word the renderer says, and
// nothing else. Chinese has no inflection, so every entry is one form.

/** The two written prefixes of a weekday name: 週一, 星期一. */
interface WeekdayPrefixes {
  星期: string;
  週: string;
}

/** A part of a colon clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

// Indexed by cron's weekday number: 0 is Sunday. The numeral alone, as it
// stands after 週 or 星期, in a list (週一、三、五) and at the end of a short
// range (週一至五). The week is said from Monday to Sunday (answers 5.1).
const weekdays: string[] = ['日', '一', '二', '三', '四', '五', '六'];

// What stands before a weekday numeral, by the `weekday` style field.
const weekdayPrefixes: WeekdayPrefixes = {星期: '星期', 週: '週'};

// The parts of the day a 12-hour time carries, each with the first hour
// it covers (answers 1.2): 凌晨 0–5, 上午 6–11, 中午 12, 下午 13–18,
// 晚上 19–23.
const dayParts: Array<{from: number; word: string}> = [
  {from: 0, word: '凌晨'},
  {from: 6, word: '上午'},
  {from: 12, word: '中午'},
  {from: 13, word: '下午'},
  {from: 19, word: '晚上'}
];

// The ordinal of a weekday in its month, from the first: 第二個週一.
const nthNumerals: string[] = ['一', '二', '三', '四', '五'];

// Each unit as a position (after a number that names a moment) and as a
// length (after a number that counts).
const units = {
  day: {length: '天', position: '日'},
  hour: {length: '小時', position: '時'},
  minute: {length: '分鐘', position: '分'},
  month: {position: '月'},
  second: {length: '秒', position: '秒'},
  year: {length: '年', position: '年'}
};

// The function words and fixed phrases. A phrase with a slot is said with
// the value where the comment puts it.
const words = {
  // Joins and marks.
  and: '及',
  comma: '，',
  listMark: '、',
  semicolon: '；',
  bracketOpen: '（',
  bracketClose: '）',
  // Between two colon clock times, and between everything else.
  rangeMark: '～',
  to: '至',
  // Before a number: 第2個, 第30秒, 倒數第4天.
  ordinal: '第',

  // Recurrence.
  every: '每',
  everyDay: '每天',
  everyMonth: '每月',
  everyYear: '每年',
  everyHour: '每小時',
  everyMinute: '每分鐘',
  everySecond: '每秒',
  // 每逢31日, 每逢偶數年, 每逢閏年.
  whenever: '每逢',
  once: '一次',
  // 每小時的30分, 9、17時的5、20、45分.
  of: '的',
  // 每小時整點; 每小時的整點至56分.
  onTheHour: '整點',
  // 每逢雙數時，整個小時內每分鐘一次.
  withinWholeHour: '整個小時內',
  // 每逢整點起的1分鐘內，每秒一次.
  minuteFromThen: '起的1分鐘內',
  // 每5分鐘，該分鐘內每秒一次; 該分鐘的0、30秒.
  thatMinute: '該分鐘',
  within: '內',
  // After hours each named with its part of the day: ，各在05、20、45分.
  eachAt: '各在',
  // Every second hour, from 0時 and from 1時: 每逢雙數時的15、45分.
  evenHours: '雙數時',
  oddHours: '單數時',
  // Before single moments said after the rate: ，另加 22:00.
  plus: '另加',
  // Between runs and cadences of years: ，以及2045年起每5年.
  andAlso: '以及',
  // After a start: 01:00起, 2030年起, 每月1日起.
  onward: '起',

  // Exceptions and limits, inside brackets.
  except: '除外',
  // 15日除外，但遇週五照常.
  butWhenMeeting: '但遇',
  asUsual: '照常',
  // 適逢週三的15日除外.
  fallingOn: '適逢',
  only: '限',
  // 2030年（含）以前.
  inclusive: '含',
  before: '以前',

  // Days.
  oddDays: '單數日',
  evenDays: '雙數日',
  lastDay: '最後一天',
  // 倒數第4天.
  countingBack: '倒數',
  monthEnd: '月底',
  nextMonth: '次月',
  // 最後一個週五, 第2個週一.
  lastOne: '最後一個',
  nthCounter: '個',
  // The weekday nearest a date, as a condition and its remedy.
  whenMeeting: '遇',
  movedEarlierTo: '提前至',
  movedLaterTo: '順延至',
  // 若30日是當月最後一天則提前至週五, around the date.
  ifDate: '若',
  isLastDayThen: '是當月最後一天則',

  // Months and years.
  oddMonths: '單數月',
  evenMonths: '雙數月',
  nextYear: '翌年',
  // Parity of years names its era: 每逢西元雙數年.
  evenYears: '西元雙數年',
  oddYears: '西元單數年',
  // In one closing bracket with a month: 每年6月、2030年全年除外.
  wholeYear: '全年',
  leapYears: '閏年',
  // Closes the frame before a union: 每年6月期間，.
  during: '期間',

  // Times.
  nextDay: '翌日',

  // A schedule that never fires.
  never: '永不執行（沒有這個日期）',
  neverInTheseYears: '永不執行（指定的年份沒有這個日期）',

  // The three forms and the fixed texts.
  runsAt: '執行時間：',
  fullStop: '。',
  startup: '系統啟動時',
  unrecognizable: '無法辨識的排程'
};

const lexicon = {
  dayParts, nthNumerals, twoDigits, units, weekdayPrefixes, weekdays, words
};

export type {WeekdayPrefixes};
export default lexicon;
