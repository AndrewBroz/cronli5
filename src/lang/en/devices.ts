// Deciding what to say about one field. The core offers each field's set
// of values as candidate descriptions. A voice is how English says each
// kind of description in one position of the sentence; every candidate a
// voice can say is rendered, and the phrase that names the fewest things
// wins.

import type {Field, SetDescription} from '../../core/schedule.js';
import type {Moment} from './idioms.js';
import type {Spoken} from '../../core/select.js';
import type {EnglishOptions} from './options.js';
import {denote} from '../../core/describe-set.js';
import {fieldSpecs} from '../../core/specs.js';
import {shortestSpoken} from '../../core/select.js';
import {idioms} from './idioms.js';
import lexicon from './lexicon.js';
import {
  dayNames, extraWords, hourNames, join, list, momentAt, monthName, span,
  timeNames, unit, walkWeek, weekdayName
} from './words.js';

type Cadence = Extract<SetDescription, {kind: 'cadence'}>;
type Pieces = Extract<SetDescription, {kind: 'pieces'}>;
type Exception = Extract<SetDescription, {kind: 'except'}>;

/**
 * A phrase and the number of things it names. `idiom` marks a fixed
 * phrasing, which wins a tie. `yields` marks an exception or a cadence
 * with both ends named, which loses one. `named` is false when the phrase
 * names none of its own values (every value, or an idiom).
 */
export interface Phrase extends Spoken {
  idiom: boolean;
  named: boolean;
  yields: boolean;
}

/** The phrase chosen for a field, with the description it says. */
export interface Choice extends Phrase {
  description: SetDescription;
}

// How a voice says an evenly spaced cadence.
interface CadenceVoice {
  // Whether a cadence that fills its cycle from the very start needs no
  // bounds: "every 15 minutes".
  bare: boolean;
  // The length of the cycle the cadence must divide to fill it, or null
  // when cycles differ in length, as months and so days of the month do.
  cycle: number | null;
  // Whether a cadence that fills its cycle may name its start alone.
  open: boolean;
  // The cadence with these ends named, or null if it cannot be said.
  say(cadence: Cadence, ends: number[]): string | null;
}

/** How one field is said in one position of the sentence. */
export interface Voice {
  // Every value, as the base of an exception; null if that cannot be said.
  all: string | null;
  cadence: CadenceVoice | null;
  field: Field;
  // Whether two neighbouring values may be said as a range.
  pairs: boolean;
  exception(removed: number[], base: SetDescription): string;
  range(from: number, to: number): string;
  values(values: number[]): string;
  // The order the field's values are said in, when it is not ascending.
  walk?(values: number[]): number[];
}

const {units, words} = lexicon;
const every = words.every.text;
const except = words.except.text;

function plain(text: string, length: number): Phrase {
  return {idiom: false, length, named: true, text, yields: false};
}

function domainOf(field: Field): {max: number; min: number} {
  const spec = fieldSpecs[field];

  return {max: spec.top ?? spec.max, min: spec.min};
}

// Which ends of a cadence have to be named. A cadence that fills its cycle
// can leave its end unsaid, and its start too when it starts the cycle;
// one that stops early or starts late names both, so nobody assumes it
// carries on. Where cycles differ in length, running to the end is all
// that filling one can mean.
function namedEnds(cadence: Cadence, field: Field, voice: CadenceVoice):
  number[] {
  const {max, min} = domainOf(field);
  const offset = cadence.start - min;
  const tiles = voice.cycle === null ||
    offset < cadence.interval && voice.cycle % cadence.interval === 0;
  const fills = cadence.last + cadence.interval > max && tiles;

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
    {...plain(voice.all, 0), named: false};
}

// Two neighbouring values are a list unless the voice describes a stretch
// of time: "on the 1st and 2nd", not "from the 1st through the 2nd".
function sayRange(from: number, to: number, voice: Voice): Phrase | null {
  const {max, min} = domainOf(voice.field);
  const size = max - min + 1;
  const count = ((to - from) % size + size) % size + 1;

  return count === 2 && !voice.pairs ? null : plain(voice.range(from, to), 2);
}

function sayCadence(cadence: Cadence, voice: Voice): Phrase | null {
  if (!voice.cadence) {
    return null;
  }

  const ends = namedEnds(cadence, voice.field, voice.cadence);
  const text = voice.cadence.say(cadence, ends);

  return text === null ?
    null :
    {...plain(text, 1 + ends.length), yields: ends.length === 2};
}

