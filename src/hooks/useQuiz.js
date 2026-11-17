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
 *
 * REQUIREMENTS
 *   1. return useContext(QuizContext)
 *   2. if the value is null, throw Error('useQuiz must be used inside <QuizProvider>')
 */
