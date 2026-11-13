// What every part of the sentence needs to know about the schedule: each
// plain field's values, which of the day fields are restricted, and the
// few facts one part has to know about another.

import type {
  DateReach, DayFacts, Schedule, SetDescription
} from '../../core/schedule.js';
import type {FrenchStyle} from './options.js';
import type {View} from './sets.js';
import {described, tiling, viewOf} from './sets.js';

/** How far a run may wrap round its cycle. */
interface Wraps {
  anyLength?: boolean;
  round: boolean;
}

/** The schedule as the renderer reads it. */
interface Context {
  // Whether the time part may end in an exception: nothing follows it.
  bare: boolean;
  // Whether both day fields must match: the dates, when they fall on the
  // weekdays.
  both: boolean;
  // The months the day of the month can fire in: the months, but for
  // those among named months that never have the day.
  dateMonths: View;
  // Whether the day of the month narrows the days that fire, and the
  // weekday.
  dated: boolean;
  day: DayFacts;
  // Whether a time stands without its days, so «tous les jours» is said.
  daily: boolean;
  hours: View;
  // Whether nothing fires but in leap years.
  leap: boolean;
  minutes: View;
  months: View;
  // Which form of a month's or weekday's name is written.
  names: 'full' | 'short';
  // Whether the pattern never fires: no reached month has its day.
  never: boolean;
  // The first second that fires.
  offset: number;
  // Whether the pattern fires at one time of day.
  once: boolean;
  schedule: Schedule;
  seconds: View;
  style: FrenchStyle;
  // The interval of seconds that fill every minute, or 0.
  sweep: number;
  union: boolean;
  weekdayed: boolean;
  years: View;
}

// Whether a day field narrows the days: a Quartz form does, and a plain
// set does unless it holds every value.
function restricts(options: SetDescription[] | null): boolean {
  return options === null || options[0].kind !== 'all';
}

/**
 * The weekdays as the core lays them out for a week that starts on
 * Monday: the order French lists them in. A run may always wrap round
 * the week, the long way too: six days are «du jeudi au mardi» where no
 * exception may be said.
 */
function weekdayView(c: Context): View {
  return viewOf(c.schedule, 'weekday',
    {anyLength: true, first: 1, round: true});
}

/** What the calendar allows of a schedule's days. */
type Days = Pick<Context,
  'dateMonths' | 'dated' | 'leap' | 'never' | 'union' | 'weekdayed'>;

// When the day of the month can fire, as the core states it: where it
// states nothing, in every month of every year.
function reachOf(schedule: Schedule): DateReach & {stated: boolean} {
  const {dateReach} = schedule.analyses;

  return {
    days: null,
    everyYear: [],
    fires: true,
    firesInOtherYears: true,
    leapYears: [],
    never: [],
    ...dateReach,
    stated: dateReach !== null
  };
}

// Whether the days of the month are every day the reached months have.
function isEveryDay(schedule: Schedule): boolean {
  return schedule.analyses.dateReach?.days?.everyDay === true;
}

// The days that fire. Days of the month that are every day the months
// have narrow nothing; days that never fire leave only the weekdays, or
// nothing at all; and among named months those that never have the day
// are left out.
function daysOf(schedule: Schedule, months: View, wraps: Wraps): Days {
  const {candidates, day} = schedule.analyses;
  const reach = reachOf(schedule);
  const everyDay = isEveryDay(schedule);
  const dated = restricts(candidates.date) && !everyDay && reach.fires;
  const union = day.union && dated;
  const weekdayed = restricts(candidates.weekday) && !everyDay;
  const fired = [...reach.everyYear, ...reach.leapYears].sort(
    function ascending(a, b) {
      return a - b;
    });
  const skips = dated && !months.all && reach.never.length > 0;

  return {
    dateMonths: skips ? described(fired, months.domain, wraps) : months,
    dated,
    leap: dated && !union && reach.stated && reach.everyYear.length === 0,
    never: !reach.fires && !day.union,
    union,
    weekdayed
  };
}

/**
 * Read a schedule. A run wraps only when nothing coarser is restricted
 * (months when the year is free, hours when the whole calendar is, and
 * minutes and seconds never). Hours then wrap only the shorter way
 * round; months, which have names, wrap whatever the length.
 */
function contextOf(schedule: Schedule, style: FrenchStyle): Context {
  const years = viewOf(schedule, 'year', {round: false});
  const wraps = {anyLength: true, round: years.all};
  const months = viewOf(schedule, 'month', wraps);
  const days = daysOf(schedule, months, wraps);
  const free = !days.dated && !days.weekdayed && months.all && years.all;
  const hours = viewOf(schedule, 'hour', {round: free});
  const minutes = viewOf(schedule, 'minute', {round: false});
  const seconds = viewOf(schedule, 'second', {round: false});

  return {
    ...days,
    bare: years.all && !days.union,
    both: schedule.analyses.day.both && days.dated && days.weekdayed,
    daily: false,
    day: schedule.analyses.day,
    hours,
    minutes,
    months,
    names: style.short ? 'short' : 'full',
    offset: seconds.values[0],
    once: minutes.values.length === 1 && hours.values.length === 1,
    schedule,
    seconds,
    style,
    sweep: tiling(seconds),
    years
  };
}

export type {Context};
export {contextOf, weekdayView};
