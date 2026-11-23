/**
 * App — Route configuration table.
 */
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from './siteConfig.js'
import Layout from './components/Layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import MyQuizzesPage from './pages/MyQuizzesPage.jsx'
import CreateQuizPage from './pages/CreateQuizPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function QuizPlaceholder() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 16px' }}>
      <h2>Quiz Gameplay</h2>
      <p style={{ margin: '12px 0 24px', color: 'var(--text)' }}>
        Chea is building the live gameplay screen and Open Trivia DB integration.
        <br />
        In the meantime, you can create and manage custom quizzes in <strong>My Quizzes</strong>, customize options in <strong>Settings</strong>, or view past scores in <strong>Leaderboard</strong>!
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          padding: '8px 20px',
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Back to Home
      </a>
    </div>
  )
}

function ResultsPlaceholder() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 16px' }}>
      <h2>Results Page</h2>
      <p style={{ margin: '12px 0 24px', color: 'var(--text)' }}>
        Chea is implementing the results summary screen.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          padding: '8px 20px',
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Back to Home
      </a>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.settings} element={<SettingsPage />} />
        <Route path={ROUTES.quiz} element={<QuizPlaceholder />} />
        <Route path={ROUTES.results} element={<ResultsPlaceholder />} />
        <Route path={ROUTES.leaderboard} element={<LeaderboardPage />} />
        <Route path={ROUTES.myQuizzes} element={<MyQuizzesPage />} />
        <Route path={ROUTES.create} element={<CreateQuizPage />} />
        <Route path={`${ROUTES.create}/:quizId`} element={<CreateQuizPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
