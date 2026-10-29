/* Local, progressive motion for the portrait and personal chapters. */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width:760px), (max-height:650px)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const enabled = () => !reduced.matches && document.documentElement.dataset.motion !== 'off';
  const cinematic = () => enabled() && !compact.matches;
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const hero = document.querySelector('.echo-hero');
  const portrait = hero?.querySelector('.hero-portrait-wrap');
  const about = document.querySelector('.about-scene');
  const observed = [hero, about].filter(Boolean);
  const visible = new Map(observed.map(element => [element, false]));
  let frame = 0;
  let lastTime = 0;
  let heroProgress = 0;
  let heroTarget = 0;
  let aboutProgress = cinematic() ? 0 : 1;
  let aboutTarget = aboutProgress;
  let pointerX = 0;
  let pointerY = 0;
  let pointerTargetX = 0;
  let pointerTargetY = 0;

  const set = (element, property, value) => element?.style.setProperty(property, value);
  const isVisible = element => element && visible.get(element);

  function measure() {
    if (hero) {
      const bounds = hero.getBoundingClientRect();
      heroTarget = cinematic() ? clamp(-bounds.top / Math.max(bounds.height, 1)) : 0;
    }
    if (about) {
      const bounds = about.getBoundingClientRect();
      const sticky = about.querySelector('.about-sticky');
      const top = sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 76;
      const distance = Math.max(1, bounds.height - innerHeight + top);
      aboutTarget = cinematic() ? clamp((top - bounds.top) / distance) : 1;
    }
  }

  function paint() {
    set(hero, '--hero-progress', heroProgress.toFixed(4));
    set(about, '--about-progress', aboutProgress.toFixed(4));
    set(portrait, '--portrait-rx', `${(-pointerY * 5).toFixed(3)}deg`);
    set(portrait, '--portrait-ry', `${(pointerX * 7).toFixed(3)}deg`);
  }

  function tick(now) {
    frame = 0;
    if (document.hidden || !observed.some(isVisible)) {
      lastTime = 0;
      return;
    }
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = now;
    const ease = 1 - Math.exp(-dt * 11);
    heroProgress += (heroTarget - heroProgress) * ease;
    aboutProgress += (aboutTarget - aboutProgress) * ease;
    pointerX += (pointerTargetX - pointerX) * ease;
    pointerY += (pointerTargetY - pointerY) * ease;
    paint();

    const settling = Math.abs(heroProgress - heroTarget) > 0.0002 ||
      Math.abs(aboutProgress - aboutTarget) > 0.0002 ||
      Math.abs(pointerX - pointerTargetX) > 0.0002 ||
      Math.abs(pointerY - pointerTargetY) > 0.0002;
    if (settling) frame = requestAnimationFrame(tick);
    else lastTime = 0;
  }

  function wake() {
    if (!frame && !document.hidden && observed.some(isVisible)) frame = requestAnimationFrame(tick);
  }

  function refresh() {
    measure();
    wake();
  }

  function resetForPreference() {
    pointerTargetX = pointerTargetY = 0;
    measure();
    if (!cinematic()) {
      heroProgress = heroTarget;
      aboutProgress = aboutTarget;
      pointerX = pointerY = 0;
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      paint();
    }
    wake();
  }

  if (observed.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => visible.set(entry.target, entry.isIntersecting));
        if (!observed.some(isVisible)) {
          cancelAnimationFrame(frame);
          frame = 0;
          lastTime = 0;
        }
        refresh();
      });
      observed.forEach(element => observer.observe(element));
    } else {
      observed.forEach(element => visible.set(element, true));
    }
    addEventListener('scroll', refresh, { passive: true });
    addEventListener('resize', refresh, { passive: true });
    document.addEventListener('motionchange', resetForPreference);
    reduced.addEventListener('change', resetForPreference);
    compact.addEventListener('change', resetForPreference);
    fine.addEventListener('change', resetForPreference);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      } else refresh();
    });
    addEventListener('pagehide', () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    });
    addEventListener('pageshow', refresh);
    hero?.addEventListener('pointermove', event => {
      if (!cinematic() || !fine.matches) return;
      const bounds = hero.getBoundingClientRect();
      pointerTargetX = clamp((event.clientX - bounds.left) / Math.max(bounds.width, 1) * 2 - 1, -1, 1);
      pointerTargetY = clamp((event.clientY - bounds.top) / Math.max(bounds.height, 1) * 2 - 1, -1, 1);
      wake();
    }, { passive: true });
    hero?.addEventListener('pointerleave', () => {
      pointerTargetX = pointerTargetY = 0;
      wake();
    }, { passive: true });
    measure();
    heroProgress = heroTarget;
    aboutProgress = aboutTarget;
    paint();
    wake();
  }

  document.querySelectorAll('.career-section').forEach(section => {
    const track = section.querySelector('.career-track');
    const previous = section.querySelector('.career-prev');
    const next = section.querySelector('.career-next');
    if (!track || !previous || !next) return;
    if (!track.hasAttribute('tabindex')) track.tabIndex = 0;
    if (!track.hasAttribute('aria-label')) track.setAttribute('aria-label', 'Career experience. Use the left and right arrow keys to browse.');
    if (!previous.hasAttribute('aria-label')) previous.setAttribute('aria-label', 'Previous experience');
    if (!next.hasAttribute('aria-label')) next.setAttribute('aria-label', 'Next experience');

    function updateButtons() {
      const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
      previous.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= maximum - 1;
    }
    function move(direction) {
      const card = track.querySelector('.career-card');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      const amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
      track.scrollBy({ left: direction * amount, behavior: enabled() ? 'smooth' : 'instant' });
    }
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
          event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    track.addEventListener('scroll', updateButtons, { passive: true });
    addEventListener('resize', updateButtons, { passive: true });
    addEventListener('pageshow', updateButtons);
    if ('ResizeObserver' in window) new ResizeObserver(updateButtons).observe(track);
    updateButtons();
  });
})();
