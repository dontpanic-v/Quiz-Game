
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { useSettings } from "../hooks/useSettings.js";
import { useQuiz } from "../hooks/useQuiz.js";
import { useQuizLibrary } from "../hooks/useQuizLibrary.js";
import { useTimer } from "../hooks/useTimer.js";

import { fetchQuestions } from "../services/triviaApi.js";
import { shuffle } from "../utils/shuffle.js";

import ProgressBar from "../components/Quiz/ProgressBar.jsx";
import QuestionCard from "../components/Quiz/QuestionCard.jsx";

import { ROUTES } from "../siteConfig.js";
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
    startQuiz,
    submitAnswer,
    nextQuestion,
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

  const { secondsLeft, stop, reset } = useTimer(
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
        } else {
          questions = await fetchQuestions(settings);

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

  return (
    <div className={styles.container}>
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
    </div>
  );
}
