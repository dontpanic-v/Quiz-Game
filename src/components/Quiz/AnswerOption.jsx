
import { Check, X } from 'lucide-react';
import InlineCode from './InlineCode.jsx';
import styles from './AnswerOption.module.css';

export default function AnswerOption({ text, state, onClick }) {
    return (
        <button
            type="button"
            className={`${styles.option} ${styles[state]}`}
            disabled={state !== 'idle'}
            onClick={onClick}
        >
            <span><InlineCode text={text} /></span>

            {state === 'correct' && <span><Check size={16} aria-hidden="true" /> Correct</span>}
            {state === 'wrong' && <span><X size={16} aria-hidden="true" /> Wrong</span>}
        </button>
    );
}