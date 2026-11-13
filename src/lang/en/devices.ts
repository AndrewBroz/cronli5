// Deciding what to say about one field. The core offers each field's set
// of values as candidate descriptions. A voice is how English says each
// kind of description in one position of the sentence; every candidate a
// voice can say is rendered, and the phrase that names the fewest things
// wins.

import type {
  CadencePieces, Field, SetDescription
} from '../../core/schedule.js';
import type {Spoken} from '../../core/select.js';
import type {Moment} from './idioms.js';
import type {EnglishOptions} from './options.js';
import type {UnitName} from './forms.js';
import {denote} from '../../core/describe-set.js';
import {shortestSpoken} from '../../core/select.js';
import {domainOf} from '../../core/specs.js';
import {unit} from './forms.js';
import {idioms} from './idioms.js';
import lexicon from './lexicon.js';
import {
  dayNames, hourNames, inCycleOrder, join, list, momentAt, monthNames, span,
  through, timeNames, walkWeek, weekdayNames, weekRank
} from './words.js';

/**
 * A way to describe a set: one of a field's candidates, or its runs and
 * cadences together, which the core offers beside them.
 */
export type Described = SetDescription | CadencePieces;

type Cadence = Extract<SetDescription, {kind: 'cadence'}>;
type Range = Extract<SetDescription, {kind: 'range'}>;
type Pieces = Extract<SetDescription, {kind: 'pieces'}>;
type Exception = Extract<SetDescription, {kind: 'except'}>;
type Part = Pieces['parts'][number];

/**
 * A phrase and the number of things it names. `idiom` marks a fixed
 * phrasing, which wins a tie. `yields` marks an exception or a cadence
 * with both ends named, which loses one. `named` is false when the phrase
 * names none of its own values (every value, or an idiom). `fills` marks
 * a phrase that runs right round its cycle: every value, a cadence with
 * no end to name, or either with exceptions.
 */
export interface Phrase extends Spoken {
  fills: boolean;
  idiom: boolean;
  named: boolean;
  yields: boolean;
}

/** The phrase chosen for a field, with the description it says. */
export interface Choice extends Phrase {
  description: Described;
}

// Which ends of a cadence a voice has to name.
interface Stride {
  // Whether a cadence with both ends named is said however few values it
  // has. Ordinarily that few are listed, but where each item of the list
  // would be a clock time to the second the cadence is easier.
  anyLength?: boolean;
  // Whether a cadence that fills its cycle from the very start needs no
  // bounds: "every 15 minutes".
  bare: boolean;
  // Whether a cadence that fills its cycle may name its start alone.
  open: boolean;
  // Whether two values that halve the cycle from its start may be called
  // a cadence: minutes 0 and 30 are "every 30 minutes", but two hours are
  // two times.
  pair: boolean;
  // Whether the cadence must divide its cycle evenly to fill it. Cycles
  // that differ in length, as months and so days of the month do, cannot
  // be divided: running to the end is all that filling one can mean.
  tiles: boolean;
}

// How a voice says an evenly spaced cadence: with these ends named, or
// null if it cannot be said.
interface CadenceVoice extends Stride {
  say(cadence: Cadence, ends: number[]): string | null;
}

/** How one field is said in one position of the sentence. */
export interface Voice {
  // Every value; null if that cannot be said.
  all: string | null;
  cadence: CadenceVoice;
  field: Field;
  // How pieces are said, where a range or a list among them is not said
  // as it is alone: the words that lead them all, then each piece.
  inPieces?: Pick<Voice, 'range' | 'values'> & {lead: string};
  // Whether an exception is only for a hole inside the set. Minutes and
  // seconds are numbered from the start of their hour or minute, so a set
  // that misses only its first or last values is a run, and "except at 0
  // minutes past the hour" would take back a moment just named.
  holesOnly?: boolean;
  // How runs and cadences together are said, where a cadence among them
  // is not said as it is alone; null where they cannot be said at all.
  mixed?: Pick<Voice, 'cadence'> | null;
  // A run with no end, from its first value: "from 2030 onward".
  onward?(from: number): string;
  // Whether two neighbouring values may be said as a range.
  pairs: boolean;
  exception(removed: number[], base: SetDescription): string;
  range(from: number, to: number): string;
  // `later` marks a list that follows another piece of the same set.
  values(values: number[], later?: boolean): string;
  // Where a value falls in its cycle as it is said, when that is not its
  // own number: the week is said from Monday, which cron numbers 1.
  rank?(value: number): number;
  // The fewest values worth saying as pieces, where fewer are listed: a
  // run of weekdays changes form, so four of them are easier named.
  fewestInPieces?: number;
}

