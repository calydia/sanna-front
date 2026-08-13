# Keep reading typography hierarchy

## Goal

Make the Keep reading box's content headings and article links use normal font weight while preserving the final category link as the stronger action.

## Design

The “Start here in {category}” and “Related posts” headings will use font weight 400. The featured Start here article link and all Related posts links will also use font weight 400.

The “Browse {category} posts” link will remain bold at font weight 700. The uppercase “Keep reading” eyebrow label and all link colors, underlines, hover states, and focus states remain unchanged.

## Verification

Browser regression coverage will verify that both content headings and all article links in the box compute to font weight 400, while the Browse link computes to font weight 700.

## Scope

This change is limited to the Keep reading component and does not affect related-post cards elsewhere in the article or other blog headings and links.
