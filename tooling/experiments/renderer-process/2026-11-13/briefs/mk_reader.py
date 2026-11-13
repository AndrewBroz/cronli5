# Usage: mk_reader.py <code> <Name> — writes <code>-author/READER.md
import sys
S='/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad'
c,n=sys.argv[1:3]
s=open(S+'/reader-brief.md').read()
s=s.replace('{NAME}',n).replace('{CODE}',c).replace('{WT}',f'/Users/andrewbroz/Code/personal/cronli5/.superpowers/worktrees/{c}-art')
s+=f"""
More facts that bind: Quartz `nW` never leaves its month (`1W` is the month's first Monday-to-Friday day) and fires only in months that have day n; `L-n` fires only in months long enough; a day a month lacks is skipped (`0 0 31 6 *` never fires). A day field written as a full range (`1-31`) is not `*`.

Schedule traps found in other languages after their rows had passed their authors and builders. Test every one against these rows, and where no row covers a trap, say what the rule book would produce and whether it is right:
- an exception on the date side of a date-or-weekday pattern, read as applying to the whole (`0 9 1-14,16-31 * 5`: a Friday the 15th fires);
- a trailing qualifier (seconds, "each", a time) that attaches only to the last item of a list; an exception that attaches only to a stray value;
- an excepted hour or minute under seconds read as a single second;
- a year or month that attaches to only part of the calendar phrase;
- a cadence from a start, read as carrying on past the month or as a start date;
- a wrapped run of numbers read backwards or as a mistake (minutes 50 to 10; days 20 to 10; hours 17 to 5);
- hours across midnight beside a named day (`0 22-2 * * 1` is Monday 0:00–2:00 and Monday 22:00–23:00, not Monday night into Tuesday);
- a window that names a moment an exception then removes;
- words for a group of days (working days, weekend) that mean a different set to some readers, or carry public holidays;
- output nobody can hold: a list of dozens of items where a rule could say it.

Also read `src/lang/{c}/usage.md` after the rows: it describes how {n} writes recurring times and was written with no knowledge of this project. Report where the rows or rule book depart from it without a stated reason.

Save your full report to `{S}/judges/{c}-read-1.md` and give the same as your final message.
"""
open(f'{S}/{c}-author/READER.md','w').write(s)
