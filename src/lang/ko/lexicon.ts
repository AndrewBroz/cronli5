// The Korean lexicon: every word the renderer says, and nothing else.
// Numbers are written as digits and months are their numbers, so there are
// no numeral or month tables.

/** A weekday in its full and short written forms. */
interface Name {
  full: string;
  short: string;
}

// The suffix a full weekday name carries; a list or a range says it once,
// after its last name.
const weekdaySuffix = '요일';

function weekday(short: string): Name {
  return {full: `${short}${weekdaySuffix}`, short};
}

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: Name[] = ['일', '월', '화', '수', '목', '금', '토'].map(weekday);

// The order a list of weekdays is said in: Monday first, Sunday last.
const weekOrder = [1, 2, 3, 4, 5, 6, 0];

// Each unit as it follows a numeral. An hour is `hour` as a point on the
// clock and `hours` as a length; `hourBlock` is the whole hour from :00
// to :59.
const units = {
  date: '일',
  hour: '시',
  hourBlock: '시대',
  hours: '시간',
  minute: '분',
  month: '월',
  second: '초',
  year: '년'
};

// The ordinal words a Quartz "nth weekday" uses, from the first.
const nthWords = ['첫째', '둘째', '셋째', '넷째', '다섯째'];

// The function words and fixed phrases.
const words = {
  allDay: '하루 종일',
  also: '그리고',
  alsoAt: '에도',
  am: '오전',
  among: '중',
  amongThose: '그중',
  andAfterConsonant: '과',
  andAfterVowel: '와',
  at: '에',
  before: '전',
  but: '단',
  commonYearFebruary: '평년 2월',
  dayBefore: '전날',
  each: '각각',
  evenDates: '짝수일',
  evenHours: '짝수 시',
  evenMonths: '짝수 달',
  evenYears: '짝수 해',
  every: '마다',
  everyDay: '매일',
  everyHour: '매시',
  everyLeapYear: '윤년마다',
  everyMinute: '매분',
  everyMonth: '매월',
  everyWeek: '매주',
  everyWeekdayGloss: '월~금, 공휴일 무관',
  everyYear: '매년',
  except: '제외',
  firstWeekday: '첫 평일',
  forOneMinute: '1분간',
  fallsUnder: '에 해당하는 경우에만',
  from: '부터',
  ifSaturday: '토요일이면 전날 금요일',
  ifSunday: '일요일이면 다음 날 월요일',
  ifSundayAtMonthEnd: '일요일이면 이틀 전 금요일',
  ifWeekend: '주말이면 같은 달 안에서 가장 가까운 금요일이나 월요일',
  inMonthsUpTo: '일까지 있는 달은',
  interval: '간격으로',
  is: '인',
  isDay: '인 날',
  last: '마지막',
  lastDate: '말일',
  lastWeekday: '마지막 평일',
  leapYear: '윤년',
  leapYearFebruary: '윤년 2월',
  listMark: '·',
  neverRuns: '없는 날짜라 실행되지 않음',
  neverRunsSentence: '없는 날짜라 실행되지 않습니다',
  noon: '낮',
  oddDates: '홀수일',
  oddHours: '홀수 시',
  oddMonths: '홀수 달',
  oddYears: '홀수 해',
  of: '의',
  onTheHour: '정각',
  onlyIf: '인 경우에만',
  pm: '오후',
  rangeMark: '~',
  runs: '실행됩니다',
  skipped: '건너뜀',
  skippedDays: '없는 날은 건너뜀',
  skippedMonths: '없는 달은 건너뜀',
  skippedYears: '없는 해는 건너뜀',
  startup: '시스템 시작 시',
  subjectAfterConsonant: '이',
  subjectAfterVowel: '가',
  thatYear: '그해',
  thoseYears: '이들 해',
  throughout: '내내',
  too: '도',
  topicAfterConsonant: '은',
  topicAfterVowel: '는',
  twoDaysBefore: '이틀 전',
  unrecognizable: '올바르지 않은 cron 패턴',
  until: '까지'
};

const lexicon = {
  nthWords, units, weekOrder, weekdaySuffix, weekdays, words
};

export type {Name};
export default lexicon;
