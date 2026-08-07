# Blog Integration Design

## Purpose

Integrate the existing `blog-astro` frontend into the `sanna` Astro application so that the personal site and blog share one deployment at `https://sanna.a11y.ing`. Drupal remains the sole backend for blog content.

This project prepares and verifies the combined application locally. Deployment timing and redirects from `blog.sanna.ninja` are separate responsibilities and are not part of the implementation.

## Scope

The integration will:

- move the existing blog frontend functionality into this repository;
- place every English blog route beneath `/blog/`;
- introduce the new professional and personal topic structure;
- retain Drupal's flat category taxonomy;
- give the main site and blog a shared outer shell;
- show blog topic navigation only within the blog;
- retain the existing blog's discovery features, accessibility behavior, and automated tests; and
- add a Finnish introduction at `/fi/blog/` that links to the English blog.

The initial migration will preserve the blog's current appearance and behavior where practical. Broader visual unification, deployment, old-domain redirects, and Finnish article translations are outside this project's scope.

## Application Architecture

There will be one Astro application deployed at `sanna.a11y.ing`.

A shared site shell will own branding, theme controls, the footer, metadata defaults, and the primary navigation. The English primary navigation will expose About, Speaking, Projects, and Blog. Blog topic links will not appear in this primary navigation.

Pages under `/blog/**` will use a blog-specific shell nested within the shared shell. It will add blog discovery and topic navigation while reusing the site's global structure. The blog menu will contain Accessibility, Technology, Speaking, Projects, and Personal. Personal subcategories will be exposed from the Personal landing page and relevant blog views.

Blog routes will be created directly under `src/pages/blog/`. The blog's current root-level routes will not be copied into the combined application and then relocated later.

## Drupal and Taxonomy Model

Drupal remains the source of article and editorial page content. Its categories remain flat: Accessibility, Tech, Life, Cats, Games, Speaking, and Projects. Speaking and Projects may initially contain no articles.

Personal is an Astro navigation and routing group rather than a required Drupal parent category. This avoids adding taxonomy levels solely to reproduce the website hierarchy.

A centralized category registry will define each Drupal category's:

- stable Drupal identifier and stored name;
- public display label;
- URL path segments;
- professional or personal grouping;
- archive description page identifier;
- featured-post configuration; and
- other category-specific discovery settings.

Routing must not be derived by lowercasing a Drupal display value. For example, Drupal's `Tech` category will map explicitly to the public `Technology` label and `/blog/technology/` URL. This allows editorial labels to change without accidentally changing canonical URLs.

Adding a future personal category should require adding one category-registry entry and its Drupal editorial content, rather than creating new routing logic throughout the application.

## Canonical Routes

The canonical category and article routes are:

| Drupal category | Public section | Archive path | Article path |
| --- | --- | --- | --- |
| Accessibility | Accessibility | `/blog/accessibility/` | `/blog/accessibility/{slug}/` |
| Tech | Technology | `/blog/technology/` | `/blog/technology/{slug}/` |
| Speaking | Speaking | `/blog/speaking/` | `/blog/speaking/{slug}/` |
| Projects | Projects | `/blog/projects/` | `/blog/projects/{slug}/` |
| Life | Personal / Life | `/blog/personal/life/` | `/blog/personal/life/{slug}/` |
| Cats | Personal / Cats | `/blog/personal/cats/` | `/blog/personal/cats/{slug}/` |
| Games | Personal / Games | `/blog/personal/games/` | `/blog/personal/games/{slug}/` |

`/blog/` is the overall blog homepage. `/blog/personal/` is a real landing page that combines and introduces the personal categories.

Archive pagination remains nested beneath its archive, for example `/blog/personal/cats/page/2/`. Cross-category tag archives live at `/blog/tags/{tag}/`, and the RSS feed lives at `/blog/rss.xml`.

The English blog has no mirrored `/fi/blog/**` route tree. `/fi/blog/` is a Finnish informational page explaining that the articles are in English and linking clearly to `/blog/`. It must not be declared as a translated equivalent of the English blog homepage through `hreflang`.

## Content and Link Flow

The Drupal API client is responsible for querying Drupal and returning normalized content data. It does not decide public URLs.

Route helpers accept a registered category and, where applicable, an article slug. They return canonical archive and article paths. Pages and components must use these helpers instead of assembling blog URLs themselves. Breadcrumbs, article cards, related posts, featured posts, tags, pagination, canonical metadata, RSS items, and sitemap entries must all use the same routing source of truth.

The existing blog interfaces, API client, archive discovery, featured-post selection, article table of contents, reading-time calculation, related posts, and tag utilities will move into focused blog-specific modules. Existing blog components will be adapted to the shared shell and new paths rather than recreated without need.

Blog assets and styles will move into clearly scoped locations. Any global-style conflicts must be reconciled explicitly so the imported blog does not unintentionally alter non-blog pages.

## Empty and Invalid Content States

Registered categories with no articles, including newly added Speaking or Projects categories, must still produce valid archive pages with a useful empty state.

Optional editorial content should degrade gracefully. In particular, a missing featured post should use the existing deterministic fallback behavior, and an absent optional category introduction must not prevent unrelated pages from building.

An article whose Drupal category is absent from the category registry is a configuration error. The production build must fail with an error that identifies the unknown category and affected article rather than silently generating an unintended URL or omitting the article.

Network failures and malformed required Drupal responses should continue to fail the build clearly. Automated browser tests will use the deterministic local Drupal fixture rather than the live API.

## Implementation Sequence

### 1. Foundation

Create the shared layout and navigation boundary, category registry, and route helpers. Add unit coverage for every registered category. Establish the English page-route and Finnish blog-introduction boundaries without attempting a broader redesign of unfinished pages.

### 2. Blog Integration

Move the Drupal client, interfaces, utilities, components, styles, assets, and routes from `blog-astro` into this repository. Adapt them directly to `/blog/**` and the shared shell while preserving current behavior.

### 3. Taxonomy and Discovery

Implement the professional archives, Personal landing page and nested archives, updated blog navigation, canonical article routes, tags, pagination, RSS, related posts, breadcrumbs, sitemap behavior, and category empty states.

### 4. Regression Verification

Port the blog's unit, accessibility, browser, and visual test infrastructure. Update fixture data and expectations for the combined route structure and shared shell.

## Verification

Verification will include:

- unit tests for category lookup and archive/article path generation;
- unit tests confirming that every configured Drupal category produces its specified canonical paths;
- unit tests for unknown-category failure behavior;
- production builds against the deterministic Drupal fixture;
- browser checks for the blog homepage, professional archives, Personal landing page, personal archives, pagination, tag archives, and representative articles;
- keyboard and automated accessibility checks for shared and blog navigation, breadcrumbs, archives, and articles;
- canonical URL, metadata, RSS, and sitemap assertions;
- link checks ensuring rendered internal links do not use `blog.sanna.ninja` or the former root-level blog paths; and
- reviewed visual baselines at desktop and mobile sizes in light and dark themes.

Existing tests should be preserved or adapted when they continue to express useful behavior. Visual snapshots will be updated only after the combined shell and expected route changes are reviewed.

## Migration Deliverable

The completed project is a locally verified combined application that can be deployed at a time chosen separately. It will also produce an explicit old-to-new URL mapping checklist for configuring redirects from `blog.sanna.ninja`; configuring or operating those redirects is not part of this implementation.
