# Finnish Profile Pages Localization Implementation Plan

Date: 2026-08-07  
Design: `2026-08-07-finnish-profile-pages-localization-design.md`

## Goal

Apply the approved English profile-page structures to `/fi/mina/`, `/fi/esiintymiset/`, and `/fi/projektit/` with complete Finnish editorial copy, preserved official titles, and the Finnish `@saavutettavuus` YouTube destination.

## Working rules

- Preserve unrelated worktree changes and the completed English page implementation.
- Reuse existing structural components; do not create a global translation registry.
- Keep official talk and project names in their original language.
- Translate editorial prose, metadata, dates, roles, statuses, and actions into Finnish.
- Do not add new claims, events, links, or credentials.
- Keep the unfinished book non-actionable.

## Task 1: Add Finnish semantic and localization tests

### Files

- Modify `tests/e2e/profile-pages.spec.ts`

### Work

1. Add tests for `/fi/mina/`, `/fi/esiintymiset/`, and `/fi/projektit/` that mirror the English structure assertions.
2. Assert Finnish `h1`, section, principle, topic, enquiry, status, and action labels.
3. Assert that official English talk titles remain unchanged.
4. Assert the Finnish YouTube project links to `https://www.youtube.com/@saavutettavuus` while the English page continues linking to `https://www.youtube.com/@A11yingWithSanna`.
5. Assert Finnish recording links have talk-specific accessible names.
6. Extend Axe, 320px reflow, and keyboard-focus loops to cover all three Finnish routes.

### Verification

- Run the profile-page test file against the development server and confirm new Finnish assertions initially fail for the expected placeholder content.

## Task 2: Localize shared archive-link behavior

### Files

- Modify `src/components/TalkArchiveRow.astro`
- Modify `src/pages/speaking/index.astro`

### Work

1. Add a required or defaulted `recordingLinkText` prop to `TalkArchiveRow.astro`.
2. Render the supplied visible label while preserving `recordingLabel` as the talk-specific accessible-name source.
3. Keep the English visible label `Watch recording` unchanged by passing it explicitly or retaining it as the component default.

### Verification

- Run the existing English Speaking assertions and confirm no visible or accessible label regression.

## Task 3: Implement the Finnish Minä page

### Files

- Modify `src/pages/fi/mina/index.astro`

### Work

1. Replace the placeholder IntroPage with the same text-led hierarchy used by About.
2. Add the Finnish introduction describing Sanna as a Finnish accessibility specialist and developer working across development, accessibility evaluation, training, and organisational practices.
3. Render three PrincipleCard instances under `Näin ajattelen saavutettavuudesta`:
   - `Osa tuotteen laatua`
   - `Ongelmien toistumisen ehkäiseminen`
   - `Käytännöllistä ja helposti lähestyttävää`
4. Add `A11ying with Sanna` and `Yhteisöt ja tiedon jakaminen` closing sections.
5. Explicitly retain participation in Finnish and Nordic accessibility communities.
6. Preserve Finnish language metadata and English/Finnish alternate URLs.

### Verification

- Run Finnish Minä assertions, Axe, focus, and 320px reflow checks.

## Task 4: Implement the Finnish Esiintymiset page

### Files

- Modify `src/pages/fi/esiintymiset/index.astro`

### Work

1. Add a durable Finnish introduction.
2. Define Finnish page-local topic, upcoming-talk, and past-talk data.
3. Render these topic headings:
   - `Saavutettavuus käytännössä`
   - `Saavutettavuus vaatimustenmukaisuutta laajemmin`
   - `Ohjelmistokehitys, tiimit ja viestintä`
4. Preserve official upcoming and past talk titles exactly as used by the English page.
5. Translate descriptions, month names, event-role labels, collaborator prefixes, and recording actions into Finnish.
6. Reuse TalkCard and TalkArchiveRow for the same semantic hierarchy and responsive layout.
7. Add `Kutsu minut puhujaksi` with Finnish copy and localized email and LinkedIn action labels using the existing destinations.

### Verification

- Confirm official titles are unchanged and descriptions remain attached to the corrected talks.
- Confirm all five dates retain valid ISO `datetime` values.
- Run Finnish Speaking semantic, Axe, focus, and reflow checks.

## Task 5: Implement the Finnish Projektit page

### Files

- Modify `src/pages/fi/projektit/index.astro`

### Work

1. Replace the migration placeholder with a durable Finnish introduction.
2. Reuse Project for the same four available resources, with Finnish descriptions and action labels.
3. Preserve official resource names.
4. Set the Finnish YouTube card destination to `https://www.youtube.com/@saavutettavuus` and describe the Finnish channel.
5. Reuse InProgressProject for the book with `Työn alla` and `Suomenkielinen kirja`.
6. Keep the book free of links or buttons.

### Verification

- Confirm exactly four resource actions and no book action.
- Confirm the English and Finnish YouTube destinations remain distinct.
- Run Finnish Projects semantic, Axe, focus, and reflow checks.

## Task 6: Final verification

### Work

1. Run all English and Finnish profile-page tests in desktop and mobile Chromium.
2. Run unit tests.
3. Run Astro type checking and confirm any remaining diagnostic is limited to the recorded pre-existing missing `Service.astro` import.
4. Visually inspect the three Finnish pages at desktop and mobile widths in light and dark modes, focusing on long Finnish words and talk-title wrapping.
5. Inspect the final diff and confirm no unrelated navigation, services, homepage, blog, or English editorial content was changed beyond shared archive-label support.

### Verification commands

- `npx playwright test tests/e2e/profile-pages.spec.ts` against the local development server configuration
- `npm run test:unit`
- `npx astro check`

## Completion criteria

- All three Finnish pages use the approved English page structures with natural first-draft Finnish copy.
- Official talk and project names remain untranslated.
- The Finnish YouTube action points to `@saavutettavuus` and the English action remains unchanged.
- Finnish recording, enquiry, project, status, role, and date labels are localized.
- English and Finnish profile tests pass in desktop and mobile Chromium with no Axe violations or 320px overflow.
- Unrelated worktree changes remain untouched.
