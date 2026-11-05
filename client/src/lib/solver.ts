import { SAMPLE_SOLUTIONS } from './sampleSolutions'

/** Mirrors backend org.github.cwyner.dto.PuzzleDto */
export interface PuzzleDto {
  requiredLetter: string
  outerLetters: string[]
}

/** Mirrors backend org.github.cwyner.dto.SolutionsDto */
export interface SolutionsDto {
  solutions: string[]
}

/**
 * Solves a puzzle. Currently a mock that only knows the sample puzzle
 * (center N, outer T L W E O D) and returns no words for anything else.
 *
 * TODO: replace the body with the real request:
 *
 *   const res = await fetch('/solver', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(puzzle),
 *   })
 *   if (!res.ok) throw new Error(`Solver failed: ${res.status}`)
 *   return res.json()
 */
export async function solvePuzzle(puzzle: PuzzleDto): Promise<SolutionsDto> {
  await new Promise((resolve) => setTimeout(resolve, 900))

  const isSample =
    puzzle.requiredLetter.toLowerCase() === 'n' &&
    [...puzzle.outerLetters].map((l) => l.toLowerCase()).sort().join('') === 'delotw'

  return { solutions: isSample ? SAMPLE_SOLUTIONS : [] }
}
