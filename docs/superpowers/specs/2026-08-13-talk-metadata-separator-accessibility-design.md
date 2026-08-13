# Talk metadata separator accessibility

## Goal

Keep the visual middle-dot separator between a talk's event and location without exposing that decorative character to assistive technology.

## Design

`TalkCard` will wrap the middle dot in an element with `aria-hidden="true"`. The event and location remain ordinary text in the same metadata paragraph and retain the existing visual presentation.

This is preferable to giving the entire paragraph a replacement accessible name, which would duplicate its visible text in markup, or drawing the separator with CSS, which would make the visual content less direct to maintain.

## Verification

A browser regression test will inspect the metadata paragraph's accessibility snapshot. It must contain the event and location, and it must not contain the middle dot. Existing bilingual content, layout, and accessibility tests remain applicable.

## Scope

This change applies to upcoming talk cards only. Past-talk metadata separators are outside this step because they use a separate component and markup pattern.
