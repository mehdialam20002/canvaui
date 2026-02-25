import React from 'react';
import { Shape } from '../types';
import './LayersPanel.css';

interface LayersPanelProps {
    shapes: Shape[]; 
    selectedId: string | null;
    hoveredId: string | null;
    onSelect: (id: string) => void;
    onHover: (id: string | null) => void;
    onDelete: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
    shapes,
    selectedId,
    hoveredId,
    onSelect,
    onHover,
    onDelete,
}) => {
    const reversedShapes = [...shapes].reverse();

    return (
        <aside className="panel layers-panel glass">
            <h2 className="panel-title text-sm font-semibold">Layers <span className="text-xs text-secondary ml-1">({shapes.length})</span></h2>
            <div className="panel-content flex-col gap-2 p-4">
                {reversedShapes.length === 0 ? (
                    <p className="text-secondary text-xs text-center mt-4">No shapes added yet.</p>
                ) : (
                    reversedShapes.map((shape) => {
                        const isSelected = shape.id === selectedId;
                        const isHovered = shape.id === hoveredId;

                        return (
                            <div
                                key={shape.id}
                                className={`layer-item ${isSelected ? 'selected' : ''} ${isHovered && !isSelected ? 'hovered' : ''}`}
                                onClick={() => onSelect(shape.id)}
                                onMouseEnter={() => onHover(shape.id)}
                                onMouseLeave={() => onHover(null)}
                            >
                                <div className="layer-color-indicator" style={{ backgroundColor: shape.color }}></div>
                                <div className="layer-info">
                                    <span className="layer-type text-sm font-medium">{shape.type}</span>
                                    <span className="layer-pos text-xs text-secondary">({Math.round(shape.x)}, {Math.round(shape.y)})</span>
                                </div>
                                <button
                                    className="layer-delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(shape.id);
                                    }}
                                    aria-label={`Delete ${shape.type}`}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </aside>
    );
};
