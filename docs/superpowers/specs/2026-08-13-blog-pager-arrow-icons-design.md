# Blog pager arrow icons

## Goal

Match the category and all-post pager arrows to the icon and subtle motion treatment used by project links and the blog front page Browse all posts link.

## Design

The Next pager link will use the shared 24px `arrow-right` icon after its label. The Previous pager link will use the corresponding 24px `arrow-left` icon before its label. Both icons will be hidden from assistive technology, preserving the accessible link names “Next” and “Previous.”

Both directional links will use an eight-pixel gap between icon and label. On hover-capable devices, the Next icon will translate two pixels right and the Previous icon two pixels left over 150ms using `ease-in-out`.

With `prefers-reduced-motion: reduce`, neither icon will transition or move. Existing pager colors, borders, background hover treatment, focus treatment, destinations, relationship attributes, numeric links, and current-page indicator remain unchanged.

## Verification

Browser regression tests on a page with both controls will verify icon type and 24px dimensions, eight-pixel gaps, directional transforms on hover, accessible link names, and no movement or transition under reduced motion.

## Scope

This change applies to the shared `Pagination` component, covering category archives and the all-post archive. Numeric page links are outside the change.
