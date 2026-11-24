/**
 * useQuiz
 * ───────
 * FILE    src/hooks/useQuiz.js
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   The only way components read QuizContext.
 *
 * EXPORT
 *   export function useQuiz()
 *   -> { questions, currentIndex, currentQuestion, answers, score, total, status,
 *        quizMeta, startQuiz, submitAnswer, nextQuestion, resetQuiz }
 */
import { useContext } from 'react'
import { QuizContext } from '../context/quizContextObject.js'

export function useQuiz() {
  const value = useContext(QuizContext)
  if (value === null) {
    throw new Error('useQuiz must be used inside <QuizProvider>')
  }
  return value
}
