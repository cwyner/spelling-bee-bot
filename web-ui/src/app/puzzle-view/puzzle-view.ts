import { Component } from '@angular/core';
import { Honeycomb } from './honeycomb/honeycomb';

@Component({
  selector: 'app-puzzle-view',
  imports: [Honeycomb],
  templateUrl: './puzzle-view.html',
  styleUrl: './puzzle-view.css',
})
export class PuzzleView {}
