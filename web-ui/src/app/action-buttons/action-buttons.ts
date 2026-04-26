import { Component, inject } from '@angular/core';
import { Solve } from './solve/solve';
import { PuzzleService } from '../services/puzzle.service';

@Component({
  selector: 'app-action-buttons',
  imports: [Solve],
  templateUrl: './action-buttons.html',
  styleUrl: './action-buttons.css',
})
export class ActionButtons {
  protected readonly puzzleService = inject(PuzzleService);
}
