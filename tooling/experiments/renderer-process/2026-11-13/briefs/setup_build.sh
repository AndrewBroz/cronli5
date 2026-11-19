#!/bin/zsh
# Usage: setup_build.sh <code>   Creates a builder checkout for one language:
# no other renderer, no other language's artifacts, no held-out rows, no
# conformance files, no earlier experiments.
set -e
code=$1
main=/Users/andrewbroz/Code/personal/cronli5
S=/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad
cd $main
git worktree add -q -b $code-build .superpowers/worktrees/$code-build ${2:-renderer-process}
cd .superpowers/worktrees/$code-build
for dir in src/lang/*(/) test/lang/*(/); do
  name=${dir:t}
  if [[ $name != $code && ! ( $dir == src/lang/en ) ]]; then git rm -rq $dir; fi
done
git rm -rq conformance docs/lang tooling/experiments test/lang/$code/paradigms/held-out.js
git rm -q $(git ls-files src/lang/en | grep -v -E "en/(index|lexicon|options)\.ts|status.json")
cp $S/en-stub.ts src/lang/en/index.ts
[[ -f src/lang/$code/status.pending.json ]] && git mv src/lang/$code/status.pending.json src/lang/$code/status.json
python3 - $code <<'PY'
import re,sys
code=sys.argv[1]
def rw(p,f):
    s=open(p).read(); t=f(s); assert t!=s,p; open(p,'w').write(t)
def all_ts(s):
    s=re.sub(r"import (?!en\b)([a-z]+) from './lang/\1/index.js';\n","",s)
    s=s.replace("import en from './lang/en/index.js';\n","import en from './lang/en/index.js';\nimport %s from './lang/%s/index.js';\n"%(code,code))
    return re.sub(r"languages: \[[^\]]*\]","languages: [en, %s]"%code,s)
rw('src/all.ts',all_ts)
def tests(s):
    s=re.sub(r"import (?!en\b)([a-z]+) from '../../src/lang/\1/index.js';\n","",s)
    s=s.replace("import en from '../../src/lang/en/index.js';\n","import en from '../../src/lang/en/index.js';\nimport %s from '../../src/lang/%s/index.js';\n"%(code,code))
    s=re.sub(r"const languages = \[[^\]]*\];","const languages = [en, %s];"%code,s)
    return re.sub(r"const languages = \{[^}]*\};","const languages = {en, %s};"%code,s)
rw('test/lang/contract.js',tests); rw('test/lang/options.js',tests)
PY
ln -s $main/node_modules node_modules
mkdir -p $S/$code-builder
git add -A
git commit -q -m "build setup: no other renderer, no held-out rows"
git status --short | head -3
ls src/lang test/lang test/lang/$code/paradigms
