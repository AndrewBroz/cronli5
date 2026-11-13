// The calendar part of the sentence: the days, with their month and year
// attached the way a date has them, or led by a month or year that has no
// noun to attach to.

import type {Analyses, DateReach} from '../../core/schedule.js';
import type {MonthFacts, Side} from './days.js';
import type {PortugueseStyle} from './options.js';
import type {Chosen, Rules} from './sets.js';
import type {Year} from './years.js';
import {choose, firesOn, inOrder, restricts} from './sets.js';
import {
  dateSide, eachMonth, fallingOn, missing, weekdaySide
} from './days.js';
import {ifAny, list, spaced} from './phrases.js';
import {monthName, runsAs} from './names.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import {yearOf} from './years.js';

const {contractions, units, words} = lexicon;

interface Facts extends MonthFacts {
  // Whether the day of the month comes only in leap years.
  leap: boolean;
  year: Year;
}

// The calendar part before its commas are placed: what leads it, the days
// with what is fused to them, and what is set off after them.
interface Laid {
  leads: string[];
  main: string;
  setOff: string[];
}

/** The calendar part as said, and how it joins the time part. */
export interface Calendar {
  // «pair» is a day of the month and a weekday together; «comma» is
  // anything set off by a comma; «open» is neither; «never» is a schedule
  // that never fires, which has no time to join.
  join: 'comma' | 'never' | 'open' | 'pair';
  text: string;
}

// Months listed one by one after a day of the month, at most this many.
const mostMonthsListed = 7;

// Months are named, never counted. A run passes the turn of the year only
// when every year is meant, and only the whole year takes an exception.
function monthRules(wrap: boolean): Rules {
  return {
    cadence: () => 0,
    domain: domainOf('month'),
    excepts: (base) => base.kind === 'all',
    longestWrap: Infinity,
    piecesOver: 0,
    steps: false,
    wrap
  };
}

const leapYears = `${contractions.de.plural.masculine} ${units.year.many} ` +
  words.leap;

// The named months after a day phrase, with «de». After a day of the
// month or a Quartz form, a pair repeats «de», and runs are listed month
// by month while they are few, so that no run seems to start at the day.
function attached(facts: Facts, dated: boolean): string {
  const {said} = facts.months;
  const runs = runsAs(said, words.from,
    (month) => monthName(month, facts.style));
  const names = inOrder(said, domainOf('month'))
    .map((month) => monthName(month, facts.style));

  if (dated && said.kind !== 'values' && names.length > mostMonthsListed) {
    return `${contractions.de.plural.masculine} ${units.month.many} ${runs}`;
  }

  if (dated) {
    return names.length === 2 ?
      list(names.map((month) => `${words.from} ${month}`)) :
      `${words.from} ${list(names)}`;
  }

  return runs;
}

// One side standing alone: the month and the year follow it as in a date
// where they can, and a year that cannot is set off.
function fused(side: Side, facts: Facts): Laid {
  const {leap, single, unnamed, year} = facts;
  const dated = side.month !== 'none';
  const depth = 1 + Number(!unnamed) + Number(!unnamed && !single);
  const fits = year.fuses >= depth && !leap;
  const month = unnamed ? dated && eachMonth : attached(facts, dated);

  return {
    leads: [],
    main: spaced([side.text, month, leap && leapYears, fits && year.fused]) +
      side.tail,
    setOff: fits || year.lead === '' ? [] : [year.lead]
  };
}

// Sides with no noun for a month or a year to attach to: those lead the
// sentence. One year fuses with one month's name; otherwise the year
// leads on its own, then the months.
function ledByMonth(sides: Side[], facts: Facts): Laid {
  const {leap, months, single, style, unnamed, year} = facts;
  const each = single ? words.ofTheMonth : eachMonth;
  const inLeap = leap ? leapYears : '';
  const under = unnamed ?
    {date: eachMonth, none: '', quartz: eachMonth} :
    {date: inLeap, none: '', quartz: spaced([each, inLeap])};
  const named = runsAs(months.said, words.in,
    (month) => monthName(month, style));

  return {
    leads: single && year.fuses > 1 ?
      [`${named} ${year.fused}`] :
      [year.lead, named].filter(Boolean),
    main: sides.map((side) => spaced([side.text, under[side.month]]) +
      side.tail).join(` ${words.also} `),
    setOff: []
  };
}

