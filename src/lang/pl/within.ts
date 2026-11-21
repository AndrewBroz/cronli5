// A set of minutes said inside every hour, or of seconds inside every
// minute: distances from the full hour, runs and rhythms between two of
// them, and what is missing as the moment that falls there.

import type {Unit} from './lexicon.js';
import type {Form, Kind} from './forms.js';
import {counted, distances, every, listed, units, upTo, words}
  from './text.js';

const maxClocks = 4;

/** The words for something taken away from a rhythm. */
export interface Gap {
  // «oprócz», «ale nie».
  lead: string;
  // The noun for what is missing, one and several, before a distance.
  one: string;
  many: string;
  // The same before clock times; empty where a clock time needs none.
  atClock: string[];
}

/**
 * The unit a set is said inside: the words for its start, and how a
 * later mention points back at it.
 */
export interface Anchor {
  unit: Unit;
  short: boolean;
  // The rhythm of every value: «co minutę», or a finer one in its place.
  each: string;
  // After «po»: «każdej pełnej godzinie».
  past: string;
  // After «od»: «każdej pełnej godziny», «początku każdej minuty».
  from: string;
  // The start as a moment: «o każdej pełnej godzinie».
  on: string;
  // The start again, after it was named with `past` and with `from`.
  itPast: string;
  itFrom: string;
  // What follows a rhythm that fills the unit: « przez całą minutę».
  whole: string;
  // What the end of a run gains when a finer rhythm fills its last
  // value: « i 59 sekund».
  endTail: string;
  gap: Gap;
}

// The anchor, and how the next mention of its start is worded.
interface Voice {
  anchor: Anchor;
  tail: string;
  later: string;
}

const except: Gap = {
  atClock: ['', ''],
  lead: words.except,
  many: words.momentsFalling,
  one: words.momentFalling
};

const butNot: Gap = {
  atClock: [
    `${words.minuteStartingAt} ${words.at}`,
    `${words.minutesStartingAt} ${words.at}`
  ],
  lead: words.butNot,
  many: words.minutesStartingAt,
  one: words.minuteStartingAt
};

function voiceOf(anchor: Anchor): Voice {
  return {anchor, later: anchor.itPast,
    tail: `${words.minutesPast} ${anchor.past}`};
}

// «po każdej pełnej godzinie» the first time, «po niej» after it.
function past(voice: Voice): string {
  const said = voice.tail;

  voice.tail = voice.later;

  return said;
}

function named(voice: Voice, start: string): string {
  voice.later = voice.anchor.itFrom;
  voice.tail = voice.anchor.itFrom;

  return start;
}

function numbered(count: number, voice: Voice): string {
  return counted(count, voice.anchor.unit, voice.anchor.short);
}

// «co minutę», «co 15 minut».
function beat(form: Form, voice: Voice): string {
  const {anchor} = voice;

  return [every(form.interval, anchor.unit, anchor.short), anchor.each][
    Number(form.interval === 1)];
}

function rhythm(form: Form, voice: Voice): string {
  return `${beat(form, voice)}${voice.anchor.whole}`;
}

// «5, 20 i 45 minut po każdej pełnej godzinie»; the full hour is never
// «0 minut po»: «o każdej pełnej godzinie oraz 15 i 45 minut później».
// Before further pieces the full hour and what follows it are items of
// one series, parted by a comma.
function moments(form: Form, voice: Voice, joint = ` ${words.andPieces} `):
  string {
  const {anchor} = voice;
  const zero = form.values[0] === 0;
  const rest = form.values.slice(Number(zero));
  const [head, after] = zero ?
    [named(voice, anchor.on), words.later] :
    ['', past(voice)];

  return [
    head,
    rest.length > 0 &&
      `${distances(rest, anchor.unit, anchor.short)} ${after}`
  ].filter(Boolean).join(joint);
}

// «od każdej pełnej godziny do 29 minut po niej», «od 10 do 40 minut po
// każdej pełnej godzinie». Both ends are in the genitive.
function between(form: Form, voice: Voice): string {
  const {anchor} = voice;
  const start = form.from === 0 ?
    named(voice, anchor.from) :
    [String(form.from), upTo(form.from, anchor.unit, anchor.short)][
      Number(anchor.endTail !== '')];

  return `${words.from} ${start} ${words.to} ` +
    `${upTo(form.to, anchor.unit, anchor.short)}${anchor.endTail} ` +
    `${past(voice)}`;
}

function stretch(form: Form, voice: Voice): string {
  return `${beat(form, voice)} ${between(form, voice)}`;
}

// A rhythm with a seam says where it stops; a seamless one where it
// starts.
function cadence(form: Form, voice: Voice): string {
  return form.seamless ?
    `${beat(form, voice)}, ${words.starting} ` +
      `${numbered(form.from, voice)} ${past(voice)}` :
    stretch(form, voice);
}

