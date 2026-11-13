// A field's candidates laid out another way: walked from a value the
// language names (the day its week starts on), or with nothing wrapping.
// The set is the same; only the arrangement a description follows differs.

import type {
  Field, ScheduleFacts, SetDescription, SetView
} from './schedule.js';
import {denote, describeSet} from './describe-set.js';
import {domainOf} from './specs.js';

/**
 * Every compact description of a field's values under a view, in the same
 * order and form as `analyses.candidates`. Null for a Quartz field, and
 * the whole field is the whole field under any view.
 */
function candidatesAs(
  facts: ScheduleFacts,
  field: Field,
  opts: SetView
): SetDescription[] | null {
  const own = facts.analyses.candidates[field];

  if (!own || own[0].kind === 'all') {
    return own;
  }

  const domain = domainOf(field);

  return describeSet(denote(own[own.length - 1], domain), domain, opts);
}

export {candidatesAs};
