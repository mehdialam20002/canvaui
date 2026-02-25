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
    id: string; 
    type: ShapeType;
    color: string;
    size: number; 
    x: number; 
    y: number; 
    createdAt: number;
}

export interface CanvasDimensions {
    width: number;
    height: number;
}
