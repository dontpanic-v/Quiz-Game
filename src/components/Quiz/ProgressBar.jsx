
import { Timer } from 'lucide-react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({
    current,
    total,
    score,
    secondsLeft
}) {
    const progress = total > 0 ? (current / total) * 100 : 0;

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <span>
                    Question {current} of {total}
                </span>

                <div className={styles.stats}>
                    <span>Score: {score}</span>

                    {secondsLeft !== null && (
                        <span className={`${styles.timer} ${
                            secondsLeft <= 5 ? styles.warning : ''
                        }`}>
                            <Timer size={16} aria-hidden="true" /> {secondsLeft}s
                            {secondsLeft <= 5 && ' — Hurry!'}
                        </span>
                    )}
                </div>
            </div>

            <div
                className={styles.track}
                role="progressbar"
                aria-label="Quiz progress"
                aria-valuenow={current}
                aria-valuemin={1}
                aria-valuemax={total}
            >
                <div
                    className={styles.fill}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}