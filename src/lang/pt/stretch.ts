// The minutes of the hour and the seconds of the minute, said the same
// way: a position or several, a run, pieces, or a cadence.

import type {RangeDescription, ValuesDescription}
  from '../../core/schedule.js';
import type {Cadence, Plain} from './sets.js';
import type {Unit} from './phrases.js';
import {counted, led, list} from './phrases.js';
import lexicon from './lexicon.js';

const {articles, contractions, words} = lexicon;

// How many minutes an hour has, and seconds a minute.
const sixty = 60;

type Sayer<Kind> = (
  said: Extract<Plain, {kind: Kind}>,
  unit: Unit,
  sep: string,
  every: string
) => string;

/** Whether a cadence of minutes or seconds fills its cycle from zero. */
function tiles(cadence: Cadence): boolean {
  return cadence.start === 0 && cadence.last + cadence.interval === sixty;
}

/**
 * Things of a unit by number or name: «no minuto 30», «nos minutos 5, 20
 * e 45», «nos dias 1º e 15».
 */
function numbered(values: Array<number | string>, unit: Unit): string {
  const {em} = contractions;

  return values.length === 1 ?
    `${em.singular.masculine} ${unit.one} ${values[0]}` :
    `${em.plural.masculine} ${unit.many} ${list(values.map(String))}`;
}

// Both ends by number: «do minuto 10 ao 40».
function ends(from: number, to: number, unit: Unit): string {
  return `${contractions.de.singular.masculine} ${unit.one} ${from} ` +
    `${contractions.a.singular.masculine} ${to}`;
}

// A run, by how much of the cycle it takes when it starts or ends it.
function reach(range: RangeDescription, unit: Unit): string {
  const during = `${words.during} ${articles.plural.masculine}`;

  if (range.from === 0) {
    return `${during} ${words.first} ${counted(range.to + 1, unit)}`;
  }

  return range.to === sixty - 1 ?
    `${during} ${words.last} ${counted(sixty - range.from, unit)}` :
    ends(range.from, range.to, unit);
}

const sayers: {[Kind in Plain['kind']]: Sayer<Kind>} = {
  all: (said, unit, sep, every) => every,
  cadence: (said, unit, sep) =>
    `${words.each} ${counted(said.interval, unit)}` + (tiles(said) ?
      '' :
      sep + ends(said.start, said.last, unit)),
  pieces: (said, unit, sep, every) => led(said.parts.map(
    (part) => pieceSayers[part.kind](part as never, unit, every))),
  range: (said, unit, sep, every) => `${every} ${reach(said, unit)}`,
  values: (said, unit) => numbered(said.values, unit)
};

const pieceSayers = {
  range: (part: RangeDescription, unit: Unit, every: string) =>
    ({lead: every, text: reach(part, unit)}),
  values: (part: ValuesDescription, unit: Unit) =>
    ({lead: '', text: numbered(part.values, unit)})
};

/**
 * A set of minutes or seconds inside its cycle. `every` is what leads a
 * run («a cada minuto»); `sep` stands between a cadence and its two ends.
 */
function stretch(said: Plain, unit: Unit, sep: string, every: string): string {
  const say = sayers[said.kind] as Sayer<Plain['kind']>;

  return say(said, unit, sep, every);
}

/** Whether a set is every value or a cadence that needs no ends. */
function continuous(said: Plain): boolean {
  return said.kind === 'all' || said.kind === 'cadence' && tiles(said);
}

export {continuous, numbered, stretch, tiles};
