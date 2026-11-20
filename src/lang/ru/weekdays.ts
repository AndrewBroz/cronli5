// Weekdays (answers 3.9, 4.3): the week runs Monday to Sunday. What
// recurs is «по» with the dative plural; a run is «с … по …»; six or five
// days are every day less one or two.

import type {QuartzWeekday, ScheduleFacts} from '../../core/schedule.js';
import {candidatesAs, domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';
import type {WeekdayCase} from './names.js';
import {
  clausal, fromWord, list, spaced, weekdayName, when
} from './names.js';
import type {RussianStyle} from './options.js';
import type {Rule} from './sets.js';
import {firstRule, kindOf, valuesOf} from './sets.js';

const {nthWords, weekdays, words} = lexicon;

/** A set of weekdays in each way a sentence says it. */
export interface WeekdaysSaid {
  // Alone, as the day part: «по будням», «ежедневно, кроме среды».
  alone: string;
  // Whether the phrase said alone ends in an exception.
  aloneComma: boolean;
  // After «если это»: «будний день», «не среда», «среда или пятница».
  condition: string;
  // Whether the days are every day less one or two and no run inside
  // the week, so that a union says the days left out.
  conditional: boolean;
  // The days left out, as what recurs: «по средам».
  leftOut: string;
  // Beside a date in a union, where nothing is said with «кроме».
  union: string;
}

// The days of a plain set, in the order of the week, and what the forms
// are chosen by.
interface Week {
  days: number[];
  left: number[];
  // The one run the days make, if they make one.
  run: {from: number; to: number} | undefined;
  runInside: boolean;
  style: RussianStyle;
}

const monday = 1;
const week = [1, 2, 3, 4, 5, 6, 0];
const mondayToFriday = week.slice(0, 5);
const weekend = week.slice(5);
const longRun = 3;
const clusterDays = [2, 3];

function sameDays(days: number[], others: number[]): boolean {
  return days.join() === others.join();
}

function named(days: number[], form: WeekdayCase, given: Week): string[] {
  return days.map(function name(day) {
    return weekdayName(day, form, given.style);
  });
}

// «По понедельникам, средам и пятницам».
function recurring(days: number[], given: Week): string {
  return spaced(words.through, list(named(days, 'dativePlural', given)));
}

// «Со вторника по четверг».
function runOf(given: Week): string {
  const {from, to} = given.run as {from: number; to: number};

  return spaced(fromWord(clusterDays.includes(from)),
    weekdayName(from, 'genitive', given.style), words.through,
    weekdayName(to, 'accusative', given.style));
}

// «Ежедневно, кроме среды и воскресенья».
function lessDays(base: string, days: number[], given: Week): string {
  return clausal(base,
    spaced(words.except, list(named(days, 'genitive', given))));
}

function isIdiom(given: Week): boolean {
  return sameDays(given.days, mondayToFriday) ||
    sameDays(given.days, weekend);
}

function idiom(given: Week): string {
  return sameDays(given.days, weekend) ? words.onWeekends : words.onWeekdays;
}

function isOneDay(given: Week): boolean {
  return given.days.length === 1;
}

function isRunInside(given: Week): boolean {
  return given.runInside;
}

function isRunPastSunday(given: Week): boolean {
  return Boolean(given.run) && given.days.length >= longRun;
}

// The forms of a set of weekdays said alone, in the order they are tried,
// each with whether it ends in an exception.
const alone: Array<Rule<Week, [string, boolean]>> = [
  [isIdiom, function say(given) {
    return [idiom(given), false];
  }],
  [isOneDay, function say(given) {
    return [recurring(given.days, given), false];
  }],
  [function sixDays(given) {
    return given.left.length === 1;
  }, function say(given) {
    return [lessDays(words.everyDay, given.left, given), true];
  }],
  [isRunInside, function say(given) {
    return [runOf(given), false];
  }],
  [function fiveDays(given) {
    return given.left.length === 2;
  }, function say(given) {
    return [lessDays(words.everyDay, given.left, given), true];
  }],
  [function fourOfMondayToFriday(given) {
    return given.days.length === 4 && given.days.every(function working(day) {
      return mondayToFriday.includes(day);
    });
  }, function say(given) {
    return [lessDays(words.onWeekdays, mondayToFriday.filter(
      function lacking(day) {
        return !given.days.includes(day);
      }
    ), given), true];
  }],
  [isRunPastSunday, function say(given) {
    return [runOf(given), false];
  }],
  [Boolean, function say(given) {
    return [recurring(given.days, given), false];
  }]
];

// The forms beside a date in a union: nothing is said with «кроме».
const inUnion: Array<Rule<Week, string>> = [
  [isIdiom, idiom],
  [isOneDay, function say(given) {
    return recurring(given.days, given);
  }],
  [isRunInside, runOf],
  [isRunPastSunday, runOf],
  [Boolean, function say(given) {
    return recurring(given.days, given);
  }]
];

// The forms after «если это», in the nominative.
const conditions: Array<Rule<Week, string>> = [
  [function workingWeek(given) {
    return sameDays(given.days, mondayToFriday);
  }, function say() {
    return words.weekday;
  }],
  [function allButOneOrTwo(given) {
    return given.left.length <= 2;
  }, function say(given) {
    return list(named(given.left, 'nominative', given).map(
      function negated(name) {
        return spaced(words.not, name);
      }
    ));
  }],
  [Boolean, function say(given) {
    return list(named(given.days, 'nominative', given), words.or);
  }]
];

/** A plain set of weekdays, in each way a sentence says it. */
function weekdaysSaid(facts: ScheduleFacts, style: RussianStyle):
  WeekdaysSaid {
  const candidates = candidatesAs(facts, 'weekday', {first: monday}) ?? [];
  const days = valuesOf(candidates, domainOf('weekday'));
  const run = kindOf(candidates, 'range');
  const given: Week = {
    days,
    left: week.filter(function lacking(day) {
      return !days.includes(day);
    }),
    run,
    // A run stays inside the week when it does not pass from Sunday to
    // Monday.
    runInside: Boolean(run) && days.length >= longRun &&
      week.indexOf(run?.from as number) < week.indexOf(run?.to as number),
    style
  };
  const [text, comma] = firstRule(alone, given);

  return {
    alone: text,
    aloneComma: comma,
    condition: firstRule(conditions, given),
    conditional: given.left.length <= 2 && !given.runInside,
    leftOut: recurring(given.left, given),
    union: firstRule(inUnion, given)
  };
}

const accusativeOf = {
  feminine: 'feminineAccusative', masculine: 'masculine', neuter: 'neuter'
} as const;

/**
 * The last or the nth weekday of the month: «в последнюю пятницу», «во
 * второй понедельник»; after «если это», «последняя пятница месяца»; and
 * the condition a fifth weekday is said with.
 */
function quartzWeekdaySaid(form: QuartzWeekday, style: RussianStyle):
  {condition: string; ifAny: string; phrase: string} {
  const nth = (form as {nth?: number}).nth ?? 0;
  const word = nth ? nthWords[nth - 1] : words.last;
  const {gender} = weekdays[form.weekday];

  return {
    condition: spaced(word[gender],
      weekdayName(form.weekday, 'nominative', style), words.ofTheMonth),
    // A month has a fifth such weekday or not: «если он есть».
    ifAny: when(nth === nthWords.length, words.ifThereIsOne[gender]),
    phrase: spaced(nth === 2 ? words.inBeforeCluster : words.in,
      word[accusativeOf[gender]],
      weekdayName(form.weekday, 'accusative', style))
  };
}

export {quartzWeekdaySaid, weekdaysSaid};
