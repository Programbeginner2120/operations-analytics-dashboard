import { Component, computed, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { InputType, InputSize, InputVariant } from '../../interfaces/input.interface';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [CommonModule, LucideAngularModule],
  standalone: true
})
export class InputComponent {
  // Inputs
  type = input<InputType>('text');
  size = input<InputSize>('medium');
  variant = input<InputVariant>('default');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  label = input<string | undefined>(undefined);
  helperText = input<string | undefined>(undefined);
  errorMessage = input<string | undefined>(undefined);
  maxLength = input<number | undefined>(undefined);
  required = input<boolean>(false);
  iconBefore = input<LucideIconData | undefined>(undefined);
  iconAfter = input<LucideIconData | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);
  autocomplete = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  id = input<string | undefined>(undefined);

  // Two-way binding for value
  value = model<string>('');

  // Outputs
  focused = output<FocusEvent>();
  blurred = output<FocusEvent>();

  // Internal state
  isFocused = signal<boolean>(false);

  // Computed values
  readonly inputClasses = computed(() => {
    const classes = ['input'];
    
    // Size classes
    classes.push(`input--${this.size()}`);
    
    // Variant classes
    classes.push(`input--${this.variant()}`);
    
    // Icon classes
    if (this.iconBefore()) {
      classes.push('input--has-icon-before');
    }
    if (this.iconAfter()) {
      classes.push('input--has-icon-after');
    }
    
    // Focus state
    if (this.isFocused()) {
      classes.push('input--focused');
    }
    
    return classes.join(' ');
  });

  readonly wrapperClasses = computed(() => {
    const classes = ['input-wrapper'];
    
    // Variant classes
    classes.push(`input-wrapper--${this.variant()}`);
    
    // Focus state
    if (this.isFocused()) {
      classes.push('input-wrapper--focused');
    }
    
    // Disabled state
    if (this.disabled()) {
      classes.push('input-wrapper--disabled');
    }
    
    return classes.join(' ');
  });

  readonly showError = computed(() => {
    return this.variant() === 'error' && this.errorMessage() !== undefined;
  });

  readonly showHelper = computed(() => {
    return !this.showError() && this.helperText() !== undefined;
  });

  readonly showCharacterCount = computed(() => {
    return this.maxLength() !== undefined && this.maxLength()! > 0;
  });

  readonly characterCount = computed(() => {
    const current = this.value().length;
    const max = this.maxLength() || 0;
    return `${current}/${max}`;
  });

  readonly isOverLimit = computed(() => {
    if (!this.maxLength()) return false;
    return this.value().length > this.maxLength()!;
  });

  readonly ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    const inputId = this.id() || 'input';
    
    if (this.showError()) {
      ids.push(`${inputId}-error`);
    } else if (this.showHelper()) {
      ids.push(`${inputId}-helper`);
    }
    
    if (this.showCharacterCount()) {
      ids.push(`${inputId}-count`);
    }
    
    return ids.length > 0 ? ids.join(' ') : undefined;
  });

  readonly ariaInvalid = computed(() => {
    return this.variant() === 'error';
  });

  /**
   * Handles input value changes
   */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  /**
   * Handles focus events
   */
  onFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focused.emit(event);
  }

  /**
   * Handles blur events
   */
  onBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.blurred.emit(event);
  }
}
