/**
 * ConfirmDialog
 * ─────────────
 * FILE    src/components/Layout/ConfirmDialog.jsx  (+ ConfirmDialog.module.css)
 * OWNER   dontpanic
 *
 * PURPOSE
 *   Accessible "are you sure" dialog for actions that lose something, built on the
 *   native <dialog> element (focus stays inside, Escape closes, page behind is inert).
 *
 * EXPORT
 *   export default function ConfirmDialog({
 *     open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel,
 *   })
 *
 * DESIGN RULES
 *   - Title asks the specific question ("Leave this quiz?"), message says what is lost.
 *   - Buttons are verbs, never Yes / No / OK.
 *   - The safe choice (cancel) is the primary button and gets focus when the dialog
 *     opens, so pressing Enter by accident never confirms the destructive action.
 *   - Escape and a click on the backdrop both cancel.
 *   - Focus returns to the element that opened the dialog when it closes.
 */
import { useEffect, useId, useRef } from 'react'
import styles from './ConfirmDialog.module.css'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)
  const openerRef = useRef(null)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      openerRef.current = document.activeElement
      dialog.showModal()
      cancelRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
      const opener = openerRef.current
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [open])

  // Escape key: keep React in charge of closing.
  function handleCancelEvent(event) {
    event.preventDefault()
    onCancel()
  }

  // The browser can still close the dialog on its own (e.g. a second Escape).
  function handleClose() {
    if (open) onCancel()
  }

  // A click on the dialog element itself (not its content) is a click on the backdrop.
  function handleClick(event) {
    if (event.target === dialogRef.current) onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={handleCancelEvent}
      onClose={handleClose}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p id={messageId} className={styles.message}>
          {message}
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button
            ref={cancelRef}
            type="button"
            className={`button ${styles.cancelBtn}`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
