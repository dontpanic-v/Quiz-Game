/**
 * siteConfig — shared constants used across the whole app.
 * OWNER   dontpanic (only dontpanic edits this file)
 *
 * This file is the "contract" everyone builds against. If you need to change a
 * value here, tell the team first — other people's code depends on it.
 */

export const APP_NAME = 'Quiz Game'

export const DIFFICULTIES = ['easy', 'medium', 'hard']

export const QUESTION_AMOUNTS = [5, 10]

// Where questions come from. 'cambodia' = our own bank in src/data/cambodia/.
export const QUESTION_SOURCES = [
  { id: 'opentdb', label: 'Open Trivia' },
  { id: 'cambodia', label: 'Cambodia' },
]

// Short list of Open Trivia DB categories shown in Settings (id = Open Trivia category id).
export const OPEN_TRIVIA_CATEGORIES = [
  { id: '9', name: 'General Knowledge' },
  { id: '23', name: 'History' },
  { id: '22', name: 'Geography' },
  { id: '17', name: 'Science & Nature' },
  { id: '12', name: 'Music' },
  { id: '21', name: 'Sports' },
]

export const DEFAULT_SETTINGS = {
  playerName: '',
  source: 'cambodia', // one of QUESTION_SOURCES ids
  difficulty: 'easy', // one of DIFFICULTIES
  amount: 10, // one of QUESTION_AMOUNTS
  category: '', // '' = any category; Open Trivia id or Cambodia category id, per source
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
