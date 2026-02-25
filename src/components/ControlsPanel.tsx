import React, { useState } from 'react';
import './ControlsPanel.css';
import { ShapeType, PositionGrid, Shape, CanvasDimensions } from '../types';

interface ControlsPanelProps {
    onAddShape: (shape: Omit<Shape, 'id' | 'createdAt'>) => void;
    canvasDimensions: CanvasDimensions;
}

const SHAPE_TYPES: ShapeType[] = ['Circle', 'Square', 'Triangle'];
const COLORS = [
    'var(--color-1)',
    'var(--color-2)',
    'var(--color-3)',
    'var(--color-4)',
    'var(--color-5)',
];
const SIZES = [100, 200, 400];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
    onAddShape,
    canvasDimensions,
}) => {
    const [selectedType, setSelectedType] = useState<ShapeType>('Circle');
    const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
    const [customColor, setCustomColor] = useState<string>('#000000');
    const [isCustomColor, setIsCustomColor] = useState(false);
    const [selectedSize, setSelectedSize] = useState<number>(100);

    const activeColor = isCustomColor ? customColor : selectedColor;

    const handleAdd = (position: PositionGrid) => {
        let x = 0;
        let y = 0;
        const { width, height } = canvasDimensions;
        const padding = selectedSize / 2;

        switch (position) {
            case 'top-left':
                x = padding; y = padding; break;
            case 'top-center':
                x = width / 2; y = padding; break;
            case 'top-right':
                x = width - padding; y = padding; break;
            case 'center-left':
                x = padding; y = height / 2; break;
            case 'center':
                x = width / 2; y = height / 2; break;
            case 'center-right':
                x = width - padding; y = height / 2; break;
            case 'bottom-left':
                x = padding; y = height - padding; break;
            case 'bottom-center':
                x = width / 2; y = height - padding; break;
            case 'bottom-right':
                x = width - padding; y = height - padding; break;
        }

        onAddShape({
            type: selectedType,
            color: activeColor,
            size: selectedSize,
            x,
            y,
        });
    };

    return (
        <aside className="panel controls-panel glass">
            <h2 className="panel-title text-sm font-semibold">Controls</h2>
            <div className="panel-content flex-col gap-4">

                {/* Shape Selection */}
                <div className="control-group">
                    <label className="text-xs font-semibold text-secondary mb-2 block">SHAPE TYPE</label>
                    <div className="flex gap-2">
                        {SHAPE_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`btn flex-1 ${selectedType === type ? 'btn-primary' : ''}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divider-h"></div>

                {/* Color Palette */}
                <div className="control-group">
                    <label className="text-xs font-semibold text-secondary mb-2 block">COLOR</label>
                    <div className="flex gap-2 flex-wrap items-center">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                className={`color-swatch ${!isCustomColor && selectedColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    setSelectedColor(color);
                                    setIsCustomColor(false);
                                }}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                        <div className="custom-color-wrapper ml-auto">
                            <input
                                type="color"
                                value={customColor}
                                onChange={(e) => {
                                    setCustomColor(e.target.value);
                                    setIsCustomColor(true);
                                }}
                                className={`color-picker ${isCustomColor ? 'selected' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="divider-h"></div>

                {/* Size Selection */}
                <div className="control-group">
                    <label className="text-xs font-semibold text-secondary mb-2 block">SIZE</label>
                    <div className="flex gap-2">
                        {SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`btn flex-1 text-xs ${selectedSize === size ? 'border-primary text-primary font-bold' : 'text-secondary'}`}
                                style={selectedSize === size ? { borderColor: 'var(--accent-color)', color: 'var(--accent-color)' } : {}}
                            >
                                {size}px
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divider-h"></div>

                {/* Position Grid (9-point) & Add */}
                <div className="control-group">
                    <label className="text-xs font-semibold text-secondary mb-2 block">ADD TO GRID</label>
                    <div className="position-grid">
                        <button className="grid-cell" aria-label="top-left" onClick={() => handleAdd('top-left')} />
                        <button className="grid-cell" aria-label="top-center" onClick={() => handleAdd('top-center')} />
                        <button className="grid-cell" aria-label="top-right" onClick={() => handleAdd('top-right')} />
                        <button className="grid-cell" aria-label="center-left" onClick={() => handleAdd('center-left')} />
                        <button className="grid-cell center" aria-label="center" onClick={() => handleAdd('center')} />
                        <button className="grid-cell" aria-label="center-right" onClick={() => handleAdd('center-right')} />
                        <button className="grid-cell" aria-label="bottom-left" onClick={() => handleAdd('bottom-left')} />
                        <button className="grid-cell" aria-label="bottom-center" onClick={() => handleAdd('bottom-center')} />
                        <button className="grid-cell" aria-label="bottom-right" onClick={() => handleAdd('bottom-right')} />
                    </div>
                </div>

            </div>
        </aside>
    );
};
