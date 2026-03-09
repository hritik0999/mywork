import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, take } from 'rxjs/operators';
import { WorkflowApiService } from '../../../core/services/workflow-api.service';

export function workflowNameUniqueValidator(
  api: WorkflowApiService,
  excludeId?: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      debounceTime(500),
      take(1),
      switchMap((name) => {
        const n = (name as string)?.trim();
        if (!n) return of(null);
        return api.checkNameUnique(n, excludeId).pipe(
          map((unique) => (unique ? null : { nameNotUnique: true })),
          catchError(() => of(null))
        );
      })
    );
  };
}
