export type BlogCategoryGroup = 'professional' | 'personal';

export type BlogCategory = {
  key: BlogCategoryKey;
  drupalName: string;
  drupalCategoryId?: number;
  label: string;
  pathSegments: readonly string[];
  group: BlogCategoryGroup;
  description: string;
  archivePageId?: number;
  featuredSlug?: string;
  showPopularTopics?: boolean;
};

export type BlogCategoryKey =
  | 'accessibility'
  | 'technology'
  | 'speaking'
  | 'projects'
  | 'life'
  | 'cats'
  | 'games';

export const blogCategories: readonly BlogCategory[] = [
  {
    key: 'accessibility',
    drupalName: 'Accessibility',
    drupalCategoryId: 21,
    label: 'Accessibility',
    pathSegments: ['accessibility'],
    group: 'professional',
    description: 'Practical writing on digital accessibility, content quality, and the mistakes worth avoiding.',
    archivePageId: 6,
    featuredSlug: '/how-to-create-more-accessible-content-avoid-common-accessibility-mistakes',
    showPopularTopics: true,
  },
  {
    key: 'technology',
    drupalName: 'Tech',
    drupalCategoryId: 25,
    label: 'Technology',
    pathSegments: ['technology'],
    group: 'professional',
    description: 'Frontend, Astro, Drupal, and project notes from building and rebuilding things.',
    archivePageId: 5,
    featuredSlug: '/moving-my-accessibility-site-to-astro',
    showPopularTopics: true,
  },
  {
    key: 'speaking',
    drupalName: 'Speaking',
    drupalCategoryId: 70,
    label: 'Speaking',
    pathSegments: ['speaking'],
    group: 'professional',
    description: 'Talks, presentations, and lessons from speaking about accessibility and inclusive technology.',
  },
  {
    key: 'projects',
    drupalName: 'Projects',
    drupalCategoryId: 71,
    label: 'Projects',
    pathSegments: ['projects'],
    group: 'professional',
    description: 'Notes about accessibility resources and other projects I am building.',
  },
  {
    key: 'life',
    drupalName: 'Life',
    drupalCategoryId: 24,
    label: 'Life',
    pathSegments: ['personal', 'life'],
    group: 'personal',
    description: 'Work, recovery, communication, and the personal side of building a sustainable life.',
    archivePageId: 3,
    featuredSlug: '/getting-psychological-safety-back',
  },
  {
    key: 'cats',
    drupalName: 'Cats',
    drupalCategoryId: 22,
    label: 'Cats',
    pathSegments: ['personal', 'cats'],
    group: 'personal',
    description: 'Stories about the cats in my life, from affectionate chaos to the harder moments that stay with you.',
    archivePageId: 2,
    featuredSlug: '/remembering-osiris',
  },
  {
    key: 'games',
    drupalName: 'Games',
    drupalCategoryId: 23,
    label: 'Games',
    pathSegments: ['personal', 'games'],
    group: 'personal',
    description: 'Game impressions with a personal angle, usually focused on what made the experience memorable.',
    archivePageId: 4,
    featuredSlug: '/little-kitty-big-city-a-cat-lovers-dream',
  },
];

export function getBlogCategoryByKey(key: BlogCategoryKey): BlogCategory {
  const category = blogCategories.find((candidate) => candidate.key === key);

  if (!category) {
    throw new Error(`Blog category registry is missing the key “${key}”.`);
  }

  return category;
}

export function getBlogCategoryByDrupalName(
  drupalName: string,
  articleReference?: string,
): BlogCategory {
  const normalizedName = drupalName.trim().toLocaleLowerCase('en');
  const category = blogCategories.find(
    (candidate) => candidate.drupalName.toLocaleLowerCase('en') === normalizedName,
  );

  if (category) return category;

  const articleDetails = articleReference ? ` for article “${articleReference}”` : '';
  throw new Error(`Unknown Drupal blog category “${drupalName}”${articleDetails}. Add it to the blog category registry.`);
}

export function getBlogCategoriesByGroup(group: BlogCategoryGroup): BlogCategory[] {
  return blogCategories.filter((category) => category.group === group);
}
