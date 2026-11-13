// Semantic analysis of canonical fields: shape classification and the
// neutral facts about each field's values. The resulting Schedule is
// descriptive. Language modules handle rendering into words
// (docs/i18n-design.md §2.2).

import {domainOf, fieldOrder, fieldSpecs} from './specs.js';
import type {
  Analyses, CadencePieces, Field, Pattern, Schedule, SetDescription, Shape,
  Shapes
} from './schedule.js';
import {dateReach, monthLengths} from './date-reach.js';
import {dayArms, dayFacts} from './day.js';
import {describeCadencePieces, describeSet} from './describe-set.js';
import {enumerateFires, includes} from './util.js';
import {isQuartzDate, isQuartzWeekday} from './validate.js';

// The pattern's one second, when it fires on exactly one second of the
// minute and that second is not zero; undefined otherwise. Read from the
// values the field fires on, so `5`, `5-10/60` and `5-9/5` all agree.
function clockSecond(seconds: SetDescription[] | null): number | undefined {
  const named = seconds && seconds[seconds.length - 1];

  if (named && named.kind === 'values' && named.values.length === 1 &&
      named.values[0] !== 0) {
    return named.values[0];
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

// Every compact description of a field's value set, and the set as runs
// and cadences together. A wildcard is the whole field without
// enumerating it (the year domain is thousands of values); a Quartz form
// is not a plain set of values and has none.
function fieldDescriptions(
  value: string,
  shape: Shape,
  field: Field
): {candidates: SetDescription[] | null; cadencePieces: CadencePieces | null} {
  if (shape === 'quartz') {
    return {cadencePieces: null, candidates: null};
  }

  if (shape === 'wildcard') {
    return {cadencePieces: null, candidates: [{kind: 'all'}]};
  }

  const domain = domainOf(field);
  const fires = enumerateFires(value, domain.min, domain.max)
    .sort(function ascending(a, b) {
      return a - b;
    });

  return {
    cadencePieces: describeCadencePieces(fires, domain),
    candidates: describeSet(fires, domain)
  };
}

// The kind of description a field's spelling corresponds to. A list is
// values when every item is a single value, and pieces otherwise.
const writtenAs: Record<Shape, SetDescription['kind'] | null> = {
  list: 'values',
  quartz: null,
  range: 'range',
  single: 'values',
  step: 'cadence',
  wildcard: 'all'
};

function fieldWritten(value: string, shape: Shape) {
  const mixed = shape === 'list' && (/[-/]/u).test(value);

  return mixed ? 'pieces' : writtenAs[shape];
}

// Analyze a prepared (parsed, validated, normalized) cron pattern into the
// Schedule a language module renders from.
function analyze(pattern: Pattern): Schedule {
  const shapes = {} as Shapes;
  const candidates = {} as Analyses['candidates'];
  const cadencePieces = {} as Analyses['cadencePieces'];
  const written = {} as Analyses['written'];

  fieldOrder.forEach(function classify(field) {
    shapes[field] = fieldShape(pattern[field], field);

    const described = fieldDescriptions(pattern[field], shapes[field], field);

    candidates[field] = described.candidates;
    cadencePieces[field] = described.cadencePieces;
    written[field] = fieldWritten(pattern[field], shapes[field]);
  });

  const arms = dayArms(pattern, shapes, candidates);
  const reach = dateReach(arms.date, candidates);
  const fired = monthLengths(arms.date, candidates);

  return {
    analyses: {
      cadencePieces,
      candidates,
      clockSecond: clockSecond(candidates.second),
      dateReach: reach,
      day: dayFacts(arms, {fired, reach}, candidates.weekday),
      monthLengths: fired,
      written
    },
    pattern,
    shapes
  };
}

export {analyze, clockSecond};
