import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, retry, timer } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';

const RETRY_DELAY_MS = 1000;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    retry({ count: 2, delay: () => timer(RETRY_DELAY_MS) }),
    catchError((err: HttpErrorResponse) => {
      const message = errorHandler.getUserFriendlyMessage(err);
      errorHandler.showError(message);
      return throwError(() => err);
    })
  );
};