// What the values are being named for: a list of them, the ends of a
// range or a cadence, or the values an exception takes out.
type Role = 'ends' | 'excepted' | 'list';

// The words of a voice that says its values by name, in the one shape
// most voices share: "at A, B, and C", "every hour from A through B",
// "every 2 hours from A", "except at A".
interface Listing {
  all: string | null;
  // The word before a list, and before the values of an exception.
  at: string;
  exceptAt: string;
  field: Field;
  names(values: number[], role: Role): string[];
  // What goes before the ends of a range: "every hour from", "on".
  run: string;
  // The unit a cadence counts in, with the ends it has to name, and what
  // closes it once they are named.
  stride: Stride & {close?: string; unit: UnitName} | null;
}

const {units, words} = lexicon;
const {every, except} = words;

function plain(text: string, length: number): Phrase {
  return {fills: false, idiom: false, length, named: true, text,
    yields: false};
}

// Which ends of a cadence have to be named. A cadence that fills its cycle
// can leave its end unsaid, and its start too when it starts the cycle;
// one that stops early or starts late names both, so nobody assumes it
// carries on.
function namedEnds(cadence: Cadence, field: Field, voice: Stride): number[] {
  const {cyclic, max, min} = domainOf(field);
  const offset = cadence.start - min;
  const tiles = !voice.tiles ||
    offset < cadence.interval && (max - min + 1) % cadence.interval === 0;
  // A field that does not cycle says for itself whether a cadence has an
  // end worth naming.
  const fills = cyclic ?
    cadence.last + cadence.interval > max && tiles :
    cadence.open === true;

  if (fills && offset === 0 && voice.bare) {
    return [];
  }

  return fills && voice.open ?
    [cadence.start] :
    [cadence.start, cadence.last];
}

function sayAll(voice: Voice): Phrase | null {
  return voice.all === null ?
    null :
    {...plain(voice.all, 0), fills: true, named: false};
}

// Two neighbouring values are a list unless the voice describes a stretch
// of time: "on the 1st and 2nd", not "from the 1st through the 2nd".
// A run with no end names only its start: "from 2030 onward".
function sayRange(range: Range, voice: Voice): Phrase | null {
  const {from, to} = range;
  const {max, min} = domainOf(voice.field);
  const size = max - min + 1;
  const count = ((to - from) % size + size) % size + 1;

  if (range.open && voice.onward) {
    return plain(voice.onward(from), 1);
  }

  return count === 2 && !voice.pairs ? null : plain(voice.range(from, to), 2);
}

// A cadence with both ends named gives the listener three numbers and a
// rule to apply, and every value the rule gives has to be kept. A list is
// told outright, so up to this many values are listed, and the cadence,
// like every phrase built on one, is said only for more.
const mostListed = 8;

// Whether a set is small enough to list in place of a phrase built on a
// cadence with both ends named.
function listable(description: Described,
  voice: Pick<Voice, 'cadence' | 'field'>): boolean {
  return !voice.cadence.anyLength &&
    denote(description, domainOf(voice.field)).length <= mostListed;
}

function sayCadence(
  cadence: Cadence,
  voice: Pick<Voice, 'cadence' | 'field'>
): Phrase | null {
  const ends = namedEnds(cadence, voice.field, voice.cadence);
  const text = voice.cadence.say(cadence, ends);
  const two = cadence.last - cadence.start === cadence.interval;
  const halves = voice.cadence.pair && ends.length === 0;
  const few = ends.length === 2 && listable(cadence, voice);

  return text === null || few || two && !halves ?
    null :
    {
      ...plain(text, 1 + ends.length),
      fills: ends.length < 2,
      yields: ends.length === 2
    };
}

