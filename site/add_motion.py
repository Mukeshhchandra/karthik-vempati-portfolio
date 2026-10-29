from pathlib import Path
p=Path(__file__).parent/'build.py'
s=p.read_text(encoding='utf-8')
s=s.replace('<script src="/site.js" defer></script>', '<script src="/site.js" defer></script><script src="/motion.js" defer></script>')
s=s.replace('<figure class="hero-portrait">', '<div class="hero-stage"><canvas class="sculpture" aria-hidden="true"></canvas><span class="stage-caption" aria-hidden="true">FORM / FUNCTION / FEELING</span><figure class="hero-portrait">')
s=s.replace('The person behind the pixels</span></figure></div>', 'The person behind the pixels</span></figure><button class="motion-toggle" aria-pressed="false">Pause motion <span aria-hidden="true">Ⅱ</span></button></div></div>')
marker="write(Path('index.html'),shell("
insert='''orbit_cards=''.join(f'<a class="orbit-card" href="/work/{p["slug"]}/" data-title="{esc(p["name"])}" data-subtitle="{esc(p["tagline"])}" aria-label="Explore {esc(p["name"])}">{img(p["cover"],p["coverAlt"])}<span class="orbit-card-label">{p["name"]} {arrow()}</span></a>' for p in projects)
orbit=f''' + "'''" + '''<section class="orbit-section" aria-labelledby="orbit-heading"><div class="container orbit-heading"><div><p class="section-label">Six projects. Different perspectives.</p><h2 id="orbit-heading">Work in <em>motion.</em></h2></div><a href="#work" class="text-link">View the full collection ↓</a></div><div class="orbit-viewport" role="region" aria-label="Project gallery" aria-roledescription="carousel"><div class="orbit-track">{orbit_cards}</div></div><div class="container orbit-bottom"><div class="orbit-description" aria-live="polite" aria-atomic="true"><span class="orbit-counter">01 / 06</span><h3 class="orbit-title">{projects[0]['name']}</h3><p class="orbit-subtitle">{projects[0]['tagline']}</p></div><div class="orbit-controls"><button class="orbit-prev" aria-label="Previous project">←</button><button class="orbit-next" aria-label="Next project">→</button></div></div></section>''' + "'''" + '''
home=home.replace('<section class="work-section',orbit+'<section class="work-section')
'''
if 'orbit_cards=' not in s:s=s.replace(marker,insert+marker)
p.write_text(s,encoding='utf-8')
