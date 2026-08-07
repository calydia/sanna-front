import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildArticleToc } from '../../src/blog/utils/articleToc.ts';
import { getPageCount, getPageItems } from '../../src/blog/utils/pagination.ts';
import { getReadingTime } from '../../src/blog/utils/readingTime.ts';
import {
  getPopularTags,
  getRelatedPosts,
  normalizeSecondaryCategories,
} from '../../src/blog/utils/tags.ts';

describe('blog pagination', () => {
  it('always produces at least one archive page', () => {
    assert.equal(getPageCount(0), 1);
    assert.equal(getPageCount(12), 1);
    assert.equal(getPageCount(13), 2);
  });

  it('returns the requested page slice', () => {
    const items = Array.from({ length: 25 }, (_, index) => index + 1);
    assert.deepEqual(getPageItems(items, 2), [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
    assert.deepEqual(getPageItems(items, 3), [25]);
  });
});

describe('article table of contents and reading time', () => {
  it('adds stable unique IDs to second-level headings', () => {
    const result = buildArticleToc('<h2>Hello world</h2><h2>Hello world</h2><h2 id="kept">Kept</h2>');
    assert.deepEqual(result.items, [
      { id: 'hello-world', label: 'Hello world' },
      { id: 'hello-world-2', label: 'Hello world' },
      { id: 'kept', label: 'Kept' },
    ]);
    assert.match(result.content, /id="hello-world"/);
    assert.match(result.content, /id="hello-world-2"/);
    assert.equal((result.content.match(/id="kept"/g) ?? []).length, 1);
  });

  it('returns a minimum one-minute reading time', () => {
    assert.equal(getReadingTime('<p>A short post.</p>'), '1 min read');
  });
});

describe('tags and related posts', () => {
  it('normalizes, deduplicates, and sorts mixed Drupal tag values', () => {
    assert.deepEqual(
      normalizeSecondaryCategories(['Web & Apps', { name: 'Accessibility' }, { title: 'Web & Apps' }, null]),
      [
        { label: 'Accessibility', slug: 'accessibility' },
        { label: 'Web & Apps', slug: 'web-and-apps' },
      ],
    );
  });

  it('ranks shared tags before same-category and fallback posts', () => {
    const current = { slug: '/current', category: 'Tech', date: '2026-01-01', secondaryCategories: ['Astro'] };
    const shared = { slug: '/shared', category: 'Life', date: '2024-01-01', secondaryCategories: ['Astro'] };
    const sameCategory = { slug: '/same', category: 'Tech', date: '2025-01-01', secondaryCategories: ['Other'] };
    const fallback = { slug: '/fallback', category: 'Cats', date: '2026-01-01', secondaryCategories: ['Cats'] };
    assert.deepEqual(getRelatedPosts(current, [fallback, sameCategory, shared, current]), [shared, sameCategory, fallback]);
  });

  it('returns only tags meeting the popularity threshold', () => {
    const posts = [
      { secondaryCategories: ['Accessibility', 'Astro'] },
      { secondaryCategories: ['Accessibility'] },
      { secondaryCategories: ['Accessibility', 'Testing'] },
    ];
    assert.deepEqual(getPopularTags(posts), [{ label: 'Accessibility', slug: 'accessibility' }]);
  });
});
