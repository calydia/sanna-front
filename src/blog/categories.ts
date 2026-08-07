export type BlogCategoryGroup = 'professional' | 'personal';

export type BlogCategory = {
  key: BlogCategoryKey;
  drupalName: string;
  drupalCategoryId?: number;
  label: string;
  pathSegments: readonly string[];
  group: BlogCategoryGroup;
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
  },
  {
    key: 'projects',
    drupalName: 'Projects',
    drupalCategoryId: 71,
    label: 'Projects',
    pathSegments: ['projects'],
    group: 'professional',
  },
  {
    key: 'life',
    drupalName: 'Life',
    drupalCategoryId: 24,
    label: 'Life',
    pathSegments: ['personal', 'life'],
    group: 'personal',
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
