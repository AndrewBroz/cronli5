// A `Schedule` is the semantic contract between the core and a language
// renderer. The core (parse → validate → normalize → analyze) produces a
// `Schedule`, then a language module renders it to prose. These shapes are
// what any new language module interacts with. See docs/i18n-design.md.

import type {Reading} from './reading.js';

/** A cron field name, in canonical order. */
export type Field =
  'second' | 'minute' | 'hour' | 'date' | 'month' | 'weekday' | 'year';

/** The syntactic shape the core classified a field into. */
export type Shape =
  'wildcard' | 'quartz' | 'list' | 'step' | 'range' | 'single';

/** The canonical, normalized cron pattern: every field a string. */
export type Pattern = Record<Field, string>;

/** Per-field shape classification. */
export type Shapes = Record<Field, Shape>;

/**
 * A Quartz day-of-month form: the last day (`L`), the last weekday (`LW`),
 * so many days before the last (`L-3`), the weekday nearest a day
 * (`15W`), or the first weekday (`1W`: the nearest weekday never leaves
 * its month, so the one nearest the 1st is the month's first).
 */
export type QuartzDate =
  | {kind: 'last'}
  | {kind: 'firstWeekday'}
  | {kind: 'lastWeekday'}
  | {kind: 'beforeLast'; days: number}
  | {kind: 'nearestWeekday'; day: number};

/**
 * A Quartz day-of-week form: the last such weekday of the month (`5L`) or
 * the nth (`1#2`). The weekday is cron's number, 0 for Sunday.
 */
export type QuartzWeekday =
  | {kind: 'last'; weekday: number}
  | {kind: 'nth'; weekday: number; nth: number};

/**
 * The classified day-of-month arm: a Quartz form, or a plain set of values
 * (described by the field's candidates).
 */
export type DateArm =
  | {kind: 'quartz'; form: QuartzDate}
  | {kind: 'values'};

/** The classified day-of-week arm: a Quartz form or a plain set of values. */
export type WeekdayArm =
  | {kind: 'quartz'; form: QuartzWeekday}
  | {kind: 'values'};

/**
 * Day-field facts: whether the pattern restricts both day fields (cron's
 * DOM-or-DOW union) and each restricted arm's classification (`null` for a
 * wildcard field). Semantic only — words and frames stay per-language.
 *
 * `union` says how the two fields combine, not what the months allow:
 * it stays true when the date arm never fires in a reached month (only
 * the weekday arm is left) and when the date arm is every day the
 * reached months have (the union is then every day). `dateReach` says
 * which. A day field that names every value without a leading `*`
 * (`1-31`, `0-6`) beside another restricted day field is every day in
 * cron, and arrives here as two wildcards.
 */
export interface DayFacts {
  union: boolean;
  date: DateArm | null;
  weekday: WeekdayArm | null;
}

/**
 * When the day-of-month arm can fire, given the months and years the
 * pattern reaches. Present only when there is something to say: the arm
 * skips a reached month, or fires in it only in leap years, or a plain
 * set of days holds a day no reached month has, or holds every day the
 * reached months have. The three month lists are disjoint and together
 * are the reached months, in ascending order.
 *
 * `leapYears` is February when the arm needs its 29th day (`29`, `29W`,
 * `L-28`) and the pattern reaches both leap and common years. When the
 * year field reaches only one sort of year, February is in `everyYear` or
 * `never` accordingly.
 *
 * `days` is for a plain set of days (`null` for a Quartz form): the
 * candidates for the days that exist in at least one reached month, in
 * the same form as `candidates.date` (empty when none does), and whether
 * they are every day of every reached month. When `everyDay` is true the
 * date field restricts nothing: the pattern fires every day of the
 * reached months, whether or not `day.union` is set.
 */
export interface DateReach {
  // False when the date arm never fires in any reached month. In a union
  // the weekday arm still fires.
  fires: boolean;
  everyYear: number[];
  leapYears: number[];
  never: number[];
  days: {candidates: SetDescription[]; everyDay: boolean} | null;
}

/** A discrete clock time: an hour and minute, with a second if one is set. */
export interface ClockTime {
  hour: number;
  minute: number;
  second: number | undefined;
}

/**
 * A run of consecutive values; `from > to` wraps around a cyclic field.
 * `open` marks a run that reaches the end of a field that does not cycle
 * (the year): it has no last value worth naming, only a start.
 */
export interface RangeDescription {
  kind: 'range';
  from: number;
  to: number;
  open?: true;
}

/**
 * Evenly spaced values, from `start` to `last`. `open` marks a cadence in
 * a field that does not cycle (the year) with no further value before the
 * field's end: it goes on for good, and `last` is not worth naming.
 */
export interface CadenceDescription {
  kind: 'cadence';
  interval: number;
  start: number;
  last: number;
  open?: true;
}

/** Values named one by one. */
export interface ValuesDescription {
  kind: 'values';
  values: number[];
}

