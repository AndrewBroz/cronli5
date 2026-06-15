// An Intermediate Representation (`IR`) is the semantic contract between
// the core and a language renderer. The core (parse → validate →
// normalize → analyze) produces an IR, then a language module renders it to
// prose. These shapes are what any new language module interacts with. See
// docs/i18n-design.md.

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
  | {kind: 'during'; times: HourTimesPlan}
  | {kind: 'single'; from: number; to: number; last: number};

/** Hour times: enumerated fires, or deferred to per-segment rendering. */
export type HourTimesPlan =
  | {kind: 'fires'; fires: number[]}
  | {kind: 'segments'};

/**
 * The rendering strategy the core selects for a pattern. The `kind`
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
  | {kind: 'minuteSpanAcrossHourStep'; form: 'wildcard' | 'range'}
  | {kind: 'everyHour'}
  | {
      kind: 'hourRange';
      from: number;
      to: number;
      last: number;
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

/** The semantic intermediate representation a language renders. */
export interface IR {
  pattern: Pattern;
  shapes: Shapes;
  analyses: Analyses;
  plan: PlanNode;
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
  sep: string;
  serialComma: boolean;
  through: string;
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
  seconds: boolean;
  short: boolean;
  style: Style;
  years: boolean;
}

/** The interface every language module's default export implements. */
export interface Language<Style = DialectStyle> {
  describe(ir: IR, opts: NormalizedOptions<Style>): string;
  fallback: string;
  options(options?: Cronli5Options): NormalizedOptions<Style>;
  reboot: string;
}
