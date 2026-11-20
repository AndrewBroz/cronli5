// Minutes named inside the hour and seconds inside the minute (answers,
// "Minutes inside the hour"): ordinals, «с … по …», the unit's first value
// as its start, a leading stretch as a length.

import {domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';
import {
  amount, clausal, fromWord, joined, list, ordinal, spaced, when
} from './names.js';
import type {Described, Part} from './sets.js';
import {isBare} from './sets.js';

const {ordinalUnits, units, words} = lexicon;

/** How the values of a minute or a second are said in one place. */
export interface Inside {
  // Whether a cadence that tiles the unit from its start is said bare.
  bareRhythm: boolean;
  // Whether a cadence from the unit's start says «с начала» and its scope.
  fromStart: boolean;
  // Whether a leading stretch said as a length takes the scope.
  lengthScoped: boolean;
  // What the values are values of: «каждого часа», «первой минуты».
  scope: string;
  // The noun «в начале» takes when no scope follows: «в начале минуты».
  startNoun: string;
  unit: 'minute' | 'second';
  // What follows the rate word when every value fires: «в течение минуты».
  wholeRest: string;
}

/**
 * A phrase, whether its scope stands inside it and not at its end, and
 * what follows its rate word.
 */
export interface Scoped {
  afterRate: string;
  holdsScope: boolean;
  text: string;
}

// A phrase as its rate word and the rest, so that parts which share a
// rate word say it once.
interface Phrase {
  holdsScope: boolean;
  lead: string;
  list: boolean;
  tail: string;
}

const rates = {minute: words.everyMinute, second: words.everySecond};

function fullText(phrase: Phrase): string {
  return spaced(phrase.lead, phrase.tail);
}

// «С 10-й по 40-ю минуту».
function stretch(from: number, to: number, mode: Inside): string {
  return spaced(fromWord(from === 2), ordinal(from, 'feminine'),
    words.through, ordinal(to, 'feminineAccusative'),
    ordinalUnits[mode.unit].accusative);
}

// «По 54-ю секунду», the end of a step from the unit's start.
function upTo(to: number, mode: Inside): string {
  return spaced(words.through, ordinal(to, 'feminineAccusative'),
    ordinalUnits[mode.unit].accusative);
}

const phrases: {
  [kind: string]: (description: never, mode: Inside) => Phrase;
} = {
  all(description: Described, mode: Inside) {
    return {
      holdsScope: Boolean(mode.wholeRest),
      lead: rates[mode.unit],
      list: false,
      tail: mode.wholeRest
    };
  },
  cadence(description: Extract<Described, {kind: 'cadence'}>, mode: Inside) {
    const domain = domainOf(mode.unit);
    const fromFirst = description.start === domain.min;
    const scoped = fromFirst && mode.fromStart;
    const ends = scoped ?
      spaced(words.from, words.startGenitive, mode.scope,
        upTo(description.last, mode)) :
      when(fromFirst, upTo(description.last, mode)) ||
        stretch(description.start, description.last, mode);

    const bare = mode.bareRhythm && isBare(description, domain);

    return {
      holdsScope: scoped && !bare,
      lead: spaced(words.every, amount(description.interval, units[mode.unit])),
      list: false,
      tail: when(!bare, ends)
    };
  },
  cadencePieces(description: Extract<Described, {kind: 'pieces'}>,
    mode: Inside) {
    return phrases.pieces(description as never, mode);
  },
  except(description: Extract<Described, {kind: 'except'}>, mode: Inside) {
    const base = phraseOf(description.base, mode);

    return {
      holdsScope: base.holdsScope,
      lead: '',
      list: false,
      tail: clausal(fullText(base),
        leftOut(description.removed, {...mode, scope: ''}))
    };
  },
  pieces(description: Extract<Described, {kind: 'pieces'}>, mode: Inside) {
    const parts = (description.parts as Part[]).map(function say(part) {
      return phraseOf(part, mode);
    });

    return {
      holdsScope: parts.some(function holds(part) {
        return part.holdsScope;
      }),
      lead: '',
      list: true,
      tail: joined(parts.map(function shared(part, at) {
        const again = at > 0 && parts[at - 1].lead === part.lead;

        return {list: part.list, text: again ? part.tail : fullText(part)};
      }))
    };
  },
  range(description: Extract<Described, {kind: 'range'}>, mode: Inside) {
    const {min} = domainOf(mode.unit);
    const leading = description.from === min;
    const length = spaced(words.inTheFirst,
      amount(description.to - min + 1, units[mode.unit]));

    return {
      holdsScope: leading && !mode.lengthScoped,
      lead: rates[mode.unit],
      list: false,
      tail: when(leading, length) ||
        stretch(description.from, description.to, mode)
    };
  },
  values(description: Extract<Described, {kind: 'values'}>, mode: Inside) {
    const {min} = domainOf(mode.unit);
    const later = description.values.filter(function afterStart(value) {
      return value > min;
    }).map(function name(value) {
      return ordinal(value, 'feminine');
    });
    const fromStart = later.length < description.values.length;
    const start = spaced(words.in, words.startPrepositional,
      when(!mode.scope, mode.startNoun));
    // Beside the unit's start «на» is said again before each ordinal.
    const named = fromStart ?
      [start, ...later.map(function withWord(name) {
        return spaced(words.at, name);
      })] :
      [spaced(words.at, list(later))];

    return {
      holdsScope: false,
      lead: '',
      list: description.values.length > 1,
      tail: spaced(fromStart ? list(named) : named[0],
        when(later.length, ordinalUnits[mode.unit].prepositional))
    };
  }
};

function phraseOf(description: Described, mode: Inside): Phrase {
  return phrases[description.kind](description as never, mode);
}

/** «Кроме 29-й минуты каждого часа»: values left out, with their scope. */
function leftOut(removed: number[], mode: Inside): string {
  return spaced(words.except, list(removed.map(function name(value) {
    return ordinal(value, 'feminine');
  })), ordinalUnits[mode.unit].genitive, mode.scope);
}

/** The values of a minute or a second, without their scope. */
function insideOf(description: Described, mode: Inside): Scoped {
  const phrase = phraseOf(description, mode);

  return {
    afterRate: phrase.tail,
    holdsScope: phrase.holdsScope,
    text: fullText(phrase)
  };
}

/** The values of a minute or a second with their scope, said once. */
function scopedInside(description: Described, mode: Inside): Scoped {
  const said = insideOf(description, mode);

  const scope = when(!said.holdsScope, mode.scope);

  return {
    afterRate: spaced(said.afterRate, scope),
    holdsScope: said.holdsScope,
    text: spaced(said.text, scope)
  };
}

/** Minutes of the hour, or of the even or the odd hours. */
function minutesOf(scope: string): Inside {
  return {
    bareRhythm: true,
    fromStart: true,
    lengthScoped: true,
    scope,
    startNoun: '',
    unit: 'minute',
    wholeRest: ''
  };
}

/**
 * Minutes of each hour a coarser rhythm of hours lands on, said after it:
 * every rhythm with its ends, every minute as a length.
 */
const minutesOfTheHour: Inside = {
  ...minutesOf(words.ofTheHour),
  bareRhythm: false,
  wholeRest: words.forAnHour
};

/** Seconds of every minute. */
const secondsOfEachMinute: Inside =
  {...minutesOf(words.ofEachMinute), unit: 'second'};

/** Seconds after «каждый раз», which is their scope. */
const secondsEachTime: Inside = {
  bareRhythm: false,
  fromStart: false,
  lengthScoped: false,
  scope: '',
  startNoun: words.ofTheMinute,
  unit: 'second',
  wholeRest: words.forAMinute
};

/** Seconds of the first minute of an hour said bare. */
const secondsOfFirstMinute: Inside = {
  ...secondsEachTime,
  scope: words.ofTheFirstMinute,
  wholeRest: words.throughTheFirstMinute
};

export {
  insideOf, leftOut, minutesOf, minutesOfTheHour, scopedInside,
  secondsEachTime, secondsOfEachMinute, secondsOfFirstMinute
};
