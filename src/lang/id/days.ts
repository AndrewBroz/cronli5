// The day part (answers 2.1, 3.2, 4.3): the days of the month, the
// weekdays, or both. Either one firing is a union, each side said by the
// days that fire and joined by «, dan juga»; both having to match is the
// dates «yang jatuh pada» the weekdays.

import type {QuartzWeekday, SetDescription}
  from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';
import type {Scope} from './closing.js';
import type {Setting, Side} from './dates.js';
import {counted, dateSide} from './dates.js';
import type {Part} from './forms.js';
import {habits, isRange, isValues, partOf} from './forms.js';
import lexicon from './lexicon.js';
import {fullWeekday, list, phrase, weekdayName} from './say.js';

const {nthWords, words} = lexicon;

type Names = (weekday: number, first: boolean) => string;

// Weekdays in the form chosen: names, a run, or both together. Sunday is
// «hari Minggu» only where it comes first.
function weekdaysSaid(part: Part, name: Names, joiner?: string): string {
  const {base} = part;
  const runs = base.kind === 'pieces' ?
    base.parts :
    [base].filter(function named(form) {
      return isRange(form) || isValues(form);
    });
  let first = true;

  return list(runs.flatMap(function each(found) {
    const said = isRange(found) ?
      [phrase(name(found.from, first), words.to, name(found.to, false))] :
      (found as {values: number[]}).values.map(function named(day, index) {
        return name(day, first && index === 0);
      });

    first = false;

    return said;
  }), joiner);
}

type WeekdayForm<Kind extends QuartzWeekday['kind']> =
  (form: Extract<QuartzWeekday, {kind: Kind}>, setting: Setting) => Side;

const weekdayForms: {[Kind in QuartzWeekday['kind']]: WeekdayForm<Kind>} = {
  last(form, setting) {
    return counted(phrase(weekdayName(form.weekday, true, setting.style),
      words.last), setting);
  },
  // A fifth such weekday is not in every month.
  nth(form, setting) {
    const found = counted(phrase(
      weekdayName(form.weekday, true, setting.style),
      nthWords[form.nth - 1]), setting);
    const rare = form.nth === nthWords.length;

    return rare ?
      {...found, comma: true, text: `${found.text}, ${words.ifThereIsOne}`} :
      found;
  }
};

/** The weekday side, or nothing when that field is open. */
function weekdaySide(setting: Setting): Side | undefined {
  const {facts, style} = setting;
  const arm = facts.analyses.day.weekday;

  if (!arm) {
    return;
  }

  if (arm.kind === 'quartz') {
    return (weekdayForms[arm.form.kind] as
      WeekdayForm<QuartzWeekday['kind']>)(arm.form, setting);
  }

  // The week is said from Monday.
  const candidates =
    candidatesAs(facts, 'weekday', {first: 1}) as SetDescription[];
  const part = partOf({
    candidates,
    domain: domainOf('weekday'),
    habits: habits.weekday,
    mixed: null
  }, setting.union);
  // Two days in a row are said in the order they come: «Sabtu dan
  // Minggu», «hari Minggu dan Senin».
  const pair = candidates.find(isRange);
  const ordered = isValues(part.base) && pair ?
    {...part, base: {kind: 'values' as const, values: [pair.from, pair.to]}} :
    part;

  function afterEvery(weekday: number, first: boolean): string {
    return weekdayName(weekday, first, style);
  }

  const named = weekdaysSaid(ordered, afterEvery);

  return {
    condition: phrase(words.dayOf,
      weekdaysSaid(ordered, fullWeekday, words.or)),
    left: [part.removed.length > 0 &&
      list(part.removed.map(function leftOut(weekday, index) {
        return weekdayName(weekday, index === 0, style);
      }))].filter(Boolean) as string[],
    text: phrase(named && words.every, named)
  };
}

/** The day part and what it leaves for the closing part to say. */
export interface Days extends Pick<Scope, 'monthsAs' | 'saidMonths' |
  'saidYear'> {
  comma: boolean;
  leap: boolean;
  left: string[];
  moved: string;
  text: string;
  // Whether two sides are said as a union, which a month or year then
  // governs after «keduanya».
  union: boolean;
}

// Two sides that must both match: the dates «yang jatuh pada» the
// weekdays, or the first as it stands and the second as a condition
// between commas.
function bothSaid(date: Side, week: Side): string {
  const options = [
    week.counted && `${week.text}, ${phrase(words.ifItFallsOn,
      date.condition)}`,
    date.dated && phrase(date.text, words.thatFallsOn, week.condition),
    `${date.text}, ${phrase(words.ifItFallsOn, week.condition)}`
  ];

  return options.find(Boolean) as string;
}

// Two sides as one phrase: either firing, or both having to match.
function pairSaid(date: Side, week: Side, union: boolean): string {
  return union ?
    `${date.text}, ${phrase(words.andAlso, week.text)}` :
    bothSaid(date, week);
}

// The sides of a schedule's day fields. The date field says nothing when
// every day it could fire on is a weekday that fires anyway, and neither
// says anything when the dates are every day the months have.
function sidesOf(setting: Setting): Side[] {
  const {day, dateReach} = setting.facts.analyses;
  const everyDay = Boolean(dateReach?.days?.everyDay);

  return [
    !day.dateAddsNothing && !everyDay && dateSide(setting),
    !everyDay && weekdaySide(setting)
  ].filter(Boolean) as Side[];
}

/** The day part of a description. */
function daysOf(setting: Setting): Days {
  const sides = sidesOf(setting);
  const said = sides.filter(function says(side) {
    return side.text;
  });
  const pair = said.length === 2;
  const union = pair && setting.facts.analyses.day.union;

  function any(key: 'comma' | 'leap' | 'saidMonths' | 'saidYear'): boolean {
    return sides.some(function has(side) {
      return side[key];
    });
  }

  return {
    comma: pair || any('comma'),
    leap: any('leap'),
    left: sides.flatMap(function leftOut(side) {
      return side.left;
    }),
    monthsAs: phrase(...sides.map(function lengths(side) {
      return side.monthsAs;
    })),
    moved: phrase(...sides.map(function clause(side) {
      return side.moved;
    })),
    saidMonths: any('saidMonths'),
    saidYear: any('saidYear'),
    text: pair ?
      pairSaid(said[0], said[1], union) :
      phrase(said[0]?.text),
    union
  };
}

export {daysOf};
