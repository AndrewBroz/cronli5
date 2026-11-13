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
// to :59, and `minuteBlock` the whole minute.
const units = {
  date: '일',
  hour: '시',
  hourBlock: '시대',
  hours: '시간',
  minute: '분',
  minuteBlock: '분대',
  month: '월',
  second: '초',
  year: '년'
};

// The ordinal words a Quartz "nth weekday" uses, from the first.
const nthWords = ['첫째', '둘째', '셋째', '넷째', '다섯째'];

// The function words and fixed phrases.
const words = {
  after: '뒤',
  aheadOf: '보다',
  allDay: '하루 종일',
  also: '그리고',
  am: '오전',
  andAfterConsonant: '과',
  andAfterVowel: '와',
  at: '에',
  but: '단',
  dayBefore: '전날',
  daysAhead: '앞선 날',
  duringThatMinute: '그 1분 동안',
  each: '각각',
  eachThen: '그때마다',
  ellipsis: '…',
  evenDates: '짝수일',
  evenMonths: '짝수 달',
  evenYears: '짝수 해',
  every: '마다',
  everyDay: '매일',
  everyHour: '매시',
  everyMinute: '매분',
  everyMonth: '매월',
  everyWeek: '매주',
  everyYear: '매년',
  except: '제외',
  firstWeekday: '첫 평일',
  forOneMinute: '1분 동안',
  from: '부터',
  fromThen: '그때부터',
  ifNextMonth: '다음 날이 다음 달이면 이틀 전 금요일',
  ifSaturday: '토요일이면 전날 금요일',
  ifSunday: '일요일이면 다음 날 월요일',
  ifSundayAtMonthEnd: '일요일이면 이틀 전 금요일',
  is: '인',
  last: '마지막',
  lastDate: '말일',
  lastWeekday: '마지막 평일',
  listMark: '·',
  neverRuns: '없는 날짜라 실행되지 않음',
  neverRunsSentence: '없는 날짜라 실행되지 않습니다',
  noon: '낮',
  oddDates: '홀수일',
  oddMonths: '홀수 달',
  oddYears: '홀수 해',
  onTheHour: '정각',
  oneMinuteEach: '1분씩',
  onlyWhen: '때만',
  pm: '오후',
  rangeMark: '~',
  runs: '실행됩니다',
  skippedDays: '없는 날은 건너뜀',
  skippedMonths: '없는 달은 건너뜀',
  skippedYears: '없는 해는 건너뜀',
  startup: '시스템 시작 시',
  thatYear: '그해',
  thenAnd: '그때와',
  throughout: '내내',
  topicAfterConsonant: '은',
  topicAfterVowel: '는',
  twoDaysBefore: '이틀 전',
  unrecognizable: '올바르지 않은 cron 패턴',
  until: '까지',
  weekdayGloss: '월~금, 공휴일 포함'
};

const lexicon = {
  nthWords, units, weekOrder, weekdaySuffix, weekdays, words
};

export type {Name};
export default lexicon;
