/**
 * Navbar
 * ──────
 * FILE    src/components/Layout/Navbar.jsx  (+ Navbar.module.css)
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   Top navigation visible on every page.
 *
 * EXPORT
 *   export default function Navbar()
 *
 * BEHAVIOR
 *   - App name on the left, links to Home, My Quizzes, Leaderboard, Settings
 *   - Active link is highlighted
 *   - Under 640px links collapse behind a menu button; menu closes after a click
 *   - While a quiz is playing, leaving asks for confirmation first
 */
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { APP_NAME, ROUTES } from '../../siteConfig.js'
import { useQuiz } from '../../hooks/useQuiz.js'
import styles from './Navbar.module.css'

const LINKS = [
  { to: ROUTES.home, label: 'Home' },
  { to: ROUTES.myQuizzes, label: 'My Quizzes' },
  { to: ROUTES.leaderboard, label: 'Leaderboard' },
  { to: ROUTES.settings, label: 'Settings' },
]

const LEAVE_MESSAGE = 'Leave the quiz? Your progress will be lost.'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { status } = useQuiz()

  // Runs on every link click: stops navigation if the player cancels leaving a quiz.
  function handleNavigate(event) {
    if (status === 'playing' && !window.confirm(LEAVE_MESSAGE)) {
      event.preventDefault()
      return
    }
    setIsOpen(false)
  }

  function linkClass(base, active) {
    return ({ isActive }) => (isActive ? `${base} ${active}` : base)
  }

  return (
    <header className={styles.navbarWrapper}>
      <nav className={styles.navbar} aria-label="Main">
        <Link to={ROUTES.home} className={styles.brand} onClick={handleNavigate}>
          <span>{APP_NAME}</span>
        </Link>

        <div className={styles.desktopLinks}>
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.home}
              onClick={handleNavigate}
              className={linkClass(styles.navLink, styles.activeNavLink)}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.home}
              onClick={handleNavigate}
              className={linkClass(styles.mobileNavLink, styles.activeNavLink)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
