/**
 * useTimer
 * ────────
 * FILE    src/hooks/useTimer.js
 * OWNER   chea (only chea edits this file)
 *
 * PURPOSE
 *   Countdown timer for each quiz question.
 *
 * EXPORT
 *   export function useTimer(seconds, onTimeUp)
 *   -> { secondsLeft, isRunning, start, stop, reset }
 *
 * BEHAVIOUR
 *   - starts running immediately, counts down 1 per second
 *   - at 0: stops and calls onTimeUp() once
 *   - stop(): pause (used after the player answers)
 *   - reset(): back to `seconds` and running (used on the next question)
 *
 * REQUIREMENTS
 *   1. useState for secondsLeft and isRunning
 *   2. useEffect with setInterval while isRunning; cleanup clears the interval
 *   3. keep the latest onTimeUp in a useRef so the interval does not restart
 *      every render
 *   4. no memory leaks: leaving the page stops the timer
 */
