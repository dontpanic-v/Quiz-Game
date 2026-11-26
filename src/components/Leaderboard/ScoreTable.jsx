/**
 * ScoreTable — Presentational table and card list displaying quiz score history.
 * PROPS: { results: Result[] }
 */
import { Link } from 'react-router-dom'
import { ROUTES } from '../../siteConfig.js'
import styles from './ScoreTable.module.css'

export default function ScoreTable({ results = [] }) {
  if (!results || results.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No games yet. Play your first quiz!</p>
        <Link to={ROUTES.quiz} className={styles.playLink}>
          Start a Quiz
        </Link>
      </div>
    )
  }

  function getRankBadge(index) {
    if (index === 0) return '🥇 1'
    if (index === 1) return '🥈 2'
    if (index === 2) return '🥉 3'
    return `${index + 1}`
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th scope="col" className={styles.thRank}>#</th>
            <th scope="col">Player</th>
            <th scope="col">Quiz</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Score</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {results.map((result, idx) => {
            const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0
            const diff = (result.difficulty || 'easy').toLowerCase()
            const formattedDate = result.date ? new Date(result.date).toLocaleDateString() : '—'

            return (
              <tr key={result.id || idx} className={styles.row}>
                <td className={styles.tdRank} data-label="Rank">
                  <span className={styles.rankBadge}>{getRankBadge(idx)}</span>
                </td>
                <td className={styles.tdPlayer} data-label="Player">
                  {result.playerName || 'Anonymous'}
                </td>
                <td className={styles.tdQuiz} data-label="Quiz">
                  {result.quizTitle || 'Quiz'}
                </td>
                <td className={styles.tdDiff} data-label="Difficulty">
                  <span className={`${styles.badge} ${styles[diff] || styles.easy}`}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </span>
                </td>
                <td className={styles.tdScore} data-label="Score">
                  <span className={styles.scoreText}>
                    <strong>{result.score}/{result.total}</strong>
                    <span className={styles.pct}> · {pct}%</span>
                  </span>
                </td>
                <td className={styles.tdDate} data-label="Date">
                  {formattedDate}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
