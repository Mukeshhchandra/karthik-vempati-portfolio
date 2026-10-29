from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json

root=Path(__file__).resolve().parent/'dist'
class Page(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.links=[];self.assets=[];self.h1=0;self.errors=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='a' and a.get('href'):self.links.append(a['href'])
        if tag in ['img','script','source'] and a.get('src'):self.assets.append(a['src'])
        if tag=='video' and a.get('poster'):self.assets.append(a['poster'])
        if tag=='img' and 'alt' not in a:self.errors.append('Image lacks alt')
        if tag=='link' and a.get('href'):self.assets.append(a['href'])
pages={}
for path in root.rglob('*.html'):
    if path.name.startswith('_qa'):continue
    page=Page();page.feed(path.read_text(encoding='utf-8'));pages[path.resolve()]=page
errors=[];links=0
for path,page in pages.items():
    if page.h1!=1:errors.append(f'{path}: expected one h1, got {page.h1}')
    if len(page.ids)!=len(set(page.ids)):errors.append(f'{path}: duplicate IDs')
    errors.extend(f'{path}: {s}' for s in page.errors)
    for url in page.links+page.assets:
        parsed=urlsplit(url)
        if parsed.scheme or parsed.netloc:continue
        rel=unquote(parsed.path)
        target=(root/rel.lstrip('/')) if rel.startswith('/') else (path.parent/rel if rel else path)
        if target.is_dir():target=target/'index.html'
        if not target.exists():errors.append(f'{path}: missing {url}')
        if parsed.fragment:
            destination=pages.get(target.resolve())
            if destination and parsed.fragment not in destination.ids:errors.append(f'{path}: missing fragment {url}')
        links+=1
print(json.dumps({'pages':len(pages),'local_references_checked':links,'errors':errors,'assets_bytes':sum(p.stat().st_size for p in (root/'assets').iterdir())},indent=2))
raise SystemExit(bool(errors))
