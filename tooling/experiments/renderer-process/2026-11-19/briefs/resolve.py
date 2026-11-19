import re,sys,subprocess
def hunks(text):
    out=[];pos=0
    for m in re.finditer(r'<<<<<<< [^\n]*\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n',text,re.S):
        out.append((text[pos:m.start()],m.group(1),m.group(2)));pos=m.end()
    return out,text[pos:]
def key(tok):
    k=tok.strip().strip("'").split(':')[0].strip().strip("'").lower()
    return {'italian':'it','indonesian':'id','zhhant':'zh-hant'}.get(k,k)
def merge_list(ours,theirs):
    mo=re.match(r'^(.*?[\[{])(.*)([\]}].*)$',ours.strip('\n'),re.S); mt=re.match(r'^(.*?[\[{])(.*)([\]}].*)$',theirs.strip('\n'),re.S)
    if not mo or not mt:
        # bare list lines (no brackets)
        pre,post='',''; io=ours.strip('\n'); it=theirs.strip('\n'); ind=re.match(r'\s*',io).group(0)
        a=[t.strip() for t in io.strip().split(',') if t.strip()]; b=[t.strip() for t in it.strip().split(',') if t.strip()]
    else:
        pre,post=mo.group(1),mo.group(3); ind=''
        a=[t.strip() for t in mo.group(2).replace('\n',' ').split(',') if t.strip()]; b=[t.strip() for t in mt.group(2).replace('\n',' ').split(',') if t.strip()]
    ka=[key(t) for t in a]
    for t in b:
        if key(t) in ka: continue
        i=1
        while i<len(a) and key(a[i])<key(t): i+=1
        a.insert(i,t); ka.insert(i,key(t))
    line=ind+pre+', '.join(a)+post
    if len(line)>80 and pre:
        # wrap inside brackets
        inner=', '.join(a); words=inner.split(', '); lines=[];cur='  '
        for w in words:
            add=w+', '
            if len(cur)+len(add)>79: lines.append(cur.rstrip()); cur='  '
            cur+=add
        lines.append(cur.rstrip().rstrip(','))
        base=re.match(r'\s*',pre).group(0)
        line=pre+'\n'+'\n'.join(base+l for l in lines)+'\n'+base+post
    return line+'\n'
for f in sys.argv[1:]:
    text=open(f).read(); hs,tail=hunks(text); out=''
    for before,o,t in hs:
        if f.endswith('CHANGELOG.md') or f.endswith('prompts.mjs'):
            res=o+t   # both entries, ours first
        else:
            res=merge_list(o,t)
        out+=before+res
    open(f,'w').write(out+tail); print(f,len(hs),'hunks')
