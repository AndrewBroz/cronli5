// The small joins every phrase is made with: a list, a list whose items
// have something leading them, a counted unit, and words set side by side.

import lexicon from './lexicon.js';

const {words} = lexicon;

/** An item of a list and what leads it: «às» before «09:00». */
export interface Led {
  lead: string;
  text: string;
}

/** A unit alone and after a number other than one. */
export interface Unit {
  many: string;
  one: string;
}

/** The words that are there, with single spaces between them. */
function spaced(parts: Array<string | false>): string {
  return parts.filter(Boolean).join(' ');
}

/** Items joined with commas and «e» before the last, with no comma there. */
function list(items: string[]): string {
  return [items.slice(0, -1).join(', '), ...items.slice(-1)]
    .filter(Boolean).join(` ${words.and} `);
}

/**
 * A list in which what leads an item is said once for each group of
 * neighbouring items that share it: «às 00:00, à 01:00 e às 22:00 e 23:00».
 */
function led(items: Led[]): string {
  const groups = items.reduce(function gather(found: Led[][], item) {
    const current = found[found.length - 1];

    if (current && current[0].lead === item.lead) {
      current.push(item);
    }
    else {
      found.push([item]);
    }

    return found;
  }, []);

  return list(groups.map((group) => spaced([
    group[0].lead,
    list(group.map((item) => item.text))
  ])));
}

/** What is said of some values, as a list of one, or nothing for none. */
function ifAny<Value>(values: Value[], say: (values: Value[]) => string):
  string[] {
  return values.length > 0 ? [say(values)] : [];
}

/** A number and its unit, singular for one: «1 segundo», «30 segundos». */
function counted(count: number, unit: Unit): string {
  return `${count} ${count === 1 ? unit.one : unit.many}`;
}

export {counted, ifAny, led, list, spaced};
