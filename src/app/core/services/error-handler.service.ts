import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

export interface AppError {
  message: string;
  retry?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private readonly errors$ = new Subject<AppError>();

  get errors() {
    return this.errors$.asObservable();
  }

  showError(message: string, retry?: () => void): void {
    this.errors$.next({ message, retry });
  }

  getUserFriendlyMessage(err: HttpErrorResponse): string {
    if (err.error?.message) return err.error.message;
    switch (err.status) {
      case 0:
        return 'Network error. Please check your connection.';
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Session expired. Please log in again.';
      case 403:
        return 'You do not have permission for this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return err.message || 'An unexpected error occurred.';
    }
  }
}
