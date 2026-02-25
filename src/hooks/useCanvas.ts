import { useRef, useEffect, useState, MouseEvent } from 'react';
import { Shape } from '../types';
import { drawShape, isPointInShape } from '../utils/canvas';

export function useCanvas(
    shapes: Shape[],
    selectedId: string | null,
    onSelect: (id: string | null) => void,
    onUpdateShape: (id: string, updates: Partial<Shape>) => void
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Track drag start positions
    const dragStartRef = useRef<{ x: number; y: number; shapeX: number; shapeY: number } | null>(null);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid backwards (painters algorithm) - shapes at start of array are newest (top layer)
        // We should draw from last to first
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape = shapes[i];
            drawShape(ctx, shape, shape.id === hoveredId, shape.id === selectedId);
        }
    };

    useEffect(() => {
        // We use requestAnimationFrame for smooth, flicker-free rendering
        let animationFrameId: number;
        const render = () => {
            draw();
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [shapes, hoveredId, selectedId]);

    const getPointerPos = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        // Calculate scale in case canvas CSS size differs from element size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const handlePointerDown = (e: MouseEvent<HTMLCanvasElement>) => {
        const { x, y } = getPointerPos(e);
        // Find the topmost shape that was clicked (first in array is top)
        const clickedShape = shapes.find((shape) => isPointInShape(x, y, shape));

        if (clickedShape) {
            onSelect(clickedShape.id);
            setIsDragging(true);
            dragStartRef.current = {
                x,
                y,
                shapeX: clickedShape.x,
                shapeY: clickedShape.y,
            };
        } else {
            onSelect(null);
        }
    };

    const handlePointerMove = (e: MouseEvent<HTMLCanvasElement>) => {
        const { x, y } = getPointerPos(e);

        if (isDragging && selectedId && dragStartRef.current) {
            // Calculate delta
            const dx = x - dragStartRef.current.x;
            const dy = y - dragStartRef.current.y;

            onUpdateShape(selectedId, {
                x: dragStartRef.current.shapeX + dx,
                y: dragStartRef.current.shapeY + dy,
            });
        } else {
            // Hover logic
            const hoveredShape = shapes.find((shape) => isPointInShape(x, y, shape));
            setHoveredId(hoveredShape ? hoveredShape.id : null);
        }
    };

    const handlePointerUp = () => {
        setIsDragging(false);
        dragStartRef.current = null;
    };

    const handlePointerLeave = () => {
        setHoveredId(null);
        setIsDragging(false);
        dragStartRef.current = null;
    };

    return {
        canvasRef,
        hoveredId,
        setHoveredId,
        isDragging,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerLeave,
    };
}
