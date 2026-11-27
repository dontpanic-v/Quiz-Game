/**
 * QuestionEditor — Controlled form block for editing one custom question.
 * PROPS: { index, value, errors, onChange, onRemove, canRemove }
 */
import { X } from 'lucide-react'
import styles from './QuestionEditor.module.css'

export default function QuestionEditor({
  index,
  value,
  errors = {},
  onChange,
  onRemove,
  canRemove = true,
}) {
  const { question = '', answers = ['', ''], correctAnswer = '' } = value || {}

  function handleQuestionChange(e) {
    onChange({
      ...value,
      question: e.target.value,
    })
  }

  function handleAnswerTextChange(answerIdx, newText) {
    const nextAnswers = [...answers]
    const oldText = nextAnswers[answerIdx]
    nextAnswers[answerIdx] = newText

    const isCurrentCorrect = correctAnswer === oldText
    onChange({
      ...value,
      answers: nextAnswers,
      correctAnswer: isCurrentCorrect ? newText : correctAnswer,
    })
  }

  function handleRadioSelect(selectedAnswer) {
    onChange({
      ...value,
      correctAnswer: selectedAnswer,
    })
  }

  function handleAddAnswer() {
    if (answers.length >= 4) return
    onChange({
      ...value,
      answers: [...answers, ''],
    })
  }

  function handleRemoveAnswer(answerIdx) {
    if (answers.length <= 2) return
    const removedText = answers[answerIdx]
    const nextAnswers = answers.filter((_, idx) => idx !== answerIdx)
    const isRemovedCorrect = correctAnswer === removedText

    onChange({
      ...value,
      answers: nextAnswers,
      correctAnswer: isRemovedCorrect ? '' : correctAnswer,
    })
  }

  const questionInputId = `q-text-${index}`
  const questionErrorId = `q-err-${index}`
  const answersErrorId = `ans-err-${index}`
  const correctErrorId = `cor-err-${index}`

  return (
    <fieldset className={styles.fieldset}>
      <div className={styles.header}>
        <legend className={styles.legend}>Question {index + 1}</legend>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={styles.removeQuestionBtn}
            aria-label={`Remove question ${index + 1}`}
          >
            Remove Question
          </button>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor={questionInputId} className={styles.label}>
          Question prompt <span className={styles.required}>*</span>
        </label>
        <textarea
          id={questionInputId}
          value={question}
          onChange={handleQuestionChange}
          placeholder="e.g. What is the capital of France?"
          rows={3}
          className={`${styles.textarea} ${errors.question ? styles.inputError : ''}`}
          aria-invalid={Boolean(errors.question)}
          aria-describedby={errors.question ? questionErrorId : undefined}
        />
        {errors.question && (
          <p id={questionErrorId} className={styles.errorText}>
            {errors.question}
          </p>
        )}
      </div>

      <div className={styles.answersSection}>
        <div className={styles.answersHeader}>
          <span className={styles.answersTitle}>
            Answers (2–4 options, choose the correct one) <span className={styles.required}>*</span>
          </span>
        </div>

        {errors.answers && (
          <p id={answersErrorId} className={styles.errorText}>
            {errors.answers}
          </p>
        )}

        {errors.correctAnswer && (
          <p id={correctErrorId} className={styles.errorText}>
            {errors.correctAnswer}
          </p>
        )}

        <div className={styles.answersList}>
          {answers.map((answer, aIdx) => {
            const isCorrect = correctAnswer !== '' && correctAnswer === answer
            const answerInputId = `q-${index}-ans-${aIdx}`
            const radioId = `q-${index}-rad-${aIdx}`

            return (
              <div key={aIdx} className={styles.answerRow}>
                <input
                  type="radio"
                  id={radioId}
                  name={`correct-answer-${index}`}
                  value={answer}
                  checked={isCorrect}
                  onChange={() => handleRadioSelect(answer)}
                  className={styles.radioInput}
                  aria-label={`Mark option ${aIdx + 1} as correct answer`}
                />
                <label htmlFor={answerInputId} className={styles.srOnly}>
                  Option {aIdx + 1}
                </label>
                <input
                  type="text"
                  id={answerInputId}
                  value={answer}
                  onChange={(e) => handleAnswerTextChange(aIdx, e.target.value)}
                  placeholder={`Option ${aIdx + 1}`}
                  className={`${styles.answerInput} ${isCorrect ? styles.correctInput : ''}`}
                />
                {answers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAnswer(aIdx)}
                    className={styles.removeAnswerBtn}
                    aria-label={`Remove option ${aIdx + 1}`}
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                )}
              </div>
            )
          })}

          {/* Last row adds an option, styled like an empty option. */}
          {answers.length < 4 && (
            <button type="button" onClick={handleAddAnswer} className={styles.addOptionRow}>
              <span className={styles.addOptionCircle} aria-hidden="true" />
              Add option
            </button>
          )}
        </div>
      </div>
    </fieldset>
  )
}
