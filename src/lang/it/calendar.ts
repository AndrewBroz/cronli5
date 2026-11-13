// The years and the months: the phrases that lead a description, and the
// ones that close it when every year or every month fires but one or two.

import type {ScheduleFacts, SetDescription} from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import {describeSet} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import type {Cadence, Exception, Form, Part, Run} from './sets.js';
import {choose, countOf, readAs, tiles} from './sets.js';
import type {Speech} from './words.js';
import {every, list, phrase, sayPieces} from './words.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

// The fewest values a cadence of hours, minutes, seconds or years has to
// be said as a cadence.
const LONG_CADENCE = 5;

/**
 * A leading phrase, and the values left out, which close the sentence
 * after «tranne».
 */
interface Placed {
  closing: string;
  lead: string;
}

const YEARS = domainOf('year');
const MONTHS = domainOf('month');

function inYears(years: number[]): string[] {
  return years.map(function inYear(year) {
    return `${words.inYear} ${year}`;
  });
}

// A run of years: one that never ends has only a start, and one that
// starts with the field has only an end, said as included.
function yearRun(run: Run): string {
  return run.open && `${words.from} ${run.from} ${words.onward}` ||
    run.from === YEARS.min &&
      `${words.untilYear} ${run.to} ${words.included}` ||
    `${words.from} ${run.from} ${words.to} ${run.to}`;
}

// Every second year is the even or the odd years; any other cadence picks
// one year in so many. One that never ends has only a start, which is not
// said of the even or odd years when it is the field's first.
function yearCadence(cadence: Cadence): string {
  const {interval, last, start} = cadence;
  const paired = interval === 2;
  const span = `${words.from} ${start} ${words.to} ${last}`;
  const onward = [
    `${words.startingFromThe} ${start}`,
    phrase(start - YEARS.min >= interval &&
      `${words.from} ${start} ${words.onward}`)
  ][Number(paired)];

  return phrase(
    paired && [words.inEvenYears, words.inOddYears][start % 2] ||
      `${words.oneYearIn} ${interval}`,
    cadence.open ? onward : span
  );
}

function longCadence(cadence: Cadence): boolean {
  return countOf(cadence) >= LONG_CADENCE;
}

/** The years: what leads, and the years left out, which close. */
function sayYears(facts: ScheduleFacts): Placed {
  const {cadencePieces, candidates} = facts.analyses;
  const form = choose(candidates.year as [], YEARS,
    {cadence: longCadence, mixed: cadencePieces.year});
  const removed = list(inYears((form as Exception).removed || []));
  const whole = form.kind === 'except' && form.base.kind === 'all';
  const sayers = {
    all() {
      return '';
    },
    cadence(cadence: Form) {
      return yearCadence(cadence as Cadence);
    },
    except(exception: Form) {
      return phrase(yearCadence((exception as Exception).base as Cadence),
        words.except, removed);
    },
    pieces(pieces: Form) {
      return sayPieces((pieces as {parts: Part[]}).parts, {
        cadence: yearCadence,
        // After a cadence a run says that it is every year, or it reads
        // as the cadence going on.
        run(run: Run, first: boolean, resumes: boolean) {
          return phrase(resumes && words.inAllTheYears, yearRun(run));
        },
        values: inYears
      });
    },
    range(run: Form) {
      return yearRun(run as Run);
    },
    values(named: Form) {
      return list(inYears((named as {values: number[]}).values));
    }
  };

  return {
    closing: phrase(whole && removed),
    lead: phrase(!whole && sayers[form.kind](form))
  };
}

/** The months, in the form they are said in. */
type Months = Form;

/** Which months are described, and how. */
interface MonthsAsked {
  // Whether a year is restricted, so that nothing may run past December.
  linear: boolean;
  // Whether every month but one or two may be said as an exception.
  plain: boolean;
  // The months to describe in place of the field's own.
  reached: number[] | null;
}

// Months are a cadence only when they tile the year at some length.
function monthCadence(cadence: Cadence): boolean {
  return longCadence(cadence) && tiles(cadence, MONTHS);
}

/** The form the months are said in. */
function chooseMonths(facts: ScheduleFacts, asked: MonthsAsked): Months {
  const limits = {cadence: monthCadence};
  const linear = asked.reached ?
    describeSet(asked.reached, MONTHS, {linear: true}) :
    candidatesAs(facts, 'month', {linear: true}) as SetDescription[];
  const read = asked.reached ?
    linear :
    readAs(facts, 'month', !asked.linear);
  const form = choose(read, MONTHS, limits);
  const nearlyAll = form.kind === 'except' && form.base.kind === 'all';

  // Every month but one or two is not a run past the end of the year.
  return asked.plain ?
    choose(nearlyAll ? linear : read, MONTHS, {...limits, plain: true}) :
    form;
}

/** How months are named in the caller's style. */
function monthWords(speech: Speech) {
  function inWord(month: number): string {
    return speech.month(month).startsWith('a') && words.inMonthBeforeA ||
      words.inMonth;
  }

  // One preposition for a list, by its first month.
  function named(months: number[]): string[] {
    const names = months.map(speech.month);

    return [`${inWord(months[0])} ${names[0]}`, ...names.slice(1)];
  }

  function run(found: Run): string {
    return `${words.fromMonth} ${speech.month(found.from)} ` +
      named([found.to])[0];
  }

  function cadence(found: Cadence): string {
    return `${every(found.interval, 'month')} ${words.startingFrom} ` +
      speech.month(found.start);
  }

  return {cadence, named, run};
}

/**
 * The months that lead and the months that close. Every month but one or
 * two closes the sentence as an exception; anything else leads.
 */
function sayMonths(form: Months, speech: Speech): Placed {
  const say = monthWords(speech);
  const removed = list(say.named((form as Exception).removed || [0]));
  const whole = form.kind === 'except' && form.base.kind === 'all';
  const sayers = {
    all() {
      return '';
    },
    cadence(cadence: Form) {
      return say.cadence(cadence as Cadence);
    },
    except(exception: Form) {
      return phrase(say.cadence((exception as Exception).base as Cadence),
        words.except, removed);
    },
    pieces(pieces: Form) {
      return sayPieces((pieces as {parts: Part[]}).parts, {
        cadence: say.cadence,
        run: say.run,
        strays: [words.then, words.then],
        values: say.named
      });
    },
    range(found: Form) {
      return say.run(found as Run);
    },
    values(found: Form) {
      return list(say.named((found as {values: number[]}).values));
    }
  };

  return {
    closing: phrase(whole && removed),
    lead: phrase(!whole && sayers[form.kind](form))
  };
}

export type {Months, Placed};
export {LONG_CADENCE, chooseMonths, longCadence, sayMonths, sayYears};
