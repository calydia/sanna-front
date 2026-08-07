import type { BlogArticleListing } from '../interfaces/article.ts';
import type { BlogCategory } from '../categories.ts';

function belongsToCategory(post: BlogArticleListing, category: BlogCategory): boolean {
  return post.category.trim().toLocaleLowerCase('en') === category.drupalName.toLocaleLowerCase('en');
}

export function getDrupalFeaturedCategoryPosts(
  posts: BlogArticleListing[],
  category: BlogCategory,
): BlogArticleListing[] {
  return posts.filter((post) => post.featuredCategoryPost === true && belongsToCategory(post, category));
}

function comparePostsNewestFirst(first: BlogArticleListing, second: BlogArticleListing): number {
  const firstTime = Date.parse(first.date);
  const secondTime = Date.parse(second.date);
  const firstValid = Number.isFinite(firstTime);
  const secondValid = Number.isFinite(secondTime);
  if (firstValid && secondValid && firstTime !== secondTime) return secondTime - firstTime;
  if (firstValid !== secondValid) return firstValid ? -1 : 1;
  return first.slug.localeCompare(second.slug);
}

export function resolveFeaturedCategoryPost(
  posts: BlogArticleListing[],
  category: BlogCategory,
  drupalSelectedPosts: BlogArticleListing[] = [],
): BlogArticleListing | undefined {
  const selectedPosts = [...drupalSelectedPosts].sort(comparePostsNewestFirst);
  if (selectedPosts.length > 1) {
    const [chosenPost, ...otherPosts] = selectedPosts;
    console.warn(
      `[category discovery] Multiple featured posts selected for “${category.label}”. `
      + `Using newest: “${chosenPost.title}”. Also selected: ${otherPosts.map((post) => `“${post.title}”`).join(', ')}.`,
    );
  }
  if (selectedPosts[0]) return selectedPosts[0];

  const configuredPost = category.featuredSlug
    ? posts.find((post) => post.slug === category.featuredSlug)
    : undefined;
  if (configuredPost) return configuredPost;

  return [...posts].filter((post) => belongsToCategory(post, category)).sort(comparePostsNewestFirst)[0];
}
