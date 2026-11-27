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
    id: 'sample-react-hooks',
    title: 'React Hooks Quiz',
    description: 'Test your understanding of useEffect, useMemo, useCallback, useReducer and useLayoutEffect.',
    difficulty: 'medium',
    questions: [
      {
        id: 'react-q1',
        question: 'How do you make `useEffect` run only once (on mount)?',
        answers: [
          '`useEffect(() => {}, null)`',
          '`useEffect(() => {})`',
          '`useEffect(() => {}, [])`',
          '`useEffect(() => {}, count)`',
        ],
        correctAnswer: '`useEffect(() => {}, [])`',
      },
      {
        id: 'react-q2',
        question: 'Why would you use `useReducer` instead of `useState`?',
        answers: [
          '`useReducer` uses less memory',
          'When you have complex state logic with multiple sub-values or when next state depends on previous state',
          '`useReducer` is always faster',
          '`useState` is deprecated',
        ],
        correctAnswer: 'When you have complex state logic with multiple sub-values or when next state depends on previous state',
      },
      {
        id: 'react-q3',
        question: "What's the difference between `useMemo` and `useCallback`?",
        answers: [
          '`useCallback` is faster',
          '`useMemo` only works with numbers',
          'No difference',
          '`useMemo` returns a memoized value, `useCallback` returns a memoized function',
        ],
        correctAnswer: '`useMemo` returns a memoized value, `useCallback` returns a memoized function',
      },
      {
        id: 'react-q4',
        question: 'When does `useEffect` run by default?',
        answers: [
          'Before the component renders',
          'Only on the first render',
          'Only when state changes',
          'After every render',
        ],
        correctAnswer: 'After every render',
      },
      {
        id: 'react-q5',
        question: "A reducer handles `case 'INCREMENT': return state + 1;`. How do you dispatch an increment action?",
        answers: [
          '`increment()`',
          "`dispatch({ type: 'INCREMENT' })`",
          "`dispatch('INCREMENT')`",
          "`reducer({ type: 'INCREMENT' })`",
        ],
        correctAnswer: "`dispatch({ type: 'INCREMENT' })`",
      },
      {
        id: 'react-q6',
        question: 'What is the purpose of the return function in `useEffect`?',
        answers: [
          'To cleanup side effects',
          'To cancel the effect',
          'To prevent re-renders',
          'To return data to the component',
        ],
        correctAnswer: 'To cleanup side effects',
      },
      {
        id: 'react-q7',
        question: 'When does `useEffect(() => { fetchData(); }, [userId, postId])` run?',
        answers: [
          'On every render',
          'Never',
          'Only once',
          'Only when `userId` or `postId` changes',
        ],
        correctAnswer: 'Only when `userId` or `postId` changes',
      },
      {
        id: 'react-q8',
        question: 'What is the syntax for `useMemo`?',
        answers: [
          '`useMemo([dependencies], () => value)`',
          '`useMemo(value)`',
          '`useMemo(value, [dependencies])`',
          '`useMemo(() => value, [dependencies])`',
        ],
        correctAnswer: '`useMemo(() => value, [dependencies])`',
      },
      {
        id: 'react-q9',
        question: 'What does `useMemo` do?',
        answers: [
          'Prevents all re-renders',
          'Memoizes a callback function',
          'Memoizes a component',
          'Memoizes a computed value',
        ],
        correctAnswer: 'Memoizes a computed value',
      },
      {
        id: 'react-q10',
        question: 'What does `useEffect(() => { document.title = count; })` do?',
        answers: [
          'Creates an infinite loop',
          'Updates the page title on every render',
          'Updates the page title only once',
          'Causes an error',
        ],
        correctAnswer: 'Updates the page title on every render',
      },
      {
        id: 'react-q11',
        question: 'What does the dependency array in `useEffect` control?',
        answers: [
          'Which props to receive',
          'When the effect should re-run',
          'Which state variables to create',
          'The order of effects',
        ],
        correctAnswer: 'When the effect should re-run',
      },
      {
        id: 'react-q12',
        question: 'What is the purpose of `useReducer`?',
        answers: [
          'To reduce component size',
          'To reduce render count',
          'To minimize code',
          'To manage complex state logic with actions',
        ],
        correctAnswer: 'To manage complex state logic with actions',
      },
      {
        id: 'react-q13',
        question: 'When should you use `useLayoutEffect` instead of `useEffect`?',
        answers: [
          'For event listeners',
          'For data fetching',
          'When you need to measure DOM elements or prevent visual flicker',
          'For all side effects',
        ],
        correctAnswer: 'When you need to measure DOM elements or prevent visual flicker',
      },
      {
        id: 'react-q14',
        question: 'What does `useCallback` do?',
        answers: [
          'Calls a function automatically',
          'Prevents function execution',
          'Memoizes a callback function',
          'Creates a callback reference',
        ],
        correctAnswer: 'Memoizes a callback function',
      },
      {
        id: 'react-q15',
        question: 'What is the main difference between `useEffect` and `useLayoutEffect`?',
        answers: [
          "`useLayoutEffect` doesn't support cleanup",
          '`useLayoutEffect` runs synchronously after DOM mutations',
          '`useLayoutEffect` runs asynchronously',
          'They are identical',
        ],
        correctAnswer: '`useLayoutEffect` runs synchronously after DOM mutations',
      },
      {
        id: 'react-q16',
        question: 'What is the primary purpose of the `useEffect` Hook in React?',
        answers: [
          'To manage state',
          'To memoize values',
          'To perform side effects after rendering',
          'To create refs',
        ],
        correctAnswer: 'To perform side effects after rendering',
      },
      {
        id: 'react-q17',
        question: 'Code A is `useCallback(() => doSomething(), [a])` and Code B is `useMemo(() => () => doSomething(), [a])`. Which is true?',
        answers: [
          'They are equivalent',
          'They are not equivalent',
          'Code A is wrong',
          'Code B is wrong',
        ],
        correctAnswer: 'They are equivalent',
      },
      {
        id: 'react-q18',
        question: 'What is the correct signature of a reducer function?',
        answers: [
          '`(state) => newState`',
          '`(newState, action) => state`',
          '`(action) => newState`',
          '`(state, action) => newState`',
        ],
        correctAnswer: '`(state, action) => newState`',
      },
      {
        id: 'react-q19',
        question: 'Inside `useEffect(() => { const timer = setInterval(() => {}, 1000); }, [])`, how do you clean up the timer?',
        answers: [
          '`cleanup(() => clearInterval(timer))`',
          '`return () => clearInterval(timer)`',
          '`useCleanup(() => clearInterval(timer))`',
          '`return clearInterval(timer)`',
        ],
        correctAnswer: '`return () => clearInterval(timer)`',
      },
      {
        id: 'react-q20',
        question: 'What problem does `useEffect(() => { setCount(count + 1); })` have?',
        answers: [
          'Missing dependency array',
          'Syntax error',
          'Creates an infinite loop',
          'Both missing dependency array and creates an infinite loop',
        ],
        correctAnswer: 'Both missing dependency array and creates an infinite loop',
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
