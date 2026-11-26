/**
 * quizContextObject
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * The React Context object for QuizContext. Kept in its own file so
 * QuizContext.jsx only exports components (ESLint react-refresh rule).
 * Read it through useQuiz(), never directly.
 */
import { createContext } from 'react'

export const QuizContext = createContext(null)
