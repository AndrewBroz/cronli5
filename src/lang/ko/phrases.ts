// A set of one clock field said in its place: as moments, as a span
// between the first and last moment that fire, as pieces, or, inside its
// unit, as the bare rhythm. The same few shapes serve hours at a minute,
// minutes in an hour, and seconds in a minute.

import type {Domain} from '../../core/schedule.js';
import {domainOf} from '../../core/specs.js';
import type {Time, Voice} from './clock.js';
import {isKnown, join, rhythm, sayTimes, span} from './clock.js';
import lexicon from './lexicon.js';
import type {Described} from './sets.js';
import {baseOf, endsOf, listOf, stepOf} from './sets.js';

const {units, words} = lexicon;

type ClockField = 'hour' | 'minute' | 'second';

/** One clock field, with the coarser and finer fields held fixed. */
export interface Level {
  domain: Domain;
  // The moment a value of the field is.
  moment(value: number): Time;
  // A zero standing alone, and a zero inside a tight list.
  nought: string;
  // What a last list of marks takes after «그리고».
  stray: string;
  // Whether a list is bare numbers under one unit, not whole moments.
  tight: boolean;
  unit: string;
  zero: string;
}

/** The words that stand before what happens inside each unit. */
export interface Lead {
  // Before marks or a span: «매시», «짝수 시», «…시대에 각각».
  before: string;
  // Before a bare rhythm: nothing, «짝수 시에», «…시대에».
  onto: string;
  // Whether the unit is a moment that recurs («3시간마다»), not hours to
  // fill: what happens in it then says where it starts and stops, and
  // marks end in «에».
  held?: boolean;
}

/** Where a bracket's exception stands. */
export interface Scope {
  // The word for "in each" when the moments are not named one by one.
  head: string;
  // The moments the exception is taken from, when they are named.
  under: Time[] | null;
}

// A bracket names the moments themselves while there are this many or
// fewer.
const fewMoments = 4;

const tables: Record<ClockField, Pick<Level, 'nought' | 'unit' | 'zero'>> = {
  hour: {nought: `0${units.hour}`, unit: units.hours, zero: '0'},
  minute: {
    nought: words.onTheHour, unit: units.minute, zero: words.onTheHour
  },
  second: {nought: `0${units.second}`, unit: units.second, zero: '0'}
};

function levelOf(field: ClockField, fixed: Time = {}): Level {
  return {
    ...tables[field],
    domain: domainOf(field),
    moment(value) {
      return {...fixed, [field]: value};
    },
    stray: [words.alsoAt, ''][
      Number(field === 'hour' || isKnown(fixed.hour))],
    tight: !Object.values(fixed).some(isKnown)
  };
}

// From the first value to the last, at the set's step.
function stretch(form: Described, level: Level, voice: Voice): string {
  const {interval, last, start} = endsOf(form, level.domain);

  return span(level.moment(start), level.moment(last),
    rhythm(interval, level.unit, voice), voice);
}

// Bare numbers under one unit: «5·20·45분», «정각·15·45분», «0·30초».
function marks(values: number[], level: Level): string {
  const last = values[values.length - 1];

  return [
    ...values.slice(0, -1).map(function shown(value) {
      return value || level.zero;
    }),
    last && `${last}${level.unit}` || level.nought
  ].join(words.listMark);
}

function listed(form: {values: number[]}, level: Level, voice: Voice):
  string {
  return level.tight ?
    marks(form.values, level) :
    sayTimes(form.values.map(level.moment), voice).join(', ');
}

// Each piece in turn, joined with «, 그리고 »; every piece starts its
// markers afresh.
function several(form: {parts: Described[]}, level: Level, voice: Voice):
  string {
  return form.parts.map(function each(part, at) {
    const stray = at > 0 && at === form.parts.length - 1 &&
      part.kind === 'values';

    return `${progress(part, level, voice)}${stray && level.stray || ''}`;
  }).join(`, ${words.also} `);
}

const sayers: {
  [kind: string]: (form: never, level: Level, voice: Voice) => string;
} = {
  all: stretch,
  cadence: stretch,
  cadencePieces: several,
  pieces: several,
  range: stretch,
  values: listed
};

/** A set as moments, spans and pieces. An exception is said of its base. */
function progress(form: Described, level: Level, voice: Voice): string {
  return sayers[form.kind](form as never, level, voice);
}

/**
 * A set inside its unit: the bare rhythm where it fills the unit from the
 * top and may be said bare, otherwise what stands for "every" and then
 * the marks, the span or the pieces.
 */
function inside(form: Described, level: Level, lead: Lead, voice: Voice):
  string {
  const base = baseOf(form);
  const step = voice.bare && !lead.held && stepOf(base, level.domain);
  const after = lead.held && base.kind === 'values' && words.at || '';

  return step ?
    join(lead.onto, rhythm(step, level.unit, voice)) :
    `${join(lead.before, progress(base, level, voice))}${after}`;
}

/**
 * What a bracket takes out of a rhythm: the moments themselves while they
 * are few, otherwise the marks under the word for "in each".
 */
function taken(removed: number[], level: Level, scope: Scope, voice: Voice):
  string[] {
  const times = (scope.under ?? []).flatMap(function each(fixed) {
    return removed.map(function at(value) {
      return {...fixed, ...level.moment(value)};
    });
  });
  const few = times.length > 0 && times.length <= fewMoments;
  const marked = removed.length > 0 &&
    [join(scope.head, progress(listOf(removed), level, voice))] || [];

  return few && sayTimes(times, voice) || marked;
}

export {inside, levelOf, progress, taken};
