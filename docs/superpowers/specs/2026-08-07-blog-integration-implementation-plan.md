# Blog Integration Implementation Plan

Date: 2026-08-07
Design: `2026-08-07-blog-integration-design.md`

## Goal

Move the `blog-astro` frontend into the `sanna` Astro application, preserve its Drupal-backed behavior, and publish its canonical routes beneath `/blog/` using the approved professional and personal taxonomy.

Deployment and redirects from `blog.sanna.ninja` are not part of this plan.

## Working Rules

- Treat `../blog-astro` as the source for existing blog behavior, not as a directory to copy wholesale.
- Implement and verify each phase in this repository before starting the next phase.
- Keep all routes and links behind shared route helpers; components must not concatenate category paths.
- Preserve useful tests from `blog-astro`, adapting their fixtures and expectations rather than replacing them without need.
- Do not update visual snapshots until the functional, type, and accessibility checks pass and the new shell has been reviewed.

## Phase 1: Test and Build Foundation

### Files

- Modify `package.json`
- Modify `package-lock.json`
- Modify `astro.config.mjs`
- Add `playwright.config.ts`
- Add `tests/mock-server.mjs`
- Add initial test helpers under `tests/`

### Work

1. Bring across the blog's Node engine requirement and the dependencies needed for Drupal queries, RSS generation, Astro type checking, unit tests, and Playwright accessibility checks.
2. Preserve the current site's Astro, Tailwind, sitemap, icon, and trailing-slash configuration while adding the blog's CSP and Markdown requirements where compatible.
3. Add scripts for `astro check`, unit tests, all browser tests, accessibility tests, visual tests, and visual-baseline updates.
4. Adapt the deterministic GraphQL fixture server so it can serve the combined application without contacting live Drupal.
5. Confirm the existing site builds before blog routes are introduced.

### Verification

- `npm run build`
- Start and stop the deterministic fixture server successfully.

## Phase 2: Category Registry and Route Helpers

### Files

- Add `src/blog/categories.ts`
- Add `src/blog/routes.ts`
- Add `tests/unit/blogRoutes.test.ts`
- Add or adapt blog article interfaces under `src/blog/interfaces/`

### Work

1. Define a typed category registry for Accessibility, Tech, Speaking, Projects, Life, Cats, and Games.
2. Store the stable Drupal name and identifier separately from the public label and route segments.
3. Represent professional and personal grouping explicitly. Personal is a frontend group and does not require a Drupal category.
4. Provide helpers for category archives, paginated archives, article URLs, tag archives, the blog homepage, the Personal landing page, and RSS.
5. Normalize Drupal article slugs at the route boundary so both leading-slash and plain slugs produce one canonical path.
6. Make unknown categories throw a diagnostic error containing the category value and, when supplied, the article title or slug.
7. Permit optional archive-introduction and featured-post configuration so empty new categories build before all Drupal editorial pages exist.

### Verification

- Test every approved archive and article path.
- Test Tech-to-Technology mapping.
- Test all Personal nested paths.
- Test pagination, tags, RSS, slug normalization, and unknown-category errors.

## Phase 3: Shared and Blog Shells

### Files

- Add a shared site layout under `src/layouts/`
- Add a blog layout under `src/blog/layouts/`
- Add or update shared header, footer, skip-link, theme, and navigation components
- Add blog topic navigation under `src/blog/components/`
- Update English pages under `src/pages/`
- Add `src/pages/fi/blog/index.astro`

### Work

1. Extract the current site's repeated page shell into a shared layout without changing the existing service-page content.
2. Implement the English primary navigation with About, Speaking, Projects, and Blog destinations.
3. Preserve the existing Finnish navigation behavior and add a Finnish blog introduction page that clearly labels the linked articles as English.
4. Create the nested blog shell and show its topic navigation only for `/blog/**` pages.
5. Ensure active-link and `aria-current` behavior works for parent sections and exact pages without marking multiple links incorrectly.
6. Keep language metadata accurate: `/fi/blog/` is an informational gateway, not the Finnish alternate of `/blog/`.

### Verification

- Build all pre-existing English and Finnish pages.
- Check keyboard access, skip-link behavior, visible focus, menu active states, and language-switch expectations.
- Confirm blog topic navigation is absent outside `/blog/**`.

## Phase 4: Drupal Data and Blog Modules

### Files

- Add `src/blog/api/blogApi.ts`
- Add blog interfaces under `src/blog/interfaces/`
- Add blog utilities under `src/blog/utils/`
- Add corresponding unit tests under `tests/unit/`

### Work

