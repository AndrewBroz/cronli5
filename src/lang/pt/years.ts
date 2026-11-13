// The year phrase: how it stands set off or leading, and how it fuses
// with «de» after the days or a month's name, where it can. The years do
// not cycle, so the core's own descriptions are chosen among as they
// stand: a run or a cadence with no end is marked there, and a set that
// is neither one run nor one cadence comes as pieces, as an exception, or
// as runs and cadences together.

import type {
  Analyses, CadenceDescription, CadencePieces, RangeDescription,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {counted, list, spaced} from './phrases.js';
import {denote} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import {steps} from './sets.js';

const {contractions, units, words} = lexicon;

/** The years of a schedule as the calendar part says them. */
export interface Year {
  // What follows «exceto» for the years left out.
  excepted: string[];
  // The phrase that follows «de» the way a date's year does.
  fused: string;
  // How far it fuses: 2 after the days or a single month's name, 1 only
  // straight after the days, 0 never.
  fuses: number;
  // The phrase set off by commas, or leading the sentence.
  lead: string;
}

type Described = CadencePieces | SetDescription;

type Sayer<Kind> = (said: Extract<Described, {kind: Kind}>) => Year;

type Counter<Kind> =
  (said: Extract<Described, {kind: Kind}>, size: number) => number;

const noYear: Year = {excepted: [], fused: '', fuses: 0, lead: ''};

// A list no longer than this is said in place of a cadence of years.
const longestList = 7;

// An exception replaces a list of more years than this.
const longestListKept = 4;

// Whether a cadence is said as one: every second year always is, by its
// number being odd or even; any other is listed while it is short and
// has an end.
function counts(cadence: CadenceDescription): boolean {
  return cadence.interval === 2 || Boolean(cadence.open) ||
    steps(cadence) > longestList;
}

// Whether every second year runs from the start of the calendar with no
// end, and so needs neither a start nor an end named.
function always(cadence: CadenceDescription): boolean {
  return Boolean(cadence.open) &&
    cadence.start - cadence.interval < domainOf('year').min;
}

function listed(years: number[]): Year {
  return {
    excepted: [],
    fused: `${words.from} ${list(years.map(String))}`,
    fuses: 1 + Number(years.length === 1),
    lead: `${words.in} ${list(years.map(String))}`
  };
}

// From a year on, or between two years.
function span(start: number, last: number, open: boolean): string {
  return open ?
    `${words.startingFrom} ${words.from} ${start}` :
    `${words.from} ${start} ${words.to} ${last}`;
}

// A cadence of years. Every second year from the start of the calendar
// with no end fuses like a year; any other names where it starts, or its
// two ends, and one that is not every second year shows its first years.
function everyFewYears(said: CadenceDescription): Year {
  const {interval, last, start} = said;
  const open = Boolean(said.open);
  const reach = span(start, last, open);

  if (!counts(said)) {
    return listed(denote(said, domainOf('year')));
  }

  if (interval === 2) {
    const years = `${units.year.many} ` +
      (start % 2 === 1 ? words.theOdd : words.theEven);

    return {
      excepted: [],
      fused: `${contractions.de.plural.masculine} ${years}`,
      fuses: 2 * Number(always(said)),
      lead: spaced([
        `${contractions.em.plural.masculine} ${years}`,
        !always(said) && reach
      ])
    };
  }

  const shown = open ?
    `${start}, ${start + interval}, ${start + 2 * interval}…` :
    `${start}, ${start + interval} … ${last}`;

  return {
    ...noYear,
    lead: `${words.from} ${interval} ${words.in} ` +
      `${counted(interval, units.year)} ${reach} (${shown})`
  };
}

// A run names its start, and its end where it has one. (A run of two
// years names as many things as the two listed, and the list wins.)
function runOfYears(said: RangeDescription): Year {
  return {...noYear, lead: span(said.from, said.to, Boolean(said.open))};
}

function inPieces(said: {parts: Described[]}): Year {
  return {...noYear, lead: list(said.parts.map((part) => say(part).lead))};
}

const sayers: {[Kind in Described['kind']]: Sayer<Kind>} = {
  all: () => noYear,
  cadence: everyFewYears,
  cadencePieces: inPieces,
  except: (said) => ({
    ...say(said.base),
    excepted: [`${words.in} ${list(said.removed.map(String))}`]
  }),
  pieces: inPieces,
  range: runOfYears,
  values: (said) => listed(said.values)
};

function say(said: Described): Year {
  const sayer = sayers[said.kind] as Sayer<Described['kind']>;

  return sayer(said);
}

// How many things each description names: a year or an end is one, a
// start with no end is one, a cadence adds its interval, and an exception
// is its base and each year excepted. An exception is only for a set of
// more than four years.
const counters: {[Kind in Described['kind']]: Counter<Kind>} = {
  all: () => 0,
  cadence(said) {
    return counts(said) ?
      1 + Number(!always(said)) + Number(!said.open) :
      steps(said);
  },
  cadencePieces: (said, size) => said.parts.reduce(
    (sum, part) => sum + named(part, size), 0),
  except(said, size) {
    return size > longestListKept ?
      named(said.base, size) + said.removed.length :
      Infinity;
  },
  pieces: (said, size) => said.parts.reduce(
    (sum, part) => sum + named(part, size), 0),
  range: (said) => 1 + Number(!said.open),
  values: (said) => said.values.length
};

function named(said: Described, size: number): number {
  const count = counters[said.kind] as Counter<Described['kind']>;

  return count(said, size);
}

/**
 * The year phrase of a schedule; empty when every year is meant. Of the
 * descriptions the core offers, the one that names the fewest things is
 * said, and a list wins a tie.
 */
function yearOf(analyses: Analyses): Year {
  const candidates = analyses.candidates.year as SetDescription[];
  const values = candidates[candidates.length - 1] as ValuesDescription;
  const size = values.kind === 'values' ? values.values.length : 0;
  const offered: Described[] = [
    values,
    ...candidates.slice(0, -1),
    ...[analyses.cadencePieces.year].filter(
      (found): found is CadencePieces => found !== null)
  ];
  const [best] = offered.map((said) => ({count: named(said, size), said}))
    .sort((a, b) => a.count - b.count);

  return say(best.said);
}

export {yearOf};
