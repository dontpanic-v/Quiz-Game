/**
 * triviaApi
 * ─────────
 * FILE    src/services/triviaApi.js
 * OWNER   chea (only chea edits this file)
 *
 * PURPOSE
 *   Load questions from Open Trivia DB and convert them to our Question shape.
 *   API docs: https://opentdb.com/api_config.php  (free, no key)
 *
 * EXPORT
 *   export async function fetchQuestions({ amount, difficulty, category }) -> Question[]
 *   export async function fetchCategories() -> { id: number, name: string }[]
 *
 *   Question = {
 *     id: string,               crypto.randomUUID()
 *     question: string,         decoded plain text
 *     answers: string[],        correct + incorrect, decoded, shuffled
 *     correctAnswer: string,    decoded
 *     difficulty: 'easy' | 'medium' | 'hard',
 *     category: string,         decoded
 *   }
 *
 * USES
 *   decodeHtml(text) from '../utils/decodeHtml.js'
 *   shuffle(array)   from '../utils/shuffle.js'
 *
 * API DETAILS
 *   Questions:  https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple
 *               add &category=<id> only when category is not ''
 *   Categories: https://opentdb.com/api_category.php -> { trivia_categories: [{ id, name }] }
 *   Response:   { response_code, results: [{ category, difficulty, question,
 *                 correct_answer, incorrect_answers: string[] }] }
 *   response_code: 0 ok, 1 not enough questions, 2 invalid parameter, 5 rate limited
 *   Rate limit: 1 request per 5 seconds per IP.
 *
 * REQUIREMENTS
 *   1. Build the URL with URLSearchParams
 *   2. Throw a readable Error (shown to the player) when:
 *      network fails / !response.ok -> "Could not reach the quiz server. Check your connection."
 *      code 1 -> "Not enough questions for these settings. Try fewer questions or another category."
 *      code 5 -> "Too many requests. Please wait a few seconds and try again."
 *      other non-zero -> "Something went wrong loading questions."
 *   3. Map every result to Question as above
 *   4. No React in this file
 */
