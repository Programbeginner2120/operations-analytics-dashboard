import { effect, Injectable, signal } from '@angular/core';
import { Theme } from '../interfaces/theme.interface';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem(this.THEME_KEY, currentTheme);
    });
  }

  toggleTheme() {
    this.theme.update(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
  }

  private getInitialTheme(): Theme {
    const storedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  
}
