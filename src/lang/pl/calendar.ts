// The calendar side of a description: the frame of years and months, the
// day part, and the closing clause, with the punctuation that joins them
// to each other and to the time (answers, "The shape of a Polish
// description", 4.3 and 4.4).

import type {
  DateArm, QuartzWeekday, ScheduleFacts, SetDescription, WeekdayArm
} from '../../core/schedule.js';
import {describeSet} from '../../core/describe-set.js';
import {candidatesAs, daysByMonths} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {DayForm, Where} from './days.js';
import {dayForm, fuses, sayDays, theseDays} from './days.js';
import type {MonthKind, Months, Years} from './frame.js';
import {sayMonths, sayYears} from './frame.js';
import {words} from './text.js';
import type {WeekdaysSaid} from './weekdays.js';
import {fromTo, sayNthWeekday, sayWeekdays} from './weekdays.js';

/** The parts of a description, each with the mark that follows it. */
export interface Parts {
  frame: string;
  day: string;
  time: string;
  closing: string;
}

/** What the calendar side needs to know of the time. */
export interface TimeSaid {
  text: string;
  // Names a clock time: with no day named, the schedule is daily.
  clock: boolean;
}

const february = 2;

// The month tail of a day phrase, outside a union and inside one.
const tails: Record<MonthKind, string[]> = {
  list: [words.monthGeneric, words.eachOfThoseMonths],
  none: [words.eachMonth, words.eachMonth],
  one: [words.monthGeneric, words.thatMonth],
  outside: [words.monthGeneric, words.monthGeneric],
  pieces: [words.monthGeneric, words.eachOfThoseMonths],
  range: [words.monthGeneric, words.eachOfThoseMonths]
};

// What the working day nearest a date does on a weekend, as the closing
// part of the sentence and, inside a union, in a parenthesis beside the
// date. It depends on whether the date can be its month's last day.
const nearestOnWeekend = {
  closing: {
    always: `${words.ifWeekend} ${words.precedingFriday}`,
    never: `${words.ifSaturday} ${words.dayEarlier}, ` +
      `${words.ifSunday} ${words.dayLater}`,
    sometimes: `${words.ifSaturday} ${words.dayEarlier}, ` +
      `${words.ifSunday} ${words.dayLater}, ` +
      `${words.ifSundayAndLast} ${words.twoDaysEarlier}`
  },
  aside: {
    always: `${words.whenWeekend} ${words.precedingFriday}`,
    never: `${words.whenSaturday} ${words.dayEarlier}, ` +
      `${words.whenSunday} ${words.dayLater}`,
    sometimes: `${words.whenSaturday} ${words.dayEarlier}, ` +
      `${words.whenSunday} ${words.dayLater}, ` +
      `${words.whenSundayAndLast} ${words.twoDaysEarlier}`
  }
};

// A single year is said after a plain month frame («w czerwcu 2030 r.»);
// after «poza …» or pieces it would be heard on the last member only, so
// there it stands in front.
const yearGoesAfter: Record<MonthKind, boolean> = {
  list: true,
  none: false,
  one: true,
  outside: false,
  pieces: false,
  range: true
};

// Everything the calendar fields give, before any of it is worded.
interface Scene {
  facts: ScheduleFacts;
  time: TimeSaid;
  short: boolean;
  // The day fields that are said, and how they combine.
  date: DateArm | null;
  weekday: WeekdayArm | null;
  union: boolean;
  both: boolean;
  form: DayForm | null;
  nth: QuartzWeekday | null;
  // The months named, and whether February is among them in leap years
  // only, alone or beside others.
  months: Months;
  leapOnly: boolean;
  leapToo: boolean;
  years: Years;
  // One named month said with the day and not as a frame.
  fused: boolean;
}

// Whether a field holds every value, so that it restricts nothing.
function whole(facts: ScheduleFacts, field: 'date' | 'weekday'): boolean {
  const cands = facts.analyses.candidates[field];

  return cands !== null && cands[0].kind === 'all';
}

// Which day fields are said, and how they combine, once the calendar has
// had its say: a date arm that adds nothing is dropped, and days that are
// every day of the months reached are no restriction at all.
function armsOf(facts: ScheduleFacts) {
  const {dateReach, day} = facts.analyses;
  const everyDay = Boolean(
    dateReach && dateReach.days && dateReach.days.everyDay);
  const idle = everyDay || day.dateAddsNothing || whole(facts, 'date');
  const idleWeek = everyDay && day.union || whole(facts, 'weekday');
  const two = !idle && !idleWeek;

  return {
    both: day.both && two,
    date: idle ? null : day.date,
    union: day.union && two,
    weekday: idleWeek ? null : day.weekday
  };
}

