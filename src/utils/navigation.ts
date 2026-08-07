export type NavigationState = 'inactive' | 'ancestor' | 'current';

function normalizePath(path: string): string {
  if (path === '/') return path;
  return `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function getNavigationState(currentPath: string, destination: string, exactOnly = false): NavigationState {
  const normalizedCurrentPath = normalizePath(currentPath);
  const normalizedDestination = normalizePath(destination);

  if (normalizedCurrentPath === normalizedDestination) return 'current';
  if (
    !exactOnly
    && normalizedDestination !== '/'
    && normalizedCurrentPath.startsWith(normalizedDestination)
  ) return 'ancestor';

  return 'inactive';
}

export function getAriaCurrent(state: NavigationState): 'page' | 'true' | undefined {
  if (state === 'current') return 'page';
  if (state === 'ancestor') return 'true';
  return undefined;
}
