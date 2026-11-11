// Fusions: places where two fields are said as one phrase. The core works
// out what the fused thing is; whether to say it, and how, is the
// language's decision.

import type {ClockTime, Field, ScheduleFacts} from './schedule.js';
import {denote} from './describe-set.js';
import {fieldSpecs} from './specs.js';

// A field's values, when it is a plain set narrower than the whole field.
function restrictedValues(facts: ScheduleFacts, field: Field):
  number[] | null {
  const candidates = facts.analyses.candidates[field];
  const spec = fieldSpecs[field];

  if (!candidates || candidates[0].kind === 'all') {
    return null;
  }

  return denote(candidates[0], {
    cyclic: Boolean(spec.cyclic),
    max: spec.top ?? spec.max,
    min: spec.min
  });
}

/**
 * The clock times a pattern fires at, when minute and hour are both plain
 * value sets, neither is the whole field, and there are at most `limit`
 * of them. Ordered by hour, then minute. Null otherwise. Each time carries
 * the pattern's single second, if it has one.
 */
function clockTimes(facts: ScheduleFacts, limit: number): ClockTime[] | null {
  const minutes = restrictedValues(facts, 'minute');
  const hours = restrictedValues(facts, 'hour');

  if (!minutes || !hours || minutes.length * hours.length > limit) {
    return null;
  }

  return hours.flatMap(function eachHour(hour) {
    return minutes.map(function eachMinute(minute) {
      return {hour, minute, second: facts.analyses.clockSecond};
    });
  });
}

export {clockTimes};
