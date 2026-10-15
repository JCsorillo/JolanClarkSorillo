---
name: Review page
description: Review a static page for responsive layout, accessibility, and broken links.
---

Review the requested HTML page and its relevant shared CSS/JavaScript. Check:

- Whether the fixed navbar overlaps the first page content at 320px, 768px, and 1280px, and whether any horizontal scrolling occurs. Confirm the portfolio photo stays bounded at a 4:5 ratio beside its intro on desktop and stacks at narrower widths.
- Whether the theme-aware glass cards remain readable over the brightest aurora areas in light and dark themes, and whether the fixed background is behind content and does not intercept input.
- Whether only the intended aurora blobs animate, animation pauses when the tab is hidden, mobile uses fewer/smaller blurred blobs, and reduced motion uses a static gradient.
- Whether headings, labels, or other text are clipped at those widths.
- Text/background contrast, semantic landmarks and heading order, keyboard focus, link labels, and missing or unsuitable image alt text.
- Local page links and fragment targets for missing destinations.
- Whether glass fallback styling works without `backdrop-filter`, reduced-motion preferences disable nonessential animations, and print output stays light and flat where relevant.

Report findings with file references and concise evidence. Do not edit files unless I explicitly ask you to fix findings.
