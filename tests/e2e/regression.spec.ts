import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { representativePages } from './pages.ts';

test('blog homepage presents six latest posts and a full archive link', async ({ page }) => {
  await page.goto('/blog/');
  const topics = page.getByRole('region', { name: 'Blog topics' });
  await expect(page.getByRole('heading', { name: 'Professional topics' })).toHaveCount(0);
  await expect(topics.getByRole('heading', { level: 2 })).toHaveCount(5);
  await expect(topics.getByRole('heading', { level: 2, name: 'Personal' })).toBeVisible();

  const latestPosts = page.getByRole('region', { name: 'Latest posts' });
  await expect(latestPosts.getByRole('listitem')).toHaveCount(6);
  await expect(latestPosts.getByRole('heading', { level: 3 })).toHaveCount(6);
  await expect(page.getByRole('link', { name: /browse all posts/i })).toHaveAttribute('href', '/blog/posts/');
});

test('article cards keep images and descriptions outside the expanded title link', async ({ page }) => {
  await page.goto('/blog/');
  const card = page.getByRole('region', { name: 'Latest posts' }).getByRole('listitem').first();
  const titleLink = card.getByRole('link', { name: 'A practical guide to accessibility testing' });
  await expect(titleLink.locator('img, p')).toHaveCount(0);
  await expect(card.locator('img')).toHaveCount(1);
  await expect(card.locator('p')).toHaveCount(2);
  await expect(card.getByRole('link')).toHaveCount(1);
  await expect(card.getByRole('link', { name: 'Accessibility', exact: true })).toHaveCount(0);
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

test('blog card and browse-link interactions use the approved underline and focus treatments', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'Hover styling requires a hover-capable pointer.');
  await page.goto('/blog/');
  await page.locator('html').evaluate((element) => {
    element.classList.remove('dark');
    element.classList.add('light');
  });

  const articleCard = page.getByRole('region', { name: 'Latest posts' }).getByRole('listitem').first();
  const articleLink = articleCard.getByRole('link');
  const articleTitle = articleLink.locator('.blog-card-title');
  await expect(articleLink).toHaveCSS('text-decoration-line', 'none');
  await articleCard.hover();
  await expect(articleTitle).toHaveCSS('text-decoration-line', 'underline');
  await expect(articleTitle).toHaveCSS('text-decoration-thickness', '2px');
  await articleLink.focus();
  await expect(articleLink).toHaveCSS('outline-style', 'none');
  await expect(articleCard).toHaveCSS('outline-width', '4px');
  await expect(articleCard).toHaveCSS('outline-offset', '4px');
  await expect(articleCard).toHaveCSS('outline-color', 'rgb(17, 17, 17)');

  const categoryCard = page.getByRole('region', { name: 'Blog topics' }).getByRole('article').first();
  const categoryLink = categoryCard.getByRole('heading', { level: 2 }).getByRole('link');
  const recommendedLink = categoryCard.getByRole('link', { name: /how to create more accessible content/i });
  await expect(recommendedLink).toHaveCSS('text-decoration-thickness', '1px');
  await expect(categoryLink).toHaveCSS('text-decoration-thickness', '2px');
  await categoryCard.hover();
  await expect(categoryLink).toHaveCSS('text-decoration-thickness', '2px');
  await expect(recommendedLink).toHaveCSS('text-decoration-thickness', '1px');
  await recommendedLink.hover();
  await expect(recommendedLink).toHaveCSS('text-decoration-thickness', '2px');
  await recommendedLink.focus();
  await expect(recommendedLink).toHaveCSS('outline-width', '2px');
  await expect(recommendedLink).toHaveCSS('outline-offset', '2px');
  await expect(recommendedLink).toHaveCSS('outline-color', 'rgb(84, 0, 123)');

  const browseLink = page.getByRole('link', { name: /browse all posts/i });
  await expect(browseLink).toHaveCSS('text-decoration-line', 'none');
  await browseLink.hover();
  await expect(browseLink).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(browseLink).toHaveCSS('border-top-color', 'rgb(3, 53, 115)');
  await browseLink.focus();
  await expect(browseLink).toHaveCSS('outline-width', '2px');
  await expect(browseLink).toHaveCSS('outline-offset', '4px');
  await expect(browseLink).toHaveCSS('outline-color', 'rgb(0, 0, 0)');

  await page.goto('/blog/accessibility/accessibility-testing-guide/');
  const tagLink = page.locator('.blog-tag-link').first();
  await expect(tagLink).toHaveCSS('text-decoration-line', 'none');
  await tagLink.hover();
  await expect(tagLink).toHaveCSS('border-top-color', 'rgb(84, 0, 123)');
  await expect(tagLink).toHaveCSS('text-decoration-line', 'underline');
  await expect(tagLink).toHaveCSS('text-decoration-thickness', '2px');

  const tocLink = page.getByRole('navigation', { name: 'On this page' }).getByRole('link').first();
  await expect(tocLink).toHaveCSS('color', 'rgb(3, 53, 115)');
  await expect(tocLink).toHaveCSS('text-decoration-line', 'underline');
  await expect(tocLink).toHaveCSS('text-decoration-thickness', '1px');
  await tocLink.hover();
  await expect(tocLink).toHaveCSS('text-decoration-line', 'underline');
  await expect(tocLink).toHaveCSS('text-decoration-thickness', '2px');

  const contentLink = page.getByRole('link', { name: 'clear guidance' });
  await expect(contentLink).toHaveCSS('text-decoration-line', 'underline');
  await expect(contentLink).toHaveCSS('text-decoration-thickness', '1px');
  await contentLink.hover();
  await expect(contentLink).toHaveCSS('color', 'rgb(84, 0, 123)');
  await expect(contentLink).toHaveCSS('text-decoration-line', 'underline');
  await expect(contentLink).toHaveCSS('text-decoration-thickness', '2px');
});

