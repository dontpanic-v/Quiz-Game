
import AnswerOption from './AnswerOption.jsx';
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
        if (selected === null) {
            return `⏱ Time's up! The answer was ${question.correctAnswer}`;
        }

        if (selected === question.correctAnswer) {
            return '✓ Correct!';
        }

        return `✗ Wrong, the answer was ${question.correctAnswer}`;
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
                {question.question}
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