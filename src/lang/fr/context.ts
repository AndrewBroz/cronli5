// What every part of the sentence needs to know about the schedule: each
// plain field's values, which of the day fields are restricted, and the
// few facts one part has to know about another.

import type {DayFacts, Schedule, SetDescription} from '../../core/schedule.js';
import type {FrenchStyle} from './options.js';
import type {View} from './sets.js';
import {described, tiling, viewOf} from './sets.js';

/** The schedule as the renderer reads it. */
interface Context {
  // Whether the time part may end in an exception: nothing follows it.
  bare: boolean;
  // Whether the day of the month is restricted, and the weekday.
  dated: boolean;
  day: DayFacts;
  // Whether a time stands without its days, so «tous les jours» is said.
  daily: boolean;
  hours: View;
  minutes: View;
  months: View;
  // Which form of a month's or weekday's name is written.
  names: 'full' | 'short';
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
 * The weekdays counted from Monday, with Sunday as 7: the order French
 * lists them in. A run may always wrap round the week, the long way
 * too: six days are «du jeudi au mardi» where no exception may be said.
 */
function weekdayView(c: Context): View {
  const view = viewOf(c.schedule, 'weekday', {round: true});
  const fromMonday = view.values.map(function shift(day) {
    return (day + 6) % 7 + 1;
  }).sort(function ascending(a, b) {
    return a - b;
  });

  return described(fromMonday, {cyclic: true, max: 7, min: 1}, true);
}

/**
 * Read a schedule. A run wraps only when nothing coarser is restricted
 * (months when the year is free, hours when the whole calendar is, and
 * minutes and seconds never). Hours then wrap only the shorter way
 * round; months, which have names, wrap whatever the length.
 */
function contextOf(schedule: Schedule, style: FrenchStyle): Context {
  const {candidates, day} = schedule.analyses;
  const years = viewOf(schedule, 'year', {round: false});
  const months =
    viewOf(schedule, 'month', {anyLength: true, round: years.all});
  const dated = restricts(candidates.date);
  const weekdayed = restricts(candidates.weekday);
  const free = !dated && !weekdayed && months.all && years.all;
  const hours = viewOf(schedule, 'hour', {round: free});
  const minutes = viewOf(schedule, 'minute', {round: false});
  const seconds = viewOf(schedule, 'second', {round: false});

  return {
    bare: years.all && !day.union,
    daily: false,
    dated,
    day,
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
    union: day.union,
    weekdayed,
    years
  };
}

export type {Context};
export {contextOf, weekdayView};
