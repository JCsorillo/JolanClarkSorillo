#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.dirname(__dirname);

const PRODUCTS_PATH = path.join(repoRoot, 'products.json');
const PRODUCTS_DIR = path.join(repoRoot, 'img', 'products');

// Platform detection from URL hostname (kept for backward compatibility)
function detectPlatform(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('shopee.')) return 'Shopee';
    if (hostname.includes('lazada.')) return 'Lazada';
    if (hostname === 'tiktok.com' || hostname === 'vt.tiktok.com') return 'TikTok Shop';
    if (hostname.includes('amazon.')) return 'Amazon';
    return 'Other';
  } catch {
    return null;
  }
}

// Validate URL is http(s)
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Slugify title for ID and filename
function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate unique ID from title slug
function generateUniqueId(title, existingIds) {
  const baseSlug = slugify(title);
  let id = baseSlug;
  let counter = 1;
  while (existingIds.has(id)) {
    id = `${baseSlug}-${counter}`;
    counter++;
  }
  return id;
}

// Generate unique filename from title slug
function generateUniqueFilename(title, existingFilenames) {
  const baseSlug = slugify(title);
  let filename = `${baseSlug}.webp`;
  let counter = 1;
  while (existingFilenames.has(filename)) {
    filename = `${baseSlug}-${counter}.webp`;
    counter++;
  }
  return filename;
}

// Clean Windows path (strip quotes, handle spaces)
function cleanPath(inputPath) {
  return inputPath.trim().replace(/^["']|["']$/g, '');
}

// Parse colSpan from various formats
function parseColSpan(value) {
  if (value === undefined || value === null) return 6;
  const str = String(value).toLowerCase().replace(/^(span-|col-span-)/, '');
  const num = parseInt(str, 10);
  if ([4, 6, 8, 12].includes(num)) return num;
  return 6;
}

// Read and validate products.json
function readProducts() {
  const content = fs.readFileSync(PRODUCTS_PATH, 'utf-8');
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error('products.json must be an array');
  }
  return data;
}

// Write products.json safely (temp file + rename)
function writeProducts(products) {
  const tempPath = `${PRODUCTS_PATH}.tmp`;
  const content = JSON.stringify(products, null, 2) + '\n';
  fs.writeFileSync(tempPath, content, 'utf-8');
  fs.renameSync(tempPath, PRODUCTS_PATH);
}

// Process image with sharp or copy as-is
async function processImage(inputPath, outputPath, dryRun = false) {
  const stats = fs.statSync(inputPath);
  const sizeMB = stats.size / (1024 * 1024);
  
  if (sizeMB > 25) {
    throw new Error(`Image file too large (${sizeMB.toFixed(1)}MB). Maximum 25MB allowed.`);
  }

  // Validate it's an image by checking file signature
  const buffer = fs.readFileSync(inputPath);
  const isImage = 
    buffer[0] === 0xFF && buffer[1] === 0xD8 || // JPEG
    buffer[0] === 0x89 && buffer[1] === 0x50 || // PNG
    buffer[0] === 0x47 && buffer[1] === 0x49 || // GIF
    buffer[0] === 0x52 && buffer[1] === 0x49;   // WebP (RIFF)

  if (!isImage) {
    throw new Error('File does not appear to be a valid image (JPEG, PNG, GIF, or WebP)');
  }

  if (dryRun) {
    return { processed: false, sharp: null };
  }

  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default;
    await sharp(inputPath)
      .resize(1200, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    return { processed: true, sharp: true };
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' || err.message.includes('Cannot find package')) {
      // Sharp not installed, copy as-is
      fs.copyFileSync(inputPath, outputPath);
      return { processed: true, sharp: false };
    }
    throw err;
  }
}

// Create product entry
function createProductEntry(options) {
  const platform = options.platform || detectPlatform(options.linkUrl);
  const badge = options.badge || (platform ? `${platform} Pick` : '');
  const linkText = options.linkText || (platform ? `View on ${platform}` : 'View');
  
  return {
    id: options.id,
    category: 'Affiliate',
    badge,
    title: options.title,
    description: options.description,
    image: options.imagePath,
    imageAlt: options.title,
    linkText,
    linkUrl: options.linkUrl,
    isPrimary: options.isPrimary,
    colSpan: options.colSpan,
    isDemo: false
  };
}

