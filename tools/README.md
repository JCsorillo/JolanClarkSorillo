# Product Management Tools

Local tools for managing `products.json` and previewing the site without a backend or CMS.

## Setup (one-time)

```bash
cd tools
npm install
```

This installs `sharp` for image optimization. The `tools/node_modules` folder is git-ignored.

## Adding a Product

### Interactive Mode

```bash
node tools/products.mjs add
```

Follow the prompts to enter:
- Affiliate link URL
- Product title
- Description (1-2 sentences, warned if over 160 characters)
- Path to product image (drag file into terminal)
- Badge (auto-detected from platform)
- Card width (4, 6, 8, or 12 columns, default 6)
- Whether it's the featured card

The tool will:
- Detect the platform (Shopee, Lazada, TikTok Shop, Amazon, Other) from the URL
- Resize and convert the image to WebP (max 1200px wide, quality 80)
- Generate a unique ID and filename from the title
- Add the entry to `products.json` (at the end, or use `--top` to insert at start)
- Optionally create a git commit with `--commit`

### Non-Interactive Mode (Flags)

```bash
node tools/products.mjs add \
  --link "https://vt.tiktok.com/..." \
  --title "Product Name" \
  --desc "Short description" \
  --image "path/to/image.jpg" \
  --badge "TikTok Shop Pick" \
  --span 6 \
  --primary \
  --top \
  --commit
```

Available flags:
- `--link <url>` - Affiliate link URL (required if not prompting)
- `--title <text>` - Product title (required if not prompting)
- `--desc <text>` - Description
- `--image <path>` - Path to image file
- `--badge <text>` - Badge text (auto-detected from platform if omitted)
- `--span <number>` - Column span: 4, 6, 8, or 12 (default 6)
- `--linkText <text>` - Button text (auto-generated from platform if omitted)
- `--primary` - Mark as featured card
- `--top` - Insert at start of array instead of end
- `--dry-run` - Print the entry without writing to products.json
- `--commit` - Stage and commit products.json and the new image

### Image Handling

- Images are resized to max 1200px wide, converted to WebP at quality 80
- Maximum input size: 25 MB
- Output saved to `img/products/` with a slugified filename
- If `sharp` is not installed, the image is copied as-is with a warning
- Supported formats: JPEG, PNG, GIF, WebP

### Listing Products

```bash
node tools/products.mjs list
```

Shows ID, platform, title, and column span for each product.

### Removing a Product

```bash
node tools/products.mjs remove <id>
```

Removes the entry after confirmation and notes the image file path (does not delete the image automatically).

## Local Preview

Since `products.json` is loaded via fetch, you need a local server to preview changes:

```bash
node tools/serve.mjs
```

Then open http://localhost:8000 in your browser.

Press Ctrl+C to stop the server.

## Publishing Changes

After adding a product:

1. Preview locally: `node tools/serve.mjs`
2. If satisfied: `git push`

The `--commit` flag can automate step 1 of the git workflow, but never pushes automatically.

## Important Notes

- **Image licensing**: Only use images that the platform's affiliate terms allow
- **No pricing**: Do not include prices, commission rates, or stock counts in the data
- **Bebet Mobile Kiosk**: The existing Bebet entry is a demo and should not be modified
- **Git safety**: products.json is written to a temp file first, then renamed to prevent corruption
