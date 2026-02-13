import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription, from, switchMap, EMPTY, catchError } from 'rxjs';
import { PlaidService } from '../../../../services/plaid.service';
import { PlaidItem } from '../../../../interfaces/plaid.interface';
import { NgxPlaidLinkService, PlaidConfig, PlaidLinkHandler } from 'ngx-plaid-link';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-plaid-layout',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './plaid-layout.component.html',
  styleUrls: ['./plaid-layout.component.scss']
})
export class PlaidLayoutComponent implements OnInit, OnDestroy {
  private plaidService = inject(PlaidService);
  private plaidLinkService = inject(NgxPlaidLinkService);

  connectedItems = signal<PlaidItem[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  private plaidLinkHandler?: PlaidLinkHandler;
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.loadConnectedItems();
  }

  ngOnDestroy(): void {
    this.plaidLinkHandler?.destroy();
    this.subscriptions.unsubscribe();
  }

  loadConnectedItems(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const sub = this.plaidService.getConnectedItems().subscribe({
      next: (items) => {
        this.connectedItems.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading connected items:', error);
        this.errorMessage.set('Failed to load connected accounts');
        this.loading.set(false);
      }
    });
    this.subscriptions.add(sub);
  }

  openPlaidLink(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const sub = this.plaidService.createLinkToken().pipe(
      switchMap(response => {
        if (!response?.linkToken) {
          throw new Error('Failed to get link token');
        }

        const config: PlaidConfig = {
          token: response.linkToken,
          onSuccess: (public_token: string, metadata: any) => {
            console.log('Plaid Link success:', metadata);
            this.handlePlaidSuccess(public_token);
          },
          onExit: (error: any, metadata: any) => {
            console.log('Plaid Link exit:', error, metadata);
            this.loading.set(false);
            if (error) {
              this.errorMessage.set(error.error_message || 'Connection cancelled');
            }
          },
          onEvent: (eventName: string, metadata: any) => {
            console.log('Plaid Link event:', eventName, metadata);
          }
        };

        return from(this.plaidLinkService.createPlaid(config));
      }),
      catchError(error => {
        console.error('Error opening Plaid Link:', error);
        this.errorMessage.set('Failed to initialize Plaid Link');
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe(handler => {
      this.plaidLinkHandler = handler;
      handler.open();
    });

    this.subscriptions.add(sub);
  }

  deleteAccount(item: PlaidItem): void {
    if (!confirm(`Are you sure you want to disconnect ${item.institutionName}?`)) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const sub = this.plaidService.deleteItem(item.itemId).subscribe({
      next: () => {
        console.log('Successfully deleted item:', item.itemId);
        this.loadConnectedItems();
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        this.errorMessage.set('Failed to disconnect account');
        this.loading.set(false);
      }
    });
    this.subscriptions.add(sub);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  private handlePlaidSuccess(publicToken: string): void {
    const sub = this.plaidService.exchangePublicToken(publicToken).subscribe({
      next: (item) => {
        console.log('Successfully connected item:', item);
        this.loadConnectedItems();
      },
      error: (error) => {
        console.error('Error exchanging token:', error);
        this.errorMessage.set('Failed to save connection');
        this.loading.set(false);
      }
    });
    this.subscriptions.add(sub);
  }
}