type Part = Pieces['parts'][number];

// The pieces in the order they are said. Values are walked in ascending
// order, starting from a run that wraps round the cycle if there is one,
// unless the voice has a walk of its own. Each run stands where its first
// value does, whatever kind of piece its neighbours are, and the stray
// values that fall together between runs make one list.
function inSpokenOrder(pieces: Pieces, voice: Pick<Voice, 'field' | 'walk'>):
  Part[] {
  const values = denote(pieces, {cyclic: true, ...domainOf(voice.field)});
  const wrapped = pieces.parts.find(function wraps(part) {
    return part.kind === 'range' && part.from > part.to;
  }) as {from: number} | undefined;
  const at = wrapped ? values.indexOf(wrapped.from) : 0;
  const order = voice.walk ?
    voice.walk(values) :
    [...values.slice(at), ...values.slice(0, at)];

  function place(part: Part): number {
    return order.indexOf(part.kind === 'range' ? part.from : part.values[0]);
  }

  return pieces.parts.flatMap(function apart(part): Part[] {
    return part.kind === 'range' ?
      [part] :
      part.values.map(function alone(value) {
        return {kind: 'values', values: [value]};
      });
  }).sort(function byPlace(a, b) {
    return place(a) - place(b);
  }).reduce(function gather(parts: Part[], part) {
    const previous = parts[parts.length - 1];

    if (part.kind === 'values' && previous && previous.kind === 'values') {
      previous.values.push(...part.values);
    }
    else {
      parts.push(part);
    }

    return parts;
  }, []);
}

// Several pieces, each range with its own lead and the stray values
// between them as lists.
function sayPieces(pieces: Pieces, voice: Voice, opts: EnglishOptions):
  Phrase {
  const said = inSpokenOrder(pieces, voice).map(function sayPart(part) {
    return part.kind === 'range' ?
      plain(voice.range(part.from, part.to), 2) :
      plain(voice.values(part.values), part.values.length);
  });

  return plain(
    list(said.map(function textOf(part) {
      return part.text;
    }), opts),
    said.reduce(function total(sum, part) {
      return sum + part.length;
    }, 0)
  );
}

/**
 * Whether a description, said by number within the hour or the minute,
 * begins with "every minute" (or "every second"): every value, a run, an
 * exception to either, or pieces whose first is a run.
 */
function opensWithEvery(description: SetDescription,
  field: 'minute' | 'second'): boolean {
  switch (description.kind) {
    case 'all':
    case 'range':
      return true;
    case 'except':
      return opensWithEvery(description.base, field);
    case 'pieces':
      return inSpokenOrder(description, {field})[0].kind === 'range';
    default:
      return false;
  }
}

