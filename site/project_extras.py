"""Presentation additions built from the portfolio's existing project artwork."""

def photomax_showcase(img):
    return f'''<aside class="photomax-showcase" id="photomax-showcase" aria-labelledby="photomax-showcase-title">
      <div class="photomax-showcase-top"><span class="photomax-signature"><span class="photomax-frame-mark" aria-hidden="true"></span>PHOTOMAX</span><span>THE CREATIVE CONNECTION</span></div>
      <div class="photomax-showcase-main">
        <div class="photomax-showcase-copy"><p class="photomax-eyebrow">A PLATFORM FOR PERSPECTIVE</p><h3 id="photomax-showcase-title">A world<br>of talent.<br><em>In focus.</em></h3><p>Find the eye behind the image.<br>Turn a creative connection into<br>the next opportunity.</p></div>
        <div class="photomax-showcase-art"><span class="photomax-focus-ring" aria-hidden="true"></span>
          <figure class="photomax-screen photomax-screen-discover"><button class="zoom-image" data-full="/assets/work-011.webp" data-caption="Discover photographers." aria-label="Enlarge Photomax discovery screen">{img('work-011','Photomax mobile discovery screen showing photographers and their specialties')}<span class="zoom-hint" aria-hidden="true">↗</span></button></figure>
          <figure class="photomax-screen photomax-screen-connect"><button class="zoom-image" data-full="/assets/work-015.webp" data-caption="Respond to a request." aria-label="Enlarge Photomax request screen">{img('work-015','Photomax mobile screen for responding to a photography request')}<span class="zoom-hint" aria-hidden="true">↗</span></button></figure>
        </div>
      </div>
      <ol class="photomax-showcase-journey"><li><span>01 / DISCOVER</span><p>Find your perspective.</p></li><li><span>02 / CONNECT</span><p>Meet the creative behind it.</p></li><li><span>03 / CREATE</span><p>Make the next opportunity.</p></li></ol>
    </aside>'''


def mellana_showcase(img):
    return f'''<aside class="photomax-showcase mellana-showcase" id="mellana-showcase" aria-labelledby="mellana-showcase-title">
      <div class="photomax-showcase-top"><span class="mellana-signature">MELLANA <span>CAFE</span></span><span>A LITTLE EVERYDAY RITUAL</span></div>
      <div class="photomax-showcase-main">
        <div class="photomax-showcase-copy"><p class="photomax-eyebrow">FROM THE FIRST LOOK TO THE LAST SIP</p><h3 id="mellana-showcase-title">Good taste.<br>Thoughtfully<br><em>served.</em></h3><p>A warm welcome. A considered menu.<br>A coffee made your way.</p></div>
        <div class="photomax-showcase-art"><span class="mellana-window" aria-hidden="true"></span>
          <figure class="photomax-screen photomax-screen-discover"><button class="zoom-image" data-full="/assets/work-042.webp" data-caption="A welcoming mobile home screen." aria-label="Enlarge Mellana Cafe welcome screen">{img('work-042','Mellana Cafe mobile home screen with coffee photography and warm typography')}<span class="zoom-hint" aria-hidden="true">↗</span></button></figure>
          <figure class="photomax-screen photomax-screen-connect"><button class="zoom-image" data-full="/assets/work-047.webp" data-caption="Customize a selected drink." aria-label="Enlarge Mellana Cafe customization screen">{img('work-047','Mellana Cafe mobile ordering screen with drink size, flavors, add-ins, and quantity')}<span class="zoom-hint" aria-hidden="true">↗</span></button></figure>
        </div>
      </div>
      <ol class="photomax-showcase-journey"><li><span>01 / BROWSE</span><p>Find your next favorite.</p></li><li><span>02 / PERSONALIZE</span><p>Make every detail yours.</p></li><li><span>03 / ORDER</span><p>Bring it together in the cart.</p></li></ol>
    </aside>'''
