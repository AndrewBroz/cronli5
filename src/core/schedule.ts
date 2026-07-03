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
 * One classified piece of a field. `value`/`bounds` keep their original
 * tokens (e.g. `'FRI'`, `'JAN'`) for later name resolution; only a step's
 * `fires` are enumerated to numbers.
 */
export type Segment =
  | {kind: 'single'; value: string}
  | {kind: 'range'; bounds: [string, string]}
  | {kind: 'step'; fires: number[]; interval: number; startToken: string};

/** A discrete clock time the core folds minute/second into. */
export interface ClockTime {
  hour: number;
  minute: number;
  second: number | undefined;
}

/** The hours accompanying a minute-frequency plan. */
export type HoursPlan =
  | {kind: 'none'}
  | {kind: 'step'}
  | {kind: 'window'; from: number; to: number; last: number}
  | {kind: 'during'; times: HourTimesPlan};

/** Hour times: enumerated fires, or deferred to per-segment rendering. */
export type HourTimesPlan =
  | {kind: 'fires'; fires: number[]}
  | {kind: 'segments'};

/**
 * The rendering plan the core selects for a pattern. The `kind`
 * discriminant tells a renderer which fields are present.
 */
export type PlanNode =
  | {kind: 'everySecond'}
  | {kind: 'standaloneSeconds'}
  | {kind: 'secondPastMinute'}
  | {kind: 'secondsWithinMinute'; singleSecond: boolean}
  | {kind: 'composeSeconds'; rest: PlanNode}
  | {kind: 'everyMinute'}
  | {kind: 'singleMinute'}
  | {kind: 'rangeOfMinutes'}
  | {kind: 'multipleMinutes'}
  | {kind: 'minuteFrequency'; hours: HoursPlan}
  | {kind: 'minuteSpanInHour'; hour: number; span: [number, number]}
  | {
      kind: 'minutesAcrossHours';
      form: 'wildcard' | 'range' | 'list';
      times: HourTimesPlan;
    }
  | {kind: 'minuteSpanAcrossHourStep'; form: 'wildcard' | 'range' | 'list'}
  | {kind: 'everyHour'}
  | {
      kind: 'hourRange';
      from: number;
      to: number;
      last: number;
      // The minute to show on the closing bound, or `null` to close on the
      // bare hour with the minutes stated separately. A single fire or a
      // wildcard names an exact closing minute (the fire, or `:59`); a minute
      // list or range would otherwise glue its last fire onto the bound and
      // read as a continuous span, so it closes bare instead.
      boundMinute: number | null;
      minuteForm: 'lead' | 'wildcard' | 'range';
    }
  | {kind: 'hourStep'}
  | {kind: 'clockTimes'; times: ClockTime[]}
  | {kind: 'compactClockTimes'; fold: boolean; minute: number};

/** The semantic analyses the core attaches to the pattern for rendering. */
export interface Analyses {
  clockSecond: number | undefined;
  lastMinuteFire: number;
  minuteSpan: [number, number] | null;
  segments: Record<Field, Segment[] | null>;
}

/**
 * The neutral schedule facts: the language-independent facts about a pattern,
 * carrying no phrasing decision. `analyze` produces this; `selectPlan`
 * reads it to suggest a `plan`. The phrasing plan is deliberately *not*
 * part of the neutral facts (docs/i18n-design.md §2.2).
 */
export interface ScheduleFacts {
  pattern: Pattern;
  shapes: Shapes;
  analyses: Analyses;
}

/**
 * The semantic schedule a language renders: the neutral `ScheduleFacts`
 * plus the selected `plan`. A language may widen `plan` with its own
 * `Extra` plan kinds via `Language.plan`; by default there are none, so
 * `Schedule` is the neutral facts with a core `PlanNode`.
 */
export interface Schedule<Extra extends {kind: string} = never>
  extends ScheduleFacts {
  plan: PlanNode | Extra;
}

/** A resolved style table. */
export interface DialectStyle {
  am: string;
  closeUp: boolean;
  dayFirst: boolean;
  midday: string;
  midnight: string;
  ordinals: boolean;
  pm: string;
  // Whether the `through` connective includes the whole named hour ("through
  // 5 p.m." covers a 5:45 fire), letting a discontinuous multi-hour close
  // name the bare hour. An exclusive-reading connective ("to", "-") must
  // close on the last fire instead, or it understates the run.
  inclusiveThrough: boolean;
  sep: string;
  serialComma: boolean;
  through: string;
  // The connective for the up-to-but-not-including close of a continuous
  // run ("from 9 a.m. until 6 p.m."): exclusive, unlike `through`, which
  // names an included bound.
  until: string;
}

/**
 * Options after a language module's `options()` has normalized them. `Style`
 * is the language's specific style options. English's `DialectStyle` has
 * `serialComma`/`through`/`ordinals`; Spanish's has a meridiem form and an
 * `h` suffix.
 */
export interface NormalizedOptions<Style = DialectStyle> {
  ampm: boolean;
  lenient: boolean;
  quartz: boolean;
  seconds: boolean;
  short: boolean;
  style: Style;
  years: boolean;
}

/**
 * The interface every language module's default export implements. `Extra`
 * lets a language add its own plan kinds (default: none), which its
 * `plan` override emits and its `describe` renders.
 */
export interface Language<
  Style = DialectStyle,
  Extra extends {kind: string} = never
> {
  describe(schedule: Schedule<Extra>, opts: NormalizedOptions<Style>): string;
  // The lenient-mode fallback description. Options-aware (like `reboot` and
  // `sentence`) so a dialect that changes whole words flows through the
  // arguments; a language with one fixed string ignores `opts`.
  fallback(opts: NormalizedOptions<Style>): string;
  options(options?: Cronli5Options): NormalizedOptions<Style>;
  reboot(opts: NormalizedOptions<Style>): string;
  // Wrap a rendered description into a complete standalone sentence (the CLI
  // form); each language owns its lead verb and punctuation.
  sentence(description: string, opts: NormalizedOptions<Style>): string;
  // Optionally override the core's suggested plan. Receives the neutral
  // `facts` and the core's suggestion (`base`), so overriding is a thin
  // remap, not a re-derivation. Omitted by languages that accept the core's
  // choice (all of en/de/es/fi today).
  plan?(facts: ScheduleFacts, base: PlanNode): PlanNode | Extra;
}
