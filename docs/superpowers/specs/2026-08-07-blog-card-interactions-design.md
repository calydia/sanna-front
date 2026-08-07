# Blog card interactions and heading structure

## Scope

Improve the blog homepage heading hierarchy and align article-card, category-card, and browse-link interactions with the established behavior on the current blog. URL migration and redirect work are explicitly out of scope.

## Heading hierarchy

- Remove the “Professional topics” heading from the blog homepage.
- Render the professional category and Personal card titles at level two. These categories are the topic sections and do not need an additional grouping heading.
- Keep “Latest posts” at level two and render its article-card headings at level three.
- Let `PostGrid` accept the heading level required by its surrounding page. Homepage grids use level three; archive grids, whose cards sit beneath the page heading, continue to use level two.
- Present Personal in the same category-card grid so its heading and spacing match the professional category cards.

## Article cards

- Keep the post title as the card’s only link and stretch its clickable area across the whole card with CSS.
- Keep the link’s accessible name limited to the post title rather than wrapping all card content in an anchor.
- Remove the category link. Display the category as plain metadata.
- Do not underline the title in the default state.
- When any part of the card is hovered, show a two-pixel title underline with the same offset used by blog headings.
- Use the current blog’s keyboard focus treatment on the title link: a two-pixel black outline with a four-pixel offset in light mode and a white outline in dark mode.
- Retain the existing card shadow as additional hover and focus-within feedback.

## Category cards

- Keep the category title underlined by default with a two-pixel underline and the existing offset.
- Increase the underline thickness on card hover.
- Use the same two-pixel, four-pixel-offset light/dark focus outline as article-card links.
- Make the Personal gateway visually identical to the other category cards and place it in the same grid with the same gap.

## Browse-all link

- Remove its default underline.
- Add a two-pixel underline with the heading underline offset on hover.
- Preserve the existing bordered-button presentation and keyboard focus visibility.

## Implementation boundaries

- Make targeted changes in `PostGrid`, `CategoryCard`, and the blog homepage rather than adding a generic card abstraction.
- Allow `CategoryCard` to represent both Drupal-backed categories and the Personal gateway without changing routing or Drupal category data.
- Avoid page-specific duplicated card CSS.

## Verification

- Add or update browser assertions confirming that the homepage has no “Professional topics” heading, category cards use level two, and latest-post cards use level three.
- Verify article cards contain one post link and no category link.
- Verify the stretched-link and default, hover, and focus styling hooks.
- Run unit and browser suites, including accessibility checks.
- Update and inspect affected visual snapshots in light and dark themes at desktop and mobile widths.
