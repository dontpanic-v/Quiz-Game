/**
 * Navbar
 * ──────
 * FILE    src/components/Layout/Navbar.jsx  (+ Navbar.module.css)
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   Top navigation visible on every page.
 *
 * EXPORT
 *   export default function Navbar()
 *
 * USES
 *   NavLink from 'react-router-dom'
 *   ROUTES, APP_NAME from '../../siteConfig.js'
 *   useSettings() -> { settings.theme, updateSettings }
 *   useQuiz()     -> { status }
 *
 * REQUIREMENTS
 *   1. App name on the left, links to Home, My Quizzes, Leaderboard, Settings
 *   2. Active link is visibly highlighted (NavLink className callback)
 *   3. Theme toggle button (light/dark) -> updateSettings({ theme })
 *   4. Under 640px: links collapse behind a menu button (useState open/closed),
 *      menu closes after clicking a link
 *   5. While status === 'playing', clicking a link asks
 *      window.confirm('Leave the quiz? Your progress will be lost.')
 *   6. Accessible: <nav aria-label="Main">, menu button has aria-expanded
 */
