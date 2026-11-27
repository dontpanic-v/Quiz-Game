/**
 * LeaderboardPage — Rankings of all completed games with difficulty filters and summary statistics.
 * ROUTE: /leaderboard
 */
import { useState, useMemo } from 'react'
import { DIFFICULTIES, ROUTES } from '../siteConfig.js'
import { useSettings } from '../hooks/useSettings.js'
import ScoreTable from '../components/Leaderboard/ScoreTable.jsx'
import BackButton from '../components/Layout/BackButton.jsx'
import ConfirmDialog from '../components/Layout/ConfirmDialog.jsx'
import styles from './LeaderboardPage.module.css'

export default function LeaderboardPage() {
  const { history, clearHistory } = useSettings()
  const [activeFilter, setActiveFilter] = useState('all')
  const [confirmClear, setConfirmClear] = useState(false)

  // Calculate sorted and filtered results during render
  const filteredAndSortedResults = useMemo(() => {
    if (!Array.isArray(history)) return []

    const filtered =
      activeFilter === 'all'
        ? history
        : history.filter(
            (item) => (item.difficulty || '').toLowerCase() === activeFilter.toLowerCase()
          )

    return [...filtered].sort((a, b) => {
      const pctA = a.total > 0 ? a.score / a.total : 0
      const pctB = b.total > 0 ? b.score / b.total : 0
      if (pctB !== pctA) {
        return pctB - pctA
      }
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    })
  }, [history, activeFilter])

  // Summary statistics calculated during render
  const stats = useMemo(() => {
    if (!filteredAndSortedResults.length) {
      return { gamesPlayed: 0, averagePct: 0, bestPct: 0 }
    }
    const gamesPlayed = filteredAndSortedResults.length
    let totalPct = 0
    let bestPct = 0

    filteredAndSortedResults.forEach((res) => {
      const pct = res.total > 0 ? Math.round((res.score / res.total) * 100) : 0
      totalPct += pct
      if (pct > bestPct) bestPct = pct
    })

    const averagePct = Math.round(totalPct / gamesPlayed)
    return { gamesPlayed, averagePct, bestPct }
  }, [filteredAndSortedResults])

  function handleConfirmClear() {
    clearHistory()
    setConfirmClear(false)
  }

  return (
    <div className={styles.container}>
      <BackButton to={ROUTES.home}>Home</BackButton>

      <header className={styles.header}>
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>Leaderboard</h1>
            <p className={styles.subtitle}>
              Compare past games and see your top scores.
            </p>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className={styles.clearBtn}
            >
              Clear history
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Difficulty filter">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            className={`${styles.tab} ${activeFilter === 'all' ? styles.activeTab : ''}`}
          >
            All
          </button>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type="button"
              role="tab"
              aria-selected={activeFilter === diff}
              onClick={() => setActiveFilter(diff)}
              className={`${styles.tab} ${activeFilter === diff ? styles.activeTab : ''}`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Summary Row */}
      {filteredAndSortedResults.length > 0 && (
        <section className={styles.summaryBar} aria-label="Statistics overview">
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Games Played</span>
            <span className={styles.summaryValue}>{stats.gamesPlayed}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Average Score</span>
            <span className={styles.summaryValue}>{stats.averagePct}%</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Best Score</span>
            <span className={styles.summaryValue}>{stats.bestPct}%</span>
          </div>
        </section>
      )}

      {/* Results Table */}
      <ScoreTable results={filteredAndSortedResults} />

      <ConfirmDialog
        open={confirmClear}
        title="Clear the leaderboard?"
        message={`All ${history.length} saved ${history.length === 1 ? 'game' : 'games'} will be deleted. This can't be undone.`}
        confirmLabel="Clear history"
        cancelLabel="Keep scores"
        onConfirm={handleConfirmClear}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  )
}
