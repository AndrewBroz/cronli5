// Getting the words right: lists, names, numbers and times of day. Nothing
// here decides what is said or where it goes.

import type {EnglishOptions} from './options.js';
import type {Moment} from './idioms.js';
import lexicon from './lexicon.js';
import {momentIdioms} from './idioms.js';

type UnitName = keyof typeof lexicon.units;

const {words} = lexicon;

// Words the lexicon does not hold yet.
const extraWords = {
  asWellAs: 'as well as',
  each: 'each',
  for: 'for',
  forOneHour: 'for one hour'
};

const secondsInDay = 86400;

/** Words joined by single spaces, leaving out any part that is silent. */
function join(...parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

/** "A", "A and B", "A, B, and C". */
function list(items: string[], opts: EnglishOptions): string {
  const and = ` ${words.and.text} `;

  if (items.length < 3) {
    return items.join(and);
  }

  const comma = opts.style.serialComma ? ',' : '';

  return items.slice(0, -1).join(', ') + comma + and + items[items.length - 1];
}

/**
 * The named ends of a stretch: nothing, "from A", or "from A through B".
 */
function span(ends: string[], opts: EnglishOptions): string {
  return ends.map(function bound(end, index) {
    return `${index === 0 ? words.from.text : opts.style.through} ${end}`;
  }).join(' ');
}

/** A unit after "every" or the number one, or after any other number. */
function unit(name: UnitName, count: number): string {
  return lexicon.units[name][count === 1 ? 'one' : 'many'].text;
}

/**
 * The time of day so many seconds after midnight, written to the hour
 * ("9"), always to the minute ("9:00") or to the second ("9:00:00").
 */
function momentAt(seconds: number, precision: 'hour' | 'minute' | 'second'):
  Moment {
  const within = seconds % secondsInDay;
  const moment = {
    exact: precision !== 'hour',
    hour: Math.floor(within / 3600),
    minute: Math.floor(within / 60) % 60
  };

  return precision === 'second' ? {...moment, second: within % 60} : moment;
}

function secondOfDay(moment: Moment): number {
  return moment.hour * 3600 + moment.minute * 60 + (moment.second ?? 0);
}

// A time and the a.m. or p.m. it would carry; noon, midnight and 24-hour
// times carry none.
function writeTime(moment: Moment, opts: EnglishOptions):
  {meridiem: string; text: string} {
  const {style} = opts;
  const parts = [moment.minute, moment.second]
    .filter(function present(part) {
      return typeof part === 'number';
    })
    .map(function twoDigits(part) {
      return lexicon.clockMinute(part as number).text;
    });

  if (!opts.ampm) {
    return {
      meridiem: '',
      text: [lexicon.clockMinute(moment.hour).text, ...parts].join(style.sep)
    };
  }

  const idiom = momentIdioms.find(function fits(row) {
    return row.applies(moment);
  });

  if (idiom) {
    return {meridiem: '', text: idiom.say(moment, opts).text};
  }

  // On the hour, the hour stands alone unless the minute must show.
  const alone = moment.minute === 0 && parts.length === 1 && !moment.exact;
  const shown = alone ? [] : parts;

  return {
    meridiem: moment.hour < 12 ? style.am : style.pm,
    text: [String(moment.hour % 12 || 12), ...shown].join(style.sep)
  };
}

/**
 * Times of day as they are written together. When every numbered time
 * shares a.m. or p.m., only the last one says it, provided the last time
 * is a numbered one and the times do not run past midnight.
 */
function timeNames(moments: Moment[], opts: EnglishOptions): string[] {
  const written = moments.map(function write(moment) {
    return writeTime(moment, opts);
  });
  const last = written[written.length - 1];
  const starts = moments.map(secondOfDay);
  const forward = starts[0] <= starts[starts.length - 1];
  const shared = forward && written.every(function same(time) {
    return !time.meridiem || time.meridiem === last.meridiem;
  });
  const gap = opts.style.closeUp ? '' : ' ';

  return written.map(function finish(time) {
    const silent = !time.meridiem || shared && time !== last;

    return silent ? time.text : time.text + gap + time.meridiem;
  });
}

/**
 * Hours as times, each at the same minute past, and the same second if
 * one is carried.
 */
function hourNames(
  hours: number[],
  at: Omit<Moment, 'hour'>,
  opts: EnglishOptions
): string[] {
  return timeNames(hours.map(function toMoment(hour) {
    return {...at, hour};
  }), opts);
}

/**
 * Days of the month. Alone they are ordinals after "the", said once for
 * a list or before each end of a range. Beside a month they are numbers,
 * with the month before the first or after the last as the style has it.
 */
function dayNames(
  days: number[],
  month: number | null,
  eachArticle: boolean,
  opts: EnglishOptions
): string[] {
  const names = days.map(function numeral(day) {
    return month === null || opts.style.ordinals ?
      lexicon.ordinal(day).text :
      lexicon.cardinal(day).text;
  });

  if (month === null) {
    return names.map(function article(name, index) {
      return index === 0 || eachArticle ? `${words.the.text} ${name}` : name;
    });
  }

  const at = opts.style.dayFirst ? names.length - 1 : 0;

  names[at] = opts.style.dayFirst ?
    `${names[at]} ${monthName(month, opts)}` :
    `${monthName(month, opts)} ${names[at]}`;

  return names;
}

function monthName(month: number, opts: EnglishOptions): string {
  return lexicon.months[month][opts.short ? 'short' : 'full'].text;
}

/** Where a weekday falls in the week as it is said: Monday first. */
function weekRank(day: number): number {
  return (day + 6) % 7;
}

/**
 * Weekdays in the order they are said: week order from Monday, with
 * Sunday last. A set that is one unbroken run is said in the order of
 * the run, so one that crosses from Sunday into Monday starts where the
 * run does.
 */
function walkWeek(days: number[]): number[] {
  const mondayFirst = days.slice().sort(function byMonday(a, b) {
    return weekRank(a) - weekRank(b);
  });
  const starts = mondayFirst.flatMap(function afterBreak(day, index) {
    const previous = mondayFirst.at(index - 1) as number;

    return (day - previous + 6) % 7 > 0 ? [index] : [];
  });
  const start = starts.length === 1 ? starts[0] : 0;

  return [...mondayFirst.slice(start), ...mondayFirst.slice(0, start)];
}

/** A recurring weekday ("Mondays") or a single one ("Monday"). */
function weekdayName(day: number, recurring: boolean, opts: EnglishOptions):
  string {
  const name = lexicon.weekdays[day];

  if (opts.short) {
    return name.short.text;
  }

  return recurring ? name.plural.text : name.full.text;
}

export {
  dayNames, extraWords, hourNames, join, list, momentAt, monthName, span,
  timeNames, unit, walkWeek, weekdayName, weekRank
};
