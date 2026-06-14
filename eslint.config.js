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

// Local rule: parameter-tail conventions, so call sites stay uniform and
// feature work can't reintroduce the signature drift that crept in when
// flags got appended after `opts`. Two tied conventions:
//   - A callback (`cb`) is control flow, not data, and reads cleanly only
//     as a trailing function literal — so it must come last.
//   - The render-options bag (`opts`) is last among the *data* parameters:
//     the final parameter, or second-to-last when a callback trails it.
function isCallback(param) {
  return param.type === 'Identifier' &&
    (param.name === 'cb' || param.name === 'callback');
}

const paramTailOrder = {
  meta: {
    type: 'suggestion',
    docs: {description: 'require the `…, opts, cb` parameter-tail order'},
    schema: []
  },
  create(context) {
    function check(node) {
      const params = node.params;
      const lastIndex = params.length - 1;
      const trailingCallback = lastIndex >= 0 && isCallback(params[lastIndex]);
      const optsIndex = trailingCallback ? lastIndex - 1 : lastIndex;

      params.forEach(function each(param, index) {
        if (isCallback(param) && index !== lastIndex) {
          context.report({
            node: param,
            message: 'A callback parameter must come last.'
          });
        }

        if (param.type === 'Identifier' && param.name === 'opts' &&
            index !== optsIndex) {
          context.report({
            node: param,
            message: 'The `opts` parameter must come last, ' +
              'before any trailing callback.'
          });
        }
      });
    }

    return {
      ArrowFunctionExpression: check,
      FunctionDeclaration: check,
      FunctionExpression: check
    };
  }
};

export default [
  ...compat.config({
    extends: legacy.extends,
    rules: supportedRules
  }),
  {
    plugins: {local: {rules: {'param-tail-order': paramTailOrder}}},
    rules: {'local/param-tail-order': 'error'}
  },
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
