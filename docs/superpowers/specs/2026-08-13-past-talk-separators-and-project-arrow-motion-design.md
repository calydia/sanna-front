# Past talk separators and project arrow motion

## Goal

Hide decorative middle-dot separators in past-talk metadata from assistive technology and add subtle, motion-sensitive feedback to project-link arrows.

## Past talk metadata

`TalkArchiveRow` will render the date and each available metadata value as separate text nodes. A middle dot wrapped in an element with `aria-hidden="true"` will appear visually between adjacent values. Spaces outside the hidden elements will prevent accessible text from concatenating.

This applies to every separator in past-talk rows, including the separator after the date and those between event, location, collaborator, and role values.

## Project link motion

The arrow in the shared `Project` component will translate two pixels to the right when its link is hovered. The transition will last 150ms and use `ease-in-out`. Only the arrow moves; the link and card remain stationary.

When `prefers-reduced-motion: reduce` is active, the arrow will not transition or translate. Keyboard focus styling remains unchanged and does not trigger movement.

## Verification

Browser tests will verify that past-talk metadata remains visually unchanged while its accessibility snapshot contains the date and metadata without middle dots. Project-page tests will verify the arrow's default and hovered transforms on a hover-capable pointer and confirm that reduced-motion prevents movement.

## Scope

The change applies to both English and Finnish pages through the two shared components. It does not alter talk content, project links, card layout, or other icons.
