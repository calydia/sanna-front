export const POSTS_PER_PAGE = 12;

export function getPageCount(itemCount: number, pageSize = POSTS_PER_PAGE): number {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}

export function getPageItems<T>(items: T[], currentPage: number, pageSize = POSTS_PER_PAGE): T[] {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