/**
 * One way to describe a set of field values: the whole field, a range, an
 * evenly spaced cadence, several pieces, a simpler set with a few values
 * removed, or the values named one by one. Set arithmetic only — which of
 * these a language can say, and which reads best, is the language's call.
 */
export type SetDescription =
  | {kind: 'all'}
  | RangeDescription
  | CadenceDescription
  | {kind: 'pieces'; parts: Array<RangeDescription | ValuesDescription>}
  | {kind: 'except'; base: SetDescription; removed: number[]}
  | ValuesDescription;

/**
 * A set as runs and cadences together, for a set no single description
 * fits: 2030 through 2032 and then every 2nd year from 2034; every 4th
 * year from 2030, and 2031; minutes 0 to 20 by twos and 21 to 57 by
 * threes. It is not among a field's candidates (a renderer written before
 * it existed never meets it) and is offered beside them.
 *
 * The parts are disjoint and together are the set. They are in order of
 * their first value and never wrap, but they may interleave: a part's
 * values can fall between another's. At least one part is a cadence, and
 * there is at most one `values` part.
 */
export interface CadencePieces {
  kind: 'cadencePieces';
  parts: Array<RangeDescription | CadenceDescription | ValuesDescription>;
}

/**
 * How a set's descriptions are to be laid out, when not as the field's own
 * candidates are. `first` is the value a cyclic field is walked from (the
 * weekday a language's week starts on): runs, wraps, lists and tie-breaks
 * are all relative to it, so a range wraps when it passes from the value
 * before `first` to `first`, whatever its numbers are. `linear` cuts every
 * run at the edge of the unit, so nothing wraps and the stretches come in
 * ascending order.
 */
export interface SetView {
  first?: number;
  linear?: boolean;
}

/** The values a field can take. */
export interface Domain {
  min: number;
  max: number;
  cyclic: boolean;
}

/** The semantic analyses the core attaches to the pattern for rendering. */
export interface Analyses {
  // Every compact description of each field's value set, in tie-break
  // order: a wildcard field is `[{kind: 'all'}]`, a Quartz field (not a
  // plain set) is `null`.
  candidates: Record<Field, SetDescription[] | null>;
  // Each field's values as runs and cadences together, when they are
  // that; `null` otherwise. With it no field's
  // shortest description is a list of hundreds of values.
  cadencePieces: Record<Field, CadencePieces | null>;
  // A single non-zero second, which a clock time can carry ("9:00:15").
  clockSecond: number | undefined;
  // When the day-of-month arm can fire in the months the pattern reaches;
  // `null` in the common case, where nothing needs saying.
  dateReach: DateReach | null;
  day: DayFacts;
  // The kind of description each field was written as (`*/12` is a
  // cadence, `0,12` values), `null` for a Quartz form. A language may use
  // it only to choose between phrasings it judges equally easy.
  written: Record<Field, SetDescription['kind'] | null>;
}

/**
 * The neutral schedule facts: the language-independent facts about a pattern,
 * carrying no phrasing decision. `analyze` produces this, and it is all a
 * language is given (docs/i18n-design.md §2.2).
 */
export interface ScheduleFacts {
  pattern: Pattern;
  shapes: Shapes;
  analyses: Analyses;
}

/** The semantic schedule a language renders: the neutral facts. */
export type Schedule = ScheduleFacts;

/**
 * The options a description is rendered under, after the entry point has
 * resolved them: how the pattern is read, and the language's style table.
 * `Style` is the language's own table (English's is `EnglishStyle`, in
 * `lang/en/options.ts`); the core never reads it.
 */
export interface NormalizedOptions<Style = unknown> extends Reading {
  lenient: boolean;
  style: Style;
}

/** The interface every language module's default export implements. */
export interface Language<Style = unknown> {
  // The language's code, as callers name it: `en`, `uk`.
  code: string;
  // The key of `styles` used when no region selects another.
  defaultStyle: string;
  describe(schedule: Schedule, opts: NormalizedOptions<Style>): string;
  // The lenient-mode fallback description. Options-aware (like `reboot`,
  // `label` and `sentence`) so a style that changes whole words flows
  // through the arguments; a language with one fixed string ignores `opts`.
  fallback(opts: NormalizedOptions<Style>): string;
  // A description standing alone as a label, capitalised as the language
  // capitalises one.
  label(description: string, opts: NormalizedOptions<Style>): string;
  // Region codes in upper case, each naming a key of `styles`.
  regions: {[region: string]: string};
  reboot(opts: NormalizedOptions<Style>): string;
  // Wrap a rendered description into a complete standalone sentence (the CLI
  // form); each language owns its lead verb and punctuation.
  sentence(description: string, opts: NormalizedOptions<Style>): string;
  // A named table with a caller's overrides applied. Throws
  // `Cronli5OptionError` for a field the table lacks or a value of the
  // wrong kind.
  style(base: string, overrides?: unknown): Style;
  // The named whole tables.
  styles: {[name: string]: Readonly<Style>};
}
