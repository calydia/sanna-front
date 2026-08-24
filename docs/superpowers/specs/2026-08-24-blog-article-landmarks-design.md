# Blog article landmark structure

## Goal

Move the blog article sidebar out of the `main` landmark and place the related-posts section after it as a full-width peer, without changing the established desktop or mobile presentation of the article and sidebar.

## Structure

Blog article pages will opt into a custom page structure exposed through the shared layout. The rendered order will be:

1. The Blog topics navigation spanning the page layout.
2. The breadcrumb navigation spanning the page layout.
3. `<main id="main-content">` containing the article.
4. The author and Keep Reading `<aside>` as a sibling of `main`.
5. The Related posts `<section>` as a sibling after the aside.

The skip link will continue to target `#main-content`. Non-article blog pages and general site pages will continue using the existing default `SiteLayout` main wrapper.

## Visual layout

An article-specific, constrained shell will place the Blog topics and breadcrumb navigations in normal block flow as full-width rows. A nested content grid will then place `main` and the aside in the existing desktop columns: a flexible article column and a 280-pixel sidebar separated by the current gap. Related posts will span both columns below that row. This HTML structure makes navigation width independent of content-grid placement; no sidebar offset or compensating margin will be introduced.

At widths below the current large breakpoint, the grid will remain one column. Its visual and document order will be Blog topics, breadcrumbs, article, aside, then related posts.

The related-post cards will retain their existing component styling and responsive three-column behavior. The change does not alter article typography, sidebar content, shared navigation, theme behavior, or other blog layouts.

## Layout API

`SiteLayout` will gain a narrowly scoped, opt-in way to render caller-provided page landmark structure instead of its default `main` wrapper. `BlogLayout` will pass an explicit article-layout flag alongside the article-specific slots. The explicit flag ensures Astro's compile-time registration of the named slot cannot cause non-article blog pages to bypass the default constrained `main` wrapper.

The blog front page, category archives, post archives, and tag archives will retain the existing `max-w-6xl` main container. Only article routes will opt into the custom page structure.

The article route will own the composition of its article, sidebar, and related-posts regions. This keeps article-only semantics out of the general site shell.

## Verification

Automated browser coverage will verify that:

- the article is inside `main`;
- both Blog topics and breadcrumbs are outside `main` and precede it;
- both navigation landmarks match the width of the constrained article shell;
- the supporting aside is outside `main` and follows it;
- Related posts is outside `main`, follows the aside, and spans the full article grid;
- the sidebar begins level with the article content on desktop, below both navigation rows;
- existing author and Keep Reading content remains available;
- the blog front page and a representative category archive retain the default constrained main container.

The relevant article browser test and build will be run. Desktop/mobile and light/dark rendering will be inspected before any visual snapshots are changed; snapshot updates are not expected.
