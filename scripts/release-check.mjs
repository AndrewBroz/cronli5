// A push to main is a release: it must raise the version and carry the
// tag for it. The pre-push hook pipes git's ref lines to this script,
// which exits 1 with the reasons when a push to main is not a release.
//
//   <local ref> <local sha> <remote ref> <remote sha>   (one per ref)

import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const release = 'refs/heads/main';
const none = /^0+$/u;

// The parts of a version, so that 1.10.0 is above 1.9.0.
function partsOf(version) {
  return version.split(/[.-]/u).slice(0, 3).map(Number);
}

function above(version, than) {
  const [a, b] = [partsOf(version), partsOf(than)];
  const differ = a.findIndex(function unequal(part, at) {
    return part !== b[at];
  });

  return differ >= 0 && a[differ] > b[differ];
}

function linesOf(text) {
  return text.split('\n').map(function fields(line) {
    return line.trim().split(/\s+/u);
  }).filter(function complete(line) {
    return line.length === 4;
  }).map(function named([localRef, local, remoteRef, remote]) {
    return {local, localRef, remote, remoteRef};
  });
}

/**
 * Why a push to main is not a release, given git's ref lines and a
 * reader for what each commit holds; empty when it is one, or when it
 * does not touch main.
 */
export function releaseProblems(text, git) {
  const lines = linesOf(text);
  const pushed = new Map(lines.filter(function tags(line) {
    return line.remoteRef.startsWith('refs/tags/') && !none.test(line.local);
  }).map(function byName(line) {
    return [line.remoteRef.slice('refs/tags/'.length), line.local];
  }));

  return lines.filter(function toMain(line) {
    return line.remoteRef === release && !none.test(line.local);
  }).flatMap(function check({local, remote}) {
    const {lock, version} = git.versions(local);
    const tag = `v${version}`;
    const before = none.test(remote) ? null : git.versions(remote).version;
    const tagged = pushed.get(tag) ?? git.remoteTag(tag);
    const problems = [];

    if (before && !above(version, before)) {
      problems.push(`package.json says ${version}; main has ${before}. ` +
        'Raise the version for a push to main.');
    }

    if (lock !== version) {
      problems.push(`package-lock.json says ${lock}, package.json ${version}.`);
    }

    if (!git.changelog(local).includes(`## [${version}]`)) {
      problems.push(`CHANGELOG.md has no "## [${version}]" section.`);
    }

    if (!tagged) {
      problems.push(`Tag ${tag} is neither in this push nor on the remote. ` +
        `Tag the commit (git tag -a ${tag} -m ${version}) and push it ` +
        'with main (git push --follow-tags).');
    }
    else if (git.commitOf(tagged) !== local) {
      problems.push(`Tag ${tag} is not on the commit being pushed to main.`);
    }

    return problems;
  });
}

function show(sha, path) {
  return execFileSync('git', ['show', `${sha}:${path}`], {encoding: 'utf8'});
}

const gitReader = {
  changelog(sha) {
    return show(sha, 'CHANGELOG.md');
  },
  commitOf(object) {
    return execFileSync('git', ['rev-parse', `${object}^{commit}`],
      {encoding: 'utf8'}).trim();
  },
  remoteTag(tag) {
    const remote = process.argv[2] || 'origin';
    const out = execFileSync('git', ['ls-remote', remote, `refs/tags/${tag}`],
      {encoding: 'utf8'}).trim();

    return out ? out.split(/\s+/u)[0] : null;
  },
  versions(sha) {
    return {
      lock: JSON.parse(show(sha, 'package-lock.json')).version,
      version: JSON.parse(show(sha, 'package.json')).version
    };
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = releaseProblems(readFileSync(0, 'utf8'), gitReader);

  if (problems.length > 0) {
    console.error(['pre-push: a push to main must be a release:',
      ...problems.map(function bullet(problem) {
        return `  - ${problem}`;
      })].join('\n'));
    process.exitCode = 1;
  }
}
