/**
 * QuizPage
 * ────────
 * FILE    src/pages/QuizPage.jsx  (+ QuizPage.module.css)
 * OWNER   chea (only chea edits this file)
 * ROUTE   /quiz              -> questions from Open Trivia DB
 *         /quiz?set=<id>     -> questions from a custom quiz the player made
 *
 * PURPOSE
 *   The game screen: load questions, show one at a time, player picks an answer,
 *   instant feedback, next question, and at the end go to the results page.
 *
 * EXPORT
 *   export default function QuizPage()
 *
 * USES
 *   useSettings()     -> { settings: { difficulty, amount, category } }
 *   useQuiz()         -> { currentQuestion, currentIndex, total, score, status,
 *                          startQuiz, submitAnswer, nextQuestion }
 *   useQuizLibrary()  -> { getQuiz(id) }   (tesroth; custom quizzes)
 *   fetchQuestions({ amount, difficulty, category }) from '../services/triviaApi.js'
 *   shuffle(array) from '../utils/shuffle.js'
 *   useTimer(seconds, onTimeUp) from '../hooks/useTimer.js'
 *   <ProgressBar />, <QuestionCard /> from '../components/Quiz/'
 *   useSearchParams, useNavigate from 'react-router-dom';  ROUTES from '../siteConfig.js'
 *
 *   Question = { id, question, answers: string[], correctAnswer, difficulty, category }
 *   startQuiz(questions, { title, setId })
 *     API quiz:    title 'Open Trivia', setId null
 *     custom quiz: title = quiz.title,  setId = quiz.id
 *
 * REQUIREMENTS
 *   1. Loading (useEffect when the page opens):
 *      - no ?set   -> await fetchQuestions(settings) -> startQuiz(questions, ...)
 *      - ?set=<id> -> quiz = getQuiz(id); convert each CustomQuestion
 *        { id, question, answers, correctAnswer } into a Question:
 *        answers shuffled, difficulty = quiz.difficulty, category = quiz.title.
 *        Unknown id -> message "Quiz not found" + link to ROUTES.myQuizzes
 *      - use an `ignore` flag in the effect cleanup so StrictMode's double run
 *        does not start two quizzes / hit the API rate limit twice
 *   2. Three UI states: loading (spinner or skeleton), error (message + "Try again"
 *      button that reloads), playing
 *   3. useState `selected` (string | null) for the current question:
 *      - click an answer -> setSelected(answer); submitAnswer(answer)
 *      - QuestionCard shows feedback (green correct / red wrong) and locks answers
 *      - a "Next" button appears (label "See results" on the last question)
 *      - Next -> nextQuestion(); setSelected(null); reset timer
 *   4. Timer: useTimer(secondsFor(difficulty), onTimeUp)
 *      easy 20s, medium 15s, hard 10s. Time up -> submitAnswer(null), show the
 *      correct answer, same "Next" button. Timer stops once an answer is chosen.
 *   5. useEffect: when status becomes 'finished' -> navigate(ROUTES.results)
 *   6. Layout: ProgressBar on top, QuestionCard below, Next button full width on mobile
 *
 * RULES
 *   - Do not store score in this page; it comes from useQuiz()
 *   - Keyboard: answers are buttons; Enter on "Next" works
 *
 * DONE WHEN
 *   - a full 10-question quiz can be played on all 3 difficulties and a custom quiz
 *   - feedback shows for every answer and for time up
 *   - API error shows a message instead of a blank page
 */
