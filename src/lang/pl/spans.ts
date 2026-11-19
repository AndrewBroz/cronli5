// A set said in real clock times: moments after «o», and stretches from
// the first moment that fires to the last, each under its rhythm.

import type {Unit} from './lexicon.js';
import type {Form, Kind} from './forms.js';
import type {Anchor} from './within.js';
import {lacks} from './within.js';
import {every, listed, pieced, words} from './text.js';

/** Which end of a stretch a clock time is, or a moment standing alone. */
const role = {at: 2, from: 0, to: 1};

/** How the values of one set become clock times, and their rhythm. */
export interface Dial {
  // The rhythm of every value: «co godzinę», «co minutę».
  each: string;
  unit: Unit;
  short: boolean;
  clock(value: number, as: number): string;
}

// Moments named one by one, or a stretch between two of them.
interface Stretch {
  at: string[];
  every: string;
  from: string;
  to: string;
}

function momentsOf(form: Form, dial: Dial): Stretch[] {
  return [{
    at: form.values.map(function time(value) {
      return dial.clock(value, role.at);
    }),
    every: '',
    from: '',
    to: ''
  }];
}

function stretchOf(form: Form, dial: Dial): Stretch[] {
  return [{
    at: [],
    every: [every(form.interval, dial.unit, dial.short), dial.each][
      Number(form.interval === 1)],
    from: dial.clock(form.from, role.from),
    to: dial.clock(form.to, role.to)
  }];
}

function partsOf(form: Form, dial: Dial): Stretch[] {
  return form.parts.flatMap(function part(piece) {
    return stretchesOf(piece, dial);
  });
}

function baseOf(form: Form, dial: Dial): Stretch[] {
  return stretchesOf(form.base as Form, dial);
}

const makers: Record<Kind, (form: Form, dial: Dial) => Stretch[]> = {
  all: stretchOf,
  allBut: stretchOf,
  cadence: stretchOf,
  cadencePieces: partsOf,
  less: baseOf,
  list: momentsOf,
  one: momentsOf,
  pieces: partsOf,
  run: stretchOf,
  tiling: stretchOf,
  wrap: stretchOf
};

function stretchesOf(form: Form, dial: Dial): Stretch[] {
  return makers[form.kind](form, dial);
}

// «o 9:45», «co minutę od 9:00 do 9:29»; a rhythm is said once for the
// stretches that share it and follow one another.
function saidStretches(
  stretches: Stretch[],
  joined: (items: string[]) => string
): string {
  return joined(stretches.map(function say(stretch, at) {
    const before = stretches[at - 1] || {every: ''};
    const rhythm = stretch.every !== before.every && stretch.every;

    return stretch.at.length > 0 && `${words.at} ${listed(stretch.at)}` ||
      [rhythm, words.from, stretch.from, words.to, stretch.to]
        .filter(Boolean).join(' ');
  }));
}

/** The values an exception takes from inside the stretch that is said. */
function missing(form: Form): number[] {
  return form.removed.filter(function inside(value) {
    return value > form.values[0] &&
      value < form.values[form.values.length - 1];
  });
}

/** A window from one clock time to another: «od 9:00 do 17:45». */
function windows(ends: string[][], rhythm: string): string {
  return saidStretches(ends.map(function window([from, to]) {
    return {at: [], every: rhythm, from, to};
  }), pieced);
}

/**
 * A set said in the clock times of each of several units (the minutes of
 * each hour named, the seconds of each minute named), with what is
 * missing inside. `real` is false when what is missing had to be said as
 * the moment that falls in every unit.
 */
function inEach(form: Form, dials: Dial[], anchor: Anchor):
  {real: boolean; text: string} {
  const each = dials.map(function stretches(dial) {
    return stretchesOf(form, dial);
  });
  const flat = dials.length === 1 || each.every(function single(stretches) {
    return stretches.length === 1;
  });
  const said = flat ?
    saidStretches(each.flat(), pieced) :
    pieced(each.map(function unit(stretches) {
      return saidStretches(stretches, listed);
    }));
  const gone = dials.flatMap(function absent(dial) {
    return missing(form).map(function time(value) {
      return dial.clock(value, role.at);
    });
  });

  return {
    real: gone.length <= 4,
    text: `${said}${lacks(gone, missing(form), anchor)}`
  };
}

export {inEach, windows};
