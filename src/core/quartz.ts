// Quartz input semantics. cronli5 accepts Quartz tokens (`?`, `L`, `W`, `#`),
// but Quartz numbers the day-of-week differently from standard cron: Quartz is
// 1 = Sunday … 7 = Saturday, while cron is 0/7 = Sunday, 1 = Monday. Reading a
// Quartz pattern with cron indexing silently shifts every weekday by one, so a
// Quartz `2` (Monday) would read as Tuesday. This module gates and re-indexes
// the input so the rest of the core keeps facing canonical cron values.
//
// The `?` token (Quartz's "no specific value", mandatory in Quartz, absent in
// standard cron) is the unambiguous mark of a Quartz pattern. Outside Quartz
// mode it is rejected outright rather than aliased to `*`, so a real Quartz
// cron errors loudly instead of being mis-read; inside Quartz mode it is the
// equivalent of `*`.

import {Cronli5InputError} from './errors.js';
import type {CronLike} from './specs.js';
import {isNonNegativeInteger} from './util.js';

// The error a `?` raises outside Quartz mode: a clear pointer at the option
// that makes Quartz semantics (and `?`) available.
const quartzTokenMessage =
  '`?` is a Quartz token — pass { quartz: true } to enable Quartz semantics.';

// In standard (non-Quartz) mode, `?` is not a valid value: reject it with a
// pointer at the `quartz` option. In Quartz mode, accept `?` as `*` and
// re-index the day-of-week from Quartz numbering (1 = Sunday) to the canonical
// cron numbering (0 = Sunday) the rest of the core expects. Operates in place
// on the raw cron-like object, before aliasing and validation.
function applyQuartz(cronPattern: CronLike, quartz: boolean): void {
  if (!quartz) {
    rejectQuartzToken(cronPattern.date);
    rejectQuartzToken(cronPattern.weekday);

    return;
  }

  if ('' + cronPattern.date === '?') {
    cronPattern.date = '*';
  }

  if ('' + cronPattern.weekday === '?') {
    cronPattern.weekday = '*';

    return;
  }

  cronPattern.weekday = reindexWeekday('' + cronPattern.weekday);
}

// Throw the Quartz-token error if a field is exactly `?`.
function rejectQuartzToken(value: string | number): void {
  if ('' + value === '?') {
    throw new Cronli5InputError(quartzTokenMessage);
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

export {applyQuartz, quartzTokenMessage};