// The pieces in the order they are said. Values are walked in the order
// of their cycle, starting from a run that wraps round it if there is
// one, and gathered into runs of neighbours. A run long enough is a
// range, standing where its first value does whatever its neighbours
// are; the stray values that fall together between ranges make one list.
// Two neighbours are a run only for a voice that says stretches of time.
function inSpokenOrder(pieces: Pieces,
  voice: Pick<Voice, 'field' | 'pairs' | 'rank'>): Part[] {
  const rank = voice.rank || Number;
  const {max, min} = domainOf(voice.field);
  const wrapped = pieces.parts.find(function wraps(part) {
    return part.kind === 'range' && rank(part.from) > rank(part.to);
  }) as {from: number} | undefined;
  const order = inCycleOrder(denote(pieces, domainOf(voice.field)), rank,
    wrapped && wrapped.from);
  const shortest = voice.pairs ? 2 : 3;
  // The first values of the runs that have no end.
  const endless = pieces.parts.flatMap(function startOf(part) {
    return part.kind === 'range' && part.open ? [part.from] : [];
  });
  const runs = order.reduce(function gather(found: number[][], value) {
    const run = found[found.length - 1] || [];
    const next = (rank(run[run.length - 1]) + 1) % (max - min + 1);

    if (next === rank(value) % (max - min + 1)) {
      run.push(value);
    }
    else {
      found.push([value]);
    }

    return found;
  }, []);

  return runs.reduce(function toParts(parts: Part[], run) {
    const previous = parts[parts.length - 1];

    if (run.length >= shortest) {
      parts.push({
        from: run[0],
        kind: 'range',
        to: run[run.length - 1],
        ...endless.includes(run[0]) && {open: true}
      });
    }
    else if (previous && previous.kind === 'values') {
      previous.values.push(...run);
    }
    else {
      parts.push({kind: 'values', values: run});
    }

    return parts;
  }, []);
}

// Several pieces, each range with its own lead and the stray values
// between them as lists.
function sayPieces(pieces: Pieces, voice: Voice, opts: EnglishOptions):
  Phrase | null {
  const each = voice.inPieces || {...voice, lead: ''};
  const count = denote(pieces, domainOf(voice.field)).length;
  const said = inSpokenOrder(pieces, voice).map(function sayPart(part, at) {
    return part.kind === 'range' ?
      sayRange(part, {...voice, pairs: true, range: each.range}) as Phrase :
      plain(each.values(part.values, at > 0), part.values.length);
  });

  return count < (voice.fewestInPieces ?? 0) ?
    null :
    plain(
      join(each.lead, list(said.map(function textOf(part) {
        return part.text;
      }), opts)),
      said.reduce(function total(sum, part) {
        return sum + part.length;
      }, 0)
    );
}

// Runs and cadences together, each said as it is among pieces and joined
// as a list is. A cadence beside other parts always names where it stops,
// unless it has no end: bare, "every 15 minutes" would be heard as the
// whole of what is said. Like a cadence with both ends named, the phrase
// has to be worked out, and loses a tie; and it is said only for a set
// too long to list, however few values each of its cadences has. Two
// cadences that run through each other, one starting before the other has
// stopped, would have to be worked out and then merged, and are not said
// together. A cadence with no end is said all the same, since no list can
// say its set.
function sayMixed(mixed: CadencePieces, voice: Voice, opts: EnglishOptions):
  Phrase | null {
  const each = voice.inPieces || {...voice, lead: ''};
  const {mixed: strides = voice} = voice;
  const bounded = {anyLength: true, bare: false, open: false, pair: false,
    tiles: true};
  const cadences = mixed.parts.filter(function stepped(part) {
    return part.kind === 'cadence';
  }) as Cadence[];
  const endless = cadences.some(function unending(cadence) {
    return cadence.open;
  });
  const entwined = cadences.some(function crossed(cadence) {
    return cadences.some(function crosses(other) {
      return cadence.start < other.start && other.start < cadence.last;
    });
  });
  const unsaid = !endless && (entwined || listable(mixed, voice));
  const said = mixed.parts.map(function sayPart(part, at) {
    const kinds = {
      cadence(cadence: Cadence) {
        return strides && sayCadence(cadence, {
          cadence: {...strides.cadence, ...cadence.open ? {} : bounded},
          field: voice.field
        });
      },
      range(range: Range) {
        return sayRange(range, {...voice, pairs: true, range: each.range});
      },
      values(values: {values: number[]}) {
        return plain(each.values(values.values, at > 0),
          values.values.length);
      }
    };

    return (kinds[part.kind] as (found: typeof part) => Phrase | null)(part);
  });

  return unsaid || said.includes(null) ?
    null :
    {
      ...plain(
        join(each.lead, list((said as Phrase[]).map(function textOf(part) {
          return part.text;
        }), opts)),
        (said as Phrase[]).reduce(function total(sum, part) {
          return sum + part.length;
        }, 0)
      ),
      yields: true
    };
}

