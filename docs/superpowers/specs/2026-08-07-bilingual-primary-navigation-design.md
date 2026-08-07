# Bilingual primary navigation design

## Goal

Provide equivalent English and Finnish primary navigation, add an explicit link to each language's actual homepage, expose the existing services sections, and create minimal Finnish destinations for sections that do not yet have pages.

## Navigation structure

The shared primary navigation uses a language-specific list of explicit labels and routes:

| English | Finnish |
| --- | --- |
| Home `/` | Etusivu `/fi/` |
| About `/about/` | Minä `/fi/mina/` |
| Services `/services/` | Palvelut `/fi/palvelut/` |
| Speaking `/speaking/` | Esiintymiset `/fi/esiintymiset/` |
| Projects `/projects/` | Projektit `/fi/projektit/` |
| Blog `/blog/` | Blogi `/fi/blog/` |

Routes are configured explicitly rather than generated because translated slugs differ.

## Shared component behavior

`PrimaryNavigation` receives the current language and selects the corresponding route list. The component keeps the existing visual treatment, keyboard focus behavior, and navigation-state utility.

Exact destinations receive `aria-current="page"`. Section links receive the ancestor state on nested routes, including English and Finnish services and the English blog. The homepage matches only its exact route and is not treated as the ancestor of the entire site.

The navigation landmark uses a localized accessible name. It appears on both English and Finnish pages.

## Finnish pages

Create minimal Finnish pages at:

- `/fi/mina/`
- `/fi/esiintymiset/`
- `/fi/projektit/`

Each page uses the shared site layout, a Finnish page title and short introductory copy, Finnish skip-link and theme controls, the Finnish primary navigation, and a language-switch link to its corresponding English page. These are intentionally minimal foundations for later content expansion, but they are complete, useful destinations rather than empty pages.

## Language pairing

The corresponding language destinations are:

- `/` and `/fi/`
- `/about/` and `/fi/mina/`
- `/services/` and `/fi/palvelut/`
- `/speaking/` and `/fi/esiintymiset/`
- `/projects/` and `/fi/projektit/`
- `/blog/` and `/fi/blog/`

Existing nested service-page language pairs remain unchanged. The English-only blog behavior also remains unchanged: only the blog homepage links to the Finnish blog introduction, and nested English blog pages do not imply translated content.

## Verification

Automated checks cover:

- Six correctly ordered navigation links in each language.
- Exact and nested active states, including Home/Etusivu not matching unrelated pages.
- Resolution of all new Finnish pages.
- Correct paired language-switch destinations on the new pages and main section pages.
- Preservation of the English-only nested blog language behavior.
- Keyboard navigation, mobile wrapping, accessibility scans, and updated visual baselines where the shared navigation changes.
