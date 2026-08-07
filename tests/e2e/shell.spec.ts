import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('English pages expose the shared primary navigation and skip link', async ({ page }) => {
  await page.goto('/');

  const primaryNavigation = page.getByRole('navigation', { name: 'Main' });
  await expect(primaryNavigation).toBeVisible();
  await expect(primaryNavigation.getByRole('link')).toHaveCount(4);
  await expect(page.getByRole('navigation', { name: 'Blog topics' })).toHaveCount(0);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('Finnish pages preserve their navigation boundary', async ({ page }) => {
  await page.goto('/fi/');

  await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Blog topics' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Hyppää pääsisältöön' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Blogi' })).toHaveAttribute('href', '/fi/blog/');
});

test('Finnish blog introduction points to English without claiming to be a translation', async ({ page }) => {
  await page.goto('/fi/blog/');

  const blogLink = page.getByRole('link', { name: 'Read the blog in English' });
  await expect(blogLink).toHaveAttribute('href', '/blog/');
  await expect(blogLink).toHaveAttribute('lang', 'en');
  await expect(blogLink).toHaveAttribute('hreflang', 'en');
  await expect(page.locator('head link[rel="alternate"]')).toHaveCount(0);
});

test('@a11y shared shell and Finnish blog introduction have no detectable violations', async ({ page }) => {
  for (const path of ['/', '/fi/blog/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${path} accessibility violations`).toEqual([]);
  }
});
