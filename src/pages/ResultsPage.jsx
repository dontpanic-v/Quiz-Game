/**
 * ResultsPage
 * ───────────
 * FILE    src/pages/ResultsPage.jsx  (+ ResultsPage.module.css)
 * OWNER   chea (only chea edits this file)
 * ROUTE   /results
 *
 * PURPOSE
 *   Summary after a quiz: score, percentage, a review of every question, and
 *   saves the game to the history (leaderboard).
 *
 * EXPORT
 *   export default function ResultsPage()
 *
 * USES
 *   useQuiz()     -> { questions, answers, score, total, status, quizMeta, resetQuiz }
 *   useSettings() -> { settings: { playerName, difficulty }, addResult }
 *   useNavigate, Navigate from 'react-router-dom';  ROUTES from '../siteConfig.js'
 *
 *   quizMeta = { title, setId }   setId is null for Open Trivia quizzes
 *   addResult({ playerName, quizTitle, difficulty, score, total, date })
 *     playerName: settings.playerName or 'Guest'
 *     quizTitle:  quizMeta.title
 *     difficulty: difficulty of the questions played (questions[0].difficulty)
 *     date:       new Date().toISOString()
 *
 * REQUIREMENTS
 *   1. If status !== 'finished' (page opened directly / refreshed) -> <Navigate to={ROUTES.home} replace />
 *   2. Save the result exactly once: useEffect + useRef guard (StrictMode runs effects twice)
 *   3. Big score "8 / 10" + percentage + message by percentage:
 *      100% "Perfect!", >= 80% "Great job!", >= 50% "Not bad!", else "Keep practicing!"
 *   4. Review list: for each question show the question, the player's answer
 *      (✓ green if correct, ✗ red if wrong, "Time's up" if null), and the correct answer
 *   5. Buttons:
 *      "Play again"   -> resetQuiz(); go to ROUTES.quiz (keep ?set=<setId> if custom)
 *      "Change settings" -> ROUTES.settings  (or ROUTES.myQuizzes for a custom quiz)
 *      "Leaderboard"  -> ROUTES.leaderboard
 *
 * DONE WHEN
 *   - finishing a quiz shows correct numbers and adds exactly ONE row to the leaderboard
 *   - opening /results directly redirects to Home
 */
