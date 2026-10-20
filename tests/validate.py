"""Dependency-free static integrity checks. Run: python3 tests/validate.py"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from collections import Counter
import json, re, gzip, xml.etree.ElementTree as ET, unicodedata

ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self,path):
        super().__init__(convert_charrefs=True)
        self.path=path;self.tags=[];self.ids=[];self.scripts=[];self.script=None;self.h1=0;self.h1text='';self.in_h1=False
        self.feed(path.read_text())
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);self.tags.append((tag,a))
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1;self.in_h1=True
        if tag=='script':self.script={'attrs':a,'text':''}
    def handle_data(self,s):
        if self.script is not None:self.script['text']+=s
        if self.in_h1:self.h1text+=s
    def handle_endtag(self,tag):
        if tag=='script' and self.script is not None:self.scripts.append(self.script);self.script=None
        if tag=='h1':self.in_h1=False

errors=[]
def check(condition,message):
    if not condition:errors.append(message)
def slug(v):
    v=unicodedata.normalize('NFKD',v.lower()).encode('ascii','ignore').decode().replace('&',' and ')
    return re.sub('[^a-z0-9]+','-',v).strip('-')
def resolve(href,current):
    path=unquote(urlsplit(href).path)
    if not path:return current
    target=ROOT/path.lstrip('/') if path.startswith('/') else current.parent/path
    if target.is_dir():target=target/'index.html'
    return target

pages={p:Page(p) for p in ROOT.rglob('*.html')}
check(len(pages)==163,f'Expected 163 HTML files, found {len(pages)}')
for path,page in pages.items():
    label=str(path.relative_to(ROOT))
    check(page.h1==1,f'{label}: expected one h1')
    check(len(page.ids)==len(set(page.ids)),f'{label}: duplicate IDs')
    check(any(t=='html' and a.get('lang') in ['en','id','zh'] for t,a in page.tags),f'{label}: missing language')
    check(any(t=='main' and a.get('id')=='main' for t,a in page.tags),f'{label}: missing main landmark')
    check(any(t=='link' and a.get('rel')=='canonical' for t,a in page.tags),f'{label}: missing canonical')
    check(any(t=='meta' and a.get('name')=='description' and a.get('content') for t,a in page.tags),f'{label}: missing description')
    check(any(t=='meta' and a.get('name')=='viewport' for t,a in page.tags),f'{label}: missing viewport')
    for tag,a in page.tags:
        check(not any(k.startswith('on') for k in a),f'{label}: inline event handler')
        for attr in ['aria-controls','aria-labelledby','aria-describedby']:
            for ref in a.get(attr,'').split():check(ref in page.ids,f'{label}: unresolved {attr}={ref}')
        if tag=='label' and 'for' in a:check(a['for'] in page.ids,f'{label}: label target missing')
        if tag=='img':
            check('alt' in a,f'{label}: image lacks alt')
            check('width' in a and 'height' in a,f'{label}: image dimensions missing')
        if tag=='a' and a.get('target')=='_blank':check('noopener' in a.get('rel',''),f'{label}: unsafe external tab')
        references=[a[k] for k in ['href','src'] if k in a]
        references += [x.strip().split()[0] for x in a.get('srcset','').split(',') if x.strip()]
        for ref in references:
            parts=urlsplit(ref)
            if parts.scheme or parts.netloc:continue
            target=resolve(ref,path)
            check(target.exists(),f'{label}: broken local resource {ref}')
            if parts.fragment and target in pages:
                check(unquote(parts.fragment) in pages[target].ids,f'{label}: broken fragment {ref}')
    for s in page.scripts:
        if s['attrs'].get('type') in ['application/ld+json','application/json']:
            try:json.loads(s['text'])
            except Exception as e:errors.append(f'{label}: invalid embedded JSON: {e}')

projects=json.loads((ROOT/'data/projects.json').read_text())
check(len(projects)==50,'Project inventory changed')
for lang in ['en','id','zh']:
    prefix='' if lang=='en' else lang+'/'
    locale=json.loads((ROOT/f'data/locales/{lang}.json').read_text())
    archive=pages[ROOT/f'{prefix}projects/index.html']
    check(sum('data-project' in a for _,a in archive.tags)==50,f'{lang}: archive does not include all 50 projects in HTML')
    for p in projects:
        path=ROOT/f'{prefix}projects/{slug(p["name"])}/index.html'
        check(path in pages,f'{lang}: missing project {p["id"]}')
        if path not in pages:continue
        page=pages[path];text=path.read_text();attrs=[a for _,a in page.tags]
        check(page.h1text==p['name'],f'{lang}: project name changed: {p["id"]}')
        # HTMLParser converts escaped entities back to their original link text.
        hrefs={a.get('href') for a in attrs}
        for k,v in p.items():
            if k.endswith('_link') and v:check(v in hrefs,f'{lang}/{p["id"]}: missing original link {k}')
        from html import escape
        description=locale['projects']['items'][p['i18nKey'].split('.')[-1]]
        check(escape(description,quote=True) in text,f'{lang}/{p["id"]}: localized description lost')

config=json.loads((ROOT/'vercel.json').read_text())
check(config['git']['deploymentEnabled']['dev'] is False,'dev auto-deploy must stay disabled pending approval')
check(config['framework'] is None and config['buildCommand']=='' and config['installCommand']=='','Framework/build commands remain')
check('rewrites' not in config,'Catch-all SPA rewrite must be removed')
check(not (ROOT/'package.json').exists(),'npm manifest remains')
for r in config['redirects']:
    if ':path*' not in r['destination']:check(resolve(r['destination'],ROOT/'index.html').exists(),f'Broken redirect: {r}')
    check(r['source']!=r['destination'],'Redirect loop')
sitemap=ET.parse(ROOT/'sitemap.xml')
locs=sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
check(len(locs)==162,f'Sitemap has {len(locs)} URLs, expected 162')
for loc in locs:check(resolve(urlsplit(loc.text).path,ROOT/'index.html').exists(),f'Broken sitemap URL {loc.text}')
index=json.loads((ROOT/'assets/project-index.json').read_text())
check(len(index)==50,'Search index lost projects')
check({x['slug'] for x in index}=={slug(x['name']) for x in projects},'Search index routes mismatch')

# Contrast for the actual light/dark body, muted text and accent token pairs.
def luminance(color):
    vals=[int(color[i:i+2],16)/255 for i in (1,3,5)]
    vals=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in vals]
    return sum(a*b for a,b in zip(vals,[.2126,.7152,.0722]))
for fg,bg in [('#193c32','#f4f5ee'),('#56665d','#f4f5ee'),('#56665d','#e9ede3'),('#eaf0e4','#101d18'),('#b0bdaf','#192b23'),('#193c32','#ddf478')]:
    a,b=sorted([luminance(fg),luminance(bg)]);contrast=(b+.05)/(a+.05)
    check(contrast>=4.5,f'Insufficient text contrast {fg}/{bg}: {contrast:.2f}')
css=(ROOT/'assets/site.css').read_text()
check('prefers-reduced-motion:reduce' in css,'Missing reduced-motion handling')
check('.js [hidden]{display:none!important}' in css,'Hidden filter controls can be overridden')
for name,budget in [('assets/site.css',8000),('assets/site.js',5000),('assets/core.mjs',1500),('index.html',9000)]:
    size=len(gzip.compress((ROOT/name).read_bytes()));check(size<=budget,f'{name}: {size} gzip bytes exceeds {budget}')
if errors:
    print('\n'.join(errors));raise SystemExit(f'FAILED: {len(errors)} errors')
print(f'PASS: {len(pages)} HTML pages; 150 localized project pages; 50 preserved project records and links; 162 sitemap URLs; local assets, anchors, metadata, ARIA references, contrast tokens and size budgets.')
