# Project instructions

## Project shape

- This is a static site hosted on GitHub Pages. Use plain HTML, modern CSS, and small vanilla JavaScript ES modules. Do not add a framework, package manager, server, or build step.
- The visual direction is refined glassmorphism, bento layouts, and a slow, desaturated aurora. Use theme-aware glass surfaces, a restrained accent, soft shadows, 12px card radii, 8px control radii, and the existing Inter typography. Do not add neon colors, gradient text, gradient buttons, or glow effects.
- `index.html` is the store-first Home page. `shop.html` is the full catalog. `portfolio.html` contains personal background, experience, projects, and education. `resume.html` is the printable resume. `contact.html` contains contact links and the mailto form.
- `css/tokens.css` owns theme palettes, aurora colors, surface opacity, typography, spacing, radii, page width, navbar height, blur, transitions, and shadows. `css/style.css` owns shared components, aurora/blob behavior, bento layouts, responsive behavior, reduced-motion rules, glass fallbacks, and print rules.
- Each page bootstraps `data-theme` in the head before first paint. `js/main.js` renders shared navigation and footer, active-page state, theme toggle, app/store/collection cards, filters, purchase dialog, command palette, pointer spotlight, visibility-based aurora pausing, and the mailto form.
- Keep the fixed-navbar offset global: `--nav-h` and `.page-main` padding-top `calc(var(--nav-h) + clamp(1rem, 3vw, 2rem))`. Keep `scroll-padding-top: calc(var(--nav-h) + 1rem)` on `html`; do not add a competing page-specific top offset.
- The Portfolio intro uses a responsive 12-column layout: a bounded 4:5 photo tile beside the introduction at desktop widths, stacking cleanly on tablet and mobile. Do not force a fixed-height/narrow profile column or allow the photo to stretch to the text column height.
- `about.html`, `nisu.html`, `cics.html`, and `trusted-stores.html` remain small redirect pages. `shop.html` is a live catalog page.

## Recommendations and products

- `js/stores.js` exports `stores` and `collections`. Store entries use `id`, `name`, `platform`, `category`, `reason`, `url`, `image`, `featured`, and `addedAt`. Collections reference store IDs through `itemIds`.
- Supported platforms are Shopee, Lazada, TikTok Shop, Amazon, and Other. Categories are PC parts, Networking, Phone accessories, Tools, Home, and Other.
- Keep affiliate URLs as supplied plain strings, including short marketplace links. Every affiliate link must use `target="_blank"` and `rel="sponsored noopener noreferrer"`.
- Keep a clear affiliate disclosure on Home, Shop, and in the shared footer. Recommendation cards display “Check current price”; never add hardcoded affiliate prices, platform logos, fake reviews, ratings, or unsupported product details.
- Never hotlink product images from affiliate platforms. Use an owned/local image path or leave `image` empty for the neutral placeholder.
- `js/products.js` is the source of truth for app cards. Keep app price, demo limits, payment details, support period, license terms, and screenshots as supplied facts or clearly editable placeholders. Purchases are contact-first and the app flow should remain easy to replace with hosted checkout later.
- Do not include credentials, secrets, or private contact details in Copilot instructions or prompt files.

## Accessibility and implementation

- Keep semantic headings and landmarks, visible focus rings, descriptive link labels, meaningful image alt text, and readable contrast in both themes and over aurora backgrounds. Theme controls are real buttons with an accessible label and `aria-pressed`; persist choices in `localStorage` inside `try/catch`.
- Keep the four primary navigation tabs (Home, Shop, Portfolio, Resume), the separate Contact button, and the theme toggle aligned between the shared header and each page's no-JavaScript navigation fallback.
- Limit backdrop blur to cards, the navbar, modal/palette, and footer panel. Keep a solid, sufficiently opaque fallback for browsers without `backdrop-filter`. Use transform-only slow blob animation; reduce the number/blur on mobile, pause when the document is hidden, and replace motion with a static gradient under `prefers-reduced-motion`.
- Preserve the Resume Print / Save PDF control. Print styles must use a light palette and hide the navbar, decorative backgrounds, and footer.
- Use clear, small vanilla JS functions, double-quoted strings, two-space indentation, and existing CSS custom properties. Escape data-derived HTML and avoid unrelated changes.
- Check pages at 320px, 768px, and 1280px for navbar overlap, horizontal overflow, alignment, focus visibility, contrast in both themes, and broken links.