function sayException(
  exception: Exception,
  voice: Voice,
  opts: EnglishOptions
): Phrase | null {
  const base = say(exception.base, voice, opts);

  return base && {
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
function say(description: SetDescription, voice: Voice, opts: EnglishOptions):
  Phrase | null {
  const idiom = idioms.find(function fits(row) {
    return row.field === voice.field && row.applies(description);
  });

  if (idiom) {
    return {
      ...idiom.say(description, opts),
      idiom: true,
      named: false,
      yields: false
    };
  }

  switch (description.kind) {
    case 'all':
      return sayAll(voice);
    case 'range':
      return sayRange(description.from, description.to, voice);
    case 'cadence':
      return sayCadence(description, voice);
    case 'pieces':
      return sayPieces(description, voice, opts);
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
function inTieOrder<T extends Pick<Phrase, 'idiom' | 'yields'>>(phrases: T[]):
  T[] {
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

/**
 * The phrase naming the fewest things among a field's candidates, with
 * ties settled as `inTieOrder` has them.
 */
function choose(
  candidates: SetDescription[],
  voice: Voice,
  opts: EnglishOptions
): Choice {
  const sayable = candidates.flatMap(function render(description): Choice[] {
    const phrase = say(description, voice, opts);

    return phrase ? [{...phrase, description}] : [];
  });

  return shortestSpoken(inTieOrder(sayable));
}

/**
 * Minutes or seconds by number, to be followed by the unit and "past":
 * "at 5, 20, and 45", "every minute from 10 through 40". A cadence that
 * fills the hour or minute from zero stands alone as "every 15 minutes".
 * `everyOne` is what "every minute" is said as: finer seconds take its
 * place.
 */
function withinTheHour(
  field: 'minute' | 'second',
  everyOne: string,
  opts: EnglishOptions
): Voice {
  function numbers(values: number[]): string {
    return list(values.map(String), opts);
  }

  return {
    all: everyOne,
    cadence: {
      bare: true,
      cycle: 60,
      open: false,
      say(cadence, ends) {
        return join(`${every} ${cadence.interval} ${units[field].many.text}`,
          span(ends.map(String), opts));
      }
    },
    exception(removed) {
      return `${except} ${words.at.text} ${numbers(removed)}`;
    },
    field,
    pairs: false,
    range(from, to) {
      return join(everyOne, span([from, to].map(String), opts));
    },
    values(values) {
      return `${words.at.text} ${numbers(values)}`;
    }
  };
}

// The words for values that fall inside one stretch of clock time, each
// value `step` seconds long from `start` seconds after midnight: a run
// is a window closed with "until" at the moment it ends, and stray values
// are clock times. A run that wraps is two windows.
function clockWindows(
  frame: {precision: 'hour' | 'second'; start: number; step: number},
  lead: {every: string; stray: string},
  opts: EnglishOptions
): Pick<Voice, 'exception' | 'pairs' | 'range' | 'values'> {
  function names(values: number[]): string[] {
    return timeNames(values.map(function toMoment(value) {
      return momentAt(frame.start + value * frame.step, frame.precision);
    }), opts);
  }

  function window(from: number, to: number): string {
    const [opens, closes] = names([from, to + 1]);

    return `${lead.every} ${words.from.text} ${opens} ` +
      `${words.until.text} ${closes}`;
  }

  return {
    exception(removed) {
      return `${except} ${words.at.text} ${list(names(removed), opts)}`;
    },
    pairs: false,
    range(from, to) {
      return from > to ?
        list([window(0, to), window(from, 59)], opts) :
        window(from, to);
    },
    values(values) {
      return join(lead.stray, words.at.text, list(names(values), opts));
    }
  };
}

/**
 * Runs of minutes inside one named hour, as windows of clock times:
 * "every minute from 9 until 9:30 a.m.", with any stray minute a clock
 * time of its own. `lead` is what "every minute" is said as, and what
 * goes before a stray time, once the seconds have had their say.
 */
function minutesOfOneHour(
  hour: number,
  lead: {every: string; stray: string},
  opts: EnglishOptions
): Voice {
  return {
    ...clockWindows({precision: 'hour', start: hour * 3600, step: 60}, lead,
      opts),
    all: null,
    cadence: null,
    field: 'minute'
  };
}

/**
 * Seconds inside one clock time, as a window: "every second from 9:00
 * until 9:01 a.m." for the whole minute, to the second for a run
 * ("from 9:00:00 until 9:00:10 a.m."), and with both ends named for a
 * cadence that has them ("every 10 seconds from 9:00:05 through 9:00:55
 * a.m.").
 */
function secondsOfOneMinute(time: Moment, opts: EnglishOptions): Voice {
  const start = time.hour * 3600 + time.minute * 60;
  const everySecond = `${every} ${units.second.one.text}`;
  const [opens, closes] = timeNames(
    [momentAt(start, 'minute'), momentAt(start + 60, 'minute')], opts);
  const theMinute = `${words.from.text} ${opens} ${words.until.text} ${closes}`;

  return {
    ...clockWindows({precision: 'second', start, step: 1},
      {every: everySecond, stray: ''}, opts),
    all: `${everySecond} ${theMinute}`,
    cadence: {
      bare: true,
      cycle: 60,
      open: false,
      say(cadence, ends) {
        const lead = `${every} ${cadence.interval} ${units.second.many.text}`;
        const named = timeNames(ends.map(function toMoment(second) {
          return momentAt(start + second, 'second');
        }), opts);

        return ends.length === 0 ?
          `${lead} ${theMinute}` :
          `${lead} ${span(named, opts)}`;
      }
    },
    field: 'second'
  };
}

const everyHour = `${every} ${units.hour.one.text}`;

/**
 * Hours as moments, each at the same minute past: "at 9:30 a.m. and 5:30
 * p.m.", "every hour from 9 a.m. through 5 p.m.", "every 2 hours". Off the
 * hour, a cadence names its start to carry the minute, which adds nothing
 * to what it names, and "every hour" has no moment to carry it and cannot
 * be said.
 */
function hoursAsMoments(at: Omit<Moment, 'hour'>, opts: EnglishOptions):
  Voice {
  const carries = at.minute !== 0 || typeof at.second === 'number';

  function names(hours: number[]): string[] {
    return hourNames(hours, at, opts);
  }

  return {
    all: carries ? null : everyHour,
    cadence: {
      bare: true,
      cycle: 24,
      open: true,
      say(cadence, ends) {
        const named = carries && ends.length === 0 ? [cadence.start] : ends;

        return join(`${every} ${cadence.interval} ${units.hour.many.text}`,
          span(names(named), opts));
      }
    },
    exception(removed) {
      return `${except} ${words.at.text} ${list(names(removed), opts)}`;
    },
    field: 'hour',
    pairs: false,
    range(from, to) {
      return join(everyHour, span(names([from, to]), opts));
    },
    values(values) {
      return `${words.at.text} ${list(names(values), opts)}`;
    }
  };
}

// Hours named as the hours that start at them: "the 9 a.m. and 5 p.m.
// hours", "the midnight hour".
function theHours(hours: number[], opts: EnglishOptions): string {
  return join(words.the.text,
    list(hourNames(hours, {minute: 0}, opts), opts),
    unit('hour', hours.length));
}

/**
 * Hours as a noun phrase after "past": "9 a.m. and 5 p.m.", "every hour
 * from 9 a.m. through 5 p.m.", "every other hour". "Every other" is the
 * only interval word, so a wider cadence, or one that stops early, is
 * left to be said as its values. After "the first 30 minutes of", which
 * is a part of an hour and not a point in it, listed hours are named
 * `asHours`: "the 9 a.m. and 5 p.m. hours".
 */
function hoursAsNouns(asHours: boolean, opts: EnglishOptions): Voice {
  function names(hours: number[]): string[] {
    return hourNames(hours, {minute: 0}, opts);
  }

  return {
    all: everyHour,
    cadence: {
      bare: true,
      cycle: 24,
      open: true,
      say(cadence, ends) {
        return cadence.interval === 2 && ends.length < 2 ?
          join(`${every} ${lexicon.intervalWord(2).text}`,
            units.hour.one.text, span(names(ends), opts)) :
          null;
      }
    },
    exception(removed) {
      return `${except} ${list(names(removed), opts)}`;
    },
    field: 'hour',
    pairs: false,
    range(from, to) {
      return join(everyHour, span(names([from, to]), opts));
    },
    values(values) {
      return asHours ? theHours(values, opts) : list(names(values), opts);
    }
  };
}

/**
 * Hours as stretches of time that a finer cadence fills: "during the 9
 * a.m. hour", "from 9 a.m. until 6 p.m.", "during every other hour". A
 * stretch closes at the moment it ends, the hour after its last. A
 * cadence wider than every other hour runs "for one hour" at each of the
 * moments it names: "for one hour every 6 hours".
 */
function hoursAsStretches(opts: EnglishOptions): Voice {
  const nouns = hoursAsNouns(true, opts);
  const cadence = nouns.cadence as CadenceVoice;
  const moments = hoursAsMoments({minute: 0}, opts).cadence as CadenceVoice;
  const during = words.during.text;

  return {
    all: '',
    cadence: {
      ...cadence,
      say(stride, ends) {
        const noun = cadence.say(stride, ends);

        return noun ?
          `${during} ${noun}` :
          `${extraWords.forOneHour} ${moments.say(stride, ends)}`;
      }
    },
    exception(removed, base) {
      return join(except, base.kind === 'cadence' ? '' : during,
        theHours(removed, opts));
    },
    field: 'hour',
    pairs: true,
    range(from, to) {
      const [opens, closes] =
        hourNames([from, (to + 1) % 24], {minute: 0}, opts);

      return `${words.from.text} ${opens} ${words.until.text} ${closes}`;
    },
    values(values) {
      return `${during} ${nouns.values(values)}`;
    }
  };
}

/**
 * Days of the month: "on the 1st and 15th", "from the 1st through the
 * 7th", "every 5 days from the 1st". With a month given, the days are
 * said as dates in it: "on June 1 and 15". `lead` is the word that
 * introduces a day or a list of them, ordinarily "on".
 */
function daysOfTheMonth(
  month: number | null,
  lead: string,
  opts: EnglishOptions
): Voice {
  return {
    all: `${words.on.text} ${every} ${units.day.one.text}`,
    cadence: {
      bare: false,
      cycle: null,
      open: true,
      say(cadence, ends) {
        return join(`${every} ${cadence.interval} ${units.day.many.text}`,
          span(dayNames(ends, month, true, opts), opts));
      }
    },
    exception(removed) {
      return `${except} ${list(dayNames(removed, null, false, opts), opts)}`;
    },
    field: 'date',
    pairs: false,
    range(from, to) {
      return span(dayNames([from, to], month, true, opts), opts);
    },
    values(values) {
      return `${lead} ${list(dayNames(values, month, false, opts), opts)}`;
    }
  };
}

function monthNames(months: number[], opts: EnglishOptions): string[] {
  return months.map(function nameOf(month) {
    return monthName(month, opts);
  });
}

/**
 * Months standing alone: "in January and July", "from June through
 * August". A cadence of months is not said: "every other month" would be
 * heard as once in two months.
 */
function monthsAlone(opts: EnglishOptions): Voice {
  const inWord = words.in.text;

  return {
    all: `${inWord} ${every} ${units.month.one.text}`,
    cadence: null,
    exception(removed) {
      return `${except} ${list(monthNames(removed, opts), opts)}`;
    },
    field: 'month',
    pairs: false,
    range(from, to) {
      return span(monthNames([from, to], opts), opts);
    },
    values(values) {
      return `${inWord} ${list(monthNames(values, opts), opts)}`;
    }
  };
}

/**
 * Months belonging to days that have already been phrased: "on the 1st
 * and 15th of January and July", "on the 1st of each month from June
 * through August", "on the 1st of every other month", "on the 1st of
 * every other month from February". Listed months
 * under a single day (`day`, with `lead` to introduce it) are said as
 * dates in full: "on January 1 and July 1".
 */
function monthsOfDays(
  days: {day: number | null; lead: string; phrase: string},
  opts: EnglishOptions
): Voice {
  const of = `${days.phrase} ${words.of.text}`;
  const monthWord = units.month.one.text;

  return {
    all: `${of} ${every} ${monthWord}`,
    cadence: {
      bare: true,
      cycle: 12,
      open: true,
      say(cadence, ends) {
        return cadence.interval === 2 && ends.length < 2 ?
          join(`${of} ${every} ${lexicon.intervalWord(2).text} ${monthWord}`,
            span(monthNames(ends, opts), opts)) :
          null;
      }
    },
    exception(removed) {
      return `${except} ${list(monthNames(removed, opts), opts)}`;
    },
    field: 'month',
    pairs: false,
    range(from, to) {
      return `${of} ${extraWords.each} ${monthWord} ` +
        span(monthNames([from, to], opts), opts);
    },
    values(values) {
      const {day} = days;

      return day === null ?
        `${of} ${list(monthNames(values, opts), opts)}` :
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
 * short enough that its run is always named.
 */
function daysOfTheWeek(opts: EnglishOptions): Voice {
  const on = words.on.text;

  function names(days: number[], recurring: boolean): string[] {
    return days.map(function nameOf(day) {
      return weekdayName(day, recurring, opts);
    });
  }

  return {
    all: null,
    cadence: null,
    exception(removed) {
      return `${except} ${list(names(walkWeek(removed), false), opts)}`;
    },
    field: 'weekday',
    pairs: false,
    range(from, to) {
      return names([from, to], false).join(` ${opts.style.through} `);
    },
    values(values) {
      return `${on} ${list(names(walkWeek(values), true), opts)}`;
    },
    walk: walkWeek
  };
}

/**
 * Years: "in 2030 and 2035", "from 2030 through 2035", "every 4 years
 * from 1970".
 */
function yearsByNumber(opts: EnglishOptions): Voice {
  const inWord = words.in.text;

  function names(years: number[]): string[] {
    return years.map(function nameOf(year) {
      return lexicon.year(year).text;
    });
  }

  return {
    all: `${inWord} ${every} ${units.year.one.text}`,
    cadence: {
      bare: false,
      cycle: null,
      open: true,
      say(cadence, ends) {
        return join(`${every} ${cadence.interval} ${units.year.many.text}`,
          span(names(ends), opts));
      }
    },
    exception(removed) {
      return `${except} ${list(names(removed), opts)}`;
    },
    field: 'year',
    pairs: false,
    range(from, to) {
      return span(names([from, to]), opts);
    },
    values(values) {
      return `${inWord} ${list(names(values), opts)}`;
    }
  };
}

export {
  choose, daysOfTheMonth, daysOfTheWeek, hoursAsMoments, hoursAsNouns,
  hoursAsStretches, inTieOrder, minutesOfOneHour, monthsAlone, monthsOfDays,
  opensWithEvery, say, secondsOfOneMinute, withinTheHour, yearsByNumber
};
