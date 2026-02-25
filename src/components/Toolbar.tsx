import React from 'react';

interface ToolbarProps {
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
    onExport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onClear,
    onExport,
}) => {
    return (
        <header className="toolbar glass">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mr-2" style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', fontWeight: 'bold' }}>
                    C
                </div>
                <h1 className="logo text-lg font-bold">Canvas UI</h1>
            </div>

            <div className="toolbar-actions flex gap-2 items-center">
                <button
                    className="btn"
                    onClick={onUndo}
                    disabled={!canUndo}
                    style={{ opacity: canUndo ? 1 : 0.5, cursor: canUndo ? 'pointer' : 'not-allowed' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                    </svg>
                    Undo
                </button>
                <button
                    className="btn"
                    onClick={onRedo}
                    disabled={!canRedo}
                    style={{ opacity: canRedo ? 1 : 0.5, cursor: canRedo ? 'pointer' : 'not-allowed' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <path d="M21 7v6h-6"></path>
                        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
                    </svg>
                    Redo
                </button>

                <div className="divider"></div>

                <button className="btn btn-danger" onClick={onClear}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Clear
                </button>
                <button className="btn btn-primary" onClick={onExport}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export PNG
                </button>
            </div>
        </header>
    );
};
