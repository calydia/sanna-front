import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('English pages expose the shared primary navigation and skip link', async ({ page }) => {
  await page.goto('/');

  const primaryNavigation = page.getByRole('navigation', { name: 'Main' });
  await expect(primaryNavigation).toBeVisible();
  await expect(primaryNavigation.getByRole('link')).toHaveCount(6);
  expect(await primaryNavigation.getByRole('link').allTextContents()).toEqual([
    'Home', 'About', 'Services', 'Speaking', 'Projects', 'Blog',
  ]);
  await expect(primaryNavigation.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('navigation', { name: 'Blog topics' })).toHaveCount(0);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('Finnish pages expose the localized primary navigation', async ({ page }) => {
  await page.goto('/fi/');

  const primaryNavigation = page.getByRole('navigation', { name: 'Päävalikko' });
  await expect(primaryNavigation).toBeVisible();
  expect(await primaryNavigation.getByRole('link').allTextContents()).toEqual([
    'Etusivu', 'Minä', 'Palvelut', 'Esiintymiset', 'Projektit', 'Blogi',
  ]);
  await expect(primaryNavigation.getByRole('link', { name: 'Etusivu' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('navigation', { name: 'Blog topics' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Hyppää pääsisältöön' })).toHaveCount(1);
  await expect(primaryNavigation.getByRole('link', { name: 'Blogi' })).toHaveAttribute('href', '/fi/blog/');
});

test('English primary navigation destinations resolve and identify the current page', async ({ page }) => {
  for (const path of ['/about/', '/services/', '/speaking/', '/projects/', '/blog/']) {
    const response = await page.goto(path);
    expect(response?.ok(), `${path} should resolve`).toBe(true);

    const primaryNavigation = page.getByRole('navigation', { name: 'Main' });
    const currentLink = primaryNavigation.locator('[aria-current="page"]');
    await expect(currentLink).toHaveCount(1);
    await expect(currentLink).toHaveAttribute('href', path);
  }
});

test('Finnish primary navigation destinations resolve and identify the current section', async ({ page }) => {
  const destinations = [
    ['/fi/mina/', 'Minä'],
    ['/fi/palvelut/', 'Palvelut'],
    ['/fi/esiintymiset/', 'Esiintymiset'],
    ['/fi/projektit/', 'Projektit'],
    ['/fi/blog/', 'Blogi'],
  ] as const;

  for (const [path, label] of destinations) {
    const response = await page.goto(path);
    expect(response?.ok(), `${path} should resolve`).toBe(true);
    const navigation = page.getByRole('navigation', { name: 'Päävalikko' });
    await expect(navigation.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
    await expect(navigation.getByRole('link', { name: 'Etusivu' })).not.toHaveAttribute('aria-current');
  }

  await page.goto('/fi/palvelut/koulutukset/');
  await expect(page.getByRole('navigation', { name: 'Päävalikko' }).getByRole('link', { name: 'Palvelut' })).toHaveAttribute('aria-current', 'true');
});

test('new Finnish section pages link to their English counterparts', async ({ page }) => {
  for (const [path, label, target] of [
    ['/fi/mina/', 'In English', '/about/'],
    ['/fi/esiintymiset/', 'In English', '/speaking/'],
    ['/fi/projektit/', 'In English', '/projects/'],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: label })).toHaveAttribute('href', target);
  }
});

test('Finnish blog introduction points to English without claiming to be a translation', async ({ page }) => {
  await page.goto('/fi/blog/');

  const blogLink = page.getByRole('link', { name: 'Read the blog in English' });
  await expect(blogLink).toHaveAttribute('href', '/blog/');
  await expect(blogLink).toHaveAttribute('lang', 'en');
  await expect(blogLink).toHaveAttribute('hreflang', 'en');
  await expect(page.locator('head link[rel="alternate"]')).toHaveCount(0);
});

test('@a11y shared shell and Finnish section pages have no detectable violations', async ({ page }) => {
  for (const path of ['/', '/fi/mina/', '/fi/esiintymiset/', '/fi/projektit/', '/fi/blog/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${path} accessibility violations`).toEqual([]);
  }
});