1. Move and adapt the GraphQL client and capability detection from `blog-astro`.
2. Keep `BLOG_API_URL` override support and the current live endpoint default.
3. Normalize fetched articles at the data boundary while leaving route resolution to the category registry.
4. Move reading-time, article-TOC, pagination, tags, category-discovery, related-post, and featured-post logic into blog-specific modules.
5. Replace direct category-to-path assumptions inside utilities with registry or route-helper calls.
6. Preserve deterministic featured-post fallbacks and server-side duplicate-selection warnings.
7. Ensure optional category editorial content can be absent while required malformed API responses fail clearly.

### Verification

- Port and run the existing unit tests for pagination and category discovery.
- Add normalization and failure-path coverage for Drupal data.
- Confirm the test fixture satisfies all GraphQL capability and content queries.

## Phase 5: Blog Routes and Components

### Files

- Add blog components under `src/blog/components/`
- Add blog-scoped styles under `src/blog/styles/`
- Add routes under `src/pages/blog/`
- Move required blog assets into `public/blog/` or an equivalently scoped location

### Work

1. Adapt the existing blog homepage to `/blog/`.
2. Generate the four professional archives and their pagination from registry entries.
3. Add `/blog/personal/` as a combined Personal landing page.
4. Generate Life, Cats, and Games archives and pagination beneath `/blog/personal/`.
5. Generate article routes from registered category path segments so every personal article includes the full nested hierarchy.
6. Move tag archives to `/blog/tags/{tag}/` and RSS to `/blog/rss.xml`.
7. Adapt breadcrumbs, post cards, related posts, featured recommendations, topic browsing, pagination, metadata, canonical links, and feed links to use route helpers.
8. Render a useful empty archive for registered categories with no posts.
9. Scope imported CSS and static assets so blog styles do not leak into main-site pages.
10. Preserve article semantics, table of contents, image credits, reading time, theme support, and accessible expanded-card behavior.

### Verification

- Build against fixture data containing at least one article in every existing category and empty Speaking and Projects categories.
- Confirm all approved routes render with trailing slashes.
- Confirm no rendered link points to `blog.sanna.ninja`, `/tech/`, `/life/`, `/cats/`, `/games/`, or another former root-level blog route.
- Validate the RSS document and canonical URLs.

## Phase 6: Browser, Accessibility, and Visual Regression Coverage

### Files

- Adapt tests from `../blog-astro/tests/e2e/`
- Expand `tests/e2e/pages.ts`
- Add combined-site link and navigation checks
- Add accepted snapshots under `tests/__screenshots__/`

### Work

1. Port the existing article, breadcrumb, card-link, pagination, accessibility, CSP, and visual behaviors.
2. Cover the blog homepage, a professional archive, Personal landing page, personal archive, tag archive, pagination page, professional article, and personal article.
3. Add checks for the main navigation/blog navigation boundary and correct `aria-current` values.
4. Crawl internal links in fixture-rendered pages and reject old-domain or former root-level blog paths.
5. Check canonical metadata, RSS discovery, sitemap inclusion, heading hierarchy, keyboard interaction, and light/dark rendering.
6. Capture desktop and mobile visual results for review, then update committed baselines only after acceptance.

### Verification

- `npm run test:unit`
- `npm run build`
- `npm run test:a11y`
- `npm run test:e2e`
- `npm run test:visual`

## Phase 7: Migration Inventory and Final Audit

### Files

- Add `docs/blog-url-mapping.md`
- Update `README.md`

### Work

1. Generate or document a complete mapping from every fixture/live Drupal article's old `blog.sanna.ninja` path to its new canonical path.
2. Include archive, pagination, tag, homepage, and RSS mappings needed for the separately managed redirect configuration.
3. Document local development, fixture-backed testing, live Drupal builds, required environment variables, and the new route model.
4. Compare source capabilities in `blog-astro` with the integrated application and account for every component, route, utility, asset, and test as moved, replaced, or intentionally obsolete.
5. Run the full verification suite and inspect the production output for unexpected routes.

### Completion Criteria

- All approved `/blog/**` routes build from Drupal fixture data.
- Existing blog functionality covered by tests remains operational.
- Professional and Personal navigation and canonical routes match the design.
- Empty registered categories render successfully, while unknown article categories fail clearly.
- Main-site English and Finnish pages continue to build and function.
- Internal links, canonical metadata, RSS, and sitemap output use `sanna.a11y.ing` paths.
- The redirect mapping document is complete, but no external redirects or deployment changes have been made.

## Known External Inputs

Drupal must eventually provide category IDs for Speaking and Projects. Until then, those registry entries can render empty archives without issuing category-specific article queries. Optional Drupal page IDs for their archive introductions can be added later without changing public routes.

The implementation should not block on deployment dates, DNS access, or continued ownership of `blog.sanna.ninja`.
