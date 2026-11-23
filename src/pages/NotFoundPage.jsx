/**
 * NotFoundPage — 404 handler for unmatched routes.
 */
import { Link } from 'react-router-dom'
import { ROUTES } from '../siteConfig.js'

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 16px' }}>
      <h1 style={{ fontSize: '36px', color: 'var(--text-h)', margin: '0 0 12px' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text)', margin: '0 0 24px' }}>
        The page you are looking for does not exist.
      </p>
      <Link
        to={ROUTES.home}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '44px',
          padding: '10px 24px',
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Back to Home
      </Link>
    </div>
  )
}
