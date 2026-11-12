// Selection among candidate phrasings. A language renders each candidate
// description it has a device for and gives each phrase a length: its own
// measure of how much a listener has to hold. English counts the things a
// phrase names. The measure must depend on how many values there are and
// how they are arranged, never on which values they are, or two patterns
// of the same shape would be worded differently. Nothing here knows any
// words.

/** A rendered phrase with its length, in the language's own measure. */
export interface Spoken {
  text: string;
  length: number;
}

/**
 * The shortest phrase. On a tie the earliest wins, so the order the
 * candidates are offered in is the tie-break order.
 */
function shortestSpoken<T extends Spoken>(phrases: T[]): T {
  if (phrases.length === 0) {
    throw new RangeError('shortestSpoken needs at least one phrase.');
  }

  return phrases.reduce(function shorter(best, phrase) {
    return phrase.length < best.length ? phrase : best;
  });
}

export {shortestSpoken};
