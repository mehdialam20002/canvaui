export type ShapeType = 'Circle' | 'Square' | 'Triangle';

export type PositionGrid =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export interface Shape {
    id: string; // Unique ID
    type: ShapeType;
    color: string;
    size: number; // For simplicity, we assume square bounding box (e.g., radius = size/2)
    x: number; // Center X
    y: number; // Center Y
    createdAt: number;
}

export interface CanvasDimensions {
    width: number;
    height: number;
}