/**
 * Whether a description, said by number within the hour or the minute,
 * begins with "every minute" (or "every second"): every value, a run, or
 * pieces whose first is a run.
 */
function opensWithEvery(description: Described,
  field: 'minute' | 'second'): boolean {
  return description.kind === 'all' || description.kind === 'range' ||
    description.kind === 'pieces' &&
    inSpokenOrder(description, {field, pairs: false})[0].kind === 'range';
}

// An exception is for holes in the middle: a cadence that stops early or
// starts late is said with its bounds, so every value taken out of one
// has to lie between values that are kept. And it has to replace a
// list too long to hold, since it costs the listener a subtraction. Taken
// out of a cadence with both ends named, it has to leave more values than
// are listed in place of such a cadence.
const fewestExcepted = 5;

function sayException(
  exception: Exception,
  voice: Voice,
  opts: EnglishOptions
): Phrase | null {
  const kept = denote(exception, domainOf(voice.field));
  const holes = exception.removed.every(function inside(value) {
    return value > kept[0] && value < kept[kept.length - 1];
  });
  const few = kept.length < fewestExcepted;
  const inside = voice.holesOnly || exception.base.kind === 'cadence';
  const base = few || inside && !holes ?
    null :
    say(exception.base, voice, opts);
  const sayable = base && !(base.yields && listable(exception, voice)) ||
    null;

  return sayable && base && {
    ...base,
    idiom: false,
    length: base.length + exception.removed.length,
    text: join(base.text, voice.exception(exception.removed, exception.base)),
    yields: true
  };
}

/**
 * One description in one voice, or null when English has no phrase for
 * it there. An idiom for the set comes before any other way of saying it.
 */
function say(description: Described, voice: Voice, opts: EnglishOptions):
  Phrase | null {
  const idiom = idioms.find(function fits(row) {
    return row.field === voice.field && row.applies(description);
  });

  if (idiom) {
    return {
      ...plain(idiom.say(description as SetDescription, opts), 1),
      idiom: true,
      named: false
    };
  }

  switch (description.kind) {
    case 'all':
      return sayAll(voice);
    case 'range':
      return sayRange(description, voice);
    case 'cadence':
      return sayCadence(description, voice);
    case 'pieces':
      return sayPieces(description, voice, opts);
    case 'cadencePieces':
      return sayMixed(description, voice, opts);
    case 'except':
      return sayException(description, voice, opts);
    default:
      return plain(voice.values(description.values),
        description.values.length);
  }
}

/**
 * Phrases in the order a tie between them is settled in: idioms first,
 * then the others as offered, with those that must name strictly fewer
 * things than the plain list (which is offered last) after it.
 */
function inTieOrder<T extends {idiom?: boolean; yields: boolean}>(
  phrases: T[]
): T[] {
  return [
    ...phrases.filter(function onIdiom(phrase) {
      return phrase.idiom;
    }),
    ...phrases.filter(function ordinary(phrase) {
      return !phrase.idiom && !phrase.yields;
    }),
    ...phrases.filter(function yielding(phrase) {
      return phrase.yields;
    })
  ];
}

/** The phrase naming the fewest things among a field's candidates. */
function choose(
  candidates: Described[],
  voice: Voice,
  opts: EnglishOptions
): Choice {
  return shortestSpoken(inTieOrder(
    candidates.flatMap(function render(description): Choice[] {
      const phrase = say(description, voice, opts);

      return phrase ? [{...phrase, description}] : [];
    })
  ));
}

// The cadence of a voice that has none.
const noCadence: CadenceVoice = {
  bare: false,
  open: false,
  pair: false,
  say() {
    return null;
  },
  tiles: false
};

// A voice from its words.
function listing(spec: Listing, opts: EnglishOptions): Voice {
  const {stride} = spec;

  return {
    all: spec.all,
    cadence: stride ? {
      ...stride,
      say(cadence, ends) {
        return join(`${every} ${cadence.interval} ${units[stride.unit].many}`,
          span(spec.names(ends, 'ends'), opts), stride.close || '');
      }
    } : noCadence,
    exception(removed) {
      return join(except, spec.exceptAt,
        list(spec.names(removed, 'excepted'), opts));
    },
    field: spec.field,
    pairs: false,
    range(from, to) {
      return join(spec.run, through(spec.names([from, to], 'ends'), opts));
    },
    values(values) {
      return join(spec.at, list(spec.names(values, 'list'), opts));
    }
  };
}

