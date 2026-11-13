// The words a style changes: how a clock time is written, the names of
// months and weekdays, and the spelling of «außer».

import lexicon from './lexicon.js';
import type {GermanStyle} from './options.js';

const {dayParts, januaryAustrian, months, twoDigits, weekdays, words} =
  lexicon;

/** The style's own words, ready to be said. */
export interface Voice {
  // A clock time from its hour and its minute, with a second if one is
  // given: «9:00», «9:00:30», and in 12-hour style «9:00 Uhr morgens».
  clock(hour: number, rest: number[]): string;
  except: string;
  month(month: number): string;
  // What follows the last time of a list or a window: « Uhr», or nothing
  // where each time carries its own.
  oClock: string;
  // A weekday that recurs: «montags».
  weekday(weekday: number): string;
  // A weekday as a noun: «Montag».
  weekdayNoun(weekday: number): string;
}

/** A time as a 24-hour clock shows it, in every style: «17:05». */
function clock24(hour: number | string, rest: number[]): string {
  return [hour, ...rest.map(twoDigits)].join(':');
}

/** A minute of the hour, with a second if one is given: «:05», «:05:30». */
function mark(rest: number[]): string {
  return clock24('', rest);
}

// Hour 0 is written as on the 24-hour clock and has no part of the day.
function clock12(hour: number, rest: number[]): string {
  const part = dayParts.filter(function covers(dayPart) {
    return hour > 0 && hour <= dayPart.until;
  }).slice(0, 1).map(function wordOf(dayPart) {
    return dayPart.word;
  });
  const half = 12;

  return [clock24(hour - half * Number(hour > half), rest), words.oClock,
    ...part].join(' ');
}

function voiceOf(style: GermanStyle): Voice {
  const [name, recurring] = style.short ?
    ['short' as const, 'short' as const] :
    ['full' as const, 'adverb' as const];
  const [clock, oClock] = style.hour12 ?
    [clock12, ''] :
    [clock24, ` ${words.oClock}`];
  const january = style.jaenner ? januaryAustrian : months[1];

  return {
    clock,
    except: style.eszett ? words.except : words.exceptSwiss,
    month(month) {
      return [months[month], january][Number(month === 1)][name];
    },
    oClock,
    weekday(weekday) {
      return weekdays[weekday][recurring];
    },
    weekdayNoun(weekday) {
      return weekdays[weekday][name];
    }
  };
}

export {clock24, mark, voiceOf};
