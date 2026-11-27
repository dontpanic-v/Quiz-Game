/**
 * App
 * ───
 * FILE    src/App.jsx
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * PURPOSE
 *   The route table. <Layout /> is the parent of every page.
 *     /                 HomePage          (tesroth)
 *     /settings         SettingsPage      (tesroth)
 *     /quiz             QuizPage          (chea)   also handles ?set=<id>
 *     /results          ResultsPage       (chea)
 *     /leaderboard      LeaderboardPage   (tesroth)
 *     /my-quizzes       MyQuizzesPage     (tesroth)
 *     /create           CreateQuizPage    (tesroth)
 *     /create/:quizId   CreateQuizPage    (tesroth, edit mode)
 *     *                 NotFoundPage      (dontpanic)
 *   Paths come from ROUTES in src/siteConfig.js.
 */
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from './siteConfig.js'
import Layout from './components/Layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import MyQuizzesPage from './pages/MyQuizzesPage.jsx'
import CreateQuizPage from './pages/CreateQuizPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.settings} element={<SettingsPage />} />
        <Route path={ROUTES.quiz} element={<QuizPage />} />
        <Route path={ROUTES.results} element={<ResultsPage />} />
        <Route path={ROUTES.leaderboard} element={<LeaderboardPage />} />
        <Route path={ROUTES.myQuizzes} element={<MyQuizzesPage />} />
        <Route path={ROUTES.create} element={<CreateQuizPage />} />
        <Route path={`${ROUTES.create}/:quizId`} element={<CreateQuizPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
