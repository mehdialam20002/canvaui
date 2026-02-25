import React, { RefObject, MouseEvent } from 'react';
import { CanvasDimensions } from '../types';

interface CanvasAreaProps {
    canvasRef: RefObject<HTMLCanvasElement>;
    dimensions: CanvasDimensions;
    isDragging: boolean;
    isHovering: boolean;
    onPointerDown: (e: MouseEvent<HTMLCanvasElement>) => void;
    onPointerMove: (e: MouseEvent<HTMLCanvasElement>) => void;
    onPointerUp: () => void;
    onPointerLeave: () => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
    canvasRef,
    dimensions,
    isDragging,
    isHovering,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
}) => {
    return (
        <section className="canvas-area">
            <div className="canvas-wrapper shadow-md">
                <canvas
                    ref={canvasRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    className={`main-canvas ${isDragging ? 'dragging' : isHovering ? 'hovering' : ''}`}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerLeave}
                />
            </div>
        </section>
    );
};
