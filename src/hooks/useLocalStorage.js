/**
 * useLocalStorage
 * ───────────────
 * FILE    src/hooks/useLocalStorage.js
 * OWNER   tesroth (only tesroth edits this file)
 *
 * PURPOSE
 *   Same as useState, but the value is saved to localStorage and loaded back after
 *   a refresh. This is the app's data persistence. SettingsContext (settings,
 *   history) and QuizLibraryContext (custom quizzes) both use it.
 *
 * EXPORT
 *   export function useLocalStorage(key, initialValue) -> [value, setValue]
 *   setValue accepts a value OR a function (prev => next), exactly like useState.
 *
 * REQUIREMENTS
 *   1. useState with a lazy initializer: read localStorage.getItem(key), JSON.parse it;
 *      if missing or invalid -> initialValue
 *   2. If initialValue is a plain object (like DEFAULT_SETTINGS), return
 *      { ...initialValue, ...saved } so fields added later still get defaults
 *   3. useEffect([key, value]): localStorage.setItem(key, JSON.stringify(value))
 *   4. Every localStorage call inside try/catch: private mode, full storage or
 *      corrupted JSON must never crash the app (fall back to initialValue)
 *   5. Optional: listen to the 'storage' event so two open tabs stay in sync
 *      (remove the listener in the cleanup)
 *
 * DONE WHEN
 *   - value survives refresh; deleting the key in DevTools > Application resets it
 *   - putting invalid JSON in the key does not crash the app
 */
