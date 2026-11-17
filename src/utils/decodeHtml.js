/**
 * decodeHtml
 * ──────────
 * FILE    src/utils/decodeHtml.js
 * OWNER   chea (only chea edits this file)
 *
 * PURPOSE
 *   Open Trivia DB returns HTML-encoded text, e.g. "Who&#039;s &quot;Bob&quot;?".
 *   This turns it into plain text: Who's "Bob"?
 *
 * EXPORT
 *   export function decodeHtml(text) -> string
 *
 * REQUIREMENTS
 *   1. Decode with new DOMParser().parseFromString(text, 'text/html').documentElement.textContent
 *   2. Never use dangerouslySetInnerHTML anywhere for API text
 */
