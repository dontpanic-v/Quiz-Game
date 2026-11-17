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
 *   The context object itself goes in a separate file (e.g. src/context/settingsContextObject.js)
 *   so this file only exports components (ESLint react-refresh rule).
 *
 * USES
 *   useLocalStorage(key, initialValue) from '../hooks/useLocalStorage.js'   (tesroth)
 *     -> [value, setValue], same as useState but saved to localStorage
 *     If not ready yet, use useState temporarily.
 *   DEFAULT_SETTINGS, STORAGE_KEYS from '../siteConfig.js'
 *
 * CONTEXT VALUE (read by others through useSettings())
 *   settings        { playerName, difficulty, amount, category, theme }
 *   updateSettings  (changes) => void          merge changes into settings
 *   history         Result[]                   newest first
 *   addResult       (result without id) => void  adds id via crypto.randomUUID(), puts it first
 *   clearHistory    () => void
 *
 *   Result = { id, playerName, quizTitle, difficulty, score, total, date (ISO string) }
 *
 * REQUIREMENTS
 *   1. settings = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
 *   2. history  = useLocalStorage(STORAGE_KEYS.history, [])
 *   3. updateSettings / addResult / clearHistory wrapped in useCallback,
 *      always using the functional form of the setter: setX(prev => ...)
 *   4. useEffect: whenever settings.theme changes,
 *      document.documentElement.dataset.theme = settings.theme   (CSS reads [data-theme])
 *   5. context value wrapped in useMemo
 *
 * DONE WHEN
 *   - changing a setting on SettingsPage, then refreshing, keeps the change
 *   - switching theme changes colors immediately on every page
 */
