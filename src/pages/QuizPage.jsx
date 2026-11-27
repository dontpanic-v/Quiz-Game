
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { useSettings } from "../hooks/useSettings.js";
import { useQuiz } from "../hooks/useQuiz.js";
import { useQuizLibrary } from "../hooks/useQuizLibrary.js";
import { useTimer } from "../hooks/useTimer.js";

import { fetchQuestions } from "../services/triviaApi.js";
import {
  CAMBODIA_CATEGORIES,
  getCambodiaQuestions,
} from "../data/cambodia/index.js";
import { shuffle } from "../utils/shuffle.js";

import ProgressBar from "../components/Quiz/ProgressBar.jsx";
import QuestionCard from "../components/Quiz/QuestionCard.jsx";
import ConfirmDialog from "../components/Layout/ConfirmDialog.jsx";
import BackButton from "../components/Layout/BackButton.jsx";

import { ROUTES, OPEN_TRIVIA_CATEGORIES } from "../siteConfig.js";
import styles from "./QuizPage.module.css";

function secondsFor(difficulty) {
  switch (difficulty) {
    case "easy":
      return 20;
    case "medium":
      return 15;
    case "hard":
      return 10;
    default:
      return 20;
  }
}

export default function QuizPage() {
  const { settings } = useSettings();

  const {
    currentQuestion,
    currentIndex,
    total,
    score,
    status,
    answers,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
    abandonQuiz,
    leaveTarget,
    requestLeave,
    cancelLeave,
  } = useQuiz();

  const { getQuiz } = useQuizLibrary();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setId = searchParams.get("set");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const answeredRef = useRef(false);

  const difficulty = currentQuestion?.difficulty || settings.difficulty;

  const { secondsLeft, isRunning, start, stop, reset } = useTimer(
    secondsFor(difficulty),
    handleTimeUp,
  );

  function handleTimeUp() {
    if (
      loading ||
      error ||
      !currentQuestion ||
      answeredRef.current ||
      status === "finished"
    ) {
      return;
    }

    answeredRef.current = true;
    setSelected(null);
    setRevealed(true);
    submitAnswer(null);
  }

  useEffect(() => {
    let ignore = false;

    // Delay loading so StrictMode can cancel its first effect.
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");
      setNotFound(false);

      try {
        let questions;
        let metadata;

        if (setId !== null) {
          const quiz = getQuiz(setId);

          if (!quiz) {
            if (!ignore) {
              setNotFound(true);
              setError("Quiz not found");
            }
            return;
          }

          questions = quiz.questions.map((item) => ({
            id: item.id,
            question: item.question,
            answers: shuffle(item.answers),
            correctAnswer: item.correctAnswer,
            difficulty: quiz.difficulty,
            category: quiz.title,
          }));

          metadata = {
            title: quiz.title,
            setId: quiz.id,
          };
        } else if (settings.source === "cambodia") {
          questions = getCambodiaQuestions(settings);

          const categoryName = CAMBODIA_CATEGORIES.find(
            (c) => c.id === settings.category,
          )?.name;

          metadata = {
            title: categoryName ? `Cambodia: ${categoryName}` : "Cambodia",
            setId: null,
          };
        } else {
          // Ignore a category saved before the list was shortened.
          const category = OPEN_TRIVIA_CATEGORIES.some(
            (c) => c.id === settings.category,
          )
            ? settings.category
            : "";

          questions = await fetchQuestions({ ...settings, category });

          metadata = {
            title: "Open Trivia",
            setId: null,
          };
        }

        if (ignore) return;

        if (questions.length === 0) {
          throw new Error("This quiz has no questions.");
        }

        answeredRef.current = false;
        setSelected(null);
        setRevealed(false);

        startQuiz(questions, metadata);
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Something went wrong loading questions.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }, 0);

    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [setId, getQuiz, settings, startQuiz]);

  // Start a fresh timer when a question becomes active.
  useEffect(() => {
    if (!loading && !error && currentQuestion) {
      reset();
    } else {
      stop();
    }
  }, [loading, error, currentQuestion, reset, stop]);

  useEffect(() => {
    if (!loading && !error && status === "finished") {
      navigate(ROUTES.results);
    }
  }, [status, loading, error, navigate]);

  // Pause the clock while the "Leave this quiz?" dialog is open, so deciding is free.
  const pausedForLeaveRef = useRef(false);

  useEffect(() => {
    if (leaveTarget && isRunning) {
      pausedForLeaveRef.current = true;
      stop();
    } else if (!leaveTarget && pausedForLeaveRef.current) {
      pausedForLeaveRef.current = false;
      start();
    }
  }, [leaveTarget, isRunning, start, stop]);

  // Leaving the page mid-game any other way (e.g. the browser Back button) ends the game.
  useEffect(() => () => abandonQuiz(), [abandonQuiz]);

  // Closing or reloading the tab mid-game: let the browser show its own warning.
  useEffect(() => {
    if (status !== "playing") return;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [status]);

  // Custom quizzes go back to the library, other quizzes go home.
  const exitPath = setId !== null ? ROUTES.myQuizzes : ROUTES.home;

  function handleConfirmLeave() {
    const to = leaveTarget ?? exitPath;
    resetQuiz();
    navigate(to);
  }

  function handleSelect(answer) {
    if (answeredRef.current) return;

    answeredRef.current = true;

    setSelected(answer);
    setRevealed(true);

    stop();
    submitAnswer(answer);
  }

  function handleNext() {
    if (!revealed) return;

    answeredRef.current = false;

    setSelected(null);
    setRevealed(false);

    reset();
    nextQuestion();
  }

  if (loading) {
    return (
      <div className={styles.loading} role="status">
        <div className={styles.spinner} />
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <h2>{notFound ? "Quiz not found" : "Unable to load quiz"}</h2>

        {!notFound && <p>{error}</p>}

        {notFound ? (
          <Link to={ROUTES.myQuizzes} className="button">
            My Quizzes
          </Link>
        ) : (
          <button
            type="button"
            className="button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!currentQuestion || status === "finished") {
    return null;
  }

  const answeredCount = answers.length;

  return (
    <div className={styles.container}>
      <BackButton onClick={() => requestLeave(exitPath)}>Leave quiz</BackButton>

      <ProgressBar
        current={currentIndex + 1}
        total={total}
        score={score}
        secondsLeft={secondsLeft}
      />

      <QuestionCard
        question={currentQuestion}
        selected={selected}
        revealed={revealed}
        onSelect={handleSelect}
      />

      {revealed && (
        <div className={styles.actions}>
          <button
            type="button"
            className={`button ${styles.nextButton}`}
            onClick={handleNext}
          >
            {currentIndex + 1 === total ? "See results" : "Next"}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={leaveTarget !== null}
        title="Leave this quiz?"
        message={
          answeredCount === 0
            ? "You haven't answered any questions yet. This game won't be saved."
            : `You've answered ${answeredCount} of ${total} questions. If you leave now, this game won't be saved to the leaderboard.`
        }
        confirmLabel="Leave quiz"
        cancelLabel="Keep playing"
        onConfirm={handleConfirmLeave}
        onCancel={cancelLeave}
      />
    </div>
  );
}
