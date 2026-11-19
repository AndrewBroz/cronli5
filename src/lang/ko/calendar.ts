// The calendar part: the year, the month and the day, large to small,
// with «매-» at the largest unit that is free, and the two day fields
// joined as cron joins them.

import type {ScheduleFacts, SetDescription} from '../../core/schedule.js';
import {after, join, noted, tight} from './clock.js';
import type {Arm} from './dates.js';
import {dateArm, leapOnly} from './dates.js';
import lexicon from './lexicon.js';
import {monthsSaid, tightParts} from './months.js';
import type {KoreanStyle} from './options.js';
import type {Described, Except, FieldSet} from './sets.js';
import {choose, endsOf, fieldOf, parityOf} from './sets.js';
import {weekArm} from './weekdays.js';

const {units, words} = lexicon;

/** The year phrase, as each place in the sentence says it. */
interface Years {
  // On a second arm, which says the years again.
  again: string;
  lead: string;
  // Whether the phrase is a span of years, so that «매년» follows it
  // before a month.
  ranged: boolean;
}

/**
 * What the calendar names below the year: a day, only a month or a year
 * (`span`), nothing, «매일» of its own with days left out (`daily`), or
 * every day with a condition in a closing note (`note`). `never` is the
 * date that never comes.
 */
export type Reach = 'daily' | 'day' | 'never' | 'none' | 'note' | 'span';

/** The calendar part, the note that closes the sentence, and its reach. */
export interface Calendar {
  note: string;
  reach: Reach;
  text: string;
}

/** The two day fields and the months, as far as each is said. */
interface Arms {
  date: Arm | false;
  // The months as written, or null when every month is reached.
  months: number[] | null;
  week: Arm | false;
}

/** The fields of a schedule's days, and what is said of each. */
interface Days extends Arms {
  // The year, or «매년», that opens the calendar.
  front: string;
  years: Years;
}

type DayRule = (days: Days, facts: ScheduleFacts) => Calendar | false;

const yearParities = [words.evenYears, words.oddYears];
const topic = [words.topicAfterConsonant, words.topicAfterVowel];
const also = `, ${words.also} `;

function plainYears(text: string, ranged: boolean): Years {
  return {again: text, lead: text, ranged};
}

function tightYears(form: Described): string {
  return tight(tightParts(form), units.year);
}

// A run of years: to its end, or from its start when it has no end.
function yearRange(form: Described, set: FieldSet): string {
  const {start} = endsOf(form, set.domain);

  return (form as {open?: true}).open ?
    `${start}${units.year}${words.from}` :
    tightYears(form);
}

// A count from a named year, with its last year when it has one.
function yearSteps(form: Described, set: FieldSet): string {
  const {interval, last, start} = endsOf(form, set.domain);

  return join(
    `${start}${units.year}${words.from}`,
    !(form as {open?: true}).open && `${last}${units.year}${words.until}`,
    `${interval}${units.year}${words.every}`
  );
}

const yearParts: {
  [kind: string]: (form: Described, set: FieldSet) => string;
} = {cadence: yearSteps, range: yearRange, values: tightYears};

const yearSayers: {
  [kind: string]: (form: never, set: FieldSet) => Years;
} = {
  // Years counted by a step tie what follows to them with «그해».
  cadence(form: Described, set) {
    const parity = parityOf(form, set.domain, yearParities);
    const text = parity && `${parity}${words.every}` || yearSteps(form, set);
    const lead = `${text}, ${words.thatYear}`;

    return {again: words.thatYear, lead, ranged: false};
  },
  // Several runs and steps are plural: «이들 해에는».
  cadencePieces(form: {parts: Described[]}, set) {
    const those = `${words.thoseYears}${words.at}${words.topicAfterVowel}`;
    const text = form.parts.map(function each(part) {
      return yearParts[part.kind](part, set);
    }).join(also);

    return {again: those, lead: `${text}, ${those}`, ranged: false};
  },
  except(form: Except) {
    return plainYears(`${words.everyYear}(${tight(form.removed, units.year)} ` +
      `${words.except})`, false);
  },
  pieces(form: Described) {
    return plainYears(tightYears(form), true);
  },
  range(form: Described, set) {
    return plainYears(yearRange(form, set), true);
  },
  values(form: Described) {
    return plainYears(tightYears(form), false);
  }
};

function yearForm(set: FieldSet): Described {
  return choose(set,
    {allBut: true, ceiling: 12, few: 4, split: true, splitFreely: true});
}

// The year phrase. An unrestricted year says nothing, and its thousands
// of values are never listed to find that out.
function yearsSaid(facts: ScheduleFacts): Years {
  const [first] = facts.analyses.candidates.year as SetDescription[];
  const set = first.kind !== 'all' && fieldOf(facts, 'year');

  return set ?
    yearSayers[yearForm(set).kind](yearForm(set) as never, set) :
    plainYears('', false);
}

