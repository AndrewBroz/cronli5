// Semantic analysis of canonical fields: fire enumeration, windows, shape
// classification, and description-strategy selection (the `plan`). The
// resulting IR is descriptive. Language modules handle rendering into
// words (docs/i18n-design.md §2.2).

import {fieldOrder, fieldSpecs, maxClockTimes} from './specs.js';
import type {FieldSpec} from './specs.js';
import type {
  Analyses, ClockTime, Content, Field, HourTimesPlan, HoursPlan, IR, Pattern,
  PlanNode, Segment, Shape, Shapes
} from './ir.js';
import {includes, toFieldNumber, unique} from './util.js';
import {isDiscreteHours, isDiscreteList, isPlainRange, isSingleValue}
  from './shapes.js';
import {isQuartzDate, isQuartzWeekday} from './validate.js';

// List the values a `start/interval` step fires on from `start` up to `max`,
// stepping by `interval`.
function getOccurrences(
  start: number,
  interval: number,
  max: number
): number[] {
  const occurrences = [];
  let value = start;

  while (value <= max) {
    occurrences.push(value);
    value += interval;
  }

  return occurrences;
}

// List the values a step fires on for a day-level field. The start may be a
// wildcard (`*`, begins at `min`), a single value, or a range (`a-b`), and
// range bounds may be names resolved via `numberMap`.
function enumerateStep(
  field: string,
  min: number,
  max: number,
  numberMap?: {[name: string]: number}
): number[] {
  const parts = field.split('/');
  const interval = +parts[1];

  if (includes(parts[0], '-')) {
    const bounds = parts[0].split('-');

    return getOccurrences(toFieldNumber(bounds[0], numberMap), interval,
      toFieldNumber(bounds[1], numberMap));
  }

  const start = parts[0] === '*' ? min : toFieldNumber(parts[0], numberMap);

  return getOccurrences(start, interval, max);
}

// Enumerate the values a field fires on within [min, max], expanding list
// segments that are ranges (wrap-aware) or steps (e.g. "9,17-19" or
// "9,17/2").
function enumerateFires(field: string, min: number, max: number): number[] {
  const fires: number[] = [];

  field.split(',').forEach(function expand(segment) {
    if (includes(segment, '/')) {
      fires.push(...enumerateStep(segment, min, max));
    }
    else if (includes(segment, '-')) {
      const bounds = segment.split('-');

      if (+bounds[0] <= +bounds[1]) {
        fires.push(...getOccurrences(+bounds[0], 1, +bounds[1]));
      }
      else {
        // A wrap-around range runs to the end of the cycle and resumes
        // from the start.
        fires.push(...getOccurrences(+bounds[0], 1, max));
        fires.push(...getOccurrences(min, 1, +bounds[1]));
      }
    }
    else {
      fires.push(+segment);
    }
  });

  return unique(fires);
}

// Enumerate a discrete field (single value or comma list) as numbers. A
// wildcard or any non-discrete form collapses to the top of the unit (0).
function enumerateValues(field: string): number[] {
  if (!isDiscreteList(field)) {
    return [0];
  }

  return field.split(',').map(Number);
}

// The [low, high] minute window a field spans, or null when the field is a
// single value, list, step, or wrap-around range (which do not describe a
// continuous window within one hour).
function minuteSpan(minuteField: string): [number, number] | null {
  if (minuteField === '*') {
    return [0, 59];
  }

  if (isPlainRange(minuteField)) {
    const bounds = minuteField.split('-');

    if (+bounds[0] <= +bounds[1]) {
      return [+bounds[0], +bounds[1]];
    }
  }

  return null;
}

// The last minute a minute field fires on within an hour. Hour windows end
// at the final fire, so `*/15` over `9-17` reads "through 5:45 PM" rather
// than overstating (":59") or understating (":00") the window.
function lastMinuteFire(minuteField: string): number {
  if (minuteField === '*') {
    return 59;
  }

  return Math.max(...enumerateFires(minuteField, 0, 59));
}

// A single specific non-zero second to fold into a clock time (e.g. "9:00:15
// AM"), or undefined when the second is zero, a wildcard, or non-discrete.
function clockSecond(secondField: string): number | undefined {
  if (isSingleValue(secondField) && secondField !== '0') {
    return +secondField;
  }
}
// Classify a canonical field value's shape. Lists win over their segment
// kinds (`5-30/2` is a step; `0,5/2` is a list).
function fieldShape(value: string, field: Field): Shape {
  if (value === '*') {
    return 'wildcard';
  }

  if (field === 'date' && isQuartzDate(value) ||
      field === 'weekday' && isQuartzWeekday(value, fieldSpecs.weekday)) {
    return 'quartz';
  }

  if (includes(value, ',')) {
    return 'list';
  }

  if (includes(value, '/')) {
    return 'step';
  }

  if (includes(value, '-')) {
    return 'range';
  }

  return 'single';
}

