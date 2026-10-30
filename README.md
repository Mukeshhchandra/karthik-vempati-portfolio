# Karthik Vempati Portfolio — Version 1

**Version 1.0.0 · October 29, 2026**

This repository preserves Karthik Vempati’s portfolio as Version 1, including every page, optimized image, animation, and downloadable résumé needed to run the site.

## View the portfolio

**[Open Karthik’s portfolio](https://mukeshhchandra.github.io/karthik-vempati-portfolio/)** — opens directly in a phone or desktop browser; no download is needed.

The website is publicly available on GitHub Pages. No GitHub account or software installation is required to view it.

The source files below are for browsing or editing the project. GitHub’s file viewer does not run the website. Original artwork and the complete working archive are in the Version 1 release described below.

The portfolio presents UI/UX design with graphic-design strengths through six case studies: Levi’s, Plant Stall, Photomax, CreativePro Week, Mellana Cafe, and PREBOOK. It includes About and résumé pages, original project media, a downloadable résumé, responsive layouts, image galleries, and optional motion effects.

## Run locally

From the repository root, with Python 3 installed:

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory site/dist
```

Open [the local portfolio](http://127.0.0.1:4173/). Keep the terminal running while reviewing. The server is bound to this computer only. The generated site is already included in `site/dist/`, so rebuilding is not required just to view it.

## Rebuild and check

After changing page structure or project content:

```sh
python site/build.py
python site/check_site.py
```

The site is static HTML, CSS, and JavaScript. There is no package installation or external runtime service required to view it. `site/build.py` builds the HTML from the local Python modules and project data. Styles and browser scripts live directly in `site/dist/`.

Asset regeneration is optional. `site/prepare_assets.py` uses Python Pillow and `ffmpeg` to reproduce optimized artwork from the included source assets; the prepared assets are already in `site/dist/assets/`.

## Website publishing

GitHub Pages is configured through `.github/workflows/deploy-pages.yml`. In repository **Settings → Pages**, select **GitHub Actions** as the source. The workflow validates the local build, prepares a copy for the `/karthik-vempati-portfolio/` URL, and publishes the portfolio. It runs on pushes to `main` and can also be started manually from Actions.

The publication copy includes the portfolio and its assets. Internal review helpers and the full working archive are not served as website pages; the archive is available separately in Releases. The local preview command above continues to work unchanged.

## Full project archive

The runnable portfolio source and optimized assets are tracked in this repository. Original artwork, research, earlier iterations, and all supporting files are preserved in the **1,010-file full archive** attached to [Version 1.0.0](https://github.com/Mukeshhchandra/karthik-vempati-portfolio/releases/tag/v1.0.0). The archive captures the original Version 1 working snapshot, prepared before the repository visibility changed to public; these repository notes reflect the public release.

## Contents (repository and full archive)

| Location | Contents |
| --- | --- |
| `site/` | Page generators, project data, asset provenance, checks, and local preview instructions. |
| `site/dist/` | Complete generated portfolio, styles, scripts, optimized media, and downloadable résumé. |
| `portfolio-assets/` | Original project artwork and media collected for this portfolio. |
| `inputs/` | User-supplied portraits, the original résumé, and other source inputs. |
| `deliverables/` | Revised résumé documents, including the ATS-oriented version. |
| `audit/` | Original-site research, source references, image/video analysis, screenshots, and project memory. |
| `site/revisions/` | Earlier local portfolio iterations retained for reference. |
| `site/review/` | Visual review evidence, structural check reports, and document verification records. |

`site/dist/_qa-responsive.html` is a local testing helper, not part of the intended public portfolio. Some research and utility scripts retain paths specific to the original Windows workspace; the manual preview command above is portable.

## Version 1 notes

- Dark forest, charcoal, wine, and lime portfolio styling, with Karthik’s supplied photography.
- Portrait motion, scroll-linked About presentation, and a WebGL project gallery with a motion toggle and reduced-motion support.
- Black case-study gallery surrounds and enlarged-image viewers.
- Custom Photomax and Mellana Cafe showcase compositions using original project screens.
- Corrected LinkedIn destination: [Karthik Vempati](https://www.linkedin.com/in/karthikvempati-design).
- No visitor-facing AI feature, analytics, or backend service.

The résumé is structured for ATS readability. No measured ATS percentage is claimed. Its latest LinkedIn update was verified structurally; a fresh document render was unavailable in the bundled runtime. See `site/QA.md` and `site/review/` for verification details and limits.

## Artwork and source references

This backup includes original project artwork, personal inputs, and source references so the work can be continued faithfully. Inclusion in this repository is not a blanket license grant. Third-party brands, imagery, sample interface content, and credited assets retain their respective rights; consult the source and provenance records before reuse or redistribution.

Local runtime caches, environment files, credentials, and obsolete Sites registration state are excluded by `.gitignore`.
