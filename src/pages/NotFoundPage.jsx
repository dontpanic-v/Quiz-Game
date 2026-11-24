/**
 * NotFoundPage
 * ────────────
 * FILE    src/pages/NotFoundPage.jsx  (+ NotFoundPage.module.css)
 * OWNER   dontpanic (only dontpanic edits this file)
 * ROUTE   *  (any unknown URL)
 *
 * EXPORT
 *   export default function NotFoundPage()
 *
 * BEHAVIOR
 *   Friendly "Page not found" heading, short message, link back to Home.
 */
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../siteConfig.js'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <section className={styles.page}>
      <p className={styles.code} aria-hidden="true">404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.message}>
        There is no page at <code>{pathname}</code>. It may have moved, or the link is wrong.
      </p>
      <Link to={ROUTES.home} className="button">
        Back to Home
      </Link>
    </section>
  )
}
