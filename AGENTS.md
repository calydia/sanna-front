# AGENTS.md

## Project

`sanna` is the Astro frontend for **Sanna Kramsi — A11ying with Sanna** at
`https://sanna.a11y.ing/`. It combines bilingual personal and professional pages
with an English editorial blog under `/blog/`.

The top-level site presents Sanna, speaking, projects, and connections to the
other A11ying sites. The blog covers accessibility, technology, speaking,
projects, and personal topics. `/fi/blog/` is a Finnish introduction linking to
the English blog; it is not a translated archive.

This site is closely related to the accessibility-site family through its
brand, authorship, and cross-links, but it has a distinct personal and editorial
purpose. Do not turn it into another accessibility reference hierarchy or copy
the information architecture of A11ying, WCAG, or Testing Lab.

The project uses Astro 7 and Node.js 22.12 or newer. Blog content is fetched
from Drupal GraphQL at build time and normalized into static routes.

## Related Repositories

Sibling repositories normally live under the same `projects` directory:

| Repository | Role |
| --- | --- |
| `../sanna` | This personal/professional site and English blog. |
| `../a11ying-front` | Broad bilingual accessibility education and reference site. |
| `../wcag-front` | Focused bilingual WCAG guide. |
| `../a11y-testing-astro` | English hands-on accessibility testing lab. |
| `../a11ying-ui` | Shared brand tokens for all sites and React design system for A11ying and WCAG. |

A11ying, WCAG, and Testing Lab are the closest content trio. Sanna connects and
contextualizes those projects while remaining an independently structured site.

This repository consumes only `a11ying-ui/tokens` from a tagged GitHub version.
Keep all Astro components, layouts, navigation, theme behavior, blog cards,
archives, pagination, and article presentation local. Do not import
`a11ying-ui/styles` or add React merely to reuse a small component. Share stable
brand primitives through tokens; visual similarity alone is not sufficient to
share an implementation.

## Commit and Push Authority

Agents may implement and verify changes in this repository, but must not commit
or push them. Leave all changes uncommitted for human review. Only the sibling
`a11ying-ui` repository permits agent commits and pushes as part of its approved
tagged-package release workflow.

## Information Architecture and Content Rules

- Preserve English and Finnish top-level routes and explicit language links.
- Keep the English blog beneath `/blog/`; do not generate a translated Finnish
  blog unless the product decision changes explicitly.
- Use `src/blog/categories.ts` as the source of truth for Drupal category names,
  term IDs, public labels, grouping, and URL segments.
- Use `src/blog/routes.ts` for canonical blog links rather than deriving paths
  directly from Drupal labels.
- Drupal categories remain flat. Astro groups Life, Cats, and Games beneath the
  Personal section for public navigation.
- Unknown Drupal categories must fail the build with article context rather
  than silently creating accidental URLs.
- Speaking and Projects archives must retain valid empty states when no Drupal
  posts belong to those terms.
- Preserve the blog's editorial identity, reading flow, discovery patterns,
  and typography even when it uses shared brand colors and fonts.

## Repository Map

- `src/pages/`: bilingual general-site pages and the static blog route tree.
- `src/layouts/SiteLayout.astro`: document shell, metadata, global theme, and
  shared token import.
- `src/components/`: local general-site navigation, language, theme, cards, and presentation.
- `src/blog/api/`: Drupal GraphQL client and response normalization.
- `src/blog/categories.ts`: blog taxonomy source of truth.
- `src/blog/routes.ts`: canonical blog route generation.
- `src/blog/components/`, `src/blog/layouts/`, and `src/blog/utils/`: editorial presentation and behavior.
- `src/i18n/`: bilingual interface strings and translation helpers.
- `tests/unit/`: category, routing, normalization, discovery, and utility coverage.
- `tests/e2e/`: functional, accessibility, CSP, responsive, and visual browser coverage.
- `tests/mock-server.mjs`: deterministic Drupal fixture server used by browser tests.

## Working Rules

- Preserve semantic HTML, keyboard behavior, visible focus, accessible names,
  correct document language, and meaningful localized link text.
- Check English and Finnish general pages when changing navigation, layout, or
  metadata. Check representative general and blog pages for shared-shell changes.
- Check light and dark themes plus desktop and mobile layouts for visual changes.
- Keep Astro responsible for server-rendered composition; no React integration
  is needed for current shared-package use.
- Keep Drupal failures visible and actionable. Do not silently fall back from
  malformed or unknown content.
- Preserve canonical URLs, alternate-language links, RSS, sitemap, social
  metadata, pagination, tag archives, and trailing-slash behavior.
- Treat `dist/`, `.astro/`, `test-results/`, and `playwright-report/` as generated output.
- Do not update visual snapshots until the rendered change has been inspected
  and confirmed intentional.

## Commands

Run commands from this repository root:

```bash
npm install
npm run dev
npm run build
npm run test:unit
npm run test:e2e
npm run test:a11y
npm run test:visual
```

Browser tests start the mock Drupal service on port 4010 and serve the built
site on port 4322. They must not contact live Drupal. Do not leave other servers
on those ports. Use the smallest relevant test while iterating and the broader
quality gates for shared-token, shell, navigation, or editorial-layout changes.

## Cross-Repository Changes

For an `a11ying-ui` token change:

1. Implement and verify the stable token contract in `a11ying-ui`.
2. Build, commit, tag, and push the package release there when approved.
3. Update the dependency and lockfile in every affected site.
4. Verify Sanna's typecheck, build, unit tests, and representative general/blog behavior.
5. Leave all Sanna changes uncommitted for human review.

