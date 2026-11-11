// Deciding what to say about one field. The core offers each field's set
// of values as candidate descriptions. A voice is how English says each
// kind of description in one position of the sentence; every candidate a
// voice can say is rendered, and the phrase that names the fewest things
// wins.

import type {Field, SetDescription} from '../../../core/schedule.js';
import type {Spoken} from '../../../core/select.js';
import type {EnglishOptions} from './options.js';
import {fieldSpecs} from '../../../core/specs.js';
import {shortestSpoken} from '../../../core/select.js';
import {idioms} from './idioms.js';
import lexicon from './lexicon.js';
import {
  dayNames, extraWords, hourNames, join, list, monthName, nth, span, unit,
  walkWeek, weekdayName
} from './words.js';

type Cadence = Extract<SetDescription, {kind: 'cadence'}>;
type Pieces = Extract<SetDescription, {kind: 'pieces'}>;
type Exception = Extract<SetDescription, {kind: 'except'}>;

/**
 * A phrase and the number of things it names. `idiom` marks a phrase
 * built on a fixed phrasing; `named` is false when the phrase names none
 * of its own values (every value, or an idiom).
 */
export interface Phrase extends Spoken {
  idiom: boolean;
  named: boolean;
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
  say(interval: number, ends: number[]): string;
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
}

const {units, words} = lexicon;
const every = words.every.text;
const except = words.except.text;

function plain(text: string, length: number): Phrase {
  return {idiom: false, length, named: true, text};
}

function domainOf(field: Field): {max: number; min: number} {
  const spec = fieldSpecs[field];

  return {max: spec.top ?? spec.max, min: spec.min};
}

// Which ends of a cadence have to be named. A cadence that fills its cycle
// can leave its end unsaid, and its start too when it starts the cycle;
// one that stops early or starts late names both, so nobody assumes it
// carries on.
function namedEnds(cadence: Cadence, field: Field, voice: CadenceVoice):
  number[] {
  const {max, min} = domainOf(field);
  const offset = cadence.start - min;
  const divides = voice.cycle === null ||
    voice.cycle % cadence.interval === 0;
  const fills = cadence.last + cadence.interval > max &&
    offset < cadence.interval && divides;

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
    {idiom: false, length: 0, named: false, text: voice.all};
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

  return plain(voice.cadence.say(cadence.interval, ends), 1 + ends.length);
}

// Several pieces: the ranges first, then the stray values as a list, so
// the unit or hour that follows is not mistaken for part of a range.
function sayPieces(pieces: Pieces, voice: Voice, opts: EnglishOptions):
  Phrase {
  const ranges = pieces.parts.flatMap(function sayRun(part) {
    return part.kind === 'range' ?
      [plain(voice.range(part.from, part.to), 2)] :
      [];
  });
  const strays = pieces.parts.flatMap(function sayStrays(part) {
    return part.kind === 'values' ?
      [plain(voice.values(part.values), part.values.length)] :
      [];
  });
  const parts = [...ranges, ...strays];

  return plain(
    list(parts.map(function textOf(part) {
      return part.text;
    }), opts),
    parts.reduce(function total(sum, part) {
      return sum + part.length;
    }, 0)
  );
}

