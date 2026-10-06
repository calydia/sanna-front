import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { gotoExistingPage } from './helpers.ts';

const profiles = {
  about: { label: 'English About', path: '/about/', language: 'en' },
  speaking: { label: 'English Speaking', path: '/speaking/', language: 'en' },
  projects: { label: 'English Projects', path: '/projects/', language: 'en' },
  minusta: { label: 'Finnish About', path: '/fi/minusta/', language: 'fi' },
  esiintymiset: { label: 'Finnish Speaking', path: '/fi/esiintymiset/', language: 'fi' },
  projektit: { label: 'Finnish Projects', path: '/fi/projektit/', language: 'fi' },
} as const;

type ProfilePage = (typeof profiles)[keyof typeof profiles];

async function gotoProfilePage(page: Page, profile: ProfilePage) {
  await gotoExistingPage(page, profile.path, { language: profile.language });
}

test('About presents Sanna’s principles and community participation', async ({ page }) => {
  await gotoProfilePage(page, profiles.about);

  await expect(page.getByRole('heading', { level: 1, name: 'About me' })).toBeVisible();

  const principles = page.getByRole('region', { name: 'How I think about accessibility' });
  await expect(principles.getByRole('article')).toHaveCount(3);
  await expect(principles.getByRole('heading', { level: 3 })).toHaveText([
    'Accessibility is part of quality',
    'Fixing individual issues is not enough',
    'Accessibility should be practical and approachable',
  ]);

  await expect(page.getByRole('region', { name: 'A11ying with Sanna' })).toBeVisible();
  const community = page.getByRole('region', { name: 'Communities and knowledge sharing' });
  await expect(community).toContainText('IAAP Nordic Committee');
  await expect(community).toContainText('W3C Nordic Accessibility Community Group');
  await expect(community).toContainText('Saavutettavuusverkosto');
});

