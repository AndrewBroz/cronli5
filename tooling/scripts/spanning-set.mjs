// The spanning set for the language pipeline: simple (basic) + compound
// (showcase) cron patterns, reused from the curated docs sets, ordered
// simple-first. Run directly to print its size.

import {pathToFileURL} from 'node:url';
import {coverageExtras, spanningSet, tables} from '../../scripts/patterns.mjs';

export {spanningSet};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('Spanning set: ' + spanningSet.length + ' patterns (' +
    tables.basic.length + ' simple, ' + tables.showcase.length +
    ' compound, ' + coverageExtras.length + ' breadth fillers).');
}
