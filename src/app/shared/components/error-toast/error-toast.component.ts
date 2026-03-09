import { Component, inject, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (message) {
      <div class="toast" role="alert" aria-live="assertive">
        <span>{{ message }}</span>
        @if (retry) {
          <button type="button" class="btn-retry" (click)="retry()">Retry</button>
        }
        <button type="button" class="btn-close" (click)="dismiss()" aria-label="Dismiss">×</button>
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      max-width: 400px;
      padding: 1rem;
      background: var(--error-bg, #ffebee);
      color: var(--error-fg, #c62828);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 9999;
    }
    .btn-retry, .btn-close { cursor: pointer; padding: 0.25rem 0.5rem; }
    .btn-close { margin-left: auto; font-size: 1.25rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorToastComponent implements OnDestroy {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  message: string | null = null;
  retry: (() => void) | undefined;

  constructor() {
    this.errorHandler.errors.pipe(takeUntil(this.destroy$)).subscribe((e) => {
      this.message = e.message;
      this.retry = e.retry;
      this.cdr.markForCheck();
    });
  }

  dismiss(): void {
    this.message = null;
    this.retry = undefined;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
