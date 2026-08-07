# Blog Migration Audit

Date: 2026-08-07

## Scope

This audit accounts for the frontend capabilities of the former `blog-astro` project after integrating them into the `sanna` Astro application. Deployment and external redirect configuration are intentionally excluded.

Drupal remains the blog content backend. The integrated application generates the blog beneath `/blog/` and uses a shared outer site shell.

## Capability Status

| Source capability | Integrated status |
| --- | --- |
| Drupal GraphQL page and article queries | Moved to `src/blog/api/blogApi.ts`, with typed normalization and clearer failure diagnostics |
| GraphQL capability detection | Preserved for optional secondary-category and featured-post fields |
| Flat Drupal categories | Preserved; frontend grouping and public paths are defined by `src/blog/categories.ts` |
| Blog homepage | Reimplemented under the shared shell with professional and Personal discovery |
| Category archives | Preserved for all existing categories and expanded with Speaking and Projects |
| Personal category hierarchy | Added in Astro without adding a Drupal taxonomy level |
| Article pages | Preserved with nested canonical paths, metadata, structured data, TOC, reading time, topics, image credits, author information, featured content, and related posts |
| Category and all-post pagination | Preserved beneath the integrated blog route tree |
| Tag archives and popular topics | Preserved beneath the integrated blog route tree |
| RSS feed | Preserved at `/blog/rss.xml` using canonical integrated article links |
| Featured-post selection | Preserved, including Drupal selection, duplicate warnings, configured fallback, and newest-post fallback |
| Main and topic navigation | Replaced by the shared primary navigation plus a blog-only topic navigation |
| Blog breadcrumbs | Reimplemented for professional and nested Personal hierarchies |
| Theme control | Replaced by the shared theme component; its script is bundled so strict CSP permits it |
| Skip link | Replaced by the shared localized skip link and `#main-content` target |
| Blog footer and logos | Replaced by the shared site footer and existing site assets |
| Blog-specific 404 | Replaced by a combined-site 404 page |
| Blog global stylesheet | Replaced by shared Tailwind styles plus styles scoped to `.blog-shell` |
| Blog favicons and manifest | Replaced by the combined site's favicon set and corrected shared manifest |
| Blog robots file | Replaced by a combined-site robots file pointing to the current sitemap |
| Quote and external-link image decorations | Intentionally omitted from the initial integration; semantic blockquote and link behavior remains |
| Standalone RSS icon and back-to-top icon | Intentionally omitted from the shared shell; the RSS feed remains discoverable through document metadata |
| Unit, browser, accessibility, CSP, and visual tests | Ported and expanded for the shared shell and nested route structure |

## Source File Accounting

The source layouts, header, footer, main navigation, skip link, theme control, breadcrumbs, article sidebar, archive cards, post cards, pagination, TOC, topic browsing, tag list, and related-post components were either consolidated into shared components or reimplemented as focused modules under `src/blog/`.

The source root-level category and article routes were intentionally not copied. The integrated route files were created directly beneath `src/pages/blog/` so there was no intermediate set of incorrect public paths.

The source interfaces were consolidated into `src/blog/interfaces/article.ts` and `src/blog/interfaces/tag.ts`. The source utility modules were retained by responsibility under `src/blog/utils/`, while public path decisions were removed from them and centralized in `src/blog/routes.ts`.

No source blog asset is required solely to preserve functionality. Article images continue to come from Drupal, and shared site imagery, icons, favicons, and branding replace duplicated blog assets.

## Verification Inventory

Automated coverage now includes:

- every registered category's archive and article paths;
- the Tech-to-Technology public mapping;
- the full Personal hierarchy;
- unknown-category failure diagnostics;
- Drupal response normalization and fixture integration;
- homepage, archive, empty-state, tag, pagination, RSS, and article behavior;
- primary navigation and blog-topic navigation boundaries;
- professional and Personal breadcrumbs;
- canonical metadata, BlogPosting structured data, RSS, and sitemap contents;
- absence of former-domain and former root-level blog links in rendered representative pages;
- keyboard skip-link and theme-toggle behavior;
- CSP console errors;
- automated WCAG A and AA checks; and
- desktop and mobile light/dark visual baselines for five representative blog pages.

## Remaining Work Outside This Migration

- Replace the minimal About, Speaking, and Projects page content when the other repository content is consolidated.
- Add optional Drupal editorial page content for Speaking and Projects if richer archive introductions are wanted.
- Configure deployment and any external infrastructure separately.

The standalone `blog-astro` repository is no longer required for the frontend capabilities listed above once the combined site is accepted and deployed.
