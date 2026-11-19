// The months, which stand in the frame after the years (answers 3 and
// 4.4), and how each form of them takes a date.

import {
  type ExceptForm, type Form, type PiecesForm, type RangeForm,
  type Reading, type Sayers, formOf, sayBy
} from './forms.js';
import type {
  ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {candidatesAs, describeSet, domainOf} from '../../core/index.js';
import {list, series, spanText} from './write.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;
const month = units.month.position;

/**
 * How a set of months takes a date: directly, after a particle, or after
 * a comma with "every month" kept in the day part.
 */
export type Fuse = 'direct' | 'each' | 'none' | 'of';

/** The months as the frame says them. */
export interface MonthsSaid {
  closing: string;
  fuse: Fuse;
  text: string;
}

const monthReading: Reading = {
  domain: domainOf('month'),
  pieces: true,
  run: 3,
  steps(cadence) {
    return cadence.interval === 2 && cadence.fills;
  }
};

function noMonths(): MonthsSaid {
  return {closing: '', fuse: 'none', text: ''};
}

function oneMonth(form: Form): MonthsSaid {
  return {closing: '', fuse: 'direct', text: form.values[0] + month};
}

// Every second month is the odd or the even months, and takes a date as
// one month does.
function monthParity(form: Form): MonthsSaid {
  return {
    closing: '',
    fuse: 'direct',
    text: [words.evenMonths, words.oddMonths][form.values[0] % 2]
  };
}

function monthList(form: Form): MonthsSaid {
  return {
    closing: '',
    fuse: 'of',
    text: list(form.values.map(String)) + month
  };
}

function monthRuns(form: PiecesForm | RangeForm): MonthsSaid {
  const spans = form.kind === 'range' ? [form] : form.spans;

  return {
    closing: '',
    fuse: 'each',
    text: series(spans.map(function say(span) {
      return spanText(span, month, words.nextYear);
    }), words.and)
  };
}

function monthsBut(form: ExceptForm): MonthsSaid {
  return {...noMonths(), closing: list(form.removed.map(String)) + month};
}

const monthSayers: Sayers<null, MonthsSaid> = {
  all: noMonths,
  cadence: monthParity,
  except: monthsBut,
  list: monthList,
  one: oneMonth,
  pieces: monthRuns,
  range: monthRuns
};

/** Whether a field's set is narrower than the whole field. */
function isRestricted(sets: SetDescription[] | null): boolean {
  return sets === null || sets[0].kind !== 'all';
}

/**
 * The months of a pattern: its own, or, where the date skips some of
 * them, only those the date fires in.
 */
function monthsOf(facts: ScheduleFacts, narrowed: boolean): MonthsSaid {
  const {candidates, monthLengths} = facts.analyses;
  const linear = isRestricted(candidates.year);
  const fired = [...new Set(monthLengths.flatMap(function each(group) {
    return group.months;
  }))].sort(function ascending(a, b) {
    return a - b;
  });
  const sets = narrowed ?
    describeSet(fired, monthReading.domain, {linear}) :
    candidatesAs(facts, 'month', {linear}) as SetDescription[];

  return sayBy(monthSayers, formOf(sets, monthReading), null);
}

export {isRestricted, monthsOf};
