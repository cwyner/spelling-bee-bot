/** Index 0 is the center (required) letter, 1-6 are the outer letters clockwise from the top. */
export type Letters = string[]

export const HEX_COUNT = 7

export const SAMPLE_LETTERS: Letters = ['N', 'T', 'L', 'W', 'E', 'O', 'D']

export const EMPTY_LETTERS: Letters = Array<string>(HEX_COUNT).fill('')

export function isComplete(letters: Letters): boolean {
  return letters.every((l) => l !== '')
}

export function shuffleOuter(letters: Letters): Letters {
  const outer = letters.slice(1)
  for (let i = outer.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[outer[i], outer[j]] = [outer[j], outer[i]]
  }
  return [letters[0], ...outer]
}

export function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}
