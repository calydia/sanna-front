import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { fetchArticles } from '../../blog/api/blogApi.ts';
import { getBlogArticlePath } from '../../blog/routes.ts';
import { normalizeSecondaryCategories } from '../../blog/utils/tags.ts';

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET(context: APIContext) {
  const response = await fetchArticles({ limit: 50, fieldSet: 'rss' });
  return rss({
    title: 'Sanna Kramsi – Blog',
    description: 'Accessibility, technology, projects, speaking, and personal writing from Sanna Kramsi.',
    site: context.site!,
    items: response.articles.items.map((article) => ({
      title: article.title,
      pubDate: new Date(article.date),
      description: article.metaDescription,
      content: article.content,
      link: getBlogArticlePath(article.category, article.slug, article.title),
      customData: normalizeSecondaryCategories(article.secondaryCategories).map((tag) => `<category>${escapeXml(tag.label)}</category>`).join(''),
    })),
    customData: '<language>en</language>',
  });
}
