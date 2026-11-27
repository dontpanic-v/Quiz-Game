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
 *   - While a quiz is playing, a link click calls requestLeave(to) instead of navigating;
 *     QuizPage then shows the "Leave this quiz?" dialog
 */
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { APP_NAME, ROUTES } from '../../siteConfig.js'
import { Menu, X } from 'lucide-react'
import { useQuiz } from '../../hooks/useQuiz.js'
import styles from './Navbar.module.css'

const LINKS = [
  { to: ROUTES.home, label: 'Home' },
  { to: ROUTES.myQuizzes, label: 'My Quizzes' },
  { to: ROUTES.leaderboard, label: 'Leaderboard' },
  { to: ROUTES.settings, label: 'Settings' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { status, requestLeave } = useQuiz()

  // Runs on every link click. Mid-game, hold the navigation and let QuizPage ask
  // "Leave this quiz?" (the same dialog as its own Leave button, with the timer paused).
  function handleNavigate(event, to) {
    setIsOpen(false)
    if (status === 'playing') {
      event.preventDefault()
      requestLeave(to)
    }
  }

  function linkClass(base, active) {
    return ({ isActive }) => (isActive ? `${base} ${active}` : base)
  }

  return (
    <header className={styles.navbarWrapper}>
      <nav className={styles.navbar} aria-label="Main">
        <Link
          to={ROUTES.home}
          className={styles.brand}
          onClick={(event) => handleNavigate(event, ROUTES.home)}
        >
          <span>{APP_NAME}</span>
        </Link>

        <div className={styles.desktopLinks}>
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.home}
              onClick={(event) => handleNavigate(event, to)}
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
            {isOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
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
              onClick={(event) => handleNavigate(event, to)}
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
