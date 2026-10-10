import { Parser } from 'htmlparser2';

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** Adapt CMS image markup without rewriting the surrounding editorial HTML. */
export function normalizeDrupalHtml(html: string, apiUrl: string): string {
  const origin = new URL(apiUrl).origin;
  const absoluteUrl = (value: string): string => {
    if (!value.trim() || /^[a-z][a-z\d+.-]*:/i.test(value.trim())) return value;
    return new URL(value, `${origin}/`).href;
  };
  const edits: Array<{ start: number; end: number; replacement: string }> = [];
  const parser = new Parser({
    onopentag(name, attributes) {
      if (name !== 'img' && name !== 'source') return;
      const changes: Record<string, string> = {};
      if (name === 'img') {
        if (attributes.src !== undefined) changes.src = absoluteUrl(attributes.src);
        // Retain an explicit editorial loading choice, such as eager.
        if (attributes.loading === undefined) changes.loading = 'lazy';
      }
      if (attributes.srcset !== undefined) {
        // Match candidate starts; leave data URLs and their embedded commas intact.
        changes.srcset = attributes.srcset.replace(
          /(^|,)\s*(data:[^\s]+|[^\s,]+)/g,
          (_match, separator: string, url: string) => separator + absoluteUrl(url),
        );
      }
      if (!Object.keys(changes).length) return;
      let tag = html.slice(parser.startIndex, parser.endIndex + 1);
      tag = tag.replace(
        /(\s+)([^\s/>=]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g,
        (match, whitespace: string, attribute: string) => {
          const key = attribute.toLowerCase();
          if (changes[key] === undefined) return match;
          const value = changes[key];
          delete changes[key];
          return `${whitespace}${attribute}="${escapeAttribute(value)}"`;
        },
      );
      for (const [attribute, value] of Object.entries(changes)) {
        tag = tag.replace(/\s*\/?>$/, (ending) => ` ${attribute}="${escapeAttribute(value)}"` + ending);
      }
      edits.push({ start: parser.startIndex, end: parser.endIndex + 1, replacement: tag });
    },
  });
  parser.end(html);
  for (const edit of edits.reverse()) {
    html = html.slice(0, edit.start) + edit.replacement + html.slice(edit.end);
  }
  return html;
}
