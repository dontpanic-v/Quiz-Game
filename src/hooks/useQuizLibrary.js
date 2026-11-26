/**
 * useQuizLibrary — hook to access QuizLibraryContext.
 * EXPORT: export function useQuizLibrary() -> { quizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz }
 */
import { useContext } from 'react'
import { QuizLibraryContext } from '../context/quizLibraryContextObject.js'

export function useQuizLibrary() {
  const context = useContext(QuizLibraryContext)
  if (!context) {
    throw new Error('useQuizLibrary must be used inside <QuizLibraryProvider>')
  }
  return context
}
