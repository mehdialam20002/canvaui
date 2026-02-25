import { Shape } from '../types';

export function drawShape(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    isHovered: boolean = false,
    isSelected: boolean = false
) {
    const { type, color, size, x, y, createdAt } = shape;
    const halfSize = size / 2;

    ctx.save();

    // Highlight/Selection styles override (only for shadows/glows now)
    if (isSelected) {
        // Glow effect
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 10;
    } else if (isHovered) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 5;
    } else {
        // Normal shape subtle shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
    }

    // Appearance animation
    const age = Date.now() - (createdAt || 0); // fallback if not present
    const duration = 250; // ms
    let scale = 1;
    if (age < duration) {
        // easeOutCirc: Math.sqrt(1 - Math.pow(t - 1, 2))
        const t = age / duration;
        scale = Math.sqrt(1 - Math.pow(t - 1, 2));
    }

    ctx.translate(x, y);
    ctx.scale(scale, Math.max(scale, 0.001)); // Ensure scale doesn't go to 0 for stroke
    ctx.translate(-x, -y);

    // Basic styles
    ctx.fillStyle = color;
    ctx.strokeStyle = isSelected ? '#3b82f6' : isHovered ? '#94a3b8' : '#e2e8f0'; // Default border color based on theme
    ctx.lineWidth = isSelected ? 4 : isHovered ? 3 : 2;

    ctx.beginPath();

    switch (type) {
        case 'Circle':
            ctx.arc(x, y, halfSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'Square':
            ctx.rect(x - halfSize, y - halfSize, size, size);
            ctx.fill();
            ctx.stroke();
            break;
        case 'Triangle': {
            // Mathematically centered triangle in bounding box
            const topX = x;
            const topY = y - halfSize;
            const blX = x - halfSize;
            const blY = y + halfSize;
            const brX = x + halfSize;
            const brY = y + halfSize;

            ctx.moveTo(topX, topY);
            ctx.lineTo(blX, blY);
            ctx.lineTo(brX, brY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        }
    }

    ctx.restore();
}

const sign = (p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number) => {
    return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
};

export function isPointInShape(px: number, py: number, shape: Shape): boolean {
    const { type, x, y, size } = shape;
    const halfSize = size / 2;

    switch (type) {
        case 'Circle': {
            const dx = px - x;
            const dy = py - y;
            return dx * dx + dy * dy <= halfSize * halfSize;
        }
        case 'Square': {
            return (
                px >= x - halfSize &&
                px <= x + halfSize &&
                py >= y - halfSize &&
                py <= y + halfSize
            );
        }
        case 'Triangle': {
            const topX = x;
            const topY = y - halfSize;
            const blX = x - halfSize;
            const blY = y + halfSize;
            const brX = x + halfSize;
            const brY = y + halfSize;

            const d1 = sign(px, py, topX, topY, blX, blY);
            const d2 = sign(px, py, blX, blY, brX, brY);
            const d3 = sign(px, py, brX, brY, topX, topY);

            const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
            const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

            return !(hasNeg && hasPos);
        }
    }
}
