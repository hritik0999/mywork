import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { User, Role } from '../models';

const TOKEN_KEY = 'wf_auth_token';
const USER_KEY = 'wf_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly currentUser$ = new BehaviorSubject<User | null>(this.getStoredUser());

  get currentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get currentUserValue(): User | null {
    return this.currentUser$.value;
  }

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    // Mock authentication: any email/password works; role derived from email prefix
    const role = this.getMockRole(email);
    const user: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role,
    };
    const token = btoa(JSON.stringify({ email, role, exp: Date.now() + 86400000 }));
    this.setSession(token, user);
    this.currentUser$.next(user);
    return of({ user, token }).pipe(
      tap(() => {}),
      catchError(() => of({ user, token }))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser$.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasRole(allowedRoles: Role[]): boolean {
    const user = this.currentUser$.value;
    return user ? allowedRoles.includes(user.role) : false;
  }

  private getMockRole(email: string): Role {
    const lower = email.toLowerCase();
    if (lower.startsWith('admin@') || lower.includes('admin')) return 'admin';
    if (lower.startsWith('manager@') || lower.includes('manager')) return 'manager';
    return 'user';
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
