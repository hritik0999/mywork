import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models';
import { map, take } from 'rxjs/operators';

export function roleGuard(allowedRoles: Role[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.currentUser.pipe(
      take(1),
      map(user => {
        if (user && allowedRoles.includes(user.role)) return true;
        return router.createUrlTree(['/dashboard']);
      })
    );
  };
}
