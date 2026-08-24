# Blog article landmark structure implementation plan

1. Add an explicitly flagged, opt-in custom page-structure slot to `SiteLayout`, preserving its existing default `main` wrapper for all non-article pages.
2. Add an article-layout mode to `BlogLayout` that renders full-width Blog topics and breadcrumb rows in normal flow, followed by a nested grid containing sibling main, aside, and related-content slots.
3. Recompose the article route through those slots, keeping both navigations and Related posts outside the main element.
4. Update browser coverage for landmark ancestry, document order, navigation-to-shell width matching, desktop article/sidebar alignment, full-width related-content placement, and constrained blog front-page/category-listing widths.
5. Run the build and focused desktop/mobile browser tests, then inspect representative light/dark renders without updating snapshots.
