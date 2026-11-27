/**
 * CreateQuizPage — Form to create or edit custom quizzes.
 * ROUTE: /create (new quiz) & /create/:quizId (edit mode)
 */
import { useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { DIFFICULTIES, ROUTES } from '../siteConfig.js'
import { useQuizLibrary } from '../hooks/useQuizLibrary.js'
import QuestionEditor from '../components/QuizBuilder/QuestionEditor.jsx'
import { Plus } from 'lucide-react'
import BackButton from '../components/Layout/BackButton.jsx'
import ConfirmDialog from '../components/Layout/ConfirmDialog.jsx'
import styles from './CreateQuizPage.module.css'

function createEmptyQuestion() {
  return {
    id: crypto.randomUUID(),
    question: '',
    answers: ['', '', '', ''],
    correctAnswer: '',
  }
}

export default function CreateQuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { getQuiz, createQuiz, updateQuiz } = useQuizLibrary()

  const isEditMode = Boolean(quizId)
  const existing = isEditMode ? getQuiz(quizId) : null
  const notFound = isEditMode && !existing

  const [isDirty, setIsDirty] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  // Form state initialized with existing quiz or blank defaults
  const [title, setTitle] = useState(() => existing?.title || '')
  const [description, setDescription] = useState(() => existing?.description || '')
  const [difficulty, setDifficulty] = useState(() => existing?.difficulty || 'easy')
  const [questions, setQuestions] = useState(() =>
    existing?.questions?.length
      ? existing.questions.map((q) => ({
          id: q.id || crypto.randomUUID(),
          question: q.question,
          answers: [...q.answers],
          correctAnswer: q.correctAnswer,
        }))
      : [createEmptyQuestion()]
  )
  const [errors, setErrors] = useState({})

  // Track previous quizId to reset form if the route param changes
  const [prevQuizId, setPrevQuizId] = useState(quizId)
  if (quizId !== prevQuizId) {
    setPrevQuizId(quizId)
    if (existing) {
      setTitle(existing.title || '')
      setDescription(existing.description || '')
      setDifficulty(existing.difficulty || 'easy')
      setQuestions(
        existing.questions?.length
          ? existing.questions.map((q) => ({
              id: q.id || crypto.randomUUID(),
              question: q.question,
              answers: [...q.answers],
              correctAnswer: q.correctAnswer,
            }))
          : [createEmptyQuestion()]
      )
    } else {
      setTitle('')
      setDescription('')
      setDifficulty('easy')
      setQuestions([createEmptyQuestion()])
    }
  }

  // Form container ref to scroll first invalid field into view
  const formRef = useRef(null)

  // Question manipulation
  function handleQuestionChange(index, nextQuestion) {
    setIsDirty(true)
    setQuestions((prev) => {
      const next = [...prev]
      next[index] = nextQuestion
      return next
    })
  }

  function handleAddQuestion() {
    if (questions.length >= 50) return
    setIsDirty(true)
    setQuestions((prev) => [...prev, createEmptyQuestion()])
  }

  function handleRemoveQuestion(index) {
    if (questions.length <= 1) return
    setIsDirty(true)
    setQuestions((prev) => prev.filter((_, idx) => idx !== index))
  }

  function validateForm() {
    const errs = { questions: {} }
    let hasError = false

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      errs.title = 'Title is required'
      hasError = true
    } else if (trimmedTitle.length > 60) {
      errs.title = 'Title must be 60 characters or fewer'
      hasError = true
    }

    questions.forEach((q, idx) => {
      const qErrs = {}
      if (!q.question.trim()) {
        qErrs.question = 'Question prompt is required'
        hasError = true
      }

      // Filter non-empty answers
      const nonEmptyAnswers = q.answers.map((a) => a.trim()).filter(Boolean)
      if (nonEmptyAnswers.length < 2) {
        qErrs.answers = 'Provide at least 2 non-empty answers'
        hasError = true
      } else if (nonEmptyAnswers.length > 4) {
        qErrs.answers = 'Maximum 4 answers allowed'
        hasError = true
      }

      // Check duplicates (case-insensitive)
      const lowerAnswers = nonEmptyAnswers.map((a) => a.toLowerCase())
      const uniqueCount = new Set(lowerAnswers).size
      if (uniqueCount !== nonEmptyAnswers.length) {
        qErrs.answers = 'Answers must all be unique'
        hasError = true
      }

      // Check correct answer selected and matches one of the answers
      if (!q.correctAnswer || !q.correctAnswer.trim()) {
        qErrs.correctAnswer = 'Please mark the correct answer'
        hasError = true
      } else if (!nonEmptyAnswers.includes(q.correctAnswer.trim())) {
        qErrs.correctAnswer = 'Marked correct answer must match one of the non-empty options'
        hasError = true
      }

      if (Object.keys(qErrs).length > 0) {
        errs.questions[idx] = qErrs
      }
    })

    return { isValid: !hasError, errs }
  }

  function handleSave(e) {
    e.preventDefault()
    const { isValid, errs } = validateForm()

    if (!isValid) {
      setErrors(errs)
      // Scroll first error into view
      setTimeout(() => {
        const firstInvalid = formRef.current?.querySelector('[aria-invalid="true"]')
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' })
          firstInvalid.focus()
        }
      }, 50)
      return
    }

    setErrors({})

    // Clean empty answer entries
    const cleanedQuestions = questions.map((q) => {
      const validAnswers = q.answers.map((a) => a.trim()).filter(Boolean)
      return {
        id: q.id || crypto.randomUUID(),
        question: q.question.trim(),
        answers: validAnswers,
        correctAnswer: q.correctAnswer.trim(),
      }
    })

    const payload = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      questions: cleanedQuestions,
    }

    if (isEditMode) {
      updateQuiz(quizId, payload)
    } else {
      createQuiz(payload)
    }

    navigate(ROUTES.myQuizzes)
  }

  // Leaving with unsaved edits asks first; with nothing changed it just goes back.
  function handleCancel() {
    if (isDirty) {
      setConfirmDiscard(true)
      return
    }
    navigate(ROUTES.myQuizzes)
  }

  if (notFound) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Quiz not found</h2>
        <p>The quiz you are trying to edit does not exist or has been deleted.</p>
        <Link to={ROUTES.myQuizzes} className={styles.backLink}>
          Back to My Quizzes
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <BackButton onClick={handleCancel}>My Quizzes</BackButton>

      <header className={styles.header}>
        <h1 className={styles.title}>
          {isEditMode ? 'Edit Quiz' : 'Create Quiz'}
        </h1>
        <p className={styles.subtitle}>
          Build a custom multiple-choice quiz set with your own questions and answers.
        </p>
      </header>

      <form ref={formRef} onSubmit={handleSave} className={styles.form} noValidate>
        {/* Title */}
        <div className={styles.fieldGroup}>
          <label htmlFor="quiz-title-input" className={styles.label}>
            Quiz Title <span className={styles.required}>*</span>
          </label>
          <input
            id="quiz-title-input"
            type="text"
            maxLength={60}
            value={title}
            onChange={(e) => {
              setIsDirty(true)
              setTitle(e.target.value)
            }}
            placeholder="e.g. JavaScript Fundamentals"
            className={`${styles.textInput} ${errors.title ? styles.inputError : ''}`}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-err' : undefined}
          />
          <div className={styles.fieldMeta}>
            {errors.title ? (
              <span id="title-err" className={styles.errorText}>
                {errors.title}
              </span>
            ) : (
              <span />
            )}
            <span className={styles.charCount}>{title.length}/60</span>
          </div>
        </div>

        {/* Description */}
        <div className={styles.fieldGroup}>
          <label htmlFor="quiz-desc-input" className={styles.label}>
            Description (Optional)
          </label>
          <textarea
            id="quiz-desc-input"
            rows={2}
            value={description}
            onChange={(e) => {
              setIsDirty(true)
              setDescription(e.target.value)
            }}
            placeholder="A brief summary of what this quiz covers…"
            className={styles.textarea}
          />
        </div>

        {/* Difficulty */}
        <div className={styles.fieldGroup}>
          <span className={styles.label}>Difficulty</span>
          <div className={styles.difficultyGroup} role="radiogroup" aria-label="Difficulty level">
            {DIFFICULTIES.map((diff) => {
              const isSelected = difficulty === diff
              return (
                <button
                  key={diff}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setIsDirty(true)
                    setDifficulty(diff)
                  }}
                  className={`${styles.diffBtn} ${isSelected ? styles.activeDiffBtn : ''}`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Question Editors */}
        <div className={styles.questionsSection}>
          <div className={styles.questionsHeader}>
            <h2 className={styles.sectionHeading}>
              Questions ({questions.length}/50)
            </h2>
            {questions.length < 50 && (
              <button
                type="button"
                onClick={handleAddQuestion}
                className={styles.addQuestionBtn}
              >
                <Plus size={18} aria-hidden="true" /> Add Question
              </button>
            )}
          </div>

          <div className={styles.questionList}>
            {questions.map((q, idx) => (
              <QuestionEditor
                key={q.id || idx}
                index={idx}
                value={q}
                errors={errors.questions?.[idx] || {}}
                onChange={(nextVal) => handleQuestionChange(idx, nextVal)}
                onRemove={() => handleRemoveQuestion(idx)}
                canRemove={questions.length > 1}
              />
            ))}
          </div>

          {questions.length < 50 && (
            <button
              type="button"
              onClick={handleAddQuestion}
              className={styles.bottomAddQuestionBtn}
            >
              <Plus size={18} aria-hidden="true" /> Add Question
            </button>
          )}
        </div>

        {/* Form Footer Actions */}
        <div className={styles.footerActions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn}>
            {isEditMode ? 'Update Quiz' : 'Save Quiz'}
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmDiscard}
        title="Discard your changes?"
        message={
          isEditMode
            ? "Your edits to this quiz haven't been saved and will be lost."
            : "This new quiz hasn't been saved and will be lost."
        }
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        onConfirm={() => navigate(ROUTES.myQuizzes)}
        onCancel={() => setConfirmDiscard(false)}
      />
    </div>
  )
}
