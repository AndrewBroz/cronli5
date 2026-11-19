// The days: dates of the month and days of the week, each said as a
// phrase the sentence then sets beside its months (answers 3, 4.3, 4.4
// and 5.3).

import {
  type CadenceForm, type ExceptForm, type Form, type PiecesForm,
  type RangeForm, type Reading, type Sayers, type Span, formOf, sayBy
} from './forms.js';
import type {
  DaysInMonths, QuartzDate, QuartzWeekday, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {bracketed, excepting, list, series, spanText} from './write.js';
import {
  candidatesAs, daysByMonths, daysReached, domainOf
} from '../../core/index.js';
import type {ZhHantStyle} from './options.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;
const date = units.day.position;

/** Days that the same months have. */
export interface MonthsDays {
  days: number[];
  months: number[];
}

/** A set of days as the sentence can place it. */
export interface DayPhrase {
  body: string;
  // The dates as numbers, grouped by the months that have them.
  grouped?: MonthsDays[];
  // A date in a month, every day but those named, or days of the week.
  kind: 'dated' | 'rest' | 'weekly';
  // Dates named one by one: a single month takes them after a particle.
  listed?: boolean;
  // Plain dates, which different months may have differently.
  numbers?: boolean;
  // A stretch of dates, after which "every day" is said before a time.
  span?: boolean;
}

/** What the saying of a pattern's dates needs. */
export interface DateSetting {
  facts: ScheduleFacts;
  // What joins the last of several pieces.
  final: string;
  // Whether the months are restricted, so that no run of dates wraps.
  linear: boolean;
  style: ZhHantStyle;
}

// The setting, with the last day the dates are described against.
interface DateContext extends DateSetting {
  max: number;
}

const weekdayReading: Reading = {
  domain: domainOf('weekday'),
  first: 1,
  run: 3,
  steps() {
    return false;
  }
};

function weekdayName(day: number, style: ZhHantStyle): string {
  return style.weekday + lexicon.weekdays[day];
}

// Days of the week listed from Monday with Sunday last, except that
// Sunday stands first when the set holds Sunday and Monday and not
// Saturday: there it begins the days that follow it.
function weekdayList(days: number[], style: ZhHantStyle): string {
  const week = days.slice().sort(function fromMonday(a, b) {
    return (a + 6) % 7 - (b + 6) % 7;
  });
  const sundayFirst = [0, 1].every(function held(day) {
    return days.includes(day);
  }) && !days.includes(6);
  const order = sundayFirst ? [0, ...week.slice(0, -1)] : week;

  return style.weekday + list(order.map(function numeral(day) {
    return lexicon.weekdays[day];
  }));
}

function unique(values: number[]): number[] {
  return [...new Set(values)].sort(function ascending(a, b) {
    return a - b;
  });
}

// A run of dates. One that reaches the last day the months have ends at
// the month's end when the months differ in length.
function dateSpan(span: Span, context: DateContext): string {
  const uneven = context.facts.analyses.monthLengths.length > 1;
  const toEnd = span.from < span.to && span.to === context.max && uneven;

  return toEnd ?
    span.from + date + words.to + words.monthEnd :
    spanText(span, date, words.nextMonth);
}

function datesListed(form: Form, context: DateContext): DayPhrase {
  const groups = daysByMonths(context.facts) as DaysInMonths[];

  return {
    body: list(form.values.map(String)) + date,
    grouped: groups.map(function monthsOf(group) {
      return {
        days: group.days,
        months: unique(group.months.flatMap(function each(length) {
          return length.months;
        }))
      };
    }),
    kind: 'dated',
    listed: form.values.length > 1,
    numbers: true
  };
}

// Every second day is the odd or the even days, between two dates when
// they are not all of them.
function dateParity(form: CadenceForm): DayPhrase {
  const parity = [words.evenDays, words.oddDays][form.start % 2];
  const between = form.start + date + words.to + form.last + date + words.of;

  return {body: form.fills ? parity : between + parity, kind: 'dated'};
}

function dateRange(form: RangeForm, context: DateContext): DayPhrase {
  return {body: dateSpan(form, context), kind: 'dated', span: true};
}

function datePieces(form: PiecesForm, context: DateContext): DayPhrase {
  return {
    body: series(form.spans.map(function say(span) {
      return dateSpan(span, context);
    }), context.final),
    kind: 'dated',
    span: true
  };
}

// Every day but one or two, or the odd or even days but one or two.
function datesBut(form: ExceptForm, context: DateContext): DayPhrase {
  const removed = list(form.removed.map(String)) + date;
  const base = sayBy(plainDates, form.base, context);

  return form.base.kind === 'all' ?
    {body: removed, kind: 'rest'} :
    {body: base.body + excepting(removed), kind: 'dated'};
}

const plainDates: Sayers<DateContext, DayPhrase> = {
  all: datesListed,
  cadence: dateParity,
  except: datesBut,
  list: datesListed,
  one: datesListed,
  pieces: datePieces,
  range: dateRange
};

// What the scheduler does when the day falls on a Saturday or a Sunday.
function shifted(days: number[], moved: string, to: number, style: ZhHantStyle):
  string {
  return words.whenMeeting + weekdayList(days, style) + moved +
    weekdayName(to, style);
}

function lastDay(): DayPhrase {
  return {body: words.lastDay, kind: 'dated'};
}

function lastWeekday(form: QuartzDate, context: DateContext): DayPhrase {
  return {
    body: words.lastDay +
      bracketed(shifted([6, 0], words.movedEarlierTo, 5, context.style)),
    kind: 'dated'
  };
}

function firstWeekday(form: QuartzDate, context: DateContext): DayPhrase {
  return {
    body: 1 + date +
      bracketed(shifted([6, 0], words.movedLaterTo, 1, context.style)),
    kind: 'dated'
  };
}

// The weekday nearest a date: a Saturday is moved to the Friday before,
// a Sunday to the Monday after, unless the date ends its month.
function nearestWeekday(
  form: Extract<QuartzDate, {kind: 'nearestWeekday'}>,
  context: DateContext
): DayPhrase {
  const {style} = context;
  const named = form.day + date;
  const early = shifted([6], words.movedEarlierTo, 5, style);
  const late = shifted([0], words.movedLaterTo, 1, style);
  const conditions = {
    always: shifted([6, 0], words.movedEarlierTo, 5, style),
    never: early + words.comma + late,
    sometimes: early + words.semicolon + late + words.comma + words.ifDate +
      named + words.isLastDayThen + words.movedEarlierTo +
      weekdayName(5, style)
  };
  const which = context.facts.analyses.day.nearestDayIsLast as
    keyof typeof conditions;

  return {body: named + bracketed(conditions[which]), kind: 'dated'};
}

// Days counted back from the last. Where every month the form fires in
// has one length the date itself is named; where each month's day is one
// number the days are kept by month.
function beforeLast(
  form: Extract<QuartzDate, {kind: 'beforeLast'}>,
  context: DateContext
): DayPhrase {
  const lengths = context.facts.analyses.monthLengths;
  const split = lengths.some(function byYear(group) {
    return group.years === 'common';
  });
  const grouped = lengths.filter(function whole() {
    return !split;
  }).map(function dayOf(group) {
    return {days: [group.length - form.days], months: group.months};
  });

  return lengths.length === 1 ?
    {body: grouped[0].days[0] + date, grouped, kind: 'dated'} :
    {
      body: words.countingBack + words.ordinal + (form.days + 1) +
        units.day.length,
      grouped,
      kind: 'dated'
    };
}

const quartzDates = {
  beforeLast, firstWeekday, last: lastDay, lastWeekday, nearestWeekday
};

/** The dates of a pattern, whose date field is restricted. */
function sayDates(setting: DateSetting): DayPhrase {
  const {facts, linear} = setting;
  const arm = facts.analyses.day.date as
    {form: QuartzDate; kind: 'quartz'} | {kind: 'values'};
  const reached = daysReached(facts, {linear});

  if (arm.kind === 'quartz') {
    const say = quartzDates[arm.form.kind] as
      (form: QuartzDate, context: DateContext) => DayPhrase;

    return say(arm.form, {...setting, max: 0});
  }

  const {candidates, domain} = reached as NonNullable<typeof reached>;

  return sayBy(plainDates, formOf(candidates, {
    domain,
    exceptCadence: true,
    pieces: true,
    run: 3,
    steps(cadence: CadenceForm) {
      return cadence.interval === 2 &&
        (cadence.fills || cadence.values.length > 4);
    }
  }), {...setting, max: domain.max});
}

function weekdaysListed(form: Form, style: ZhHantStyle): DayPhrase {
  return {body: weekdayList(form.values, style), kind: 'weekly'};
}

// A run of days of the week, in the order it happens. The short style
// drops the word the second day begins with.
function weekdayRange(form: RangeForm, style: ZhHantStyle): DayPhrase {
  const end = style.short ?
    lexicon.weekdays[form.to] :
    weekdayName(form.to, style);

  return {
    body: weekdayName(form.from, style) + words.to + end,
    kind: 'weekly'
  };
}

function weekdaysBut(form: ExceptForm, style: ZhHantStyle): DayPhrase {
  return {body: weekdayList(form.removed, style), kind: 'rest'};
}

const plainWeekdays: Sayers<ZhHantStyle, DayPhrase> = {
  all: weekdaysListed,
  cadence: weekdaysListed,
  except: weekdaysBut,
  list: weekdaysListed,
  one: weekdaysListed,
  pieces: weekdaysListed,
  range: weekdayRange
};

// The nth or the last of a weekday in its month: one day a month, placed
// as a date is.
const quartzWeekdays = {
  last(form: QuartzWeekday, style: ZhHantStyle) {
    return words.lastOne + weekdayName(form.weekday, style);
  },
  nth(form: Extract<QuartzWeekday, {kind: 'nth'}>, style: ZhHantStyle) {
    return words.ordinal + lexicon.nthNumerals[form.nth - 1] +
      words.nthCounter + weekdayName(form.weekday, style);
  }
};

/** The days of the week of a pattern, whose weekday field is restricted. */
function sayWeekdays(facts: ScheduleFacts, style: ZhHantStyle): DayPhrase {
  const arm = facts.analyses.day.weekday as
    {form: QuartzWeekday; kind: 'quartz'} | {kind: 'values'};

  if (arm.kind === 'quartz') {
    const say = quartzWeekdays[arm.form.kind] as
      (form: QuartzWeekday, style: ZhHantStyle) => string;

    return {body: say(arm.form, style), kind: 'dated'};
  }

  const sets = candidatesAs(facts, 'weekday', {first: 1}) as
    SetDescription[];

  return sayBy(plainWeekdays, formOf(sets, weekdayReading), style);
}

export {sayDates, sayWeekdays};
