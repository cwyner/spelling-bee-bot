import { useMemo, useState, type CSSProperties } from 'react'
import { titleCase } from '../lib/puzzle'
import type { WordDto } from '../lib/solver'

export type SolveStatus = 'idle' | 'solving' | 'solved' | 'error'

type SortMode = 'alpha' | 'points'

interface SolutionsPanelProps {
  status: SolveStatus
  words: WordDto[]
  onRetry: () => void
}

export function SolutionsPanel({ status, words, onRetry }: SolutionsPanelProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('alpha')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q ? words.filter((w) => w.word.toLowerCase().includes(q)) : words
    const sorted = [...filtered]
    if (sort === 'points') {
      sorted.sort((a, b) => b.points - a.points || a.word.localeCompare(b.word))
    } else {
      sorted.sort((a, b) => a.word.localeCompare(b.word))
    }
    return sorted
  }, [words, query, sort])

  const pangramCount = useMemo(() => words.filter((w) => w.pangram).length, [words])
  const hasWords = status === 'solved' && words.length > 0

  return (
    <section className="panel" aria-labelledby="solutions-title" aria-busy={status === 'solving'}>
      <div className="panel-head">
        <h2 id="solutions-title" className="panel-title">
          Solutions
        </h2>
        {hasWords && (
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{words.length}</span>
              <span className="stat-label">{words.length === 1 ? 'word' : 'words'}</span>
            </div>
            <div className="stat stat-highlight">
              <span className="stat-value">{pangramCount}</span>
              <span className="stat-label">{pangramCount === 1 ? 'pangram' : 'pangrams'}</span>
            </div>
          </div>
        )}
      </div>

      {hasWords && (
        <div className="toolbar">
          <div className="sort-toggle" role="radiogroup" aria-label="Sort solutions">
            <button
              type="button"
              role="radio"
              aria-checked={sort === 'alpha'}
              className={sort === 'alpha' ? 'is-active' : ''}
              onClick={() => setSort('alpha')}
            >
              A-Z
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={sort === 'points'}
              className={sort === 'points' ? 'is-active' : ''}
              onClick={() => setSort('points')}
            >
              Points
            </button>
          </div>
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
            {visible.map((w, i) => (
              <li
                key={w.word}
                className={`word${w.pangram ? ' is-pangram' : ''}`}
                style={{ '--i': Math.min(i, 60) } as CSSProperties}
              >
                {titleCase(w.word)}
                {w.pangram && (
                  <span className="pangram-star" aria-label="pangram">
                    ★
                  </span>
                )}
                <span className="word-points">{w.points}</span>
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
