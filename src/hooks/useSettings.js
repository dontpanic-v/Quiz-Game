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
 *
 * REQUIREMENTS
 *   1. return useContext(SettingsContext)
 *   2. if the value is null, throw Error('useSettings must be used inside <SettingsProvider>')
 */
