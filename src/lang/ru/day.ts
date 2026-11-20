// The calendar parts of a description (answers 2.6, 4.3, 4.4): the years,
// the months that lead, and the day, with the fusions between them.

import type {Schedule} from '../../core/schedule.js';
import {domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';
import type {Calendar, DaySaid} from './dates.js';
import {datesSaid, daySaid, ordinals} from './dates.js';
import {leadingMonths, monthScope, monthsLacking} from './months.js';
import {clausal, list, spaced, when} from './names.js';
import type {RussianStyle} from './options.js';
import {dateNeeded, quartzDateSaid} from './quartz.js';
import type {Rule} from './sets.js';
import {firstRule, valuesOf} from './sets.js';
import {quartzWeekdaySaid, weekdaysSaid} from './weekdays.js';
import type {Years} from './years.js';
import {yearsGenitive, yearsOf} from './years.js';

const {words} = lexicon;
const fewYears = 4;

/** The calendar parts, each with the comma or colon that closes it. */
export interface CalendarParts {
  day: string;
  months: string;
  // Whether the schedule never fires, so that no time is said.
  never: boolean;
  years: string;
}

// The day part and how the months and years stand to it.
interface DayPart {
  // Whether the months that lead close with a colon.
  colon: boolean;
  day: string;
  fused: boolean;
  // Whether the years part says «в високосные годы».
  leap: boolean;
  monthsLead: boolean;
  named: boolean;
}

// What the day part is chosen by.
interface Days {
  // Whether the time part begins with a clock time.
  clockStart: boolean;
  given: Calendar;
  // Whether the date fires only on 29 February.
  leap: boolean;
  // The months the pattern reaches.
  reached: number[];
  schedule: Schedule;
  years: Years;
}

function closed(text: string, comma: unknown): string {
  return text + when(comma, ',');
}

// A date phrase as the day part: its exception after it.
function partOf(said: DaySaid, leap: boolean): DayPart {
  return {
    colon: false,
    day: closed(clausal(said.text, said.exception),
      said.comma || said.exception),
    fused: said.fused,
    leap,
    monthsLead: said.monthsLead,
    named: said.named
  };
}

// The date arm: a Quartz form or a plain set of dates.
function dateArm(context: Days, scoped: boolean, excepting: boolean):
  DaySaid {
  const {given} = context;
  const arm = context.schedule.analyses.day.date;

  return arm?.kind === 'quartz' ?
    quartzDateSaid(arm.form, given, scoped) :
    datesSaid(given, scoped, excepting);
}

// The weekday arm said alone: a plain set, or a Quartz form with the
// months as its scope.
function weekdayArm(context: Days): DaySaid {
  const {given, schedule} = context;
  const arm = schedule.analyses.day.weekday;

  if (arm?.kind !== 'quartz') {
    const said = weekdaysSaid(schedule, given.style);

    return {...daySaid(said.alone), comma: said.aloneComma, monthsLead: true};
  }

  const said = quartzWeekdaySaid(arm.form, given.style);
  const scope = monthScope({...given, months: context.reached});

  return {
    ...daySaid(clausal(spaced(said.phrase, scope.text), said.ifAny)),
    comma: scope.comma || Boolean(said.ifAny),
    fused: scope.fused,
    named: scope.named
  };
}

// The weekdays after «если это».
function conditionOf(context: Days): string {
  const {given, schedule} = context;
  const arm = schedule.analyses.day.weekday;

  return arm?.kind === 'quartz' ?
    quartzWeekdaySaid(arm.form, given.style).condition :
    weekdaysSaid(schedule, given.style).condition;
}

// Both day fields must match: the dates, then «, если это» and the
// weekdays. Every day less a date or two is the weekdays less those
// dates.
function bothDays(context: Days): DayPart {
  const dates = dateArm(context, true, true);
  const condition = spaced(words.ifItIs, conditionOf(context));
  const said = dates.everyDay ?
    {...weekdayArm(context), comma: true, exception: dates.exception} :
    {...dates, comma: true, text: clausal(dates.text, condition)};

  return partOf(said, context.leap);
}

// Either day field: «ежедневно, а … только …» where one side is every
// day less one or two, otherwise the weekdays, «а также» and the dates.
// Months lead, and close the last form with a colon.
function eitherDay(context: Days): DayPart {
  const {given, schedule} = context;
  const {everyMonth, style} = given;
  const arms = schedule.analyses.day;
  const plain = arms.weekday?.kind !== 'quartz';
  const week = plain ? weekdaysSaid(schedule, style) : null;
  const form = arms.weekday?.kind === 'quartz' ?
    quartzWeekdaySaid(arms.weekday.form, style) :
    null;
  const excepted = dateArm(context, false, true);
  const shapes: Array<Rule<Days, string>> = [
    [function datesLackOneOrTwo() {
      return excepted.everyDay;
    }, function onThoseOnlyOnTheWeekdays() {
      return clausal(words.everyDay, spaced(words.but, excepted.left,
        words.onlyIfItIs, conditionOf(context)));
    }],
    [function weekdaysLackOneOrTwo() {
      return week?.conditional;
    }, function onThoseOnlyOnTheDates() {
      return clausal(words.everyDay, spaced(words.but,
        (week as NonNullable<typeof week>).leftOut, words.only,
        dateArm(context, false, false).text));
    }],
    [Boolean, function weekdaysAndAlsoDates() {
      const dates = dateArm(context, everyMonth, false);
      const each = when(everyMonth && !dates.scoped, words.ofEachMonth);

      return clausal(week?.union ?? spaced(form?.phrase ?? '', each),
        spaced(words.andAlso, clausal(dates.text, dates.exception),
          when(context.leap, words.inLeapYears)));
    }]
  ];
  const at = shapes.findIndex(function holds(rule) {
    return rule[0](context);
  });

  return {
    ...partOf(daySaid(`${shapes[at][1](context)},`), false),
    colon: at === 2 && !everyMonth,
    monthsLead: true
  };
}

// A date no month the pattern reaches has: «никогда: в июне нет 31-го
// числа», with the years when only they lack it.
function neverSaid(context: Days): string {
  const {given, schedule} = context;
  const {candidates, dateReach, day} = schedule.analyses;
  const lacking = day.date?.kind === 'quartz' ?
    [dateNeeded(day.date.form)] :
    valuesOf(candidates.date ?? [], domainOf('date'));

  const inOtherYears = Boolean(dateReach?.firesInOtherYears);
  const {named, text} = context.years;
  // A few years follow the month's name; any other set of years leads,
  // as the years part says it.
  const few = inOtherYears && named.length > 0 && named.length <= fewYears;

  return `${words.never}: ${spaced(
    when(inOtherYears && !few, text),
    monthsLacking(dateReach?.never ?? [], given.style),
    when(few, yearsGenitive(named)),
    words.thereIsNo, list(lacking.map(ordinals.genitive)), words.dateOf)}`;
}

// The day part, by which day fields narrow the days.
const days: Array<Rule<Days, DayPart>> = [
  [function neither({schedule}) {
    const {dateReach, day} = schedule.analyses;

    return dateReach?.days?.everyDay || !day.date && !day.weekday;
  }, function everyDay(context) {
    return {
      ...partOf(daySaid(when(context.clockStart, words.everyDay)), false),
      monthsLead: true
    };
  }],
  [function weekdaysOnly({schedule}) {
    const {day} = schedule.analyses;

    return !day.date || day.dateAddsNothing;
  }, function weekdays(context) {
    return partOf(weekdayArm(context), false);
  }],
  [function datesOnly({schedule}) {
    return !schedule.analyses.day.weekday;
  }, function dates(context) {
    return partOf(dateArm(context, true, true), context.leap);
  }],
  [function both({schedule}) {
    return schedule.analyses.day.both;
  }, bothDays],
  [Boolean, eitherDay]
];

// What the day part is chosen by, from the facts of a schedule.
function daysOf(schedule: Schedule, style: RussianStyle,
  clockStart: boolean): Days {
  const {candidates, dateReach} = schedule.analyses;
  const years = yearsOf(schedule);
  const reached = valuesOf(candidates.month ?? [], domainOf('month'));
  const fired = dateReach ?? {everyYear: reached, leapYears: []};
  const leap = fired.leapYears.length > 0 && fired.everyYear.length === 0;
  // 29 February comes in leap years only, beside dates that come every
  // year: the pattern reaches leap and common years, and the years part
  // does not already say «в високосные годы».
  const leapMonth = schedule.analyses.monthLengths.find(
    function inLeapYears(group) {
      return !leap && group.years === 'leap';
    }
  );

  return {
    clockStart,
    given: {
      everyMonth: candidates.month?.[0].kind === 'all',
      facts: schedule,
      lacking: dateReach !== null,
      leapDate: leapMonth ?
        {day: leapMonth.length, month: leapMonth.months[0]} :
        null,
      leapMonths: leapMonth ? fired.leapYears : [],
      months: [...fired.everyYear, ...fired.leapYears].sort(
        function ascending(a, b) {
          return a - b;
        }
      ),
      style,
      wraps: candidates.year?.[0].kind === 'all',
      yearSuffix: years.suffix
    },
    leap,
    reached,
    schedule,
    years
  };
}

/** The years, the months that lead and the day of a description. */
function calendarParts(schedule: Schedule, style: RussianStyle,
  clockStart: boolean): CalendarParts {
  const {dateReach, day} = schedule.analyses;
  const context = daysOf(schedule, style, clockStart);
  const {given, reached, years} = context;

  if (dateReach && !dateReach.fires && !day.union) {
    return {day: neverSaid(context), months: '', never: true, years: ''};
  }

  const part = firstRule(days, context);
  const months = leadingMonths({...given, months: reached});
  const fused = part.fused || part.monthsLead && months.fused;
  const recurring = when(part.leap, words.inLeapYears) ||
    when(part.named && years.recurs, words.yearly);

  return {
    day: part.day,
    months: when(part.monthsLead,
      part.colon ? `${months.text}:` : closed(months.text, months.comma)),
    never: false,
    years: when(!fused, spaced(years.text, recurring))
  };
}

export {calendarParts};
