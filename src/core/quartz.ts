// How the day fields are read. Two facts differ between schedulers, and
// each is applied here so the rest of the core faces canonical cron values.
//
// Weekday numbering: Quartz numbers the day-of-week 1 = Sunday … 7 =
// Saturday, while cron is 0/7 = Sunday, 1 = Monday. Reading one as the
// other silently shifts every weekday by one, so a Quartz `2` (Monday)
// would read as Tuesday.
//
// The `?` token: Quartz's "no specific value", absent from standard cron.
// Where it is rejected, a real Quartz pattern errors loudly instead of
// being mis-read; where it is allowed or required it is the equivalent of
// `*`.

import {Cronli5InputError} from './errors.js';
import type {CronLike} from './specs.js';
import type {Reading} from './reading.js';
import {isNonNegativeInteger} from './util.js';

// The error a rejected `?` raises: a clear pointer at the option that
// reads the pattern as Quartz.
const quartzTokenMessage =
  '`?` is a Quartz token — pass { cron: \'quartz\' } to read the pattern ' +
  'as Quartz.';

const requiredMessage =
  'Exactly one of the day-of-month and day-of-week fields must be `?` ' +
  'when `questionMark` is \'require\'.';

// Apply the reading's day-field facts in place on the raw cron-like
// object, before aliasing and validation: settle each `?`, then re-index
// the day-of-week to the canonical cron numbering (0 = Sunday). A reading
// with either fact missing is read as standard cron.
function applyReading(cronPattern: CronLike, reading: Partial<Reading>): void {
  const days: Array<'date' | 'weekday'> = ['date', 'weekday'];
  const marked = days.filter(function isMark(field) {
    return '' + cronPattern[field] === '?';
  });
  const rule = reading.questionMark ?? 'reject';

  if (rule === 'reject' && marked.length) {
    throw new Cronli5InputError(quartzTokenMessage);
  }

  if (rule === 'require' && marked.length !== 1) {
    throw new Cronli5InputError(requiredMessage);
  }

  marked.forEach(function open(field) {
    cronPattern[field] = '*';
  });

  if (reading.weekdaysFrom === 1) {
    cronPattern.weekday = reindexWeekday('' + cronPattern.weekday);
  }
}

// Re-index a Quartz day-of-week field to canonical cron numbering. Every
// numeric weekday position maps n -> n-1 (Quartz 1 = Sunday becomes cron 0),
// across singles, ranges, and step bounds, and inside the DOW operators `nL`
// (last weekday) and `n#k` (kth weekday). Day NAMES (`MON`) are unambiguous and
// left untouched, as is the bare `L` alias (Saturday in both numberings) and
// `*`. Quartz has no weekday 0; it is rejected here.
function reindexWeekday(value: string): string {
  if (value === '*') {
    return value;
  }

  return value.split(',').map(reindexSegment).join(',');
}

// Re-index one comma-separated weekday segment: a single, a range, or either
// of those followed by a `#k` or `L` operator (or a `/step`).
function reindexSegment(segment: string): string {
  const operator = (/(#\d+|L)$/).exec(segment);
  const suffix = operator ? operator[0] : '';
  const core = suffix ? segment.slice(0, -suffix.length) : segment;
  const step = core.split('/');
  const range = step[0].split('-').map(reindexNumber).join('-');
  const head = step.length === 2 ? range + '/' + step[1] : range;

  return head + suffix;
}

// Re-index a single weekday token: a number maps n -> n-1 (rejecting 0 and
// anything above 7, which Quartz does not use — re-indexing an out-of-range
// value would silently shift it onto a neighboring valid day); a name passes
// through unchanged.
function reindexNumber(token: string): string {
  if (!isNonNegativeInteger(token)) {
    return token;
  }

  if (token === '0' || +token > 7) {
    throw new Cronli5InputError(
      '`cronli5` was passed an invalid Quartz day-of-week value "' + token +
      '"; Quartz numbers weekdays 1 (Sunday) through 7 (Saturday).');
  }

  return '' + (+token - 1);
}

export {applyReading, quartzTokenMessage};