test('Speaking exposes topics, upcoming appearances, archive metadata, and enquiries', async ({ page }) => {
  await gotoProfilePage(page, profiles.speaking);

  await expect(page.getByRole('heading', { level: 1, name: 'Speaking' })).toBeVisible();

  const topics = page.getByRole('region', { name: 'Topics I speak about' });
  await expect(topics.getByRole('article')).toHaveCount(3);
  const developmentTopic = topics.getByRole('article').filter({
    has: page.getByRole('heading', { level: 3, name: 'Software development, teams and communication' }),
  });
  await expect(developmentTopic).toContainText('Development practices');

  const upcoming = page.getByRole('region', { name: 'Upcoming talks' });
  await expect(upcoming.getByRole('article')).toHaveCount(2);
  await expect(upcoming.getByRole('heading', { level: 3 })).toHaveText([
    'Who Owns Accessibility After a WordPress Site Launches?',
    'Decoding Collaboration: Hidden Skills for Diverse Workflows',
  ]);

  const wordpressAccessibilityDay = upcoming.getByRole('article').filter({
    has: page.getByRole('heading', { level: 3, name: 'Who Owns Accessibility After a WordPress Site Launches?' }),
  });
  await expect(wordpressAccessibilityDay.getByRole('link')).toHaveAttribute(
    'href',
    'https://wpaccessibility.day/2026/sessions/who-owns-accessibility-after-a-wordpress-site-launches/',
  );
  await expect(wordpressAccessibilityDay).toContainText('WordPress Accessibility Day 2026 · Online');

  const wpSuomi = upcoming.getByRole('article').filter({
    has: page.getByRole('heading', { level: 3, name: 'Decoding Collaboration: Hidden Skills for Diverse Workflows' }),
  });
  await expect(wpSuomi.getByRole('link')).toHaveAttribute('href', 'https://wpsuomi.fi/');
  await expect(wpSuomi).toContainText('WP Suomi 2026 · Oulu');
  await expect(wpSuomi).toContainText('With Mikaela Kindstedt');

  const archive = page.getByRole('region', { name: 'Past talks' });
  await expect(archive.getByRole('heading', { level: 3 })).toHaveText(['2026', '2025']);
  await expect(archive.getByRole('heading', { level: 4 })).toHaveCount(6);
  await expect(archive.locator('time[datetime]')).toHaveCount(6);

  const drupalCon = archive.getByRole('listitem').filter({
    has: page.getByRole('heading', { level: 4, name: 'Hidden Skills of Development: Practical Building Blocks for Team Health' }),
  });
  await expect(drupalCon).toHaveCount(1);
  await expect(drupalCon.locator('time')).toHaveAttribute('datetime', '2026-09-30');
  await expect(drupalCon.locator('time')).toHaveText('30 September 2026');
  await expect(drupalCon).toContainText('DrupalCon Europe 2026 · Rotterdam · With Mikaela Kindstedt');
  await expect(drupalCon.getByRole('link')).toHaveCount(0);

  const archiveMetadataAccessibilitySnapshot = await drupalCon.locator('p').ariaSnapshot();
  expect(archiveMetadataAccessibilitySnapshot).toContain('time: 30 September 2026');
  expect(archiveMetadataAccessibilitySnapshot).toContain('text: DrupalCon Europe 2026 Rotterdam With Mikaela Kindstedt');
  expect(archiveMetadataAccessibilitySnapshot).not.toContain('·');

  await expect(archive.getByRole('link', { name: 'Watch recording of How do organisations succeed in accessibility?' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=RdvkjLFvvdE',
  );
  await expect(archive.getByRole('link', { name: 'Watch recording of The EAA and E-Book Accessibility' })).toHaveAttribute(
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

test('Projects exposes the available resources and the in-progress book', async ({ page }) => {
  await gotoProfilePage(page, profiles.projects);

  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();

  const resources = page.getByRole('region', { name: 'A11ying with Sanna projects' });
  await expect(resources.getByRole('article')).toHaveCount(4);
  await expect(resources.getByRole('heading', { level: 3 })).toHaveText([
    'I would if I could: a guide to web accessibility',
    'Almost, but not quite: a guide to accessibility requirements',
    'Accessibility Testing Lab',
    'A11ying with Sanna on YouTube',
  ]);

  for (const [name, href] of [
    ['Explore I would if I could', 'https://a11y.ing'],
    ['Explore Almost, but not quite', 'https://wcag.a11y.ing'],
    ['Explore Accessibility Testing Lab', 'https://testing.a11y.ing'],
    ['Explore A11ying with Sanna on YouTube', 'https://www.youtube.com/@A11yingWithSanna'],
  ] as const) {
    await expect(resources.getByRole('link', { name })).toHaveAttribute('href', href);
  }

  const otherProjects = page.getByRole('region', { name: 'Other projects' });
  await expect(otherProjects.getByRole('article')).toHaveCount(1);
  await expect(otherProjects).toContainText('In progress');
  await expect(otherProjects).toContainText('Finnish-language book');
  await expect(otherProjects.getByRole('link')).toHaveCount(0);
});

test('Minusta presents localized principles and community participation', async ({ page }) => {
  await gotoProfilePage(page, profiles.minusta);

  await expect(page.getByRole('heading', { level: 1, name: 'Minusta' })).toBeVisible();

  const principles = page.getByRole('region', { name: 'Miten näen saavutettavuuden' });
  await expect(principles.getByRole('article')).toHaveCount(3);
  await expect(principles.getByRole('heading', { level: 3 })).toHaveText([
    'Saavutettavuus on osa laatua',
    'Yksittäisten ongelmien korjaaminen ei riitä',
    'Saavutettavuuden pitää olla käytännöllistä ja ymmärrettävää',
  ]);

  await expect(page.getByRole('region', { name: 'A11ying with Sanna' })).toBeVisible();
  const community = page.getByRole('region', { name: 'Yhteisöt ja tiedon jakaminen' });
  await expect(community).toContainText('IAAP Nordic Committee');
  await expect(community).toContainText('W3C Nordic Accessibility Community Group');
  await expect(community).toContainText('Saavutettavuusverkostossa');
});

test('Esiintymiset localizes structure while preserving official talk titles', async ({ page }) => {
  await gotoProfilePage(page, profiles.esiintymiset);

  await expect(page.getByRole('heading', { level: 1, name: 'Esiintymiset' })).toBeVisible();

  const topics = page.getByRole('region', { name: 'Aiheet, joista puhun' });
  await expect(topics.getByRole('article')).toHaveCount(3);
  await expect(topics.getByRole('heading', { level: 3, name: 'Ohjelmistokehitys, tiimit ja viestintä' })).toBeVisible();

  const upcoming = page.getByRole('region', { name: 'Tulevat esiintymiset' });
  await expect(upcoming.getByRole('article')).toHaveCount(2);
  await expect(upcoming.getByRole('heading', { level: 3 })).toHaveText([
    'Who Owns Accessibility After a WordPress Site Launches?',
    'Decoding Collaboration: Hidden Skills for Diverse Workflows',
  ]);
  await expect(upcoming.locator('h3[lang="en"]')).toHaveCount(2);

  const wordpressAccessibilityDay = upcoming.getByRole('article').filter({
    has: page.getByRole('heading', { level: 3, name: 'Who Owns Accessibility After a WordPress Site Launches?' }),
  });
  await expect(wordpressAccessibilityDay.getByRole('link')).toHaveAttribute(
    'href',
    'https://wpaccessibility.day/2026/sessions/who-owns-accessibility-after-a-wordpress-site-launches/',
  );
  await expect(wordpressAccessibilityDay).toContainText('WordPress Accessibility Day 2026 · Verkossa');

  const wpSuomi = upcoming.getByRole('article').filter({
    has: page.getByRole('heading', { level: 3, name: 'Decoding Collaboration: Hidden Skills for Diverse Workflows' }),
  });
  await expect(wpSuomi.getByRole('link')).toHaveAttribute('href', 'https://wpsuomi.fi/');
  await expect(wpSuomi).toContainText('WP Suomi 2026 · Oulu');
  await expect(wpSuomi).toContainText('Yhdessä Mikaela Kindstedtin kanssa');

  const archive = page.getByRole('region', { name: 'Aiemmat esiintymiset' });
  await expect(archive.locator('time[datetime]')).toHaveCount(6);
  await expect(archive.locator('h4[lang="en"]')).toHaveCount(5);

  const drupalCon = archive.getByRole('listitem').filter({
    has: page.getByRole('heading', { level: 4, name: 'Hidden Skills of Development: Practical Building Blocks for Team Health' }),
  });
  await expect(drupalCon).toHaveCount(1);
  await expect(drupalCon.locator('time')).toHaveAttribute('datetime', '2026-09-30');
  await expect(drupalCon.locator('time')).toHaveText('30. syyskuuta 2026');
  await expect(drupalCon).toContainText('DrupalCon Europe 2026 · Rotterdam · Yhdessä Mikaela Kindstedtin kanssa');
  await expect(drupalCon.getByRole('link')).toHaveCount(0);

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

test('Projektit exposes localized actions and the Finnish YouTube channel', async ({ page }) => {
  await gotoProfilePage(page, profiles.projektit);

  await expect(page.getByRole('heading', { level: 1, name: 'Projektit' })).toBeVisible();

  const resources = page.getByRole('region', { name: 'A11ying with Sanna -projektit' });
  await expect(resources.getByRole('article')).toHaveCount(4);
  await expect(resources.getByRole('heading', { level: 3 })).toHaveText([
    'Toki, jos voisin: opas saavutettavuuteen',
    'Melkein, mutta ei ihan: opas saavutettavuuteen liittyviin vaatimuksiin',
    'Accessibility Testing Lab',
    'A11ying with Sanna YouTubessa',
  ]);

  for (const [name, href] of [
    ['Tutustu Toki, jos voisin -oppaaseen', 'https://a11y.ing/fi/'],
    ['Tutustu Melkein, mutta ei ihan -oppaaseen', 'https://wcag.a11y.ing/fi/'],
    ['Tutustu Accessibility Testing Labiin', 'https://testing.a11y.ing'],
    ['Tutustu YouTube-kanavaan', 'https://www.youtube.com/@saavutettavuus'],
  ] as const) {
    await expect(resources.getByRole('link', { name })).toHaveAttribute('href', href);
  }

  const otherProjects = page.getByRole('region', { name: 'Muut projektit' });
  await expect(otherProjects.getByRole('article')).toHaveCount(1);
  await expect(otherProjects).toContainText('Työn alla');
  await expect(otherProjects).toContainText('Suomenkielinen kirja');
  await expect(otherProjects.getByRole('link')).toHaveCount(0);
});

for (const profile of Object.values(profiles)) {
  test(`@a11y ${profile.label} has no detectable accessibility violations`, async ({ page }) => {
    await gotoProfilePage(page, profile);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test(`${profile.label} reflows at 320 CSS pixels without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await gotoProfilePage(page, profile);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}

for (const actionCase of [
  {
    label: 'upcoming talk',
    profile: profiles.speaking,
    name: 'Who Owns Accessibility After a WordPress Site Launches?',
  },
  { label: 'English speaking enquiry', profile: profiles.speaking, name: 'Email Sanna' },
  { label: 'English project', profile: profiles.projects, name: 'Explore I would if I could' },
  { label: 'Finnish speaking enquiry', profile: profiles.esiintymiset, name: 'Lähetä sähköpostia' },
  { label: 'Finnish YouTube project', profile: profiles.projektit, name: 'Tutustu YouTube-kanavaan' },
] as const) {
  test(`${actionCase.label} shows a visible focus indicator`, async ({ page }) => {
    await gotoProfilePage(page, actionCase.profile);
    const action = page.getByRole('link', { name: actionCase.name });
    await expect(action).toBeVisible();
    await action.focus();
    await expect(action).toBeFocused();
    await expect(action).toHaveCSS('outline-style', 'solid');
  });
}

test('project link arrows move subtly on hover and respect reduced motion', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'Hover styling requires a hover-capable pointer.');

  await gotoProfilePage(page, profiles.projects);
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