/**
 * Minutes or seconds by number, to be followed by the unit and "past":
 * "at 5, 20, and 45", "every minute from 10 through 40". A cadence that
 * fills the hour or minute from zero stands alone as "every 15 minutes".
 * `everyOne` is what "every minute" is said as: finer seconds take its
 * place. `stray` is what the seconds say before a list of minutes that
 * follows a run of them, where "every second" no longer reaches: "and for
 * one minute at 45". Each number said is added to `heard`, so that the
 * unit after the phrase can agree with the last of them. `anyLength` is
 * whether a cadence with both ends named is said however few values it
 * has.
 */
function withinTheHour(
  field: 'minute' | 'second',
  spoken: {
    anyLength?: boolean;
    everyOne: string;
    heard: number[];
    stray: string;
  },
  opts: EnglishOptions
): Voice {
  const numbered = listing({
    all: spoken.everyOne,
    at: words.at,
    exceptAt: words.at,
    field,
    names(values) {
      spoken.heard.push(...values);

      return values.map(String);
    },
    run: `${spoken.everyOne} ${words.from}`,
    stride: {
      anyLength: spoken.anyLength,
      bare: true,
      open: false,
      pair: true,
      tiles: true,
      unit: field
    }
  }, opts);

  return {
    ...numbered,
    holesOnly: true,
    values(values, later) {
      return join(later ? spoken.stray : '', numbered.values(values));
    }
  };
}

// A voice for values that fall inside one stretch of clock time: a run
// is a window, and stray values are clock times. (A run that crosses the
// end of the hour or minute reaches here as two runs: numbers are never
// said as wrapping.) `moment` is the moment a value starts
// at, as an end of a window or as a stray. `close` is how a window
// closes: with which word, and on the moment how many values after its
// last.
function clockWindows(
  spec: {
    close: {after: number; word: string};
    field: 'minute' | 'second';
    lead: {every: string; stray: string};
    moment(value: number, stray: boolean): Moment;
  },
  opts: EnglishOptions
): Voice {
  function window(from: number, to: number): string {
    const ends = [from, to + spec.close.after];
    const [opens, closes] = timeNames(ends.map(function end(value) {
      return spec.moment(value, false);
    }), opts);

    return `${spec.lead.every} ${words.from} ${opens} ${spec.close.word} ` +
      closes;
  }

  return {
    ...listing({
      all: null,
      at: join(spec.lead.stray, words.at),
      exceptAt: words.at,
      field: spec.field,
      names(values) {
        return timeNames(values.map(function stray(value) {
          return spec.moment(value, true);
        }), opts);
      },
      run: '',
      stride: null
    }, opts),
    range: window
  };
}

/**
 * Runs of minutes inside one named hour, as windows of clock times
 * closed with "until" at the moment they end: "every minute from 9 a.m.
 * until 9:30 a.m.", with any stray minute a clock time of its own,
 * carrying the single `second` if there is one. `lead`
 * is what "every minute" is said as, and what goes before a stray time,
 * once the seconds have had their say.
 */
function minutesOfOneHour(
  hour: number,
  lead: {every: string; second?: number; stray: string},
  opts: EnglishOptions
): Voice {
  return clockWindows({
    close: {after: 1, word: words.until},
    field: 'minute',
    lead,
    moment(minute, stray) {
      const moment = momentAt(hour * 3600 + minute * 60, 'hour');

      return stray ? {...moment, second: lead.second} : moment;
    }
  }, opts);
}

/**
 * Seconds inside one clock time, as a window: "every second from 9:00
 * a.m. until 9:01 a.m." for the whole minute, and to the second for a
 * run, which names its last second so that nobody counts the one after
 * ("from 9:00:00 a.m. through 9:00:09 a.m."). A cadence with both ends
 * names them likewise ("every 10 seconds from 9:00:05 a.m. through
 * 9:00:55 a.m.").
 */
