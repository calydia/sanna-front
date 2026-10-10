import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normalizeDrupalHtml } from '../../src/blog/api/drupalHtml.ts';
import { normalizeArticle } from '../../src/blog/api/blogApi.ts';

const apiUrl = 'https://cms.example/graphql';

describe('Drupal inline images', () => {
  it('resolves Drupal paths and adds lazy loading while preserving surrounding HTML', () => {
    assert.equal(
      normalizeDrupalHtml('<p>Hello</p><img src="/sites/default/files/photo.jpg" alt="A &amp; B"><p>End</p>', apiUrl),
      '<p>Hello</p><img src="https://cms.example/sites/default/files/photo.jpg" alt="A &amp; B" loading="lazy"><p>End</p>',
    );
  });

  it('supports picture sources, srcset descriptors, unquoted and single-quoted paths', () => {
    const result = normalizeDrupalHtml('<picture><source srcset="/small.jpg 1x,/large.jpg 2x"><img src=images/photo.jpg></picture>', apiUrl);
    assert.match(result, /srcset="https:\/\/cms.example\/small.jpg 1x,https:\/\/cms.example\/large.jpg 2x"/);
    assert.match(result, /src="https:\/\/cms.example\/images\/photo.jpg"/);
    assert.match(normalizeDrupalHtml("<img src='/photo.jpg' />", apiUrl), /loading="lazy"/);
  });

  it('preserves absolute and data URLs, explicit eager loading, and non-image markup', () => {
    const html = '<img src="https://other.example/photo.jpg" loading="eager"><img src="data:image/png;base64,abc" loading="lazy"><a href="/local">Link</a><!-- <img src="/comment.jpg"> -->';
    assert.equal(normalizeDrupalHtml(html, apiUrl), html);
    assert.match(normalizeDrupalHtml('<img srcset="data:image/png;base64,abc 1x, /large.jpg 2x">', apiUrl), /data:image\/png;base64,abc 1x,https:\/\/cms.example\/large.jpg 2x/);
  });

  it('normalizes RSS article content using the configured CMS origin', () => {
    const result = normalizeArticle({ title: 'Post', category: 'Tech', slug: '/post', date: '2026-10-10', metaDescription: '', content: '<img src="/photo.jpg">' }, 'rss', 0, apiUrl);
    assert.equal(result.content, '<img src="https://cms.example/photo.jpg" loading="lazy">');
  });
});
