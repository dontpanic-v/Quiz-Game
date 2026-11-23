/**
 * HomePage — Landing page: player greeting, setup chips, best score, quick start.
 * ROUTE: /
 */
import { useState, useMemo, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES, APP_NAME, DEFAULT_SETTINGS, STORAGE_KEYS } from '../siteConfig.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import styles from './HomePage.module.css'

// TEMP mock until src/hooks/useSettings.js is ready
function useSettingsFallback() {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  const [history] = useLocalStorage(STORAGE_KEYS.history, [])

  const updateSettings = useCallback(
    (changes) => {
      setSettings((prev) => ({ ...prev, ...changes }))
    },
    [setSettings]
  )

  return { settings, updateSettings, history }
}

export default function HomePage() {
  const navigate = useNavigate()
  const { settings, updateSettings, history } = useSettingsFallback()
  const [nameInput, setNameInput] = useState('')

  // Best score calculated dynamically from history (best percentage)
  const bestRecord = useMemo(() => {
    if (!history || history.length === 0) return null
    return history.reduce((best, curr) => {
      const bestPct = best.total > 0 ? best.score / best.total : 0
      const currPct = curr.total > 0 ? curr.score / curr.total : 0
      return currPct > bestPct ? curr : best
    }, history[0])
  }, [history])

  function handleSaveName(e) {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (trimmed) {
      updateSettings({ playerName: trimmed })
    }
  }

  const difficultyLabel =
    settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>{APP_NAME}</h1>
        <p className={styles.tagline}>
          Test your knowledge. Pick a level. Beat your best.
        </p>
      </header>

      <section className={styles.profileSection}>
        {settings.playerName ? (
          <div className={styles.greetingBox}>
            <p className={styles.greeting}>
              Welcome back, <strong>{settings.playerName}</strong>!
            </p>
            <Link to={ROUTES.settings} className={styles.changeLink}>
              Change name
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSaveName} className={styles.nameForm}>
            <label htmlFor="player-name-input" className={styles.nameLabel}>
              Enter your player name:
            </label>
            <div className={styles.nameRow}>
              <input
                id="player-name-input"
                type="text"
                maxLength={20}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Alex"
                className={styles.nameInput}
                required
              />
              <button type="submit" className={styles.saveNameBtn}>
                Save
              </button>
            </div>
          </form>
        )}
      </section>

      <section className={styles.setupCard}>
        <div className={styles.setupInfo}>
          <span className={styles.setupLabel}>Current Setup:</span>
          <span className={styles.chip}>
            {difficultyLabel} · {settings.amount} questions
          </span>
        </div>
        <Link to={ROUTES.settings} className={styles.setupChangeLink}>
          Change
        </Link>
      </section>

      {bestRecord && (
        <section className={styles.bestBanner}>
          <span className={styles.trophy}>🏆</span>
          <span>
            Your best: <strong>{bestRecord.score}/{bestRecord.total}</strong> ({bestRecord.difficulty})
          </span>
        </section>
      )}

      <div className={styles.actionGroup}>
        <button
          type="button"
          onClick={() => navigate(ROUTES.quiz)}
          className={styles.primaryBtn}
        >
          Start Quiz
        </button>

        <div className={styles.secondaryGroup}>
          <Link to={ROUTES.myQuizzes} className={styles.secondaryBtn}>
            My Quizzes
          </Link>
          <Link to={ROUTES.leaderboard} className={styles.secondaryBtn}>
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}
