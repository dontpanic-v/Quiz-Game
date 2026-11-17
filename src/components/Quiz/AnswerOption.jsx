/**
 * AnswerOption
 * ────────────
 * FILE    src/components/Quiz/AnswerOption.jsx  (+ AnswerOption.module.css)
 * OWNER   chea (only chea edits this file)
 *
 * PURPOSE
 *   One clickable answer button.
 *
 * EXPORT
 *   export default function AnswerOption({ text, state, onClick })
 *
 * PROPS
 *   text     string
 *   state    'idle' | 'correct' | 'wrong' | 'disabled'
 *   onClick  () => void
 *
 * REQUIREMENTS
 *   1. A real <button type="button">, disabled unless state is 'idle'
 *   2. Styles per state using CSS variables from src/index.css:
 *      idle hover effect, correct = green + "✓", wrong = red + "✗", disabled = faded
 *      (icon/text too, never color alone)
 *   3. Min height 44px, full width of its grid cell, text wraps for long answers
 *   4. Visible focus outline for keyboard users
 */