// Break a field into classified segments: single values keep their raw
// token, ranges keep their raw bound tokens (names included), and steps
// carry their enumerated fires. Wildcard and Quartz fields have no
// segments.
function fieldSegments(
  value: string,
  shape: Shape,
  spec: FieldSpec
): Segment[] | null {
  if (shape === 'wildcard' || shape === 'quartz') {
    return null;
  }

  return value.split(',').map(function classify(segment): Segment {
    if (includes(segment, '/')) {
      const parts = segment.split('/');

      return {
        // Only the named/cyclic fields are segmented this way; `top` is
        // always present for them (year has no segmentable step form).
        fires: enumerateStep(segment, spec.min, spec.top as number,
          spec.numbers),
        interval: +parts[1],
        kind: 'step',
        startToken: parts[0]
      };
    }

    if (includes(segment, '-')) {
      return {bounds: segment.split('-') as [string, string], kind: 'range'};
    }

    return {kind: 'single', value: segment};
  });
}

// Analyze a prepared (parsed, validated, normalized) cron pattern into the
// IR a language module renders from.
function analyze(pattern: Pattern): IR {
  const shapes = {} as Shapes;
  const segments = {} as Analyses['segments'];

  fieldOrder.forEach(function classify(field) {
    shapes[field] = fieldShape(pattern[field], field);
    segments[field] = fieldSegments(pattern[field], shapes[field],
      fieldSpecs[field]);
  });

  const analyses = {
    clockSecond: clockSecond(pattern.second),
    lastMinuteFire: lastMinuteFire(pattern.minute),
    minuteSpan: minuteSpan(pattern.minute),
    segments
  };

  const content: Content = {analyses, pattern, shapes};

  return {...content, plan: selectStrategy(content)};
}

// Select the description strategy from the neutral content. This is the
// core's *suggestion*: a language may override it via `Language.strategy`
// without re-deriving it (the content-plan / overridable-strategy split).
// The selection mirrors the interpreter chain ordering exactly; renderers
// must not re-derive it.
function selectStrategy(content: Content): PlanNode {
  const {analyses, pattern, shapes} = content;

  if (pattern.second !== '0') {
    const seconds = planSeconds(pattern, shapes, analyses);

    if (seconds) {
      return seconds;
    }
  }

  return planMinutes(pattern, shapes, analyses) ||
    planHours(pattern, shapes, analyses);
}

// Seconds strategies, or null when the second folds into the clock time
// downstream (a single second under discrete minutes and hours).
function planSeconds(
  pattern: Pattern,
  shapes: Shapes,
  analyses: Analyses
): PlanNode | null {
  const standalone = planStandaloneSeconds(pattern, shapes);

  if (standalone) {
    return standalone;
  }

  // A meaningful second under a single specific minute and an open hour.
  if (pattern.hour === '*' && shapes.minute === 'single' &&
      pattern.second !== '*') {
    return {
      kind: 'secondsWithinMinute',
      singleSecond: shapes.second === 'single'
    };
  }

  // A single second under discrete minutes and hours folds into the clock
  // time downstream.
  if (shapes.second === 'single' && isDiscreteList(pattern.minute) &&
      isDiscreteHours(pattern.hour)) {
    return null;
  }

  // The second makes the cadence sub-minute, so a minute of 0 is a real
  // restriction that must be stated, not absorbed into an hourly idiom (which
  // would silently drop it). Route minute 0 to the minute-explicit forms.
  return {
    kind: 'composeSeconds',
    rest: planMinutes(pattern, shapes, analyses, true) ||
      planHours(pattern, shapes, analyses, true)
  };
}

// Second shapes that stand on their own over a wildcard minute and hour. A
// restricted hour must defer to the compose path so the hour window survives
// (a standalone second carries no hour, so it would silently drop it).
function planStandaloneSeconds(
  pattern: Pattern,
  shapes: Shapes
): PlanNode | null {
  if (pattern.minute !== '*' || pattern.hour !== '*') {
    return null;
  }

  if (pattern.second === '*') {
    return {kind: 'everySecond'};
  }

  if (shapes.second === 'single') {
    return {kind: 'secondPastMinute'};
  }

  return {kind: 'standaloneSeconds'};
}

