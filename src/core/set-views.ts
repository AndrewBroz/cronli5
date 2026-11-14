// A field's candidates laid out another way: walked from a value the
// language names (the day its week starts on), or with nothing wrapping.
// The set is the same; only the arrangement a description follows differs.

import type {
  DaysInMonths, Domain, Field, ScheduleFacts, SetDescription, SetView
} from './schedule.js';
import {denote, describeSet} from './describe-set.js';
import {domainOf} from './specs.js';
import {monthLengths} from './date-reach.js';

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

// The days of a plain day-of-month set, or null for a Quartz form or an
// unrestricted field.
function plainDays(facts: ScheduleFacts): number[] | null {
  const own = facts.analyses.candidates.date;

  return !own || own[0].kind === 'all' ?
    null :
    denote(own[own.length - 1], domainOf('date'));
}

/**
 * The day-of-month set described against the days the months have: the
 * candidates over the days from 1 to the last day of the longest month
 * the date arm fires in, with that domain. Days no such month has are
 * dropped. In the same order and form as `analyses.candidates.date`, and
 * laid out under a view as `candidatesAs` does.
 *
 * A set written for a short month then reads as what it is: `1-29/2` in
 * June is the same cadence as a step of two, and `1-14,16-30` in June is every
 * day except the 15th. Test whether a cadence or a range fills the month
 * against the returned domain, not against `domainOf('date')`.
 *
 * Null for a Quartz form. `[{kind: 'all'}]` for an unrestricted field and
 * for a set that holds every day of the domain. Empty, over all 31 days,
 * when the date arm never fires.
 */
function daysReached(facts: ScheduleFacts, opts: SetView = {}):
  {candidates: SetDescription[]; domain: Domain} | null {
  const {candidates, monthLengths: fired} = facts.analyses;
  const own = candidates.date;
  const whole = domainOf('date');

  if (!own) {
    return null;
  }

  if (!fired.length) {
    return {candidates: [], domain: whole};
  }

  const domain = {...whole, max: fired[fired.length - 1].length};
  const days = denote(own[own.length - 1], whole).filter(
    function exists(day) {
      return day <= domain.max;
    }
  );

  return {candidates: describeSet(days, domain, opts), domain};
}

/**
 * The days of a plain day-of-month set grouped by which reached months
 * have them, in ascending order: first the days every reached month has
 * in every reached year (`everyMonth`), then the days only longer months
 * have, each with the groups of months that have it. Days no reached
 * month has are left out. Null for a Quartz form or an unrestricted
 * field.
 *
 * `30,31` in April and May is the 30th (both months) and the 31st (May);
 * `28,29` in February is the 28th and, in leap years, the 29th.
 */
function daysByMonths(facts: ScheduleFacts): DaysInMonths[] | null {
  const days = plainDays(facts);

  if (!days) {
    return null;
  }

  const reached = monthLengths(null, facts.analyses.candidates);
  const groups: DaysInMonths[] = [];

  reached.forEach(function place(month, at) {
    const shorter = at ? reached[at - 1].length : 0;
    const held = days.filter(function onlyFromHere(day) {
      return day > shorter && day <= month.length;
    });

    if (held.length) {
      groups.push({days: held, everyMonth: at === 0,
        months: reached.slice(at)});
    }
  });

  return groups;
}

export {candidatesAs, daysByMonths, daysReached};
