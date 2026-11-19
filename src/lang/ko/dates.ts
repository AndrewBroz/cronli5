// The day-of-month arm: a set of days against the days its months have,
// and the forms of the field that some schedulers add.

import type {
  DaysInMonths, MonthLengths, QuartzDate, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {denote} from '../../core/describe-set.js';
import {daysByMonths, daysReached} from '../../core/set-views.js';
import {after, join, tight} from './clock.js';
import lexicon from './lexicon.js';
import {dated, monthsSaid, tightParts} from './months.js';
import type {Choice, Described, Except, FieldSet} from './sets.js';
import {
  baseOf, choose, endsOf, fieldOf, isOpen, parityOf, removedOf, runsOf,
  setFrom, setOf
} from './sets.js';

const {units, words} = lexicon;

/** One of the two day fields, said. */
export interface Arm {
  // The day phrase alone, without its months or its «매-».
  bare: string;
  // The weekdays in week order, as a condition names them.
  both: string;
  // Whether the phrase is «매일» with some days left out.
  daily: boolean;
  // The one or two days left out of every day, when the arm is that.
  left: string;
  // Whether the text names months.
  months: boolean;
  // Whether the arm is one date.
  single: boolean;
  // As the arm stands alone, with its months and without its year.
  text: string;
}

/** How a set of days of the month is to be said. */
interface DayWay {
  // Whether every month fires, so that «매월» says where a step starts
  // again.
  monthly: boolean;
  // Whether no exception may be said: the date arm of a union.
  plain: boolean;
}

const exceptions: Choice =
  {allBut: true, ceiling: 12, few: 4, lessCadence: true, split: true};
const plainly: Choice = {ceiling: 12, few: 4, split: true};

const dateParities = [words.evenDates, words.oddDates];
const topic = [words.topicAfterConsonant, words.topicAfterVowel];
const subject = [words.subjectAfterConsonant, words.subjectAfterVowel];
const and = [words.andAfterConsonant, words.andAfterVowel];
const also = `, ${words.also} `;

function ascending(a: number, b: number): number {
  return a - b;
}

/**
 * The months a date can fire in when months are named, or null when
 * every month is reached.
 */
function monthsFired(facts: ScheduleFacts): number[] | null {
  const {candidates, dateReach: reach} = facts.analyses;
  const [first] = candidates.month as SetDescription[];
  const fired = reach &&
    [...reach.everyYear, ...reach.leapYears].sort(ascending) ||
    fieldOf(facts, 'month').values;

  return first.kind !== 'all' && fired || null;
}

/**
 * Whether the date fires in leap years only, so that the year says it. In
 * a union the year belongs to the weekdays too, and the date says it.
 */
function leapOnly(facts: ScheduleFacts, plain = false): boolean {
  const reach = facts.analyses.dateReach;

  return !plain && reach !== null && reach.everyYear.length === 0 &&
    reach.leapYears.length > 0;
}

function tightDays(form: Described): string {
  return tight(tightParts(form), units.date);
}

// A step of days: from its start under «매월» when it runs to the end of
// the month, otherwise with both its ends.
function steppedDays(form: Described, set: FieldSet, how: DayWay): string {
  const {interval, last, start} = endsOf(form, set.domain);
  const runsOut = how.monthly && last + interval > set.domain.max;

  return parityOf(form, set.domain, dateParities) || join(
    `${start}${units.date}${words.from}`,
    !runsOut && `${last}${units.date}${words.until}`,
    `${interval}${units.date}${words.every}`
  );
}

// A set less a few days. Where no exception may be said, the days that
// are left are named and the set follows «의».
function lessDays(form: Except, set: FieldSet, how: DayWay): string {
  const base = sayDays(form.base, set, how);
  const kept = setOf(denote({kind: 'all'}, set.domain).filter(
    function stays(day) {
      return !form.removed.includes(day);
    }
  ), set.domain);

  return how.plain ?
    `${tightDays(choose(kept, plainly))}${words.of} ${base}` :
    `${base}(${tight(form.removed, units.date)} ${words.except})`;
}

const daySayers: {
  [kind: string]: (form: never, set: FieldSet, how: DayWay) => string;
} = {
  all() {
    return words.everyDay;
  },
  cadence: steppedDays,
  cadencePieces(form: {parts: Described[]}, set, how) {
    return form.parts.map(function each(part) {
      return sayDays(part, set, {...how, monthly: false});
    }).join(also);
  },
  except: lessDays,
  pieces: tightDays,
  range: tightDays,
  values: tightDays
};

function sayDays(form: Described, set: FieldSet, how: DayWay): string {
  return daySayers[form.kind](form as never, set, how);
}

// A set of days of the month by the description the answers choose, and
// what the phrase is: every day but a few, a list or a step.
function daysSaid(set: FieldSet, how: DayWay) {
  const full = choose(set, exceptions);
  const named = parityOf(baseOf(full), set.domain, dateParities);
  const form = how.plain && full.kind === 'except' && !named ?
    choose(set, plainly) :
    full;
  const listed = ['values', 'range', 'pieces'].includes(form.kind);
  const few = full.kind === 'except' && isOpen(full) &&
    removedOf(full).length <= 2;

  return {
    apart: listed || form.kind === 'cadence' && !named,
    daily: form.kind === 'except' && isOpen(form),
    left: few && tight(removedOf(full), units.date) || '',
    listed,
    text: sayDays(form, set, how)
  };
}

// A day standing alone, or a whole run, that some reached month lacks is
// skipped there, and the phrase says so. A run only cut short needs no
// note.
function skipNote(set: FieldSet, groups: DaysInMonths[]): string {
  const [first] = groups;
  const lacking = runsOf(set.values).some(function missing(run) {
    return !(first.everyMonth && first.days.includes(run[0]));
  });
  const skipped =
    [words.skippedMonths, words.skippedDays][Number(set.values.length > 1)];

  return lacking && `(${skipped})` || '';
}

// Days that only some of the named months have are said apart with those
// months: «1월·4월의 30일과 1월 31일», «2월 28일과 윤년 2월 29일»; after a
// step of days, «(윤년에는 29일에도)». Empty when the days are not said
// so.
function apartFrom(shared: string, more: DaysInMonths): string {
  const days = tight(more.days, units.date);
  const others = more.months.filter(function everyYear(group) {
    return group.years !== 'leap';
  }).flatMap(function monthsOf(group) {
    return group.months;
  }).sort(ascending);
  const leapToo = more.months.some(function leap(group) {
    return group.years === 'leap';
  });
  const dates = [
    shared,
    others.length > 0 && dated(others, days),
    leapToo && `${words.leapYearFebruary} ${days}`
  ].filter(Boolean) as string[];
  const stepped = shared.endsWith(words.every);

  return [
    dates.reduce(function joined(said, date) {
      return `${after(said, and)} ${date}`;
    }),
    others.length === 0 &&
      `${shared}(${words.leapYearsToo} ${days}${words.alsoAt})` || ''
  ][Number(stepped)];
}

// The days that only some of the named months have, said apart, when
// they are one group beside the days every month has. Empty otherwise.
function daysApart(facts: ScheduleFacts, set: FieldSet, plain: boolean):
  string {
  const groups = daysByMonths(facts) as DaysInMonths[];
  const rest = groups.filter(function some(group) {
    return !group.everyMonth;
  });
  const [first] = groups.filter(function all(group) {
    return group.everyMonth;
  });
  const shared = first && dated(fieldOf(facts, 'month').values,
    daysSaid(setOf(first.days, set.domain), {monthly: false, plain}).text);

  return rest.length === 1 && apartFrom(shared || '', rest[0]) || '';
}

// A plain set of days of the month, against the days its months have.
function plainDates(facts: ScheduleFacts, plain: boolean): Arm {
  const months = monthsFired(facts);
  const reached = daysReached(facts, {linear: true}) as
    {candidates: SetDescription[]; domain: FieldSet['domain']};
  const set = setFrom(reached.candidates, reached.domain);
  const said = daysSaid(set, {monthly: !months, plain});
  const leap = leapOnly(facts, plain);
  const note = said.listed && !leap &&
    skipNote(set, daysByMonths(facts) as DaysInMonths[]) || '';
  const bare = `${said.text}${note}`;
  const apart = months && !leap && said.apart &&
    daysApart(facts, set, plain);

  return {
    bare,
    both: '',
    daily: said.daily,
    left: said.left,
    months: Boolean(months),
    single: set.values.length === 1,
    text: apart || (said.daily ?
      join(months && monthsSaid(months), bare) :
      dated(months, bare))
  };
}

// The words for the weekday nearest a day, by whether the day is its
// month's last: on a last day there is no Monday after.
const nearest = {
  always: `${words.ifSaturday}, ${words.ifSundayAtMonthEnd}`,
  never: `${words.ifSaturday}, ${words.ifSunday}`,
  sometimes: words.ifWeekend
};

const quartzDays: {
  [kind: string]:
  (form: never, facts: ScheduleFacts, lacks: boolean) => string;
} = {
  beforeLast(form: {days: number}) {
    const near = [words.dayBefore, words.twoDaysBefore][form.days - 1];

    return join(words.lastDate,
      near ?? `${form.days}${units.date} ${words.before}`);
  },
  firstWeekday() {
    return `${words.firstWeekday}(${words.everyWeekdayGloss})`;
  },
  last() {
    return words.lastDate;
  },
  lastWeekday() {
    return `${words.lastWeekday}(${words.everyWeekdayGloss})`;
  },
  nearestWeekday(form: {day: number}, facts, lacks) {
    const day = `${form.day}${units.date}`;
    const which = facts.analyses.day.nearestDayIsLast as keyof typeof nearest;
    const skipped = lacks &&
      `, ${after(day, subject)} ${words.skippedMonths}` || '';

    return `${day}(${nearest[which]}${skipped})`;
  }
};

// How a group of months is named in the bracket after a count from the
// month's end. A February of common years is too short for any count
// that leaves a month out, so it is never among them.
const groupLabels: {[years: string]: (group: MonthLengths) => string} = {
  every(group) {
    return `${group.length}${words.inMonthsUpTo}`;
  },
  leap() {
    return after(words.leapYearFebruary, topic);
  }
};

const februaries: {[years: string]: string} =
  {common: words.commonYearFebruary, leap: words.leapYearFebruary};

// A group's date: under its months, or under February by the sort of
// year.
function groupDate(group: MonthLengths, day: string): string {
  const february = februaries[group.years];

  return february && `${february} ${day}` || dated(group.months, day);
}

const yearSorts: {[years: string]: string} =
  {common: words.commonYear, leap: words.leapYear};

// Three days or more before the last: the date itself where it is one;
// each length's date under named months; under every month the form, with
// the day it comes to in a bracket.
function countedBack(
  facts: ScheduleFacts,
  form: {days: number},
  months: number[] | null
): string {
  const {dateReach: reach, monthLengths: groups} = facts.analyses;
  const head = quartzDays.beforeLast(form as never, facts, false);
  const [first] = groups;

  function dayIn(group: MonthLengths): string {
    return `${group.length - form.days}${units.date}`;
  }

  if (groups.length === 1) {
    return dated(first.months, dayIn(first));
  }

  if (!months) {
    const shown = reach ? groups.slice().reverse() : groups.slice(-1);

    return `${words.everyMonth} ${head}(${[
      ...shown.map(function each(group) {
        return `${groupLabels[group.years](group)} ${dayIn(group)}`;
      }),
      reach && reach.never.length > 0 &&
        `${after(monthsSaid(reach.never), topic)} ${words.skipped}`,
      reach && reach.leapYears.length > 0 &&
        `${after(words.commonYearFebruary, topic)} ${words.skipped}`
    ].filter(Boolean).join(', ')})`;
  }

  if (groups.every(function february(group) {
    return group.years !== 'every';
  })) {
    return `${monthsSaid(months)} ${head}(${groups.map(function each(group) {
      return `${yearSorts[group.years]} ${dayIn(group)}`;
    }).join(', ')})`;
  }

  return groups.map(function each(group) {
    return groupDate(group, dayIn(group));
  }).join(', ');
}

// A form of the day-of-month field that some schedulers add.
function quartzDates(facts: ScheduleFacts, plain: boolean): Arm {
  const {dateReach: reach, day, monthLengths} = facts.analyses;
  const {form} = day.date as {form: QuartzDate};
  const months = monthsFired(facts);
  const lacks = reach !== null && !leapOnly(facts, plain) &&
    reach.leapYears.length + Number(!months) * reach.never.length > 0;
  const bare = quartzDays[form.kind](form as never, facts, lacks);
  const counted = form.kind === 'beforeLast' && form.days > 2 &&
    countedBack(facts, form, months);

  return {
    bare,
    both: '',
    daily: false,
    left: '',
    months: Boolean(months) || Boolean(counted) && monthLengths.length === 1,
    single: true,
    text: counted || dated(months, bare)
  };
}

const dateArms = {quartz: quartzDates, values: plainDates};

/**
 * The day-of-month arm. `plain` is for the date arm of a union, which is
 * never said with an exception.
 */
function dateArm(facts: ScheduleFacts, plain: boolean): Arm {
  const arm = facts.analyses.day.date as {kind: keyof typeof dateArms};

  return dateArms[arm.kind](facts, plain);
}

export {dateArm, leapOnly};