function secondsOfOneMinute(time: Moment, opts: EnglishOptions): Voice {
  const start = time.hour * 3600 + time.minute * 60;
  const everySecond = `${every} ${units.second.one}`;
  const [opens, closes] = timeNames(
    [momentAt(start, 'minute'), momentAt(start + 60, 'minute')], opts);
  const theMinute = `${words.from} ${opens} ${words.until} ${closes}`;

  function toMoment(second: number): Moment {
    return momentAt(start + second, 'second');
  }

  return {
    ...clockWindows({
      close: {after: 0, word: opts.style.through},
      field: 'second',
      lead: {every: everySecond, stray: ''},
      moment: toMoment
    }, opts),
    all: `${everySecond} ${theMinute}`,
    cadence: {
      anyLength: true,
      bare: true,
      open: false,
      pair: true,
      say(cadence, ends) {
        const lead = `${every} ${cadence.interval} ${units.second.many}`;

        return ends.length === 0 ?
          `${lead} ${theMinute}` :
          `${lead} ${span(timeNames(ends.map(toMoment), opts), opts)}`;
      },
      tiles: true
    }
  };
}

const everyHour = `${every} ${units.hour.one}`;

// Hours named as times of day: as moments after "at", each carrying the
// same minute and second, or bare as a noun phrase. A cadence of hours
// stays round: moments that carry a minute or a second cannot be said as
// one. `pair` is whether two hours that halve the day may be a cadence.
function hoursByName(
  at: Omit<Moment, 'hour'> & {pair: boolean},
  word: string,
  opts: EnglishOptions
): Voice {
  const carried = at.minute !== 0 || typeof at.second === 'number';
  const round = {bare: true, open: true, pair: at.pair, tiles: true,
    unit: 'hour'} as const;

  return listing({
    all: carried ? null : everyHour,
    at: word,
    exceptAt: word,
    field: 'hour',
    names(hours) {
      return hourNames(hours, at, opts);
    },
    run: `${everyHour} ${words.from}`,
    stride: carried ? null : round
  }, opts);
}

/**
 * Hours as moments, each at the same minute past: "at 9:30 a.m. and 5:30
 * p.m.", "every hour from 9 a.m. through 5 p.m.", "every 2 hours". Off the
 * hour, a cadence names its start to carry the minute, which adds nothing
 * to what it names, and "every hour" has no moment to carry it and cannot
 * be said.
 */
function hoursAsMoments(
  at: Omit<Moment, 'hour'> & {pair: boolean},
  opts: EnglishOptions
): Voice {
  return hoursByName(at, words.at, opts);
}

// Hours named as the hours that start at them: "the 9 a.m. and 5 p.m.
// hours", "the midnight hour".
function theHours(hours: number[], opts: EnglishOptions): string {
  return join(words.the,
    list(hourNames(hours, {minute: 0}, opts), opts),
    unit('hour', hours.length));
}

/**
 * Hours as a noun phrase. After "past", a range follows "the hour"
 * directly ("past the hour from 9 a.m. through 5 p.m."), listed hours
 * are named ("past 9 a.m. and 5 p.m."), and "every hour" is what an
 * exception excepts from. An hour beside a range, or taken out of one, is
 * named as an hour ("and during the 10 p.m. hour", "except during the
 * noon hour"): "and at 10 p.m." would be one more firing, on the hour.
 * After "the first 30 minutes of",
 * which is a part of an hour and not a point in it (`asHours`), "every
 * hour" stands and listed hours are named as hours: "the 9 a.m. and 5
 * p.m. hours". A cadence of hours is never a noun phrase: what came
 * before is counted against "the hour", and after a comma the cadence is
 * said as it is for moments: "the hour, every 4 hours".
 */
function hoursAsNouns(asHours: boolean, opts: EnglishOptions): Voice {
  const moments = hoursAsMoments({minute: 0, pair: false}, opts);
  const nouns = hoursByName({minute: 0, pair: false}, '', opts);
  const stretches = hoursAsStretches(null, opts);
  const theHour = `${words.the} ${units.hour.one}`;
  // What an exception is said as, by what it is taken out of.
  const excepting: {[kind: string]: Voice | undefined} =
    {all: nouns, cadence: moments};
  const shared: Voice = {
    ...nouns,
    mixed: null,
    cadence: {
      ...moments.cadence,
      say(cadence, ends) {
        return `${theHour}, ${moments.cadence.say(cadence, ends)}`;
      }
    },
    exception(removed, base) {
      return (excepting[base.kind] || stretches).exception(removed, base);
    }
  };

  function fromThrough(from: number, to: number): string {
    return span(hourNames([from, to], {minute: 0}, opts), opts);
  }

  return asHours ?
    {
      ...shared,
      values(values) {
        return theHours(values, opts);
      }
    } :
    {
      ...shared,
      inPieces:
        {lead: theHour, range: fromThrough, values: stretches.values},
      range(from, to) {
        return `${theHour} ${fromThrough(from, to)}`;
      }
    };
}

