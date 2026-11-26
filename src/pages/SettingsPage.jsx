/**
 * SettingsPage — Configure player preferences, difficulty, question count, category, and theme.
 * ROUTE: /settings
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DIFFICULTIES,
  QUESTION_AMOUNTS,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  ROUTES,
} from '../siteConfig.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import styles from './SettingsPage.module.css'

// TEMP mock until src/services/triviaApi.js is ready
async function fetchCategoriesFallback() {
  try {
    const res = await fetch('https://opentdb.com/api_category.php')
    if (!res.ok) throw new Error('API failed')
    const data = await res.json()
    return data.trivia_categories || []
  } catch {
    return []
  }
}

// TEMP mock until src/hooks/useSettings.js is ready
function useSettingsFallback() {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)

  const updateSettings = useCallback(
    (changes) => {
      setSettings((prev) => {
        const next = { ...prev, ...changes }
        if (changes.theme) {
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.theme = changes.theme
          }
        }
        return next
      })
    },
    [setSettings]
  )

  return { settings, updateSettings }
}

const DIFFICULTY_DESCRIPTIONS = {
  easy: 'Casual and relaxed pace',
  medium: 'Standard trivia challenge',
  hard: 'High intensity: 10s per question',
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettingsFallback()

  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [savedVisible, setSavedVisible] = useState(false)
  const savedTimerRef = useRef(null)

  // Fetch categories with ignore cleanup
  useEffect(() => {
    let ignore = false

    fetchCategoriesFallback().then((cats) => {
      if (!ignore) {
        setCategories(cats)
        setLoadingCategories(false)
      }
    })

    return () => {
      ignore = true
    }
  }, [])

  // Sync theme with document dataset
  useEffect(() => {
    if (typeof document !== 'undefined' && settings.theme) {
      document.documentElement.dataset.theme = settings.theme
    }
  }, [settings.theme])

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

        {/* Theme Toggle */}
        <section className={styles.section}>
          <span className={styles.sectionLabel}>Theme</span>
          <div className={styles.themeToggleRow} role="radiogroup" aria-label="Theme selection">
            <button
              type="button"
              role="radio"
              aria-checked={settings.theme === 'light'}
              onClick={() => handleChange('theme', 'light')}
              className={`${styles.themeBtn} ${settings.theme === 'light' ? styles.activeThemeBtn : ''}`}
            >
              ☀️ Light
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={settings.theme === 'dark'}
              onClick={() => handleChange('theme', 'dark')}
              className={`${styles.themeBtn} ${settings.theme === 'dark' ? styles.activeThemeBtn : ''}`}
            >
              🌙 Dark
            </button>
          </div>
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
