# Local review — Echo redesign

This revision is local and unpublished. User requested the Echo Builds reference, prominent actual Karthik photo, a complete redesign, richer 3D and smooth movement; subsequently requested darker, more vibrant colors and explicitly declined the AI feature.

## Verified in this revision

- Structural checks: 10 HTML documents, 283 valid local references, one H1 per document, unique IDs and image alternative text; no errors.
- Sixteen HTTP checks passed for nine portfolio routes, three stylesheets, three scripts, and the downloadable resume. DOCX hash matches the prepared file.
- All nine pages checked at 320 and 768 CSS-pixel widths without horizontal overflow or broken loaded images. CreativePro's title was reduced after a phone overflow was observed, then rechecked. Metrics: review/echo-redesign/responsive-checks.json.
- Home checked at desktop width, intermediate 640-pixel width, and a 1280 by 600 iframe. The intermediate header uses the compact menu; short windows use an unpinned scene.
- The original Karthik photograph appears prominently in the opening; CSS crops the existing file without generating or replacing his face.
- About panel expansion and separated background lettering visually inspected while scrolling.
- The curved WebGL ribbon, six-image orbit, and stacked gallery were visually inspected. Next visits Plant Stall, Photomax, CreativePro Week, Mellana Cafe, PREBOOK, then Levi's.
- Motion off changes the preference and unpins the gallery; Motion on restores it. Reduced-motion and compact-screen fallbacks are implemented.
- Career carousel advances; mobile menu opens and closes with Escape, returning focus to the menu button.
- Photomax image viewer opens, Next updates the image/caption, Escape closes it, and focus returns to the image button.
- No captured console warnings or errors in the final desktop gallery check.

## Scope and limitations

The prior verified original videos and resume files are unchanged. Actual touchscreen hardware, OS-level reduced-motion emulation, and every browser/GPU combination were not tested. No universal FPS claim is made. Motion uses a native scroll experience, visibility-aware animation, modest WebGL pixel density, and static fallbacks. No AI assistant or model provider was added. The reference videos are inspiration only and are not embedded as portfolio work.

Review screenshots are under review/echo-redesign/. No publication, source synchronization, or external upload occurred.


## Review changes - 2026-10-28
All six case studies checked at 320/768 px: true-black Design section and no horizontal page overflow. Photomax new composition and shared footer portrait visually checked at desktop and narrow mobile sizes. Lightbox opened and closed with Escape, true-black background confirmed. Original Photomax walkthrough retained; atmosphere banner removed. Footer image loads with original 866 px width, links retained. No captured console errors/warnings in inspected desktop tab. Evidence: review/echo-redesign/review-changes-checks.json and the photomax-black-gallery, photomax-new-showcase, footer-new-portrait screenshots.


## Mellana showcase / LinkedIn - 2026-10-29
New showcase visually inspected at 1280, 320, and 768 px. No horizontal overflow. Correct image/black lightbox verified with open/Escape. Updated LinkedIn targets verified in generated pages. Static check: 10 pages, 315 references, no errors. DOCX hyperlink package checks and render limitation logged under review/linkedin-update/.
