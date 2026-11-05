import { useMemo, useState, type CSSProperties } from 'react'
import { titleCase } from '../lib/puzzle'

export type SolveStatus = 'idle' | 'solving' | 'solved' | 'error'

interface SolutionsPanelProps {
  status: SolveStatus
  words: string[]
  onRetry: () => void
}

export function SolutionsPanel({ status, words, onRetry }: SolutionsPanelProps) {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? words.filter((w) => w.toLowerCase().includes(q)) : words
  }, [words, query])

  const hasWords = status === 'solved' && words.length > 0

  return (
    <section className="panel" aria-labelledby="solutions-title" aria-busy={status === 'solving'}>
      <div className="panel-head">
        <h2 id="solutions-title" className="panel-title">
          Solutions
        </h2>
        {hasWords && (
          <div className="stat">
            <span className="stat-value">{words.length}</span>
            <span className="stat-label">{words.length === 1 ? 'word' : 'words'}</span>
          </div>
        )}
      </div>

      {hasWords && (
        <div className="toolbar">
          <label className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Filter words"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Filter solutions"
            />
            {query && (
              <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Clear filter">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </label>
        </div>
      )}

      <div className="panel-body">
        {status === 'idle' && <EmptyState />}
        {status === 'solving' && <SkeletonList />}
        {status === 'error' && (
          <div className="panel-message">
            <p className="panel-message-title">The bees got lost.</p>
            <p className="panel-message-sub">We couldn't reach the solver. Check that the backend is running.</p>
            <button type="button" className="pill" onClick={onRetry}>
              Try again
            </button>
          </div>
        )}
        {status === 'solved' && words.length === 0 && (
          <div className="panel-message">
            <p className="panel-message-title">No words found.</p>
            <p className="panel-message-sub">This hive doesn't make any words of 4 letters or more.</p>
          </div>
        )}
        {hasWords && visible.length === 0 && (
          <div className="panel-message">
            <p className="panel-message-sub">No words match "{query.trim()}".</p>
          </div>
        )}
        {hasWords && visible.length > 0 && (
          <ul className="word-list">
            {visible.map((word, i) => (
              <li key={word} className="word" style={{ '--i': Math.min(i, 60) } as CSSProperties}>
                {titleCase(word)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="empty">
      <svg className="empty-art" viewBox="-60 -64 120 128" aria-hidden="true">
        {[
          [0, 0],
          [0, -40],
          [34.6, -20],
          [34.6, 20],
          [0, 40],
          [-34.6, 20],
          [-34.6, -20],
        ].map(([x, y], i) => (
          <polygon
            key={i}
            transform={`translate(${x} ${y})`}
            points="21,0 10.5,-18.2 -10.5,-18.2 -21,0 -10.5,18.2 10.5,18.2"
            className={i === 0 ? 'empty-hex-center' : 'empty-hex'}
          />
        ))}
      </svg>
      <p className="empty-title">Fill the hive and press Solve</p>
      <p className="empty-sub">Every valid word for your puzzle shows up here.</p>
    </div>
  )
}

function SkeletonList() {
  const widths = [72, 55, 88, 64, 47, 80, 60, 70, 52, 84, 66, 58, 76, 49, 68, 62, 82, 57]
  return (
    <ul className="word-list skeleton-list" aria-label="Loading solutions">
      {widths.map((w, i) => (
        <li key={i} className="word skeleton-row">
          <span className="skeleton-bar" style={{ width: `${w}%` }} />
        </li>
      ))}
    </ul>
  )
}