/**
 * Hours as stretches of time that a finer cadence fills: "during the 9
 * a.m. hour", "from 9 a.m. until 6 p.m.", "during every other hour". A
 * stretch under "every minute" closes with "until" at the moment it
 * ends, the hour after its last. Under a cadence of minutes that would
 * leave it open whether the closing moment fires, so the stretch closes
 * with "through" on the cadence's last run, which `close` gives within
 * the last hour: "from 9 a.m. through 5:45 p.m." Any cadence of hours
 * but every other hour runs "for one hour" at each of the moments it
 * names: "for one hour every 6 hours". One with a named end names each
 * end as an hour, since "for one hour ... through 6 p.m." is heard as
 * stopping at 6: "during every other hour from the 8 a.m. hour through
 * the 6 p.m. hour".
 */
function hoursAsStretches(close: {minute: number} | null,
  opts: EnglishOptions): Voice {
  const strides = hoursAsMoments({minute: 0, pair: false}, opts).cadence;
  const {during} = words;
  const everyOther = `${during} ${every} ${words.other} ${units.hour.one}`;
  const onTheHour = {minute: 0};

  return {
    all: '',
    cadence: {
      ...strides,
      say(cadence, ends) {
        const nth = `${during} ${every} ${lexicon.ordinal(cadence.interval)} ` +
          units.hour.one;

        // With both ends named, each is named as an hour: "for one hour
        // every 2 hours through 6 p.m." is heard as stopping at 6.
        if (ends.length === 2) {
          return join(cadence.interval === 2 ? everyOther : nth,
            span(ends.map(function asHour(hour) {
              return theHours([hour], opts);
            }), opts));
        }

        return cadence.interval === 2 ?
          join(everyOther, span(hourNames(ends, onTheHour, opts), opts)) :
          `${words.forOneHour} ${strides.say(cadence, ends)}`;
      }
    },
    exception(removed, base) {
      return join(except, base.kind === 'cadence' ? '' : during,
        theHours(removed, opts));
    },
    field: 'hour',
    pairs: true,
    range(from, to) {
      const [opens] = hourNames([from], onTheHour, opts);
      const [last] = hourNames([to], {...onTheHour, ...close}, opts);
      const [after] = hourNames([(to + 1) % (domainOf('hour').max + 1)],
        onTheHour, opts);

      return close ?
        `${words.from} ${opens} ${opts.style.through} ${last}` :
        `${words.from} ${opens} ${words.until} ${after}`;
    },
    values(values) {
      return `${during} ${theHours(values, opts)}`;
    }
  };
}

/**
 * Days of the month: "on the 1st and 15th", "from the 1st through the
 * 7th", "every 5 days from the 1st". With a month given, the days are
 * said as dates in it: "on June 1 and 15"; the days an exception takes
 * out stay plain ("except the 15th"). `lead` is the word that introduces
 * a day or a list of them, ordinarily "on".
 */
function daysOfTheMonth(
  month: number | null,
  lead: string,
  opts: EnglishOptions
): Voice {
  // For each role, the month the days are dates in, and whether each
  // takes its own "the".
  const forms: {[role in Role]: [number | null, boolean]} = {
    ends: [month, true],
    excepted: [null, false],
    list: [month, false]
  };

  return listing({
    all: `${words.on} ${every} ${units.day.one}`,
    at: lead,
    exceptAt: '',
    field: 'date',
    names(days, role) {
      return dayNames(days, ...forms[role], opts);
    },
    run: lead,
    // A cadence of days starts again each month, and says so: "every 5
    // days from the 1st" alone is heard as running on past the month's end.
    stride: {
      bare: false,
      close: `${words.of} ${words.the} ${units.month.one}`,
      open: true,
      pair: false,
      tiles: false,
      unit: 'day'
    }
  }, opts);
}

/**
 * Months standing alone: "in January and July", "from June through
 * August". A cadence of months is not said: "every other month" would be
 * heard as once in two months.
 */
