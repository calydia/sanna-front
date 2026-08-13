# Blog topic navigation font size

## Goal

Reduce the blog topic navigation text to a compact 18px size without changing its layout or interaction behavior.

## Design

The blog topic navigation list will use Tailwind's `text-lg` utility, which resolves to 18px. All topic links will inherit this size at every breakpoint.

Wrapping, spacing, active-state weight and underline, hover behavior, focus behavior, colors, and accessible navigation semantics remain unchanged.

## Verification

A browser regression assertion will verify that a topic navigation link computes to an 18px font size.

## Scope

This change applies only to `BlogTopicNavigation` and does not alter the primary site navigation or other blog text.
