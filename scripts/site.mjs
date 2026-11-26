// Build the playground into site/dist/: the page, with both libraries'
// versions filled in, and one minified script that bundles cronli5 (from
// source, every language) and cRonstrue (every locale).

import * as esbuild from 'esbuild';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const out = 'site/dist';

function versionOf(path) {
  return JSON.parse(readFileSync(path, 'utf8')).version;
}

mkdirSync(out, {recursive: true});

await esbuild.build({
  bundle: true,
  entryPoints: ['site/playground.js'],
  format: 'iife',
  logLevel: 'info',
  minify: true,
  outfile: `${out}/playground.js`,
  target: 'es2022'
});

writeFileSync(`${out}/index.html`, readFileSync('site/index.html', 'utf8')
  .replace('__CRONLI5_VERSION__', versionOf('package.json'))
  .replace('__CRONSTRUE_VERSION__',
    versionOf('node_modules/cronstrue/package.json')));
