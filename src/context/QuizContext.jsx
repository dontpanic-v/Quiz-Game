/**
 * QuizContext
 * ───────────
 * FILE    src/context/QuizContext.jsx
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   State of the game currently being played, shared by QuizPage and ResultsPage.
 *   Not saved to localStorage: refreshing mid-quiz starts over.
 *
 * EXPORT
 *   export function QuizProvider({ children })
 *   The context object lives in ./quizContextObject.js (ESLint react-refresh rule).
 *
 * CONTEXT VALUE (read by others through useQuiz())
 *   questions        Question[]
 *   currentIndex     number
 *   currentQuestion  Question | null          derived: questions[currentIndex] ?? null
 *   answers          AnswerRecord[]
 *   score            number                   derived: answers that are correct
 *   total            number                   derived: questions.length
 *   status           'idle' | 'playing' | 'finished'
 *   quizMeta         { title: string, setId: string | null }
 *   startQuiz        (questions, meta) => void   resets everything, status 'playing'
 *   submitAnswer     (selected: string | null) => boolean
 *                      Returns whether the answer was correct.
 *                      null means time ran out (counts as wrong).
 *                      Ignored (returns false) if the current question was already answered.
 *   nextQuestion     () => void   index + 1, or status 'finished' after the last question
 *   resetQuiz        () => void   back to empty + 'idle'
 *
 *   Question     = { id, question, answers: string[], correctAnswer, difficulty, category }
 *   AnswerRecord = { questionId, selected: string | null, isCorrect: boolean }
 */
import { useCallback, useMemo, useState } from 'react'
import { QuizContext } from './quizContextObject.js'

const EMPTY_META = { title: '', setId: null }

export function QuizProvider({ children }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [status, setStatus] = useState('idle')
  const [quizMeta, setQuizMeta] = useState(EMPTY_META)

  // Derived values: calculated on every render, never stored in state.
  const currentQuestion = questions[currentIndex] ?? null
  const score = answers.filter((a) => a.isCorrect).length
  const total = questions.length

  const startQuiz = useCallback((newQuestions, meta = {}) => {
    setQuestions(newQuestions)
    setCurrentIndex(0)
    setAnswers([])
    setQuizMeta({ ...EMPTY_META, ...meta })
    setStatus('playing')
  }, [])

  const submitAnswer = useCallback(
    (selected) => {
      if (status !== 'playing' || !currentQuestion) return false
      if (answers.some((a) => a.questionId === currentQuestion.id)) return false

      const isCorrect = selected !== null && selected === currentQuestion.correctAnswer
      setAnswers((prev) => [
        ...prev,
        { questionId: currentQuestion.id, selected, isCorrect },
      ])
      return isCorrect
    },
    [status, currentQuestion, answers],
  )

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setStatus('finished')
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, questions.length])

  const resetQuiz = useCallback(() => {
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setQuizMeta(EMPTY_META)
    setStatus('idle')
  }, [])

  const value = useMemo(
    () => ({
      questions,
      currentIndex,
      currentQuestion,
      answers,
      score,
      total,
      status,
      quizMeta,
      startQuiz,
      submitAnswer,
      nextQuestion,
      resetQuiz,
    }),
    [
      questions,
      currentIndex,
      currentQuestion,
      answers,
      score,
      total,
      status,
      quizMeta,
      startQuiz,
      submitAnswer,
      nextQuestion,
      resetQuiz,
    ],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
