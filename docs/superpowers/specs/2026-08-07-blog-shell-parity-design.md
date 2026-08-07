# Blog shell parity design

## Goal

Remove visible horizontal movement between blog and non-blog pages and bring the blog pager, footer, RSS control, and language navigation in line with the current production blog.

## Width stability

Reserve vertical-scrollbar space globally with `scrollbar-gutter: stable` on the document. This keeps centered header and page content from shifting horizontally when navigation changes between pages of different heights. The existing shared `max-w-6xl` content width remains unchanged.

## Pagination

Restyle the existing accessible pagination markup to match the production blog:

- The current page is a filled, rounded square with `aria-current="page"`.
- Other page links use a two-pixel outline, rounded corners, and a subtle background on hover.
- Previous and Next use the same outlined treatment with text and directional arrows.
- Existing minimum target sizes, `rel` attributes, route generation, keyboard focus treatment, light mode, and dark mode remain intact.

## Blog header RSS link

Add an RSS icon link to the shared header controls only for `/blog/` routes. It links to `/blog/rss.xml`, has the accessible name “RSS feed,” and uses the production blog's hover and focus treatment. The icon is decorative within the named link.

The RSS link appears before the language and theme controls. Because the controls remain right-aligned, adding it does not move the controls already at the right edge.

## Language navigation

The English blog has no Finnish translations. Therefore:

- On `/blog/`, show a link to `/fi/blog/` labelled “Tietoa blogista suomeksi.” This describes the destination as Finnish information about the blog rather than a translation of the current page.
- On all nested `/blog/` pages, omit the Finnish link.
- Outside the blog, retain the existing language-switcher behavior.
- The Finnish introduction continues to link to the English blog homepage and does not claim to be a translation.

## Blog footer

Replace the generic footer on `/blog/` routes with the production blog footer design:

- A functional “Back to top” control.
- An “About this site” navigation with “About me” and “RSS feed.”
- The existing light/dark A11ying logo treatment.
- An “A11ying sites” navigation linking to “I would if I could” and “Almost, but not quite.”
- The production background, top border, spacing, responsive layout, hover states, and focus states.

Non-blog pages keep the current shared footer. External links use the production destinations and safe relationship attributes.

## Component boundaries

- `SiteLayout` owns global scrollbar stability and selects the appropriate header controls and footer variant.
- A dedicated blog footer component owns blog-only footer markup and its back-to-top behavior.
- `BlogLayout` signals that the page belongs to the blog and whether it is the blog homepage.
- `LanguageSwitcher` supports the clearer homepage label without changing Finnish or non-blog behavior.
- `Pagination` retains routing logic and changes presentation only.

## Verification

Automated checks will cover:

- Stable scrollbar gutter and unchanged shared content width.
- RSS presence on blog routes and absence elsewhere.
- Finnish introduction link presence and label on `/blog/`, and absence from nested blog routes.
- Blog footer landmarks, destinations, and working Back to top control; generic footer remains outside `/blog/`.
- Pagination semantics, routes, current-page state, Previous/Next relationships, hover/focus styling, and minimum target sizes.
- Desktop and mobile visual snapshots plus accessibility checks.

