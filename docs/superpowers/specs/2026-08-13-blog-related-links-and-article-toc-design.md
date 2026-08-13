# Blog related links and article TOC styling

## Goal

Match the intended production typography in the Keep reading box and the list/link presentation in the article “On this page” box.

## Keep reading

The “Related posts” heading will use normal font weight. Links listed under that heading will also use normal font weight.

The “Start here” heading and link remain unchanged. The “Browse {category} posts” link remains bold and otherwise unchanged.

## On this page

The existing semantic `<ul>` and `<li>` structure will remain. The list will display disc markers with standard indentation. Its links will use the established blog link colors (`#033573` in light mode and `#ade5f8` in dark mode) and a one-pixel underline by default.

Existing hover and focus colors, underline thickness, outlines, and other interaction behavior remain unchanged.

## Verification

Browser regression tests will verify normal weight for the Related posts heading and links, bold weight for the Browse link, list semantics and visible disc markers in the article TOC, and its default underline and light/dark link colors. Existing hover and focus tests will continue to cover interaction behavior.

## Scope

This change is limited to `KeepReading` and `ArticleToc`. It does not change related-post cards outside the Keep reading box, article body lists, or global blog styles.
