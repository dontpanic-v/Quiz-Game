# Quiz Game

A trivia quiz web app built with React and Vite. Players answer timed multiple-choice
questions, get instant feedback, review their results and compare scores on a leaderboard.
Questions come from our own Cambodia question bank, from Open Trivia DB, or from quizzes
players write themselves. There is no backend: everything is saved in the browser.

- **Live app:** [https://puthi.app](https://puthi.app)
- **Repository:** [https://github.com/dontpanic-v/Quiz-Game](https://github.com/dontpanic-v/Quiz-Game)

## Features

- Three question sources: our **Cambodia question bank** (180 questions in 6 categories, the
  default), **[Open Trivia DB](https://opentdb.com)**, or **quizzes you write yourself**
- Easy, Medium and Hard, with a countdown per question (20, 15 or 10 seconds)
- Instant feedback on every answer, a live score and progress bar, and a results page that
  reviews every question
- Leaderboard of past games with difficulty filters and medals for the top three
- Quiz editor to create, edit and delete your own quizzes
- Confirm dialogs before anything that loses data, such as leaving a game or deleting a quiz
- Responsive layout for phones, tablets and desktops

## Tech stack

| Area    | Choice                                           |
| ------- | ------------------------------------------------ |
| UI      | React 19 with function components and hooks      |
| Routing | React Router 7                                   |
| Build   | Vite 8                                           |
| Styling | CSS Modules and shared CSS variables             |
| Icons   | [Lucide](https://lucide.dev) (`lucide-react`)    |
| State   | React Context                                    |
| Storage | Browser `localStorage`                           |
| Hosting | Vercel, deployed on every push to `main`         |

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Check the code with ESLint           |

**Deploy:** the repository is connected to Vercel, so every push to `main` is published to
[puthi.app](https://puthi.app). `vercel.json` sends every path to `index.html`, so
refreshing on any page works.

## Pages

| Path              | Page         | What it does                                      |
| ----------------- | ------------ | ------------------------------------------------- |
| `/`               | Home         | Greeting, current setup and start button          |
| `/settings`       | Settings     | Name, question source, difficulty, count, category |
| `/quiz`           | Quiz         | Play a quiz; `?set=<id>` plays a custom quiz      |
| `/results`        | Results      | Score, answer review, saves the game              |
| `/leaderboard`    | Leaderboard  | Past games, filters and summary                   |
| `/my-quizzes`     | My Quizzes   | Search, play, edit and delete custom quizzes      |
| `/create`         | Create Quiz  | Write a new quiz                                  |
| `/create/:quizId` | Edit Quiz    | Edit an existing quiz                             |
| `*`               | Not Found    | Any unknown address                               |

## How it works

**Context.** Three providers wrap the whole app in `main.jsx`. Pages read them only through
their hooks:

| Context              | Hook               | Holds                                         | Saved |
| -------------------- | ------------------ | --------------------------------------------- | ----- |
| `SettingsContext`    | `useSettings()`    | Player settings and game history              | Yes   |
| `QuizLibraryContext` | `useQuizLibrary()` | Custom quizzes (create, update, delete)       | Yes   |
| `QuizContext`        | `useQuiz()`        | The game in progress; the score is calculated from the answers | No |

**Hooks.** `useState` holds page state such as the chosen answer, form fields and open
dialogs. `useEffect` loads questions, runs the timer, saves finished games and warns before
the tab is closed. Custom hooks: `useLocalStorage` (state that is saved in the browser and
synced across tabs), `useTimer` (per-question countdown), and `useSettings`, `useQuiz` and
`useQuizLibrary` for the three contexts.

**Saved data.** `localStorage` keeps three keys: `quiz-game:settings`, `quiz-game:history`
and `quiz-game:quizzes`. Old or invalid saved values fall back to safe defaults.

## Project structure

```
src/
├── main.jsx             app entry: router and the three context providers
├── App.jsx              route table
├── siteConfig.js        shared constants (routes, difficulties, sources, storage keys)
├── index.css            colors and shared styles
├── pages/               one component per page
├── components/
│   ├── Layout/          Layout, Navbar, BackButton, ConfirmDialog
│   ├── Quiz/            QuestionCard, AnswerOption, ProgressBar, InlineCode
│   ├── Leaderboard/     ScoreTable, Medal
│   └── QuizBuilder/     QuestionEditor, QuizSetCard
├── context/             the three context providers
├── hooks/               custom hooks
├── services/            Open Trivia DB requests
├── data/cambodia/       our Cambodia questions, one file per category
└── utils/               small helpers
```

## Team

| Member    | Branch | Area                                                 |
| --------- | ------ | ---------------------------------------------------- |
| dontpanic | `main` | Routing, global state, layout, deployment, review    |
| chea      | `chea` | Quiz gameplay, results, trivia API, timer            |
| tesroth   | `roth` | Home, settings, leaderboard, custom quizzes, storage |

Each member works on their own branch and merges into `main` through a pull request.
