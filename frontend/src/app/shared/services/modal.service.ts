import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Signal-based state management
  readonly isOpen = signal<boolean>(false);

  /**
   * Opens the modal
   */
  open(): void {
    this.isOpen.set(true);
  }

  /**
   * Closes the modal
   */
  close(): void {
    this.isOpen.set(false);
  }

  /**
   * Toggles the modal open/closed state
   */
  toggle(): void {
    this.isOpen.update(open => !open);
  }
}
