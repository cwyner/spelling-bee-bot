export interface PuzzleDto {
  requiredLetter: string
  outerLetters: string[]
}

export interface WordDto {
  word: string
  pangram: boolean
  points: number
  /** False for rare words that fit the puzzle but are less likely to be accepted by NYT. */
  common: boolean
}

export interface SolutionsDto {
  solutions: WordDto[]
}

export async function solvePuzzle(puzzle: PuzzleDto): Promise<SolutionsDto> {
  // Same-origin path: proxied by Vite in dev and rewritten to Cloud Run by Vercel in prod.
  const response = await fetch('/solver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(puzzle),
  })

  if (!response.ok) {
    throw new Error(`Solver failed with status ${response.status}`)
  }

  return response.json()
}
