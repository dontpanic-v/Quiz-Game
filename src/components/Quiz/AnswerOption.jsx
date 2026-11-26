
import styles from './AnswerOption.module.css';

export default function AnswerOption({ text, state, onClick }) {
    return (
        <button
            type="button"
            className={`${styles.option} ${styles[state]}`}
            disabled={state !== 'idle'}
            onClick={onClick}
        >
            <span>{text}</span>

            {state === 'correct' && <span>✓ Correct</span>}
            {state === 'wrong' && <span>✗ Wrong</span>}
        </button>
    );
}