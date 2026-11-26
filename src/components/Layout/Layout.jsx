/**
 * Layout — Standard application shell with sticky Navbar, main content, and footer.
 */
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import styles from './Layout.module.css'

export default function Layout() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>Quiz Game · Final Project · Built by dontpanic, chea, tesroth</p>
      </footer>
    </div>
  )
}
