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
import styles from './BackButton.module.css'

function ChevronLeft() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function BackButton({ to, onClick, children }) {
  if (onClick) {
    return (
      <button type="button" className={styles.back} onClick={onClick}>
        <ChevronLeft />
        {children}
      </button>
    )
  }

  return (
    <Link to={to} className={styles.back}>
      <ChevronLeft />
      {children}
    </Link>
  )
}
