/**
 * main
 * ────
 * FILE    src/main.jsx
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   Entry point. Wraps the app in the router and all context providers:
 *   <BrowserRouter> > <SettingsProvider> > <QuizLibraryProvider> > <QuizProvider> > <App />
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { QuizLibraryProvider } from './context/QuizLibraryContext.jsx'
import { QuizProvider } from './context/QuizContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <QuizLibraryProvider>
          <QuizProvider>
            <App />
          </QuizProvider>
        </QuizLibraryProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
