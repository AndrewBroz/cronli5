// Arranging the sentence. English has one order, finest part first: the
// time, then the day, the month and the year. Nothing here reorders it; a
// part with nothing to say is silent.

/**
 * The parts of a description, each as it is said; a part with nothing to
 * say is an empty string. The time always has something to say.
 */
export interface Parts {
  time: string;
  day: string;
  month: string;
  year: string;
}

/** The parts in their one order, as a description. */
function arrange(parts: Parts): string {
  return [parts.time, parts.day, parts.month, parts.year]
    .filter(Boolean)
    .join(' ');
}

export {arrange};