test('blog styling is scoped and article supporting content matches production structure', async ({ page }) => {
  await page.goto('/blog/accessibility/accessibility-testing-guide/');
  await page.locator('html').evaluate((element) => {
    element.classList.remove('dark');
    element.classList.add('light');
  });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(250, 250, 250)');

  const author = page.getByRole('region', { name: 'About the author' });
  const keepReading = page.getByRole('region', { name: 'Keep reading' });
  await expect(author.getByText('About the author', { exact: true })).toBeVisible();
  await expect(author.getByText('Sanna Kramsi', { exact: true })).toBeVisible();
  await expect(author.locator('img')).toHaveCSS('width', '120px');
  await expect(author.locator('img')).toHaveCSS('border-top-width', '4px');
  const startHereHeading = keepReading.getByRole('heading', { name: 'Start here in accessibility' });
  const startHereLink = keepReading.getByRole('link').first();
  const relatedPostsHeading = keepReading.getByRole('heading', { name: 'Related posts' });
  const relatedPostLinks = keepReading.locator('ul').getByRole('link');
  const browseCategoryLink = keepReading.getByRole('link', { name: 'Browse accessibility posts' });
  await expect(startHereHeading).toHaveCSS('font-weight', '400');
  await expect(startHereLink).toHaveCSS('font-weight', '400');
  await expect(relatedPostsHeading).toHaveCSS('font-weight', '400');
  for (const relatedPostLink of await relatedPostLinks.all()) {
    await expect(relatedPostLink).toHaveCSS('font-weight', '400');
  }
  await expect(browseCategoryLink).toHaveAttribute('href', '/blog/accessibility/');
  await expect(browseCategoryLink).toHaveCSS('font-weight', '700');
  await expect(keepReading.getByRole('link')).toHaveCount(4);
  const keepReadingLink = keepReading.getByRole('link').first();
  await expect(keepReadingLink).toHaveCSS('color', 'rgb(3, 53, 115)');
  await expect(keepReadingLink).toHaveCSS('text-decoration-line', 'underline');
  const keepReadingHrefs = await keepReading.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(new Set(keepReadingHrefs).size).toBe(keepReadingHrefs.length);
  expect(await author.evaluate((node) => {
    const keepReadingNode = document.querySelector('[aria-label="Keep reading"]');
    return keepReadingNode ? Boolean(node.compareDocumentPosition(keepReadingNode) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
  })).toBe(true);

  const toc = page.getByRole('navigation', { name: 'On this page' });
  await expect(toc.getByRole('link')).toHaveCount(3);
  await expect(toc.locator('ul')).toHaveCSS('list-style-type', 'disc');
  const tocLink = toc.getByRole('link').first();
  await expect(tocLink).toHaveCSS('text-decoration-line', 'underline');

  const externalLink = page.getByRole('link', { name: 'clear guidance' });
  const internalLink = page.getByRole('link', { name: 'thoughtful testing' });
  expect(await externalLink.evaluate((element) => getComputedStyle(element, '::after').backgroundImage)).toContain('external-link-light.svg');
  expect(await internalLink.evaluate((element) => getComputedStyle(element, '::after').content)).toBe('none');
  await externalLink.focus();
  await expect(externalLink).toHaveCSS('outline-style', 'solid');
  await expect(externalLink).toHaveCSS('outline-width', '2px');
  await expect(externalLink).toHaveCSS('outline-offset', '2px');
  await expect(externalLink).toHaveCSS('outline-color', 'rgb(84, 0, 123)');

  const gradientCard = page.locator('.blog-gradient-border').first();
  expect(await gradientCard.evaluate((element) => getComputedStyle(element).borderImageSource)).toContain('linear-gradient');

  await page.locator('html').evaluate((element) => {
    element.classList.remove('light');
    element.classList.add('dark');
  });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(1, 0, 23)');
  await expect(keepReadingLink).toHaveCSS('color', 'rgb(173, 229, 248)');
  await expect(keepReadingLink).toHaveCSS('text-decoration-line', 'underline');
  await expect(tocLink).toHaveCSS('color', 'rgb(173, 229, 248)');

  await page.goto('/about/');
  await page.locator('html').evaluate((element) => {
    element.classList.remove('dark');
    element.classList.add('light');
  });
  await expect(page.locator('body')).not.toHaveCSS('background-color', 'rgb(250, 250, 250)');
});

test('blog topic navigation distinguishes inactive, current, and nested ancestor links', async ({ page, isMobile }) => {
  await page.goto('/blog/accessibility/');
  const topics = page.getByRole('navigation', { name: 'Blog topics' });
  const accessibility = topics.getByRole('link', { name: 'Accessibility' });
  const technology = topics.getByRole('link', { name: 'Technology' });
  await expect(accessibility).toHaveCSS('font-size', '18px');
  await expect(accessibility).toHaveAttribute('aria-current', 'page');
  await expect(accessibility).toHaveCSS('text-decoration-line', 'underline');
  await expect(accessibility).toHaveCSS('text-decoration-thickness', '2px');
  await expect(technology).not.toHaveAttribute('aria-current');
  await expect(technology).toHaveCSS('text-decoration-line', 'none');
  if (!isMobile) {
    await accessibility.hover();
    await expect(accessibility).toHaveCSS('text-decoration-thickness', '4px');
  }

  await page.goto('/blog/personal/cats/remembering-osiris/');
  const personal = page.getByRole('navigation', { name: 'Blog topics' }).getByRole('link', { name: 'Personal' });
  await expect(personal).toHaveAttribute('aria-current', 'true');
  await expect(personal).toHaveCSS('text-decoration-line', 'underline');
  await expect(personal).toHaveCSS('text-decoration-thickness', '2px');

  if (!isMobile) {
    await personal.hover();
    await expect(personal).toHaveCSS('text-decoration-thickness', '4px');
  }
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
  const currentPage = pagination.locator('[aria-current="page"]');
  const pageTwo = pagination.getByRole('link', { name: 'Page 2' });
  await expect(pagination).toHaveCSS('font-size', '16px');
  await expect(currentPage).toContainText('1');
  await expect(currentPage).toHaveCSS('background-color', 'rgb(3, 53, 115)');
  await expect(pageTwo).toHaveAttribute('href', '/blog/posts/2/');
  await expect(pageTwo).toHaveCSS('border-top-width', '2px');
  await expect(pageTwo).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(pagination.getByRole('link', { name: /next/i })).toHaveAttribute('rel', 'next');
  expect(await pagination.evaluate((element) => {
    const footer = document.querySelector('footer');
    return footer ? footer.getBoundingClientRect().top - element.getBoundingClientRect().bottom : 0;
  })).toBeGreaterThanOrEqual(32);

  await page.goto('/blog/posts/2/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sanna.a11y.ing/blog/posts/2/');
  await expect(page.getByRole('navigation', { name: 'Pagination' }).getByRole('link', { name: /previous/i })).toHaveAttribute('rel', 'prev');

  await page.goto('/blog/accessibility/page/2/');
  pagination = page.getByRole('navigation', { name: 'Pagination' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessibility posts – Page 2');
  await expect(pagination.getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/blog/accessibility/');
  await expect(page.getByText('New here? Read this first')).toHaveCount(0);
});

test('every blog page keeps consistent space above the footer', async ({ page }) => {
  for (const path of [
    '/blog/',
    '/blog/accessibility/accessibility-testing-guide/',
    '/blog/posts/',
    '/blog/personal/games/',
  ]) {
    await page.goto(path);
    expect(await page.locator('footer').evaluate((footer) => {
      const main = document.querySelector('main');
      return main ? footer.getBoundingClientRect().top - main.getBoundingClientRect().bottom : 0;
    })).toBeGreaterThanOrEqual(32);
  }
});

test('the document reserves scrollbar space to prevent cross-page horizontal movement', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('html')).toHaveCSS('scrollbar-gutter', 'stable');

  const aboutMainWidth = await page.locator('main').evaluate((element) => element.getBoundingClientRect().width);
  await page.goto('/blog/');
  await expect(page.locator('html')).toHaveCSS('scrollbar-gutter', 'stable');
  const blogMainWidth = await page.locator('main').evaluate((element) => element.getBoundingClientRect().width);

  expect(blogMainWidth).toBe(aboutMainWidth);
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

test('theme is initialized synchronously and persists across full-page navigation', async ({ page, request }) => {
  const response = await request.get('/blog/');
  const htmlSource = await response.text();
  const scriptPosition = htmlSource.indexOf('<script src="/theme-init.js"></script>');
  expect(scriptPosition).toBeGreaterThan(-1);
  expect(scriptPosition).toBeLessThan(htmlSource.indexOf('</head>'));
  expect(scriptPosition).toBeLessThan(htmlSource.indexOf('<body'));

  await page.addInitScript(() => {
    if (sessionStorage.getItem('theme-test-seeded') !== 'true') {
      localStorage.setItem('darkMode', 'enabled');
      sessionStorage.setItem('theme-test-seeded', 'true');
    }
  });
  await page.goto('/blog/', { waitUntil: 'domcontentloaded' });
  const root = page.locator('html');
  const initializer = page.locator('head script[src="/theme-init.js"]');
  await expect(initializer).not.toHaveAttribute('type', 'module');
  await expect(initializer).not.toHaveAttribute('async');
  await expect(initializer).not.toHaveAttribute('defer');
  await expect(root).toHaveClass(/dark/);
  await expect(root).not.toHaveClass(/light/);
  await expect(root).toHaveAttribute('data-theme-initialized', 'true');
  await expect(root).toHaveCSS('color-scheme', 'dark');
  await expect(page.getByRole('button', { name: /switch to light/i })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: /switch to light/i }).click();
  await expect(root).toHaveClass(/light/);
  await expect(root).toHaveCSS('color-scheme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('darkMode'))).toBe('disabled');

  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.locator('html')).toHaveClass(/light/);
  await expect(page.locator('html')).toHaveAttribute('data-theme-initialized', 'true');
});

test('theme initializer falls back to the system preference when storage is unset', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => localStorage.removeItem('darkMode'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
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
