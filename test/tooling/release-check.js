import chai from 'chai';
import {releaseProblems} from '../../scripts/release-check.mjs';

const {expect} = chai;

const zero = '0'.repeat(40);
const commits = {
  old: {changelog: '## [1.0.0]', lock: '1.0.0', version: '1.0.0'},
  same: {changelog: '## [1.0.0]', lock: '1.0.0', version: '1.0.0'},
  ten: {changelog: '## [1.10.0]', lock: '1.10.0', version: '1.10.0'},
  good: {changelog: '## [1.1.0]\n## [1.0.0]', lock: '1.1.0', version: '1.1.0'},
  stale: {changelog: '## [1.0.0]', lock: '1.0.0', version: '1.1.0'}
};

// A stand-in for git: commits by name, tags as tag object → commit.
function reader(tags = {}, remote = {}) {
  return {
    changelog(sha) {
      return commits[sha].changelog;
    },
    commitOf(object) {
      return tags[object] ?? object;
    },
    remoteTag(name) {
      return remote[name] ?? null;
    },
    versions(sha) {
      return {lock: commits[sha].lock, version: commits[sha].version};
    }
  };
}

function main(local, remote = 'old') {
  return `refs/heads/x ${local} refs/heads/main ${remote}\n`;
}

function tag(name, object) {
  return `refs/tags/${name} ${object} refs/tags/${name} ${zero}\n`;
}

describe('the release check on a push to main:', function() {
  it('passes a raised version tagged in the same push', function() {
    const text = main('good') + tag('v1.1.0', 'tagobject');

    expect(releaseProblems(text, reader({tagobject: 'good'}))).to.deep.equal([]);
  });

  it('passes a tag already on the remote', function() {
    expect(releaseProblems(main('good'), reader({}, {'v1.1.0': 'good'})))
      .to.deep.equal([]);
  });

  it('ignores pushes to other branches', function() {
    const text = 'refs/heads/develop same refs/heads/develop old\n';

    expect(releaseProblems(text, reader())).to.deep.equal([]);
  });

  it('ignores deleting a branch', function() {
    expect(releaseProblems(main(zero), reader())).to.deep.equal([]);
  });

  it('refuses a version that is not raised', function() {
    const problems = releaseProblems(main('same') + tag('v1.0.0', 'same'),
      reader());

    expect(problems).to.have.length(1);
    expect(problems[0]).to.match(/Raise the version/u);
  });

  it('compares versions by number, not as text', function() {
    const text = main('ten', 'good') + tag('v1.10.0', 'ten');

    expect(releaseProblems(text, reader())).to.deep.equal([]);
  });

  it('refuses a push without the tag', function() {
    const problems = releaseProblems(main('good'), reader());

    expect(problems).to.have.length(1);
    expect(problems[0]).to.match(/Tag v1\.1\.0 is neither/u);
  });

  it('refuses a tag on another commit', function() {
    const problems = releaseProblems(main('good') + tag('v1.1.0', 'old'),
      reader());

    expect(problems).to.deep.equal(
      ['Tag v1.1.0 is not on the commit being pushed to main.']);
  });

  it('refuses a stale lockfile and a missing changelog section', function() {
    const problems = releaseProblems(main('stale') + tag('v1.1.0', 'stale'),
      reader());

    expect(problems).to.have.length(2);
    expect(problems[0]).to.match(/package-lock\.json says 1\.0\.0/u);
    expect(problems[1]).to.match(/no "## \[1\.1\.0\]" section/u);
  });

  it('checks only the raise for a first push to main', function() {
    const text = main('good', zero) + tag('v1.1.0', 'good');

    expect(releaseProblems(text, reader())).to.deep.equal([]);
  });
});
