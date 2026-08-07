# Pre-paint theme initialization

## Problem

The current theme script is a bundled module rendered with the toggle button in the document body. Module execution is deferred, so a page can paint with light-theme styles before the script reads the saved or system preference and adds the correct class to `<html>`. Full-page navigation repeats the flash.

## Selected approach

Load a small same-origin blocking script in the document head before body rendering. The script reads the existing `darkMode` local-storage value, falls back to `prefers-color-scheme`, and synchronously adds exactly one of `light` or `dark` to the root element.

This approach is preferred over an inline script because the current CSP already permits same-origin script files and no manually maintained hash is required. It is preferred over cookie-based server rendering because the site is static and local storage is already the established preference mechanism.

## Responsibilities

### Head initializer

- Run before the first paint on every page using `SiteLayout`.
- Read `darkMode` without modifying it.
- Treat `enabled` as dark and `disabled` as light.
- Use the system color preference only when no valid stored value exists.
- Remove the opposite class before adding the selected class.
- Set the root `color-scheme` to match the selected theme.
- Fail safely if storage access is unavailable by using the system preference.

### Theme toggle

- Continue owning user interaction and preference persistence.
- Initialize `aria-pressed` from the root class already selected by the head initializer.
- Avoid performing a second preference calculation during normal page startup.
- Continue switching the root class, `color-scheme`, `aria-pressed`, and stored preference when activated.

## CSP and loading

- Serve the initializer from `public/` as a same-origin JavaScript file.
- Include it as a non-module, non-async, non-defer script in `SiteLayout`’s head.
- Keep Astro’s generated CSP enabled and verify that no browser CSP errors occur.

## Verification

- Verify a saved dark preference is present on `<html>` before body content is parsed.
- Verify a saved light preference behaves equivalently.
- Verify system preference is used when storage is unset.
- Verify the toggle updates the class, `color-scheme`, accessible pressed state, and storage.
- Verify navigation to another page retains the selected theme without an intermediate opposite-theme class.
- Run type, production-build, browser, CSP, accessibility, and visual checks.
