// The day part: the days of the month, the weekdays, the Quartz forms,
// and the two together when a pattern restricts both.

import type {
  CadenceDescription, CadencePieces, Domain, QuartzDate, RangeDescription,
  ScheduleFacts, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {candidatesAs, daysReached, domainOf} from '../../core/index.js';
import type {CzechStyle} from './options.js';
import type {MonthRef} from './calendar.js';
import {
  anyMonth, oneMonth, parityStep, sample, stepWord, theseMonths
} from './calendar.js';
import type {Described} from './sets.js';
import {
  chosen, counted, enoughForARun, listed, ofKind, spaced, stretchOf,
  togetherIn
} from './sets.js';
import lexicon from './lexicon.js';

const {units, weekdays, words} = lexicon;

type Except = Extract<SetDescription, {kind: 'except'}>;
type Pieces = Extract<SetDescription, {kind: 'pieces'}>;

/**
 * How a day part ends, which decides whether «vždy» stands before the
 * time: nothing said, «denně», a range or an exception, a union (which
 * «, vždy» closes), or anything else.
 */
export type Close = 'always' | 'daily' | 'none' | 'plain' | 'span';

/** The day part of a description. */
export interface DayPart {
  close: Close;
  // Whether the months are said inside it and do not lead.
  consumed: boolean;
  // Whether the schedule never fires, and no time follows.
  never: boolean;
  text: string;
}

/** What the day part is said beside. */
export interface Setting {
  // The word for an unrestricted day: «denně», «každou noc» or nothing.
  idle: string;
  // The months named, in order; none when every month is reached.
  months: number[];
  style: CzechStyle;
  // The single year written after a single month.
  year: string;
}

// A phrase for one arm of the day.
interface Phrase {
  // Whether it ends in a clause closed by a comma.
  clause?: boolean;
  close?: Close;
  consumed?: boolean;
  fused?: boolean;
  opener?: string;
  text: string;
}

// The ways the month is named in one phrase: with the days' own phrase,
// for a date that stands apart from a leading month, and for the forms
// that never take the month in.
interface Refs {
  dateOnly: MonthRef;
  general: MonthRef;
  own: MonthRef;
  style: CzechStyle;
}

const daysInAWeek = 7;
const manyWeekdays = 5;
const earliestLastWeekday = 22;
const longestMonth = 31;

function ordinals(days: number[], last?: string): string {
  return listed(days.map(function ordinal(day) {
    return `${day}.`;
  }), last);
}

// The items of pieces: a run as «1. až 7.», a single day as «15.».
function pieceItems(form: Pieces): string[] {
  return form.parts.flatMap(function items(part) {
    return part.kind === 'range' ?
      [spaced(`${part.from}.`, words.upTo, `${part.to}.`)] :
      part.values.map(function single(day) {
        return `${day}.`;
      });
  });
}

// Every odd day or every even day, from the day it starts on.
function parityOf(start: number): string {
  return start % parityStep ? words.oddDay : words.evenDay;
}

// A run or a cadence of days with both ends: «od 1. do 9. dne v měsíci»,
// «každý lichý den od 1. do 9. dne v měsíci», «každý třetí den od 11. do
// 29. dne v měsíci».
function daysWithEnds(part: RangeDescription | CadenceDescription,
  refs: Refs): string {
  const {first, last, step} = stretchOf(part);
  const rhythm = {1: '', [parityStep]: parityOf(first)}[step] ??
    spaced(words.everyNth, stepWord(step), units.day.one);

  return spaced(rhythm, words.from, `${first}.`, words.to,
    refs.general.date(`${last}.`));
}

// A cadence of days: the parity word when its step is two, with both ends
// unless it is every odd or every even day; any other step after its
// start, with its first three members, and its end when it stops early.
function cadenceOfDays(form: CadenceDescription, refs: Refs, domain: Domain):
  Phrase {
  const whole = form.start - domain.min < form.interval &&
    form.last + form.interval > domain.max;
  const stops = form.last + form.interval <= domain.max;
  const ends = spaced(`${form.start}.`, words.to,
    refs.general.date(`${form.last}.`));

  if (form.interval === parityStep) {
    return whole ?
      {
        fused: true,
        text: spaced(parityOf(form.start), refs.own.within)
      } :
      {text: daysWithEnds(form, refs)};
  }

  return {
    text: spaced(words.from,
      stops ? ends : refs.general.date(`${form.start}.`), words.everyNth,
      stepWord(form.interval), units.day.one, sample(form, '.'))
  };
}

// The days of the month, by the kind of set.
const dateKinds: {
  [kind: string]: (form: never, refs: Refs, domain: Domain) => Phrase;
} = {
  cadence: cadenceOfDays,
  cadencePieces(form: CadencePieces, refs: Refs) {
    return {
      text: listed(form.parts.map(function say(part) {
        return part.kind === 'values' ?
          refs.general.date(ordinals(part.values)) :
          daysWithEnds(part, refs);
      }))
    };
  },
  except(form: Except, refs: Refs, domain: Domain) {
    const base = form.base.kind === 'all' ?
      {text: ''} :
      daysSaid(form.base, refs, domain);

    return form.base.kind === 'all' ?
      {
        close: 'span',
        text: spaced(words.daily, words.except,
          refs.dateOnly.date(ordinals(form.removed)))
      } :
      {
        ...base,
        close: 'span',
        text: spaced(base.text, words.except, ordinals(form.removed),
          words.dayGenitive)
      };
  },
  pieces(form: Pieces, refs: Refs) {
    return {
      fused: true,
      opener: words.always,
      text: refs.own.date(listed(pieceItems(form)))
    };
  },
  range(form: RangeDescription, refs: Refs) {
    return {
      close: 'span',
      fused: true,
      text: spaced(words.from, `${form.from}.`, words.to,
        refs.own.date(`${form.to}.`))
    };
  },
  values(form: ValuesDescription, refs: Refs) {
    return {
      fused: true,
      opener: words.always,
      text: refs.own.date(ordinals(form.values))
    };
  }
};

function daysSaid(form: Described, refs: Refs, domain: Domain): Phrase {
  return dateKinds[form.kind](form as never, refs, domain);
}

// So many days before the last: a date wherever the form comes to one
// day or to a few months, and otherwise the distance with one worked day.
function beforeLast(days: number, facts: ScheduleFacts, refs: Refs): Phrase {
  const groups = facts.analyses.monthLengths;
  const named = facts.analyses.candidates.month?.[0].kind !== 'all';
  const months = [...new Set(groups.flatMap(function monthsOf(group) {
    return group.months;
  }))].sort(function ascending(a, b) {
    return a - b;
  });
  const [first] = groups;
  const [longest] = groups.slice(-1);
  const distance = spaced(counted([days], units.day),
    words.beforeTheLastDayOf);

  function dayIn(month: number): string {
    const group = groups.find(function holds(found) {
      return found.months.includes(month);
    }) as typeof first;

    return oneMonth(month, '', refs.style).date(`${group.length - days}.`);
  }

  const rules: Array<{when: boolean; said: () => Phrase}> = [
    {
      said: () => ({
        fused: true,
        opener: words.always,
        text: spaced(words.penultimateDay, refs.own.within)
      }),
      when: days === 1
    },
    {
      said: () => named && daysSaid(
        {kind: 'values', values: [first.length - days]}, refs,
        domainOf('date')) ||
        {
          opener: words.always,
          text: spaced(`${first.length - days}.`, words.dayGenitive,
            words.inMonthsOf, String(first.length), units.day.few)
        },
      when: groups.length === 1
    },
    {
      said: () => ({
        consumed: true,
        opener: words.always,
        text: listed(months.map(dayIn))
      }),
      when: months.length > 1 && months.length <= enoughForARun &&
        groups.every(function everyYear(group) {
          return group.years === 'every';
        })
    },
    {
      said: () => ({
        consumed: true,
        opener: words.always,
        text: `${spaced(distance, lexicon.months[months[0]].genitive)} (${
          first.length - days}., ${words.inLeapYear} ${
          oneMonth(months[0], '', refs.style)
            .date(`${longest.length - days}.`)})`
      }),
      when: months.length === 1
    },
    {
      said: () => ({
        opener: words.always,
        text: `${spaced(distance, words.monthGenitive)} (${
          spaced(words.forExample, `${longest.length - days}.`,
            words.inMonthOf, String(longest.length), units.day.few)})`
      }),
      when: true
    }
  ];

  return (rules.find(function applies(rule) {
    return rule.when;
  }) as (typeof rules)[number]).said();
}

// A date that moves off a weekend: the date, the condition, and the day
// it moves to, closed by a comma.
function moved(date: string, to: string): Phrase {
  return {
    clause: true,
    fused: true,
    opener: words.always,
    text: `${date}, ${words.ifItFallsOnAWeekend}, ${words.instead} ${to},`
  };
}

// The Quartz forms of the day of the month.
function quartzDate(form: QuartzDate, facts: ScheduleFacts, refs: Refs):
  Phrase {
  const {dateReach: reach, day} = facts.analyses;
  const lacking = facts.analyses.candidates.month?.[0].kind === 'all' &&
    reach && reach.never.length + reach.leapYears.length > 0;
  const nearest = {
    always: words.onTheFridayBeforeIt,
    never: words.onTheNearestFridayOrMonday,
    sometimes: `${words.onTheNearestFridayOrMonday}, ${
      words.butFromTheLastDayAlwaysTheFridayBefore}`
  }[day.nearestDayIsLast || 'never'];
  const forms: {[kind: string]: () => Phrase} = {
    beforeLast: () => beforeLast((form as {days: number}).days, facts, refs),
    firstWeekday: () => moved(refs.own.date('1.'), words.theFollowingMonday),
    last: () => ({
      fused: true,
      opener: words.always,
      text: spaced(words.lastDay, refs.own.within)
    }),
    lastWeekday: () => moved(spaced(words.lastDay, refs.own.within),
      words.onTheFridayBeforeIt),
    nearestWeekday: () => moved(
      spaced(refs.own.date(`${(form as {day: number}).day}.`),
        lacking ? words.onlyInMonthsThatHaveIt : ''),
      nearest)
  };

  return forms[form.kind]();
}

// The weekdays of a pattern, as its phrase and as what a union asks of
// them.
interface Weekdays extends Phrase {
  // The days in the order of the week, as after «na».
  after: string;
  // The removed days, when the phrase is an exception.
  removed: number[];
  // The days of the month an nth or last weekday can fall on.
  span: number[];
}

function accusative(weekday: number): string {
  return weekdays[weekday].accusative;
}

// The weekday part. The week runs from Monday: one day, a run of three
// or more, an exception for five or six days that are no run, and
// otherwise a list. Under the short style a list and a run take the
// table forms.
function weekdaysSaid(facts: ScheduleFacts, style: CzechStyle, within: string):
  Weekdays {
  const arm = facts.analyses.day.weekday;
  const candidates =
    candidatesAs(facts, 'weekday', {first: 1, linear: true}) || [];
  const days = (candidates[candidates.length - 1] as ValuesDescription ||
    {values: []}).values;
  const [first, second] = days.map(function name(day) {
    return weekdays[day];
  });
  const base = {after: '', removed: [], span: [1, longestMonth]};

  if (arm?.kind === 'quartz') {
    const {form} = arm;
    const name = weekdays[form.weekday];
    const text = spaced(
      form.kind === 'nth' ?
        lexicon.nthWords[form.nth - 1][name.gender] :
        words.lastOne,
      name.accusative, within);

    return {
      ...base,
      after: spaced(words.ifItFallsOn, text),
      fused: true,
      opener: words.always,
      span: form.kind === 'nth' ?
        [daysInAWeek * (form.nth - 1) + 1, daysInAWeek * form.nth] :
        [earliestLastWeekday, longestMonth],
      text
    };
  }

  const run = days.length >= enoughForARun && ofKind(candidates, 'range');
  const except = days.length >= manyWeekdays && ofKind(candidates, 'except');
  const pair = days.length === parityStep && first.gender !== second.gender;
  const rules: Array<{when: unknown; said: () => Weekdays}> = [
    {
      said: () => ({
        ...base,
        after: spaced(words.ifItFallsOn, accusative((run as {from: number})
          .from), words.upTo, accusative((run as {to: number}).to)),
        close: 'span',
        text: style.short ?
          spaced(weekdays[(run as {from: number}).from].short, words.upTo,
            weekdays[(run as {to: number}).to].short) :
          spaced(words.from, weekdays[(run as {from: number}).from].genitive,
            words.to, weekdays[(run as {to: number}).to].genitive)
      }),
      when: run
    },
    {
      said: () => ({
        ...base,
        after: spaced(words.ifItDoesNotFallOn, listed(
          (except as Except).removed.map(accusative), words.nor)),
        close: 'span',
        removed: (except as Except).removed,
        text: spaced(words.daily, words.except, listed(
          (except as Except).removed.map(function name(day) {
            return weekdays[day].genitive;
          })
        ))
      }),
      when: except
    },
    {
      said: () => ({
        ...base,
        after: spaced(words.ifItFallsOn,
          listed(days.map(accusative), words.or)),
        text: style.short && days.length > 1 ?
          listed(days.map(function short(day) {
            return weekdays[day].short;
          })) :
          spaced(lexicon.every[first.gender], pair ?
            spaced(first.accusative, words.and,
              lexicon.every[second.gender], second.accusative) :
            listed(days.map(accusative)))
      }),
      when: true
    }
  ];

  return (rules.find(function applies(rule) {
    return rule.when;
  }) as (typeof rules)[number]).said();
}

// The days of the month after «připadne-li na»: «15. den v měsíci», a
// list joined by «nebo», a run with «až».
function daysAfterOn(form: Described, refs: Refs): string {
  const items: {[kind: string]: () => string} = {
    pieces: () => listed(pieceItems(form as Pieces), words.or),
    range: () => spaced(`${(form as RangeDescription).from}.`, words.upTo,
      `${(form as RangeDescription).to}.`),
    values: () => ordinals((form as ValuesDescription).values, words.or)
  };

  return refs.own.day(items[form.kind]());
}

// Removed weekdays after «ale»: each with its own preposition.
function onWeekdays(removed: number[]): string {
  return listed(removed.map(function on(day) {
    return spaced(
      lexicon.weekdaysAfterVe.includes(day) ?
        words.atBeforeCluster :
        words.at,
      accusative(day));
  }));
}

// Which day fields say something: a day field that names every value, or
// every day the reached months have, restricts nothing, and a date arm
// that adds nothing to a union is not said.
function armsOf(facts: ScheduleFacts): {date: boolean; weekday: boolean} {
  const {dateReach: reach, day} = facts.analyses;
  const reached = daysReached(facts, {linear: true});
  const everyDay = Boolean(reach?.days?.everyDay) ||
    reached?.candidates[0]?.kind === 'all';

  return {
    date: Boolean(day.date) && !everyDay && !day.dateAddsNothing,
    weekday: Boolean(day.weekday) && !(day.union && everyDay) &&
      facts.analyses.candidates.weekday?.[0].kind !== 'all'
  };
}

// The date arm: a Quartz form, or the set of days the reached months
// have, said by the generic order.
function dateArm(facts: ScheduleFacts, refs: Refs):
  Phrase & {form?: Described} {
  const arm = facts.analyses.day.date;
  const reached = daysReached(facts, {linear: true});

  if (arm?.kind === 'quartz' || !reached) {
    return quartzDate((arm as {form: QuartzDate}).form, facts, refs);
  }

  const form = chosen(reached.candidates,
    {
      domain: reached.domain,
      exceptions: true,
      rounds: false,
      together: togetherIn(reached.candidates, reached.domain)
    });

  return {...daysSaid(form, refs, reached.domain), form};
}

// A day of the month and a weekday together: either one fires. The
// weekday, «a navíc», the days of the month, and «, vždy»; an arm that is
// an exception is kept beside the only thing it can belong to.
function union(facts: ScheduleFacts, setting: Setting): DayPart {
  const {months, style} = setting;
  const single = months.length === 1;
  const named = single ?
    oneMonth(months[0], '', style) :
    months.length && theseMonths || anyMonth;
  const refs = {dateOnly: named, general: named, own: named, style};
  const date = dateArm(facts, refs);
  const form = date.form || {kind: 'all'};
  const removed = form.kind === 'except' ? form.removed : [];
  const week = weekdaysSaid(facts, style, single ?
    oneMonth(months[0], setting.year, style).within :
    anyMonth.within);
  const plain = weekdaysSaid(facts, style, anyMonth.within);
  const missesFew = form.kind === 'except' && form.base.kind === 'all';
  const reachable = removed.some(function canFall(day) {
    return day >= week.span[0] && day <= week.span[1];
  });
  const part = {consumed: false, never: false};
  const rules: Array<{when: boolean; said: () => DayPart}> = [
    {
      said: () => ({...part, close: 'span', text: date.text}),
      when: missesFew && !reachable
    },
    {
      said: () => ({
        ...part,
        close: 'plain',
        text: `${words.daily}, ${spaced(words.but,
          named.date(ordinals(removed)), words.onlyThen)}, ${plain.after},`
      }),
      when: missesFew
    },
    {
      said: () => ({
        ...part,
        close: 'plain',
        text: `${words.daily}, ${spaced(words.but, onWeekdays(week.removed),
          words.onlyThen)}, ${spaced(words.ifItFallsOn,
          daysAfterOn(form, refs))},`
      }),
      when: week.removed.length > 0 &&
        ['values', 'range', 'pieces'].includes(form.kind)
    },
    {
      said: () => ({
        ...part,
        close: 'always',
        consumed: single && Boolean(week.fused),
        text: `${spaced(date.text, words.andBesides, week.text)} (${
          spaced(words.alsoOn, ordinals(removed))}),`
      }),
      when: removed.length > 0
    },
    {
      said: () => ({
        ...part,
        close: 'always',
        consumed: single && Boolean(week.fused),
        text: `${spaced(week.text, words.andBesides, date.text)}${
          date.clause ? '' : ','}`
      }),
      when: true
    }
  ];

  return (rules.find(function applies(rule) {
    return rule.when;
  }) as (typeof rules)[number]).said();
}

// A day of the month and a weekday that must both match: the days of
// the month as they are said alone, and the condition that they fall on
// the weekdays. It is never «a navíc», which is the union's.
function both(facts: ScheduleFacts, refs: Refs, fused: boolean): DayPart {
  const date = dateArm(facts, refs);
  const week = weekdaysSaid(facts, refs.style, anyMonth.within);

  return {
    close: 'plain',
    consumed: fused && Boolean(date.fused) || Boolean(date.consumed),
    never: false,
    text: `${spaced(date.text, words.onlyThen)}, ${week.after},`
  };
}

// A date that exists in no reached month: «jen», the days as written,
// and «, tedy nikdy».
function never(facts: ScheduleFacts, setting: Setting): DayPart {
  const {months, style} = setting;
  const arm = facts.analyses.day.date;
  const form = arm?.kind === 'quartz' ? arm.form : {kind: 'plain'};
  const names = spaced(words.at, listed(months.map(function name(month) {
    return lexicon.months[month].locative;
  })));

  function inMonths(days: string): string {
    return spaced(days, words.dayGenitive, names);
  }

  const named: MonthRef = months.length === 1 ?
    oneMonth(months[0], setting.year, style) :
    {date: inMonths, day: inMonths, within: names};
  const refs = {dateOnly: named, general: named, own: named, style};
  const domain = domainOf('date');
  const said: {[kind: string]: () => string} = {
    beforeLast: () => spaced(
      counted([(form as {days: number}).days], units.day),
      words.beforeTheLastDayOf, named.within),
    nearestWeekday: () => named.date(`${(form as {day: number}).day}.`),
    plain: () => daysSaid(chosen(
      candidatesAs(facts, 'date', {linear: true}) as SetDescription[],
      {domain, exceptions: true, rounds: false}), refs, domain).text
  };

  return {
    close: 'plain',
    consumed: true,
    never: true,
    text: `${spaced(words.only, said[form.kind]())}, ${words.thusNever}`
  };
}

/** The day part, beside the months and the year it is said with. */
function dayPart(facts: ScheduleFacts, setting: Setting): DayPart {
  const {months, style, year} = setting;
  const arms = armsOf(facts);
  const single = months.length === 1;
  const own = single ? oneMonth(months[0], year, style) : anyMonth;
  const refs = {
    dateOnly: single ? oneMonth(months[0], '', style) : anyMonth,
    general: anyMonth,
    own,
    style
  };

  function alone(phrase: Phrase): DayPart {
    const fused = single && Boolean(phrase.fused);

    return {
      close: phrase.close || 'plain',
      consumed: fused || Boolean(phrase.consumed),
      never: false,
      text: spaced(fused && year ? '' : phrase.opener || '', phrase.text)
    };
  }

  const rules: Array<{when: unknown; said: () => DayPart}> = [
    {
      said: () => never(facts, setting),
      when: arms.date && (!arms.weekday || facts.analyses.day.both) &&
        facts.analyses.dateReach?.fires === false
    },
    {
      said: () => both(facts, refs, single),
      when: arms.date && arms.weekday && facts.analyses.day.both
    },
    {said: () => union(facts, setting), when: arms.date && arms.weekday},
    {said: () => alone(dateArm(facts, refs)), when: arms.date},
    {
      said: () => alone(weekdaysSaid(facts, style, own.within)),
      when: arms.weekday
    },
    {
      said: () => ({
        close: setting.idle === words.daily ? 'daily' : 'plain',
        consumed: false,
        never: false,
        text: setting.idle
      }),
      when: setting.idle
    },
    {
      said: () => ({
        close: 'none', consumed: false, never: false, text: ''
      }),
      when: true
    }
  ];

  return (rules.find(function applies(rule) {
    return rule.when;
  }) as (typeof rules)[number]).said();
}

export {armsOf, dayPart};
