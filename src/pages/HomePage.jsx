/**
 * HomePage
 * ────────
 * FILE    src/pages/HomePage.jsx  (+ HomePage.module.css)
 * OWNER   tesroth (only tesroth edits this file)
 * ROUTE   /
 *
 * PURPOSE
 *   Landing page: greets the player and starts a quiz in one click.
 *
 * EXPORT
 *   export default function HomePage()
 *
 * USES
 *   useSettings() -> { settings: { playerName, difficulty, amount }, updateSettings, history }
 *   useNavigate, Link from 'react-router-dom';  ROUTES, APP_NAME from '../siteConfig.js'
 *
 * REQUIREMENTS
 *   1. Hero: app name + one line like "Test your knowledge. Pick a level. Beat your best."
 *   2. No playerName yet -> name input (<label>) + "Save"; updateSettings({ playerName })
 *      Has a name -> "Welcome back, <name>!" with a small "change" link to Settings
 *   3. Current setup chips: "Medium · 10 questions" + link "Change" -> ROUTES.settings
 *   4. Big primary "Start Quiz" button -> navigate(ROUTES.quiz)
 *   5. Secondary buttons: "My Quizzes" -> ROUTES.myQuizzes, "Leaderboard" -> ROUTES.leaderboard
 *   6. If history is not empty: "Your best: 9/10 (Hard)", calculated from history
 *      (best percentage), not stored
 *   7. Mobile: everything stacked, buttons full width
 */
