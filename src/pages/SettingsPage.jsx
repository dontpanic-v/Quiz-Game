/**
 * SettingsPage — Configure player preferences, difficulty, question count, and category.
 * ROUTE: /settings
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DIFFICULTIES,
  QUESTION_AMOUNTS,
  QUESTION_SOURCES,
  OPEN_TRIVIA_CATEGORIES,
  DEFAULT_SETTINGS,
  ROUTES,
} from '../siteConfig.js'
import { useSettings } from '../hooks/useSettings.js'
import { CAMBODIA_CATEGORIES, countCambodiaQuestions } from '../data/cambodia/index.js'
import BackButton from '../components/Layout/BackButton.jsx'
import ConfirmDialog from '../components/Layout/ConfirmDialog.jsx'
import styles from './SettingsPage.module.css'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettings()

  const [savedVisible, setSavedVisible] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const savedTimerRef = useRef(null)

  // Show the "Saved" badge for a moment
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

  // Category ids differ per source, so switching source resets the category.
  function handleSourceChange(source) {
    if (source === settings.source) return
    updateSettings({ source, category: '' })
    triggerSavedBadge()
  }

  const isCambodia = settings.source === 'cambodia'
  const categoryOptions = isCambodia ? CAMBODIA_CATEGORIES : OPEN_TRIVIA_CATEGORIES
  // A category saved before the list was shortened shows as "Any category".
  const categoryValue = categoryOptions.some((c) => c.id === settings.category)
    ? settings.category
    : ''
  const cambodiaCount = isCambodia
    ? countCambodiaQuestions({ difficulty: settings.difficulty, category: categoryValue })
    : 0

  function handleConfirmReset() {
    updateSettings(DEFAULT_SETTINGS)
    setConfirmReset(false)
    triggerSavedBadge()
  }

  return (
    <div className={styles.container}>
      <BackButton to={ROUTES.home}>Home</BackButton>

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

        {/* Question Source */}
        <section className={styles.section}>
          <span className={styles.sectionLabel}>Question Source</span>
          <div className={styles.segmentedRow} role="radiogroup" aria-label="Question source">
            {QUESTION_SOURCES.map(({ id, label }) => {
              const isSelected = settings.source === id
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSourceChange(id)}
                  className={`${styles.segmentBtn} ${isSelected ? styles.activeSegmentBtn : ''}`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Difficulty */}
        <section className={styles.section}>
          <span className={styles.sectionLabel}>Difficulty</span>
          <div className={styles.segmentedRow} role="radiogroup" aria-label="Difficulty">
            {DIFFICULTIES.map((diff) => {
              const isSelected = settings.difficulty === diff
              return (
                <button
                  key={diff}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleChange('difficulty', diff)}
                  className={`${styles.segmentBtn} ${isSelected ? styles.activeSegmentBtn : ''}`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
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
            Category
          </label>
          <select
            id="settings-category"
            value={categoryValue}
            onChange={(e) => handleChange('category', e.target.value)}
            className={styles.selectInput}
            aria-describedby={isCambodia ? 'settings-category-hint' : undefined}
          >
            <option value="">Any category</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {isCambodia && (
            <p id="settings-category-hint" className={styles.hint}>
              {cambodiaCount === 0
                ? `No ${settings.difficulty} questions here yet.`
                : cambodiaCount < settings.amount
                  ? `${cambodiaCount} ${settings.difficulty} questions available, so a game uses all ${cambodiaCount}.`
                  : `${cambodiaCount} ${settings.difficulty} questions available.`}
            </p>
          )}
        </section>


        {/* Action Buttons */}
        <div className={styles.bottomActions}>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
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

      <ConfirmDialog
        open={confirmReset}
        title="Reset all settings?"
        message="Your name, question source, difficulty, number of questions and category will go back to the defaults."
        confirmLabel="Reset settings"
        cancelLabel="Keep my settings"
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  )
}
