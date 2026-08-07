# Blog production style parity

## Scope

Bring the integrated `/blog/` section’s body theme, borders, interactive states, article-content links, table of contents, and article sidebar into visual and behavioral parity with the current production blog. The shared site header is intentionally excluded from this pass.

This specification supersedes the recent experimental card hover and focus decisions wherever they conflict with the production blog. URL migration and redirect work remain out of scope.

## Blog theme

- Apply the production blog’s solid background only to `/blog/` pages: `#fafafa` in light mode and `#010017` in dark mode.
- Leave non-blog pages on the existing site gradient.
- Do not redesign the shared header, primary navigation, or topic navigation in this pass.

## Borders and surfaces

- Use a reusable blog-scoped four-pixel gradient border for article cards, category cards, featured-discovery cards, Keep reading, and About the author.
- Match the production gradient: purple `#46037e`, royal blue `#4169e1`, and purple `#46037e` from left to right.
- Retain the production light and dark card fills already represented by `lt-blue-light` and `dk-purple`.
- Keep On this page visually distinct with its two-pixel code-box border and code-box background.
- Related-post cards below an article remain unboxed, matching production.

## Card interactions

- Use the production stretched-link pattern for article and category cards.
- When a stretched primary card link receives keyboard focus, draw a four-pixel outline around the entire card with a four-pixel offset: `#111` in light mode and white in dark mode.
- Suppress the inner primary link’s separate focus outline when the card-level outline is present.
- On hover, change linked card titles to light-theme purple or dark-theme pale blue and show a two-pixel underline with a four-pixel offset.
- Keep category-title underlines at two pixels on hover. Do not use the recently introduced four-pixel category-title hover underline.
- Preserve production motion and shadow feedback, including reduced-motion handling.
- Secondary links inside cards respond only to their own hover and focus states so separate destinations remain clear.

## Links, tags, and buttons

- Scope production blog link behavior to the blog shell so non-blog pages are unaffected.
- Ordinary blog links use the production hover color and two-pixel underline with a four-pixel offset.
- Focused ordinary links use the production outline and color treatment without relying on color alone.
- Article-content external links include the production external-link indicator. Internal, fragment, email, telephone, and already-specialized links do not receive it.
- Article and browse-topic tag links retain a thin default border and no default underline. Hover changes the border and text color and introduces the production underline.
- Blog action links styled as buttons use the production filled default state, transparent bordered hover state, transition, and focus outline.
- Pagination links use the same button interaction language while preserving their current-page semantics.

## Blog topic navigation

- Inactive topic links have no underline by default.
- Hover adds the production two-pixel underline with a four-pixel offset.
- Exact current destinations and ancestor topics on nested pages share the active visual treatment: purple in light mode or wheat in dark mode, with a persistent four-pixel underline.
- Hovering an active topic reduces its underline to two pixels, matching production.
- Continue using the shared route-state utility so nested Personal and professional article/category routes activate their owning topic without duplicating pathname logic.
- Preserve exact-page and ancestor-current semantics already exposed by the navigation component.
- Focus uses the production blog-link treatment.

## Article Keep reading box

- Keep the existing three-card Related posts section beneath the article body.
- Add a Keep reading box below About the author in the article sidebar.
- Populate it from data already available at build time:
  - “Start here in [category]” with the selected featured post when it is not the current article.
  - “Related posts” with up to two related text links, excluding the current article.
  - A final “Browse [category] posts” link.
- Preserve the intentional duplication between the main Related posts cards and the two compact related links in Keep reading, matching production.
- Omit an empty subsection without leaving an empty heading. The category browse link remains available.

## About the author

- Place About the author before Keep reading in the sidebar.
- Use the production gradient box, centered alignment, spacing, and text colors.
- Render “About the author” as the small uppercase kicker.
- Render the portrait at 120 by 120 pixels, circular and object-fitted, with a four-pixel purple border in light mode and pale-blue border in dark mode.
- Render the author name in the script/title font at the production size.
- Preserve Drupal author copy as rich text with production paragraph spacing.

## On this page

- Retain the current threshold of three article headings before showing the table of contents.
- Match the production two-pixel code border, code background, compact padding, and vertical spacing.
- Use a compact level-two heading and tighter list spacing.
- Table-of-contents links have no default underline and gain the production underline on hover.
- Focus follows the ordinary production blog-link treatment.

## Components and boundaries

- Add blog-scoped reusable classes in `BlogLayout` rather than importing the old compiled stylesheet.
- Allow `SiteLayout` to receive a narrowly scoped body appearance from `BlogLayout`; the default remains unchanged for all other pages.
- Update existing components rather than creating parallel production-only copies:
  - `PostGrid`
  - `CategoryCard`
  - `CategoryArchivePage`
  - `TagList`
  - `TopicBrowse`
  - `Pagination`
  - `ArticleToc`
  - `RelatedPosts`
- Extract article sidebar sections into focused components if doing so keeps the article route understandable and testable.
- Use existing featured-category and related-post selection utilities; do not add Drupal fields for this work.

## Verification

- Verify the solid body background is present on blog pages and absent from non-blog pages in both themes.
- Verify gradient-border values and card fills.
- Verify primary card focus moves the outline to the card and suppresses the inner outline.
- Verify card-title, secondary-link, tag, button, pagination, and article-content hover/focus states.
- Verify external article links receive an indicator and internal links do not.
- Verify About the author precedes Keep reading and matches the required structure.
- Verify Keep reading contains the available featured post, up to two related links, and the category browse link.
- Verify On this page structure and default, hover, and focus link states.
- Verify inactive, hovered, exact-current, and nested-ancestor blog topic navigation states.
- Run unit, production-build, browser, accessibility, and visual suites.
- Update and inspect affected light/dark desktop/mobile visual baselines.
