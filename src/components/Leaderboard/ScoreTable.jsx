/**
 * ScoreTable
 * ──────────
 * FILE    src/components/Leaderboard/ScoreTable.jsx  (+ ScoreTable.module.css)
 * OWNER   tesroth (only tesroth edits this file)
 *
 * PURPOSE
 *   Displays a list of results. Presentational only: no context.
 *
 * EXPORT
 *   export default function ScoreTable({ results })
 *
 * PROPS
 *   results  Result[]  already filtered and sorted by LeaderboardPage
 *     Result = { id, playerName, quizTitle, difficulty, score, total, date }
 *
 * REQUIREMENTS
 *   1. Columns: # (rank), Player, Quiz, Difficulty, Score ("8/10 · 80%"), Date
 *   2. Date formatted with toLocaleDateString()
 *   3. Top 3 ranks get 🥇 🥈 🥉
 *   4. Difficulty shown as a colored tag (colors from CSS variables)
 *   5. Empty results -> "No games yet. Play your first quiz!" with a link to ROUTES.quiz
 *   6. Under 640px: each row becomes a stacked card (no horizontal page scroll)
 *   7. Real <table> with <th scope="col"> on desktop
 */
