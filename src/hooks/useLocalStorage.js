/**
 * useLocalStorage — persistent state synchronized with window.localStorage.
 * EXPORT: export function useLocalStorage(key, initialValue) -> [value, setValue]
 */
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue
      const item = window.localStorage.getItem(key)
      if (item === null) return initialValue
      const parsed = JSON.parse(item)
      if (
        typeof initialValue === 'object' &&
        initialValue !== null &&
        !Array.isArray(initialValue) &&
        typeof parsed === 'object' &&
        parsed !== null &&
        !Array.isArray(parsed)
      ) {
        return { ...initialValue, ...parsed }
      }
      return parsed
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch {
      // Ignore storage quota / private mode errors
    }
  }, [key, value])

  useEffect(() => {
    if (typeof window === 'undefined') return

    function handleStorage(e) {
      if (e.key === key && e.storageArea === window.localStorage) {
        try {
          if (e.newValue === null) {
            setValue(initialValue)
          } else {
            const parsed = JSON.parse(e.newValue)
            if (
              typeof initialValue === 'object' &&
              initialValue !== null &&
              !Array.isArray(initialValue) &&
              typeof parsed === 'object' &&
              parsed !== null &&
              !Array.isArray(parsed)
            ) {
              setValue({ ...initialValue, ...parsed })
            } else {
              setValue(parsed)
            }
          }
        } catch {
          setValue(initialValue)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, initialValue])

  return [value, setValue]
}
