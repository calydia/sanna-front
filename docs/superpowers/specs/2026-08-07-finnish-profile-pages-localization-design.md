# Finnish Profile Pages Localization Design

## Goal

Apply the approved About, Speaking, and Projects structures to `/fi/mina/`, `/fi/esiintymiset/`, and `/fi/projektit/` with complete Finnish editorial copy that Sanna can refine later.

## Localization approach

Reuse the English pages' structural components while keeping Finnish editorial data and prose in the Finnish page files. Do not create a global translation registry or couple the English and Finnish editorial content through shared data objects.

This approach intentionally permits localized differences. The Finnish Projects page, for example, links its YouTube card to the Finnish `@saavutettavuus` channel rather than the English A11ying with Sanna channel.

## Translation boundaries

- Translate introductions, section headings, descriptions, event metadata, dates, roles, statuses, action labels, and enquiry copy into natural Finnish.
- Keep official talk titles in their original language.
- Keep official project and brand names unchanged where they function as names.
- Preserve Finnish titles that are already Finnish.
- Use Finnish date presentation while retaining ISO values in `<time datetime>` attributes.
- Do not add claims, events, projects, links, or credentials that are absent from the English content or the user's instructions.

## Minä page

Use the same hierarchy as About:

1. A concise `Minä` introduction identifying Sanna as a Finnish accessibility specialist and developer whose work covers development, accessibility evaluation, training, and organisational practices.
2. A three-card `Näin ajattelen saavutettavuudesta` section:
   - `Osa tuotteen laatua`
   - `Ongelmien toistumisen ehkäiseminen`
   - `Käytännöllistä ja helposti lähestyttävää`
3. Two closing sections:
   - `A11ying with Sanna`
   - `Yhteisöt ja tiedon jakaminen`

The community section must explicitly retain participation in Finnish and Nordic accessibility communities.

## Esiintymiset page

Use the same hierarchy as Speaking:

1. A durable Finnish introduction.
2. Three topic cards under `Aiheet, joista puhun`:
   - `Saavutettavuus käytännössä`
   - `Saavutettavuus vaatimustenmukaisuutta laajemmin`
   - `Ohjelmistokehitys, tiimit ja viestintä`
3. Two upcoming-talk cards under `Tulevat esiintymiset`, retaining the official English titles.
4. A year-grouped `Aiemmat esiintymiset` archive. Official titles remain unchanged; Finnish titles remain Finnish.
5. A `Kutsu minut puhujaksi` enquiry panel with Finnish email and LinkedIn action labels.

The descriptions remain associated with the corrected talk titles established in the English design. Collaborator and role metadata is localized, and recording links use a Finnish visible label and talk-specific accessible name.

## Projektit page

Use the same hierarchy as Projects:

1. Replace the migration placeholder with a durable Finnish introduction.
2. Present the four available resources under `A11ying with Sanna -projektit` in the existing responsive project grid.
3. Translate descriptions and action labels while retaining official project names.
4. Link the Finnish YouTube project to `https://www.youtube.com/@saavutettavuus` and describe the Finnish-language channel.
5. Present the book under `Muut projektit` as a non-actionable full-width feature labelled `Työn alla` and `Suomenkielinen kirja`.

## Component changes

- Reuse `PrincipleCard.astro`, `TalkCard.astro`, `Project.astro`, and `InProgressProject.astro` without language-specific visual variants.
- Extend `TalkArchiveRow.astro` with a localized visible recording-link label while retaining a talk-specific accessible name.
- Keep content data inside the respective Finnish page files.
- Preserve logical heading order, labelled sections, list semantics, visible focus, and existing light/dark presentation.

## Verification

- Add Finnish page assertions mirroring the English semantic coverage.
- Confirm the Finnish YouTube action points to `https://www.youtube.com/@saavutettavuus` and the English action remains unchanged.
- Confirm official English talk titles are not translated.
- Run Axe checks for all three Finnish routes.
- Verify keyboard focus for Finnish enquiry, recording, and project actions.
- Confirm reflow without horizontal overflow at 320 CSS pixels.
- Visually inspect all three pages at desktop and mobile widths in light and dark modes.

## Out of scope

- Rewriting or editorially polishing the translations beyond a clear first complete draft.
- Translating official English talk or project names.
- Adding a global content-management or translation-key system.
- Adding new project destinations or a link for the unfinished book.
- Changing the English page layouts or content except for the minimal shared-component support needed for localized labels.