// Minute strategies, in the interpreter-chain order, or null to defer to
// the hour strategies.
function planMinutes(
  pattern: Pattern,
  shapes: Shapes,
  analyses: Analyses,
  subMinuteSecond = false
): PlanNode | undefined {
  if (shapes.minute === 'step') {
    return {
      hours: planFrequencyHours(pattern, shapes, analyses),
      kind: 'minuteFrequency'
    };
  }

  if (shapes.hour === 'single' && analyses.minuteSpan) {
    return {
      hour: +pattern.hour,
      kind: 'minuteSpanInHour',
      span: analyses.minuteSpan
    };
  }

  const acrossHours = planMinutesAcrossHours(pattern, shapes);

  if (acrossHours) {
    return acrossHours;
  }

  const underStep = planMinuteUnderHourStep(pattern, shapes);

  if (underStep) {
    return underStep;
  }

  if (pattern.hour === '*') {
    return planMinutesUnderOpenHour(pattern, shapes, subMinuteSecond);
  }
}

// Whether an hour step is a clean stride over the whole day: unbounded, an
// even divisor of 24, and starting within the first interval — so its fires
// wrap uniformly (every Nth hour). Offsets like 1/2 qualify; bounded (9-17/2)
// and uneven (*/5) steps do not, and list their hours instead.
function cleanHourStride(hourField: string): boolean {
  const [start, step] = hourField.split('/');
  const startHour = start === '*' ? 0 : +start;

  return start.indexOf('-') === -1 && 24 % +step === 0 && startHour < +step;
}

// A minute wildcard or plain range under a stepped hour. A wildcard minute is
// a cadence: a clean stride (dividing the day) confines it to every Nth hour;
// an uneven or bounded step lists its active hours like any discrete set — so
// the cadence is never read as a second, conflicting frequency. A plain range
// is a per-hour window keyed to the step.
function planMinuteUnderHourStep(
  pattern: Pattern,
  shapes: Shapes
): PlanNode | null {
  if (shapes.hour !== 'step') {
    return null;
  }

  if (pattern.minute === '*') {
    return cleanHourStride(pattern.hour) ?
      {form: 'wildcard', kind: 'minuteSpanAcrossHourStep'} :
      {form: 'wildcard', kind: 'minutesAcrossHours',
        times: hourTimesPlan(pattern.hour)};
  }

  if (shapes.minute === 'range') {
    return {form: 'range', kind: 'minuteSpanAcrossHourStep'};
  }

  // A minute list under a clean stride keeps the cadence too, so the hour
  // reads the same whatever the minute's shape. An unclean stride falls
  // through to compactClockTimes and enumerates its hours.
  if (shapes.minute === 'list' && cleanHourStride(pattern.hour)) {
    return {form: 'list', kind: 'minuteSpanAcrossHourStep'};
  }

  return null;
}

// The hour qualification accompanying a minute-step cadence.
function planFrequencyHours(
  pattern: Pattern,
  shapes: Shapes,
  analyses: Analyses
): HoursPlan {
  if (shapes.hour === 'list') {
    return {kind: 'during', times: hourTimesPlan(pattern.hour)};
  }

  if (shapes.hour === 'range') {
    const bounds = pattern.hour.split('-');

    return {
      from: +bounds[0],
      kind: 'window',
      last: analyses.lastMinuteFire,
      to: +bounds[1]
    };
  }

  if (shapes.hour === 'single') {
    return {
      from: +pattern.hour,
      kind: 'window',
      last: analyses.lastMinuteFire,
      to: +pattern.hour
    };
  }

  if (shapes.hour === 'step') {
    // A clean stride (dividing 24) confines the cadence to "every Nth hour";
    // an uneven or bounded step lists its hours as windows, so the cadence is
    // never read as a second, conflicting frequency.
    return cleanHourStride(pattern.hour) ?
      {kind: 'step'} :
      {kind: 'during', times: hourTimesPlan(pattern.hour)};
  }

  return {kind: 'none'};
}

// A minute window (wildcard, plain range, or list containing ranges) under
// discrete hours, or null when the shapes do not match.
function planMinutesAcrossHours(
  pattern: Pattern,
  shapes: Shapes
): PlanNode | null {
  if (!isDiscreteHours(pattern.hour)) {
    return null;
  }

  if (pattern.minute === '*') {
    return {
      form: 'wildcard',
      kind: 'minutesAcrossHours',
      times: hourTimesPlan(pattern.hour)
    };
  }

  if (shapes.minute === 'range' ||
      shapes.minute === 'list' && includes(pattern.minute, '-') &&
      !includes(pattern.minute, '/')) {
    return {
      form: shapes.minute === 'range' ? 'range' : 'list',
      kind: 'minutesAcrossHours',
      times: hourTimesPlan(pattern.hour)
    };
  }

  return null;
}

