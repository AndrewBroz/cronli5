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
export type Pattern = Record<Field, string> & {

  /**
   * Set when a day field was written with a leading `*` and both day
   * fields still narrow the days: cron then needs both to match. It is
   * noted before the fields are made canonical, which is the one place the
   * core asks how a field was written.
   */
  bothDays?: true;
};

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
 *
 * `nearestDayIsLast` is for the weekday nearest a day (`15W`; `null` for
 * every other date arm). The scheduler never leaves the month, so where
 * the day is a month's last and falls on a Sunday the day used is the
 * Friday before, and there is no "Monday after". It says whether the day
 * is the last day of the months the form fires in, over the years the
 * pattern reaches: `always` (`31W`; `30W` in June; `29W` in February,
 * which fires in leap years only), `never` (`15W`; `30W` in July; also a
 * form that fires in no reached month), or `sometimes` (`30W` in every
 * month; `28W`, which ends February in common years only; `29W`, which
 * ends it in leap years only).
 *
 * `dateAddsNothing` is true only in a union, when every day the date arm
 * can fire on is a day the weekday arm fires on anyway, so the pattern is
 * the weekday arm alone. That is so in exactly two cases: the date arm
 * never fires in any reached month (`dateReach.fires` is false: `31 6 1`),
 * or it is a form that only lands on Monday to Friday (`1W`, `15W`, `LW`)
 * and the weekday arm is a plain set holding all of Monday to Friday
 * (`15W * 1-5`). It is false for every other union, including a plain
 * date beside Monday to Friday: a date falls on every day of the week
 * over the years. `union` is not changed by it.
 */
export interface DayFacts {
  union: boolean;

  /**
   * True when both day fields narrow the days and both must match: one of
   * them was written with a leading star (a step from the star), which
   * cron takes for
   * unrestricted and so combines by "and": a date field of every second
   * day beside Monday is the Mondays that are odd days of the month. Never
   * true together with `union`.
   */
  both: boolean;
  date: DateArm | null;
  weekday: WeekdayArm | null;
  nearestDayIsLast: 'always' | 'sometimes' | 'never' | null;
  dateAddsNothing: boolean;
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
  // Why it never fires. True when `fires` is false only because of the
  // years reached: the date arm would fire in a reached month in some
  // other year (29 February when no reached year is a leap year). False
  // when the date exists in no year (31 June), and whenever `fires` is
  // true.
  firesInOtherYears: boolean;
  everyYear: number[];
  leapYears: number[];
  never: number[];
  days: {candidates: SetDescription[]; everyDay: boolean} | null;
}

/**
 * The months of one length that the day-of-month arm fires in. `years` is
 * `every` except for February when the pattern reaches both leap and
 * common years: it is then in two groups, 28 days in `common` years and
 * 29 in `leap` years. When the year field reaches only one sort of year
 * February is in one group, marked `every`.
 */
export interface MonthLengths {
  length: number;
  months: number[];
  years: 'every' | 'common' | 'leap';
}

/**
 * Days of a plain day-of-month set that the same reached months have:
 * `months` are the groups, by length, of every reached month that has
 * these days, and `everyMonth` says they are all the reached months in
 * all the years reached. A day February has only in leap years has
 * February's `leap` group and not its `common` one.
 */
export interface DaysInMonths {
  days: number[];
  months: MonthLengths[];
  everyMonth: boolean;
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
 * What it promises: the parts together are exactly the set. They are in
 * order of their first value and never wrap. At least one part is a
 * cadence, there are at least two parts, and there is at most one
 * `values` part. Parts may interleave (a part's values can fall between
 * another's), and two parts may share a value where two cadences cross
 * (every 7th year from 2030 and every 11th from 2031 both hold 2086):
 * a value is never left out of a cadence it lies on to keep the parts
 * disjoint, when that would break the cadence into more parts.
 *
 * Of the ways to split a set, the one that names fewest things is
 * offered (a range or a cadence names two, a list each of its values).
 * It is found by trying three orders of taking, not by an exhaustive
 * search, so it is the fewest of those. A tie is settled by the set
 * alone, never by how the field was written, by the first of these that
 * tells the ways apart: no value held by two parts; fewest values left
 * in the list; long runs taken as ranges first; the widest progression
 * taken first, so that a value two cadences could both take goes to the
 * longer of them (days 1 to 9 by twos and 11 to 29 by threes, not 1 to
 * 11 and 14 to 29).
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
  // The months the day-of-month arm fires in, grouped by how many days
  // they have, shortest first: every reached month when the field is
  // unrestricted, none when the arm never fires. A group is left out when
  // the arm cannot fire in a month that short (`L-30` fires only in the
  // group of 31; `29`, `29W` and `L-28` in February only in its leap-year
  // group). The last day of a group's months is its `length`, so the day
  // `L-3` comes to there is `length - 3`. The first group's length is the
  // greatest day every firing month has, the last group's the greatest
  // any has. Always present, whatever `dateReach` is.
  monthLengths: MonthLengths[];
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
