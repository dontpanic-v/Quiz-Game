/**
 * Layout
 * ──────
 * FILE    src/components/Layout/Layout.jsx  (+ Layout.module.css)
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   Frame around every page: Navbar on top, the current page in the middle, footer below.
 *   Used as the parent <Route element={<Layout />}> in App.jsx.
 *
 * EXPORT
 *   export default function Layout()
 *
 * USES
 *   <Outlet /> from 'react-router-dom'
 *   <Navbar /> from './Navbar.jsx'
 *
 * REQUIREMENTS
 *   1. <Navbar />, then <main> containing <Outlet />, then a small <footer>
 *      (app name + team names: dontpanic, chea, tesroth)
 *   2. <main> is centered with a max width (~720px) and side padding of 16px on phones
 *   3. page fills at least the full screen height so the footer stays at the bottom
 *   4. scroll to top when the route changes (useEffect on useLocation().pathname)
 */
