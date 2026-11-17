/**
 * CreateQuizPage
 * ──────────────
 * FILE    src/pages/CreateQuizPage.jsx  (+ CreateQuizPage.module.css)
 * OWNER   tesroth (only tesroth edits this file)
 * ROUTE   /create            new quiz
 *         /create/:quizId    edit an existing quiz
 *
 * PURPOSE
 *   Form to write your own quiz: title, description, difficulty and questions.
 *
 * EXPORT
 *   export default function CreateQuizPage()
 *
 * USES
 *   useQuizLibrary() -> { getQuiz, createQuiz, updateQuiz }
 *   <QuestionEditor /> from '../components/QuizBuilder/QuestionEditor.jsx'
 *   useParams, useNavigate, Link from 'react-router-dom'
 *   DIFFICULTIES, ROUTES from '../siteConfig.js'
 *
 *   CustomQuestion = { id, question, answers: string[], correctAnswer }
 *
 * REQUIREMENTS
 *   1. Form state with useState: title, description, difficulty ('easy'), questions[]
 *      New quiz starts with 1 empty question: answers ['', '', '', ''], correctAnswer ''
 *   2. Edit mode (quizId in URL): useEffect loads getQuiz(quizId) into the form.
 *      Not found -> "Quiz not found" + link to ROUTES.myQuizzes
 *   3. Page title "Create quiz" or "Edit quiz"
 *   4. List of <QuestionEditor /> + "Add question" button (max 50) and remove per
 *      question (min 1)
 *   5. Validation on Save, errors shown next to the field and the first error scrolled into view:
 *        title required (max 60 chars)
 *        each question: text required, 2–4 non-empty answers, no duplicate answers,
 *        a correct answer selected
 *   6. Save: empty answers removed, then createQuiz(...) or updateQuiz(quizId, ...),
 *      then navigate(ROUTES.myQuizzes)
 *   7. "Cancel" -> back to My Quizzes (confirm if there are unsaved changes)
 *
 * DONE WHEN
 *   - a new quiz can be created, appears in My Quizzes, and plays on /quiz?set=<id>
 *   - editing keeps the same id and the changes show after refresh
 */