// Whether a day field narrows the days: a form does, and a plain set
// unless it is every value.
function restricts(candidates: SetDescription[] | null): boolean {
  return candidates === null || candidates[0].kind !== 'all';
}

function monthsOf(days: Days): string {
  return days.months && monthsSaid(days.months) || '';
}

function fronted(days: Days, text: string, reach: Reach, note = ''):
  Calendar {
  return {note, reach, text: join(days.front, text)};
}

// Both day fields narrowed, and either may match: «매일» with a condition
// when one side is every day but a few, otherwise the weekdays, then the
// dates added with «에도».
function either(days: Days, date: Arm, week: Arm): Calendar {
  const condition = date.left && [date.left, week.bare] ||
    [week.left, date.bare];
  // A step of days is no noun to hang «인» on.
  const only = [words.onlyIf, words.fallsUnder][
    Number(!date.left && date.stepped)];
  const note = `${words.but}, ${after(condition[0], topic)} ` +
    `${condition[1]}${only}`;
  const too = [words.alsoAt, words.too][
    Number(date.text.endsWith(words.every))];

  return date.left && week.daily && fronted(days, join(monthsOf(days),
    `${words.everyDay}(${week.left}${words.is} ${date.left} ${words.except})`),
  'daily') ||
    (date.left || week.daily) && fronted(days, monthsOf(days), 'note', note) ||
    fronted(days, `${week.text}${also}` +
      `${join(days.years.again, date.text)}${too},`, 'day');
}

// Both day fields narrowed, and both must match: the days of the month
// that fall on those weekdays. Every day but a few leaves the weekdays,
// less those dates.
function both(days: Days, date: Arm, week: Arm): Calendar {
  const chosen = `${week.both}${words.isDay}`;

  return fronted(days, date.left &&
    `${week.text}(${date.left} ${words.except})` ||
    date.single && noted(date.text, `${week.both}${words.onlyIf}`) ||
    date.stepped && `${date.text}, ${words.amongThose} ${chosen}` ||
    `${date.text} ${words.among} ${chosen}`, 'day');
}

const rules: DayRule[] = [
  function twoArms(days, facts) {
    const {date, week} = days;

    return date && week &&
      (facts.analyses.day.both ? both : either)(days, date, week);
  },
  function oneArm(days) {
    const arm = days.date || days.week;

    return arm && fronted(days, arm.text,
      ['day', 'daily'][Number(arm.daily)] as Reach);
  },
  function noDay(days) {
    const text = join(days.front, monthsOf(days));

    return {
      note: '', reach: ['none', 'span'][Number(text !== '')] as Reach, text
    };
  }
];

// Whether the date field has nothing to say: it holds every day its
// months have, it adds nothing to the weekdays, or it never comes.
function dateSilent(facts: ScheduleFacts): boolean {
  const {dateReach: reach, day} = facts.analyses;

  return day.dateAddsNothing || reach !== null &&
    (!reach.fires || Boolean(reach.days) && reach.days!.everyDay);
}

function armsOf(facts: ScheduleFacts, style: KoreanStyle): Arms {
  const {candidates, dateReach: reach, day} = facts.analyses;
  // A union with every day is every day: the weekdays are not said.
  const everyDay = day.union && Boolean(reach?.days?.everyDay);
  const months = restricts(candidates.month) &&
    fieldOf(facts, 'month').values || null;
  const week = restricts(candidates.weekday) && !everyDay &&
    weekArm(facts, months, style);
  const date = restricts(candidates.date) && !dateSilent(facts) &&
    dateArm(facts, day.union && Boolean(week));

  return {date, months, week};
}

// What opens the calendar: the year phrase, with «매년» after a span of
// years before a month; or «매년» alone before a month, «윤년마다» when
// the date comes in leap years only.
function frontOf(facts: ScheduleFacts, arms: Arms, years: Years): string {
  const {date, months} = arms;
  const monthly = Boolean(months) || Boolean(date && date.months);
  const leap = Boolean(date) && leapOnly(facts, facts.analyses.day.union);
  const yearly = monthly &&
    [words.everyYear, words.everyLeapYear][Number(leap)] || '';

  return years.lead ?
    join(years.lead, years.ranged && monthly && words.everyYear) :
    yearly;
}

/** The calendar part of a description. */
function calendarOf(facts: ScheduleFacts, style: KoreanStyle): Calendar {
  const {dateReach: reach, day} = facts.analyses;
  const arms = armsOf(facts, style);
  const years = yearsSaid(facts);
  const days = {...arms, front: frontOf(facts, arms, years), years};
  const never = reach !== null && !reach.fires && !day.union;

  return never ?
    {note: '', reach: 'never', text: words.neverRuns} :
    rules.reduce<Calendar | false>(function first(found, rule) {
      return found || rule(days, facts);
    }, false) as Calendar;
}

export {calendarOf};
