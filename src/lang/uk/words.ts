// The word level of the Ukrainian renderer: joining lists, writing times,
// choosing «у» or «в», counted nouns, and the bookkeeping every field's
// phrases share (what a phrase costs a listener, and which candidate
// description wins).

import type {
  RangeDescription, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import lexicon from './lexicon.js';
import {shortestSpoken} from '../../core/select.js';
import type {UkrainianStyle} from './options.js';

const {words} = lexicon;

// The letters a word ends or begins with that let «у» soften to «в», and
// the beginnings before which it never does.
const VOWELS = 'аеєиіїоуюя';
const KEEPS_U = '0123456789вф';

// Past this many listed items a phrase that has to be worked out (an
// exception, a cadence with both ends named) may replace the list.
const EASY_TO_HOLD = 4;

/** A clock time; the second is written only when it is given. */
export interface Moment {
  hour: number;
  minute: number;
  second?: number | undefined;
}

/**
 * A phrase for a set of values: its words, how many things it names,
 * whether it ends in an exception («…, крім 15-го»), and whether it has to
 * be worked out, so that it may only replace a long list.
 */
export interface Phrase {
  text: string;
  length: number;
  exception: boolean;
  laboured: boolean;
}

/** A run of values or a list of them: one piece of a set. */
export type Piece = RangeDescription | ValuesDescription;

type Cadence = Extract<SetDescription, {kind: 'cadence'}>;

type Handlers<Tagged extends {kind: string}, Result> = {
  [Kind in Tagged['kind']]:
  (value: Extract<Tagged, {kind: Kind}>) => Result;
};

/** The handler for a tagged value's kind, applied to it. */
function dispatch<Tagged extends {kind: string}, Result>(
  value: Tagged,
  handlers: Handlers<Tagged, Result>
): Result {
  const handler = handlers[value.kind as Tagged['kind']] as
    (value: Tagged) => Result;

  return handler(value);
}

function present<Value>(value: Value | null): value is Value {
  return value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function identity(value: number): number {
  return value;
}

/** Words joined by single spaces; anything empty or false is left out. */
function join(parts: Array<string | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

// Items with commas between them and a word before the last.
function series(items: Array<string | number>, word: string): string {
  return [items.slice(0, -1).join(', '), items[items.length - 1]]
    .filter(Boolean)
    .join(` ${word} `);
}

/** A list: «A, B та C». */
function listed(items: Array<string | number>): string {
  return series(items, words.and);
}

/** The pieces of a set, kept apart from a list: «A, B і C». */
function pieced(items: string[]): string {
  return series(items, words.andPiece);
}

/** A number with its noun after «кожні» or «за»: «2 хвилини», «5 днів». */
function counted(
  value: number,
  forms: {few: string; many: string; one: string}
): string {
  return `${value} ${forms[lexicon.category(value)]}`;
}

// The genitive a number takes after «протягом перших»: only a number
// ending in one keeps the singular.
const genitiveFor = {
  few: 'genitiveRest',
  many: 'genitiveRest',
  one: 'genitiveOne'
} as const;

/** A number with its noun in the genitive: «30 хвилин», «21 хвилини». */
function countedGenitive(
  value: number,
  forms: {genitiveOne: string; genitiveRest: string}
): string {
  return `${value} ${forms[genitiveFor[lexicon.category(value)]]}`;
}

/** A weekday or month name in a case, or its short form. */
function nameOf<Form extends string>(
  entry: {short: string} & Record<Form, string>,
  form: Form,
  style: UkrainianStyle
): string {
  return style.short ? entry.short : entry[form];
}

// The part of the day a 12-hour time carries: the last one begun, and
// the first begins at hour 0.
function dayPartOf(hour: number): string {
  return lexicon.dayParts.filter(function begun(part) {
    return part.from <= hour;
  }).map(function wordOf(part) {
    return part.word;
  }).pop() as string;
}

/** A time as a clock writes it: «9:00», «17:30:15», «5:30 вечора». */
function clock(moment: Moment, style: UkrainianStyle): string {
  const [hour, part] = style.hour12 ?
    [(moment.hour + 11) % 12 + 1, dayPartOf(moment.hour % 24)] :
    [moment.hour, ''];
  const digits = [moment.minute, moment.second].filter(isNumber)
    .map(lexicon.twoDigits);

  return join([[hour, ...digits].join(':'), part]);
}

/** Times after their preposition, said once: «о 9:00 та 17:00». */
function at(moments: Moment[], style: UkrainianStyle): string {
  const times = listed(moments.map(function write(moment) {
    return clock(moment, style);
  }));

  return `${times.startsWith('11:') ? words.atBeforeVowel : words.at} ${times}`;
}

/** A phrase after «у», or «в» where the sounds around it allow. */
function withIn(previous: string, text: string): string {
  const [first] = text;
  const last = previous.slice(-1) || ' ';
  const soft = !KEEPS_U.includes(first) &&
    (VOWELS.includes(first) || VOWELS.includes(last));

  return `${soft ? words.inAfterVowel : words.in} ${text}`;
}

/** A stretch that closes on a boundary: «з 9:00 до 18:00». */
function upTo(from: string, to: string): string {
  return `${words.from} ${from} ${words.until} ${to}`;
}

/** A stretch whose last moment is named: «з 9:00 до 17:45 включно». */
function through(from: string, to: string): string {
  return `${upTo(from, to)} ${words.inclusive}`;
}

/** A run on the calendar: «від 1-го до 7-го числа включно». */
function calendarRun(from: string | number, to: string): string {
  return `${words.fromCalendar} ${from} ${words.until} ${to} ` +
    `${words.inclusive}`;
}

/** A plain phrase naming so many things. */
function phrase(text: string, length: number): Phrase {
  return {exception: false, laboured: false, length, text};
}

/** A phrase that may only replace a list too long to hold. */
function laboured(text: string, length: number): Phrase {
  return {...phrase(text, length), laboured: true};
}

/** A base phrase with the values taken out of it: «…, крім 15-го». */
function excepting<Spoken extends Phrase>(
  base: Spoken | null,
  removed: string,
  count: number
): Spoken | null {
  return base && {
    ...base,
    exception: true,
    laboured: true,
    length: base.length + count,
    text: `${base.text}, ${words.except} ${removed}`
  };
}

/** Several phrases as the pieces of one set. */
function combined(parts: Phrase[]): Phrase {
  const length = parts.reduce(function add(total, part) {
    return total + part.length;
  }, 0);

  return phrase(pieced(parts.map(function textOf(part) {
    return part.text;
  })), length);
}

// An exception is for a hole in the middle: a cadence that is only missing
// values at its start or its end is said with its bounds instead.
function hasNoEdgeMissing(description: SetDescription): boolean {
  return description.kind !== 'except' ||
    description.base.kind !== 'cadence' ||
    description.removed[0] > description.base.start &&
    description.removed[description.removed.length - 1] <
      description.base.last;
}

function wrapsRound(description: SetDescription): boolean {
  return description.kind === 'range' && description.from > description.to;
}

function runsForward(description: SetDescription): boolean {
  return !wrapsRound(description);
}

/**
 * The phrase that names the fewest things among the candidates that can
 * be said, the earliest on a tie; a run that wraps round its cycle is
 * tried last, so that an exception it ties with is said instead. Null
 * when none can be said.
 */
function choose<Spoken extends Phrase>(
  candidates: SetDescription[],
  say: (description: SetDescription) => Spoken | null
): Spoken | null {
  const last = candidates[candidates.length - 1];
  const items = last.kind === 'values' ? last.values.length : 0;
  const inOrder = [
    ...candidates.filter(runsForward),
    ...candidates.filter(wrapsRound)
  ];
  const sayable = inOrder.filter(hasNoEdgeMissing).map(say)
    .filter(present).filter(function worthSaying(spoken) {
      return !spoken.laboured ||
        items > EASY_TO_HOLD && spoken.length < items;
    });

  return sayable.length > 0 ? shortestSpoken(sayable) : null;
}

// The first and last value of a piece as it is said.
function endsOf(piece: Piece): number[] {
  return piece.kind === 'range' ?
    [piece.from, piece.to] :
    [piece.values[0], piece.values[piece.values.length - 1]];
}

/**
 * The pieces of a set in the order they are said: a run that wraps round
 * the cycle first, then by first value. Lists that end up side by side
 * become one list. `position` places a value in its cycle (weekdays
 * start on Monday).
 */
function ordered(
  pieces: Piece[],
  position: (value: number) => number
): Piece[] {
  function rank(piece: Piece): number {
    const [first, last] = endsOf(piece).map(position);

    return first > last ? -1 : first;
  }

  return pieces.slice().sort(function byRank(a, b) {
    return rank(a) - rank(b);
  }).reduce(function gather(said: Piece[], piece) {
    const previous = said[said.length - 1];

    if (previous && previous.kind === 'values' && piece.kind === 'values') {
      said[said.length - 1] =
        {kind: 'values', values: [...previous.values, ...piece.values]};
    }
    else {
      said.push(piece);
    }

    return said;
  }, []);
}

/** The runs of consecutive values in an ascending list. */
function runsOf(values: number[]): RangeDescription[] {
  return values.reduce(function extend(runs: RangeDescription[], value) {
    const current = runs[runs.length - 1];

    if (current && current.to + 1 === value) {
      current.to = value;
    }
    else {
      runs.push({from: value, kind: 'range', to: value});
    }

    return runs;
  }, []);
}

/** Whether a run is exactly two values, which are listed instead. */
function isPair(run: RangeDescription, cycle: number): boolean {
  return (run.to - run.from + cycle) % cycle === 1;
}

/** Whether a cadence starts at 0 and divides its cycle evenly. */
function tiles(cadence: Cadence, cycle: number): boolean {
  return cadence.start === 0 && cycle % cadence.interval === 0 &&
    cadence.last + cadence.interval === cycle;
}

export type {Cadence};
export {
  at, calendarRun, choose, clock, combined, counted, countedGenitive,
  dispatch, excepting, identity, isPair, join, laboured, listed, nameOf,
  ordered, phrase, pieced, present, runsOf, through, tiles, upTo, withIn
};
