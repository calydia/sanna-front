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

test('blog social images use the shared fallback or an authored article image', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://sanna.a11y.ing/social-media-share.jpg');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://sanna.a11y.ing/social-media-share.jpg');
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', 'A11ying with Sanna');
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', 'A11ying with Sanna');

  await page.goto('/blog/accessibility/accessibility-testing-guide/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'http://127.0.0.1:4010/image.jpg');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'http://127.0.0.1:4010/image.jpg');
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveCount(0);
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:image:height"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:image:type"]')).toHaveCount(0);
});

test('canonical blog routes resolve with both navigation levels', async ({ page }) => {
  for (const path of routes) {
    const response = await page.goto(path);
    expect(response?.ok(), `${path} should resolve`).toBe(true);
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Blog topics' })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://sanna.a11y.ing${path}`);
  }
});

test('blog listing pages retain the constrained main container', async ({ page }) => {
  for (const path of ['/blog/', '/blog/accessibility/']) {
    await page.goto(path);
    const main = page.locator('main#main-content');
    await expect(main.locator('.blog-shell')).toBeVisible();
    await expect(main).toHaveCSS('max-width', '1152px');
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
  await expect(page.getByRole('link', { name: 'Accessibility Testing', exact: true })).toHaveAttribute('href', '/blog/tags/accessibility-testing/');
  await expect(page.locator('.blog-article-layout > section').getByRole('heading', { name: 'Related posts' })).toBeVisible();
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

test('article supporting content uses top-level landmarks in reading order', async ({ page, isMobile }) => {
  await page.goto('/blog/accessibility/accessibility-testing-guide/');

  const layout = page.locator('.blog-article-layout');
  const topicNavigation = layout.locator(':scope > nav[aria-label="Blog topics"]');
  const breadcrumbs = layout.locator(':scope > nav[aria-label="Breadcrumbs"]');
  const contentLayout = layout.locator(':scope > .blog-article-content');
  const main = contentLayout.locator(':scope > main');
  const sidebar = contentLayout.locator(':scope > aside');
  const relatedPosts = contentLayout.locator(':scope > section');

  await expect(topicNavigation).toBeVisible();
  await expect(breadcrumbs).toBeVisible();
  await expect(main.getByRole('navigation', { name: 'Blog topics' })).toHaveCount(0);
  await expect(main.getByRole('navigation', { name: 'Breadcrumbs' })).toHaveCount(0);
  await expect(main.locator('article')).toBeVisible();
  await expect(sidebar.getByRole('region', { name: 'About the author' })).toBeVisible();
  await expect(main.getByRole('region', { name: 'About the author' })).toHaveCount(0);
  await expect(relatedPosts.getByRole('heading', { name: 'Related posts' })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Related posts' })).toHaveCount(0);
  await expect(relatedPosts).toHaveCSS('grid-column-start', '1');
  await expect(relatedPosts).toHaveCSS('grid-column-end', '-1');

  expect(await topicNavigation.evaluate((node) => {
    const breadcrumbNode = node.parentElement?.querySelector(':scope > nav[aria-label="Breadcrumbs"]');
    return breadcrumbNode ? Boolean(node.compareDocumentPosition(breadcrumbNode) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
  })).toBe(true);
  expect(await breadcrumbs.evaluate((node) => {
    const mainNode = node.parentElement?.querySelector(':scope > .blog-article-content > main');
    return mainNode ? Boolean(node.compareDocumentPosition(mainNode) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
  })).toBe(true);
  expect(await main.evaluate((node) => {
    const sidebarNode = node.parentElement?.querySelector(':scope > aside');
    return sidebarNode ? Boolean(node.compareDocumentPosition(sidebarNode) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
  })).toBe(true);
  expect(await sidebar.evaluate((node) => {
    const relatedNode = node.parentElement?.querySelector(':scope > section');
    return relatedNode ? Boolean(node.compareDocumentPosition(relatedNode) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
  })).toBe(true);

  const [layoutBox, topicNavigationBox, breadcrumbsBox] = await Promise.all([
    layout.boundingBox(),
    topicNavigation.boundingBox(),
    breadcrumbs.boundingBox(),
  ]);
  expect(topicNavigationBox?.width).toBe(layoutBox?.width);
  expect(breadcrumbsBox?.width).toBe(layoutBox?.width);

  if (!isMobile) {
    const [mainBox, sidebarBox] = await Promise.all([main.boundingBox(), sidebar.boundingBox()]);
    expect(mainBox?.y).toBe(sidebarBox?.y);
  }
});

test('blog shell exposes RSS, honest language navigation, and the production footer', async ({ page, isMobile }) => {
  await page.goto('/blog/');

  const header = page.locator('header');
  const rssLink = header.getByRole('link', { name: 'RSS feed' });
  const languageLink = header.getByRole('link', { name: 'Tietoa blogista suomeksi' });
  await expect(rssLink).toHaveAttribute('href', '/blog/rss.xml');
  await expect(languageLink).toHaveAttribute('href', '/fi/blog/');
  expect(await languageLink.evaluate((element, rss) => Boolean(element.compareDocumentPosition(rss) & Node.DOCUMENT_POSITION_FOLLOWING), await rssLink.elementHandle())).toBe(true);

  const footer = page.locator('footer');
  const backToTop = footer.getByRole('button', { name: 'Back to top' });
  await expect(backToTop).toBeVisible();
  await expect(footer.getByRole('navigation', { name: 'About this site' }).getByRole('link', { name: 'About me' })).toHaveAttribute('href', '/about/');
  await expect(footer.getByRole('link', { name: 'RSS feed' })).toHaveAttribute('href', '/blog/rss.xml');
  const relatedSites = footer.getByRole('navigation', { name: 'A11ying sites' });
  await expect(relatedSites.getByRole('link')).toHaveCount(3);
  await expect(relatedSites.getByRole('link', { name: 'Accessibility Testing Lab' })).toHaveAttribute('href', 'https://testing.a11y.ing/');

  if (!isMobile) {
    await backToTop.hover();
    await expect(backToTop).toHaveCSS('text-decoration-line', 'none');
    await expect(backToTop).toHaveCSS('border-top-color', 'rgb(84, 0, 123)');
    const aboutLink = footer.getByRole('link', { name: 'About me' });
    await aboutLink.hover();
    await expect(aboutLink).toHaveCSS('text-decoration-line', 'underline');
  }
  await backToTop.click();
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
