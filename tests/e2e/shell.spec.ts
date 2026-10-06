import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { gotoExistingPage } from './helpers.ts';

test('English pages expose the shared primary navigation and skip link', async ({ page }) => {
  await gotoExistingPage(page, '/');

  const primaryNavigation = page.getByRole('navigation', { name: 'Main' });
  await expect(primaryNavigation).toBeVisible();
  await expect(primaryNavigation.getByRole('link')).toHaveCount(5);
  expect(await primaryNavigation.getByRole('link').allTextContents()).toEqual([
    'Home', 'About', 'Speaking', 'Projects', 'Blog',
  ]);
  await expect(primaryNavigation.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('navigation', { name: 'Blog topics' })).toHaveCount(0);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('Finnish pages expose the localized primary navigation', async ({ page }) => {
  await gotoExistingPage(page, '/fi/', { language: 'fi' });

  const primaryNavigation = page.getByRole('navigation', { name: 'Päävalikko' });
  await expect(primaryNavigation).toBeVisible();
  expect(await primaryNavigation.getByRole('link').allTextContents()).toEqual([
    'Etusivu', 'Minusta', 'Esiintymiset', 'Projektit', 'Blogi',
  ]);
  await expect(primaryNavigation.getByRole('link', { name: 'Etusivu' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('navigation', { name: 'Blog topics' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Hyppää pääsisältöön' })).toHaveCount(1);
  await expect(primaryNavigation.getByRole('link', { name: 'Blogi' })).toHaveAttribute('href', '/fi/blog/');
});

for (const path of ['/about/', '/speaking/', '/projects/', '/blog/']) {
  test(`English primary navigation identifies ${path} as the current page`, async ({ page }) => {
    await gotoExistingPage(page, path);

    const primaryNavigation = page.getByRole('navigation', { name: 'Main' });
    const currentLink = primaryNavigation.locator('[aria-current="page"]');
    await expect(currentLink).toHaveCount(1);
    await expect(currentLink).toHaveAttribute('href', path);
  });
}

const finnishDestinations = [
  ['/fi/minusta/', 'Minusta'],
  ['/fi/esiintymiset/', 'Esiintymiset'],
  ['/fi/projektit/', 'Projektit'],
  ['/fi/blog/', 'Blogi'],
] as const;

for (const [path, label] of finnishDestinations) {
  test(`Finnish primary navigation identifies ${path} as the current section`, async ({ page }) => {
    await gotoExistingPage(page, path, { language: 'fi' });
    const navigation = page.getByRole('navigation', { name: 'Päävalikko' });
    await expect(navigation.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
    await expect(navigation.getByRole('link', { name: 'Etusivu' })).not.toHaveAttribute('aria-current');
  });
}

for (const [path, label, target] of [
  ['/fi/minusta/', 'In English', '/about/'],
  ['/fi/esiintymiset/', 'In English', '/speaking/'],
  ['/fi/projektit/', 'In English', '/projects/'],
] as const) {
  test(`${path} links to its English counterpart`, async ({ page }) => {
    await gotoExistingPage(page, path, { language: 'fi' });
    await expect(page.getByRole('link', { name: label })).toHaveAttribute('href', target);
  });
}

test('Finnish blog introduction points to English without claiming to be a translation', async ({ page }) => {
  await gotoExistingPage(page, '/fi/blog/', { language: 'fi' });

  const blogLink = page.getByRole('link', { name: 'Read the blog in English' });
  await expect(blogLink).toHaveAttribute('href', '/blog/');
  await expect(blogLink).toHaveAttribute('lang', 'en');
  await expect(blogLink).toHaveAttribute('hreflang', 'en');
  await expect(page.locator('head link[rel="alternate"]')).toHaveCount(0);
});

for (const path of ['/', '/fi/minusta/', '/fi/esiintymiset/', '/fi/projektit/', '/fi/blog/']) {
  test(`@a11y shared shell on ${path} has no detectable violations`, async ({ page }) => {
    await gotoExistingPage(page, path, { language: path.startsWith('/fi/') ? 'fi' : 'en' });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
