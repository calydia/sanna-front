import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('About presents Sanna’s principles and community participation', async ({ page }) => {
  await page.goto('/about/');

  await expect(page.getByRole('heading', { level: 1, name: 'About Sanna' })).toHaveCount(1);

  const principles = page.getByRole('region', { name: 'How I think about accessibility' });
  await expect(principles.getByRole('article')).toHaveCount(3);
  await expect(principles.getByRole('heading', { level: 3 })).toHaveText([
    'Part of product quality',
    'Prevent problems returning',
    'Practical and approachable',
  ]);

  const a11ying = page.getByRole('region', { name: 'A11ying with Sanna' });
  const community = page.getByRole('region', { name: 'Community and knowledge sharing' });
  await expect(a11ying).toBeVisible();
  await expect(community).toContainText('Finland and the Nordic region');
});

test('Speaking uses structured topics, appearances, archive metadata, and enquiries', async ({ page }) => {
  await page.goto('/speaking/');

  await expect(page.getByRole('heading', { level: 1, name: 'Speaking' })).toHaveCount(1);

  const topics = page.getByRole('region', { name: 'Topics I speak about' });
  await expect(topics.getByRole('article')).toHaveCount(3);
  const developmentTopic = topics.getByRole('article').filter({
    has: page.getByRole('heading', { level: 3, name: 'Software development, teams and communication' }),
  });
  await expect(developmentTopic).toContainText('Development practices');

  const upcoming = page.getByRole('region', { name: 'Upcoming talks' });
  await expect(upcoming.getByRole('article')).toHaveCount(3);
  await expect(upcoming.getByRole('heading', { level: 3 })).toHaveText([
    'Hidden Skills of Development: Practical Building Blocks for Team Health',
    'Who Owns Accessibility After a WordPress Site Launches?',
    'Decoding Collaboration: Hidden Skills for Diverse Workflows',
  ]);
  await expect(upcoming.locator('h3[lang="en"]')).toHaveCount(3);
  const drupalCon = upcoming.getByRole('article').first();
  await expect(drupalCon.getByRole('link', { name: 'Hidden Skills of Development: Practical Building Blocks for Team Health' })).toHaveAttribute(
    'href',
    'https://events.drupal.org/rotterdam2026/session/hidden-skills-development-practical-building-blocks-team-health',
  );
  const drupalConMetadata = drupalCon.locator('p').first();
  await expect(drupalConMetadata).toContainText('DrupalCon Europe 2026 · Rotterdam');
  const metadataAccessibilitySnapshot = await drupalConMetadata.ariaSnapshot();
  expect(metadataAccessibilitySnapshot).toContain('DrupalCon Europe 2026 Rotterdam');
  expect(metadataAccessibilitySnapshot).not.toContain('·');
  await expect(drupalCon).toContainText('With Mikaela Kindstedt');
  await expect(drupalCon).toContainText('communication frameworks');
  const wordpressAccessibilityDay = upcoming.getByRole('article').nth(1);
  await expect(wordpressAccessibilityDay.getByRole('link', { name: 'Who Owns Accessibility After a WordPress Site Launches?' })).toHaveAttribute(
    'href',
    'https://wpaccessibility.day/2026/sessions/who-owns-accessibility-after-a-wordpress-site-launches/',
  );
  await expect(wordpressAccessibilityDay).toContainText('WordPress Accessibility Day 2026 · Online');
  await expect(wordpressAccessibilityDay).toContainText('accessible launch is only the beginning');
  const wpSuomi = upcoming.getByRole('article').nth(2);
  await expect(wpSuomi.getByRole('link', { name: 'Decoding Collaboration: Hidden Skills for Diverse Workflows' })).toHaveAttribute(
    'href',
    'https://wpsuomi.fi/',
  );
  await expect(wpSuomi).toContainText('WP Suomi 2026 · Oulu');
  await expect(wpSuomi).toContainText('With Mikaela Kindstedt');
  await expect(wpSuomi).toContainText('hidden cost of "silent acceptance"');

  const archive = page.getByRole('region', { name: 'Past talks' });
  await expect(archive.getByRole('heading', { level: 3 })).toHaveText(['2026', '2025']);
  await expect(archive.getByRole('heading', { level: 4 })).toHaveCount(5);
  await expect(archive.locator('time[datetime]')).toHaveCount(5);
  const firstArchivedTalkMetadata = archive.locator('li').first().locator('p');
  await expect(firstArchivedTalkMetadata).toContainText('8 May 2026 · DrupalCamp Finland · Helsinki · With Mikaela Kindstedt');
  const archiveMetadataAccessibilitySnapshot = await firstArchivedTalkMetadata.ariaSnapshot();
  expect(archiveMetadataAccessibilitySnapshot).toContain('time: 8 May 2026');
  expect(archiveMetadataAccessibilitySnapshot).toContain('text: DrupalCamp Finland Helsinki With Mikaela Kindstedt');
  expect(archiveMetadataAccessibilitySnapshot).not.toContain('·');
  await expect(archive.getByRole('link', { name: 'Watch How do organisations succeed in accessibility?' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=RdvkjLFvvdE',
  );
  await expect(archive.getByRole('link', { name: 'Watch The EAA and E-Book Accessibility' })).toHaveAttribute(
    'href',
    'https://youtu.be/rPUTdbNkNGM?si=yKzb5HkchEudUPaU',
  );

  const enquiries = page.getByRole('region', { name: 'Invite me to speak' });
  await expect(enquiries.getByRole('link', { name: 'Email Sanna' })).toHaveAttribute('href', 'mailto:sanna@a11y.ing');
  await expect(enquiries.getByRole('link', { name: 'Connect on LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/sanna-kramsi/',
  );
});

test('Projects distinguishes available resources from the in-progress book', async ({ page }) => {
  await page.goto('/projects/');

  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toHaveCount(1);

  const resources = page.getByRole('region', { name: 'A11ying with Sanna projects' });
  await expect(resources.getByRole('article')).toHaveCount(4);
  await expect(resources.getByRole('heading', { level: 3 })).toHaveCount(4);
  await expect(resources.getByRole('link')).toHaveCount(4);
  await expect(resources.getByRole('link', { name: 'Explore I would if I could' })).toHaveAttribute('href', 'https://a11y.ing');
  await expect(resources.getByRole('link', { name: 'Explore Almost, but not quite' })).toHaveAttribute('href', 'https://wcag.a11y.ing');
  await expect(resources.getByRole('link', { name: 'Explore Accessibility Testing Lab' })).toHaveAttribute('href', 'https://testing.a11y.ing');
  await expect(resources.getByRole('link', { name: 'Explore A11ying with Sanna on YouTube' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/@A11yingWithSanna',
  );

  const otherProjects = page.getByRole('region', { name: 'Other projects' });
  await expect(otherProjects.getByRole('article')).toHaveCount(1);
  await expect(otherProjects).toContainText('In progress');
  await expect(otherProjects).toContainText('Finnish-language book');
  await expect(otherProjects.getByRole('link')).toHaveCount(0);
});

test('Minä presents Finnish principles and Nordic community participation', async ({ page }) => {
  await page.goto('/fi/mina/');

  await expect(page.getByRole('heading', { level: 1, name: 'Minä' })).toHaveCount(1);
  const principles = page.getByRole('region', { name: 'Näin ajattelen saavutettavuudesta' });
  await expect(principles.getByRole('article')).toHaveCount(3);
  await expect(principles.getByRole('heading', { level: 3 })).toHaveText([
    'Osa tuotteen laatua',
    'Ongelmien toistumisen ehkäiseminen',
    'Käytännöllistä ja helposti lähestyttävää',
  ]);
  await expect(page.getByRole('region', { name: 'Yhteisöt ja tiedon jakaminen' })).toContainText('Suomen ja Pohjoismaiden');
});

test('Esiintymiset localizes structure while preserving official talk titles', async ({ page }) => {
  await page.goto('/fi/esiintymiset/');

  await expect(page.getByRole('heading', { level: 1, name: 'Esiintymiset' })).toHaveCount(1);
  const topics = page.getByRole('region', { name: 'Aiheet, joista puhun' });
  await expect(topics.getByRole('article')).toHaveCount(3);
  await expect(topics.getByRole('heading', { level: 3, name: 'Ohjelmistokehitys, tiimit ja viestintä' })).toBeVisible();

  const upcoming = page.getByRole('region', { name: 'Tulevat esiintymiset' });
  await expect(upcoming.getByRole('article')).toHaveCount(3);
  await expect(upcoming.getByRole('heading', { level: 3 })).toHaveText([
    'Hidden Skills of Development: Practical Building Blocks for Team Health',
    'Who Owns Accessibility After a WordPress Site Launches?',
    'Decoding Collaboration: Hidden Skills for Diverse Workflows',
  ]);
  const drupalCon = upcoming.getByRole('article').first();
  await expect(drupalCon.getByRole('link', { name: 'Hidden Skills of Development: Practical Building Blocks for Team Health' })).toHaveAttribute(
    'href',
    'https://events.drupal.org/rotterdam2026/session/hidden-skills-development-practical-building-blocks-team-health',
  );
  await expect(drupalCon).toContainText('Yhdessä Mikaela Kindstedtin kanssa');
  const wordpressAccessibilityDay = upcoming.getByRole('article').nth(1);
  await expect(wordpressAccessibilityDay.getByRole('link', { name: 'Who Owns Accessibility After a WordPress Site Launches?' })).toHaveAttribute(
    'href',
    'https://wpaccessibility.day/2026/sessions/who-owns-accessibility-after-a-wordpress-site-launches/',
  );
  await expect(wordpressAccessibilityDay).toContainText('WordPress Accessibility Day 2026 · Verkossa');
  const wpSuomi = upcoming.getByRole('article').nth(2);
  await expect(wpSuomi.getByRole('link', { name: 'Decoding Collaboration: Hidden Skills for Diverse Workflows' })).toHaveAttribute(
    'href',
    'https://wpsuomi.fi/',
  );
  await expect(wpSuomi).toContainText('WP Suomi 2026 · Oulu');
  await expect(wpSuomi).toContainText('Yhdessä Mikaela Kindstedtin kanssa');

  const archive = page.getByRole('region', { name: 'Aiemmat esiintymiset' });
  await expect(archive.locator('time[datetime]')).toHaveCount(5);
  await expect(archive.locator('h4[lang="en"]')).toHaveCount(4);
  await expect(archive.getByRole('heading', { level: 4, name: '5 yleistä saavutettavuusvirhettä, joita kehittäjät tekevät' })).not.toHaveAttribute('lang', 'en');
  await expect(archive.getByRole('link', { name: 'Katso tallenne: How do organisations succeed in accessibility?' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=RdvkjLFvvdE',
  );
  await expect(archive.getByRole('link', { name: 'Katso tallenne: The EAA and E-Book Accessibility' })).toHaveAttribute(
    'href',
    'https://youtu.be/rPUTdbNkNGM?si=yKzb5HkchEudUPaU',
  );

  const enquiries = page.getByRole('region', { name: 'Kutsu minut puhujaksi' });
  await expect(enquiries.getByRole('link', { name: 'Lähetä sähköpostia' })).toHaveAttribute('href', 'mailto:sanna@a11y.ing');
  await expect(enquiries.getByRole('link', { name: 'Ota yhteyttä LinkedInissä' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/sanna-kramsi/',
  );
});

test('Projektit uses Finnish actions and the Finnish YouTube channel', async ({ page }) => {
  await page.goto('/fi/projektit/');

  await expect(page.getByRole('heading', { level: 1, name: 'Projektit' })).toHaveCount(1);
  const resources = page.getByRole('region', { name: 'A11ying with Sanna -projektit' });
  await expect(resources.getByRole('article')).toHaveCount(4);
  await expect(resources.getByRole('link')).toHaveCount(4);
  await expect(resources.getByRole('link', { name: 'Tutustu suomenkieliseen YouTube-kanavaan' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/@saavutettavuus',
  );

  const otherProjects = page.getByRole('region', { name: 'Muut projektit' });
  await expect(otherProjects).toContainText('Työn alla');
  await expect(otherProjects).toContainText('Suomenkielinen kirja');
  await expect(otherProjects.getByRole('link')).toHaveCount(0);

  await page.goto('/projects/');
  await expect(page.getByRole('link', { name: 'Explore A11ying with Sanna on YouTube' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/@A11yingWithSanna',
  );
});

test('@a11y profile pages have no detectable accessibility violations', async ({ page }) => {
  for (const path of ['/about/', '/speaking/', '/projects/', '/fi/mina/', '/fi/esiintymiset/', '/fi/projektit/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${path} accessibility violations`).toEqual([]);
  }
});

test('profile pages reflow at 320 CSS pixels without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });

  for (const path of ['/about/', '/speaking/', '/projects/', '/fi/mina/', '/fi/esiintymiset/', '/fi/projektit/']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${path} should not overflow`).toBe(true);
  }
});

test('profile-page actions are keyboard focusable', async ({ page }) => {
  await page.goto('/speaking/');
  const firstTalk = page.getByRole('link', { name: 'Hidden Skills of Development: Practical Building Blocks for Team Health' });
  await firstTalk.focus();
  await expect(firstTalk).toBeFocused();
  await expect(firstTalk).toHaveCSS('outline-style', 'solid');

  const email = page.getByRole('link', { name: 'Email Sanna' });
  await email.focus();
  await expect(email).toBeFocused();
  await expect(email).toHaveCSS('outline-style', 'solid');

  await page.goto('/projects/');
  const firstProject = page.getByRole('link', { name: 'Explore I would if I could' });
  await firstProject.focus();
  await expect(firstProject).toBeFocused();
  await expect(firstProject).toHaveCSS('outline-style', 'solid');

  await page.goto('/fi/esiintymiset/');
  const finnishEmail = page.getByRole('link', { name: 'Lähetä sähköpostia' });
  await finnishEmail.focus();
  await expect(finnishEmail).toBeFocused();

  await page.goto('/fi/projektit/');
  const finnishYouTube = page.getByRole('link', { name: 'Tutustu suomenkieliseen YouTube-kanavaan' });
  await finnishYouTube.focus();
  await expect(finnishYouTube).toBeFocused();
});

test('project link arrows move subtly on hover and respect reduced motion', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'Hover styling requires a hover-capable pointer.');

  await page.goto('/projects/');
  const projectLink = page.getByRole('link', { name: 'Explore I would if I could' });
  const arrow = projectLink.locator('.project-link-arrow');
  await expect(arrow).toHaveCSS('transform', 'none');
  await expect(arrow).toHaveCSS('transition-duration', '0.15s');
  await expect(arrow).toHaveCSS('transition-timing-function', 'ease-in-out');
  await projectLink.hover();
  await expect(arrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 2, 0)');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(0, 0);
  await expect(arrow).toHaveCSS('transform', 'none');
  await expect(arrow).toHaveCSS('transition-duration', '0s');
  await projectLink.hover();
  await expect(arrow).toHaveCSS('transform', 'none');
});
