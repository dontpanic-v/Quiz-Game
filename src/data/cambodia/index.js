/**
 * Cambodia question bank
 * ──────────────────────
 * FILE    src/data/cambodia/index.js
 *
 * PURPOSE
 *   Our own English trivia questions about Cambodia, stored in the repo
 *   (no API, works offline). One file per category.
 *
 * EXPORT
 *   CAMBODIA_CATEGORIES -> { id, name }[]   for the Settings category list
 *   getCambodiaQuestions({ amount, difficulty, category }) -> Question[]
 *   countCambodiaQuestions({ difficulty, category }) -> number
 *
 * QUESTION FORMAT (inside each category file)
 *   {
 *     id: 'food-e1',                 unique, never reused
 *     difficulty: 'easy' | 'medium' | 'hard',
 *     question: string,
 *     correctAnswer: string,
 *     incorrectAnswers: [string, string, string],
 *     verified: boolean,             true once a teammate has fact-checked it
 *   }
 *
 * RULES
 *   - Write questions in your own words. Do not copy from quiz websites.
 *   - category '' means any category.
 *   - If fewer questions exist than `amount`, return what exists.
 */
import { shuffle } from '../../utils/shuffle.js'
import { angkorQuestions } from './angkor.js'
import { historyQuestions } from './history.js'
import { geographyQuestions } from './geography.js'
import { cultureQuestions } from './culture.js'
import { foodQuestions } from './food.js'
import { languageArtsQuestions } from './languageArts.js'

const BANK = [
  { id: 'angkor', name: 'Angkor & Heritage', questions: angkorQuestions },
  { id: 'history', name: 'History', questions: historyQuestions },
  { id: 'geography', name: 'Geography', questions: geographyQuestions },
  { id: 'culture', name: 'Culture & Traditions', questions: cultureQuestions },
  { id: 'food', name: 'Food', questions: foodQuestions },
  { id: 'language-arts', name: 'Language & Arts', questions: languageArtsQuestions },
]

export const CAMBODIA_CATEGORIES = BANK.map(({ id, name }) => ({ id, name }))

function matching({ difficulty, category }) {
  return BANK.filter((c) => category === '' || c.id === category).flatMap((c) =>
    c.questions
      .filter((q) => q.difficulty === difficulty)
      .map((q) => ({ ...q, category: c.name })),
  )
}

export function countCambodiaQuestions({ difficulty, category }) {
  return matching({ difficulty, category }).length
}

export function getCambodiaQuestions({ amount, difficulty, category }) {
  const pool = matching({ difficulty, category })

  if (pool.length === 0) {
    throw new Error(
      'No Cambodia questions for these settings yet. Try another difficulty or category.',
    )
  }

  return shuffle(pool)
    .slice(0, amount)
    .map((q) => ({
      id: q.id,
      question: q.question,
      answers: shuffle([q.correctAnswer, ...q.incorrectAnswers]),
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      category: q.category,
    }))
}
