import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header" role="banner">
      <nav class="nav" aria-label="Main navigation">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/workflows" routerLinkActive="active">Workflows</a>
      </nav>
      <div class="header-actions">
        <button
          type="button"
          (click)="theme.toggleTheme()"
          [attr.aria-label]="theme.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          {{ theme.theme === 'dark' ? '☀️' : '🌙' }}
        </button>
        <span class="user" *ngIf="user">{{ user.name }} ({{ user.role }})</span>
        <button type="button" (click)="logout()">Logout</button>
      </div>
    </header>
    <main class="main" role="main">
      <router-outlet />
    </main>
  `,
  styles: [`
    .header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--header-bg); border-bottom: 1px solid var(--border-color); }
    .nav { display: flex; gap: 1rem; }
    .nav a { text-decoration: none; color: var(--text); }
    .nav a.active { font-weight: 600; }
    .header-actions { display: flex; align-items: center; gap: 0.75rem; }
    .main { padding: 1rem; min-height: 80vh; }
  `],
})
export class MainLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly theme = inject(ThemeService);
  user = this.auth.currentUserValue;

  logout(): void {
    this.auth.logout();
  }
}
