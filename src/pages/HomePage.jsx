/**
 * HomePage — Landing page: player greeting, setup chips, quick start.
 * ROUTE: /
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES, APP_NAME, QUESTION_SOURCES } from '../siteConfig.js'
import { useSettings } from '../hooks/useSettings.js'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettings()
  const [nameInput, setNameInput] = useState('')

  function handleSaveName(e) {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (trimmed) {
      updateSettings({ playerName: trimmed })
    }
  }

  const difficultyLabel =
    settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)
  const sourceLabel =
    QUESTION_SOURCES.find((src) => src.id === settings.source)?.label ?? 'Open Trivia'

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
            {sourceLabel} · {difficultyLabel} · {settings.amount} questions
          </span>
        </div>
        <Link to={ROUTES.settings} className={styles.setupChangeLink}>
          Change
        </Link>
      </section>

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