// Interactive prompt
async function prompt(question, defaultValue = '') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer || defaultValue);
    });
  });
}

// List products
function listProducts() {
  const products = readProducts();
  console.log('\nProducts in products.json:\n');
  products.forEach(p => {
    const platform = detectPlatform(p.linkUrl) || 'Unknown';
    console.log(`  ${p.id.padEnd(25)} ${platform.padEnd(15)} ${p.title.padEnd(40)} span-${p.colSpan}`);
  });
  console.log();
}

// Remove product
async function removeProduct(id, options = {}) {
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    console.error(`Product with id "${id}" not found.`);
    process.exit(1);
  }
  
  const product = products[index];
  console.log(`\nFound product: ${product.title}`);
  console.log(`  ID: ${product.id}`);
  console.log(`  Link: ${product.linkUrl}`);
  if (product.image) {
    console.log(`  Image: ${product.image}`);
  }
  
  if (!options.force) {
    const confirmed = await prompt('Remove this product? (yes/no): ');
    if (confirmed.toLowerCase() !== 'yes') {
      console.log('Cancelled.');
      process.exit(0);
    }
  }
  
  products.splice(index, 1);
  writeProducts(products);
  
  console.log(`\nRemoved product "${id}" from products.json.`);
  if (product.image) {
    console.log(`Note: Image file "${product.image}" was not deleted. Remove it manually if needed.`);
  }
}

