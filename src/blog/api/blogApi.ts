import type {
  BlogArticle,
  BlogArticleListing,
  BlogEditorialPage,
  BlogRssArticle,
} from '../interfaces/article.ts';

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type ArticleCapabilities = {
  fields: Set<string>;
  arguments: Set<string>;
};

type ArticleFieldSet = 'listing' | 'full' | 'rss';
type ArticleByFieldSet = {
  listing: BlogArticleListing;
  full: BlogArticle;
  rss: BlogRssArticle;
};

let articleCapabilitiesPromise: Promise<ArticleCapabilities> | undefined;

function getBlogApiUrl(): string {
  return import.meta.env?.BLOG_API_URL
    ?? process.env.BLOG_API_URL
    ?? 'https://drupal.ampere.corrupted.pw/graphql';
}

function requireRecord(value: unknown, context: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Malformed Drupal response: ${context} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function requireString(record: Record<string, unknown>, field: string, context: string): string {
  const value = record[field];
  if (typeof value !== 'string') {
    throw new Error(`Malformed Drupal response: ${context}.${field} must be a string.`);
  }
  return value;
}

function requireIdentifier(record: Record<string, unknown>, field: string, context: string): string {
  const value = record[field];
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Malformed Drupal response: ${context}.${field} must be a string or number.`);
  }
  return String(value);
}

function optionalBoolean(record: Record<string, unknown>, field: string): boolean | undefined {
  const value = record[field];
  return typeof value === 'boolean' ? value : undefined;
}

function requireBoolean(record: Record<string, unknown>, field: string, context: string): boolean {
  const value = record[field];
  if (typeof value !== 'boolean') {
    throw new Error(`Malformed Drupal response: ${context}.${field} must be a boolean.`);
  }
  return value;
}

function nullableString(record: Record<string, unknown>, field: string, context: string): string {
  const value = record[field];
  if (value !== null && typeof value !== 'string') {
    throw new Error(`Malformed Drupal response: ${context}.${field} must be a string or null.`);
  }
  return value ?? '';
}

function normalizeCommonArticle(record: Record<string, unknown>, context: string) {
  return {
    title: requireString(record, 'title', context),
    category: requireString(record, 'category', context),
    slug: requireString(record, 'slug', context),
    date: requireString(record, 'date', context),
    metaDescription: requireString(record, 'metaDescription', context),
    featuredCategoryPost: optionalBoolean(record, 'featuredCategoryPost'),
    secondaryCategories: record.secondaryCategories as BlogArticleListing['secondaryCategories'],
  };
}

export function normalizeArticle<F extends ArticleFieldSet>(
  value: unknown,
  fieldSet: F,
  index = 0,
): ArticleByFieldSet[F] {
  const context = `articles.items[${index}]`;
  const record = requireRecord(value, context);
  const common = normalizeCommonArticle(record, context);

  if (fieldSet === 'listing') {
    return {
      ...common,
      listingImage: requireString(record, 'listingImage', context),
    } as ArticleByFieldSet[F];
  }

  if (fieldSet === 'rss') {
    return {
      ...common,
      content: requireString(record, 'content', context),
    } as ArticleByFieldSet[F];
  }

  return {
    ...common,
    listingImage: requireString(record, 'listingImage', context),
    authorContent: requireString(record, 'authorContent', context),
    authorImage: requireString(record, 'authorImage', context),
    authorName: requireString(record, 'authorName', context),
    content: requireString(record, 'content', context),
    id: requireIdentifier(record, 'id', context),
    imageCredits: typeof record.imageCredits === 'string' || record.imageCredits === null
      ? record.imageCredits
      : undefined,
    published: requireBoolean(record, 'published', context),
    mainImage: requireString(record, 'mainImage', context),
    boxTitle: nullableString(record, 'boxTitle', context),
    boxContent: nullableString(record, 'boxContent', context),
  } as ArticleByFieldSet[F];
}

async function fetchGraphQL<T>(query: string): Promise<T> {
  const response = await fetch(getBlogApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Drupal GraphQL request failed with HTTP ${response.status}.`);
  }

  let json: GraphQLResponse<T>;
  try {
    json = await response.json() as GraphQLResponse<T>;
  } catch {
    throw new Error('Drupal GraphQL returned invalid JSON.');
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join('; '));
  }
  if (json.data === undefined) {
    throw new Error('Drupal GraphQL response did not contain data.');
  }

  return json.data;
}

