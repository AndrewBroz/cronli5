// The small devices every part of the sentence shares: a decision said as
// a list of options, a list with its final «y», pieces that share a lead,
// and the writing of clock times.

import type {SpanishStyle} from './options.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

/** A clock time; `tail` holds its second, where one is written. */
export interface Moment {
  hour: number;
  minute: number;
  tail: number[];
}

/** One piece of a phrase: what leads it and what it says. */
export interface Piece {
  lead: string;
  body: string;
}

/** A unit of time, alone and after a number other than one. */
export interface Unit {
  many: string;
  one: string;
}

/** How clock times are written under one style. */
export interface Clock {
  // «a las 9:00, 9:20 y 9:40», with the article of 4.1.
  at(moments: Moment[]): string;
  // «de 9:00 a 17:45».
  span(from: Moment, to: Moment): string;
  // «hasta las 22:59».
  until(moment: Moment): string;
}

/** The first option whose condition holds. The last one always does. */
function pick<T>(options: Array<[T, boolean]>): T {
  return (options.find(function holds(option) {
    return option[1];
  }) as [T, boolean])[0];
}

/** The words that are there, with single spaces between them. */
function spaced(texts: string[]): string {
  return texts.filter(Boolean).join(' ');
}

/** «A», «A y B», «A, B y C». */
function list(items: Array<number | string>): string {
  const texts = items.map(String);

  return [texts.slice(0, -1).join(', '), ...texts.slice(-1)]
    .filter(Boolean).join(` ${words.and} `);
}

/** The singular or the plural of a pair, by how many there are. */
function byCount<T>(forms: [T, T], count: number): T {
  return forms[Number(count !== 1)];
}

/** «cada minuto», «cada 15 minutos»; «una vez cada 6 segundos». */
function every(unit: Unit, interval: number, leads: [string, string]):
  string {
  return interval === 1 ?
    `${leads[0]} ${unit.one}` :
    `${leads[1]} ${interval} ${unit.many}`;
}

/**
 * Pieces as texts. A lead is said where the piece before it had another:
 * «cada hora de 9:00 a 12:00 y de 14:00 a 17:00», but «a las 5:00 y cada
 * hora de 9:00 a 17:00».
 */
function led(pieces: Piece[]): string[] {
  return pieces.map(function text(piece, index) {
    const repeated = index > 0 && pieces[index - 1].lead === piece.lead;

    return spaced([repeated ? '' : piece.lead, piece.body]);
  });
}

// The hour as it is written, and the mark that follows a 12-hour time.
const dials = {
  false: {
    hourOf(hour: number): number {
      return hour;
    },
    markOf(): string {
      return '';
    }
  },
  true: {
    hourOf(hour: number): number {
      return hour % 12 || 12;
    },
    markOf(hour: number): string {
      return [words.am, words.pm][Math.floor(hour / 12)];
    }
  }
};

/** The writing of clock times under a style. */
function clockOf(style: SpanishStyle): Clock {
  const dial = dials[String(style.hour12) as 'false' | 'true'];

  function written(moment: Moment): string {
    const digits = [moment.minute, ...moment.tail].map(lexicon.twoDigits);

    return spaced([
      [dial.hourOf(moment.hour), ...digits].join(':'),
      dial.markOf(moment.hour)
    ]);
  }

  // Whether the hour, as it is written, is 1: «a la 1:00», «hasta la
  // 1:45».
  function isOne(moment: Moment): number {
    return Number(dial.hourOf(moment.hour) === 1);
  }

  // The preposition and article are said once, in the form the first
  // time takes, unless the list begins at hour 1 and goes on to another
  // hour: then they are said before every time.
  function at(moments: Moment[]): string {
    const leads = moments.map(function lead(moment) {
      return [words.at, words.atOne][isOne(moment)];
    });
    const mixed = leads[0] === words.atOne && leads.includes(words.at);

    return list(moments.map(function time(moment, index) {
      return spaced([
        mixed || index === 0 ? leads[index] : '',
        written(moment)
      ]);
    }));
  }

  return {
    at,
    span(from, to) {
      return `${words.from} ${written(from)} ${words.to} ${written(to)}`;
    },
    until(moment) {
      const article = [words.theHours, words.theHour][isOne(moment)];

      return `${words.until} ${article} ${written(moment)}`;
    }
  };
}

export {byCount, clockOf, every, led, list, pick, spaced};
