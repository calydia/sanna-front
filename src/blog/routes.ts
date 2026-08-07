import {
  getBlogCategoryByDrupalName,
  type BlogCategory,
} from './categories.ts';

export const BLOG_PATH = '/blog/';
export const PERSONAL_BLOG_PATH = '/blog/personal/';
export const BLOG_RSS_PATH = '/blog/rss.xml';

type CategoryInput = BlogCategory | string;

function resolveCategory(category: CategoryInput, articleReference?: string): BlogCategory {
  return typeof category === 'string'
    ? getBlogCategoryByDrupalName(category, articleReference)
    : category;
}

function normalizePathValue(value: string, description: string): string {
  const normalizedValue = value.trim().replace(/^\/+|\/+$/g, '');

  if (!normalizedValue) {
    throw new Error(`${description} cannot be empty.`);
  }

  return normalizedValue;
}

export function getBlogCategoryPath(category: CategoryInput): string {
  const resolvedCategory = resolveCategory(category);
  return `${BLOG_PATH}${resolvedCategory.pathSegments.join('/')}/`;
}

export function getBlogCategoryPagePath(category: CategoryInput, page: number): string {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error(`Blog archive page must be a positive integer; received “${page}”.`);
  }

  const categoryPath = getBlogCategoryPath(category);
  return page === 1 ? categoryPath : `${categoryPath}page/${page}/`;
}

export function getBlogArticlePath(
  category: CategoryInput,
  articleSlug: string,
  articleReference?: string,
): string {
  const resolvedCategory = resolveCategory(category, articleReference ?? articleSlug);
  const normalizedSlug = normalizePathValue(articleSlug, 'Blog article slug');
  return `${getBlogCategoryPath(resolvedCategory)}${normalizedSlug}/`;
}

export function getBlogTagPath(tagSlug: string): string {
  return `${BLOG_PATH}tags/${normalizePathValue(tagSlug, 'Blog tag slug')}/`;
}