// A count of days before the last that comes to one date, because every
// month it fires in has one length.
function countedFromEnd(facts: ScheduleFacts): boolean {
  const arm = facts.analyses.day.date;

  return Boolean(arm) && arm!.kind === 'quartz' &&
    arm!.form.kind === 'beforeLast' &&
    facts.analyses.monthLengths.length === 1;
}

// The months that are named. A day some named months lack is said of the
// months that have it, and a day counted from the end that comes to one
// date names the months it exists in. February where the day exists in
// leap years only is said apart when other months are named with it.
function monthsOf(facts: ScheduleFacts, dated: boolean) {
  const {candidates, dateReach} = facts.analyses;
  const view = {linear: candidates.year![0].kind !== 'all'};
  const field = candidatesAs(facts, 'month', view) as SetDescription[];
  const reach = dated && (field[0].kind !== 'all' || countedFromEnd(facts)) &&
    dateReach || null;
  const every = reach ? reach.everyYear : [];
  const leap = reach ? reach.leapYears : [];
  const leapToo = every.length > 0 && leap.length > 0;
  const fired = [...every, ...leap.slice(Number(leapToo))].sort(
    function ascending(a, b) {
      return a - b;
    }
  );

  return {
    leapOnly: every.length === 0 && leap.length > 0,
    leapToo,
    months: sayMonths(reach ?
      describeSet(fired, domainOf('month'), view) :
      field)
  };
}

function sceneOf(facts: ScheduleFacts, time: TimeSaid, short: boolean):
  Scene {
  const arms = armsOf(facts);
  const form = arms.date && dayForm(facts, arms.union);
  const named = monthsOf(facts, Boolean(form) && !arms.union);
  const nth = arms.weekday && arms.weekday.kind === 'quartz' ?
    arms.weekday.form :
    null;
  const fusable = form ? fuses[form.kind] : Boolean(nth);

  return {
    ...arms,
    ...named,
    facts,
    form,
    fused: named.months.kind === 'one' && !arms.union && !arms.both &&
      fusable,
    nth,
    short,
    time,
    years: sayYears(facts)
  };
}

// « 2030 r.», after a month or a date, when there is one year.
function yearAfter(scene: Scene): string {
  return scene.years.single === null ?
    '' :
    ` ${scene.years.single} ${words.year}`;
}

// What the day of the month is said with. One named month makes numbered
// days a calendar date; a both-must-match pair keeps the month as a frame.
function whereOf(scene: Scene): Where {
  const {both, fused, months, short, union} = scene;
  const month = lexicon.months[months.values[0] || 0];
  const after = yearAfter(scene);
  const tail = both ? words.monthGeneric : tails[months.kind][Number(union)];
  const name = [month.genitive, month.roman][Number(short)];

  return {
    date: (name + after.repeat(Number(fused)))
      .repeat(Number(months.kind === 'one' && !both)),
    of: fused ? `${month.genitive}${after}` : tail,
    tail,
    workingWeek: fromTo(1, 5, short)
  };
}

// The weekday part: a plain set, or the nth or last such day with its
// own month tail.
function weekOf(scene: Scene): WeekdaysSaid | null {
  const {facts, fused, months, nth, short, union, weekday} = scene;
  const tail = months.kind === 'none' && words.eachMonth ||
    fused && whereOf(scene).of || words.monthGeneric;
  const said = nth ?
    {compound: false, text: `${sayNthWeekday(nth, short)} ${tail}`} :
    sayWeekdays(facts, !union, short);

  return weekday && said;
}

// Whether the working day nearest a date can be the month's last day,
// when that is the form of the date; null otherwise.
function nearestOf(scene: Scene) {
  const {date, facts} = scene;

  return date && date.kind === 'quartz' &&
    date.form.kind === 'nearestWeekday' &&
    facts.analyses.day.nearestDayIsLast || null;
}

// The two day fields together: either may match («, a także»), both must
// («, ale tylko»), or there is one, or none and the daily word.
function daysOf(scene: Scene, week: WeekdaysSaid | null): string {
  const {both, form, time, union} = scene;
  const nearest = nearestOf(scene);
  const dated = form ? sayDays(form, whereOf(scene)) : '';
  const aside = union && nearest ?
    ` (${nearestOnWeekend.aside[nearest]})` :
    '';
  const weekly = week ? week.text : '';

  return union && `${weekly}, ${words.also} ${dated}${aside}` ||
    both && `${weekly}, ${words.butOnly} ${dated}` ||
    weekly || dated || words.daily.repeat(Number(time.clock));
}

