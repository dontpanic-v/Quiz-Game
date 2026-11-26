
export function decodeHtml(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  return doc.documentElement.textContent;
}
