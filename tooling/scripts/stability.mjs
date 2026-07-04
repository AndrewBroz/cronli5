// English entry for the relational stability suite: the language-agnostic
// engine (tooling/scripts/stability-engine.mjs) parameterized by the en
// extractor. A new language ports the donor's extractor and gets the same
// relations; see tooling/docs/language-pipeline.md (Verify). Run directly
// to print the report (non-zero exit on any violation);
// test/lang/en/stability.js gates it.

import {pathToFileURL} from 'node:url';
import {DATES, TIMES, WEEKDAYS, makeStability} from './stability-engine.mjs';
import {en} from './stability/en.mjs';

const {checkPair, run} = makeStability(en);
const DIALECTS = en.dialects;

export {DATES, DIALECTS, TIMES, WEEKDAYS, checkPair, run};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = run().length ? 1 : 0;
}
