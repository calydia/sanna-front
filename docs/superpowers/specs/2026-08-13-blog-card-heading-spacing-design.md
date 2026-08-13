# Blog card heading spacing

## Goal

Add more space between each blog article card image and its heading, using the card's existing outer padding as the increment.

## Design

The article card's text container currently provides 12px of padding between the image and heading, while the outer list item adds 8px around the inner content. The text container's top padding will increase by that 8px amount, producing a 20px image-to-heading gap.

Horizontal and bottom text-container padding will remain 12px. Card borders, outer padding, image dimensions, typography, metadata spacing, descriptions, links, hover states, focus states, and responsive grid behavior remain unchanged.

## Verification

A browser regression assertion will measure a 20px vertical gap between the image's bottom edge and the heading's top edge on a representative article card.

## Scope

This change applies to article cards rendered by `PostGrid` on the blog front page and archive pages. Category cards and related-post cards are outside the change.