// February of leap years, after the months that have the day every year:
// «, a w latach przestępnych także 29 lutego». Of a plain set, only the
// days February has are said.
function leapFebruary(scene: Scene): string {
  const {facts, form, leapToo, short} = scene;
  const month = lexicon.months[february];
  const held = (daysByMonths(facts) || []).filter(function inFebruary(group) {
    return group.months.some(function has(lengths) {
      return lengths.months.includes(february);
    });
  }).flatMap(function days(group) {
    return group.days;
  });
  const said = held.length > 0 ? theseDays(held) : form;

  return leapToo && said ?
    `, ${words.inLeapYearsAlso} ${sayDays(said, {
      ...whereOf(scene),
      date: [month.genitive, month.roman][Number(short)],
      of: month.genitive
    })}` :
    '';
}

// The day part: «co roku» or «w latach przestępnych» before a date that
// no year restricts, the days, and February of leap years after them.
function dayOf(scene: Scene): {compound: boolean; text: string} {
  const {both, form, fused, leapOnly, leapToo, union, years} = scene;
  const week = scene.weekday && weekOf(scene);
  const lead = fused && years.text === '' &&
    [words.yearly, `${words.in} ${words.leapYears}`][Number(leapOnly)];
  const subtracts = Boolean(form) &&
    (form!.kind === 'allBut' || form!.kind === 'less');

  return {
    compound: union || both || leapToo || subtracts ||
      Boolean(week && week.compound),
    text: [lead, daysOf(scene, week)].filter(Boolean).join(' ') +
      leapFebruary(scene)
  };
}

function startsWithNumeral(text: string): boolean {
  return (/^\d/u).test(text);
}

// Whether a comma parts a frame of months from the day: after pieces,
// between a range of months and a range of weekdays, and after «poza»
// before a day of the month.
function monthsNeedComma(scene: Scene, day: string): boolean {
  const {both, form} = scene;
  const {kind} = scene.months;

  return kind === 'pieces' ||
    kind === 'range' && day.startsWith(`${words.from} `) ||
    kind === 'outside' && Boolean(form) && !both;
}

// The mark after a frame of years alone: its own, or a comma between a
// year and a calendar date.
function yearsMark(scene: Scene): string {
  const {both, form, fused, years} = scene;
  const calendarDate = fused && Boolean(form) && !both &&
    (form!.kind === 'named' || form!.kind === 'digits');

  return years.mark ||
    ','.repeat(Number(calendarDate && (/[\d.]$/u).test(years.text)));
}

// The mark after the frame: a colon before a union, a comma where the
// frame would otherwise run into what follows it.
function frameMark(scene: Scene, day: string, months: string): string {
  const {time, union} = scene;

  return union && ':' ||
    months !== '' && monthsNeedComma(scene, day) && ',' ||
    months === '' && yearsMark(scene) ||
    ','.repeat(Number(day === '' && startsWithNumeral(time.text)));
}

// The frame: the years, then the months that are not said with the day.
// A single year follows a plain month frame, or the date.
function frameOf(scene: Scene, day: string): string {
  const {fused, months, years} = scene;
  const after = yearAfter(scene).repeat(Number(yearGoesAfter[months.kind]));
  const behind = years.single !== null &&
    (fused || yearGoesAfter[months.kind]);
  const front = behind ? '' : years.text;
  const named = fused ? '' : `${months.text}${after}`;
  const text = [
    front && `${front}${years.mark.repeat(Number(named !== ''))}`,
    named
  ].filter(Boolean).join(' ');

  return text && `${text}${frameMark(scene, day, named)}`;
}

// The mark after the day part: a comma when it is compound, before a
// time that begins with a numeral, and between two «od … do …».
function dayMark(scene: Scene, day: {compound: boolean; text: string}):
  string {
  const time = scene.time.text;
  const range = `${words.from} `;
  const comma = day.compound ||
    startsWithNumeral(time) && day.text !== words.daily ||
    day.text.startsWith(range) && time.startsWith(range);

  return ','.repeat(Number(day.text !== '' && comma));
}

/**
 * The parts of a description around a time already said: the frame, the
 * day and the closing clause, each with the mark that follows it.
 */
function calendar(
  facts: ScheduleFacts,
  time: TimeSaid,
  short: boolean
): Parts {
  const scene = sceneOf(facts, time, short);
  const day = dayOf(scene);
  const nearest = nearestOf(scene);
  const closing = nearest && !scene.union ?
    nearestOnWeekend.closing[nearest] :
    '';

  return {
    closing,
    day: `${day.text}${dayMark(scene, day)}`,
    frame: frameOf(scene, day.text),
    time: `${time.text}${','.repeat(Number(closing !== ''))}`
  };
}

export {calendar};