async function getArticleCapabilities(): Promise<ArticleCapabilities> {
  articleCapabilitiesPromise ??= fetchGraphQL<{
    articleType: { fields: Array<{ name: string }> };
    queryType: { fields: Array<{ name: string; args: Array<{ name: string }> }> };
  }>(`
    query ArticleCapabilities {
      articleType: __type(name: "Article") {
        fields { name }
      }
      queryType: __type(name: "Query") {
        fields { name args { name } }
      }
    }
  `).then((data) => ({
    fields: new Set(data.articleType.fields.map((field) => field.name)),
    arguments: new Set(
      data.queryType.fields.find((field) => field.name === 'articles')?.args.map((argument) => argument.name) ?? [],
    ),
  }));

  return articleCapabilitiesPromise;
}

export async function fetchPageContent(pageId: number): Promise<{ page: BlogEditorialPage }> {
  return fetchGraphQL<{ page: BlogEditorialPage }>(`
    query GetBlogPage {
      page(id: ${pageId}) { title metaDescription content }
    }
  `);
}

export async function fetchArticles<F extends ArticleFieldSet>({
  limit,
  offset = 0,
  category,
  featuredOnly = false,
  fieldSet,
}: {
  limit: number;
  offset?: number;
  category?: number;
  featuredOnly?: boolean;
  fieldSet: F;
}): Promise<{ articles: { items: ArticleByFieldSet[F][] } }> {
  const capabilities = await getArticleCapabilities();
  if (featuredOnly && !capabilities.arguments.has('featuredOnly')) {
    return { articles: { items: [] } };
  }

  const secondaryCategoryField = capabilities.fields.has('secondaryCategories')
    ? '\n          secondaryCategories'
    : '';
  const featuredCategoryPostField = capabilities.fields.has('featuredCategoryPost')
    ? '\n          featuredCategoryPost'
    : '';
  const fieldsBySet = {
    listing: `title slug date listingImage metaDescription category${secondaryCategoryField}${featuredCategoryPostField}`,
    full: `title authorContent authorImage authorName category content date id imageCredits slug published mainImage listingImage metaDescription boxTitle boxContent${secondaryCategoryField}${featuredCategoryPostField}`,
    rss: `title slug date category metaDescription content${secondaryCategoryField}${featuredCategoryPostField}`,
  } as const;
  const categoryArgument = category === undefined ? '' : `, category: ${category}`;
  const offsetArgument = offset === 0 ? '' : `, offset: ${offset}`;
  const featuredOnlyArgument = featuredOnly ? ', featuredOnly: true' : '';

  const data = await fetchGraphQL<{ articles: { items: unknown[] } }>(`
    query GetArticles {
      articles(limit: ${limit}${categoryArgument}${offsetArgument}${featuredOnlyArgument}) {
        items { ${fieldsBySet[fieldSet]} }
      }
    }
  `);

  const articleContainer = requireRecord(data.articles, 'articles');
  if (!Array.isArray(articleContainer.items)) {
    throw new Error('Malformed Drupal response: articles.items must be an array.');
  }

  return {
    articles: {
      items: articleContainer.items.map((article, index) => normalizeArticle(article, fieldSet, index)),
    },
  };
}

export async function fetchAllArticles<F extends ArticleFieldSet>({
  category,
  fieldSet,
}: {
  category?: number;
  fieldSet: F;
}): Promise<{ articles: { items: ArticleByFieldSet[F][] } }> {
  const batchSize = 100;
  const items: ArticleByFieldSet[F][] = [];

  while (true) {
    const response = await fetchArticles({
      limit: batchSize,
      offset: items.length,
      category,
      fieldSet,
    });
    items.push(...response.articles.items);
    if (response.articles.items.length < batchSize) break;
  }

  return { articles: { items } };
}
