/**
 * QuizSetCard — Card displaying a custom quiz in the My Quizzes library.
 * PROPS: { quiz, onPlay, onEdit, onDelete }
 */
import styles from './QuizSetCard.module.css'

export default function QuizSetCard({ quiz, onPlay, onEdit, onDelete }) {
  const count = quiz.questions?.length || 0
  const questionLabel = count === 1 ? '1 question' : `${count} questions`
  const diff = (quiz.difficulty || 'easy').toLowerCase()
  const updatedDate = quiz.updatedAt ? new Date(quiz.updatedAt).toLocaleDateString() : ''

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{quiz.title}</h3>
          <span className={`${styles.badge} ${styles[diff] || styles.easy}`}>
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </span>
        </div>

        {quiz.description && (
          <p className={styles.description}>{quiz.description}</p>
        )}

        <div className={styles.meta}>
          <span className={styles.count}>{questionLabel}</span>
          {updatedDate && (
            <span className={styles.date}>Updated {updatedDate}</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onPlay}
          className={styles.playBtn}
          aria-label={`Play ${quiz.title}`}
        >
          Play
        </button>
        <button
          type="button"
          onClick={onEdit}
          className={styles.editBtn}
          aria-label={`Edit ${quiz.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={styles.deleteBtn}
          aria-label={`Delete ${quiz.title}`}
        >
          Delete
        </button>
      </div>
    </article>
  )
}
