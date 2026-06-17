// Point git at the version-controlled hooks in .githooks/ (the `prepare`
// script runs this on every `npm install`). It no-ops when there is no git
// checkout — e.g. a published tarball install — so it never breaks installs.

import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';

// `.git` is a directory in a normal checkout and a file in a worktree; either
// way, its presence means we are inside the repository.
if (existsSync('.git')) {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks']);
  console.log('Git hooks enabled (core.hooksPath → .githooks).');
}
