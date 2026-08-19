# English services removal implementation plan

1. Delete the five obsolete English service route files.
2. Remove the service-only breadcrumb branch, translation labels, and layout type.
3. Remove stale services references from shared-navigation tests.
4. Add regression coverage that all retired URLs return the standard 404 page.
5. Search for stale references, then run the build and relevant Playwright tests.

