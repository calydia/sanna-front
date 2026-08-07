# About, Speaking, and Projects Layout Implementation Plan

Date: 2026-08-07  
Design: `2026-08-07-about-speaking-projects-layout-design.md`

## Goal

Implement the approved English About, Speaking, and Projects layouts while preserving the shared shell, bilingual navigation, current visual identity, dark mode, and accessible semantics.

## Working rules

- Preserve unrelated changes already present in the worktree. In particular, do not restore, edit, or stage the service-page removals and navigation work unless separately requested.
- Implement only the English `/about/`, `/speaking/`, and `/projects/` pages. The Finnish counterparts remain out of scope.
- Derive all new page copy from the approved design and existing content. Do not introduce tags, credentials, statistics, images, client logos, or a book link.
- Build repeated talk and card content from structured data rather than manual `<br>` elements.
- Add functional and accessibility assertions before accepting visual baselines.
- Do not update unrelated blog snapshots.

## Known baseline condition

At planning time, `npm run build` fails because `src/pages/services/index.astro` imports the deleted `src/components/Service.astro`. That failure belongs to existing worktree changes outside this feature. Record it as a baseline blocker and do not repair it as part of these page layouts. Run targeted browser checks during implementation; run the full build after the owner resolves or authorizes resolution of the service-page state.

## Task 1: Add page-specific browser coverage

### Files

- Add `tests/e2e/profile-pages.spec.ts`
- Modify `tests/e2e/pages.ts`

### Work

1. Add `/about/`, `/speaking/`, and `/projects/` to the representative-page registry without changing the existing blog entries.
2. Add failing semantic tests for the approved structure:
   - Each page has exactly one `h1` with the expected title.
   - About exposes one `How I think about accessibility` section, three principle articles, and separate `A11ying with Sanna` and `Community and knowledge sharing` sections.
   - The About community section contains `Finland and the Nordic region`.
   - Speaking exposes three topic articles, two upcoming-talk articles, a `Past talks` archive grouped under 2026 and 2025, and a distinct speaking-enquiry region.
   - The third speaking topic is named `Software development, teams and communication` and its description includes development practices.
   - Projects exposes four actionable A11ying resource cards and one non-actionable in-progress book feature.
3. Assert link destinations and accessible names:
   - Four project actions point to their existing external destinations.
   - Email uses `mailto:sanna@a11y.ing`.
   - LinkedIn retains its existing profile URL.
   - The two recording links point to their current YouTube URLs and have talk-specific accessible names.
   - The book feature contains no link.
4. Assert page-level heading order. Principle, project, and upcoming-talk titles are `h3` beneath their `h2` section headings. Past-talk years are `h3` and their talk titles are `h4`.
5. Add Axe coverage for all three English routes using the existing `@a11y` convention.

### Verification

- Run the new test file and confirm it fails for the current markup for the expected structural reasons.
- Confirm no failure is caused by the mock Drupal fixture or blog routes.

## Task 2: Implement the About hierarchy

### Files

- Add `src/components/PrincipleCard.astro`
- Modify `src/pages/about/index.astro`

### Work

1. Remove the unused `IntroPage` import from the About page.
2. Keep the existing `Card` page wrapper, metadata, language alternates, breadcrumb, and single introductory surface.
3. Keep the introduction concise: retain Sanna's role, location, and four accessibility perspectives in the opening surface. Move the software-development reasoning into the principles section rather than repeating it in the introduction.
4. Implement `PrincipleCard.astro` with required `title` and `description` props. It renders an `article`, an `h3`, and body text. It owns only the repeated principle-card presentation.
5. Add a semantic section labelled by the `How I think about accessibility` `h2`, containing a three-column desktop grid and one-column mobile stack:
   - Part of product quality
   - Prevent problems returning
   - Practical and approachable
6. Add a two-column closing row containing two independent sections with `h2` headings:
   - `A11ying with Sanna`, preserving the existing explanation of the work and name.
   - `Community and knowledge sharing`, preserving the full current statement about conferences, resources, and participation in Finnish and Nordic accessibility communities.
7. Use the existing surface colors, borders, radii, shadows, and dark-mode classes. Do not add a portrait or navigation-link panel.

### Verification

- Run About assertions from `tests/e2e/profile-pages.spec.ts`.
- At 390 px and 1440 px, confirm the order is introduction, principles, A11ying with Sanna, community.
- Check that text resize and narrow reflow produce no horizontal overflow.

## Task 3: Implement structured Speaking components

### Files

- Add `src/components/TalkCard.astro`
- Add `src/components/TalkArchiveRow.astro`
- Modify `src/pages/speaking/index.astro`

### Work

1. Replace the temporary IntroPage description with the durable approved introduction covering accessibility, inclusive design, accessible frontend development, and maintaining accessibility over time.
2. Represent the three speaking topics as structured page data and render them as three `article` elements in a responsive grid. Use these approved headings:
   - Accessibility in practice
   - Accessibility beyond compliance
   - Software development, teams and communication
3. Include development practices, cognitive diversity, communication, psychological safety, and sustainable teamwork in the third topic description.
4. Implement `TalkCard.astro` with required `title`, `event`, `location`, and `description` props. Render an `article` with an `h3`, one metadata line, and one description paragraph.
5. Represent upcoming talks as an array and render two TalkCard instances. Correct the apparent description reversal:
   - `Hidden Skills of Development: Practical Building Blocks for Team Health` receives the team-health and communication description.
   - `Who Owns Accessibility After a WordPress Site Launches?` receives the ownership, content, plugins, and ongoing-development description.
