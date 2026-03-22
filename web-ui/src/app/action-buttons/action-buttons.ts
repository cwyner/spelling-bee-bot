import { Component } from '@angular/core';
import { Solve } from './solve/solve';

@Component({
  selector: 'app-action-buttons',
  imports: [Solve],
  templateUrl: './action-buttons.html',
  styleUrl: './action-buttons.css',
})
export class ActionButtons {}
