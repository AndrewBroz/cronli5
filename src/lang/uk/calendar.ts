// The calendar parts of a Ukrainian description: the day (a day of the
// month, a weekday, or both), the month and the year. A month's name may
// be taken into the day («1 червня», «в останній день червня»), and a
// single year follows a month's name directly («1 січня 2030 року»).

import type {Cadence, Phrase, Piece} from './words.js';
import type {
  QuartzDate, QuartzWeekday, RangeDescription, ScheduleFacts,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {
  calendarRun, choose, combined, counted, dispatch, excepting, identity,
  isPair, join, laboured, listed, nameOf, ordered, phrase, present, withIn
} from './words.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {UkrainianStyle} from './options.js';

const {endings, months, nthWords, units, weekdays, words} = lexicon;

// The lengths of the cycles a run of calendar values may wrap round. Years
// do not wrap; theirs only has to exceed any run.
const DAYS = 31;
const MONTHS = 12;
const WEEK = 7;
const YEARS = 10000;

// Weekday pieces are said only for more days than this.
const MOST_WEEKDAYS_LISTED = 4;

// The sets of weekdays that have a name of their own.
const weekdayIdioms: {[days: string]: string} = {
  '0,6': words.weekends,
  '1,2,3,4,5': words.weekdays
};

const lastWords = {
  feminine: words.lastFeminine,
  masculine: words.lastMasculine
};

/** One part of the sentence, with how it joins the parts around it. */
export interface Part {
  text: string;
  // Whether it ends in an exception, which a comma closes.
  exception: boolean;
  // Whether it ends in a month's name, which a single year follows.
  named: boolean;
  // Whether a comma sets it off from the part before it.
  setOff: boolean;
}

// A phrase for the day, with whether it has said the month already.
interface DayPhrase extends Phrase {
  monthSaid: boolean;
  named: boolean;
}

// A phrase for the months, with the months it lists when it is a list.
interface MonthPhrase extends Phrase {
  listed: number[] | null;
  named: boolean;
  setOff: boolean;
}

interface DateContext {
  // The months said together with the day: «1 червня», «1 січня та 1
  // липня».
  fused: number[] | null;
  style: UkrainianStyle;
}

interface MonthContext {
  // Whether the months follow a day of the month.
  afterDate: boolean;
  // What is said before them.
  before: string;
  // The one day of the month they follow, which each listed month takes.
  day: number | null;
  style: UkrainianStyle;
}

type Exception = Extract<SetDescription, {kind: 'except'}>;

function none(): null {
  return null;
}

function ordinal(value: number): string {
  return `${value}${endings.genitive}`;
}

function isAll(candidates: SetDescription[] | null): boolean {
  return candidates !== null && candidates[0].kind === 'all';
}

function never(): boolean {
  return false;
}

function wraps(description: SetDescription): boolean {
  return dispatch(description, {
    all: never,
    cadence: never,
    except: function inBase(exception) {
      return wraps(exception.base);
    },
    pieces: function inPart(pieces) {
      return pieces.parts.some(wraps);
    },
    range: function backwards(run) {
      return run.from > run.to;
    },
    values: never
  });
}

/**
 * A field's candidate descriptions. A run that wraps round the cycle is
 * only true while nothing coarser is restricted; where it is not allowed
 * the set is described again in ascending order.
 */
function unwrapped(
  facts: ScheduleFacts,
  field: 'date' | 'hour' | 'month',
  mayWrap: boolean
): SetDescription[] {
  const candidates = facts.analyses.candidates[field] as SetDescription[];
  const domain = domainOf(field);

  return mayWrap || !candidates.some(wraps) ?
    candidates :
    describeSet(denote(candidates[0], domain), {...domain, cyclic: false});
}

function genitiveOf(month: number, style: UkrainianStyle): string {
  return nameOf(months[month], 'genitive', style);
}

function locativeOf(month: number, style: UkrainianStyle): string {
  return nameOf(months[month], 'locative', style);
}

// One day in each of several months, every date in full: «1 січня та 1
// липня».
function fullDates(
  day: number,
  inMonths: number[],
  style: UkrainianStyle
): string {
  return listed(inMonths.map(function date(month) {
    return `${day} ${genitiveOf(month, style)}`;
  }));
}

function dayPhrase(spoken: Phrase, monthSaid: boolean): DayPhrase {
  return {...spoken, monthSaid, named: false};
}

// A plain set of days of the month.
function dateSayer(context: DateContext) {
  const {fused, style} = context;
  const [ending, noun] = fused ?
    ['', genitiveOf(fused[0], style)] :
    [endings.genitive, words.daysOfMonth];
  const monthSaid = Boolean(fused);

  function point(day: number): string {
    return `${day}${ending}`;
  }

  function all(): DayPhrase {
    const inMonth = fused &&
      withIn(words.everyDay, locativeOf(fused[0], style));

    return dayPhrase(phrase(join([words.everyDay, inMonth]), 0), monthSaid);
  }

  function values(description: ValuesDescription): DayPhrase {
    const text = fused && fused.length > 1 ?
      fullDates(description.values[0], fused, style) :
      `${listed(description.values.map(point))} ${noun}`;

    return {
      ...dayPhrase(phrase(text, description.values.length), monthSaid),
      named: monthSaid
    };
  }

  function range(description: RangeDescription): DayPhrase | null {
    return isPair(description, DAYS) ?
      null :
      dayPhrase(phrase(calendarRun(point(description.from),
        `${point(description.to)} ${noun}`), 2), monthSaid);
  }

  function cadence(description: Cadence): DayPhrase {
    const toTheEnd = description.last + description.interval > DAYS;
    const every = `${words.every} ${counted(description.interval, units.day)}`;

    if (description.interval === 2 && toTheEnd && description.start <= 2) {
      return dayPhrase(phrase(
        description.start === 1 ? words.oddDays : words.evenDays, 1), false);
    }

    return dayPhrase(toTheEnd ?
      phrase(`${every} ${words.from} ${ordinal(description.start)} ` +
        `${words.daysOfMonth}`, 2) :
      laboured(`${every} ${calendarRun(ordinal(description.start),
        `${ordinal(description.last)} ${words.daysOfMonth}`)}`, 3), false);
  }

  function pieces(description: {parts: Piece[]}): DayPhrase {
    const parts = ordered(description.parts, identity).map(say)
      .filter(present);

    return {
      ...dayPhrase(combined(parts), monthSaid),
      named: parts[parts.length - 1].named
    };
  }

  function except(description: Exception): DayPhrase | null {
    const removed = listed(description.removed.map(ordinal));
    const base = say(description.base);

    return base && {
      ...excepting(base, join([removed,
        description.base.kind === 'all' && words.daysOfMonth]),
      description.removed.length) as DayPhrase,
      named: false
    };
  }

  function say(description: SetDescription): DayPhrase | null {
    return dispatch(description, {all, cadence, except, pieces, range, values});
  }

  return say;
}

// A Quartz day of the month. `ofMonth` is «місяця» or the months' names.
function quartzDate(
  form: QuartzDate,
  before: string,
  ofMonth: string,
  context: DateContext
): string {
  const {fused, style} = context;

  return dispatch(form, {
    beforeLast: function beforeLast(counting) {
      return counting.days === 1 ?
        `${withIn(before, words.penultimateDay)} ${ofMonth}` :
        `${words.within} ${counted(counting.days, units.day)} ` +
          `${words.beforeLastDayOf} ${ofMonth}`;
    },
    last: function last() {
      return `${withIn(before, words.lastDay)} ${ofMonth}`;
    },
    firstWeekday: function firstWeekday() {
      return `${withIn(before, words.firstWorkingDay)} ${ofMonth}`;
    },
    lastWeekday: function lastWeekday() {
      return `${withIn(before, words.lastWorkingDay)} ${ofMonth}`;
    },
    nearestWeekday: function nearestWeekday(nearest) {
      const date = fused ?
        fullDates(nearest.day, fused, style) :
        `${ordinal(nearest.day)} ${words.daysOfMonth}`;

      return withIn(before,
        `${words.nearest} ${date} ${words.workingDay}`);
    }
  });
}

// A Quartz weekday of the month: the last one, or the nth.
function quartzWeekday(
  form: QuartzWeekday,
  before: string,
  style: UkrainianStyle
): string {
  const day = weekdays[form.weekday];
  const gender = day.feminine ? 'feminine' : 'masculine';
  const which = dispatch(form, {
    last: function last() {
      return lastWords[gender];
    },
    nth: function nth(counting) {
      return nthWords[gender][counting.nth - 1];
    }
  });

  return withIn(before, `${which} ${nameOf(day, 'accusative', style)}`);
}

// Where a weekday stands in a week that starts on Monday.
function inWeek(weekday: number): number {
  return (weekday + WEEK - 1) % WEEK;
}

// A plain set of weekdays. `count` is how many days it holds: pieces are
// said only for more than four, and an exception only for six.
function weekdaySayer(count: number, style: UkrainianStyle) {
  function names(days: number[], form: 'genitive' | 'locativePlural') {
    return listed(days.map(function name(day) {
      return nameOf(weekdays[day], form, style);
    }));
  }

  function inWeekOrder(days: number[]): number[] {
    return days.slice().sort(function earlier(a, b) {
      return inWeek(a) - inWeek(b);
    });
  }

  function recurring(days: number[]): Phrase {
    return phrase(
      `${words.onDays} ${names(days, 'locativePlural')}`, days.length);
  }

  function all(): Phrase {
    return phrase(words.everyDay, 0);
  }

  function values(description: ValuesDescription): Phrase {
    return recurring(inWeekOrder(description.values));
  }

  function range(description: RangeDescription): Phrase {
    return isPair(description, WEEK) ?
      recurring([description.from, description.to]) :
      phrase(calendarRun(names([description.from], 'genitive'),
        names([description.to], 'genitive')), 2);
  }

  function pieces(description: {parts: Piece[]}): Phrase | null {
    return count > MOST_WEEKDAYS_LISTED ?
      combined(ordered(description.parts, inWeek).map(say).filter(present)) :
      null;
  }

  function except(description: Exception): Phrase | null {
    return count === WEEK - 1 ?
      excepting(say(description.base),
        names(description.removed, 'genitive'), 1) :
      null;
  }

  function say(description: SetDescription): Phrase | null {
    return dispatch(description,
      {all, cadence: none, except, pieces, range, values});
  }

  return say;
}

function monthPhrase(spoken: Phrase, named: boolean): MonthPhrase {
  return {...spoken, listed: null, named, setOff: false};
}

// A set of months, where the day has not said them already.
function monthSayer(context: MonthContext) {
  const {afterDate, before, day, style} = context;

  function all(): MonthPhrase {
    return monthPhrase(phrase('', 0), false);
  }

  function values(description: ValuesDescription): MonthPhrase {
    const inMonths = description.values;
    const text = day === null ?
      withIn(before, listed(inMonths.map(function name(month) {
        return locativeOf(month, style);
      }))) :
      fullDates(day, inMonths, style);

    return {
      ...monthPhrase(phrase(text, inMonths.length), true),
      listed: inMonths
    };
  }

  function range(description: RangeDescription): MonthPhrase | null {
    const run = calendarRun(genitiveOf(description.from, style),
      genitiveOf(description.to, style));

    return isPair(description, MONTHS) ?
      null :
      monthPhrase(
        phrase(join([afterDate && words.everyMonth, run]), 2), false);
  }

  function cadence(description: Cadence): MonthPhrase | null {
    return afterDate && description.interval === 2 &&
        description.start <= 2 && description.last + 2 > MONTHS ?
      monthPhrase(phrase(`${words.everyOtherMonth} ${words.from} ` +
        `${genitiveOf(description.start, style)}`, 2), false) :
      null;
  }

  function pieces(description: {parts: Piece[]}): MonthPhrase {
    const parts = ordered(description.parts, identity);
    const befores = [
      before,
      ...parts.slice(2).map(function comma() {
        return ',';
      }),
      words.andPiece
    ];
    const said = parts.map(function each(part, index) {
      return monthSayer({...context, before: befores[index]})(part);
    }).filter(present);

    return monthPhrase(combined(said), said[said.length - 1].named);
  }

  function except(description: Exception): MonthPhrase | null {
    const base = say(description.base);
    const removed = listed(description.removed.map(function name(month) {
      return genitiveOf(month, style);
    }));
    const kept = base && join(
      [base.text, !base.text && afterDate && words.eachMonth]);

    return base && {
      ...base,
      exception: true,
      laboured: true,
      length: base.length + description.removed.length,
      named: false,
      setOff: !kept,
      text: join([kept && `${kept},`, words.except, removed])
    };
  }

  function say(description: SetDescription): MonthPhrase | null {
    return dispatch(description, {all, cadence, except, pieces, range, values});
  }

  return say;
}

// A set of years. `named` is whether a month's name comes just before.
function yearSayer(before: string, named: boolean) {
  function all(): Phrase {
    return phrase('', 0);
  }

  function values(description: ValuesDescription): Phrase {
    const years = description.values;
    const noun = years.length > 1 ? words.yearsLocative : words.yearLocative;

    return phrase(named && years.length === 1 ?
      `${years[0]} ${words.year}` :
      `${words.in} ${listed(years)} ${noun}`, years.length);
  }

  function range(description: RangeDescription): Phrase | null {
    return isPair(description, YEARS) ?
      null :
      phrase(calendarRun(description.from,
        `${description.to} ${words.year}`), 2);
  }

  function cadence(description: Cadence): Phrase {
    const toTheEnd = description.last + description.interval >= YEARS;
    const every = description.interval === 2 ?
      `${words.everyNthYear} ${words.otherYear}` :
      `${words.everyNthYear} ${ordinal(description.interval)} ${words.year}`;

    if (description.interval === 2 && toTheEnd && description.start <= 1971) {
      return phrase(withIn(before, description.start === 1970 ?
        words.evenYears :
        words.oddYears), 1);
    }

    return toTheEnd ?
      phrase(`${every} ${words.from} ${ordinal(description.start)}`, 2) :
      laboured(`${every} ${calendarRun(ordinal(description.start),
        ordinal(description.last))}`, 3);
  }

  // A year beside a run of years is said as a year alone is.
  function pieces(description: {parts: Piece[]}): Phrase {
    return combined(ordered(description.parts, identity)
      .map(yearSayer(before, false)).filter(present));
  }

  function say(description: SetDescription): Phrase | null {
    return dispatch(description,
      {all, cadence, except: none, pieces, range, values});
  }

  return say;
}

// One side of the day: a Quartz form, a plain set, or nothing when the
// field takes every value.
function sideOf<Form>(
  arm: {kind: 'quartz'; form: Form} | {kind: 'values'} | null,
  candidates: SetDescription[] | null,
  quartz: (form: Form) => DayPhrase,
  plain: (candidates: SetDescription[]) => DayPhrase
): DayPhrase | null {
  if (arm && arm.kind === 'quartz') {
    return quartz(arm.form);
  }

  return candidates && !isAll(candidates) ? plain(candidates) : null;
}

function closed(part: {exception: boolean; text: string}): string {
  return part.exception ? `${part.text},` : part.text;
}

// The last part that says anything.
function lastSaid(parts: Part[]): Part {
  return parts.filter(function said(part) {
    return part.text !== '';
  }).pop() as Part;
}

// What the calendar parts share: the months as they may be said, and
// which of them the day takes into itself.
interface Setting {
  // The months a day phrase says in place of «місяця»: one month always,
  // a list only when a single kind of day is named.
  carried: number[] | null;
  // The days of the month, when they are a plain set narrower than all.
  days: number[];
  monthCandidates: SetDescription[];
  monthContext: MonthContext;
  style: UkrainianStyle;
}

function settingOf(facts: ScheduleFacts, style: UkrainianStyle): Setting {
  const {candidates, day: {union}} = facts.analyses;
  const monthCandidates = unwrapped(facts, 'month', isAll(candidates.year));
  const days = candidates.date && !isAll(candidates.date) ?
    denote(candidates.date[0], domainOf('date')) :
    [];
  const afterDate = days.length > 0 && !union;
  const monthContext: MonthContext = {
    afterDate,
    before: '',
    day: afterDate && days.length === 1 ? days[0] : null,
    style
  };
  const named = (choose(monthCandidates, monthSayer(monthContext)) as
    MonthPhrase).listed;

  return {
    carried: named && (named.length === 1 || !union) ? named : null,
    days,
    monthCandidates,
    monthContext,
    style
  };
}

// The day of the month and the weekday, each as it is said, in order.
function daySides(
  facts: ScheduleFacts,
  before: string,
  setting: Setting
): DayPhrase[] {
  const {candidates, day: {date, weekday}} = facts.analyses;
  const {carried, days, style} = setting;
  const monthSaid = Boolean(carried);
  const ofMonth = carried ?
    listed(carried.map(function name(month) {
      return genitiveOf(month, style);
    })) :
    words.ofMonth;
  const fused = carried && (carried.length === 1 || days.length === 1) ?
    carried :
    null;
  const dateSide = sideOf(date, candidates.date,
    function quartz(form) {
      return {
        ...dayPhrase(phrase(quartzDate(form, before, ofMonth,
          {fused: carried, style}), 1), monthSaid),
        named: monthSaid && form.kind !== 'nearestWeekday'
      };
    },
    function plain() {
      return choose(unwrapped(facts, 'date', isAll(candidates.year) &&
        isAll(candidates.month)), dateSayer({fused, style})) as DayPhrase;
    });
  const weekdaySide = sideOf(weekday, candidates.weekday,
    function quartz(form) {
      const which = quartzWeekday(form, dateSide ? words.also : before, style);

      return {
        ...dayPhrase(phrase(`${which} ${ofMonth}`, 1), monthSaid),
        named: monthSaid
      };
    },
    function plain(described) {
      const held = denote(described[0], domainOf('weekday'));
      const idiom = weekdayIdioms[held.join(',')];

      return dayPhrase(idiom ?
        phrase(idiom, 1) :
        choose(described, weekdaySayer(held.length, style)) as Phrase,
      false);
    });

  return [dateSide, weekdaySide].filter(present);
}

// The day part: the sides joined by «, а також», each carrying a single
// month when there are two of them; «щодня» when no day is named and the
// time asks for it.
function dayOf(
  sides: DayPhrase[],
  everyDay: boolean,
  setting: Setting
): Part & {monthSaid: boolean} {
  const {carried, style} = setting;
  const said = sides.map(function withMonth(side) {
    return sides.length > 1 && carried && !side.monthSaid ?
      {
        ...side,
        exception: false,
        monthSaid: true,
        named: true,
        text: `${closed(side)} ` +
          `${withIn(side.text, locativeOf(carried[0], style))}`
      } :
      side;
  });
  const unnamed = join([everyDay && words.everyDay]);
  const last = said[said.length - 1] ?? dayPhrase(phrase(unnamed, 0), false);

  return {
    exception: last.exception,
    monthSaid: last.monthSaid,
    named: last.named,
    setOff: false,
    text: said.map(function textOf(side) {
      return side.text;
    }).join(`, ${words.also} `) || unnamed
  };
}

/**
 * The day, month and year parts. `time` is the part before them, and
 * `everyDay` whether the day must say «щодня» when no day is named.
 */
function calendarParts(
  facts: ScheduleFacts,
  time: Part,
  everyDay: boolean,
  style: UkrainianStyle
): {day: Part; month: Part; year: Part} {
  const {candidates, day: {union}} = facts.analyses;
  const setting = settingOf(facts, style);
  const day = dayOf(daySides(facts, time.text, setting), everyDay, setting);
  const beforeMonth = closed(lastSaid([time, day]));
  const inMonths = choose(setting.monthCandidates, monthSayer({
    ...setting.monthContext,
    before: union ? `${beforeMonth},` : beforeMonth
  })) as MonthPhrase;
  const month: Part = day.monthSaid ?
    {...inMonths, exception: false, named: false, text: ''} :
    {...inMonths, setOff: inMonths.setOff || union};
  const beforeYear = lastSaid([time, day, month]);
  const year = choose(candidates.year as SetDescription[],
    yearSayer(closed(beforeYear), beforeYear.named)) as Phrase;

  return {day, month, year: {...year, named: false, setOff: false}};
}

export {calendarParts, isAll, unwrapped};
