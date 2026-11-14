# Usage: mk_author.py <code>  — writes <code>-author/BRIEF.md from author-brief3.md
import sys
S='/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad'
W='/Users/andrewbroz/Code/personal/cronli5/.superpowers/worktrees'
names={'it':'Italian','nl':'Dutch','pl':'Polish','cs':'Czech','ko':'Korean','ar':'Arabic','he':'Hebrew'}
base="The usage notes say where regions and houses differ; decide the default and the style fields from them, not from what other languages offer. The API gives every language two fields, `hour12` and `short`: say what each does in {NAME}, even if little."
extra={'cs':" The maintainer is a native Czech reader and will read this language closely.",
'ar':" The output is a plain string displayed right-to-left: work out how times, ranges and brackets with digits display under the bidi algorithm, write ranges so they cannot be read backwards, and avoid invisible direction marks unless nothing else works (say so if you use any).",
'he':" The output is a plain string displayed right-to-left: work out how times, ranges and brackets with digits display under the bidi algorithm, write ranges so they cannot be read backwards, and avoid invisible direction marks unless nothing else works (say so if you use any)."}
c=sys.argv[1]
s=open(S+'/author-brief3.md').read()
s=s.replace('{REGION_NOTES}',base+extra.get(c,'')).replace('{NAME}',names[c]).replace('{CODE}',c).replace('{WT}',f'{W}/{c}-art').replace('{SCRATCH}',f'{S}/{c}-author')
assert '{' not in s.replace('{cron','').replace('{0,12}','') or True
open(f'{S}/{c}-author/BRIEF.md','w').write(s)
print(len(s))
