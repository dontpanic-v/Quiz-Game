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
 *   Context object in a separate file (ESLint react-refresh rule).
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
 *                      null means time ran out (counts as wrong).
 *                      Ignored (returns false) if the current question was already answered.
 *   nextQuestion     () => void   index + 1, or status 'finished' after the last question
 *   resetQuiz        () => void   back to empty + 'idle'
 *
 *   Question     = { id, question, answers: string[], correctAnswer, difficulty, category }
 *   AnswerRecord = { questionId, selected: string | null, isCorrect: boolean }
 *
 * REQUIREMENTS
 *   1. useState for questions, currentIndex, answers, status, quizMeta
 *   2. score / total / currentQuestion are calculated, never stored in state
 *   3. actions wrapped in useCallback, value wrapped in useMemo
 *
 * DONE WHEN
 *   - QuizPage can start a quiz, answer, go next, and reach 'finished'
 *   - ResultsPage can read score, total, answers, questions, quizMeta
 */
