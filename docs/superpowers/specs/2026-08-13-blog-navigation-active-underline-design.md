# Blog navigation active underline

## Goal

Make the blog topic navigation's active link underline match the standard hover thickness at rest, then increase its emphasis when the active link itself is hovered.

## Design

Exact-current and ancestor-current blog topic links will use a two-pixel underline by default. This matches the underline used when an inactive blog link is hovered.

On hover-capable devices, hovering an active topic link will increase its underline to four pixels. Hovering inactive links will retain the existing two-pixel underline. Focus colors, outlines, text weights, and current-page semantics remain unchanged.

## Verification

Browser regression coverage will verify that both `aria-current="page"` and `aria-current="true"` links have a two-pixel underline by default and a four-pixel underline on hover. Existing inactive-state checks remain applicable.

## Scope

This change applies only to active links in `BlogTopicNavigation` and does not alter other blog links or the primary site navigation.
