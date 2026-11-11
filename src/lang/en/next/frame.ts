// Arranging the sentence. English has one order, finest part first: the
// time, then the day of the month, the day of the week, the month and the
// year. Nothing here reorders it; a part with nothing to say is silent.

/** One part of the sentence and what joins it to the parts before it. */
export interface Slot {
  before: string;
  text: string;
}

/** The parts of a description. The time always has something to say. */
export interface Parts {
  time: string;
  date: Slot;
  weekday: Slot;
  month: Slot;
  year: Slot;
}

/** The parts in their one order, as a description. */
function arrange(parts: Parts): string {
  return [parts.date, parts.weekday, parts.month, parts.year]
    .filter(function said(slot) {
      return slot.text;
    })
    .reduce(function append(sentence, slot) {
      return sentence + slot.before + slot.text;
    }, parts.time);
}

export {arrange};
