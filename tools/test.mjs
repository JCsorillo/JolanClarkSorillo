#!/usr/bin/env node

import { test, describe } from 'node:test';
import assert from 'node:assert';

// Import functions from products.mjs
// Since products.mjs is an ESM module, we need to import it
const productsModule = await import('./products.mjs');

const {
  detectPlatform,
  isValidUrl,
  slugify,
  generateUniqueId,
  generateUniqueFilename,
  cleanPath,
  parseColSpan
} = productsModule;

describe('slugify', () => {
  test('converts spaces to hyphens', () => {
    assert.strictEqual(slugify('Hello World'), 'hello-world');
  });

  test('removes special characters', () => {
    assert.strictEqual(slugify('Product @#$% Name!'), 'product-name');
  });

  test('handles multiple spaces', () => {
    assert.strictEqual(slugify('Hello   World'), 'hello-world');
  });

  test('trims whitespace', () => {
    assert.strictEqual(slugify('  Hello World  '), 'hello-world');
  });

  test('converts to lowercase', () => {
    assert.strictEqual(slugify('HELLO WORLD'), 'hello-world');
  });

  test('handles consecutive hyphens', () => {
    assert.strictEqual(slugify('Hello--World'), 'hello-world');
  });
});

describe('generateUniqueId', () => {
  test('generates unique ID from title', () => {
    const existingIds = new Set();
    const id = generateUniqueId('Test Product', existingIds);
    assert.strictEqual(id, 'test-product');
  });

  test('adds suffix if ID exists', () => {
    const existingIds = new Set(['test-product']);
    const id = generateUniqueId('Test Product', existingIds);
    assert.strictEqual(id, 'test-product-1');
  });

  test('increments suffix until unique', () => {
    const existingIds = new Set(['test-product', 'test-product-1', 'test-product-2']);
    const id = generateUniqueId('Test Product', existingIds);
    assert.strictEqual(id, 'test-product-3');
  });
});

describe('generateUniqueFilename', () => {
  test('generates unique filename from title', () => {
    const existingFilenames = new Set();
    const filename = generateUniqueFilename('Test Product', existingFilenames);
    assert.strictEqual(filename, 'test-product.webp');
  });

  test('adds suffix if filename exists', () => {
    const existingFilenames = new Set(['test-product.webp']);
    const filename = generateUniqueFilename('Test Product', existingFilenames);
    assert.strictEqual(filename, 'test-product-1.webp');
  });
});

describe('detectPlatform', () => {
  test('detects Shopee', () => {
    assert.strictEqual(detectPlatform('https://shopee.ph/product'), 'Shopee');
    assert.strictEqual(detectPlatform('https://shopee.com.my/item'), 'Shopee');
  });

  test('detects Lazada', () => {
    assert.strictEqual(detectPlatform('https://lazada.com.ph/product'), 'Lazada');
    assert.strictEqual(detectPlatform('https://lazada.sg/item'), 'Lazada');
  });

  test('detects TikTok Shop', () => {
    assert.strictEqual(detectPlatform('https://tiktok.com/product'), 'TikTok Shop');
    assert.strictEqual(detectPlatform('https://vt.tiktok.com/xyz'), 'TikTok Shop');
  });

  test('detects Amazon', () => {
    assert.strictEqual(detectPlatform('https://amazon.com/product'), 'Amazon');
    assert.strictEqual(detectPlatform('https://amazon.co.uk/item'), 'Amazon');
  });

  test('returns Other for unknown platforms', () => {
    assert.strictEqual(detectPlatform('https://example.com/product'), 'Other');
  });

  test('handles invalid URLs gracefully', () => {
    assert.strictEqual(detectPlatform('not-a-url'), null);
  });
});

describe('isValidUrl', () => {
  test('accepts http URLs', () => {
    assert.strictEqual(isValidUrl('http://example.com'), true);
  });

  test('accepts https URLs', () => {
    assert.strictEqual(isValidUrl('https://example.com'), true);
  });

  test('rejects ftp URLs', () => {
    assert.strictEqual(isValidUrl('ftp://example.com'), false);
  });

  test('rejects non-URLs', () => {
    assert.strictEqual(isValidUrl('not-a-url'), false);
  });

  test('rejects mailto URLs', () => {
    assert.strictEqual(isValidUrl('mailto:test@example.com'), false);
  });
});

describe('cleanPath', () => {
  test('strips surrounding quotes', () => {
    assert.strictEqual(cleanPath('"C:\\Path\\To\\File.jpg"'), 'C:\\Path\\To\\File.jpg');
    assert.strictEqual(cleanPath("'C:\\Path\\To\\File.jpg'"), 'C:\\Path\\To\\File.jpg');
  });

  test('handles spaces in paths', () => {
    assert.strictEqual(cleanPath('C:\\My Documents\\File.jpg'), 'C:\\My Documents\\File.jpg');
  });

  test('trims whitespace', () => {
    assert.strictEqual(cleanPath('  C:\\Path\\File.jpg  '), 'C:\\Path\\File.jpg');
  });

  test('handles mixed quotes and spaces', () => {
    assert.strictEqual(cleanPath('"C:\\My Documents\\File.jpg"'), 'C:\\My Documents\\File.jpg');
  });
});

describe('parseColSpan', () => {
  test('defaults to 6 for undefined', () => {
    assert.strictEqual(parseColSpan(undefined), 6);
  });

  test('parses number strings', () => {
    assert.strictEqual(parseColSpan('4'), 4);
    assert.strictEqual(parseColSpan('6'), 6);
    assert.strictEqual(parseColSpan('8'), 8);
    assert.strictEqual(parseColSpan('12'), 12);
  });

  test('parses numbers', () => {
    assert.strictEqual(parseColSpan(4), 4);
    assert.strictEqual(parseColSpan(6), 6);
  });

  test('handles span- prefix', () => {
    assert.strictEqual(parseColSpan('span-4'), 4);
    assert.strictEqual(parseColSpan('span-6'), 6);
  });

  test('handles col-span- prefix', () => {
    assert.strictEqual(parseColSpan('col-span-4'), 4);
    assert.strictEqual(parseColSpan('col-span-6'), 6);
  });

  test('defaults to 6 for invalid values', () => {
    assert.strictEqual(parseColSpan('invalid'), 6);
    assert.strictEqual(parseColSpan('5'), 6);
    assert.strictEqual(parseColSpan('13'), 6);
  });
});

console.log('Running tests...\n');
