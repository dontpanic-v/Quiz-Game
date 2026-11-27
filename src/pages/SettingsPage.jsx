/**
 * SettingsPage — Configure player preferences, difficulty, question count, and category.
 * ROUTE: /settings
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DIFFICULTIES, QUESTION_AMOUNTS, DEFAULT_SETTINGS, ROUTES } from '../siteConfig.js'
import { useSettings } from '../hooks/useSettings.js'
import { fetchCategories } from '../services/triviaApi.js'
import styles from './SettingsPage.module.css'

const DIFFICULTY_DESCRIPTIONS = {
  easy: 'Casual and relaxed pace',
  medium: 'Standard trivia challenge',
  hard: 'High intensity: 10s per question',
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettings()

  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [savedVisible, setSavedVisible] = useState(false)
  const savedTimerRef = useRef(null)

  // Fetch categories with ignore cleanup
  useEffect(() => {
    let ignore = false

    // On failure keep "Any category" so the page still works offline.
    fetchCategories()
      .catch(() => [])
      .then((cats) => {
        if (!ignore) {
          setCategories(cats)
          setLoadingCategories(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // Trigger transient "Saved ✓" text
  function triggerSavedBadge() {
    setSavedVisible(true)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => {
      setSavedVisible(false)
    }, 1500)
  }

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    }
  }, [])

  function handleChange(field, value) {
    updateSettings({ [field]: value })
    triggerSavedBadge()
  }

  function handleReset() {
    if (window.confirm('Reset all settings to default values?')) {
      updateSettings(DEFAULT_SETTINGS)
      triggerSavedBadge()
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <h1 className={styles.title}>Quiz Settings</h1>
          <div className={styles.savedBadgeWrapper} aria-live="polite">
            {savedVisible && <span className={styles.savedBadge}>Saved ✓</span>}
          </div>
        </div>
        <p className={styles.subtitle}>
          Personalize your trivia experience. Changes save automatically.
        </p>
      </header>

      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        {/* Player Name */}
        <section className={styles.section}>
          <label htmlFor="settings-player-name" className={styles.sectionLabel}>
            Player Name
          </label>
          <input
            id="settings-player-name"
            type="text"
            maxLength={20}
            value={settings.playerName}
            onChange={(e) => handleChange('playerName', e.target.value)}
            placeholder="Enter your name (max 20 chars)"
            className={styles.textInput}
          />
        </section>

        {/* Difficulty */}
        <section className={styles.section}>
          <span className={styles.sectionLabel}>Difficulty</span>
          <div className={styles.difficultyGrid} role="radiogroup" aria-label="Difficulty level">
            {DIFFICULTIES.map((diff) => {
              const isSelected = settings.difficulty === diff
              return (
                <button
                  key={diff}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleChange('difficulty', diff)}
                  className={`${styles.difficultyBtn} ${isSelected ? styles.activeDiffBtn : ''}`}
                >
                  <span className={styles.diffName}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </span>
                  <span className={styles.diffDesc}>
                    {DIFFICULTY_DESCRIPTIONS[diff]}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Question Amount */}
        <section className={styles.section}>
          <span className={styles.sectionLabel}>Number of Questions</span>
          <div className={styles.segmentedRow} role="radiogroup" aria-label="Number of questions">
            {QUESTION_AMOUNTS.map((amt) => {
              const isSelected = settings.amount === amt
              return (
                <button
                  key={amt}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleChange('amount', amt)}
                  className={`${styles.segmentBtn} ${isSelected ? styles.activeSegmentBtn : ''}`}
                >
                  {amt}
                </button>
              )
            })}
          </div>
        </section>

        {/* Category */}
        <section className={styles.section}>
          <label htmlFor="settings-category" className={styles.sectionLabel}>
            Trivia Category
          </label>
          <select
            id="settings-category"
            value={settings.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Any category</option>
            {loadingCategories ? (
              <option disabled>Loading categories…</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </section>


        {/* Action Buttons */}
        <div className={styles.bottomActions}>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetBtn}
          >
            Reset to defaults
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.quiz)}
            className={styles.startBtn}
          >
            Start Quiz
          </button>
        </div>
      </form>
    </div>
  )
}
