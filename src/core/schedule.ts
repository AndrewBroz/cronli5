// A `Schedule` is the semantic contract between the core and a language
// renderer. The core (parse → validate → normalize → analyze) produces a
// `Schedule`, then a language module renders it to prose. These shapes are
// what any new language module interacts with. See docs/i18n-design.md.

import type {Cronli5Options} from '../types.js';

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
 * so many days before the last (`L-3`), or the weekday nearest a day
 * (`15W`).
 */
export type QuartzDate =
  | {kind: 'last'}
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
 */
export interface DayFacts {
  union: boolean;
  date: DateArm | null;
  weekday: WeekdayArm | null;
}

/** A discrete clock time: an hour and minute, with a second if one is set. */
export interface ClockTime {
  hour: number;
  minute: number;
  second: number | undefined;
}

/** A run of consecutive values; `from > to` wraps around a cyclic field. */
export interface RangeDescription {
  kind: 'range';
  from: number;
  to: number;
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
  | {kind: 'cadence'; interval: number; start: number; last: number}
  | {kind: 'pieces'; parts: Array<RangeDescription | ValuesDescription>}
  | {kind: 'except'; base: SetDescription; removed: number[]}
  | ValuesDescription;

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
  // A single non-zero second, which a clock time can carry ("9:00:15").
  clockSecond: number | undefined;
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
 * Options after a language module's `options()` has normalized them. `Style`
 * is the language's own style table (English's is `EnglishStyle`, in
 * `lang/en/options.ts`); the core never reads it.
 */
export interface NormalizedOptions<Style = unknown> {
  ampm: boolean;
  lenient: boolean;
  quartz: boolean;
  seconds: boolean;
  short: boolean;
  style: Style;
  years: boolean;
}

/** The interface every language module's default export implements. */
export interface Language<Style = unknown> {
  describe(schedule: Schedule, opts: NormalizedOptions<Style>): string;
  // The lenient-mode fallback description. Options-aware (like `reboot` and
  // `sentence`) so a dialect that changes whole words flows through the
  // arguments; a language with one fixed string ignores `opts`.
  fallback(opts: NormalizedOptions<Style>): string;
  options(options?: Cronli5Options): NormalizedOptions<Style>;
  reboot(opts: NormalizedOptions<Style>): string;
  // Wrap a rendered description into a complete standalone sentence (the CLI
  // form); each language owns its lead verb and punctuation.
  sentence(description: string, opts: NormalizedOptions<Style>): string;
}
