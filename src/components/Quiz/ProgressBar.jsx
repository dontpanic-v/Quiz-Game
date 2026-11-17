/**
 * ProgressBar
 * ───────────
 * FILE    src/components/Quiz/ProgressBar.jsx  (+ ProgressBar.module.css)
 * OWNER   chea (only chea edits this file)
 *
 * PURPOSE
 *   Shows progress through the quiz, the score, and the timer.
 *
 * EXPORT
 *   export default function ProgressBar({ current, total, score, secondsLeft })
 *
 * PROPS
 *   current      number   1-based question number
 *   total        number
 *   score        number
 *   secondsLeft  number | null   null = hide timer
 *
 * REQUIREMENTS
 *   1. Text row: "Question 3 of 10" left, "Score: 2" and "⏱ 12s" right
 *   2. Bar below, filled width = current / total, animated with a CSS transition
 *   3. role="progressbar" with aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}
 *   4. Timer text turns red at 5 seconds or less
 */
