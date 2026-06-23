// Shared sampler over the fuzz pattern space: one pattern per distinct output
// shape in a given language (the wide, IR-deduped set), and an evenly-spaced
// spread for a budget-limited subset. Used by panel.mjs (--wide) and
// roundtrip.mjs to drive review beyond the curated spanning set.

import {patterns} from '../../scripts/fuzz-lang.mjs';
import cronli5 from '../../src/cronli5.js';

// One pattern per distinct output shape in `lang` — abstracting digits, so two
// patterns differing only in their numbers collapse to one representative.
function sampleShapes(lang) {
  const byShape = new Map();

  patterns().forEach(function shape(pattern) {
    let output = null;

    try {
      output = cronli5(pattern, {lang});
    }
    catch {
      output = null;
    }

    if (output) {
      const key = output.replace(/\d+/gu, 'N');

      if (!byShape.has(key)) {
        byShape.set(key, pattern);
      }
    }
  });

  return [...byShape.values()];
}

// Evenly-spaced picks across the list (a diverse, reproducible spread).
function spread(items, count) {
  if (!count || count >= items.length) {
    return items;
  }

  const stride = items.length / count;
  const out = [];

  for (let i = 0; i < count; i += 1) {
    out.push(items[Math.floor(i * stride)]);
  }

  return out;
}

export {sampleShapes, spread};
