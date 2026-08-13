# Blog Browse link and footer hover styling

## Goal

Align the blog front page's Browse all posts link with pager-link typography, give its arrow subtle motion consistent with project links, and remove the redundant hover underline from Back to top.

## Browse all posts

The Browse all posts link will use a 16px `text-base` font size, matching blog pager links. It will use an inline-flex layout with an eight-pixel gap between the label and arrow.

The text arrow will be replaced by the same `arrow-right` icon used on project-page links, at the same 24px size and hidden from assistive technology. On hover-capable devices, the icon will translate two pixels to the right over 150ms using `ease-in-out`. With `prefers-reduced-motion: reduce`, the icon will not transition or move.

Existing button colors, borders, hover treatment, focus treatment, label, and destination remain unchanged.

## Back to top

Back to top will remain without an underline on hover. Its existing top and bottom border color change will remain the visual hover cue. Other blog footer links will retain their current hover underline.

## Verification

Browser tests will verify the Browse link's 16px font size, eight-pixel gap, shared arrow icon size, default and hovered transforms, and reduced-motion behavior. They will also verify that Back to top remains without an underline on hover while its border color changes, and that ordinary footer links still underline on hover.

## Scope

This change applies only to the blog front page Browse all posts link and the blog footer's Back to top button.
