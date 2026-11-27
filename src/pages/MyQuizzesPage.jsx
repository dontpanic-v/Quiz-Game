/**
 * MyQuizzesPage — Library of player-created quizzes with search, play, edit and delete.
 * ROUTE: /my-quizzes
 */
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../siteConfig.js'
import { useQuizLibrary } from '../hooks/useQuizLibrary.js'
import QuizSetCard from '../components/QuizBuilder/QuizSetCard.jsx'
import BackButton from '../components/Layout/BackButton.jsx'
import ConfirmDialog from '../components/Layout/ConfirmDialog.jsx'
import styles from './MyQuizzesPage.module.css'

export default function MyQuizzesPage() {
  const navigate = useNavigate()
  const { quizzes = [], deleteQuiz } = useQuizLibrary()
  const [searchQuery, setSearchQuery] = useState('')
  const [quizToDelete, setQuizToDelete] = useState(null)

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

  function handleConfirmDelete() {
    deleteQuiz(quizToDelete.id)
    setQuizToDelete(null)
  }

  return (
    <div className={styles.container}>
      <BackButton to={ROUTES.home}>Home</BackButton>

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

        {/* Toolbar: Search */}
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
              onDelete={() => setQuizToDelete(quiz)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={quizToDelete !== null}
        title="Delete this quiz?"
        message={
          quizToDelete
            ? `"${quizToDelete.title}" and its ${quizToDelete.questions?.length ?? 0} questions will be deleted. This can't be undone.`
            : ''
        }
        confirmLabel="Delete quiz"
        cancelLabel="Keep quiz"
        onConfirm={handleConfirmDelete}
        onCancel={() => setQuizToDelete(null)}
      />
    </div>
  )
}
