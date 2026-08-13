# Blog footer spacing and Keep reading link styling

## Goal

Make the space above the blog footer consistent on every blog page and make links in the article Keep reading box match the site's default link appearance.

## Footer spacing

The blog footer component will own the existing responsive top gap: 32px by default and 48px on medium and larger screens. This creates the same separation on the blog front page, article pages, paginated archive pages, and archive pages without pagination. Archive-section footer spacing will be removed, so the gap has one owner and does not vary with pagination.

The non-blog footer is outside this change.

## Keep reading links

All links in the Keep reading box will be underlined by default and inherit the blog shell's standard link colors: `#033573` in the light theme and `#ade5f8` in the dark theme. Existing hover and focus behavior will remain unchanged.

## Verification

Browser regression coverage will verify at least 32px between main content and the blog footer on representative front-page, article, paginated-archive, and non-paginated-archive routes. It will also verify the default underline and light/dark colors of Keep reading links. Existing focused and hovered link behavior must continue to pass.

## Scope

This change does not alter page content, pagination behavior, footer markup, non-blog layouts, or link hover/focus treatments.
