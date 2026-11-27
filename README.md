# Quiz Game

A single-page trivia app built with React and Vite. Players answer timed multiple-choice
questions from [Open Trivia DB](https://opentdb.com), from our own Cambodia question bank,
or from quizzes they write themselves,
get instant feedback, and compare scores on a local leaderboard. There is no backend:
all state lives in React Context and is saved to `localStorage`.

## Tech stack

| Layer      | Choice                                                   |
| ---------- | -------------------------------------------------------- |
| UI         | React 19 (function components + hooks, StrictMode)       |
| Routing    | React Router 7 (`BrowserRouter`, nested layout route)    |
| Build      | Vite 8 with `@vitejs/plugin-react`                       |
| Styling    | CSS Modules per component + global CSS variables         |
| State      | React Context, one provider per domain                   |
| Storage    | `localStorage` through a `useLocalStorage` hook          |
| Data       | Open Trivia DB REST API (no key) + Cambodia question bank in `src/data/` |
| Linting    | ESLint 10 flat config, `react-hooks` + `react-refresh`   |

## Getting started

Requires Node.js 20.19+ or 22.12+ (needed by Vite 8).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                  |
| `npm run build`   | Production build into `dist/`               |
| `npm run preview` | Serve the production build locally          |
| `npm run lint`    | Run ESLint on the whole project             |

### Deploy

The app is a static site, so it deploys to [Vercel](https://vercel.com) with no extra setup:
import the GitHub repo and keep the detected Vite preset (build `npm run build`, output
`dist`). Every push to `main` redeploys.

`vercel.json` sends every path to `index.html`, so refreshing on a page like `/leaderboard`
loads the app instead of a 404. React Router then shows the right page.

## Architecture

`main.jsx` mounts the providers once, around the whole app. Pages never talk to
`localStorage` directly: they read and change state through hooks that wrap each context.

```mermaid
flowchart TD
  A[BrowserRouter] --> B[SettingsProvider<br/>settings + game history]
  B --> C[QuizLibraryProvider<br/>custom quizzes]
  C --> D[QuizProvider<br/>game in progress]
  D --> E[App: route table]
  E --> F[Layout: Navbar + main]
  F --> G[Pages]
  G -. useSettings .-> B
  G -. useQuizLibrary .-> C
  G -. useQuiz .-> D
```

| Context               | Hook               | Persisted                 | Holds                                                                                          |
| --------------------- | ------------------ | ------------------------- | ---------------------------------------------------------------------------------------------- |
| `SettingsContext`     | `useSettings()`    | yes (`settings`, `history`) | `settings`, `updateSettings`, `history`, `addResult`, `clearHistory`                         |
| `QuizLibraryContext`  | `useQuizLibrary()` | yes (`quizzes`)           | `quizzes`, `getQuiz`, `createQuiz`, `updateQuiz`, `deleteQuiz`                                 |
| `QuizContext`         | `useQuiz()`        | no (memory only)          | `questions`, `currentIndex`, `currentQuestion`, `answers`, `score`, `total`, `status`, `quizMeta`, `startQuiz`, `submitAnswer`, `nextQuestion`, `resetQuiz` |

Each context object lives in its own `*ContextObject.js` file, separate from its provider,
so Vite's fast refresh keeps working (a file should export components only).

`score` and `total` are derived from `answers` and `questions` on every render, never stored.

## Routes

All paths are defined once in `ROUTES` (`src/siteConfig.js`). Every page renders inside
`<Layout />`.

| Path               | Page              | Purpose                                                    |
| ------------------ | ----------------- | ---------------------------------------------------------- |
| `/`                | `HomePage`        | Greeting, current setup, start button                      |
| `/settings`        | `SettingsPage`    | Player name, question source, difficulty, count, category  |
| `/quiz`            | `QuizPage`        | Play a quiz from the source in Settings (Open Trivia or Cambodia) |
| `/quiz?set=<id>`   | `QuizPage`        | Play a custom quiz from the library                        |
| `/results`         | `ResultsPage`     | Score, answer review, saves the game to history            |
| `/leaderboard`     | `LeaderboardPage` | Past games, filter by difficulty, summary stats            |
| `/my-quizzes`      | `MyQuizzesPage`   | Custom quiz library: search, play, edit, delete            |
| `/create`          | `CreateQuizPage`  | Create a custom quiz                                       |
| `/create/:quizId`  | `CreateQuizPage`  | Edit an existing custom quiz                               |
| `*`                | `NotFoundPage`    | Unknown URL                                                |

## Game flow

```mermaid
stateDiagram-v2
  [*] --> idle
  idle --> playing: startQuiz(questions, meta)
  playing --> playing: submitAnswer / nextQuestion
  playing --> finished: nextQuestion on last question
  finished --> idle: resetQuiz (Play again)
  finished --> playing: startQuiz (new game)
```

1. **Load.** `QuizPage` fetches questions from the API, picks them from the Cambodia bank,
   or converts a custom quiz from the library (answers shuffled). It then calls `startQuiz`. The load runs inside a cancellable
   `setTimeout` so StrictMode's double effect does not call the API twice.
2. **Answer.** Clicking an option calls `submitAnswer(answer)`. Each question accepts one
   answer only. `QuestionCard` reveals correct / wrong states and an `aria-live` message.
3. **Timer.** `useTimer` counts down per question: easy 20 s, medium 15 s, hard 10 s.
   At zero it records `submitAnswer(null)` and shows the correct answer.
4. **Finish.** After the last question `status` becomes `finished` and the page navigates to
   `/results`.
5. **Save.** `ResultsPage` calls `addResult` exactly once (guarded by a ref). Opening
   `/results` without a finished game redirects to `/`.

**Leaving mid-game.** The quiz page has a *Leave quiz* button in the top-left corner. It and
every navbar link call `requestLeave(to)`, which opens one shared `ConfirmDialog`
("Leave this quiz?") and pauses the timer while it is open. Focus starts on *Keep playing*;
Escape or a click outside also keeps playing. *Leave quiz* goes to My Quizzes for a custom
quiz, Home for the others, or to the navbar link that was clicked. Leaving by the browser's
Back button ends the game quietly (`abandonQuiz`), and closing or reloading the tab shows
the browser's own warning.

## Data model

```ts
// A question ready to play (from the API or converted from a custom quiz)
Question = {
  id: string
  question: string          // plain text, HTML entities decoded
  answers: string[]         // shuffled, includes correctAnswer
  correctAnswer: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string          // API or Cambodia category, or the custom quiz title
}

// One recorded answer in QuizContext
Answer = { questionId: string, selected: string | null, isCorrect: boolean }  // null = time up

// A quiz written by the player
CustomQuiz = {
  id: string
  title: string             // 1–60 characters
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: { id, question, answers: string[], correctAnswer }[]  // 1–50 questions, 2–4 unique answers
  createdAt: string         // ISO date
  updatedAt: string
}

// One finished game in the leaderboard
HistoryEntry = {
  id: string
  playerName: string        // 'Guest' when empty
  quizTitle: string         // 'Open Trivia', 'Cambodia[: <category>]' or the custom quiz title
  difficulty: 'easy' | 'medium' | 'hard'
  score: number
  total: number
  date: string              // ISO date
}
```

The leaderboard sorts by percentage (highest first), then by date (newest first).

## Persistence

| Key                   | Value             | Default                                                          |
| --------------------- | ----------------- | ---------------------------------------------------------------- |
| `quiz-game:settings`  | settings object   | `{ playerName: '', source: 'cambodia', difficulty: 'easy', amount: 10, category: '' }` |
| `quiz-game:history`   | `HistoryEntry[]`  | `[]`                                                             |
| `quiz-game:quizzes`   | `CustomQuiz[]`    | one sample quiz, "React Hooks Quiz" (20 questions)               |

`useLocalStorage(key, initialValue)` behaves like `useState` and also:

- reads the saved value once on mount and writes it back on every change;
- merges saved objects over the defaults, so new settings fields get a default value;
- (in `SettingsContext`) replaces saved values that are no longer valid, such as an old
  question amount or a category from the other source, with the default;
- falls back to the default when the stored JSON is missing or broken;
- ignores write errors (private mode, full storage);
- listens to the `storage` event, so other open tabs stay in sync.

## External API

`src/services/triviaApi.js` is the only module that talks to the network.

| Function                                         | Endpoint                                                      |
| ------------------------------------------------ | ------------------------------------------------------------- |
| `fetchQuestions({ amount, difficulty, category })` | `https://opentdb.com/api.php?amount=&difficulty=&type=multiple[&category=]` |
| `fetchCategories()`                              | `https://opentdb.com/api_category.php`                        |

Responses are decoded (`decodeHtml`), shuffled (`shuffle`, Fisher–Yates) and mapped to
`Question`. Failures become errors with a message the player can read:

| Case                         | Message                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Network error / HTTP error   | Could not reach the quiz server. Check your connection.                       |
| `response_code` 1            | Not enough questions for these settings. Try fewer questions or another category. |
| `response_code` 5            | Too many requests. Please wait a few seconds and try again.                   |
| Any other non-zero code      | Something went wrong loading questions.                                       |

Open Trivia DB allows one request every 5 seconds per IP.

Settings does not list all of Open Trivia's categories. It offers a short list of six,
`OPEN_TRIVIA_CATEGORIES` in `siteConfig.js`: General Knowledge, History, Geography,
Science & Nature, Music and Sports. Edit that list to change them; the `id` is the
Open Trivia category id. A saved category that is no longer in the list counts as
*Any category*.

## Cambodia question bank

Open Trivia DB has almost nothing about Cambodia, so we keep our own English questions in
the repo. They load instantly and work offline.

```
src/data/cambodia/
├── index.js          CAMBODIA_CATEGORIES, getCambodiaQuestions(), countCambodiaQuestions()
├── angkor.js         Angkor & Heritage
├── history.js        History
├── geography.js      Geography
├── culture.js        Culture & Traditions
├── food.js           Food
└── languageArts.js   Language & Arts
```

Each question looks like this:

```js
{
  id: 'food-e1',                       // unique: <category>-<e|m|h><number>
  difficulty: 'easy',
  question: 'Fish amok is traditionally steamed in what?',
  correctAnswer: 'Banana leaves',
  incorrectAnswers: ['Bamboo tubes', 'Clay pots', 'Coconut shells'],
  verified: false,                     // true once a teammate has fact-checked it
}
```

- Choose **Cambodia** under *Question source* in Settings. The category list then shows these
  six categories, plus a count of how many questions match the chosen difficulty.
- *Any category* mixes all six. A single category plays every matching question it has,
  up to the chosen amount.
- Write questions in your own words. Quiz websites such as FunTrivia are copyrighted, so
  do not copy their questions.

**Code in questions.** In any question or answer (Cambodia bank or custom quizzes), text
wrapped in backticks is shown in a code font, e.g. ``What does `useMemo` do?``. This is
done by `components/Quiz/InlineCode.jsx`, which builds React elements only, so typed text
is never run as HTML.

## Shared UI patterns

- **Back button** (`components/Layout/BackButton.jsx`). Pages below the home page show a
  muted back link in the top-left: Settings, My Quizzes and Leaderboard go to Home, the quiz
  editor goes to My Quizzes, and a running quiz shows *Leave quiz*. It always goes to a fixed
  parent page, never `history.back()`.
- **Confirm dialog** (`components/Layout/ConfirmDialog.jsx`). Every action that loses
  something asks first with the same dialog: leaving a quiz, deleting a quiz, discarding
  unsaved edits, clearing the leaderboard and resetting settings. It is built on the native
  `<dialog>` element, names exactly what will be lost, uses verb buttons ("Delete quiz" /
  "Keep quiz", never Yes / No) and puts focus on the safe choice. The browser's built-in
  `window.confirm` is not used anywhere.
- **Medals** (`components/Leaderboard/Medal.jsx`). Ranks 1 to 3 on the leaderboard show a
  flat two-tone gold, silver or bronze medal next to the rank number.

## Styling

- `src/index.css` defines the design tokens as CSS variables (`--text`, `--bg`, `--accent`,
  `--success`, …) plus shared base styles such as `.button`. Use the tokens instead of
  hard-coded colors.
- The palette follows a few perception rules so the important things stand out:
  - **Calm base, one loud accent.** Neutrals are cool and low in saturation; a single
    saturated blue (`--accent`) marks actions and the current selection. One element that
    differs in color is spotted at a glance and remembered better.
  - **About 60 / 30 / 10.** Mostly white and light surfaces, navy for headings, blue accent
    for a small share of the screen.
  - **Contrast first.** All text meets WCAG AA (at least 4.5:1) and borders at least 3:1.
  - **Clear feedback.** Emerald for correct, red for wrong, amber for the last 5 seconds of
    the timer. The green leans toward teal so players with red-green color blindness still
    see a difference, and every state also has an icon or text label.
  - Colors were picked in OKLCH, a color space where equal steps look equally different,
    and stored as hex.
- Each component has a `Name.module.css` next to it, so class names never clash.
- The layout is a single column, at most 720px wide, with 16px side padding on phones.
  Answer options use a 2×2 grid on desktop and one column on small screens.

## Project structure

```
src/
├── main.jsx               entry: StrictMode, router, providers
├── App.jsx                route table
├── siteConfig.js          ROUTES, DIFFICULTIES, QUESTION_AMOUNTS, QUESTION_SOURCES, OPEN_TRIVIA_CATEGORIES, DEFAULT_SETTINGS, STORAGE_KEYS
├── index.css              global tokens and base styles
├── pages/                 one component per route (+ .module.css)
├── components/
│   ├── Layout/            Layout, Navbar
│   ├── Quiz/              QuestionCard, AnswerOption, ProgressBar
│   ├── Leaderboard/       ScoreTable
│   └── QuizBuilder/       QuestionEditor, QuizSetCard
├── context/               providers + context objects
├── hooks/                 useSettings, useQuiz, useQuizLibrary, useLocalStorage, useTimer
├── services/              triviaApi
├── data/cambodia/         our own Cambodia questions, one file per category
└── utils/                 decodeHtml, shuffle
```

## Conventions

- Start each source file with a header comment that says what it does and what it
  exports, and read it before changing the file.
- Import paths and constants from `siteConfig.js` instead of hard-coding strings.
- Pages use hooks (`useSettings`, `useQuiz`, `useQuizLibrary`); only providers touch storage.
- Hooks are named `useSomething`; components are PascalCase, one per file.
- Commit messages use a `feat:` / `fix:` prefix.
- Before opening a pull request: `npm run lint` and `npm run build` pass, and the change
  works at phone width.

## Team

| Member    | Branch | Area                                                   |
| --------- | ------ | ------------------------------------------------------ |
| dontpanic | `main` | Routing, global state, layout, integration, review     |
| chea      | `chea` | Quiz gameplay, results, trivia API, timer              |
| tesroth   | `roth` | Home, settings, leaderboard, custom quizzes, storage   |

Work happens on each member's branch and reaches `main` through a pull request.
