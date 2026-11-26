/**
 * QuizLibraryContext — Global, persistent list of custom quizzes.
 * EXPORT: export function QuizLibraryProvider({ children })
 */
import { useMemo, useCallback } from 'react'
import { QuizLibraryContext } from './quizLibraryContextObject.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { STORAGE_KEYS } from '../siteConfig.js'

const SAMPLE_QUIZZES = [
  {
    id: 'sample-web-dev-basics',
    title: 'Web Dev Basics',
    description: 'Test your knowledge of HTML, CSS, JavaScript, and DOM fundamentals.',
    difficulty: 'easy',
    questions: [
      {
        id: 'q1-link-tag',
        question: 'Which HTML element is used to link an external CSS stylesheet?',
        answers: ['<link>', '<style>', '<css>', '<stylesheet>'],
        correctAnswer: '<link>',
      },
      {
        id: 'q2-flexbox',
        question: 'Which CSS property enables a flexbox layout container?',
        answers: ['display: flex', 'layout: flex', 'float: center', 'position: relative'],
        correctAnswer: 'display: flex',
      },
      {
        id: 'q3-const',
        question: 'Which JavaScript keyword declares a block-scoped constant variable?',
        answers: ['const', 'let', 'var', 'def'],
        correctAnswer: 'const',
      },
      {
        id: 'q4-dom',
        question: 'What does the abbreviation DOM stand for in frontend development?',
        answers: ['Document Object Model', 'Data Operations Module', 'Desktop Orientation Mode', 'Digital Output Matrix'],
        correctAnswer: 'Document Object Model',
      },
    ],
    createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
  },
]

export function QuizLibraryProvider({ children }) {
  const [quizzes, setQuizzes] = useLocalStorage(STORAGE_KEYS.quizzes, SAMPLE_QUIZZES)

  const getQuiz = useCallback(
    (id) => quizzes.find((q) => q.id === id),
    [quizzes]
  )

  const createQuiz = useCallback(
    ({ title, description = '', difficulty = 'easy', questions = [] }) => {
      const newId = crypto.randomUUID()
      const now = new Date().toISOString()
      const formattedQuestions = questions.map((q) => ({
        id: q.id || crypto.randomUUID(),
        question: q.question,
        answers: q.answers,
        correctAnswer: q.correctAnswer,
      }))

      const newQuiz = {
        id: newId,
        title,
        description,
        difficulty,
        questions: formattedQuestions,
        createdAt: now,
        updatedAt: now,
      }

      setQuizzes((prev) => [newQuiz, ...(Array.isArray(prev) ? prev : [])])
      return newId
    },
    [setQuizzes]
  )

  const updateQuiz = useCallback(
    (id, changes) => {
      const now = new Date().toISOString()
      setQuizzes((prev) => {
        if (!Array.isArray(prev)) return []
        return prev.map((quiz) => {
          if (quiz.id === id) {
            return {
              ...quiz,
              ...changes,
              updatedAt: now,
            }
          }
          return quiz
        })
      })
    },
    [setQuizzes]
  )

  const deleteQuiz = useCallback(
    (id) => {
      setQuizzes((prev) => {
        if (!Array.isArray(prev)) return []
        return prev.filter((quiz) => quiz.id !== id)
      })
    },
    [setQuizzes]
  )

  const value = useMemo(
    () => ({
      quizzes: Array.isArray(quizzes) ? quizzes : [],
      getQuiz,
      createQuiz,
      updateQuiz,
      deleteQuiz,
    }),
    [quizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz]
  )

  return (
    <QuizLibraryContext.Provider value={value}>
      {children}
    </QuizLibraryContext.Provider>
  )
}
