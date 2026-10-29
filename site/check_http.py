from pathlib import Path
from urllib.request import urlopen
import hashlib,json
root=Path(__file__).resolve().parent
routes=['/','/about/','/resume/']+['/work/'+p['slug']+'/' for p in json.loads((root/'projects.json').read_text())]
results=[]
for route in routes+['/site.css','/cinematic.css','/inner-pages.css','/site.js','/motion.js','/echo.js','/assets/Karthik_Vempati_Resume.docx']:
    with urlopen('http://127.0.0.1:4173'+route,timeout=15) as response:
        data=response.read()
        assert response.status==200 and len(data)>0
        results.append({'route':route,'status':response.status,'bytes':len(data)})
        if route.endswith('.docx'):
            assert hashlib.sha256(data).digest()==hashlib.sha256((root/'dist/assets/Karthik_Vempati_Resume.docx').read_bytes()).digest()
(root/'http-checks.json').write_text(json.dumps(results,indent=2))
print(f'{len(results)} HTTP checks passed; résumé download matches the local file.')