6. Implement `TalkArchiveRow.astro` with required `title`, `date`, and `event` props and optional `location`, `collaborator`, `role`, `recordingUrl`, and `recordingLabel` props. It renders one semantic list item, an `h4`, a `<time datetime="YYYY-MM-DD">`, compact metadata, and an optional recording link.
7. Group past-talk arrays by year and render each year as an `h3` followed by a list of TalkArchiveRow instances. The fixed `h4` talk titles preserve the hierarchy beneath each year.
8. Normalize the existing past-talk content:
   - Fix `5 yleistäsaavutettavuusvirhettä` to `5 yleistä saavutettavuusvirhettä`.
   - Remove dangling `View:` text.
   - Preserve Mikaela Kindstedt and Mari Leipola collaborator information.
   - Preserve panel-speaker and host/interviewer roles in concise wording.
   - Keep the two existing YouTube recording URLs.
9. Move speaking enquiries into a separate complementary or labelled section after the talk content. Include clearly named email and LinkedIn actions using the existing destinations.
10. Make topics and upcoming talks multi-column on wider screens and single-column on narrow screens. Keep the past-talk archive visually compact.

### Verification

- Run Speaking assertions from `tests/e2e/profile-pages.spec.ts`.
- Confirm each date is exposed through a valid `datetime` value.
- Keyboard-test email, LinkedIn, and both recording links.
- Check that long Finnish and English talk titles wrap without overlap at 320 px.

## Task 4: Refine Project components and page hierarchy

### Files

- Modify `src/components/Project.astro`
- Add `src/components/InProgressProject.astro`
- Modify `src/pages/projects/index.astro`

### Work

1. Replace the migration placeholder in IntroPage with the approved visitor-focused introduction: the page collects accessibility resources, learning materials, and other projects that help people understand, test, and improve digital accessibility.
2. Keep the existing `A11ying with Sanna projects` section and concise explanation.
3. Update `Project.astro` so its card title uses `h3` beneath the page's `h2`. Add explicit TypeScript props for `title`, `description`, `buttonLink`, and `buttonText`.
4. Preserve the four existing resource destinations and the current flex layout that aligns actions at the bottom. Tighten descriptions only where specified in the approved mockup; do not erase audience or language information.
5. Ensure external project actions use the site's established external-link treatment and retain visible keyboard focus. Do not add `target="_blank"` unless the site already applies that convention consistently.
6. Implement `InProgressProject.astro` with required `title`, `status`, `language`, and description content. Render a full-width non-interactive `article` with visible text labels `In progress` and `Finnish-language book`.
7. Replace the half-width book card with the InProgressProject component. It must contain no anchor or button.
8. Retain the two-column desktop and one-column mobile resource grid. Make the book status and description a two-part desktop layout that stacks status before content on mobile.

### Verification

- Run Projects assertions from `tests/e2e/profile-pages.spec.ts`.
- Confirm the project section has exactly four links and the book section has none.
- Keyboard-test every project action and verify visible focus in light and dark modes.
- Confirm action alignment remains consistent when descriptions wrap to different heights.

## Task 5: Add visual and responsive regression coverage

### Files

- Modify `tests/e2e/visual.spec.ts`
- Add approved snapshots under `tests/__screenshots__/` only after review

### Work

1. Add About, Speaking, and Projects to targeted light- and dark-mode visual coverage at the repository's existing desktop and mobile viewports.
2. Keep snapshot names page-specific so changes do not overwrite blog baselines.
3. Capture screenshots only after semantic, interaction, and Axe assertions pass.
4. Review these high-risk areas before accepting snapshots:
   - About's three-to-one and two-to-one column transitions.
   - Speaking's long titles, year groups, metadata wrapping, and enquiry placement.
   - Project card action alignment and the full-width book feature.
   - Footer spacing on pages of different heights.
5. Update only the six page-specific light/dark baselines that are added by this work.

### Verification

- `npm run test:a11y -- tests/e2e/profile-pages.spec.ts`
- `npm run test:e2e -- tests/e2e/profile-pages.spec.ts`
- `npm run test:visual`

## Task 6: Final integration verification

### Files

- No planned source files beyond those listed above

### Work

1. Inspect `git diff` and verify no Finnish page, service page, global navigation component, blog component, or unrelated user change was modified.
2. Run unit tests to ensure shared route and blog utilities remain unaffected.
3. Run the targeted profile-page browser tests and the existing shared-shell tests.
4. Run the full build only if the pre-existing missing-Service blocker has been resolved outside this task. If it remains, report the exact existing error and do not expand scope to fix it.
5. Run the full E2E and visual suites when the application can build and serve normally.

### Verification commands

- `npm run test:unit`
- `npx playwright test tests/e2e/profile-pages.spec.ts tests/e2e/shell.spec.ts`
- `npm run build` (subject to the recorded baseline blocker)
- `npm run test:e2e`
- `npm run test:visual`

## Completion criteria

- About communicates Sanna's working principles and retains explicit Finnish and Nordic community participation.
- Speaking presents topics, upcoming appearances, past-talk metadata, roles, collaborators, and recordings in a consistent semantic structure.
- The software-development topic explicitly includes development practices.
- Projects retains four clear resource destinations and presents the unfinished Finnish book as intentionally non-actionable.
- All three pages reflow without horizontal scrolling at 320 CSS pixels and remain usable at 200% zoom.
- The pages have one `h1`, logical section headings, visible focus, dark-mode contrast, and no detectable Axe violations.
- No unrelated worktree changes are overwritten or included in the implementation commit.
