import { fetchAllArticles, fetchPageContent } from './api/blogApi.ts';
import type { BlogCategory } from './categories.ts';
import type { BlogArticleListing, BlogEditorialPage } from './interfaces/article.ts';

export type CategoryArchiveData = {
  category: BlogCategory;
  editorialPage: BlogEditorialPage;
  posts: BlogArticleListing[];
};

export async function fetchCategoryArchive(category: BlogCategory): Promise<CategoryArchiveData> {
  if (category.drupalCategoryId === undefined) {
    return {
      category,
      editorialPage: {
        title: category.label,
        metaDescription: category.description,
        content: `<p>${category.description}</p>`,
      },
      posts: [],
    };
  }

  const [postsResponse, pageResponse] = await Promise.all([
    fetchAllArticles({ category: category.drupalCategoryId, fieldSet: 'listing' }),
    category.archivePageId === undefined ? undefined : fetchPageContent(category.archivePageId),
  ]);

  return {
    category,
    editorialPage: pageResponse?.page ?? {
      title: category.label,
      metaDescription: category.description,
      content: `<p>${category.description}</p>`,
    },
    posts: postsResponse.articles.items,
  };
}