// «oprócz chwili wypadającej 29 minut po każdej pełnej godzinie»; the
// full hour and another minute are each their own moment.
function gaps(removed: number[], voice: Voice): string {
  const {anchor} = voice;
  const {gap} = anchor;
  const zero = removed[0] === 0;
  const rest = removed.slice(Number(zero));
  const head = zero && `${gap.one} ${named(voice, anchor.on)}`;
  const tail = rest.length > 0 &&
    `${[gap.one, gap.many][Number(rest.length > 1)]} ` +
    `${distances(rest, anchor.unit, anchor.short)} ${past(voice)}`;

  return `${gap.lead} ` +
    `${[head, tail].filter(Boolean).join(` ${words.and} `)}`;
}

function lacking(form: Form, voice: Voice): string {
  const base = say(form.base as Form, voice);

  return `${base}, ${gaps(form.removed, voice)}`;
}

function listOf(form: Form, voice: Voice): string {
  return moments(form, voice);
}

// What joins a piece to the one before it. A distance after a run would
// be heard as a second end of the run, so it follows «a potem»; a clause
// that ends in a participle is closed by a comma before «oraz».
function link(part: Form, before: Form, last: boolean): string {
  const afterRun = before.kind === 'run' &&
    (part.kind === 'one' || part.kind === 'list');
  const then = [words.andThenOnce, words.andThen][
    Number(part.values.length > 1)];
  const joined = [', ', ` ${words.andPieces} `][Number(last)];

  return afterRun && `, ${then} ` ||
    `${','.repeat(Number(before.seamless && last))}${joined}`;
}

// Pieces in ascending order. The rhythm of a run is said once for runs
// that follow one another.
function pieces(form: Form, voice: Voice): string {
  return form.parts.reduce(function add(text, part, at) {
    const before = form.parts[at - 1];
    const shared = at > 0 && before.kind === 'run' && part.kind === 'run';
    const series = at === 0 && part.kind === 'list' &&
      moments(part, voice, ', ');
    const said = shared && between(part, voice) || series ||
      say(part, voice);

    return at > 0 ?
      `${text}${link(part, before, at === form.parts.length - 1)}${said}` :
      said;
  }, '');
}

const sayers: Record<Kind, (form: Form, voice: Voice) => string> = {
  all: rhythm,
  allBut: lacking,
  cadence,
  cadencePieces: pieces,
  less: lacking,
  list: listOf,
  one: listOf,
  pieces,
  run: stretch,
  tiling: rhythm,
  wrap: stretch
};

function say(form: Form, voice: Voice): string {
  return sayers[form.kind](form, voice);
}

/** A set as it is said inside every unit the anchor names. */
function within(form: Form, anchor: Anchor): string {
  return say(form, voiceOf(anchor));
}

/** What is missing, as the moments that fall in every unit, after a comma. */
function momentsLacking(removed: number[], anchor: Anchor): string {
  return removed.length > 0 && `, ${gaps(removed, voiceOf(anchor))}` || '';
}

/**
 * What is missing from a rhythm, after a comma: up to four clock times
 * are named, more are the moment that falls in every unit. Nothing when
 * nothing is missing.
 */
function lacks(times: string[], removed: number[], anchor: Anchor): string {
  const {gap} = anchor;
  const clocks = [
    gap.lead, gap.atClock[Number(times.length > 1)], listed(times)
  ].filter(Boolean).join(' ');

  return times.length > maxClocks ?
    momentsLacking(removed, anchor) :
    `, ${clocks}`.repeat(Number(times.length > 0));
}

/** How the words of an anchor are set: the style, and a finer rhythm. */
export interface Tone {
  short: boolean;
  each: string;
  endTail: string;
  gap: Gap;
}

/** The hours, under the name given to each of them. */
function hours(locative: string, genitive: string, tone: Tone): Anchor {
  return {
    ...tone,
    from: genitive,
    itFrom: words.minutesPastIt,
    itPast: words.minutesPastIt,
    on: `${words.at} ${locative}`,
    past: locative,
    unit: units.minute,
    whole: ''
  };
}

/** Every full hour: «każdej pełnej godzinie». */
function fullHours(tone: Tone): Anchor {
  return hours(words.eachFullHour, words.eachFullHourGenitive, tone);
}

/** One hour, after «za każdym razem»: «pełnej godzinie». */
function theHour(tone: Tone): Anchor {
  return {
    ...hours(words.fullHour, words.fullHourGenitive, tone),
    whole: ` ${words.wholeHour}`
  };
}

/** Every minute of the open hour, for the seconds inside it. */
function eachMinute(short: boolean): Anchor {
  return {
    each: every(1, units.second, short),
    endTail: '',
    from: words.startOfEachMinute,
    gap: except,
    itFrom: words.secondsPastIt,
    itPast: words.minutesPastIt,
    on: words.atStartOfEachMinute,
    past: words.eachFullMinute,
    short,
    unit: units.second,
    whole: ''
  };
}

/** One minute, after «za każdym razem». */
function theMinute(short: boolean): Anchor {
  return {
    ...eachMinute(short),
    from: words.startOfMinute,
    on: words.atStartOfMinute,
    past: words.fullMinute,
    whole: ` ${words.wholeMinute}`
  };
}

export {butNot, eachMinute, except, fullHours, hours, lacks, momentsLacking,
  theHour, theMinute, within};
