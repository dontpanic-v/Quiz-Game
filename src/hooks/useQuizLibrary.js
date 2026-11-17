/**
 * useQuizLibrary
 * ──────────────
 * FILE    src/hooks/useQuizLibrary.js
 * OWNER   tesroth (only tesroth edits this file)
 *
 * PURPOSE
 *   The only way components read QuizLibraryContext.
 *
 * EXPORT
 *   export function useQuizLibrary()
 *   -> { quizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz }
 *
 * REQUIREMENTS
 *   1. return useContext(QuizLibraryContext)
 *   2. if the value is null, throw Error('useQuizLibrary must be used inside <QuizLibraryProvider>')
 */
