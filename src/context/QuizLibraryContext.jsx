/**
 * QuizLibraryContext
 * ──────────────────
 * FILE    src/context/QuizLibraryContext.jsx
 * OWNER   tesroth (only tesroth edits this file)
 *         dontpanic adds <QuizLibraryProvider> in src/main.jsx
 *
 * PURPOSE
 *   Global, persistent list of quizzes the players write themselves (like Quizlet sets).
 *
 * EXPORT
 *   export function QuizLibraryProvider({ children })
 *   Context object in a separate file (e.g. src/context/quizLibraryContextObject.js)
 *   so this file only exports components (ESLint react-refresh rule).
 *
 * USES
 *   useLocalStorage(STORAGE_KEYS.quizzes, []) from '../hooks/useLocalStorage.js'
 *   STORAGE_KEYS from '../siteConfig.js'
 *
 * CONTEXT VALUE (read by others through useQuizLibrary())
 *   quizzes     QuizSet[]                  newest first
 *   getQuiz     (id) => QuizSet | undefined
 *   createQuiz  ({ title, description, difficulty, questions }) => string   returns new id
 *   updateQuiz  (id, changes) => void      also sets updatedAt
 *   deleteQuiz  (id) => void
 *
 *   QuizSet = {
 *     id, title, description,
 *     difficulty: 'easy' | 'medium' | 'hard',
 *     questions: CustomQuestion[],
 *     createdAt, updatedAt               ISO strings
 *   }
 *   CustomQuestion = {
 *     id, question,
 *     answers: string[],                 2–4 options in the order the author typed
 *     correctAnswer: string,             equals one of answers
 *   }
 *
 * REQUIREMENTS
 *   1. ids with crypto.randomUUID(), dates with new Date().toISOString()
 *   2. actions in useCallback with functional setState, value in useMemo
 *   3. On first visit (nothing saved yet) start with 1 sample quiz
 *      (e.g. "Web Dev Basics", 3–5 questions) so My Quizzes isn't empty
 *
 * DONE WHEN
 *   - create, edit, delete a quiz, refresh, and the changes are still there
 */
