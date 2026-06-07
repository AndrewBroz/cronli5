// Flat ESLint config. The curated rule set lives in `.eslintrc.json` and is
// bridged into flat config via `FlatCompat` so it stays the single source of
// truth without a full rule-by-rule rewrite.
const js = require('@eslint/js');
const globals = require('globals');
const { Linter } = require('eslint');
const { FlatCompat } = require('@eslint/eslintrc');
const legacy = require('./.eslintrc.json');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

// Drop any legacy rules that no longer exist in ESLint core (e.g. `valid-jsdoc`
// and other rules removed across major versions) so the curated set keeps
// working without a manual audit.
const coreRules = new Linter({ configType: 'eslintrc' }).getRules();
const supportedRules = Object.fromEntries(
  Object.entries(legacy.rules).filter(function(entry) {
    return coreRules.has(entry[0]);
  })
);

module.exports = [
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
