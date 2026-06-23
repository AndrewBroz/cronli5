# Pipeline experiments

The add-language pipeline's `rewrite-test` mode writes candidate renderers,
corpora, train/holdout splits, and judge tallies here — one `<code>-rebuild*`
tree per run — so they can be compared against the incumbent `src/lang/<code>`
without ever touching the shipped source tree.

Nothing here ships (not in `package.json` `files`), is built (`build.mjs` and
`tsconfig` only see `src/`), or tested (`mocha` only globs `test/`). These are
disposable research artifacts; promote a winner into `src/lang/` + a
human-reviewed `test/lang/<code>/corpus.js` only via the normal beta flow.
