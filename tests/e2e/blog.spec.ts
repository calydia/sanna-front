import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  '/blog/',
  '/blog/accessibility/',
  '/blog/technology/',
  '/blog/speaking/',
  '/blog/projects/',
  '/blog/personal/',
  '/blog/personal/life/',
  '/blog/personal/cats/',
  '/blog/personal/games/',
  '/blog/posts/',
  '/blog/posts/2/',
  '/blog/accessibility/page/2/',
  '/blog/tags/accessibility-testing/',
  '/blog/accessibility/accessibility-testing-guide/',
  '/blog/personal/cats/remembering-osiris/',
];

test('canonical blog routes resolve with both navigation levels', async ({ page }) => {
  for (const path of routes) {
    const response = await page.goto(path);
    expect(response?.ok(), `${path} should resolve`).toBe(true);
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Blog topics' })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://sanna.a11y.ing${path}`);
  }
});

test('empty professional categories render useful archive states', async ({ page }) => {
  for (const path of ['/blog/speaking/', '/blog/projects/']) {
    await page.goto(path);
    await expect(page.getByText('No posts have been published in this section yet.')).toBeVisible();
  }
});

test('personal discovery and articles retain their full nested paths', async ({ page }) => {
  await page.goto('/blog/personal/');
  await expect(page.getByLabel('Personal topics').getByRole('link', { name: 'Cats', exact: true })).toHaveAttribute('href', '/blog/personal/cats/');
  await expect(page.getByRole('link', { name: 'Remembering Osiris' }).first()).toHaveAttribute('href', '/blog/personal/cats/remembering-osiris/');

  await page.goto('/blog/personal/cats/remembering-osiris/');
  await expect(page.getByRole('heading', { name: 'Remembering Osiris', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumbs' })).toContainText('Personal');
});

test('article topics, related posts, pagination, and RSS use new routes', async ({ page, request }) => {
  await page.goto('/blog/accessibility/accessibility-testing-guide/');
  await expect(page.getByRole('link', { name: 'Accessibility Testing' })).toHaveAttribute('href', '/blog/tags/accessibility-testing/');
  await expect(page.locator('main article').getByRole('heading', { name: 'Related posts' })).toBeVisible();
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain('BlogPosting');

  await page.goto('/blog/accessibility/');
  await expect(page.getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '/blog/accessibility/page/2/');

  const response = await request.get('/blog/rss.xml');
  expect(response.ok()).toBe(true);
  const feed = await response.text();
  expect(feed).toContain('https://sanna.a11y.ing/blog/technology/moving-my-accessibility-site-to-astro/');
  expect(feed).toContain('https://sanna.a11y.ing/blog/personal/cats/remembering-osiris/');
  expect(feed).not.toContain('blog.sanna.ninja');
});

test('blog shell exposes RSS, honest language navigation, and the production footer', async ({ page }) => {
  await page.goto('/blog/');

  const header = page.locator('header');
  const rssLink = header.getByRole('link', { name: 'RSS feed' });
  const languageLink = header.getByRole('link', { name: 'Tietoa blogista suomeksi' });
  await expect(rssLink).toHaveAttribute('href', '/blog/rss.xml');
  await expect(languageLink).toHaveAttribute('href', '/fi/blog/');
  expect(await languageLink.evaluate((element, rss) => Boolean(element.compareDocumentPosition(rss) & Node.DOCUMENT_POSITION_FOLLOWING), await rssLink.elementHandle())).toBe(true);

  const footer = page.locator('footer');
  await expect(footer.getByRole('button', { name: 'Back to top' })).toBeVisible();
  await expect(footer.getByRole('navigation', { name: 'About this site' }).getByRole('link', { name: 'About me' })).toHaveAttribute('href', '/about/');
  await expect(footer.getByRole('link', { name: 'RSS feed' })).toHaveAttribute('href', '/blog/rss.xml');
  await expect(footer.getByRole('navigation', { name: 'A11ying sites' }).getByRole('link')).toHaveCount(2);

  await footer.getByRole('button', { name: 'Back to top' }).click();
  await expect(page.locator('#page-top')).toBeFocused();

  await page.goto('/blog/accessibility/accessibility-testing-guide/');
  await expect(page.locator('header').getByRole('link', { name: 'RSS feed' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Tietoa blogista suomeksi' })).toHaveCount(0);

  await page.goto('/about/');
  await expect(page.getByRole('link', { name: 'RSS feed' })).toHaveCount(0);
  await expect(page.getByText(/Made with/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back to top' })).toHaveCount(0);
});

test('rendered blog pages contain no former domain or root-level blog links', async ({ page }) => {
  for (const path of ['/blog/', '/blog/accessibility/', '/blog/personal/', '/blog/personal/cats/remembering-osiris/']) {
    await page.goto(path);
    const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(hrefs.some((href) => href.includes('blog.sanna.ninja')), `${path} old-domain links`).toBe(false);
    expect(hrefs.some((href) => /^\/(tech|life|cats|games|tags)\//.test(href)), `${path} former root links`).toBe(false);
  }
});

test('@a11y representative blog pages have no detectable violations', async ({ page }) => {
  for (const path of ['/blog/', '/blog/personal/', '/blog/speaking/', '/blog/accessibility/accessibility-testing-guide/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${path} accessibility violations`).toEqual([]);
  }
});
