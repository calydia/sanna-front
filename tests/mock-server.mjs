import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const host = '127.0.0.1';
const port = 4010;
const imageUrl = `http://${host}:${port}/image.jpg`;

const pages = {
  1: { title: 'A peek into my life', metaDescription: 'A personal blog about accessibility, technology, life, cats, and games.', content: '<p>Thoughtful notes about accessibility, technology, and everyday life.</p>' },
  2: { title: 'Cats', metaDescription: 'Stories about cats.', content: '<p>Stories about the cats who make life interesting.</p>' },
  3: { title: 'Life', metaDescription: 'Writing about life and work.', content: '<p>Notes about work, recovery, and living well.</p>' },
  4: { title: 'Games', metaDescription: 'Personal game reviews.', content: '<p>Games that have stayed with me.</p>' },
  5: { title: 'Tech', metaDescription: 'Frontend and technology notes.', content: '<p>Notes from building things for the web.</p>' },
  6: { title: 'Accessibility', metaDescription: 'Practical digital accessibility guidance.', content: '<p>Practical guidance for making digital experiences work for more people.</p>' },
};

const baseArticle = {
  authorContent: '<p>Sanna writes about digital accessibility and inclusive frontend development.</p>',
  authorImage: imageUrl,
  authorName: 'Sanna Kramsi',
  boxTitle: '',
  boxContent: '',
  content: '<p>Accessible products begin with <a href="https://example.com/reference">clear guidance</a> and <a href="/blog/accessibility/">thoughtful testing</a>.</p><h2>Start with the fundamentals</h2><p>Use semantic HTML, visible focus styles, and meaningful labels.</p><h2>Test with people</h2><p>Include disabled people in research and testing.</p><h2>Keep improving</h2><p>Accessibility work continues after launch.</p>',
  date: '2026-06-15T09:00:00.000Z',
  id: '1',
  imageCredits: 'Test fixture image',
  listingImage: imageUrl,
  mainImage: imageUrl,
  metaDescription: 'A practical introduction to testing digital accessibility.',
  published: true,
  featuredCategoryPost: false,
  secondaryCategories: ['Accessibility', 'Accessibility Testing'],
};

const articles = [
  { ...baseArticle, id: '101', title: 'A practical guide to accessibility testing', slug: '/accessibility-testing-guide', category: 'Accessibility', imageCredits: null },
  { ...baseArticle, id: '102', title: 'How to create more accessible content', slug: '/how-to-create-more-accessible-content-avoid-common-accessibility-mistakes', category: 'Accessibility', date: '2026-05-10T09:00:00.000Z', featuredCategoryPost: true },
  { ...baseArticle, id: '103', title: 'Writing useful alternative text', slug: '/writing-useful-alternative-text', category: 'Accessibility', date: '2026-04-08T09:00:00.000Z', secondaryCategories: ['Accessibility', 'Alternative Text'] },
  { ...baseArticle, id: '201', title: 'Moving my accessibility site to Astro', slug: '/moving-my-accessibility-site-to-astro', category: 'Tech', date: '2026-03-12T09:00:00.000Z', secondaryCategories: ['Astro', 'Frontend'], featuredCategoryPost: true },
  { ...baseArticle, id: '301', title: 'Getting psychological safety back', slug: '/getting-psychological-safety-back', category: 'Life', date: '2026-02-10T09:00:00.000Z', secondaryCategories: ['Wellbeing'], featuredCategoryPost: true },
  { ...baseArticle, id: '401', title: 'Remembering Osiris', slug: '/remembering-osiris', category: 'Cats', date: '2026-01-15T09:00:00.000Z', secondaryCategories: ['Cats'], featuredCategoryPost: true },
  { ...baseArticle, id: '501', title: 'Little Kitty, Big City', slug: '/little-kitty-big-city-a-cat-lovers-dream', category: 'Games', date: '2025-12-20T09:00:00.000Z', secondaryCategories: ['Games'], featuredCategoryPost: true },
  ...Array.from({ length: 10 }, (_, index) => ({
    ...baseArticle,
    id: String(110 + index),
    title: `Accessibility archive post ${index + 1}`,
    slug: `/accessibility-archive-post-${index + 1}`,
    category: 'Accessibility',
    date: `2025-${String(11 - index).padStart(2, '0')}-01T09:00:00.000Z`,
    secondaryCategories: ['Accessibility'],
  })),
];

const categoryIds = {
  21: 'Accessibility',
  22: 'Cats',
  23: 'Games',
  24: 'Life',
  25: 'Tech',
  70: 'Speaking',
  71: 'Projects',
};

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function graphqlResponse(query) {
  if (query.includes('query ArticleCapabilities')) {
    return {
      data: {
        articleType: {
          fields: [
            'authorContent', 'authorImage', 'authorName', 'boxContent', 'boxTitle', 'category',
            'content', 'date', 'id', 'imageCredits', 'listingImage', 'mainImage', 'metaDescription',
            'featuredCategoryPost', 'published', 'secondaryCategories', 'slug', 'title',
          ].map((name) => ({ name })),
        },
        queryType: {
          fields: [{
            name: 'articles',
            args: ['offset', 'limit', 'category', 'featuredOnly'].map((name) => ({ name })),
          }],
        },
      },
    };
  }

  const pageMatch = query.match(/page\(id:\s*(\d+)\)/);
  if (pageMatch) {
    const page = pages[Number(pageMatch[1])];
    return page
      ? { data: { page } }
      : { errors: [{ message: `Unknown page fixture: ${pageMatch[1]}` }] };
  }

  if (query.includes('articles(')) {
    const categoryMatch = query.match(/category:\s*(\d+)/);
    const category = categoryMatch ? categoryIds[Number(categoryMatch[1])] : undefined;
    const categoryItems = category ? articles.filter((article) => article.category === category) : articles;
    const filteredItems = query.includes('featuredOnly: true')
      ? categoryItems.filter((article) => article.featuredCategoryPost)
      : categoryItems;
    const limit = Number(query.match(/articles\(limit:\s*(\d+)/)?.[1] ?? filteredItems.length);
    const offset = Number(query.match(/offset:\s*(\d+)/)?.[1] ?? 0);
    return { data: { articles: { items: filteredItems.slice(offset, offset + limit) } } };
  }

  process.stderr.write(`Unsupported GraphQL operation:\n${query}\n`);
  return { errors: [{ message: 'Unsupported GraphQL operation in test fixture' }] };
}

const server = createServer(async (request, response) => {
  if (request.url === '/health') {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.url === '/image.jpg') {
    const image = await readFile(new URL('../public/sanna-profile.jpg', import.meta.url));
    response.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=3600' });
    response.end(image);
    return;
  }

  if (request.url === '/graphql' && request.method === 'POST') {
    let body = '';
    for await (const chunk of request) body += chunk;

    try {
      const { query } = JSON.parse(body);
      json(response, 200, graphqlResponse(query));
    } catch (error) {
      json(response, 400, { errors: [{ message: error instanceof Error ? error.message : 'Invalid request' }] });
    }
    return;
  }

  process.stderr.write(`No fixture for ${request.method} ${request.url}\n`);
  json(response, 404, { errors: [{ message: `No fixture for ${request.method} ${request.url}` }] });
});

server.listen(port, host, () => {
  process.stdout.write(`Mock GraphQL server listening at http://${host}:${port}\n`);
});

function close() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', close);
process.on('SIGTERM', close);
