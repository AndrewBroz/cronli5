// Build dual ESM + CJS modules plus a minified IIFE browser global.
// The runtime source has no dependencies, so bundling is effectively a
// format/minify pass over a single file.
import * as esbuild from 'esbuild';

const shared = {
  entryPoints: ['src/cronli5.js'],
  bundle: true,
  logLevel: 'info'
};

// ESM (for `import`).
await esbuild.build({
  ...shared,
  format: 'esm',
  outfile: 'dist/cronli5.js'
});

// CJS (for `require`). The footer unwraps the ESM default export so that
// `require('cronli5')` returns the function directly rather than `{ default }`.
await esbuild.build({
  ...shared,
  format: 'cjs',
  outfile: 'dist/cronli5.cjs',
  footer: {js: 'module.exports = module.exports.default;'}
});

// Minified browser global (`<script>` usage exposes `window.cronli5`).
await esbuild.build({
  entryPoints: ['src/browser.js'],
  bundle: true,
  format: 'iife',
  minify: true,
  legalComments: 'inline',
  outfile: 'cronli5.min.js'
});
