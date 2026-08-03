# Astro 7 Upgrade Design

## Objective

Upgrade the site from Astro 6 to the latest stable Astro 7 release and refresh all direct dependencies to their latest mutually compatible stable versions. Preserve the site's content, layout, styling, accessibility behavior, routes, and static deployment behavior.

## Current State

The site is a static, bilingual Astro project using Tailwind CSS 4 through its Vite plugin, `@astrojs/sitemap`, `astro-icon`, Fontsource packages, and `astro:assets`. It has no server adapter, content collections, Markdown processing, framework islands, experimental Astro flags, or custom Vite internals.

The workspace already contains a modified `package-lock.json` and an untracked `public/sanna.jpg`. These are user-owned changes and must be preserved. Upgrade work must not discard or overwrite unrelated changes.

## Upgrade Approach

Perform a controlled manual dependency refresh rather than applying an opaque automated migration:

1. Determine the latest stable versions of every direct dependency.
2. Upgrade Astro to the latest 7.x release and refresh the other direct dependencies to mutually compatible stable releases.
3. Remove or revise the explicit Vite 7 override because Astro 7 uses Vite 8. Retain an override only if dependency resolution demonstrates that one is necessary.
4. Regenerate the npm lockfile while preserving the existing package manifest structure.
5. Make source or configuration changes only when required by verified Astro 7 compatibility or a demonstrated regression.

## Compatibility Review

Check the project specifically for Astro 7 migration risks:

- Vite 8 incompatibilities in `@tailwindcss/vite`, Astro integrations, and configuration.
- Markup rejected by Astro 7's stricter Rust compiler, including unclosed tags and malformed attributes.
- Inline-element text whose visible spacing changes under Astro 7's JSX-style whitespace handling.
- Changes to `astro:assets` image generation or output.
- Changes in Tailwind-generated CSS or Astro component style scoping.

No new Astro 7 features will be introduced as part of this upgrade.

## Verification

Run dependency installation, Astro's project checks where available, and a production build. Treat warnings and peer-dependency conflicts as findings to resolve or explicitly document.

Compare representative pages before and after the upgrade, covering:

- English and Finnish home pages.
- A representative service/content page.
- Desktop and mobile viewports.
- Light and dark themes.

Review screenshots and relevant computed layout behavior for unintended typography, spacing, wrapping, color, image, and responsive-layout changes. Apply focused style or markup fixes only where a regression is attributable to the upgrade.

## Success Criteria

- The project uses the latest stable Astro 7.x and refreshed compatible direct dependencies.
- The dependency tree installs without unresolved peer conflicts.
- The production build succeeds.
- Existing routes, sitemap configuration, language switching, theme behavior, and image rendering remain functional.
- Representative pages show no unintended visual changes across tested languages, viewports, and themes.
- Any required source or style changes are minimal and directly tied to compatibility or verified regressions.
- Pre-existing unrelated workspace changes remain intact.
