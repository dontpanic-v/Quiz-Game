
import { Check, Timer, X } from 'lucide-react';
import AnswerOption from './AnswerOption.jsx';
import InlineCode from './InlineCode.jsx';
import styles from './QuestionCard.module.css';

export default function QuestionCard({
    question,
    selected,
    revealed,
    onSelect
}) {
    function getAnswerState(answer) {
        if (!revealed) {
            return 'idle';
        }

        if (answer === question.correctAnswer) {
            return 'correct';
        }

        if (answer === selected) {
            return 'wrong';
        }

        return 'disabled';
    }

    function getFeedback() {
        const answer = <InlineCode text={question.correctAnswer} />;

        if (selected === null) {
            return <><Timer size={18} aria-hidden="true" /> Time's up! The answer was {answer}</>;
        }

        if (selected === question.correctAnswer) {
            return <><Check size={18} aria-hidden="true" /> Correct!</>;
        }

        return <><X size={18} aria-hidden="true" /> Wrong, the answer was {answer}</>;
    }

    return (
        <section className={styles.card}>
            <div className={styles.tags}>
                <span className={styles.tag}>
                    {question.category}
                </span>

                <span className={styles.tag}>
                    {question.difficulty}
                </span>
            </div>

            <h2 className={styles.question}>
                <InlineCode text={question.question} />
            </h2>

            <div className={styles.answers}>
                {question.answers.map((answer, index) => (
                    <AnswerOption
                        key={index}
                        text={answer}
                        state={getAnswerState(answer)}
                        onClick={() => onSelect(answer)}
                    />
                ))}
            </div>

            <div aria-live="polite">
                {revealed && (
                    <p className={`${styles.feedback} ${
                        selected === question.correctAnswer
                            ? styles.correct
                            : styles.wrong
                    }`}>
                        {getFeedback()}
                    </p>
                )}
            </div>
        </section>
    );
}