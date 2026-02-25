import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { Shape, CanvasDimensions } from './types';
import { useShapes } from './hooks/useShapes';
import { useCanvas } from './hooks/useCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { CanvasArea } from './components/CanvasArea';
import { LayersPanel } from './components/LayersPanel';
import { Toolbar } from './components/Toolbar';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    shapes,
    addShape,
    updateShape,
    removeShape,
    clearShapes,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useShapes();

  // Helper to generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleAddShape = (shapeData: Omit<Shape, 'id' | 'createdAt'>) => {
    const newShape: Shape = {
      ...shapeData,
      id: generateId(),
      createdAt: Date.now(),
    };
    addShape(newShape);
    setSelectedId(newShape.id);
  };

  const handleUpdateShape = useCallback((id: string, updates: Partial<Shape>) => {
    updateShape(id, updates);
  }, [updateShape]);

  // Handle keyboard shortcuts (Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        removeShape(selectedId);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, removeShape]);

  // Export Canvas
  const handleExport = () => {
    const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
    if (canvas) {
      // Create a temporary canvas to draw a white background if needed,
      // but standard transparent PNG is also good for SaaS tools. We'll stick to standard.
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'canvas-export.png';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const canvasDimensions: CanvasDimensions = { width: 800, height: 600 };

  const {
    canvasRef,
    hoveredId,
    setHoveredId,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
  } = useCanvas(shapes, selectedId, setSelectedId, handleUpdateShape);

  return (
    <div className="app-container">
      <Toolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onClear={() => {
          clearShapes();
          setSelectedId(null);
        }}
        onExport={handleExport}
      />

      <main className="workspace">
        <ControlsPanel
          onAddShape={handleAddShape}
          canvasDimensions={canvasDimensions}
        />

        <CanvasArea
          canvasRef={canvasRef}
          dimensions={canvasDimensions}
          isDragging={isDragging}
          isHovering={hoveredId !== null}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        />

        <LayersPanel
          shapes={shapes}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          onDelete={(id) => {
            removeShape(id);
            if (selectedId === id) setSelectedId(null);
          }}
        />
      </main>
    </div>
  );
}

export default App;
