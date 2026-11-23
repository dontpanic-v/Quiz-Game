/**
 * main — Application entry point with BrowserRouter and QuizLibraryProvider.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QuizLibraryProvider } from './context/QuizLibraryContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QuizLibraryProvider>
        <App />
      </QuizLibraryProvider>
    </BrowserRouter>
  </StrictMode>,
)
