import { Component, effect, HostListener, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, LucideAngularModule],
  standalone: true
})
export class ModalComponent {
  // Input signal for open state (controlled by parent)
  isOpen = input.required<boolean>();
  
  // Output for close event
  close = output<void>();

  // Icons
  readonly xIcon = X;

  constructor() {
    // Body scroll lock effect
    effect(() => {
      if (this.isOpen()) {
        // Lock body scroll when modal is open
        document.body.style.overflow = 'hidden';
      } else {
        // Restore body scroll when modal is closed
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Handles backdrop click - closes modal only if clicking the backdrop itself
   */
  onBackdropClick(event: MouseEvent): void {
    // Only close if clicking backdrop, not modal content
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  /**
   * Closes the modal via the close button
   */
  closeModal(): void {
    this.close.emit();
  }

  /**
   * Listens for Escape key to close modal
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close.emit();
    }
  }
}
