# About, Speaking, and Projects Layout Design

## Goal

Improve the About, Speaking, and Projects pages so they establish Sanna's expertise and help visitors discover her work. The pages should feel related without forcing every content type into the same card pattern.

## Shared direction

Use a guided, text-led hierarchy:

1. A concise introductory panel explains the page's purpose.
2. The main content is divided according to its actual meaning rather than rendered as a sequence of visually identical sections.
3. Repeated content uses repeatable components, such as principle cards, project cards, or talk rows.
4. No new tags, credentials, images, or content categories are introduced.

The About page remains text-led because the homepage already features Sanna's portrait. Existing colors, typography, rounded surfaces, shadows, dark mode, language switching, breadcrumbs, and primary navigation remain part of the site-wide visual system.

## About page

### Structure

1. **Introduction:** A centered introductory panel with the `About Sanna` heading and the existing summary of Sanna's accessibility work.
2. **How I think about accessibility:** Three scannable principles derived from the current prose:
   - Part of product quality
   - Prevent problems returning
   - Practical and approachable
3. **Closing row:** Two equal peer sections on desktop:
   - `A11ying with Sanna`, retaining the explanation of the name and the public work it brings together.
   - `Community and knowledge sharing`, retaining Sanna's speaking, public-resource work, and participation in accessibility communities in Finland and the Nordic region.

The software-development background should be represented in the principle about understanding why accessibility problems happen and preventing their return. Community participation must remain explicit because it is evidence of expertise and contribution, not generic navigation copy.

### Responsive behavior

The three principles and the two closing sections stack into one column on narrow screens. The reading order remains introduction, principles, A11ying with Sanna, then community and knowledge sharing.

## Speaking page

### Structure

1. **Introduction:** Replace the temporary language about details being added later with a durable summary covering digital accessibility, inclusive design, accessible frontend development, and maintaining accessibility over time.
2. **Topics:** Three parallel topic blocks:
   - Accessibility in practice
   - Accessibility beyond compliance
   - Software development, teams and communication
3. **Upcoming talks:** One event card per talk, with a consistent order of title, event and location, then description.
4. **Past talks:** A compact year-grouped archive. Each row consistently presents the talk title followed by available metadata: date, event, location, collaborator or role, and a recording link when available.
5. **Speaking enquiries:** A distinct invitation panel with email and LinkedIn actions. It should not interrupt the topic descriptions.

The third topic description should explicitly include development practices alongside cognitive diversity, communication, psychological safety, and sustainable teamwork.

### Content corrections

Verify the current descriptions for the two upcoming talks before implementation because they appear to be reversed. The expected mapping is: `Hidden Skills of Development: Practical Building Blocks for Team Health` uses the team-health and communication description; `Who Owns Accessibility After a WordPress Site Launches?` uses the description about ownership, content, plugins, and ongoing development.

Past-talk data must be separated into semantic fields rather than joined with manual line breaks. Remove incomplete visible labels such as `View:`. Fix the missing space in `5 yleistä saavutettavuusvirhettä`.

### Responsive behavior

Topic blocks, upcoming-talk cards, and the enquiry panel stack into a single column on narrow screens. Past talks remain compact rows so the mobile page does not become an undifferentiated wall of text.

## Projects page

### Structure

1. **Introduction:** Replace the blog-migration placeholder with a visitor-focused description: accessibility resources, learning materials, and other projects that help people understand, test, and improve digital accessibility.
2. **A11ying with Sanna projects:** Retain the existing two-column desktop grid and one-column mobile grid for the four available resources.
3. **Other projects:** Present the Finnish-language book as a full-width in-progress feature rather than as an incomplete half-row in the resource grid.

The resource cards retain their existing title, description, and action. Copy may be tightened for easier scanning, but must preserve each project's scope. Actions should align consistently at the bottom of cards. The book must be visibly labelled `In progress` and `Finnish-language book`; it has no action until a real destination exists.

### Responsive behavior

Project cards stack into one column on narrow screens. The book's status and description also stack, with status preceding the title and description.

## Component boundaries

Implementation should use small content-specific components where repetition justifies them:

- A reusable surface treatment for white/dark translucent panels.
- A principle block for the three About statements.
- A talk card for upcoming appearances.
- A talk archive row with optional collaborator, role, and recording fields.
- The existing Project component for available resources, extended only if necessary to support consistent actions.
- A separate in-progress project treatment for the book; it should not pretend to be an actionable Project card.

Components must preserve semantic heading order and should not require callers to insert visual line breaks into content.

## Accessibility requirements

- Maintain a single `h1` followed by logical `h2` and `h3` levels.
- Use lists or grouped articles where they convey content relationships; do not rely on card appearance alone.
- Keep link purpose clear from its accessible name. Recording links should identify the associated talk if context does not make that relationship unambiguous.
- Preserve visible keyboard focus, dark-mode contrast, text resizing, and reflow at 320 CSS pixels.
- External-link indication should be consistent with the site's existing convention.
- Do not encode status, topic, or availability through color alone.

## Verification

- Add or update page-level tests for the revised headings, landmark structure, links, and bilingual navigation shell.
- Check desktop and mobile layouts in light and dark modes.
- Run automated accessibility checks on all three English pages.
- Keyboard-test all project, email, LinkedIn, and recording links.
- Confirm no horizontal overflow at 320 CSS pixels and at 200% zoom.
- Verify that the upcoming talk descriptions are associated with the correct titles and that all past-talk metadata is displayed in the intended row.

## Out of scope

- Adding a second portrait to the About page.
- Inventing tags, certifications, statistics, testimonials, or client logos.
- Adding a destination for the unfinished book before one exists.
- Redesigning global navigation, breadcrumbs, footer, background, or brand identity.
- Redesigning the Finnish equivalents in this iteration; they should follow the same approved structure when their content is ready.
