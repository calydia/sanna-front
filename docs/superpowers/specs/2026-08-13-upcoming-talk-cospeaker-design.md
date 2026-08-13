# Upcoming talk co-speaker

## Goal

Identify Mikaela Kindstedt as the co-speaker for the upcoming DrupalCon Europe 2026 session in both language versions of the speaking page.

## Design

`TalkCard` will accept an optional collaborator string and render it on its own metadata line below the event and location. The DrupalCon talk will provide “With Mikaela Kindstedt” in English and “Yhdessä Mikaela Kindstedtin kanssa” in Finnish.

The WordPress Accessibility Day talk will not provide collaborator metadata and will remain a solo talk. Past events already render collaborator metadata separately and do not need changes.

## Verification

Browser tests will verify the localized collaborator text appears only in the DrupalCon card on both speaking pages. Existing page accessibility and reflow coverage will continue to apply.

## Deferred work

The middle-dot separator between event and location remains unchanged in this step. Its screen-reader behavior and any semantic adjustment will be investigated separately after the co-speaker change.
