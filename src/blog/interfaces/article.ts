import type { SecondaryCategoriesValue } from './tag.ts';

export interface BlogArticleListing {
  title: string;
  category: string;
  slug: string;
  date: string;
  listingImage: string;
  metaDescription: string;
  featuredCategoryPost?: boolean;
  secondaryCategories?: SecondaryCategoriesValue;
}

export interface BlogArticle extends BlogArticleListing {
  authorContent: string;
  authorImage: string;
  authorName: string;
  content: string;
  id: string;
  imageCredits?: string | null;
  published: boolean;
  mainImage: string;
  boxTitle: string;
  boxContent: string;
}

export interface BlogRssArticle {
  title: string;
  category: string;
  slug: string;
  date: string;
  metaDescription: string;
  content: string;
  featuredCategoryPost?: boolean;
  secondaryCategories?: SecondaryCategoriesValue;
}

export interface BlogEditorialPage {
  title: string;
  metaDescription: string;
  content: string;
}
