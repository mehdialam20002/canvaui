import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const state = history[currentIndex];

    const set = useCallback(
        (newState: T | ((prevState: T) => T)) => {
            setHistory((prev) => {
                const nextState =
                    typeof newState === 'function' ? (newState as Function)(prev[currentIndex]) : newState;

                const newHistory = prev.slice(0, currentIndex + 1);
                return [...newHistory, nextState];
            });
            setCurrentIndex((prev) => prev + 1);
        },
        [currentIndex]
    );

    const undo = useCallback(() => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const redo = useCallback(() => {
        setHistory((prev) => {
            setCurrentIndex((current) => Math.min(prev.length - 1, current + 1));
            return prev;
        });
    }, []);

    const reset = useCallback((newState: T = initialState) => {
        setHistory([newState]);
        setCurrentIndex(0);
    }, [initialState]);

    return {
        state,
        set,
        undo,
        redo,
        reset,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
    };
}
