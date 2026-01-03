import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlaidService } from './services/plaid.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');

  private plaidService = inject(PlaidService);

  readonly accountBalances = toSignal(this.plaidService.loadAccountBalances(new Date(2024, 1, 1), new Date(Date.now())));
  readonly transactions = toSignal(this.plaidService.loadTransactions(new Date(2024, 1, 1), new Date(Date.now())));
}
