

import { decodeHtml } from '../utils/decodeHtml.js';
import { shuffle } from '../utils/shuffle.js';

export async function fetchQuestions({ amount, difficulty, category }) {
    const params = new URLSearchParams({
        amount: amount,
        difficulty: difficulty,
        type: 'multiple'
    });

    if (category !== '') {
        params.set('category', category);
    }

    const url = `https://opentdb.com/api.php?${params.toString()}`;

    let response;

    try {
        response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }
    } catch {
        throw new Error(
            'Could not reach the quiz server. Check your connection.'
        );
    }

    const data = await response.json();

    if (data.response_code === 1) {
        throw new Error(
            'Not enough questions for these settings. Try fewer questions or another category.'
        );
    }

    if (data.response_code === 5) {
        throw new Error(
            'Too many requests. Please wait a few seconds and try again.'
        );
    }

    if (data.response_code !== 0) {
        throw new Error(
            'Something went wrong loading questions.'
        );
    }

    return data.results.map((item) => {
        const correctAnswer = decodeHtml(item.correct_answer);

        const incorrectAnswers = item.incorrect_answers.map(decodeHtml);

        const answers = shuffle([
            correctAnswer,
            ...incorrectAnswers
        ]);

        return {
            id: crypto.randomUUID(),
            question: decodeHtml(item.question),
            answers: answers,
            correctAnswer: correctAnswer,
            difficulty: item.difficulty,
            category: decodeHtml(item.category)
        };
    });
}

export async function fetchCategories() {
    let response;

    try {
        response = await fetch(
            'https://opentdb.com/api_category.php'
        );

        if (!response.ok) {
            throw new Error();
        }
    } catch {
        throw new Error(
            'Could not reach the quiz server. Check your connection.'
        );
    }

    const data = await response.json();

    return data.trivia_categories.map((category) => ({
        id: category.id,
        name: decodeHtml(category.name)
    }));
}

