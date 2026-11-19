// The schedule that never fires: its date exists in no month it reaches.
// The whole description is one fixed phrase (answers 4.4).

import type {ScheduleFacts} from '../../core/schedule.js';
import {denote} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import {sayYears} from './frame.js';
import {words} from './text.js';

/**
 * «nigdy (takiej daty nie ma w kalendarzu)», with the years in place of
 * the calendar when only the years named lack the date.
 */
function never(facts: ScheduleFacts): string {
  const {candidates, dateReach} = facts.analyses;
  const named = candidates.date || [];
  const days = named.length > 0 ?
    denote(named[named.length - 1], domainOf('date')) :
    [];
  const noSuch = [words.noSuchDate, words.noSuchDates][
    Number(days.length > 1)];
  const where = dateReach && dateReach.firesInOtherYears ?
    sayYears(facts).text :
    words.inTheCalendar;

  return `${words.never} (${noSuch} ${where})`;
}

/** Whether the schedule never fires: its date exists in no month reached. */
function neverFires(facts: ScheduleFacts): boolean {
  const {dateReach, day} = facts.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

export {never, neverFires};
