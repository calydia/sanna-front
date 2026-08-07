import type { BlogTag, SecondaryCategoriesValue } from '../interfaces/tag.ts';

const SLUG_OVERRIDES: Record<string, string> = {};

function slugifyTag(label: string): string {
  return label.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/&/g, ' and ').replace(/[^a-z0-9\s-]/g, ' ').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-');
}

function getTagLabel(tag: string | { name?: string | null; title?: string | null } | null): string | null {
  if (!tag) return null;
  if (typeof tag === 'string') return tag.trim() || null;
  return (tag.name ?? tag.title ?? null)?.trim() || null;
}

export function normalizeSecondaryCategories(secondaryCategories: SecondaryCategoriesValue): BlogTag[] {
  const values = Array.isArray(secondaryCategories)
    ? secondaryCategories
    : secondaryCategories ? [secondaryCategories] : [];
  const uniqueTags = new Map<string, BlogTag>();

  values.forEach((tag) => {
    const label = getTagLabel(tag);
    if (!label) return;
    const slug = SLUG_OVERRIDES[label.toLowerCase()] ?? slugifyTag(label);
    if (slug) uniqueTags.set(slug, { label, slug });
  });

  return Array.from(uniqueTags.values()).sort((first, second) => first.label.localeCompare(second.label));
}

export function getSharedTagCount(firstTags: SecondaryCategoriesValue, secondTags: SecondaryCategoriesValue): number {
  const firstSlugs = new Set(normalizeSecondaryCategories(firstTags).map((tag) => tag.slug));
  return normalizeSecondaryCategories(secondTags).filter((tag) => firstSlugs.has(tag.slug)).length;
}

export function getRelatedPosts<T extends {
  slug: string;
  category: string;
  date: string;
  secondaryCategories?: SecondaryCategoriesValue;
}>(currentPost: T, allPosts: T[], limit = 3): T[] {
  const candidates = allPosts.filter((post) => post.slug !== currentPost.slug).map((post) => ({
    post,
    sharedTagCount: getSharedTagCount(currentPost.secondaryCategories, post.secondaryCategories),
    sameCategory: post.category === currentPost.category,
    timestamp: Date.parse(post.date),
  })).sort((first, second) =>
    second.sharedTagCount - first.sharedTagCount
    || Number(second.sameCategory) - Number(first.sameCategory)
    || second.timestamp - first.timestamp,
  );
  const preferred = candidates
    .filter((candidate) => candidate.sharedTagCount > 0 || candidate.sameCategory)
    .map((candidate) => candidate.post);
  if (preferred.length >= limit) return preferred.slice(0, limit);

  const usedSlugs = new Set(preferred.map((post) => post.slug));
  const fallback = candidates.map((candidate) => candidate.post).filter((post) => !usedSlugs.has(post.slug));
  return [...preferred, ...fallback].slice(0, limit);
}

export function getPopularTags<T extends { secondaryCategories?: SecondaryCategoriesValue }>(
  posts: T[],
  { limit = 8, minCount = 2 }: { limit?: number; minCount?: number } = {},
): BlogTag[] {
  const counts = new Map<string, { tag: BlogTag; count: number }>();
  posts.forEach((post) => {
    const uniqueTags = new Map(normalizeSecondaryCategories(post.secondaryCategories).map((tag) => [tag.slug, tag]));
    uniqueTags.forEach((tag, slug) => counts.set(slug, { tag, count: (counts.get(slug)?.count ?? 0) + 1 }));
  });
  return Array.from(counts.values()).filter((entry) => entry.count >= minCount)
    .sort((first, second) => second.count - first.count || first.tag.label.localeCompare(second.tag.label))
    .slice(0, limit).map((entry) => entry.tag);
}
