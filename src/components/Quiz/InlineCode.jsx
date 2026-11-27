/**
 * InlineCode
 * ──────────
 * FILE    src/components/Quiz/InlineCode.jsx
 *
 * PURPOSE
 *   Shows quiz text where parts wrapped in backticks are code, e.g.
 *   "What does `useMemo` do?" renders useMemo in the code font.
 *
 * EXPORT
 *   export default function InlineCode({ text })
 *
 * RULES
 *   - Builds React elements only (no HTML strings), so player text stays safe.
 *   - Text with an unmatched backtick is shown exactly as typed.
 */
export default function InlineCode({ text }) {
  const value = String(text ?? '')
  const parts = value.split('`')

  // An even number of parts means an odd number of backticks: show it as plain text.
  if (parts.length < 3 || parts.length % 2 === 0) return value

  return parts.map((part, i) => (i % 2 === 1 ? <code key={i}>{part}</code> : part))
}
