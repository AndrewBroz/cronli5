// The Ukrainian renderer: one sentence frame, the coarsest part first.
// A description is its year, its month, its day and its time, and after
// them the note one Quartz form adds.

import type {Language, Schedule} from '../../core/schedule.js';
import type {UkrainianOptions, UkrainianStyle} from './options.js';
import {hoursOf, timeOf} from './time.js';
import {regions, style, styles} from './options.js';
import {calendarOf} from './calendar.js';
import lexicon from './lexicon.js';
import {spell} from './spelling.js';
import {wraps} from './sets.js';

const {words} = lexicon;

/** The parts of a description, in the order they are said. */
export interface Parts {
  day: string;
  month: string;
  note: string;
  time: string;
  year: string;
}

// The words that say on their own how the days go.
const everyWords = [words.everyHour, words.everyMinute, words.everySecond];

function bracketed(text: string): string {
  return `(${text})`;
}

// A part that ends «включно» is closed by a comma.
function closed(part: string): string {
  return part + ','.repeat(Number(part.endsWith(words.inclusive)));
}

/**
 * The parts of a description, each spelled as it stands after the part
 * before it and closed by its mark; joined by spaces they are the
 * description.
 */
function describeParts(schedule: Schedule, opts: UkrainianOptions): Parts {
  const calendar = calendarOf(schedule, opts.style.short);

  // A schedule that never fires is that statement and nothing else.
  if (calendar.never) {
    return {day: calendar.day, month: '', note: '', time: '', year: ''};
  }

  const hours = hoursOf(schedule, calendar.open);
  const time = timeOf(schedule, hours, opts.style.hour12);
  // «Щодня» fills the level a restricted hour would skip, where nothing
  // else says how the days go: no day, no "every" word, and no run of
  // hours through the night (clock times listed one by one are no run).
  const listed = time.startsWith(`${words.at} `);
  const daily = calendar.day === '' && hours.kind !== 'all' &&
    (listed || !wraps(hours)) && !everyWords.some(function opens(word) {
      return time.startsWith(word);
    });
  const days = [calendar.day, words.everyDay][Number(daily)];
  // A note about the day follows the time, unless the time ends in
  // brackets of its own: then it stands beside the day, inside its mark,
  // in the brackets of the day's gloss where there is one.
  const aside = Number(time.endsWith(')'));
  const beside = [calendar.gloss, ...[calendar.note].slice(1 - aside)]
    .filter(Boolean).join('; ');
  const asked = [calendar.condition].filter(Boolean).map(function ask(text) {
    return `, ${text}`;
  });
  const day = [days, ...[beside].filter(Boolean).map(bracketed)].join(' ') +
    asked.join() + calendar.mark;
  const after = [calendar.note].slice(aside).filter(Boolean).map(bracketed)
    .join();
  let before = '';
  const [year, month, dayPart, timePart, note] =
    [closed(calendar.year), closed(calendar.month), closed(day), time, after]
      .map(function spelled(part) {
        const text = spell(part, before);

        before = text.split(' ').pop() || before;

        return text;
      });

  return {day: dayPart, month, note, time: timePart, year};
}

function describe(schedule: Schedule, opts: UkrainianOptions): string {
  const parts = describeParts(schedule, opts);

  return [parts.year, parts.month, parts.day, parts.time, parts.note]
    .filter(Boolean).join(' ');
}

// A label starts with a capital letter.
function label(description: string): string {
  return description.charAt(0).toUpperCase() + description.slice(1);
}

// The lead ends in a vowel, so the description's first word is spelled
// after it; a description that ends in a short name's full stop gets no
// second one. A schedule that never fires takes the negated lead.
function sentence(description: string): string {
  const lead = [words.runs, words.neverRuns][
    Number(description.startsWith(words.never))];
  const text = `${lead} ${spell(description, lead)}`;

  return text + '.'.repeat(Number(!text.endsWith('.')));
}

function reboot(): string {
  return words.startup;
}

function fallback(): string {
  return words.unrecognizable;
}

const ukrainian: Language<UkrainianStyle> = {
  code: 'uk',
  defaultStyle: 'standard',
  describe,
  fallback,
  label,
  reboot,
  regions,
  sentence,
  style,
  styles
};

export type {UkrainianStyle};
export {describeParts, styles};
export default ukrainian;
