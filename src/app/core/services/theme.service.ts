import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'wf_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly theme$ = new BehaviorSubject<Theme>(this.getInitialTheme());

  get theme(): Theme {
    return this.theme$.value;
  }

  get themeChanges() {
    return this.theme$.asObservable();
  }

  setTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
      this.theme$.next(theme);
    }
  }

  toggleTheme(): void {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  private getInitialTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored) {
        document.documentElement.setAttribute('data-theme', stored);
        return stored;
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      return theme;
    }
    return 'light';
  }
}
