/**
 * SettingsContext
 * ───────────────
 * FILE    src/context/SettingsContext.jsx
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   Global, persistent app data: the player's settings and the history of finished
 *   games. Saved to localStorage so it survives refresh and closing the browser.
 *
 * EXPORT
 *   export function SettingsProvider({ children })
 *   The context object lives in ./settingsContextObject.js (ESLint react-refresh rule).
 *
 * CONTEXT VALUE (read by others through useSettings())
 *   settings        { playerName, source, difficulty, amount, category }
 *   updateSettings  (changes) => void            merge changes into settings
 *   history         Result[]                     newest first
 *   addResult       (result without id) => void  adds id via crypto.randomUUID(), puts it first
 *   clearHistory    () => void
 *
 *   Result = { id, playerName, quizTitle, difficulty, score, total, date (ISO string) }
 */
import { useCallback, useMemo } from 'react'
import { SettingsContext } from './settingsContextObject.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { DEFAULT_SETTINGS, QUESTION_AMOUNTS, STORAGE_KEYS } from '../siteConfig.js'

const EMPTY_HISTORY = []

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.history, EMPTY_HISTORY)

  const updateSettings = useCallback(
    (changes) => setSettings((prev) => ({ ...prev, ...changes })),
    [setSettings],
  )

  const addResult = useCallback(
    (result) =>
      setHistory((prev) => [
        { ...result, id: crypto.randomUUID() },
        ...(Array.isArray(prev) ? prev : []),
      ]),
    [setHistory],
  )

  const clearHistory = useCallback(() => setHistory([]), [setHistory])

  // An amount saved before the options changed (e.g. 20) falls back to the default.
  const safeSettings = useMemo(
    () =>
      QUESTION_AMOUNTS.includes(settings.amount)
        ? settings
        : { ...settings, amount: DEFAULT_SETTINGS.amount },
    [settings],
  )

  const value = useMemo(
    () => ({
      settings: safeSettings,
      updateSettings,
      history: Array.isArray(history) ? history : [],
      addResult,
      clearHistory,
    }),
    [safeSettings, updateSettings, history, addResult, clearHistory],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
