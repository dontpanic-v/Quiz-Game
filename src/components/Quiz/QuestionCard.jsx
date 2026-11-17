/**
 * QuestionCard
 * ────────────
 * FILE    src/components/Quiz/QuestionCard.jsx  (+ QuestionCard.module.css)
 * OWNER   chea (only chea edits this file)
 *
 * PURPOSE
 *   Displays one question with its answer options and the feedback after answering.
 *   Presentational only: no context, all data comes from props.
 *
 * EXPORT
 *   export default function QuestionCard({ question, selected, revealed, onSelect })
 *
 * PROPS
 *   question  { id, question, answers: string[], correctAnswer, difficulty, category }
 *   selected  string | null    the answer the player clicked (null = none / time up)
 *   revealed  boolean          true after answering or time up -> show feedback
 *   onSelect  (answer: string) => void
 *
 * USES
 *   <AnswerOption /> from './AnswerOption.jsx'
 *
 * REQUIREMENTS
 *   1. Small tags: category and difficulty
 *   2. Question text as a heading
 *   3. One AnswerOption per answer, state:
 *        not revealed               -> 'idle'
 *        revealed + correct answer  -> 'correct'
 *        revealed + selected wrong  -> 'wrong'
 *        revealed + other answers   -> 'disabled'
 *   4. When revealed, a feedback line with aria-live="polite":
 *        correct  -> "✓ Correct!"
 *        wrong    -> "✗ Wrong, the answer was <correctAnswer>"
 *        time up  -> "⏱ Time's up! The answer was <correctAnswer>"
 *   5. Answers in a 2x2 grid on desktop, 1 column on phones
 */
