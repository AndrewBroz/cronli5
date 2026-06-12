// Build dual ESM + CJS modules plus a minified IIFE browser global, and
// dual builds of every language module under src/lang/. The runtime
// source has no dependencies, so bundling is effectively a format/minify
// pass over a single file.
import * as esbuild from 'esbuild';
import {readdirSync} from 'node:fs';

const shared = {
  entryPoints: ['src/cronli5.js'],
  bundle: true,
  logLevel: 'info'
};

// The footer unwraps the ESM default export so that `require()` returns
// it directly rather than `{ default }`.
const unwrapDefault = {js: 'module.exports = module.exports.default;'};

// ESM (for `import`).
await esbuild.build({
  ...shared,
  format: 'esm',
  outfile: 'dist/cronli5.js'
});

// CJS (for `require`).
await esbuild.build({
  ...shared,
  format: 'cjs',
  outfile: 'dist/cronli5.cjs',
  footer: unwrapDefault
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

// Language modules: dual builds per language, served by the
// `./lang/<code>` subpath exports.
for (const code of readdirSync('src/lang')) {
  const language = {
    entryPoints: [`src/lang/${code}/index.js`],
    bundle: true,
    logLevel: 'info'
  };

  await esbuild.build({
    ...language,
    format: 'esm',
    outfile: `dist/lang/${code}.js`
  });

  await esbuild.build({
    ...language,
    format: 'cjs',
    outfile: `dist/lang/${code}.cjs`,
    footer: unwrapDefault
  });
}
