// The calendar parts of the sentence: the frame (years and months), the
// day (dates and days of the week) and the closing bracket for months or
// years left out (answers 2, 4.3 and 4.4).

import {
  type DayPhrase, type MonthsDays, sayDates, sayWeekdays
} from './days.js';
import {type Fuse, type MonthsSaid, isRestricted, monthsOf} from './months.js';
import {bracketed, excepting, list} from './write.js';
import type {ScheduleFacts} from '../../core/schedule.js';
import type {ZhHantStyle} from './options.js';
import lexicon from './lexicon.js';
import {sayYears} from './years.js';

const {units, words} = lexicon;
const month = units.month.position;
const date = units.day.position;

/** The calendar parts, before the join that follows them. */
export interface Calendar {
  closing: string;
  day: string;
  frame: string;
}

// What a date is given before it: by the frame, and in the day part
// alone and as one side of a pair.
const fuses: Record<Fuse, {each: string; join?: string; side: string}> = {
  direct: {each: '', side: ''},
  each: {each: words.everyMonth, join: words.comma, side: words.everyMonth},
  none: {each: words.everyMonth, join: '', side: words.everyMonth},
  of: {each: '', join: words.of, side: words.everyMonth}
};

// What the day part is: free of the months, a date and a weekday as a
// pair, or a date the months take.
type DayTold =
  | {kind: 'dated'; phrase: DayPhrase}
  | {kind: 'free'; text: string}
  | {kind: 'pair'; sides: DayPhrase[]};

// What the months and years give the day part to join on to.
interface Setting {
  anchored: boolean;
  // The years and months, without the comma some years end on.
  bare: string;
  // The years and months together.
  lead: string;
  months: MonthsSaid;
  // The years and what stands for "every year", with no month.
  opening: string;
  // The date is one not every month has, and no month is named.
  whenever: boolean;
}

/** Whether a date, a weekday, a month or a year is restricted. */
function narrowsDays(facts: ScheduleFacts): boolean {
  const {candidates} = facts.analyses;

  return [
    candidates.date, candidates.weekday, candidates.month, candidates.year
  ].some(isRestricted);
}

function everyDayBut(inside: string): string {
  return words.everyDay + bracketed(inside);
}

// A date and a weekday where either fires. When one side is every day
// but one or two, the other is what still fires on the day left out.
function eitherDay(dates: DayPhrase, weekdays: DayPhrase): DayTold {
  const sides = [dates, weekdays];
  const out = sides.filter(function isRest(side) {
    return side.kind === 'rest';
  });
  const [kept] = sides.filter(function isKept(side) {
    return side.kind !== 'rest';
  });

  if (out.length === 2) {
    return {
      kind: 'free',
      text: everyDayBut(words.fallingOn + weekdays.body + words.of +
        dates.body + words.except)
    };
  }

  return out.length === 1 ?
    {
      kind: 'free',
      text: everyDayBut(out[0].body + words.except + words.comma +
        words.butWhenMeeting + kept.body + words.asUsual)
    } :
    {kind: 'pair', sides};
}

// The day part of one phrase, with any limit set on it after it.
const standing: Record<DayPhrase['kind'],
  (phrase: DayPhrase, limit: string) => DayTold> = {
    dated(phrase, limit) {
      return {kind: 'dated', phrase: {...phrase, body: phrase.body + limit}};
    },
    rest(phrase, limit) {
      return {
        kind: 'free',
        text: everyDayBut(phrase.body + words.except) + limit
      };
    },
    weekly(phrase, limit) {
      return {kind: 'free', text: words.every + phrase.body + limit};
    }
  };

// A date and a weekday that must both match: the date is the base, said
// as it is said alone, and the days of the week limit it, unless the
// weekday form is itself one day a month, which the dates then limit.
function bothDays(dates: DayPhrase, weekdays: DayPhrase): DayTold {
  const [base, other] = weekdays.kind === 'dated' ?
    [weekdays, dates] :
    [dates, weekdays];
  const limit = other.kind === 'rest' ?
    excepting(other.body) :
    bracketed(words.only + other.body);

  return standing[base.kind]({
    body: base.body,
    kind: base.kind,
    listed: base.listed
  }, limit);
}

// The days of a pattern by which of its day fields are said.
const tellers = {
  both: bothDays,
  date(dates: DayPhrase): DayTold {
    return standing[dates.kind](dates, '');
  },
  pair: eitherDay,
  weekday(dates: DayPhrase, weekdays: DayPhrase): DayTold {
    return standing[weekdays.kind](weekdays, '');
  }
};

function placeFree(told: Extract<DayTold, {kind: 'free'}>, setting: Setting):
  Calendar {
  return {closing: '', day: told.text, frame: setting.lead};
}

// A month or a year over a pair must reach both sides, so the frame
// closes on a word for "during". Under a single month neither side says
// "every month".
function placePair(told: Extract<DayTold, {kind: 'pair'}>, setting: Setting):
  Calendar {
  const [dates, weekdays] = told.sides;
  const {side} = fuses[setting.months.fuse];

  return {
    closing: '',
    day: (setting.whenever ? words.whenever : side) + dates.body + words.and +
      (weekdays.kind === 'weekly' ? words.every : side) + weekdays.body,
    frame: setting.bare && setting.bare + words.during + words.comma
  };
}

function wholeDate(pair: {day: number; month: number}): string {
  return pair.month + month + pair.day + date;
}

