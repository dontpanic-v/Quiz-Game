/**
 * BackButton
 * ──────────
 * FILE    src/components/Layout/BackButton.jsx  (+ BackButton.module.css)
 * OWNER   dontpanic
 *
 * PURPOSE
 *   Quiet "go back" control for the top-left corner of a page, where people look for it.
 *
 * EXPORT
 *   export default function BackButton({ to, onClick, children })
 *     to        path to go to (renders a link)
 *     onClick   handler instead of a link, e.g. to ask before leaving unsaved work
 *     children  label, e.g. "Home" or "My Quizzes"
 *
 * RULES
 *   - Always pass a fixed parent page in `to`; do not use history.back(), which can
 *     leave the app if the page was opened directly.
 */
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import styles from './BackButton.module.css'

export default function BackButton({ to, onClick, children }) {
  const icon = <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />

  if (onClick) {
    return (
      <button type="button" className={styles.back} onClick={onClick}>
        {icon}
        {children}
      </button>
    )
  }

  return (
    <Link to={to} className={styles.back}>
      {icon}
      {children}
    </Link>
  )
}
