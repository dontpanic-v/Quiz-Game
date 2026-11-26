/**
 * siteConfig — shared constants used across the whole app.
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * This file is the "contract" everyone builds against. If you need to change a
 * value here, tell the team first — other people's code depends on it.
 */

export const APP_NAME = 'Quiz Game'

export const DIFFICULTIES = ['easy', 'medium', 'hard']

export const QUESTION_AMOUNTS = [5, 10, 15, 20]

export const DEFAULT_SETTINGS = {
  playerName: '',
  difficulty: 'easy', // one of DIFFICULTIES
  amount: 10, // one of QUESTION_AMOUNTS
  category: '', // '' = any category (Open Trivia DB category id otherwise)
}

// Keys used in localStorage. Prefix avoids clashing with other apps on localhost.
export const STORAGE_KEYS = {
  settings: 'quiz-game:settings',
  history: 'quiz-game:history',
  quizzes: 'quiz-game:quizzes', // custom quizzes made on CreateQuizPage
}

// Route paths. Use these instead of typing strings, e.g. navigate(ROUTES.quiz).
export const ROUTES = {
  home: '/',
  settings: '/settings',
  quiz: '/quiz',
  results: '/results',
  leaderboard: '/leaderboard',
  myQuizzes: '/my-quizzes',
  create: '/create', // edit an existing quiz: `${ROUTES.create}/${id}`
}
