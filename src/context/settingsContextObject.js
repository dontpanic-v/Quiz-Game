/**
 * settingsContextObject
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * The React Context object for SettingsContext. Kept in its own file so
 * SettingsContext.jsx only exports components (ESLint react-refresh rule).
 * Read it through useSettings(), never directly.
 */
import { createContext } from 'react'

export const SettingsContext = createContext(null)
