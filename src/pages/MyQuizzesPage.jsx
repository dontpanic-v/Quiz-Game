/**
 * MyQuizzesPage — Library of player-created quizzes with search, play, edit, delete, export/import.
 * ROUTE: /my-quizzes
 */
import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../siteConfig.js'
import { useQuizLibrary } from '../hooks/useQuizLibrary.js'
import QuizSetCard from '../components/QuizBuilder/QuizSetCard.jsx'
import styles from './MyQuizzesPage.module.css'

export default function MyQuizzesPage() {
  const navigate = useNavigate()
  const { quizzes = [], deleteQuiz, createQuiz } = useQuizLibrary()
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef(null)

  // Real-time title search calculation during render
  const filteredQuizzes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return quizzes
    return quizzes.filter((item) =>
      item.title?.toLowerCase().includes(q)
    )
  }, [quizzes, searchQuery])

  function handlePlay(quizId) {
    navigate(`${ROUTES.quiz}?set=${quizId}`)
  }

  function handleEdit(quizId) {
    navigate(`${ROUTES.create}/${quizId}`)
  }

  function handleDelete(quiz) {
    if (window.confirm(`Delete "${quiz.title}"? This cannot be undone.`)) {
      deleteQuiz(quiz.id)
    }
  }

  // Bonus feature: Export quiz library to .json
  function handleExportLibrary() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(quizzes, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `quiz-library-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Bonus feature: Import quizzes from .json
  function handleFileImport(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result)
        const quizList = Array.isArray(imported) ? imported : [imported]
        let addedCount = 0

        quizList.forEach((q) => {
          if (q.title && Array.isArray(q.questions) && q.questions.length > 0) {
            createQuiz({
              title: q.title,
              description: q.description || '',
              difficulty: q.difficulty || 'easy',
              questions: q.questions,
            })
            addedCount++
          }
        })

        alert(`Successfully imported ${addedCount} quiz${addedCount === 1 ? '' : 'zes'}!`)
      } catch {
        alert('Invalid JSON file format. Could not import quizzes.')
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>My Quizzes</h1>
            <p className={styles.subtitle}>
              Create, manage, and play your own custom quiz sets.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.create)}
              className={styles.createBtn}
            >
              + Create new quiz
            </button>
          </div>
        </div>

        {/* Toolbar: Search + Export/Import */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <label htmlFor="quiz-search-input" className={styles.srOnly}>
              Search quizzes
            </label>
            <input
              id="quiz-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quizzes by title…"
              className={styles.searchInput}
            />
          </div>

          <div className={styles.backupActions}>
            <button
              type="button"
              onClick={handleExportLibrary}
              disabled={quizzes.length === 0}
              className={styles.toolBtn}
              title="Download all quizzes as a JSON file"
            >
              Export JSON
            </button>
            <label className={styles.toolBtn}>
              Import JSON
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className={styles.hiddenFileInput}
              />
            </label>
          </div>
        </div>
      </header>

      {/* Grid of Quizzes or Empty States */}
      {quizzes.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>You haven't made any quizzes yet.</p>
          <p className={styles.emptyDesc}>
            Write your own multiple-choice quiz and test yourself or friends!
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.create)}
            className={styles.emptyActionBtn}
          >
            Create your first quiz
          </button>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>
            No quizzes match &quot;{searchQuery}&quot;
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={styles.clearSearchBtn}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredQuizzes.map((quiz) => (
            <QuizSetCard
              key={quiz.id}
              quiz={quiz}
              onPlay={() => handlePlay(quiz.id)}
              onEdit={() => handleEdit(quiz.id)}
              onDelete={() => handleDelete(quiz)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
