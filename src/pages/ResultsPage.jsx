
import { useEffect, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { useQuiz } from "../hooks/useQuiz.js";
import { useSettings } from "../hooks/useSettings.js";
import { ROUTES } from "../siteConfig.js";

import { Check, Timer, X } from "lucide-react";
import InlineCode from "../components/Quiz/InlineCode.jsx";
import styles from "./ResultsPage.module.css";

export default function ResultsPage() {
  const { questions, answers, score, total, status, quizMeta, resetQuiz } =
    useQuiz();

  const { settings, addResult } = useSettings();
  const navigate = useNavigate();
  const savedRef = useRef(false);
  // True after "Play again": the quiz is reset before the route changes,
  // so skip the redirect to Home for that one render.
  const [leaving, setLeaving] = useState(false);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    if (status !== "finished" || savedRef.current) return;

    savedRef.current = true;

    addResult({
      playerName: settings.playerName || "Guest",
      quizTitle: quizMeta.title,
      difficulty: questions[0]?.difficulty || settings.difficulty,
      score,
      total,
      date: new Date().toISOString(),
    });
  }, [
    status,
    addResult,
    settings.playerName,
    settings.difficulty,
    quizMeta,
    questions,
    score,
    total,
  ]);

  if (leaving) {
    return null;
  }

  if (status !== "finished") {
    return <Navigate to={ROUTES.home} replace />;
  }

  function getMessage() {
    if (percentage === 100) return "Perfect!";
    if (percentage >= 80) return "Great job!";
    if (percentage >= 50) return "Not bad!";

    return "Keep practicing!";
  }

  function handlePlayAgain() {
    const setId = quizMeta.setId;

    setLeaving(true);
    resetQuiz();

    if (setId !== null) {
      navigate(`${ROUTES.quiz}?set=${encodeURIComponent(setId)}`);
    } else {
      navigate(ROUTES.quiz);
    }
  }

  function handleChangeSettings() {
    navigate(quizMeta.setId !== null ? ROUTES.myQuizzes : ROUTES.settings);
  }

  return (
    <div className={styles.container}>
      <section className={styles.summary}>
        <h1>Quiz Results</h1>

        <p>{quizMeta.title}</p>

        <div className={styles.score}>
          {score} / {total}
        </div>

        <p className={styles.percentage}>{percentage}%</p>

        <h2>{getMessage()}</h2>
      </section>

      <section className={styles.review}>
        <h2>Answer Review</h2>

        {questions.map((question, index) => {
          const answerRecord = answers.find(
            (a) => a.questionId === question.id,
          );

          const playerAnswer = answerRecord?.selected ?? null;
          const isCorrect = answerRecord?.isCorrect ?? false;

          return (
            <article key={question.id} className={styles.reviewCard}>
              <h3>
                {index + 1}. <InlineCode text={question.question} />
              </h3>

              <p className={isCorrect ? styles.correct : styles.wrong}>
                Your answer:{" "}
                {playerAnswer == null ? (
                  <>
                    <Timer size={16} aria-hidden="true" /> Time's up
                  </>
                ) : (
                  <>
                    {isCorrect ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <X size={16} aria-hidden="true" />
                    )}{" "}
                    <InlineCode text={playerAnswer} />
                  </>
                )}
              </p>

              <p>
                Correct answer:{" "}
                <strong>
                  <InlineCode text={question.correctAnswer} />
                </strong>
              </p>
            </article>
          );
        })}
      </section>

      <div className={styles.actions}>
        <button type="button" className="button" onClick={handlePlayAgain}>
          Play again
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleChangeSettings}
        >
          Change settings
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => navigate(ROUTES.leaderboard)}
        >
          Leaderboard
        </button>
      </div>
    </div>
  );
}
