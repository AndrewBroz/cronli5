// How a pattern is read: a few independent facts about the scheduler it
// was written for. A caller usually knows the scheduler, not the facts, so
// a named flavour sets them all and any one of them can be given alone.

import {Cronli5OptionError} from './errors.js';

/** Whether a day field may, or must, be `?` ("no specific value"). */
export type QuestionMark = 'reject' | 'allow' | 'require';

/** The facts that decide how a pattern's fields are read. */
export interface Reading {
  // A six-field pattern starts with seconds.
  seconds: boolean;
  // A six-field pattern ends with a year.
  years: boolean;
  // The number that means Sunday: 0 (and 7) in classic cron, 1 in Quartz.
  weekdaysFrom: 0 | 1;
  questionMark: QuestionMark;
}

/** The reading options a caller may give. */
export interface ReadingOptions {
  cron?: unknown;
  seconds?: unknown;
  years?: unknown;
  weekdaysFrom?: unknown;
  questionMark?: unknown;
}

const flavours: {[name: string]: Reading} = {
  // Quartz numbers weekdays from 1 and writes `?` in a day field. The
  // question mark is allowed, not demanded: patterns written for
  // Quartz-like schedulers often leave it out.
  quartz: {
    questionMark: 'allow',
    seconds: false,
    weekdaysFrom: 1,
    years: false
  },
  standard: {
    questionMark: 'reject',
    seconds: false,
    weekdaysFrom: 0,
    years: false
  }
};

// The values each flag may take.
const allowed: {[flag in keyof Reading]: unknown[]} = {
  questionMark: ['reject', 'allow', 'require'],
  seconds: [true, false],
  weekdaysFrom: [0, 1],
  years: [true, false]
};

function quoted(values: unknown[]): string {
  return values.map(function show(value) {
    return JSON.stringify(value);
  }).join(', ');
}

/** The reading a caller's options select: a flavour, then explicit flags. */
function readingOf(options: ReadingOptions): Reading {
  const name = typeof options.cron === 'undefined' ?
    'standard' :
    options.cron;

  if (typeof name !== 'string' || !Object.hasOwn(flavours, name)) {
    throw new Cronli5OptionError(
      `\`cron\` is ${JSON.stringify(name)}; the flavours are ` +
      `${quoted(Object.keys(flavours).sort())}.`);
  }

  const reading: {[flag: string]: unknown} = {...flavours[name]};

  (Object.keys(allowed) as Array<keyof Reading>).forEach(
    function override(flag) {
      const value = options[flag];

      if (typeof value === 'undefined') {
        return;
      }

      if (!allowed[flag].includes(value)) {
        throw new Cronli5OptionError(
          `\`${flag}\` is ${JSON.stringify(value)}; it may be ` +
          `${quoted(allowed[flag])}.`);
      }

      reading[flag] = value;
    }
  );

  return reading as unknown as Reading;
}

export {readingOf};
