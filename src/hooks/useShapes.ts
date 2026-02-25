import { useEffect } from 'react';
import { Shape } from '../types';
import { useHistory } from './useHistory';

const STORAGE_KEY = 'canvas_shapes';

export function useShapes() {
    const getInitialShapes = (): Shape[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to parse from local storage', error);
            return [];
        }
    };

    const {
        state: shapes,
        set: setShapes,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
    } = useHistory<Shape[]>(getInitialShapes());

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shapes));
    }, [shapes]);

    const addShape = (shape: Shape) => {
        setShapes((prev) => [shape, ...prev]);
    };

    const updateShape = (id: string, updates: Partial<Shape>) => {
        setShapes((prev) =>
            prev.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape))
        );
    };

    const removeShape = (id: string) => {
        setShapes((prev) => prev.filter((shape) => shape.id !== id));
    };

    const clearShapes = () => {
        setShapes([]);
    };

    return {
        shapes,
        addShape,
        updateShape,
        removeShape,
        clearShapes,
        undo,
        redo,
        canUndo,
        canRedo,
        resetShapes: (initial: Shape[]) => reset(initial),
    };
}
