/**
 * SettingsPage
 * ────────────
 * FILE    src/pages/SettingsPage.jsx  (+ SettingsPage.module.css)
 * OWNER   tesroth (only tesroth edits this file)
 * ROUTE   /settings
 *
 * PURPOSE
 *   Choose how the next Open Trivia quiz is played. Changes save automatically.
 *
 * EXPORT
 *   export default function SettingsPage()
 *
 * USES
 *   useSettings() -> { settings, updateSettings }
 *     settings = { playerName, difficulty, amount, category, theme }
 *   DIFFICULTIES, QUESTION_AMOUNTS, DEFAULT_SETTINGS from '../siteConfig.js'
 *   fetchCategories() from '../services/triviaApi.js'  (chea) -> [{ id, name }]
 *
 * REQUIREMENTS
 *   1. Player name: text input, max 20 characters
 *   2. Difficulty: 3 big toggle buttons Easy / Medium / Hard with a one-line
 *      description each (e.g. "Hard: 10s per question")
 *   3. Number of questions: segmented buttons from QUESTION_AMOUNTS
 *   4. Category: <select>, first option "Any category" (value '').
 *      Load options with fetchCategories() in a useEffect (ignore flag in cleanup);
 *      while loading show "Loading categories…"; on error only "Any category"
 *   5. Theme: Light / Dark toggle
 *   6. Every change calls updateSettings({ field: value }) immediately, and a small
 *      "Saved ✓" text shows briefly (useState + setTimeout in useEffect with cleanup)
 *   7. "Reset to defaults" button with window.confirm -> updateSettings(DEFAULT_SETTINGS)
 *   8. "Start Quiz" button at the bottom -> ROUTES.quiz
 *   9. Every input has a <label>; options are buttons or radios, not free text
 */
