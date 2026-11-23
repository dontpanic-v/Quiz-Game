/**
 * Navbar — Top navigation bar with branding, route links, and theme toggle.
 */
import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { ROUTES, APP_NAME } from '../../siteConfig.js'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.dataset.theme || 'light'
      : 'light'
  )

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = next
    }
  }

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <header className={styles.navbarWrapper}>
      <nav className={styles.navbar} aria-label="Main">
        <Link to={ROUTES.home} className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandIcon}>⚡</span>
          <span className={styles.brandText}>{APP_NAME}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.desktopLinks}>
          <NavLink
            to={ROUTES.home}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to={ROUTES.myQuizzes}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
            }
          >
            My Quizzes
          </NavLink>
          <NavLink
            to={ROUTES.leaderboard}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to={ROUTES.settings}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
            }
          >
            Settings
          </NavLink>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={toggleTheme}
            className={styles.themeToggleBtn}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={styles.menuBtn}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <NavLink
            to={ROUTES.home}
            onClick={closeMenu}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.activeMobileNavLink : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to={ROUTES.myQuizzes}
            onClick={closeMenu}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.activeMobileNavLink : ''}`
            }
          >
            My Quizzes
          </NavLink>
          <NavLink
            to={ROUTES.leaderboard}
            onClick={closeMenu}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.activeMobileNavLink : ''}`
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to={ROUTES.settings}
            onClick={closeMenu}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.activeMobileNavLink : ''}`
            }
          >
            Settings
          </NavLink>
        </div>
      )}
    </header>
  )
}
