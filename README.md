# Quiz Game

A trivia quiz web app built with React + Vite. Pick a difficulty, answer questions one at a
time with instant feedback, track your score, and compare results on the leaderboard.
You can also write your own quizzes (like Quizlet) and play them. Everything is saved in
your browser.

**Live demo:** _coming soon_

## Features

- Questions from [Open Trivia DB](https://opentdb.com) on **Easy, Medium, Hard**
- Instant feedback (✓ correct / ✗ wrong + the right answer) and a timer per question
- Score, progress bar and a results page with a review of every answer
- Leaderboard of past games, filterable by difficulty
- **Create your own quizzes** and play them like any other quiz
- Clean black, white and navy design that works on phones
- Settings, scores and custom quizzes saved with `localStorage`

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start dev server at http://localhost:5173
```

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server (auto-reloads)  |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Check code with ESLint               |

## Team

| Member        | Branch    | Area                                                  |
| ------------- | --------- | ----------------------------------------------------- |
| **dontpanic** | `main`    | Routing, global state (context), layout, deployment   |
| **chea**      | `chea`    | Quiz gameplay, results, trivia API                    |
| **tesroth**   | `tesroth` | Home, settings, leaderboard, custom quizzes, storage  |

**Each person only edits their own files.** Every file starts with a comment that says
who owns it and exactly what it must do (PURPOSE, EXPORT, USES, REQUIREMENTS). Read that
comment first and treat it as the spec.

## Folder structure

```
Quiz-Game/
├── index.html                          entry HTML page
├── vite.config.js                      Vite config
├── eslint.config.js                    lint rules
├── public/                             static files served as-is (favicon)
└── src/
    ├── main.jsx                        [dontpanic] app entry: router + providers
    ├── App.jsx                         [dontpanic] list of all routes/pages
    ├── index.css                       [dontpanic] global styles and colors
    ├── siteConfig.js                   [dontpanic] shared constants (routes, difficulties, keys)
    │
    ├── pages/                          one file = one page (route)
    │   ├── HomePage.jsx                [tesroth]   /
    │   ├── SettingsPage.jsx            [tesroth]   /settings
    │   ├── QuizPage.jsx                [chea]      /quiz
    │   ├── ResultsPage.jsx             [chea]      /results
    │   ├── LeaderboardPage.jsx         [tesroth]   /leaderboard
    │   ├── MyQuizzesPage.jsx           [tesroth]   /my-quizzes
    │   ├── CreateQuizPage.jsx          [tesroth]   /create, /create/:quizId
    │   └── NotFoundPage.jsx            [dontpanic] any unknown URL
    │
    ├── components/                     reusable pieces used inside pages
    │   ├── Layout/
    │   │   ├── Layout.jsx              [dontpanic] navbar + page + footer frame
    │   │   └── Navbar.jsx              [dontpanic] top navigation
    │   ├── Quiz/
    │   │   ├── QuestionCard.jsx        [chea]      one question + feedback
    │   │   ├── AnswerOption.jsx        [chea]      one answer button
    │   │   └── ProgressBar.jsx         [chea]      "Question 3 of 10", score, timer
    │   ├── Leaderboard/
    │   │   └── ScoreTable.jsx          [tesroth]   table of past results
    │   └── QuizBuilder/
    │       ├── QuestionEditor.jsx      [tesroth]   form for one custom question
    │       └── QuizSetCard.jsx         [tesroth]   one quiz card in My Quizzes
    │
    ├── context/                        global state shared by many pages (React Context)
    │   ├── SettingsContext.jsx         [dontpanic] settings + game history
    │   ├── QuizContext.jsx             [dontpanic] the game being played right now
    │   └── QuizLibraryContext.jsx      [tesroth]   custom quizzes
    │
    ├── hooks/                          custom React hooks (always named useSomething)
    │   ├── useSettings.js              [dontpanic] read SettingsContext
    │   ├── useQuiz.js                  [dontpanic] read QuizContext
    │   ├── useQuizLibrary.js           [tesroth]   read QuizLibraryContext
    │   ├── useLocalStorage.js          [tesroth]   useState that saves to localStorage
    │   └── useTimer.js                 [chea]      countdown per question
    │
    ├── services/                       talking to outside APIs
    │   └── triviaApi.js                [chea]      load questions from Open Trivia DB
    │
    └── utils/                          small helper functions (no React)
        ├── shuffle.js                  [chea]      shuffle answers
        └── decodeHtml.js               [chea]      turn &quot; into "
```

Component styles go in a `Name.module.css` file next to the component
(e.g. `QuizPage.module.css`), owned by the same person.

## Who owns which files

### dontpanic: 11 files
| File | What it does |
| --- | --- |
| `src/main.jsx` | App entry, wraps everything in router + providers |
| `src/App.jsx` | All routes |
| `src/index.css` | Global styles and color variables |
| `src/siteConfig.js` | Shared constants everyone imports |
| `src/context/SettingsContext.jsx` | Settings + game history (saved) |
| `src/context/QuizContext.jsx` | Current game state |
| `src/hooks/useSettings.js` | Hook to read settings |
| `src/hooks/useQuiz.js` | Hook to read the current game |
| `src/components/Layout/Layout.jsx` | Page frame |
| `src/components/Layout/Navbar.jsx` | Navigation bar |
| `src/pages/NotFoundPage.jsx` | 404 page |

### chea: 9 files
| File | What it does |
| --- | --- |
| `src/pages/QuizPage.jsx` | The game screen |
| `src/pages/ResultsPage.jsx` | Score + answer review, saves the result |
| `src/components/Quiz/QuestionCard.jsx` | Shows one question + feedback |
| `src/components/Quiz/AnswerOption.jsx` | One answer button |
| `src/components/Quiz/ProgressBar.jsx` | Progress, score, timer |
| `src/hooks/useTimer.js` | Countdown timer |
| `src/services/triviaApi.js` | Fetch questions + categories |
| `src/utils/shuffle.js` | Shuffle an array |
| `src/utils/decodeHtml.js` | Decode HTML text from the API |

### tesroth: 11 files
| File | What it does |
| --- | --- |
| `src/pages/HomePage.jsx` | Landing page, start button |
| `src/pages/SettingsPage.jsx` | Difficulty, amount, category |
| `src/pages/LeaderboardPage.jsx` | Ranking of past games |
| `src/pages/MyQuizzesPage.jsx` | Library of custom quizzes |
| `src/pages/CreateQuizPage.jsx` | Create / edit a custom quiz |
| `src/components/Leaderboard/ScoreTable.jsx` | Results table |
| `src/components/QuizBuilder/QuestionEditor.jsx` | Form for one question |
| `src/components/QuizBuilder/QuizSetCard.jsx` | Card for one custom quiz |
| `src/context/QuizLibraryContext.jsx` | Custom quizzes (saved) |
| `src/hooks/useQuizLibrary.js` | Hook to read custom quizzes |
| `src/hooks/useLocalStorage.js` | Save any state to localStorage |

## Git workflow

1. Work on your own branch (`chea` or `tesroth`).
2. Get the latest shared code often: `git fetch origin && git merge origin/main`
3. Small commits with clear messages, e.g. `Add answer feedback to QuestionCard`
4. When a feature works, push and open a Pull Request into `main`.
   Check first: `npm run lint` and `npm run build` pass, and it works at phone width.
5. dontpanic reviews and merges.
