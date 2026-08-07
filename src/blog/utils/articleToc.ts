export type TocItem = {
  id: string;
  label: string;
};

export type ProcessedArticleContent = {
  content: string;
  items: TocItem[];
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildArticleToc(content: string): ProcessedArticleContent {
  const usedIds = new Set<string>();
  const items: TocItem[] = [];
  const processedContent = content.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, innerHtml) => {
    const label = stripHtml(innerHtml);
    if (!label) return match;

    const idMatch = attrs.match(/\sid=(['"])(.*?)\1/i);
    const baseId = idMatch?.[2] || slugifyHeading(label) || 'section';
    let id = baseId;
    let duplicateCount = 2;
    while (usedIds.has(id)) {
      id = `${baseId}-${duplicateCount}`;
      duplicateCount += 1;
    }
    usedIds.add(id);
    items.push({ id, label });

    return idMatch ? `<h2${attrs}>${innerHtml}</h2>` : `<h2${attrs} id="${id}">${innerHtml}</h2>`;
  });

  return { content: processedContent, items };
}
