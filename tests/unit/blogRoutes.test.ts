import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  blogCategories,
  getBlogCategoriesByGroup,
  getBlogCategoryByDrupalName,
  getBlogCategoryByKey,
} from '../../src/blog/categories.ts';
import {
  BLOG_PATH,
  BLOG_RSS_PATH,
  PERSONAL_BLOG_PATH,
  getBlogArticlePath,
  getBlogCategoryPagePath,
  getBlogCategoryPath,
  getBlogTagPath,
} from '../../src/blog/routes.ts';

const expectedRoutes = [
  ['Accessibility', '/blog/accessibility/', '/blog/accessibility/example-post/'],
  ['Tech', '/blog/technology/', '/blog/technology/example-post/'],
  ['Speaking', '/blog/speaking/', '/blog/speaking/example-post/'],
  ['Projects', '/blog/projects/', '/blog/projects/example-post/'],
  ['Life', '/blog/personal/life/', '/blog/personal/life/example-post/'],
  ['Cats', '/blog/personal/cats/', '/blog/personal/cats/example-post/'],
  ['Games', '/blog/personal/games/', '/blog/personal/games/example-post/'],
] as const;

describe('blog category registry', () => {
  it('contains each approved category exactly once', () => {
    assert.equal(blogCategories.length, expectedRoutes.length);
    assert.equal(new Set(blogCategories.map((category) => category.key)).size, expectedRoutes.length);
    assert.equal(new Set(blogCategories.map((category) => category.drupalName)).size, expectedRoutes.length);
  });

  it('looks up Drupal names without deriving public labels from them', () => {
    const category = getBlogCategoryByDrupalName(' tech ');
    assert.equal(category.key, 'technology');
    assert.equal(category.label, 'Technology');
  });

  it('groups professional and personal categories explicitly', () => {
    assert.deepEqual(
      getBlogCategoriesByGroup('professional').map((category) => category.key),
      ['accessibility', 'technology', 'speaking', 'projects'],
    );
    assert.deepEqual(
      getBlogCategoriesByGroup('personal').map((category) => category.key),
      ['life', 'cats', 'games'],
    );
  });

  it('stores the confirmed Drupal IDs independently from optional archive page IDs', () => {
    assert.equal(getBlogCategoryByKey('speaking').drupalCategoryId, 70);
    assert.equal(getBlogCategoryByKey('projects').drupalCategoryId, 71);
    assert.equal(getBlogCategoryByKey('projects').archivePageId, undefined);
  });

  it('identifies an unknown category and affected article', () => {
    assert.throws(
      () => getBlogCategoryByDrupalName('Mystery', 'An unmapped article'),
      /Unknown Drupal blog category “Mystery” for article “An unmapped article”/,
    );
  });
});

describe('canonical blog routes', () => {
  it('exports stable blog root routes', () => {
    assert.equal(BLOG_PATH, '/blog/');
    assert.equal(PERSONAL_BLOG_PATH, '/blog/personal/');
    assert.equal(BLOG_RSS_PATH, '/blog/rss.xml');
  });

  for (const [drupalName, archivePath, articlePath] of expectedRoutes) {
    it(`maps ${drupalName} to its approved archive and article paths`, () => {
      assert.equal(getBlogCategoryPath(drupalName), archivePath);
      assert.equal(getBlogArticlePath(drupalName, '/example-post'), articlePath);
    });
  }

  it('normalizes leading and trailing slashes on article and tag slugs', () => {
    assert.equal(getBlogArticlePath('Cats', '///cat-post///'), '/blog/personal/cats/cat-post/');
    assert.equal(getBlogTagPath('/accessibility-testing/'), '/blog/tags/accessibility-testing/');
  });

  it('returns the archive for page one and nests later pages', () => {
    assert.equal(getBlogCategoryPagePath('Life', 1), '/blog/personal/life/');
    assert.equal(getBlogCategoryPagePath('Life', 2), '/blog/personal/life/page/2/');
  });

  it('rejects invalid page values and empty slugs', () => {
    assert.throws(() => getBlogCategoryPagePath('Tech', 0), /positive integer/);
    assert.throws(() => getBlogCategoryPagePath('Tech', 1.5), /positive integer/);
    assert.throws(() => getBlogArticlePath('Tech', '///'), /cannot be empty/);
    assert.throws(() => getBlogTagPath('  '), /cannot be empty/);
  });

  it('includes article context in route-time unknown-category errors', () => {
    assert.throws(
      () => getBlogArticlePath('Unknown', '/lost-post', 'Lost post'),
      /Unknown Drupal blog category “Unknown” for article “Lost post”/,
    );
  });
});
