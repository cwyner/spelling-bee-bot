import { Component, inject } from '@angular/core';
import { PuzzleService } from '../../services/puzzle.service';

interface Hex {
  id: string;
  x: number;
  y: number;
  letter: string;
}

@Component({
  selector: 'app-honeycomb',
  imports: [],
  templateUrl: './honeycomb.html',
  styleUrl: './honeycomb.css',
})
export class Honeycomb {
  private readonly puzzleService = inject(PuzzleService);
  readonly isEditing = this.puzzleService.isEditing;

  private readonly r = 50;
  private readonly d = Math.sqrt(3) * this.r; // center-to-center distance between adjacent hexes

  readonly hexes: Hex[] = [
    { id: 'center',       x: 0,            y: 0           , letter: '' },
    { id: 'top',          x: 0,            y: -this.d     , letter: '' },
    { id: 'top-right',    x: this.r * 1.5, y: -this.d / 2, letter: '' },
    { id: 'bottom-right', x: this.r * 1.5, y: this.d / 2 , letter: '' },
    { id: 'bottom',       x: 0,            y: this.d      , letter: '' },
    { id: 'bottom-left',  x: -this.r * 1.5, y: this.d / 2, letter: '' },
    { id: 'top-left',     x: -this.r * 1.5, y: -this.d / 2, letter: '' },
  ];

  onLetterChange(hex: Hex, event: Event) {
    const input = event.target as HTMLInputElement;
    hex.letter = input.value.toUpperCase();
    input.value = hex.letter;
    this.syncToService();
  }

  private syncToService() {
    const center = this.hexes.find(h => h.id === 'center')!;
    const outer = this.hexes.filter(h => h.id !== 'center');
    this.puzzleService.setPuzzle({
      requiredLetter: center.letter,
      outerLetters: outer.map(h => h.letter),
    });
  }
}
