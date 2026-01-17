import { Component, computed, effect, ElementRef, HostListener, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown, Check } from 'lucide-angular';
import { SelectOption } from '../../interfaces/select.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [CommonModule, LucideAngularModule],
  standalone: true
})
export class SelectComponent {
  // Dependency injection using inject()
  private readonly elementRef = inject(ElementRef);

  // Icons
  readonly chevronDown = ChevronDown;
  readonly check = Check;

  // Inputs
  options = input.required<SelectOption[]>();
  value = model<string | number | null>(null);
  placeholder = input<string>('Select an option');
  disabled = input<boolean>(false);
  label = input<string | undefined>(undefined);
  clearInvalidSelection = input<boolean>(true);

  // Internal state
  isOpen = signal<boolean>(false);
  highlightedIndex = signal<number>(-1);

  // Computed values
  readonly selectedOption = computed(() => {
    const currentValue = this.value();
    return this.options().find(opt => opt.value === currentValue);
  });

  readonly displayText = computed(() => {
    return this.selectedOption()?.label || this.placeholder();
  });

  readonly enabledOptions = computed(() => {
    return this.options().filter(opt => !opt.disabled);
  });

  constructor() {
    // Handle options changes
    effect(() => {
      const opts = this.options();
      
      // Reset highlighted index when options change
      this.highlightedIndex.set(-1);
      
      // Check if current selection is still valid
      const currentValue = this.value();
      if (currentValue !== null && this.clearInvalidSelection()) {
        const stillValid = opts.some(opt => opt.value === currentValue);
        if (!stillValid) {
          console.warn('Selected value no longer exists in options, clearing selection');
          this.value.set(null);
        }
      }
    });

    // Handle disabled state changes
    effect(() => {
      if (this.disabled() && this.isOpen()) {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    if (this.disabled()) return;
    
    this.isOpen.update(open => !open);
    
    if (this.isOpen()) {
      // Set highlighted index to current selection
      const selectedIdx = this.options().findIndex(opt => opt.value === this.value());
      this.highlightedIndex.set(selectedIdx);
    }
  }

  selectOption(option: SelectOption, event: Event): void {
    event.stopPropagation();
    if (option.disabled) return;
    
    this.value.set(option.value);
    this.closeDropdown();
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else if (this.highlightedIndex() >= 0) {
          const option = this.options()[this.highlightedIndex()];
          if (!option.disabled) {
            this.selectOption(option, event);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          this.moveHighlight(1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          this.moveHighlight(-1);
        }
        break;
    }
  }

  private moveHighlight(direction: 1 | -1): void {
    const opts = this.options();
    let newIndex = this.highlightedIndex() + direction;

    // Wrap around
    if (newIndex < 0) {
      newIndex = opts.length - 1;
    } else if (newIndex >= opts.length) {
      newIndex = 0;
    }

    // Skip disabled options
    let attempts = 0;
    while (opts[newIndex]?.disabled && attempts < opts.length) {
      newIndex += direction;
      if (newIndex < 0) newIndex = opts.length - 1;
      if (newIndex >= opts.length) newIndex = 0;
      attempts++;
    }

    if (!opts[newIndex]?.disabled) {
      this.highlightedIndex.set(newIndex);
    }
  }
}
