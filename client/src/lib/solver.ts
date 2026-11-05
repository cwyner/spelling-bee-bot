import { API_URL } from '../config'

export interface PuzzleDto {
  requiredLetter: string
  outerLetters: string[]
}

export interface SolutionsDto {
  solutions: string[]
}

export async function solvePuzzle(puzzle: PuzzleDto): Promise<SolutionsDto> {
  const response = await fetch(`${API_URL}/solver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(puzzle),
  })

  if (!response.ok) {
    throw new Error(`Solver failed with status ${response.status}`)
  }

  return response.json()
}