// Add product
async function addProduct(flags) {
  const products = readProducts();
  const existingIds = new Set(products.map(p => p.id));
  const existingFilenames = new Set(
    fs.existsSync(PRODUCTS_DIR)
      ? fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.webp'))
      : []
  );

  // Check if we have all required fields (non-interactive mode)
  const isNonInteractive = flags.linkUrl && flags.title && flags.image;

  // Interactive prompts if flags not provided
  const linkUrl = flags.linkUrl || await prompt('Affiliate link URL: ');
  if (!isValidUrl(linkUrl)) {
    console.error('Error: URL must be http(s).');
    process.exit(1);
  }

  const platform = detectPlatform(linkUrl);
  const defaultBadge = platform ? `${platform} Pick` : '';
  const defaultLinkText = platform ? `View on ${platform}` : 'View';

  const title = flags.title || await prompt('Product title: ');
  if (!title) {
    console.error('Error: Title is required.');
    process.exit(1);
  }

  let description = flags.description;
  if (description === undefined) {
    if (isNonInteractive) {
      console.error('Error: --desc is required in non-interactive mode');
      process.exit(1);
    }
    description = await prompt('Description (1-2 sentences): ');
  }
  if (description.length > 160) {
    console.warn('Warning: Description exceeds 160 characters. Consider shortening it.');
  }

  const imagePathInput = flags.image || await prompt('Path to product image (drag file here): ');
  const imageInputPath = cleanPath(imagePathInput);
  
  if (!fs.existsSync(imageInputPath)) {
    console.error(`Error: Image file not found: ${imageInputPath}`);
    process.exit(1);
  }

  let badge = flags.badge;
  if (badge === undefined) {
    if (isNonInteractive) {
      badge = defaultBadge;
    } else {
      badge = await prompt(`Badge (default: "${defaultBadge}"): `, defaultBadge);
    }
  }
  if (!badge) badge = defaultBadge;
  
  const colSpanInput = flags.span !== undefined ? flags.span : (isNonInteractive ? 6 : await prompt('Card width (4, 6, 8, or 12 columns, default 6): ', '6'));
  const colSpan = parseColSpan(colSpanInput);
  
  let isPrimary = flags.primary;
  if (isPrimary === undefined && !isNonInteractive) {
    const isPrimaryInput = await prompt('Featured card? (yes/no, default no): ', 'no');
    isPrimary = isPrimaryInput.toLowerCase() === 'yes';
  }
  if (isPrimary === undefined) isPrimary = false;

  const id = generateUniqueId(title, existingIds);
  const filename = generateUniqueFilename(title, existingFilenames);
  const outputPath = path.join(PRODUCTS_DIR, filename);
  const imagePath = `img/products/${filename}`;

  const entry = createProductEntry({
    id,
    linkUrl,
    title,
    description,
    imagePath,
    badge,
    colSpan,
    isPrimary,
    platform,
    linkText: flags.linkText || defaultLinkText
  });

  if (flags.dryRun) {
    console.log('\n--- Dry run: Entry that would be added ---');
    console.log(JSON.stringify(entry, null, 2));
    console.log('--- End dry run ---\n');
    console.log('Image would be saved to:', outputPath);
    process.exit(0);
  }

  // Process image
  console.log(`\nProcessing image: ${imageInputPath}`);
  const { sharp: sharpUsed } = await processImage(imageInputPath, outputPath);
  if (!sharpUsed) {
    console.warn('Warning: sharp not installed. Image copied as-is.');
    console.warn('To install: cd tools && npm install');
  }

  // Insert at start or end
  if (flags.top) {
    products.unshift(entry);
  } else {
    products.push(entry);
  }

  writeProducts(products);

  console.log(`\n✓ Added product "${title}" to products.json`);
  console.log(`  ID: ${id}`);
  console.log(`  Image: ${imagePath}`);
  console.log(`  Span: colSpan ${colSpan}`);
  console.log(`  Featured: ${isPrimary ? 'yes' : 'no'}`);

  // Git commit if requested
  if (flags.commit) {
    const { execSync } = await import('child_process');
    try {
      execSync(`git add "${PRODUCTS_PATH}" "${outputPath}"`, { cwd: repoRoot, stdio: 'inherit' });
      const message = `Add affiliate product: ${title}`;
      execSync(`git commit -m "${message}"`, { cwd: repoRoot, stdio: 'inherit' });
      console.log(`\n✓ Git commit created: "${message}"`);
    } catch (err) {
      console.warn('\nWarning: Git commit failed. You may need to commit manually.');
    }
  }

  console.log('\nNext steps:');
  console.log('  1. Preview locally: node tools/serve.mjs');
  console.log('  2. If satisfied: git push');
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const flags = {};
  const valueFlags = {
    '--link': 'linkUrl',
    '--title': 'title',
    '--desc': 'description',
    '--image': 'image',
    '--badge': 'badge',
    '--span': 'span',
    '--linkText': 'linkText'
  };
  const booleanFlags = {
    '--primary': 'primary',
    '--top': 'top',
    '--dry-run': 'dryRun',
    '--commit': 'commit',
    '--force': 'force'
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      if (booleanFlags[arg]) {
        flags[booleanFlags[arg]] = true;
      } else if (valueFlags[arg]) {
        const nextArg = args[i + 1];
        if (nextArg && !nextArg.startsWith('--')) {
          flags[valueFlags[arg]] = nextArg;
          i++;
        }
      }
    } else if (command === 'remove' && i === 1) {
      // ID argument for remove command
      flags.id = arg;
    }
  }

  if (command === 'list') {
    listProducts();
  } else if (command === 'remove') {
    const id = flags.id || args[1];
    if (!id) {
      console.error('Usage: node tools/products.mjs remove <id>');
      process.exit(1);
    }
    await removeProduct(id, flags);
  } else if (command === 'add') {
    await addProduct(flags);
  } else {
    console.log('Usage: node tools/products.mjs <command>');
    console.log('Commands:');
    console.log('  add     - Add a new product (interactive or with flags)');
    console.log('  list    - List all products');
    console.log('  remove  - Remove a product by ID');
    console.log('\nAdd command flags:');
    console.log('  --link <url>       Affiliate link URL');
    console.log('  --title <text>     Product title');
    console.log('  --desc <text>      Description');
    console.log('  --image <path>     Path to image file');
    console.log('  --badge <text>     Badge text');
    console.log('  --span <number>    Column span (4, 6, 8, 12)');
    console.log('  --linkText <text>  Button text');
    console.log('  --primary          Mark as featured');
    console.log('  --top              Insert at start of array');
    console.log('  --dry-run          Print entry without writing');
    console.log('  --commit           Git commit after adding');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

// Export functions for testing
export {
  detectPlatform,
  isValidUrl,
  slugify,
  generateUniqueId,
  generateUniqueFilename,
  cleanPath,
  parseColSpan
};
