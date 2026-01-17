import { Component, effect, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, LucideAngularModule],
  standalone: true
})
export class ModalComponent {
  // Dependency injection using inject()
  readonly modalService = inject(ModalService);

  // Icons
  readonly xIcon = X;

  constructor() {
    // Body scroll lock effect
    effect(() => {
      if (this.modalService.isOpen()) {
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
      this.modalService.close();
    }
  }

  /**
   * Closes the modal via the close button
   */
  closeModal(): void {
    this.modalService.close();
  }

  /**
   * Listens for Escape key to close modal
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.modalService.isOpen()) {
      this.modalService.close();
    }
  }
}
