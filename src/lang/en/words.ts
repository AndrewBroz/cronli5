// Getting the words right: lists, names, numbers and times of day. Nothing
// here decides what is said or where it goes.

import type {EnglishOptions} from './options.js';
import type {Moment} from './idioms.js';
import lexicon from './lexicon.js';
import {momentIdioms} from './idioms.js';

type UnitName = keyof typeof lexicon.units;

const {words} = lexicon;

const secondsInDay = 86400;

/** Words joined by single spaces, leaving out any part that is silent. */
function join(...parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

/** "A", "A and B", "A, B, and C". */
function list(items: string[], opts: EnglishOptions): string {
  const and = ` ${words.and} `;

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
    return `${index === 0 ? words.from : opts.style.through} ${end}`;
  }).join(' ');
}

/** A unit after "every" or the number one, or after any other number. */
function unit(name: UnitName, count: number): string {
  return lexicon.units[name][count === 1 ? 'one' : 'many'];
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

// A time and the a.m. or p.m. it would carry; noon, midnight and 24-hour
// times carry none.
function writeTime(moment: Moment, opts: EnglishOptions):
  {meridiem: string; text: string} {
  const {style} = opts;
  const parts = [moment.minute, moment.second]
    .filter(function present(part) {
      return typeof part === 'number';
    })
    .map(function write(part) {
      return lexicon.twoDigits(part as number);
    });

  if (!opts.ampm) {
    return {
      meridiem: '',
      text: [lexicon.twoDigits(moment.hour), ...parts].join(style.sep)
    };
  }

  const idiom = momentIdioms.find(function fits(row) {
    return row.applies(moment);
  });

  if (idiom) {
    return {meridiem: '', text: idiom.say(moment, opts)};
  }

  // On the hour, the hour stands alone unless the minute must show.
  const alone = moment.minute === 0 && parts.length === 1 && !moment.exact;
  const shown = alone ? [] : parts;

  return {
    meridiem: moment.hour < 12 ? style.am : style.pm,
    text: [String(moment.hour % 12 || 12), ...shown].join(style.sep)
  };
}

/** Times of day, each numbered one with its own a.m. or p.m. */
function timeNames(moments: Moment[], opts: EnglishOptions): string[] {
  const gap = opts.style.closeUp ? '' : ' ';

  return moments.map(function write(moment) {
    const time = writeTime(moment, opts);

    return time.text + (time.meridiem && gap + time.meridiem);
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

function monthNames(months: number[], opts: EnglishOptions): string[] {
  return months.map(function nameOf(month) {
    return lexicon.months[month][opts.short ? 'short' : 'full'];
  });
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
      lexicon.ordinal(day) :
      String(day);
  });

  if (month === null) {
    return names.map(function article(name, index) {
      return index === 0 || eachArticle ? `${words.the} ${name}` : name;
    });
  }

  const [monthName] = monthNames([month], opts);
  const last = names.length - 1;

  if (opts.style.dayFirst) {
    names[last] = `${names[last]} ${monthName}`;
  }
  else {
    names[0] = `${monthName} ${names[0]}`;
  }

  return names;
}

/**
 * Values in the order of their cycle as it is said, each placed by its
 * `rank`, starting from `first` when a run that wraps round the cycle
 * begins there.
 */
function inCycleOrder(
  values: number[],
  rank: (value: number) => number,
  first?: number
): number[] {
  const ordered = values.slice().sort(function byRank(a, b) {
    return rank(a) - rank(b);
  });
  const at = Math.max(0, ordered.indexOf(first as number));

  return [...ordered.slice(at), ...ordered.slice(0, at)];
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
  const mondayFirst = inCycleOrder(days, weekRank);
  const starts = mondayFirst.filter(function afterBreak(day, index) {
    return (day - (mondayFirst.at(index - 1) as number) + 6) % 7 > 0;
  });

  return inCycleOrder(days, weekRank,
    starts.length === 1 ? starts[0] : mondayFirst[0]);
}

/** A recurring weekday ("Mondays") or a single one ("Monday"). */
function weekdayNames(days: number[], recurring: boolean,
  opts: EnglishOptions): string[] {
  const form = recurring ? 'plural' : 'full';

  return days.map(function nameOf(day) {
    return lexicon.weekdays[day][opts.short ? 'short' : form];
  });
}

export type {UnitName};
export {
  dayNames, hourNames, inCycleOrder, join, list, momentAt, monthNames, span,
  timeNames, unit, walkWeek, weekdayNames, weekRank
};