function sayException(
  exception: Exception,
  voice: Voice,
  opts: EnglishOptions
): Phrase | null {
  const base = say(exception.base, voice, opts);

  return base && {
    ...base,
    length: base.length + exception.removed.length,
    text: join(base.text, voice.exception(exception.removed, exception.base))
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
    return {...idiom.say(opts), idiom: true, named: false};
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
 * The phrase naming the fewest things among a field's candidates. A tie
 * goes to a phrase built on an idiom, then to the earlier candidate.
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

  return shortestSpoken([
    ...sayable.filter(function onIdiom(choice) {
      return choice.idiom;
    }),
    ...sayable.filter(function onNoIdiom(choice) {
      return !choice.idiom;
    })
  ]);
}

/**
 * Minutes or seconds by number, to be followed by the unit and "past":
 * "at 5, 20, and 45", "every minute from 0 through 29". A cadence that
 * fills the hour or minute from zero stands alone as "every 15 minutes".
 */
function withinTheHour(field: 'minute' | 'second', opts: EnglishOptions):
  Voice {
  const everyOne = `${every} ${units[field].one.text}`;

  function numbers(values: number[]): string {
    return list(values.map(String), opts);
  }

  return {
    all: everyOne,
    cadence: {
      bare: true,
      cycle: 60,
      open: false,
      say(interval, ends) {
        return join(`${every} ${interval} ${units[field].many.text}`,
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

const everyHour = `${every} ${units.hour.one.text}`;

/**
 * Hours as moments, each at the same minute past: "at 9:30 a.m. and 5:30
 * p.m.", "every hour from 9 a.m. through 5 p.m.", "every 2 hours". Off the
 * hour, "every hour" has no moment to carry the minute and cannot be said.
 */
function hoursAsMoments(minute: number, opts: EnglishOptions): Voice {
  function names(hours: number[]): string[] {
    return hourNames(hours, minute, opts);
  }

  return {
    all: minute === 0 ? everyHour : null,
    cadence: {
      bare: minute === 0,
      cycle: 24,
      open: true,
      say(interval, ends) {
        return join(`${every} ${interval} ${units.hour.many.text}`,
          span(names(ends), opts));
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

/**
 * Hours as a noun phrase after "past": "9 a.m. and 5 p.m.", "every hour
 * from 9 a.m. through 5 p.m.", "every other hour".
 */
function hoursAsNouns(opts: EnglishOptions): Voice {
  function names(hours: number[]): string[] {
    return hourNames(hours, 0, opts);
  }

  return {
    all: everyHour,
    cadence: {
      bare: true,
      cycle: 24,
      open: true,
      say(interval, ends) {
        return join(`${every} ${nth(interval)} ${units.hour.one.text}`,
          span(names(ends), opts));
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
      return list(names(values), opts);
    }
  };
}

/**
 * Hours as stretches of time that a finer cadence fills: "during the 9
 * a.m. hour", "from 9 a.m. until 6 p.m.", "during every other hour". A
 * stretch closes at the moment it ends, the hour after its last.
 */
function hoursAsStretches(opts: EnglishOptions): Voice {
  const nouns = hoursAsNouns(opts);
  const cadence = nouns.cadence as CadenceVoice;
  const during = words.during.text;

  function theHours(hours: number[]): string {
    return join(words.the.text, list(hourNames(hours, 0, opts), opts),
      unit('hour', hours.length));
  }

  return {
    all: '',
    cadence: {
      ...cadence,
      say(interval, ends) {
        return `${during} ${cadence.say(interval, ends)}`;
      }
    },
    exception(removed, base) {
      return join(except, base.kind === 'cadence' ? '' : during,
        theHours(removed));
    },
    field: 'hour',
    pairs: true,
    range(from, to) {
      const [opens, closes] = hourNames([from, (to + 1) % 24], 0, opts);

      return `${words.from.text} ${opens} ${words.until.text} ${closes}`;
    },
    values(values) {
      return `${during} ${theHours(values)}`;
    }
  };
}

/**
 * Days of the month: "on the 1st and 15th", "from the 1st through the
 * 7th", "on every fifth day from the 1st". With a month given, the days
 * are said as dates in it: "on June 1 and 15".
 */
function daysOfTheMonth(month: number | null, opts: EnglishOptions): Voice {
  const on = words.on.text;

  return {
    all: `${on} ${every} ${units.day.one.text}`,
    cadence: {
      bare: false,
      cycle: null,
      open: true,
      say(interval, ends) {
        return join(`${on} ${every} ${nth(interval)} ${units.day.one.text}`,
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
      return `${on} ${list(dayNames(values, month, false, opts), opts)}`;
    }
  };
}

/**
 * Months, standing alone after "in" or belonging to a day after "of": "in
 * January and July", "of every third month". Alone, a cadence of months
 * is not said, because "every 3 months" is heard as once a quarter.
 */
function monthsOfTheYear(position: 'in' | 'of', opts: EnglishOptions): Voice {
  const ofDay = position === 'of';
  const monthWord = units.month.one.text;

  function names(months: number[]): string[] {
    return months.map(function nameOf(month) {
      return monthName(month, opts);
    });
  }

  return {
    all: `${words[position].text} ${every} ${monthWord}`,
    cadence: ofDay ?
      {
        bare: true,
        cycle: 12,
        open: true,
        say(interval, ends) {
          return join(`${words.of.text} ${every} ${nth(interval)} ${monthWord}`,
            span(names(ends), opts));
        }
      } :
      null,
    exception(removed) {
      return `${except} ${list(names(removed), opts)}`;
    },
    field: 'month',
    pairs: false,
    range(from, to) {
      return join(
        ofDay ? `${words.of.text} ${extraWords.each} ${monthWord}` : '',
        span(names([from, to]), opts));
    },
    values(values) {
      return `${words[position].text} ${list(names(values), opts)}`;
    }
  };
}

/**
 * Days of the week: "on Mondays and Wednesdays", "Tuesday through
 * Thursday". They have no cadence: "every other day" would be false
 * across the end of the week.
 */
function daysOfTheWeek(opts: EnglishOptions): Voice {
  const on = words.on.text;

  function names(days: number[], recurring: boolean): string[] {
    return days.map(function nameOf(day) {
      return weekdayName(day, recurring, opts);
    });
  }

  return {
    all: `${on} ${every} ${units.day.one.text}`,
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
    }
  };
}

/** Years: "in 2030 and 2035", "from 2030 through 2035". */
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
      say(interval, ends) {
        return join(
          `${inWord} ${every} ${nth(interval)} ${units.year.one.text}`,
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
  hoursAsStretches, monthsOfTheYear, say, withinTheHour, yearsByNumber
};
