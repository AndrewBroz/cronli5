// Joining words: the two series (a list and its «та», pieces and their
// «і»), and the five words whose spelling follows the sounds on either
// side of them.

import lexicon from './lexicon.js';

const {words} = lexicon;

const VOWELS = 'аеєиіїоуюя';
const endsInVowel = new RegExp(`[${VOWELS}]$`, 'u');
const startsWithVowel = new RegExp(`^[${VOWELS}]`, 'u');

// A word that begins with a hissing consonant, or a number read as one:
// 4, 6, 7, 14, 16, 17 and 40 to 49, alone or counting thousands.
const startsHissing = /^(?:[зсцчшщ]|(?:[467]|1[467]|4\d)(?:\d{3})?(?!\d))/u;

type Respelling = (before: string, after: string) => string;

function pick(plain: string, other: string, takesOther: boolean): string {
  return [plain, other][Number(takesOther)];
}

// «У» before «в» or «ф»; otherwise «в» before a vowel or after one. A
// word that ends in a comma or a colon, and the start, are no vowel.
function inWord(before: string, after: string): string {
  const soft = !(/^[вф]/u).test(after) &&
    (startsWithVowel.test(after) || endsInVowel.test(before));

  return pick(words.in, words.inAfterVowel, soft);
}

// «Із» before a hissing consonant, unless a vowel comes before.
function fromWord(before: string, after: string): string {
  return pick(words.from, words.fromBeforeSibilant,
    startsHissing.test(after) && !endsInVowel.test(before));
}

// «Й» after a word written in letters that ends in a vowel.
function andWord(before: string): string {
  return pick(words.andPiece, words.andPieceAfterVowel,
    endsInVowel.test(before));
}

// «Весь» after a vowel, «увесь» elsewhere.
function wholeWord(before: string): string {
  return pick(words.whole, words.wholeAfterVowel, endsInVowel.test(before));
}

// «Об» before 11, which is read with a vowel first.
function atWord(before: string, after: string): string {
  return pick(words.at, words.atBeforeVowel, after.startsWith('11:'));
}

// Either spelling of a word is respelled, so that a phrase already
// spelled can be set after another word and spelled again.
const respellings = new Map<string, Respelling>([
  [words.in, inWord],
  [words.inAfterVowel, inWord],
  [words.from, fromWord],
  [words.fromBeforeSibilant, fromWord],
  [words.andPiece, andWord],
  [words.andPieceAfterVowel, andWord],
  [words.at, atWord],
  [words.atBeforeVowel, atWord],
  [words.whole, wholeWord],
  [words.wholeAfterVowel, wholeWord]
]);

/**
 * A phrase with each alternating word spelled by its neighbours;
 * `before` is the word the phrase follows, empty at the start.
 */
function spell(phrase: string, before: string): string {
  const said = phrase.split(' ');
  const spelled: string[] = [];

  said.forEach(function respell(word, index) {
    const respelled = respellings.get(word)?.(
      spelled[index - 1] ?? before, said[index + 1] ?? '');

    spelled.push(respelled ?? word);
  });

  return spelled.join(' ');
}

/** Items in a row: commas, and the joining word before the last. */
function series(items: string[], joiner: string): string {
  return [items.slice(0, -1).join(', '), items[items.length - 1]]
    .filter(Boolean).join(` ${joiner} `);
}

/** A list: «A, B та C». */
function list(items: Array<string | number>): string {
  return series(items.map(String), words.and);
}

/** Pieces of a set: «A, B і C». */
function pieces(items: string[]): string {
  return series(items, words.andPiece);
}

export {list, pieces, spell};
