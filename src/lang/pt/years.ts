// The year phrase: how it stands set off or leading, and how it fuses
// with «de» after the days or a month's name, where it can.

import type {Analyses, SetDescription, ValuesDescription}
  from '../../core/schedule.js';
import type {Cadence, Plain, Rules} from './sets.js';
import {choose, withEnds} from './sets.js';
import {counted, list, spaced} from './phrases.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import {runsAs} from './names.js';

const {contractions, units, words} = lexicon;

/** The years of a schedule as the calendar part says them. */
export interface Year {
  // The phrase that follows «de» the way a date's year does.
  fused: string;
  // How far it fuses: 2 after the days or a single month's name, 1 only
  // straight after the days, 0 never.
  fuses: number;
  // The phrase set off by commas, or leading the sentence.
  lead: string;
}

const noYear: Year = {fused: '', fuses: 0, lead: ''};

// A list no longer than this is said in place of a cadence of years.
const longestList = 7;

// Every second year is said by its number being odd or even, whatever
// its length; any other cadence is listed while it is short.
const yearRules: Rules = {
  cadence: (cadence) => Number(cadence.interval === 2) ||
    withEnds(longestList)(cadence),
  domain: domainOf('year'),
  excepts: () => false,
  piecesOver: 0,
  wrap: false
};

// A cadence of years. Every second year from the start of the calendar
// with no end fuses like a year; any other names where it starts, or its
// two ends, and one that is not every second year shows its first years.
function everyFewYears(said: Cadence): Year {
  const {interval, last, start} = said;
  const {max, min} = yearRules.domain;
  const endless = last + interval > max;
  const span = endless ?
    `${words.startingFrom} ${words.from} ${start}` :
    `${words.from} ${start} ${words.to} ${last}`;

  if (interval === 2) {
    const whole = endless && start - interval < min;
    const years = `${units.year.many} ` +
      (start % 2 === 1 ? words.theOdd : words.theEven);

    return {
      fused: `${contractions.de.plural.masculine} ${years}`,
      fuses: 2 * Number(whole),
      lead: spaced(
        [`${contractions.em.plural.masculine} ${years}`, !whole && span])
    };
  }

  const shown = endless ?
    `${start}, ${start + interval}, ${start + 2 * interval}…` :
    `${start}, ${start + interval} … ${last}`;

  return {
    ...noYear,
    lead: `${words.from} ${interval} ${words.in} ` +
      `${counted(interval, units.year)} ${span} (${shown})`
  };
}

function runsOfYears(said: Plain): Year {
  return {...noYear, lead: runsAs(said, words.in, String)};
}

const yearSayers: {[Kind in Plain['kind']]: (said: never) => Year} = {
  all: () => noYear,
  cadence: everyFewYears,
  pieces: runsOfYears,
  range: runsOfYears,
  values: (said: ValuesDescription) => ({
    fused: `${words.from} ${list(said.values.map(String))}`,
    fuses: 1 + Number(said.values.length === 1),
    lead: `${words.in} ${list(said.values.map(String))}`
  })
};

/** The year phrase of a schedule; empty when every year is meant. */
function yearOf(analyses: Analyses): Year {
  const candidates = analyses.candidates.year as SetDescription[];
  const [first] = candidates;
  const named = candidates[candidates.length - 1] as ValuesDescription;
  const {said} = first.kind === 'all' ?
    {said: first} :
    choose(named.values, yearRules);

  return yearSayers[said.kind](said as never);
}

export {yearOf};
