/**
 * Layout
 * ──────
 * FILE    src/components/Layout/Layout.jsx  (+ Layout.module.css)
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   Frame around every page: Navbar on top, the current page below it.
 *   Used as the parent <Route element={<Layout />}> in App.jsx.
 *
 * EXPORT
 *   export default function Layout()
 *
 * BEHAVIOR
 *   - <main> is centered, max ~720px wide, 16px side padding on phones
 *   - fills at least the full screen height
 *   - scrolls to top when the route changes
 */
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import styles from './Layout.module.css'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
