import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PuzzleService } from '../../services/puzzle.service';

@Component({
  selector: 'app-solve',
  imports: [],
  templateUrl: './solve.html',
  styleUrl: './solve.css',
})
export class Solve {
  private readonly puzzleService = inject(PuzzleService);
  private readonly solveUrl = `${environment.apiBaseUrl}/solver`;

  async solve() {
    const puzzle = this.puzzleService.puzzle();
    if (!puzzle) return;

    const response = await fetch(this.solveUrl, {
      method: 'POST',
      body: JSON.stringify(puzzle),
      headers: { 'Content-Type': 'application/json' },
    });

    const solutions = await response.json();
    this.puzzleService.setSolutions(solutions);
  }
}
