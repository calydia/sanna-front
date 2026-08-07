import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normalizeArticle } from '../../src/blog/api/blogApi.ts';

const common = {
  title: 'Article',
  category: 'Accessibility',
  slug: '/article',
  date: '2026-01-01',
  metaDescription: 'Description',
  featuredCategoryPost: true,
  secondaryCategories: ['Testing'],
};

describe('Drupal article normalization', () => {
  it('normalizes listing data and retains optional discovery fields', () => {
    assert.deepEqual(normalizeArticle({ ...common, listingImage: '/image.jpg' }, 'listing'), {
      ...common,
      listingImage: '/image.jpg',
    });
  });

  it('normalizes RSS data without requiring image fields', () => {
    const article = normalizeArticle({ ...common, content: '<p>Content</p>' }, 'rss');
    assert.equal(article.content, '<p>Content</p>');
  });

  it('rejects malformed required fields with their response location', () => {
    assert.throws(
      () => normalizeArticle({ ...common, title: null, listingImage: '/image.jpg' }, 'listing', 3),
      /articles\.items\[3\]\.title must be a string/,
    );
    assert.throws(() => normalizeArticle(null, 'listing'), /must be an object/);
  });
});
