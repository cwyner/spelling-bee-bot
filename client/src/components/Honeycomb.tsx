import { useState, type RefObject } from 'react'
import type { Letters } from '../lib/puzzle'

/** Cell spacing radius; centers sit √3·R apart (same layout as the old Angular honeycomb). */
const R = 52
const D = Math.sqrt(3) * R
/** Drawn hex radius. Smaller than R so the cells have white gutters between them. */
const HEX_R = 48

const POSITIONS = [
  { name: 'Center', x: 0, y: 0 },
  { name: 'Top', x: 0, y: -D },
  { name: 'Top right', x: R * 1.5, y: -D / 2 },
  { name: 'Bottom right', x: R * 1.5, y: D / 2 },
  { name: 'Bottom', x: 0, y: D },
  { name: 'Bottom left', x: -R * 1.5, y: D / 2 },
  { name: 'Top left', x: -R * 1.5, y: -D / 2 },
]

function hexPoints(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}

const OUTER_POINTS = hexPoints(HEX_R)
const RING_POINTS = hexPoints(HEX_R - 4)

interface HoneycombProps {
  letters: Letters
  selected: number
  shuffleKey: number
  inputRef: RefObject<HTMLInputElement | null>
  onSelect: (index: number) => void
  onKey: (key: string) => void
}

export function Honeycomb({ letters, selected, shuffleKey, inputRef, onSelect, onKey }: HoneycombProps) {
  const [focused, setFocused] = useState(false)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (/^[a-zA-Z]$/.test(e.key) || ['Backspace', 'Delete', 'Enter'].includes(e.key) || e.key.startsWith('Arrow')) {
      e.preventDefault()
      onKey(e.key)
    } else if (e.key === 'Escape') {
      e.currentTarget.blur()
    }
  }

  // Fallback for mobile keyboards, which often skip meaningful keydown events.
  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    const value = e.currentTarget.value
    e.currentTarget.value = ''
    const last = value.slice(-1)
    if (/^[a-zA-Z]$/.test(last)) onKey(last)
  }

  return (
    <div className={`honeycomb${focused ? ' is-focused' : ''}`}>
      <svg viewBox="-130 -136 260 272" role="group" aria-label="Puzzle letters">
        {POSITIONS.map((pos, i) => {
          const letter = letters[i]
          const isSelected = focused && i === selected
          return (
            <g key={pos.name} transform={`translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`}>
              <g
                className={`cell${i === 0 ? ' cell-center' : ''}${letter ? '' : ' cell-empty'}${isSelected ? ' cell-selected' : ''}`}
                role="button"
                aria-label={`${pos.name} letter${i === 0 ? ' (required)' : ''}: ${letter || 'empty'}`}
                onPointerDown={(e) => {
                  e.preventDefault()
                  onSelect(i)
                  inputRef.current?.focus()
                }}
              >
                <polygon className="cell-hex" points={OUTER_POINTS} />
                {isSelected && <polygon className="cell-ring" points={RING_POINTS} />}
                {letter ? (
                  <text key={i === 0 ? 'center' : `${shuffleKey}-${letter}`} className="cell-letter" textAnchor="middle" y="1">
                    {letter}
                  </text>
                ) : (
                  isSelected && <rect className="cell-caret" x="-1.5" y="-17" width="3" height="34" rx="1.5" />
                )}
              </g>
            </g>
          )
        })}
      </svg>
      <input
        ref={inputRef}
        className="honeycomb-input"
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Type a letter into the selected cell"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}
