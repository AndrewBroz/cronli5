// The Quartz forms of the day of the month (answers 5.3): the last day,
// so many days before it, the first and last weekday, and the weekday
// nearest a date.

import type {QuartzDate} from '../../core/schedule.js';
import lexicon from './lexicon.js';
import type {Calendar, DaySaid} from './dates.js';
import {datesWithMonths, daySaid, ordinals} from './dates.js';
import type {MonthsSaid} from './months.js';
import {monthScope} from './months.js';
import {
  amount, clausal, counted, joined, ordinal, spaced, when
} from './names.js';
import type {Rule} from './sets.js';
import {firstRule} from './sets.js';

const {units, words} = lexicon;

// A form, the calendar it is said in, and the months as its scope:
// «каждого месяца», names, or the bare «месяца» where months lead.
interface Form {
  form: QuartzDate;
  given: Calendar;
  scope: MonthsSaid;
  scoped: boolean;
}

// «Числа» with its ordinal in the accusative: «31-е число».
function theDate(day: number): string {
  return spaced(ordinals.accusative(day), words.dateThrough);
}

// A phrase and the months it counts within.
function within(phrase: string, {scope}: Form): DaySaid {
  return {
    ...daySaid(spaced(phrase, scope.text)),
    comma: scope.comma,
    fused: scope.fused,
    named: scope.named,
    scoped: true
  };
}

// «В месяцах из 31 дня».
function monthsOf(length: number): string {
  return spaced(words.inMonthsOf, String(length), counted(length,
    {few: units.day.many, many: units.day.many, one: units.day.few}));
}

// So many days before the last, the first way that applies: the day
// before; the calendar date, under named months of one length; the date
// in each length of month, when every month fires in one or two lengths;
// otherwise the count from the last day.
const beforeLast: Array<Rule<Form, DaySaid>> = [
  [function dayBefore({form}) {
    return (form as {days: number}).days === 1;
  }, function say(context) {
    return within(words.penultimateDay, context);
  }],
  [function oneLength({given, scoped}) {
    return scoped && !given.everyMonth &&
      given.facts.analyses.monthLengths.length === 1;
  }, function say({form, given, scope}) {
    const [{length}] = given.facts.analyses.monthLengths;

    return datesWithMonths(
      {kind: 'values', values: [length - (form as {days: number}).days]},
      given, scope);
  }],
  [function fewLengths({given, scoped}) {
    return scoped && given.everyMonth &&
      given.facts.analyses.monthLengths.length <= 2;
  }, function say({form, given}) {
    const lengths = given.facts.analyses.monthLengths;

    return {
      ...daySaid(joined(lengths.map(function inLength(group) {
        return {
          list: false,
          text: spaced(
            ordinals.genitive(group.length - (form as {days: number}).days),
            words.dateOf, monthsOf(group.length))
        };
      }))),
      comma: lengths.length > 1,
      scoped: true
    };
  }],
  [Boolean, function say(context) {
    const {form, given, scoped} = context;
    const said = within(spaced(words.before,
      amount((form as {days: number}).days, units.day),
      words.beforeTheLastDay), context);
    const skipped = scoped && given.everyMonth && given.lacking;

    return {
      ...said,
      comma: said.comma || skipped,
      text: clausal(said.text, when(skipped, spaced(words.inWhichThereIs,
        theDate(given.facts.analyses.monthLengths[0].length))))
    };
  }]
];

// The weekday nearest a date. Where the date can be a month's last day,
// under every month, the day is said to stay within the month, and the
// months that lack the date are set aside.
function nearest(context: Form): DaySaid {
  const {form, given, scoped} = context;
  const {day} = form as {day: number};
  const phrase = spaced(words.nearestTo, ordinal(day, 'dateDative'),
    words.dateToward, words.weekday);
  const atAnEnd = scoped && given.everyMonth &&
    given.facts.analyses.day.nearestDayIsLast !== 'never';

  return atAnEnd ?
    {
      ...daySaid(clausal(spaced(phrase, words.withinTheMonth),
        when(given.lacking, spaced(words.ifItHas, theDate(day))))),
      comma: given.lacking,
      scoped: true
    } :
    within(phrase, context);
}

const forms: {[kind: string]: (context: Form) => DaySaid} = {
  beforeLast(context) {
    return firstRule(beforeLast, context);
  },
  firstWeekday(context) {
    return within(words.firstWeekday, context);
  },
  last(context) {
    return within(words.lastDay, context);
  },
  lastWeekday(context) {
    return within(words.lastWeekday, context);
  },
  nearestWeekday: nearest
};

/**
 * A Quartz form of the day of the month. `scoped` is whether it takes
 * its months; where they lead, it says «месяца».
 */
function quartzDateSaid(form: QuartzDate, given: Calendar, scoped: boolean):
  DaySaid {
  const scope = scoped ?
    monthScope(given) :
    {comma: false, fused: false, named: false, text: words.ofTheMonth};

  return forms[form.kind]({form, given, scope, scoped});
}

/** The date a form needs, which the months it never fires in lack. */
function dateNeeded(form: QuartzDate): number {
  const needs = form as {day?: number; days?: number};

  return needs.day ?? (needs.days ?? 0) + 1;
}

export {dateNeeded, quartzDateSaid};
