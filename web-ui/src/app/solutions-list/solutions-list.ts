import { Component, inject } from '@angular/core';
import { PuzzleService } from '../services/puzzle.service';

@Component({
  selector: 'app-solutions-list',
  imports: [],
  templateUrl: './solutions-list.html',
  styleUrl: './solutions-list.css',
})
export class SolutionsList {
  protected readonly puzzleService = inject(PuzzleService);
}
