// Semantic analysis of canonical fields: shape classification and the
// neutral facts about each field's values. The resulting Schedule is
// descriptive. Language modules handle rendering into words
// (docs/i18n-design.md §2.2).

import {fieldOrder, fieldSpecs} from './specs.js';
import type {FieldSpec} from './specs.js';
import type {
  Analyses, Field, Pattern, Schedule, SetDescription, Shape, Shapes
} from './schedule.js';
import {dayFacts} from './day.js';
import {describeSet} from './describe-set.js';
import {enumerateFires, includes} from './util.js';
import {isQuartzDate, isQuartzWeekday} from './validate.js';
import {isSingleValue} from './shapes.js';

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

// Every compact description of a field's value set. A wildcard is the
// whole field without enumerating it (the year domain is thousands of
// values); a Quartz form is not a plain set of values and has none.
function fieldCandidates(
  value: string,
  shape: Shape,
  spec: FieldSpec
): SetDescription[] | null {
  if (shape === 'quartz') {
    return null;
  }

  if (shape === 'wildcard') {
    return [{kind: 'all'}];
  }

  const max = spec.top ?? spec.max;
  const fires = enumerateFires(value, spec.min, max)
    .sort(function ascending(a, b) {
      return a - b;
    });

  return describeSet(fires, {cyclic: Boolean(spec.cyclic), max,
    min: spec.min});
}

// Analyze a prepared (parsed, validated, normalized) cron pattern into the
// Schedule a language module renders from.
function analyze(pattern: Pattern): Schedule {
  const shapes = {} as Shapes;
  const candidates = {} as Analyses['candidates'];

  fieldOrder.forEach(function classify(field) {
    shapes[field] = fieldShape(pattern[field], field);
    candidates[field] = fieldCandidates(pattern[field], shapes[field],
      fieldSpecs[field]);
  });

  return {
    analyses: {
      candidates,
      clockSecond: clockSecond(pattern.second),
      day: dayFacts(pattern, shapes)
    },
    pattern,
    shapes
  };
}

export {analyze, clockSecond};
