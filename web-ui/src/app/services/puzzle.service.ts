import { Injectable, signal } from "@angular/core";

export interface PuzzleDto {
    requiredLetter: string;
    outerLetters: string[];
}

export interface SolutionsDto {
    solutions: string[];
}

@Injectable({ providedIn: 'root' })
export class PuzzleService {
    private readonly _puzzle = signal<PuzzleDto | null>(null);
    readonly puzzle = this._puzzle.asReadonly();

    private readonly _isEditing = signal(false);
    readonly isEditing = this._isEditing.asReadonly();

    private readonly _solutions = signal<SolutionsDto | null>(null);
    readonly solutions = this._solutions.asReadonly();

    setPuzzle(dto: PuzzleDto) {
        this._puzzle.set(dto);
    }

    toggleEditing() {
        this._isEditing.update(v => !v);
    }

    setSolutions(dto: SolutionsDto) {
        this._solutions.set(dto);
    }
}