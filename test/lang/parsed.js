// A pattern parsed once per test file. The continuity suites look at each
// pattern many times (which fields changed, whether it can run, its parts,
// its sentence), and parsing it each time was most of their run time. The
// result is frozen, so a renderer that changed the facts it was given
// throws here instead of passing on facts it altered.

import {analyze, prepare} from '../../src/core/index.js';
import {optionsFor} from '../../tooling/scripts/edit-diff.mjs';
import {resolve} from '../../src/options.js';

// A value and everything it holds, frozen.
function frozen(value) {
  if (value !== null && typeof value === 'object' &&
      !Object.isFrozen(value)) {
    Object.values(value).forEach(frozen);
    Object.freeze(value);
  }

  return value;
}

/**
 * A parse for one language: the resolved options and the analysed
 * schedule of a pattern, computed the first time it is asked for.
 */
export function parser(language) {
  const setup = {languages: [language], options: {}, styles: {}};
  const parsed = new Map();

  return function parse(pattern, options) {
    const key = JSON.stringify([pattern, options]);

    if (!parsed.has(key)) {
      const {opts} = resolve(setup, {...optionsFor(pattern), ...options});

      parsed.set(key, frozen({opts, schedule: analyze(prepare(pattern, opts))}));
    }

    return parsed.get(key);
  };
}
