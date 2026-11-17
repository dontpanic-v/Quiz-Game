/**
 * MyQuizzesPage
 * ─────────────
 * FILE    src/pages/MyQuizzesPage.jsx  (+ MyQuizzesPage.module.css)
 * OWNER   tesroth (only tesroth edits this file)
 * ROUTE   /my-quizzes
 *
 * PURPOSE
 *   Library of quizzes the players made themselves (like Quizlet sets):
 *   play, edit, delete, or create a new one.
 *
 * EXPORT
 *   export default function MyQuizzesPage()
 *
 * USES
 *   useQuizLibrary() -> { quizzes, deleteQuiz }
 *   <QuizSetCard /> from '../components/QuizBuilder/QuizSetCard.jsx'
 *   useNavigate from 'react-router-dom';  ROUTES from '../siteConfig.js'
 *
 * REQUIREMENTS
 *   1. Header: "My Quizzes" + primary "Create new quiz" button -> ROUTES.create
 *   2. Search input filtering by title (useState, case-insensitive, calculated in render)
 *   3. Grid of <QuizSetCard /> with:
 *        onPlay   -> navigate(`${ROUTES.quiz}?set=${quiz.id}`)
 *        onEdit   -> navigate(`${ROUTES.create}/${quiz.id}`)
 *        onDelete -> window.confirm(`Delete "${quiz.title}"?`) then deleteQuiz(quiz.id)
 *   4. Empty states: no quizzes -> "You haven't made any quizzes yet" + create button;
 *      search with no match -> "No quizzes match <search>"
 *   5. Grid: 3 columns desktop, 2 tablet, 1 phone
 *   6. Optional: "Export" a quiz as .json and "Import" a .json file to share quizzes
 */
