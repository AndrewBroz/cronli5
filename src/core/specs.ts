// Field specifications, macros, and core policy constants.

import type {Field} from './ir.js';

/**
 * A parsed but not-yet-canonical cron pattern: every field present, values
 * still as the caller gave them (string or number) until normalization
 * settles them to canonical strings (a `Pattern`).
 */
export type CronLike = Record<Field, string | number>;

/** The validation/enumeration facts about one cron field. */
export interface FieldSpec {
  min: number;
  max: number;
  cyclic?: boolean;
  top?: number;
  aliases?: {[token: string]: string};
  numbers?: {[name: string]: number};
}

// Weekday index by abbreviation, used to resolve named step bounds.
const weekdayNumbers: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
};

// Month number by abbreviation, used to resolve named step bounds.
const monthNumbers: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12
};

// Allowed numeric ranges (and name tables, where applicable) per field.
// Cyclic fields wrap, so a reversed range (`22-2`) is a meaningful
// wrap-around window. The year field does not wrap. `top` is the last
// value a step enumerates to: for weekdays it is Saturday (6), below the
// validation `max` of 7, which is Sunday again.
const fieldSpecs: Record<Field, FieldSpec> = {
  second: {cyclic: true, max: 59, min: 0, top: 59},
  minute: {cyclic: true, max: 59, min: 0, top: 59},
  hour: {cyclic: true, max: 23, min: 0, top: 23},
  date: {aliases: {'?': '*'}, cyclic: true, max: 31, min: 1, top: 31},
  month: {cyclic: true, max: 12, min: 1, numbers: monthNumbers, top: 12},
  weekday: {aliases: {'?': '*', L: '6'}, cyclic: true, max: 7, min: 0,
    numbers: weekdayNumbers, top: 6},
  year: {max: 9999, min: 1970}
};

// The order in which fields are validated.
const fieldOrder: Field[] = [
  'second',
  'minute',
  'hour',
  'date',
  'month',
  'weekday',
  'year'
];

// Nickname macros (e.g. `@daily`) expand to their five-field equivalents.
// `@reboot` has no time schedule and so is intentionally omitted.
const macros: Record<string, string> = {
  '@annually': '0 0 1 1 *',
  '@yearly':   '0 0 1 1 *',
  '@monthly':  '0 0 1 * *',
  '@weekly':   '0 0 * * 0',
  '@daily':    '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly':   '0 * * * *'
};

// Enumerating more clock times than this reads as a wall of text, so
// longer expansions compact into per-segment windows instead.
const maxClockTimes = 6;

export {fieldOrder, fieldSpecs, macros, maxClockTimes, monthNumbers,
  weekdayNumbers};