function monthsAlone(opts: EnglishOptions): Voice {
  return listing({
    all: `${words.in} ${every} ${units.month.one}`,
    at: words.in,
    exceptAt: '',
    field: 'month',
    names(months) {
      return monthNames(months, opts);
    },
    run: words.in,
    stride: null
  }, opts);
}

/**
 * Months belonging to days that have already been phrased: "on the 1st
 * and 15th of January and July", "on the 1st of each month from June
 * through August", "on the 1st of every other month", "on the 1st of
 * every other month from February". Listed months under a single day
 * (`day`, with `lead` to introduce it) are said as dates in full: "on
 * January 1 and July 1".
 */
function monthsOfDays(
  days: {day: number | null; lead: string; phrase: string},
  opts: EnglishOptions
): Voice {
  const of = `${days.phrase} ${words.of}`;
  const monthWord = units.month.one;
  const months = listing({
    all: `${of} ${every} ${monthWord}`,
    at: of,
    exceptAt: '',
    field: 'month',
    names(values) {
      return monthNames(values, opts);
    },
    run: `${of} ${words.each} ${monthWord} ${words.from}`,
    stride: null
  }, opts);

  return {
    ...months,
    cadence: {
      bare: true,
      open: true,
      pair: false,
      say(cadence, ends) {
        return cadence.interval === 2 && ends.length < 2 ?
          join(`${of} ${every} ${words.other} ${monthWord}`,
            span(monthNames(ends, opts), opts)) :
          null;
      },
      tiles: true
    },
    values(values) {
      const {day} = days;

      return day === null ?
        months.values(values) :
        `${days.lead} ` + list(values.flatMap(function dateIn(month) {
          return dayNames([day], month, false, opts);
        }), opts);
    }
  };
}

/**
 * Days of the week: "on Mondays and Wednesdays", "Tuesday through
 * Thursday". They have no cadence ("every other day" would be false
 * across the end of the week) and no "every day except": the week is
 * short enough that its run is always named. A run with stray days
 * beside it is said as pieces only for more than four days.
 */
function daysOfTheWeek(opts: EnglishOptions): Voice {
  const weekdayForms =
    {ends: 'full', excepted: 'full', list: 'plural'} as const;

  return {
    ...listing({
      all: null,
      at: words.on,
      exceptAt: '',
      field: 'weekday',
      // A recurring day in a list is plural: "on Mondays".
      names(days, role) {
        return weekdayNames(walkWeek(days), weekdayForms[role], opts);
      },
      run: '',
      stride: null
    }, opts),
    range(from, to) {
      return through(weekdayNames([from, to], 'full', opts), opts);
    },
    fewestInPieces: 5,
    rank: weekRank
  };
}

/**
 * Years: "in 2030 and 2035", "in 2030 through 2035", and with no end,
 * "from 2030 onward". A cadence of years is said by position: "every
 * other year from 2033", "every 4th year from 2028". `hung` says whether
 * it hangs on the day before it with "of"; beside other runs of years, or
 * after a comma, it takes "in" as they do.
 */
function yearsByNumber(hung: boolean, opts: EnglishOptions): Voice {
  const years = listing({
    all: `${words.in} ${every} ${units.year.one}`,
    at: words.in,
    exceptAt: '',
    field: 'year',
    names(values) {
      return values.map(String);
    },
    run: words.in,
    stride: {bare: false, open: true, pair: false, tiles: false, unit: 'year'}
  }, opts);

  function strides(lead: string): CadenceVoice {
    return {
      ...years.cadence,
      say(cadence, ends) {
        const nth = cadence.interval === 2 ?
          words.other :
          lexicon.ordinal(cadence.interval);

        return join(`${lead} ${every} ${nth} ${units.year.one}`,
          span(ends.map(String), opts));
      }
    };
  }

  return {
    ...years,
    cadence: strides(hung ? words.of : words.in),
    mixed: {cadence: strides(words.in)},
    onward(from) {
      return `${words.from} ${from} ${words.onward}`;
    }
  };
}

export {
  choose, daysOfTheMonth, daysOfTheWeek, hoursAsMoments, hoursAsNouns,
  hoursAsStretches, inTieOrder, minutesOfOneHour, monthsAlone, monthsOfDays,
  opensWithEvery, say, secondsOfOneMinute, withinTheHour, yearsByNumber
};
