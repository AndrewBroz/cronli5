// How each cRonstrue option translates: mapped onto a cronli5 option, or
// refused where cronli5 has no equivalent. This one table drives the
// adapter, its tests, and the option table in
// docs/migrating-from-cronstrue.md, so the three cannot drift apart.

import {Cronli5OptionError} from '../core/errors.js';

/** The cronli5 options an adapter call builds up. */
export interface Translated {
  lang?: string;
  lenient?: boolean;
  style: {hour12?: boolean};
  weekdaysFrom?: 0 | 1;
}

/** One cRonstrue option: what it becomes, and how to apply a value. */
export interface Row {
  option: string;
  // What it becomes in cronli5's own API, for the documentation.
  becomes: string;
  note: string;
  translate(
    value: unknown,
    into: Translated,
    all: {[option: string]: unknown}
  ): void;
}

// An option cronli5 cannot honour is refused once it is switched on; its
// off value is what cronli5 does anyway.
function refused(option: string, why: string): Row {
  return {
    translate(value) {
      if (value) {
        throw new Cronli5OptionError(
          `cronli5 cannot honour cRonstrue's \`${option}\`: ${why}`);
      }
    },
    becomes: 'refused',
    note: why,
    option
  };
}

const table: Row[] = [
  {
    translate(value, into) {
      if (typeof value === 'string') {
        into.lang = value.replace('_', '-');
      }
    },
    becomes: '`lang`',
    note: '`pt_BR` becomes `pt-BR`. A language cronli5 does not ship is ' +
      'an error; cRonstrue answers in English.',
    option: 'locale'
  },
  {
    translate(value, into) {
      if (value) {
        into.style.hour12 = false;
      }
    },
    becomes: '`style: {hour12: false}`',
    note: '24-hour times are zero-padded (`09:00`).',
    option: 'use24HourTimeFormat'
  },
  {
    translate(value, into) {
      if (value === false) {
        into.lenient = true;
      }
    },
    becomes: '`lenient: true` when `false`',
    note: 'cronli5 returns its fallback text, not the parser\'s message.',
    option: 'throwExceptionOnParseError'
  },
  {
    translate(value, into) {
      if (value === false) {
        into.weekdaysFrom = 1;
      }
    },
    becomes: '`weekdaysFrom: 1` when `false`',
    note: '1 is Sunday through 7 for Saturday.',
    option: 'dayOfWeekStartIndexZero'
  },
  {
    translate(value, into, all) {
      if (value && all.use24HourTimeFormat) {
        throw new Cronli5OptionError(
          'cronli5 cannot honour cRonstrue\'s `trimHoursLeadingZero` ' +
          'with `use24HourTimeFormat`: its 24-hour times are always ' +
          'zero-padded.');
      }
    },
    becomes: 'accepted',
    note: 'cronli5\'s 12-hour times never have a leading zero. Refused ' +
      'together with `use24HourTimeFormat`, whose times always do.',
    option: 'trimHoursLeadingZero'
  },
  refused('verbose',
    'cronli5 says "every day" where it helps and is otherwise brief.'),
  refused('monthStartIndexZero',
    'cronli5 always reads 1 as January.'),
  refused('logicalAndDayFields',
    'cronli5 reads a day of the month and a weekday as "either", as ' +
    'classic cron does.'),
  refused('tzOffset',
    'cronli5 describes the fields as written and does not shift times.')
];

export {table};
