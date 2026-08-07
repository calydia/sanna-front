# Sanna Kramsi — A11ying with Sanna

Astro frontend for `https://sanna.a11y.ing`. The application combines Sanna's personal and professional pages with an English Drupal-backed blog under `/blog/`.

## Requirements

- Node.js 22.12.0 or newer
- npm
- Playwright Chromium for browser and visual tests

Install dependencies and the test browser:

```sh
npm install
npx playwright install chromium
```

## Development

```sh
npm run dev
```

Astro starts at `http://localhost:4321` by default. Blog pages query the configured Drupal GraphQL service at build time and during development.

Set `BLOG_API_URL` to use another Drupal GraphQL endpoint:

```sh
BLOG_API_URL=http://127.0.0.1:4010/graphql npm run dev
```

When `BLOG_API_URL` is absent, the application uses the production Drupal endpoint configured in `src/blog/api/blogApi.ts`.

## Blog architecture

- `src/blog/categories.ts` is the source of truth for Drupal category names, term IDs, public labels, grouping, and URL segments.
- `src/blog/routes.ts` generates canonical blog links.
- `src/blog/api/` contains the Drupal GraphQL client and response normalization.
- `src/blog/components/`, `src/blog/layouts/`, and `src/blog/utils/` contain blog-specific presentation and behavior.
- `src/pages/blog/` contains the static route tree.
- Drupal categories remain flat. Astro groups Life, Cats, and Games beneath the Personal section.

Blog components must use the shared route helpers rather than constructing category paths from Drupal labels.

## Builds and tests

| Command | Purpose |
| --- | --- |
| `npm run build` | Run strict Astro checks and create the production build |
| `npm run preview` | Preview the generated production build |
| `npm run test:unit` | Run category, routing, API-normalization, and utility tests |
| `npm run test:e2e` | Build against the deterministic Drupal fixture and run all browser tests |
| `npm run test:a11y` | Run the tagged axe and CSP accessibility checks |
| `npm run test:visual` | Compare responsive light/dark rendering with committed baselines |
| `npm run test:visual:update` | Replace visual baselines after an intentional reviewed change |

Browser tests start `tests/mock-server.mjs` on port 4010 and serve the production build on port 4322. They do not contact live Drupal. Visual baselines live under `tests/__screenshots__/` and should only be updated after inspecting the generated pages.

## Content behavior

- English blog content is available under `/blog/`.
- `/fi/blog/` introduces the blog in Finnish and links to the English section; it is not a translated blog archive.
- Speaking and Projects archives render valid empty states when Drupal has no articles in those terms.
- An article with an unregistered Drupal category fails the build with article context instead of receiving an accidental URL.

Deployment configuration and external redirects are managed separately from this repository work.
