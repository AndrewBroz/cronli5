// Flat ESLint config. The curated rule set lives in `.eslintrc.json` and is
// bridged into flat config via `FlatCompat` so it stays the single source of
// truth without a full rule-by-rule rewrite.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import globals from 'globals';
import {Linter} from 'eslint';
import {FlatCompat} from '@eslint/eslintrc';

const legacy = JSON.parse(
  readFileSync(new URL('./.eslintrc.json', import.meta.url), 'utf8')
);

const compat = new FlatCompat({
  baseDirectory: fileURLToPath(new URL('.', import.meta.url)),
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

// Drop any legacy rules that no longer exist in ESLint core (e.g. `valid-jsdoc`
// and other rules removed across major versions) so the curated set keeps
// working without a manual audit.
const coreRules = new Linter({configType: 'eslintrc'}).getRules();
const supportedRules = Object.fromEntries(
  Object.entries(legacy.rules).filter(function(entry) {
    return coreRules.has(entry[0]);
  })
);

export default [
  ...compat.config({
    extends: legacy.extends,
    rules: supportedRules
  }),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    // The core `sort-imports` rule is rigid (case-sensitive, sorts by first
    // member rather than module path) and fights natural ESM import grouping.
    rules: {
      'sort-imports': 'off'
    }
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    },
    // Test tables intentionally hold long expected-output strings on a single
    // line; wrapping them hurts readability of the input/output pairs.
    rules: {
      'max-len': 'off'
    }
  }
];
