import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PuzzleView } from './puzzle-view/puzzle-view';
import { ActionButtons } from './action-buttons/action-buttons';
import { SolutionsList } from './solutions-list/solutions-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PuzzleView, ActionButtons, SolutionsList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('web-ui');
}
