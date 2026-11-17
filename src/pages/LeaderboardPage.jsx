/**
 * LeaderboardPage
 * ───────────────
 * FILE    src/pages/LeaderboardPage.jsx  (+ LeaderboardPage.module.css)
 * OWNER   tesroth (only tesroth edits this file)
 * ROUTE   /leaderboard
 *
 * PURPOSE
 *   Ranking of all games played in this browser.
 *
 * EXPORT
 *   export default function LeaderboardPage()
 *
 * USES
 *   useSettings() -> { history, clearHistory }
 *     Result = { id, playerName, quizTitle, difficulty, score, total, date }
 *   DIFFICULTIES from '../siteConfig.js'
 *   <ScoreTable results={...} /> from '../components/Leaderboard/ScoreTable.jsx'
 *
 * REQUIREMENTS
 *   1. Filter tabs: All / Easy / Medium / Hard (useState, default 'all')
 *   2. Sort: highest percentage (score / total) first; ties -> newer date first.
 *      Filtering + sorting is calculated during render (useMemo ok), not stored in state
 *   3. Summary row above the table: games played, average %, best %
 *   4. Render <ScoreTable results={sortedResults} />
 *   5. "Clear history" button, only if history is not empty, with
 *      window.confirm('Delete all scores? This cannot be undone.')
 */
