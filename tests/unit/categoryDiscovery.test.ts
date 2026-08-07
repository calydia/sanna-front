import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { getBlogCategoryByKey } from '../../src/blog/categories.ts';
import type { BlogArticleListing } from '../../src/blog/interfaces/article.ts';
import {
  getDrupalFeaturedCategoryPosts,
  resolveFeaturedCategoryPost,
} from '../../src/blog/utils/categoryDiscovery.ts';

const category = getBlogCategoryByKey('accessibility');

function post(overrides: Partial<BlogArticleListing> = {}): BlogArticleListing {
  return {
    title: 'Post',
    category: 'Accessibility',
    slug: '/post',
    date: '2026-01-01',
    listingImage: '/post.jpg',
    metaDescription: 'Description',
    ...overrides,
  };
}

describe('featured category posts', () => {
  it('uses a Drupal-selected post before the configured post', () => {
    const configured = post({ slug: category.featuredSlug });
    const selected = post({ slug: '/selected' });
    assert.equal(resolveFeaturedCategoryPost([configured, selected], category, [selected]), selected);
  });

  it('uses the newest Drupal selection and warns about duplicates', () => {
    const older = post({ title: 'Older', slug: '/older', date: '2025-01-01' });
    const newer = post({ title: 'Newer', slug: '/newer', date: '2026-01-01' });
    const warning = mock.method(console, 'warn', () => undefined);
    try {
      assert.equal(resolveFeaturedCategoryPost([], category, [older, newer]), newer);
      assert.equal(warning.mock.callCount(), 1);
      assert.match(String(warning.mock.calls[0].arguments[0]), /Using newest: “Newer”/);
    } finally {
      warning.mock.restore();
    }
  });

  it('uses the configured fallback and then the newest category post', () => {
    const configured = post({ slug: category.featuredSlug });
    assert.equal(resolveFeaturedCategoryPost([configured], category), configured);

    const older = post({ slug: '/older', date: '2025-01-01' });
    const newer = post({ slug: '/newer', date: '2026-01-01' });
    assert.equal(resolveFeaturedCategoryPost([older, newer], category), newer);
  });

  it('returns only Drupal-selected posts in the requested category', () => {
    const selected = post({ featuredCategoryPost: true });
    const other = post({ category: 'Tech', featuredCategoryPost: true });
    assert.deepEqual(getDrupalFeaturedCategoryPosts([selected, other], category), [selected]);
  });

  it('supports empty new categories without a configured feature', () => {
    assert.equal(resolveFeaturedCategoryPost([], getBlogCategoryByKey('speaking')), undefined);
  });
});
