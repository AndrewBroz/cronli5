// The day-of-week arm: a set of weekdays in the week from Monday to
// Sunday, and the nth or last such weekday of the month.

import type {
  QuartzWeekday, RangeDescription, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import {join} from './clock.js';
import type {Arm} from './dates.js';
import lexicon from './lexicon.js';
import {dated, monthsSaid} from './months.js';
import type {KoreanStyle} from './options.js';
import {fieldOf, ofKind} from './sets.js';

const {nthWords, weekOrder, weekdaySuffix, weekdays, words} = lexicon;

// A list of weekdays is said up to this many; a run inside the week is a
// range from this many.
const listedWeekdays = 4;
const rangedWeekdays = 3;

function namesOf(days: number[], mark: string): string {
  return days.map(function short(day) {
    return weekdays[day].short;
  }).join(mark);
}

const quartzWeekdays: {
  [kind: string]: (form: QuartzWeekday, yearly: boolean) => string;
} = {
  last(form) {
    return `${words.last} ${weekdays[form.weekday].full}`;
  },
  // A fifth such weekday is missing from most months; under one named
  // month it is a year that lacks it.
  nth(form, yearly) {
    const {nth} = form as {nth: number};
    const lacking = [words.skippedMonths, words.skippedYears][Number(yearly)];
    const skipped = nth === nthWords.length && `(${lacking})` || '';

    return `${nthWords[nth - 1]} ${weekdays[form.weekday].full}${skipped}`;
  }
};

function quartzWeek(facts: ScheduleFacts, months: number[] | null): Arm {
  const {form} = facts.analyses.day.weekday as {form: QuartzWeekday};
  const bare = quartzWeekdays[form.kind](form, months?.length === 1);

  return {
    bare,
    both: bare,
    daily: false,
    left: '',
    months: Boolean(months),
    single: false,
    stepped: false,
    text: dated(months, bare)
  };
}

function lengthOf(range: RangeDescription): number {
  return (range.to - range.from + weekdays.length) % weekdays.length + 1;
}

// How a plain set of weekdays lies in the week from Monday to Sunday: a
// run inside the week is a range; otherwise the days are a list, in run
// order when they are one run round the week's edge and in week order
// when they are not.
function weekShape(facts: ScheduleFacts) {
  const days = fieldOf(facts, 'weekday').values;
  const straight = ofKind(candidatesAs(facts, 'weekday',
    {first: 1, linear: true}) as SetDescription[], 'range');
  const round = ofKind(
    candidatesAs(facts, 'weekday', {first: 1}) as SetDescription[], 'range');
  const inWeek = weekOrder.filter(function fires(day) {
    return days.includes(day);
  });
  const run = round && Array.from({length: lengthOf(round)},
    function walk(unused, at) {
      return (round.from + at) % weekdays.length;
    }) || inWeek;
  const [mark, shown] = straight && lengthOf(straight) >= rangedWeekdays ?
    [words.rangeMark, [straight.from, straight.to]] :
    [words.listMark, run];

  return {
    inWeek,
    mark,
    missing: weekOrder.filter(function rests(day) {
      return !days.includes(day);
    }),
    shown
  };
}

// A plain set of weekdays: a range or a list after «매주», and past four
// days that are no range, «매일» with the missing days in a bracket.
function plainWeek(
  facts: ScheduleFacts,
  months: number[] | null,
  style: KoreanStyle
): Arm {
  const {inWeek, mark, missing, shown} = weekShape(facts);
  const ranged = mark === words.rangeMark;
  const daily = !ranged && inWeek.length > listedWeekdays;
  const names = namesOf(shown, mark);
  const rest = namesOf(missing, words.listMark) + weekdaySuffix;
  const suffix = [weekdaySuffix, ''][Number(style.short && shown.length > 1)];
  const text = daily ?
    `${words.everyDay}(${rest} ${words.except})` :
    `${words.everyWeek} ${names}${suffix}`;

  return {
    bare: `${names}${weekdaySuffix}`,
    both: namesOf([inWeek, shown][Number(ranged)], mark) + weekdaySuffix,
    daily,
    left: [rest, ''][Number(!daily)],
    months: Boolean(months),
    single: false,
    stepped: false,
    text: join(months && monthsSaid(months), text)
  };
}

const weekArms = {quartz: quartzWeek, values: plainWeek};

/** The day-of-week arm, under the months as they are written. */
function weekArm(
  facts: ScheduleFacts,
  months: number[] | null,
  style: KoreanStyle
): Arm {
  const arm = facts.analyses.day.weekday as {kind: keyof typeof weekArms};

  return weekArms[arm.kind](facts, months, style);
}

export {weekArm};
