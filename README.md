## Larck Shop

A lightweight shop and recommendations hub hosted on GitHub Pages. It uses plain HTML, CSS, and vanilla JavaScript with no framework or build step.

### Workflow

1. Create or switch to the `redesign` branch: `git switch -c redesign` (or `git switch redesign` if it already exists).
2. Make and check changes, then commit them on `redesign`.
3. Push the branch: `git push -u origin redesign`.
4. Preview the branch locally or through the repository's configured preview workflow.
5. When the preview is approved, merge `redesign` into `main`. GitHub Pages deploys the content from `main`.

### Main pages

- `index.html` is Home and the shop/recommendations page.
- `shop.html` is the full catalog for apps, recommendations, and collections.
- `portfolio.html` contains personal background, experience, projects, and education.
- `resume.html` is the printable resume.
- `contact.html` contains contact links and the mailto form.

Update app details in `js/products.js` and recommendations and collections in `js/stores.js`. Preserve the light/dark theme, affiliate disclosure and link rules, and reduced-motion behavior when editing the site.

Icons are bundled locally in `img/icons.svg` and referenced from the site shell and page content. Motion is limited to the aurora drift, one-time tile reveals, hover/press feedback, and the theme icon swap; reduced-motion preferences keep content visible and still.