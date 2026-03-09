import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner" role="status" aria-label="Loading">
      <span class="visually-hidden">Loading...</span>
    </div>
  `,
  styles: [`
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border-color, #e0e0e0);
      border-top-color: var(--primary, #1976d2);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