const sideMakers = {date: dateSide, weekday: weekdaySide};

// A schedule that never fires, and why: what its months lack.
function never(analyses: Analyses, facts: Facts): Calendar {
  const lacking = (analyses.dateReach as DateReach).never
    .map((month) => monthName(month, facts.style));
  const verb = words.hasNo[lacking.length === 1 ? 'one' : 'many'];

  return {
    join: 'never',
    text: `${words.never} (` + spaced([
      list(lacking), verb, missing(analyses), facts.year.lead
    ]) + ')'
  };
}

// The months a lone day of the month is said with. Where months are named
// and the day does not come in all of them, only those it comes in are.
function monthsOf(analyses: Analyses, wrap: boolean): Chosen {
  const reach = analyses.dateReach;
  const months = choose(
    firesOn(analyses.candidates.month, domainOf('month')), monthRules(wrap));
  const lone = !analyses.day.union && months.said.kind !== 'all';

  return reach && reach.fires && lone ?
    choose([...reach.everyYear, ...reach.leapYears].sort((a, b) => a - b),
      monthRules(wrap)) :
    months;
}

// The sides that name the days. Two day fields that both must match are
// one side, unless the days of the month are every day the months have,
// when the weekdays alone are left. A day of the month that never comes
// leaves the weekdays alone; days of the month that are every day the
// months have leave no pair, with or without weekdays beside them; and
// with no day named the days are «todos os dias», where that is needed.
function sidesOf(analyses: Analyses, facts: Facts, needed: boolean): Side[] {
  const {candidates, dateReach: reach} = analyses;
  const everyDay: Side = {
    condition: '',
    excepted: [],
    leads: false,
    month: 'none',
    several: false,
    tail: '',
    text: needed ? words.everyDay : ''
  };
  const named = (['weekday', 'date'] as const)
    .filter((field) => restricts(candidates[field]) &&
      (field === 'weekday' || !reach || reach.fires))
    .map((field) => sideMakers[field](analyses, facts));
  const whole = named.filter((side) => side.text === words.everyDay);
  const [weekday, date] = named;
  const meeting = analyses.day.both ?
    [whole.length > 0 ? weekday : fallingOn(date, weekday)] :
    [];

  return [meeting, whole, named, [everyDay]]
    .find((found) => found.length > 0) as Side[];
}

/**
 * The calendar part. `busy` is whether the hours give unrestricted days
 * work to do, so that «todos os dias» is said for them.
 */
function calendarPart(
  analyses: Analyses,
  busy: boolean,
  style: PortugueseStyle
): Calendar {
  const {candidates, dateReach: reach} = analyses;
  const year = yearOf(analyses);
  const dated = restricts(candidates.year);
  const months = monthsOf(analyses, !dated);
  const unnamed = months.said.kind === 'all';
  const comes = !reach || reach.fires;
  const facts: Facts = {
    leap: Boolean(reach) && comes &&
      (reach as DateReach).everyYear.length === 0,
    months,
    single: months.values.length === 1,
    style,
    unnamed,
    year
  };

  if (!comes && !analyses.day.union) {
    return never(analyses, facts);
  }

  const needed = busy || months.values.length < 12 || dated;
  const sides = sidesOf(analyses, facts, needed);
  const laid = sides.length > 1 || sides[0].leads ?
    ledByMonth(sides, facts) :
    fused(sides[0], facts);
  const excepted = [
    ...sides.flatMap((side) => side.excepted),
    ...ifAny(months.removed, (holes) => `${words.in} ` +
      list(holes.map((month) => monthName(month, style)))),
    ...year.excepted
  ];
  const setOff = [
    ...laid.setOff,
    ...ifAny(excepted, (holes) => `${words.except} ${list(holes)}`)
  ];
  const commas = laid.leads.length + setOff.length +
    sides.filter((side) => side.tail).length;
  const text = [...laid.leads.map((lead) => `${lead},`), laid.main]
    .join(' ') + setOff.map((phrase) => `, ${phrase}`).join('');

  if (sides.length > 1) {
    return {join: 'pair', text};
  }

  return {join: commas > 0 ? 'comma' : 'open', text};
}

export {calendarPart};
