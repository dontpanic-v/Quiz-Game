/**
 * useSettings
 * ───────────
 * FILE    src/hooks/useSettings.js
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   The only way components read SettingsContext.
 *
 * EXPORT
 *   export function useSettings()
 *   -> { settings, updateSettings, history, addResult, clearHistory }
 */
import { useContext } from 'react'
import { SettingsContext } from '../context/settingsContextObject.js'

export function useSettings() {
  const value = useContext(SettingsContext)
  if (value === null) {
    throw new Error('useSettings must be used inside <SettingsProvider>')
  }
  return value
}
