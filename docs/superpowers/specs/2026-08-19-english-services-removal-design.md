# English services removal design

## Context

The English accessibility-services section is not part of the site's new structure. Its shared `Service.astro` component has already been removed, leaving the services landing page unable to build. The Finnish service pages have also already been removed.

## Decision

Remove the complete English services section and its remaining service-specific architecture:

- `/services/`
- `/services/accessibility-audits/`
- `/services/training/`
- `/services/consulting/`
- `/services/monitoring/`

The former URLs will use the site's normal 404 response. They will not redirect because no current page is a semantically equivalent destination.

## Architecture cleanup

- Delete the five Astro route files under `src/pages/services/`.
- Remove `service` from the `pageType` layout contract.
- Remove the service-specific breadcrumb parent and its translated label.
- Update test fixtures and representative route lists that refer to `/services/`.
- Add coverage confirming the removed service URLs return 404 responses.

## Compatibility and recovery

No replacement content or compatibility routes will be introduced. The deleted pages remain recoverable through Git history.

## Verification

- Run the production build to confirm the missing-component failure is resolved.
- Run the relevant end-to-end tests, including the removed-route assertions.
- Search the source and tests for stale service-section references.

