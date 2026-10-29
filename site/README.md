# Karthik Vempati — Portfolio Version 1

Version 1.0.0 is the first portfolio snapshot, released as public source on GitHub at the owner's request. The website remains a local review build; GitHub Pages and other website hosting are not enabled.

## Open

Run `Start-Preview.ps1` from this directory and open http://127.0.0.1:4173/. Keep that terminal running while reviewing. The server binds only to this computer.

## Edit

- `build.py`: page structure and shared content; run with Python after changing.
- `cinematic.py`: the Echo-inspired portrait opening, About scene, career gallery, toolkit, and contact section.
- `dist/cinematic.css`: the charcoal, wine, and lime visual direction, responsive layouts, and shared-image transitions.
- `projects.json`: the six case studies, their decisions, captions, and media selections.
- `dist/inner-pages.css`: redesigned case studies, About, and Resume.
- `dist/project-galleries.css`: true-black project gallery and lightbox backgrounds.
- `project_extras.py` and `dist/review-additions.css`: Photomax and Mellana Cafe closing showcases, plus the supplied footer portrait.
- `dist/site.css`: shared base layouts and components.
- `dist/site.js`: navigation, filters, lightbox, copy email, section tracking.
- `dist/motion.js`: curved WebGL artwork meshes, scroll-driven ribbon/orbit/stack choreography, pointer depth, and motion preferences.
- `dist/echo.js`: portrait tilt, scroll-linked About panel, and career gallery controls.
- `asset-provenance.json`: source mapping for optimized artwork.
- `../audit/PROJECT-MEMORY.md`: research, editorial decisions, sources, and current instructions.

The portfolio is buildless HTML/CSS/JavaScript. All media is local. No analytics, remote libraries, contact-form backend, or third-party model requests are used. Contact links open email or LinkedIn. The animation references remain outside the website as inspiration.

Run `check_site.py` for structural and asset checks. With the server running, `check_http.py` checks routes and the résumé download. `_qa-responsive.html` is an internal local testing helper, not a portfolio page; remove it from any future publication package.

The original résumé and images are preserved. Downloadable résumé: `dist/assets/Karthik_Vempati_Resume.docx`. No measured ATS score is claimed.

Local `.openai/` hosting state is excluded from the GitHub snapshot. Website deployment still requires a separate user request.

The previous draft’s generator, styles, and scripts are preserved under `revisions/2026-10-26/`. Current review screenshots and QA results are under `review/echo-redesign/`.

The earlier cinematic version is preserved under `revisions/2026-10-27-before-echo/`. The user explicitly chose to skip a visitor-facing AI feature.
