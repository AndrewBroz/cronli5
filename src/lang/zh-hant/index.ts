// Traditional Chinese (zh-Hant), built from its answers: the sentence is
// four parts in one order, from large to small (frame, day, time,
// closing), and each part ends with the join that follows it.

import type {
  Language, NormalizedOptions, Schedule, SetDescription
} from '../../core/schedule.js';
import {type ZhHantStyle, regions, style, styles} from './options.js';
import {narrowsDays, sayCalendar} from './calendar.js';
import type {Said} from './stretches.js';
import {candidatesAs} from '../../core/index.js';
import lexicon from './lexicon.js';
import {sayTime} from './time.js';

const {words} = lexicon;

/** The options a Traditional Chinese description is rendered under. */
export type ZhHantOptions = NormalizedOptions<ZhHantStyle>;

/** The four parts of a description, which joined are the description. */
export interface ZhHantParts {
  closing: string;
  day: string;
  frame: string;
  time: string;
}

// The two texts for a schedule whose date exists in no month it reaches.
const neverTexts = [words.never, words.neverInTheseYears];

// What stands between the calendar and the time: a half-width space
// where a digit of a clock time would touch a Chinese character; a comma
// before any other time, unless the calendar is nothing, ends in a comma
// of its own, or closes on the bare word for "every day" (before hours
// named) or for "that year".
function joinBefore(said: Said, calendar: string): string {
  const open = calendar === '' ||
    [words.comma, words.everyDay, words.thatYear].some(function closes(end) {
      return calendar.endsWith(end);
    });
  const touching = (/\p{Script=Han}$/u).test(calendar) &&
    (/^\d/u).test(said.text);
  const space = touching ? ' ' : '';
  const comma = open ? '' : words.comma;

  return said.clock ? space : comma;
}

/**
 * The parts of a description: the frame (years and months), the day, the
 * time, and the closing bracket for months or years left out.
 * @internal
 */
export function describeParts(schedule: Schedule, opts: ZhHantOptions):
  ZhHantParts {
  const {candidates, dateReach: reach, day} = schedule.analyses;

  // A date that exists in no month the pattern reaches: it never fires,
  // and no time is said.
  if (reach !== null && !reach.fires && !day.union) {
    return {
      closing: '',
      day: neverTexts[Number(reach.firesInOtherYears)],
      frame: '',
      time: ''
    };
  }

  // Hours may run past midnight only when every day fires.
  const hour = narrowsDays(schedule) ?
    candidatesAs(schedule, 'hour', {linear: true}) :
    candidates.hour;
  const said = sayTime({
    hour: hour as SetDescription[],
    mixed: schedule.analyses.cadencePieces,
    minute: candidatesAs(schedule, 'minute', {linear: true}) as
      SetDescription[],
    second: candidatesAs(schedule, 'second', {linear: true}) as
      SetDescription[]
  }, opts.style);
  const calendar = sayCalendar(schedule, said.anchored, opts.style);
  const join = joinBefore(said, calendar.frame + calendar.day);

  return {
    closing: calendar.closing,
    day: calendar.day && calendar.day + join,
    frame: calendar.day ? calendar.frame : calendar.frame + join,
    time: said.text
  };
}

function describe(schedule: Schedule, opts: ZhHantOptions): string {
  const parts = describeParts(schedule, opts);

  return parts.frame + parts.day + parts.time + parts.closing;
}

// A description as a sentence. A schedule that never fires is its own
// sentence, with no lead.
function sentence(description: string): string {
  const lead = neverTexts.includes(description) ? '' : words.runsAt;

  return lead + description + words.fullStop;
}

const zhHant: Language<ZhHantStyle, 'zh-Hant'> = {
  code: 'zh-Hant',
  defaultStyle: 'tw',
  describe,
  fallback() {
    return words.unrecognizable;
  },
  label(description) {
    return description;
  },
  reboot() {
    return words.startup;
  },
  regions,
  sentence,
  style,
  styles
};

export type {ZhHantStyle};
export {styles};
export default zhHant;
