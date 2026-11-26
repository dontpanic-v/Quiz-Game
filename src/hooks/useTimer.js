
import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(seconds, onTimeUp) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);

  const onTimeUpRef = useRef(onTimeUp);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]); 

  useEffect(() => {
    if (secondsLeft === 0 && !hasCalledRef.current) {
      hasCalledRef.current = true;
      setIsRunning(false);
      onTimeUpRef.current();
    }
  }, [secondsLeft]);

  const start = useCallback(() => {
    if (secondsLeft > 0) {
      setIsRunning(true);
    }
  }, [secondsLeft]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    hasCalledRef.current = false;
    setSecondsLeft(seconds);
    setIsRunning(true);
  }, [seconds]);

  return {
    secondsLeft,
    isRunning,
    start,
    stop,
    reset,
  };
}
