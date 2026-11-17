/**
 * QuizSetCard
 * ───────────
 * FILE    src/components/QuizBuilder/QuizSetCard.jsx  (+ QuizSetCard.module.css)
 * OWNER   tesroth (only tesroth edits this file)
 *
 * PURPOSE
 *   One quiz in the My Quizzes grid. Presentational only: no context.
 *
 * EXPORT
 *   export default function QuizSetCard({ quiz, onPlay, onEdit, onDelete })
 *
 * PROPS
 *   quiz      { id, title, description, difficulty, questions: [], createdAt, updatedAt }
 *   onPlay    () => void
 *   onEdit    () => void
 *   onDelete  () => void
 *
 * REQUIREMENTS
 *   1. <article> with title (h3), description cut to 2 lines (CSS line-clamp)
 *   2. Meta row: "12 questions" (singular "1 question"), difficulty tag,
 *      "Updated <toLocaleDateString()>"
 *   3. Buttons: Play (primary), Edit, Delete (danger style)
 *   4. Delete and Edit buttons have aria-label including the quiz title
 */
