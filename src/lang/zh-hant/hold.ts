// What a unit holds: the minutes of an hour, the seconds of a minute. A
// set of them is said either as a rate ("every 5 minutes") or as
// positions inside the unit (05、20、45分; 整點至29分，每分鐘一次), and
// whatever names the unit before them decides how the two are joined on
// (answers 4.1 and 4.2).

import type {
  AddedForm, CadenceForm, ExceptForm, Form, PiecesForm, RangeForm, Sayers
} from './forms.js';
import {type RateUnit, excepting, list, rate, series} from './write.js';
import lexicon from './lexicon.js';
import {sayBy} from './forms.js';

const {twoDigits, units, words} = lexicon;

/** Which end of a stretch a position stands at. */
export type Edge = 'first' | 'last';

/** The seconds a named minute carries at each end; null for none. */
export type Carried = Record<Edge, number | null>;

/** A position's digits, and the unit a list of such says once. */
export interface Name {
  text: string;
  unit: string;
}

/** How the positions of one unit are named. */
export interface Namer {
  // What stands before a position named alone.
  alone: string;
  name(value: number, edge: Edge): Name;
}

/** How a set is said inside the unit that holds it. */
export interface Holding {
  // Whether a cadence is said as a bare rate.
  bare(cadence: CadenceForm): boolean;
  // What closes a run before its rate: the word for "within" before a
  // plain rate, a comma before anything longer.
  closing: string;
  // The rate between the two ends of a run.
  each: string;
  // The rate when every position fires.
  every: string;
  // How positions left out are named.
  gaps: Namer;
  namer: Namer;
  // What closes a rate: the word for "once", or nothing.
  once: string;
  // What names the holding unit before a position left out of a rate.
  prefix: string;
  unit: RateUnit;
}

/** What was said: a rate, or positions for the holding unit to take. */
export interface Held {
  rate: boolean;
  text: string;
}

const nothingCarried: Carried = {first: null, last: null};
const minuteUnit = units.minute.position;

/**
 * Minutes as positions: two digits, minute zero as the given name, and
 * minute and second together where a second is carried.
 */
function minuteNamer(zero: Name, carried: Carried): Namer {
  return {
    alone: '',
    name(value, edge) {
      const second = carried[edge];

      if (second !== null) {
        return {
          text: twoDigits(value) + minuteUnit + twoDigits(second) +
            units.second.position,
          unit: ''
        };
      }

      return value === 0 ? zero : {text: twoDigits(value), unit: minuteUnit};
    }
  };
}

/** Seconds as positions: unpadded, and an ordinal when one stands alone. */
const secondNamer: Namer = {
  alone: words.ordinal,
  name(value) {
    return {text: String(value), unit: units.second.position};
  }
};

/** Positions listed, their unit said once after the last. */
function named(namer: Namer, values: number[]): string {
  const names = values.map(function nameOf(value) {
    return namer.name(value, 'first');
  });
  const [last = {text: '', unit: ''}] = names.slice(-1);
  const lone = values.length === 1 ? namer.alone : '';

  return lone + list(names.map(function textOf(name) {
    return name.text;
  })) + last.unit;
}

function at(namer: Namer, value: number, edge: Edge): string {
  const name = namer.name(value, edge);

  return name.text + name.unit;
}

function holdAll(form: Form, how: Holding): Held {
  return {rate: true, text: how.every};
}

function holdList(form: Form, how: Holding): Held {
  return {rate: false, text: named(how.namer, form.values)};
}

// A window inside the unit closes on the word for "within" and takes its
// rate directly, so that the rate is heard as the window's own.
function holdRange(form: RangeForm, how: Holding): Held {
  return {
    rate: false,
    text: at(how.namer, form.from, 'first') + words.to +
      at(how.namer, form.to, 'last') + how.closing + how.each
  };
}

// A cadence that the context lets stand bare is a rate. Any other is its
// two ends and its rate, or a list when it has four values or fewer.
function holdCadence(form: CadenceForm, how: Holding): Held {
  const said = rate(how.unit, form.interval, how.once);

  if (how.bare(form)) {
    return {rate: true, text: said};
  }

  return form.values.length > 4 ?
    {
      rate: false,
      text: at(how.namer, form.start, 'first') + words.to +
        at(how.namer, form.last, 'last') + words.within + said
    } :
    holdList(form, how);
}

// Runs first, then their rate, then the single positions after it, so
// that no single position stands under the rate.
function holdPieces(form: PiecesForm, how: Holding): Held {
  const ends = form.spans.map(function endsOf(span) {
    return {
      from: at(how.namer, span.from, 'first'),
      to: at(how.namer, span.to, 'last'),
      value: span.from
    };
  });
  const runs = ends.filter(function isRun(end) {
    return end.from !== end.to;
  }).map(function between(end) {
    return end.from + words.to + end.to;
  });
  const lone = named(how.namer, ends.filter(function isAlone(end) {
    return end.from === end.to;
  }).map(function valueOf(end) {
    return end.value;
  }));

  return {
    rate: false,
    text: [
      series(runs, words.and) + how.closing + how.each,
      ...[lone].filter(Boolean).map(function added(text) {
        return words.alsoAt + text;
      })
    ].join(words.comma)
  };
}

// What names the holding unit before positions that follow a rate.
function outsideOf(base: Held, how: Holding): string {
  return base.rate ? how.prefix : '';
}

// A cadence, and then the one or two positions beside it: after a rate
// they name the unit that holds them.
function holdAdded(form: AddedForm, how: Holding): Held {
  const base = held(form.base, how);

  return {
    ...base,
    text: base.text + words.comma + words.alsoAt + outsideOf(base, how) +
      named(how.namer, form.added)
  };
}

function holdExcept(form: ExceptForm, how: Holding): Held {
  const base = held(form.base, how);

  return {
    ...base,
    text: base.text +
      excepting(outsideOf(base, how) + named(how.gaps, form.removed))
  };
}

const holders: Sayers<Holding, Held> = {
  added: holdAdded,
  all: holdAll,
  cadence: holdCadence,
  except: holdExcept,
  list: holdList,
  one: holdList,
  pieces: holdPieces,
  range: holdRange
};

/** A set said inside the unit that holds it. */
function held(form: Form, how: Holding): Held {
  return sayBy(holders, form, how);
}

/** What was held, joined on in the way its kind is. */
function told(said: Held, asRate: string, asPositions: string): string {
  return (said.rate ? asRate : asPositions) + said.text;
}

export {held, minuteNamer, named, nothingCarried, secondNamer, told};
