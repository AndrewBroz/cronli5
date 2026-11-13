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
  am: '오전',
  andAfterConsonant: '과',
  andAfterVowel: '와',
  at: '에',
  before: '전',
  dayBefore: '전날',
  each: '각각',
  eachTime: '매번',
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
  firstDay: '첫날',
  forOneHour: '1시간 동안',
  forOneMinute: '1분간',
  from: '부터',
  ifWeekend: '주말이면',
  is: '인',
  isNot: '아닌',
  last: '마지막',
  lastDate: '말일',
  lastDay: '마지막 날',
  listMark: '·',
  nearestInMonth: '같은 달의 가장 가까운',
  neverRuns: '없는 날짜라 실행되지 않음',
  neverRunsSentence: '없는 날짜라 실행되지 않습니다',
  noon: '낮',
  notWeekend: '주말이 아닌',
  oddDates: '홀수일',
  oddMonths: '홀수 달',
  oddYears: '홀수 해',
  ofThatHour: '그 시의',
  ofThatMinute: '그 분의',
  onTheHour: '정각',
  or: '이나',
  pm: '오후',
  rangeMark: '~',
  runs: '실행됩니다',
  skippedDays: '없는 날은 건너뜀',
  skippedMonths: '없는 달은 건너뜀',
  skippedYears: '없는 해는 건너뜀',
  startup: '시스템 시작 시',
  subject: '이',
  thatYear: '그해',
  throughout: '내내',
  twoDaysBefore: '이틀 전',
  unrecognizable: '올바르지 않은 cron 패턴',
  until: '까지'
};

const lexicon = {
  nthWords, units, weekOrder, weekdaySuffix, weekdays, words
};

export type {Name};
export default lexicon;
