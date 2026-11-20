// The years part (answers 4.4): a year is always a cardinal with «год» in
// its case; every second year is said by parity, any other step as an
// ordinal; a run with no end is «начиная с».

import type {ScheduleFacts} from '../../core/schedule.js';
import {domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';
import type {Piece} from './names.js';
import {clausal, joined, list, ordinal, spaced, when} from './names.js';
import type {Described, Part} from './sets.js';
import {choose, choosingOf, isAlternate} from './sets.js';

const {words, yearSteps} = lexicon;

/** The years of a pattern as they are said. */
export interface Years {
  // The years named one by one, when they are.
  named: number[];
  // Whether the years are unrestricted or one run, so that a calendar
  // date under them recurs «ежегодно».
  recurs: boolean;
  // The one year, when there is one, as it follows a month's name.
  suffix: string;
  // The years part, with the comma that closes it.
  text: string;
}

// A phrase of years: its words, whether it is the attached «начиная с …»
// (set off by commas), and whether it is a list with «и».
interface Phrase {
  attached: boolean;
  list: boolean;
  text: string;
}

const domain = domainOf('year');

// «2030 года», «2030 и 2031 годов».
function yearsGenitive(years: number[]): string {
  return spaced(list(years.map(String)),
    years.length > 1 ? words.yearsGenitive : words.yearGenitive);
}

// A stretch of years after its rate word, if it has one: both ends, the
// end alone when the start goes without saying, or the start alone when
// there is no end.
function stretchOf(lead: string, ends: {from: number; to: number;
  open?: true}, startUnsaid: boolean): Phrase {
  const bounded = startUnsaid ?
    spaced(words.through, String(ends.to), words.year) :
    spaced(words.from, String(ends.from), words.through, String(ends.to),
      words.year);
  const starting = when(!startUnsaid,
    spaced(words.startingFrom, yearsGenitive([ends.from])));

  return {
    attached: Boolean(ends.open && starting),
    list: false,
    text: ends.open ? clausal(lead, starting) : spaced(lead, bounded)
  };
}

const phrases: {[kind: string]: (description: never) => Phrase} = {
  all() {
    return {attached: false, list: false, text: ''};
  },
  cadence(description: Extract<Described, {kind: 'cadence'}>) {
    const {interval, last, start} = description;
    const alternate = isAlternate(description);
    const parity = start % 2 ? words.inOddYears : words.inEvenYears;
    const nth = spaced(words.everyNthYear,
      yearSteps[interval - 2] ?? ordinal(interval, 'feminine'), words.year);

    return stretchOf(alternate ? parity : nth,
      {from: start, open: description.open, to: last},
      alternate && start <= domain.min + 1);
  },
  cadencePieces(description: Extract<Described, {kind: 'pieces'}>) {
    return phrases.pieces(description as never);
  },
  except(description: Extract<Described, {kind: 'except'}>) {
    return {
      attached: true,
      list: false,
      text: clausal(words.everyYear,
        spaced(words.except, yearsGenitive(description.removed)))
    };
  },
  pieces(description: Extract<Described, {kind: 'pieces'}>) {
    const parts = (description.parts as Part[]).map(phraseOf);

    return {
      attached: true,
      list: true,
      text: joined(parts.map(function closed(part, at): Piece {
        const inside = part.attached && at < parts.length - 1;

        return {list: part.list, text: part.text + when(inside, ',')};
      }))
    };
  },
  range(description: Extract<Described, {kind: 'range'}>) {
    return stretchOf('', description, description.from === domain.min);
  },
  values(description: Extract<Described, {kind: 'values'}>) {
    const {values} = description;

    return {
      attached: false,
      list: values.length > 1,
      text: spaced(words.in, list(values.map(String)),
        values.length > 1 ? words.yearsPrepositional : words.yearPrepositional)
    };
  }
};

function phraseOf(description: Described): Phrase {
  return phrases[description.kind](description as never);
}

/** The years of a pattern. */
function yearsOf(facts: ScheduleFacts): Years {
  const {cadencePieces, candidates} = facts.analyses;
  const choosing = choosingOf({linear: candidates.year as never}, domain,
    {cadenceBase: false, pieces: cadencePieces.year, runsFirst: true});
  const found = choose(['all', 'few', 'exception', 'run', 'cadence', 'pieces',
    'values'], choosing);
  const phrase = phraseOf(found);
  const named = (found as Extract<Described, {kind: 'values'}>).values || [];

  return {
    named,
    recurs: found.kind === 'all' || found.kind === 'range',
    suffix: when(named.length === 1, yearsGenitive(named)),
    text: phrase.text + when(phrase.attached, ',')
  };
}

export {yearsGenitive, yearsOf};
