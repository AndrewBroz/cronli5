// Selection among candidate phrasings. A language renders each candidate
// description it has a device for and measures each phrase as it is
// spoken; the shortest wins. Length is the language's own measure
// (syllables, morae, characters of a syllabic script) and comes from its
// word tables — nothing here knows any words.

/** A rendered phrase with its spoken length, in the language's own unit. */
export interface Spoken {
  text: string;
  length: number;
}

/**
 * The shortest spoken phrase. On a tie the earliest wins, so the order the
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