// Days with the months that have them: one date whole, or the months and
// then the days.
function monthsWithDays(group: MonthsDays): string {
  const whole = group.months.length + group.days.length === 2;

  return list(group.months.map(String)) + month + (whole ? '' : words.of) +
    list(group.days.map(String)) + date;
}

// Under a list of months: three dates or fewer are each written whole,
// and dates that different months have differently are said group by
// group. Nothing when neither applies.
function spelledOut(phrase: DayPhrase): string {
  const grouped = phrase.grouped ?? [];
  const dates = grouped.flatMap(function eachGroup(group) {
    return group.months.flatMap(function eachMonth(monthOf) {
      return group.days.map(function eachDay(day) {
        return {day, month: monthOf};
      });
    });
  }).sort(function inOrder(a, b) {
    return a.month - b.month || a.day - b.day;
  });

  if (dates.length > 0 && dates.length <= 3) {
    return list(dates.map(wholeDate));
  }

  return phrase.numbers && grouped.length > 1 ?
    grouped.map(monthsWithDays).join(words.and) :
    '';
}

// A date the months take: directly after one month, after a particle
// after a list of them, and with "every month" kept after a run.
function placeDated(told: Extract<DayTold, {kind: 'dated'}>, setting: Setting):
  Calendar {
  const {phrase} = told;
  const fuse = fuses[setting.months.fuse];
  const spelled = setting.months.fuse === 'of' && spelledOut(phrase);
  const everyDay = phrase.span && setting.anchored ? words.everyDay : '';
  const join = fuse.join ?? (phrase.listed ? words.of : '');

  return spelled ?
    {closing: '', day: spelled, frame: setting.opening} :
    {
      closing: '',
      day: (setting.whenever ? words.whenever : fuse.each) + phrase.body +
        everyDay,
      frame: setting.lead + join
    };
}

const placers = {dated: placeDated, free: placeFree, pair: placePair};

// Which day fields are said: [date][weekday].
const modes = [['none', 'weekday'], ['date', 'pair']] as const;

// The day fields that are said. A date that adds nothing to the
// weekdays, or that is every day the months have, is not; nor are
// weekdays beside every day.
function armsOf(facts: ScheduleFacts) {
  const {dateReach: reach, day} = facts.analyses;
  const everyDay = Boolean(reach?.days?.everyDay);
  const dates = everyDay || day.dateAddsNothing ? null : day.date;
  const weekdays = everyDay && day.union ? null : day.weekday;

  return {
    dates,
    mode: modes[Number(dates !== null)][Number(weekdays !== null)],
    weekdays
  };
}

type Arms = ReturnType<typeof armsOf>;

// What the calendar makes of the date: whether it skips a month the
// pattern reaches, and what that does to the months named.
function reachOf(facts: ScheduleFacts, arms: Arms) {
  const {candidates, dateReach: reach, day} = facts.analyses;
  const counted = arms.dates?.kind === 'quartz' &&
    arms.dates.form.kind === 'beforeLast';
  const skips = reach !== null && arms.dates !== null &&
    reach.never.length + reach.leapYears.length > 0;
  // The months are named: by the pattern, or because days counted back
  // from the last name the months they fire in.
  const named = isRestricted(candidates.month) || counted;
  // Only the months the date fires in are named, unless weekdays fire
  // in the others.
  const narrowed = skips && !day.union && named;

  return {
    leap: narrowed && reach.everyYear.length === 0,
    narrowed,
    whenever: skips && !named
  };
}

function daysOf(
  facts: ScheduleFacts,
  arms: Arms,
  anchored: boolean,
  style: ZhHantStyle
): DayTold {
  const {candidates, day} = facts.analyses;

  if (arms.mode === 'none') {
    return {kind: 'free', text: anchored ? words.everyDay : ''};
  }

  const dates = arms.dates && sayDates({
    facts,
    final: day.union ? words.listMark : words.and,
    linear: isRestricted(candidates.month),
    style
  });
  const weekdays = arms.weekdays && sayWeekdays(facts, style);
  const teller = arms.mode === 'pair' && day.both ? 'both' : arms.mode;

  return tellers[teller](dates as DayPhrase, weekdays as DayPhrase);
}

// Months and years left out close the sentence. Together, each is
// marked for what it is.
function closingOf(months: string, years: string): string {
  return excepting(list([
    months && (years && words.everyYear) + months,
    years && years + (months && words.wholeYear)
  ].filter(Boolean)));
}

/** The frame, the day and the closing bracket of a pattern that fires. */
function sayCalendar(
  facts: ScheduleFacts,
  anchored: boolean,
  style: ZhHantStyle
): Calendar {
  const arms = armsOf(facts);
  const reach = reachOf(facts, arms);
  const months = monthsOf(facts, reach.narrowed);
  const years = sayYears(facts);
  const opening = years.lead + years.pause +
    (reach.leap ? words.whenever + words.leapYears : years.month);
  const withMonths = months.text && opening + months.text;
  const told = daysOf(facts, arms, anchored, style);
  const place = placers[told.kind] as
    (told: DayTold, setting: Setting) => Calendar;

  return {
    ...place(told, {
      anchored,
      bare: withMonths || years.lead,
      lead: withMonths || years.lead + years.pause,
      months,
      opening,
      whenever: reach.whenever
    }),
    closing: closingOf(months.closing, years.closing)
  };
}

export {narrowsDays, sayCalendar};
