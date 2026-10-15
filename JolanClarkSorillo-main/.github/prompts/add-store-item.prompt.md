---
name: Add store item
description: Add one editable affiliate recommendation to js/stores.js.
---

Add exactly one recommendation object to `js/stores.js` using the details I provide:

- Name: ${input:name}
- Platform (Shopee, Lazada, TikTok Shop, Amazon, or Other): ${input:platform}
- Category (PC parts, Networking, Phone accessories, Tools, Home, or Other): ${input:category}
- One-line reason: ${input:reason}
- Affiliate URL: ${input:url}

Create a unique kebab-case `id` and set `addedAt` to today's date in `YYYY-MM-DD` format for newest sorting. Keep the provided affiliate URL as a plain string without expanding or rewriting it. Set `image` to an owned/local image path only when I provide one; otherwise use an empty string. Set `featured` to `false` unless I explicitly ask for a featured pick. Do not invent item details, prices, ratings, reviews, or claims. Preserve the existing object shape and formatting. The renderer supplies the current-price label, disclosure, and required sponsored-link attributes.
