import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData, Loader2 } from 'lucide-angular';
import { ButtonVariant, ButtonSize, ButtonType } from '../../interfaces/button.interface';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CommonModule, LucideAngularModule],
  standalone: true
})
export class ButtonComponent {
  // Icons
  readonly loaderIcon = Loader2;

  // Inputs
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  iconBefore = input<LucideIconData | undefined>(undefined);
  iconAfter = input<LucideIconData | undefined>(undefined);
  type = input<ButtonType>('button');
  fullWidth = input<boolean>(false);
  ariaLabel = input<string | undefined>(undefined);

  // Outputs
  clicked = output<MouseEvent>();

  // Computed button classes
  readonly buttonClasses = computed(() => {
    const classes = ['btn'];
    
    // Variant classes
    classes.push(`btn--${this.variant()}`);
    
    // Size classes
    classes.push(`btn--${this.size()}`);
    
    // Full width
    if (this.fullWidth()) {
      classes.push('btn--full-width');
    }
    
    // Loading state
    if (this.loading()) {
      classes.push('btn--loading');
    }
    
    return classes.join(' ');
  });

  // Computed disabled state
  readonly isDisabled = computed(() => this.disabled() || this.loading());

  // Computed aria-busy
  readonly ariaBusy = computed(() => this.loading());

  /**
   * Handles button click events
   */
  onClick(event: MouseEvent): void {
    if (!this.isDisabled()) {
      this.clicked.emit(event);
    }
  }
}