// Minute strategies that only stand on their own under a wildcard hour.
function planMinutesUnderOpenHour(
  pattern: Pattern,
  shapes: Shapes,
  subMinuteSecond: boolean
): PlanNode | undefined {
  if (shapes.minute === 'range') {
    return {kind: 'rangeOfMinutes'};
  }

  if (shapes.minute === 'list') {
    return {kind: 'multipleMinutes'};
  }

  if (pattern.minute === '*') {
    return {kind: 'everyMinute'};
  }

  // Minute 0 normally defers to "every hour" so a standalone `0 * * * *`
  // stays terse; under a sub-minute second it must be stated, so name it.
  if (pattern.minute !== '0' || subMinuteSecond) {
    return {kind: 'singleMinute'};
  }
}

// Hour strategies: the chain's last resort always produces a plan. Under a
// sub-minute second a minute of 0 is a real restriction, so the absorbing
// idioms (hour range, hour step, every hour) are skipped for it and the hour
// is enumerated as clock times instead, stating the :00.
function planHours(
  pattern: Pattern,
  shapes: Shapes,
  analyses: Analyses,
  subMinuteSecond = false
): PlanNode {
  const absorbsMinuteZero = subMinuteSecond && pattern.minute === '0';

  if (shapes.hour === 'range' && !absorbsMinuteZero) {
    return planHourRange(pattern, shapes, analyses);
  }

  if (shapes.hour === 'step' && pattern.minute === '0' && !subMinuteSecond) {
    return {kind: 'hourStep'};
  }

  if (pattern.hour === '*' && !absorbsMinuteZero) {
    return {kind: 'everyHour'};
  }

  // When minute 0 must be stated, enumerate the on-the-hour times explicitly:
  // the compact fold of a contiguous hour range would otherwise restate the
  // hour-range idiom ("every hour from X through Y") and re-drop the :00.
  return planClockTimes(pattern, analyses, absorbsMinuteZero);
}

// The hour-range plan: a window from the first hour through the last. The
// minute clause leads (a single fire or a list), fires every minute (a range),
// or fills the window (a wildcard). A multi-valued minute (list or range)
// closes the window on the bare hour, stating its minutes separately; a single
// fire or a wildcard names an exact closing minute (its fire, or the wildcard's
// last :59) — otherwise the glued last fire reads as a continuous span.
function planHourRange(
  pattern: Pattern,
  shapes: Shapes,
  analyses: Analyses
): PlanNode {
  const bounds = pattern.hour.split('-');
  let minuteForm: 'lead' | 'wildcard' | 'range' = 'lead';

  if (pattern.minute === '*') {
    minuteForm = 'wildcard';
  }
  else if (shapes.minute === 'range') {
    minuteForm = 'range';
  }

  const multiValued = shapes.minute === 'range' || shapes.minute === 'list';

  return {
    boundMinute: multiValued ? null : analyses.lastMinuteFire,
    from: +bounds[0],
    kind: 'hourRange',
    last: analyses.lastMinuteFire,
    minuteForm,
    to: +bounds[1]
  };
}

// Enumerated clock times up to the cap; past it, a compact form (a single
// minute folds into hour-segment windows; a minute list leads with its own
// clause). `enumerate` forces the explicit list past the cap, used when a
// minute restriction must be named rather than folded into an hour idiom.
function planClockTimes(
  pattern: Pattern,
  analyses: Analyses,
  enumerate = false
): PlanNode {
  const hours = enumerateFires(pattern.hour, 0, 23);
  const minutes = enumerateValues(pattern.minute);

  if (!enumerate && hours.length * minutes.length > maxClockTimes) {
    return {
      fold: minutes.length === 1,
      kind: 'compactClockTimes',
      minute: minutes[0]
    };
  }

  const times: ClockTime[] = [];

  hours.forEach(function eachHour(hour) {
    minutes.forEach(function eachMinute(minute) {
      times.push({hour, minute, second: analyses.clockSecond});
    });
  });

  return {kind: 'clockTimes', times};
}

// The hour times accompanying a window phrase: enumerated fires up to the
// cap, segment rendering past it.
function hourTimesPlan(hourField: string): HourTimesPlan {
  const fires = enumerateFires(hourField, 0, 23);

  if (fires.length <= maxClockTimes) {
    return {fires, kind: 'fires'};
  }

  return {kind: 'segments'};
}

export {analyze, clockSecond, enumerateFires, enumerateStep,
  enumerateValues, getOccurrences, lastMinuteFire, minuteSpan, selectStrategy};
