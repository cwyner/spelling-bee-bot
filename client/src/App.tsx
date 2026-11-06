import { useCallback, useEffect, useRef, useState } from 'react'
import { Header } from './components/Header'
import { Honeycomb } from './components/Honeycomb'
import { PuzzleControls } from './components/PuzzleControls'
import { SolutionsPanel, type SolveStatus } from './components/SolutionsPanel'
import { EMPTY_LETTERS, HEX_COUNT, SAMPLE_LETTERS, isComplete, shuffleOuter, type Letters } from './lib/puzzle'
import { solvePuzzle, type WordDto } from './lib/solver'

interface Toast {
  id: number
  message: string
}

/** Keys that the focused element should keep for itself instead of sending to the hive. */
function belongsToTarget(target: EventTarget | null, key: string): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return true
  return target.tagName === 'BUTTON' && key === 'Enter'
}

export default function App() {
  const [letters, setLetters] = useState<Letters>(SAMPLE_LETTERS)
  const [selected, setSelected] = useState(0)
  const [shuffleKey, setShuffleKey] = useState(0)
  const [status, setStatus] = useState<SolveStatus>('idle')
  const [words, setWords] = useState<WordDto[]>([])
  const [toast, setToast] = useState<Toast | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const requestId = useRef(0)

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  /** Editing the letters makes any results stale, so drop them and cancel in-flight requests. */
  const updateLetters = useCallback((next: Letters) => {
    requestId.current++
    setLetters(next)
    setStatus('idle')
    setWords([])
  }, [])

  const solve = useCallback(async () => {
    if (!isComplete(letters)) {
      showToast('Fill all 7 cells first')
      return
    }
    const id = ++requestId.current
    setStatus('solving')
    try {
      const result = await solvePuzzle({
        requiredLetter: letters[0],
        outerLetters: letters.slice(1),
      })
      if (id !== requestId.current) return
      setWords(result.solutions)
      setStatus('solved')
    } catch {
      if (id !== requestId.current) return
      setStatus('error')
    }
  }, [letters, showToast])

  const handleKey = useCallback(
    (key: string) => {
      if (/^[a-zA-Z]$/.test(key)) {
        const letter = key.toUpperCase()
        if (letters[selected] === letter) return
        if (letters.includes(letter)) {
          showToast(`${letter} is already in the hive`)
          return
        }
        const next = [...letters]
        next[selected] = letter
        updateLetters(next)
        for (let step = 1; step < HEX_COUNT; step++) {
          const i = (selected + step) % HEX_COUNT
          if (!next[i]) {
            setSelected(i)
            return
          }
        }
        return
      }
      switch (key) {
        case 'Backspace':
        case 'Delete': {
          const target = letters[selected] ? selected : (selected + HEX_COUNT - 1) % HEX_COUNT
          if (letters[target]) {
            const next = [...letters]
            next[target] = ''
            updateLetters(next)
          }
          setSelected(target)
          return
        }
        case 'ArrowRight':
        case 'ArrowDown':
          setSelected((selected + 1) % HEX_COUNT)
          return
        case 'ArrowLeft':
        case 'ArrowUp':
          setSelected((selected + HEX_COUNT - 1) % HEX_COUNT)
          return
        case 'Enter':
          void solve()
          return
      }
    },
    [letters, selected, showToast, solve, updateLetters],
  )

  // Let users type straight into the hive without clicking it first.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || belongsToTarget(e.target, e.key)) return
      if (/^[a-zA-Z]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
        e.preventDefault()
        inputRef.current?.focus()
        handleKey(e.key)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  function clear() {
    updateLetters(EMPTY_LETTERS)
    setSelected(0)
    inputRef.current?.focus()
  }

  function shuffle() {
    setLetters(shuffleOuter(letters))
    setShuffleKey((k) => k + 1)
  }

  return (
    <>
      <Header />
      <main className="game">
        <section className="puzzle" aria-label="Puzzle">
          <div className="puzzle-intro">
            <p className="eyebrow">Today's hive</p>
            <p className="puzzle-hint">
              Click a cell and type. The <span className="hint-swatch" /> center letter is required.
            </p>
          </div>
          <div className="toast-slot" aria-live="polite">
            {toast && (
              <div key={toast.id} className="toast">
                {toast.message}
              </div>
            )}
          </div>
          <Honeycomb
            letters={letters}
            selected={selected}
            shuffleKey={shuffleKey}
            inputRef={inputRef}
            onSelect={setSelected}
            onKey={handleKey}
          />
          <PuzzleControls
            canSolve={isComplete(letters)}
            solving={status === 'solving'}
            onClear={clear}
            onShuffle={shuffle}
            onSolve={() => void solve()}
          />
        </section>
        <SolutionsPanel status={status} words={words} onRetry={() => void solve()} />
      </main>
    </>
  )
}
