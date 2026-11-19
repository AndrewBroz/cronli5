// The days of the month: which of the answers' kinds a set of days is
// ("How a form is chosen"), the forms some schedulers add, and how each
// is said with the month it belongs to.

import type {
  CadenceDescription, Domain, QuartzDate, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {denote} from '../../core/describe-set.js';
import {daysReached} from '../../core/set-views.js';
import lexicon from './lexicon.js';
import {every, listed, pieced, units, words} from './text.js';

/** The kinds a day-of-month phrase can be. */
export type DayKind = 'allBut' | 'digits' | 'falling' | 'last' | 'less' |
  'named' | 'parity' | 'penultimate' | 'rhythm' | 'stretches' | 'working';

/** The days of the month as they will be said. */
export interface DayForm {
  kind: DayKind;
  // The days named, ascending.
  days: number[];
  removed: number[];
  base: DayForm | null;
  // A rhythm's step and the day it starts again from; a count of days
  // before the last; 1 for the first working day.
  interval: number;
  start: number;
  // The runs of days said between two ends.
  runs: number[][];
}

/** What a day phrase is said with: its month tail, or the month itself. */
export interface Where {
  // «każdego miesiąca», «miesiąca», «tego miesiąca».
  tail: string;
  // The month of a calendar date (with its year), empty when the days
  // are not a date: «czerwca», «VI», «czerwca 2030 r.».
  date: string;
  // What a scheduler's form is counted in: the month, or the tail.
  of: string;
  // «od poniedziałku do piątku», as the style writes it.
  workingWeek: string;
}

type Maybe<T> = T | false | null | undefined;
type Except = Extract<SetDescription, {kind: 'except'}>;

// The days reached, their candidates and the month they are judged in.
interface DaySet {
  cands: SetDescription[];
  domain: Domain;
  days: number[];
}

const dash = '–';
const minRun = 3;
const longRhythm = 7;

function make(kind: DayKind, extra: Partial<DayForm>): DayForm {
  return {base: null, days: [], interval: 1, kind, removed: [], runs: [],
    start: 1, ...extra};
}

// The maximal runs of neighbouring days.
function runsOf(days: number[]): number[][] {
  return days.reduce<number[][]>(function group(runs, day) {
    const current = runs[runs.length - 1];
    const joins = current && current[current.length - 1] + 1 === day;

    (joins && current || runs[runs.push([]) - 1]).push(day);

    return runs;
  }, []);
}

// Every odd or even day of the month, or a rhythm of more than seven
// days that runs to the month's end. A shorter rhythm, or one that stops
// early, is not a rhythm to a reader.
function monthly(cadence: CadenceDescription, domain: Domain):
  Maybe<DayForm> {
  const fills = cadence.last + cadence.interval > domain.max;
  const count = (cadence.last - cadence.start) / cadence.interval + 1;
  const found = {interval: cadence.interval, start: cadence.start};

  return fills && cadence.interval === 2 && cadence.start <= 2 &&
    make('parity', found) ||
    fills && count > longRhythm && make('rhythm', found);
}

function named(set: DaySet): Maybe<DayForm> {
  return set.days.length <= 2 && make('named', {days: set.days});
}

function allBut(set: DaySet): Maybe<DayForm> {
  const found = set.cands.find(function fromAll(cand) {
    return cand.kind === 'except' && cand.base.kind === 'all' &&
      cand.removed.length <= 2;
  }) as Except | undefined;

  return found && make('allBut', {removed: found.removed});
}

function cadenced(set: DaySet): Maybe<DayForm> {
  const found = set.cands.find(function isCadence(cand) {
    return cand.kind === 'cadence';
  }) as CadenceDescription | undefined;

  return found && monthly(found, set.domain);
}

// The odd or even days, or a long rhythm, less one or two days.
function lessOf(set: DaySet): {base: DayForm; cut: Except} | undefined {
  return set.cands.map(function based(cand) {
    const base = cand.kind === 'except' && cand.base.kind === 'cadence' &&
      cand.removed.length <= 2 && monthly(cand.base, set.domain);

    return base && {base, cut: cand as Except};
  }).find(Boolean) as {base: DayForm; cut: Except} | undefined;
}

function less(set: DaySet): Maybe<DayForm> {
  const found = lessOf(set);

  return found && make('less', {base: found.base, removed: found.cut.removed});
}

// Said positively: the stretches of odd or even days that are left, each
// from its first day to its last. A stretch of one day is no stretch.
function stretches(set: DaySet): Maybe<DayForm> {
  const found = lessOf(set);
  const kept = found && found.base.kind === 'parity' &&
    denote(found.cut.base, set.domain).reduce<number[][]>(
      function cut(runs, day) {
        found.cut.removed.includes(day) && runs.push([]) ||
          runs[runs.length - 1].push(day);

        return runs;
      }, [[]]
    ).filter(function held(run) {
      return run.length > 0;
    });

  return found && kept && kept.every(function long(run) {
    return run.length > 1;
  }) && make('stretches', {runs: kept, start: found.base.start});
}

function digits(set: DaySet): DayForm {
  return make('digits', {runs: runsOf(set.days)});
}

/** Days named for themselves: one or two, or digits after «w dniach». */
function theseDays(days: number[]): DayForm {
  const set = {cands: [], days, domain: {cyclic: true, max: 0, min: 0}};

  return named(set) || digits(set);
}

// The kinds in order. Inside a union no half is said as an exception, so
// the two kinds that subtract give way to the days that fire.
const kinds = [named, allBut, cadenced, less, digits];
const positiveKinds = [named, cadenced, stretches, digits];

function plainDays(facts: ScheduleFacts, positive: boolean): DayForm {
  const reached = daysReached(facts, {linear: true}) as
    {candidates: SetDescription[]; domain: Domain};
  const cands = reached.candidates;
  const set = {cands, days: denote(cands[cands.length - 1], reached.domain),
    domain: reached.domain};

  return [kinds, positiveKinds][Number(positive)].reduce<Maybe<DayForm>>(
    function first(found, kind) {
      return found || kind(set);
    }, null) as DayForm;
}

// So many days before the last: the day it comes to where every month
// that fires has one length, the day before the last, or a count.
function beforeLast(form: QuartzDate, facts: ScheduleFacts): DayForm {
  const lengths = facts.analyses.monthLengths;
  const count = (form as {days: number}).days;

  return lengths.length === 1 &&
    make('named', {days: [lengths[0].length - count]}) ||
    count === 1 && make('penultimate', {}) ||
    make('falling', {interval: count});
}

const quartzForms: Record<QuartzDate['kind'],
  (form: QuartzDate, facts: ScheduleFacts) => DayForm> = {
  beforeLast,
  firstWeekday() {
    return make('working', {interval: 1});
  },
  last() {
    return make('last', {});
  },
  lastWeekday() {
    return make('working', {interval: 0});
  },
  nearestWeekday(form) {
    return make('named', {days: [(form as {day: number}).day]});
  }
};

/**
 * The form of the day-of-month arm: a scheduler's form, or a plain set
 * of days judged against the days the reached months have.
 */
function dayForm(facts: ScheduleFacts, positive: boolean): DayForm {
  const arm = facts.analyses.day.date;

  return arm && arm.kind === 'quartz' ?
    quartzForms[arm.form.kind](arm.form, facts) :
    plainDays(facts, positive);
}

function ordinals(days: number[]): string {
  return `${listed(days.map(lexicon.dayOrdinal))} ${words.day}`;
}

// One day or two: a calendar date beside a month name, ordinals in words
// otherwise.
function sayNamed(form: DayForm, where: Where): string {
  return where.date ?
    `${listed(form.days)} ${where.date}` :
    `${ordinals(form.days)} ${where.tail}`;
}

// Three days or more, and every run: digits after «w dniach», a run of
// three or more with an en dash. A list of single dates needs no label.
function sayDigits(form: DayForm, where: Where): string {
  const long = form.runs.some(function isLong(run) {
    return run.length >= minRun;
  });
  const items = form.runs.flatMap(function item(run) {
    return run.length >= minRun ?
      [`${run[0]}${dash}${run[run.length - 1]}`] :
      run.map(String);
  });
  const label = `${words.in} ${words.inDays} `
    .repeat(Number(long || !where.date));

  return `${label}${listed(items)} ${where.date || where.tail}`;
}

const sayers: Record<DayKind, (form: DayForm, where: Where) => string> = {
  allBut(form, where) {
    return `${words.daily} ${words.except} ${ordinals(form.removed)} ` +
      `${where.tail}`;
  },
  digits: sayDigits,
  falling(form, where) {
    return `${words.dayFalling} ${form.interval} ${words.daysBefore} ` +
      `${words.lastDayInstrumental} ${where.of}`;
  },
  last(form, where) {
    return `${words.lastDayGenitive} ${where.of}`;
  },
  less(form, where) {
    return `${sayDays(form.base as DayForm, where)} ${words.except} ` +
      `${ordinals(form.removed)}`;
  },
  named: sayNamed,
  parity(form, where) {
    return `${words.in} ${[words.even, words.odd][form.start % 2]} ` +
      `${words.days} ${where.tail}`;
  },
  penultimate(form, where) {
    return `${words.penultimateDay} ${where.of}`;
  },
  rhythm(form, where) {
    return `${every(form.interval, units.day, false)} ${words.from} ` +
      `${ordinals([form.start])} ${where.tail}`;
  },
  stretches(form, where) {
    return `${words.in} ${[words.even, words.odd][form.start % 2]} ` +
      `${words.days} ${pieced(form.runs.map(function ends(run) {
        return `${words.from} ${run[0]} ${words.to} ${run[run.length - 1]}`;
      }))} ${where.tail}`;
  },
  working(form, where) {
    return `${words.in} ${[words.lastMasculine, words.first][form.interval]} ` +
      `${words.workingDay} (${where.workingWeek}) ${where.of}`;
  }
};

/** A day-of-month form, said with its month. */
function sayDays(form: DayForm, where: Where): string {
  return sayers[form.kind](form, where);
}

/**
 * Whether a form fuses with one named month: numbered days become a
 * calendar date, and a scheduler's form is said of the month.
 */
const fuses: Record<DayKind, boolean> = {
  allBut: false,
  digits: true,
  falling: true,
  last: true,
  less: false,
  named: true,
  parity: false,
  penultimate: true,
  rhythm: false,
  stretches: false,
  working: true
};

export {dayForm, fuses, sayDays, theseDays};
