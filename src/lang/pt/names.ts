// Month and weekday names in the style in force, and runs and lists of
// named things.

import type {Plain} from './sets.js';
import type {PortugueseStyle} from './options.js';
import type {WeekdayName} from './lexicon.js';
import lexicon from './lexicon.js';
import {list} from './phrases.js';

const {months, weekdays, words} = lexicon;

// Which written form a weekday takes alone and in the plural: as spoken,
// with «-feira», or short. Short takes precedence.
const weekdayForms: Array<Record<'many' | 'one', keyof WeekdayName>> = [
  {many: 'spokenPlural', one: 'spoken'},
  {many: 'fullPlural', one: 'full'},
  {many: 'short', one: 'short'},
  {many: 'short', one: 'short'}
];

function monthName(month: number, style: PortugueseStyle): string {
  return months[month][style.short ? 'short' : 'full'];
}

/** A weekday by cron's number, alone (`one`) or recurring (`many`). */
function weekdayName(
  weekday: number,
  count: 'many' | 'one',
  style: PortugueseStyle
): string {
  const form = weekdayForms[Number(style.feira) + 2 * Number(style.short)];

  return weekdays[weekday][form[count]];
}

type Namer = (value: number) => string;

type RunSayer<Kind> =
  (said: Extract<Plain, {kind: Kind}>, word: string, name: Namer) => string;

// The kinds of description a field without a cadence is said in.
type Uncounted = Exclude<Plain['kind'], 'cadence'>;

const runSayers: {[Kind in Uncounted]: RunSayer<Kind>} = {
  all: () => '',
  pieces: (said, word, name) => list(said.parts.map(
    (part) => runsAs(part, word, name))),
  range: (said, word, name) =>
    `${words.from} ${name(said.from)} ${words.to} ${name(said.to)}`,
  values: (said, word, name) => `${word} ${list(said.values.map(name))}`
};

/**
 * Months or years as runs and lists: a run is «de junho a agosto», and a
 * list takes the given word, «de» after a noun and «em» standing alone.
 * Every value is nothing said. A cadence is never said this way.
 */
function runsAs(said: Plain, word: string, name: Namer): string {
  const say = runSayers[said.kind as Uncounted] as RunSayer<Uncounted>;

  return say(said as never, word, name);
}

export {monthName, runsAs, weekdayName};
