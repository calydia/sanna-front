import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { representativePages } from './pages.ts';

test('blog homepage presents six latest posts and a full archive link', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.getByRole('region', { name: 'Latest posts' }).getByRole('listitem')).toHaveCount(6);
  await expect(page.getByRole('link', { name: /browse all posts/i })).toHaveAttribute('href', '/blog/posts/');
});

test('article cards keep images and descriptions outside the expanded title link', async ({ page }) => {
  await page.goto('/blog/');
  const card = page.getByRole('region', { name: 'Latest posts' }).getByRole('listitem').first();
  const titleLink = card.getByRole('link', { name: 'A practical guide to accessibility testing' });
  await expect(titleLink.locator('img, p')).toHaveCount(0);
  await expect(card.locator('img')).toHaveCount(1);
  await expect(card.locator('p')).toHaveCount(2);
  await titleLink.focus();
  await expect(titleLink).toBeFocused();

  const bounds = await card.boundingBox();
  if (!bounds) throw new Error('Article card must have visible bounds.');
  const targetHref = await page.evaluate(({ x, y }) => {
    const target = document.elementFromPoint(x, y)?.closest('a');
    return target?.getAttribute('href');
  }, { x: bounds.x + bounds.width / 2, y: bounds.y + 12 });
  expect(targetHref).toBe('/blog/accessibility/accessibility-testing-guide/');
});

test('breadcrumbs reflect professional and nested personal hierarchies', async ({ page }) => {
  await page.goto('/blog/accessibility/accessibility-testing-guide/');
  let breadcrumb = page.getByRole('navigation', { name: 'Breadcrumbs' });
  await expect(breadcrumb.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog/');
  await expect(breadcrumb.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/blog/accessibility/');

  await page.goto('/blog/personal/cats/remembering-osiris/');
  breadcrumb = page.getByRole('navigation', { name: 'Breadcrumbs' });
  await expect(breadcrumb.getByRole('link', { name: 'Personal' })).toHaveAttribute('href', '/blog/personal/');
  await expect(breadcrumb.getByRole('link', { name: 'Cats' })).toHaveAttribute('href', '/blog/personal/cats/');
  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText('Remembering Osiris');
});

test('article image credits render only when Drupal provides them', async ({ page }) => {
  await page.goto('/blog/accessibility/accessibility-testing-guide/');
  await expect(page.getByText(/Image credit:|null/)).toHaveCount(0);

  await page.goto('/blog/accessibility/how-to-create-more-accessible-content-avoid-common-accessibility-mistakes/');
  await expect(page.getByText('Image credit: Test fixture image')).toBeVisible();
});

test('all-post and category pagination expose canonical next and previous paths', async ({ page }) => {
  await page.goto('/blog/posts/');
  let pagination = page.getByRole('navigation', { name: 'Pagination' });
  await expect(pagination.locator('[aria-current="page"]')).toContainText('1');
  await expect(pagination.getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '/blog/posts/2/');
  await expect(pagination.getByRole('link', { name: /next/i })).toHaveAttribute('rel', 'next');

  await page.goto('/blog/posts/2/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sanna.a11y.ing/blog/posts/2/');
  await expect(page.getByRole('navigation', { name: 'Pagination' }).getByRole('link', { name: /previous/i })).toHaveAttribute('rel', 'prev');

  await page.goto('/blog/accessibility/page/2/');
  pagination = page.getByRole('navigation', { name: 'Pagination' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessibility posts – Page 2');
  await expect(pagination.getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/blog/accessibility/');
  await expect(page.getByText('New here? Read this first')).toHaveCount(0);
});

test('CSP is present and permits the shared theme toggle on blog pages', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /content security policy|refused to/i.test(message.text())) errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/blog/', { waitUntil: 'networkidle' });
  await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1);
  const html = page.locator('html');
  const initialClass = await html.getAttribute('class');
  await page.getByRole('button', { name: /switch to/i }).click();
  await expect(html).not.toHaveAttribute('class', initialClass ?? '');
  expect(errors).toEqual([]);
});

test('sitemap includes canonical blog discovery and article routes', async ({ request }) => {
  const indexResponse = await request.get('/sitemap-index.xml');
  expect(indexResponse.ok()).toBe(true);
  const index = await indexResponse.text();
  const sitemapPath = new URL(index.match(/<loc>(.*?)<\/loc>/)?.[1] ?? '').pathname;
  const sitemapResponse = await request.get(sitemapPath);
  const sitemap = await sitemapResponse.text();
  expect(sitemap).toContain('https://sanna.a11y.ing/blog/');
  expect(sitemap).toContain('https://sanna.a11y.ing/blog/personal/cats/');
  expect(sitemap).toContain('https://sanna.a11y.ing/blog/personal/cats/remembering-osiris/');
  expect(sitemap).not.toContain('blog.sanna.ninja');
});

test('shared discovery files and not-found page use combined-site branding', async ({ page, request }) => {
  const robotsResponse = await request.get('/robots.txt');
  expect(robotsResponse.ok()).toBe(true);
  expect(await robotsResponse.text()).toContain('Sitemap: https://sanna.a11y.ing/sitemap-index.xml');

  const manifestResponse = await request.get('/manifest.json');
  expect(manifestResponse.ok()).toBe(true);
  expect(await manifestResponse.json()).toMatchObject({ name: 'A11ying with Sanna', short_name: 'Sanna' });

  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'blog', exact: true })).toHaveAttribute('href', '/blog/');
});

for (const pageCase of representativePages) {
  test(`@a11y ${pageCase.name} has no WCAG A or AA violations`, async ({ page }) => {
    await page.goto(pageCase.path, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
