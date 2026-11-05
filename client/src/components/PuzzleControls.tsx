interface PuzzleControlsProps {
  canSolve: boolean
  solving: boolean
  onClear: () => void
  onShuffle: () => void
  onSolve: () => void
}

export function PuzzleControls({ canSolve, solving, onClear, onShuffle, onSolve }: PuzzleControlsProps) {
  return (
    <div className="controls">
      <button type="button" className="pill" onClick={onClear}>
        Clear
      </button>
      <button type="button" className="pill pill-round" onClick={onShuffle} aria-label="Shuffle outer letters">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className={`pill pill-primary${canSolve ? '' : ' is-muted'}`}
        onClick={onSolve}
        aria-busy={solving}
      >
        {solving ? <span className="spinner" aria-label="Solving" /> : 'Solve'}
      </button>
    </div>
  )
}
