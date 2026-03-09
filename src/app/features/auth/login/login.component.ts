import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-card" role="main">
      <h1>Workflow Dashboard</h1>
      <p class="hint">Use admin&#64;test.com / manager&#64;test.com / user&#64;test.com (any password)</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" autocomplete="email" />
        @if (form.get('email')?.invalid && form.get('email')?.touched) {
          <span class="error">Valid email is required</span>
        }
        <label for="password">Password</label>
        <input id="password" type="password" formControlName="password" autocomplete="current-password" />
        @if (form.get('password')?.invalid && form.get('password')?.touched) {
          <span class="error">Password is required</span>
        }
        @if (errorMessage) {
          <p class="error" role="alert">{{ errorMessage }}</p>
        }
        <button type="submit" [disabled]="form.invalid || loading">Log in</button>
      </form>
    </div>
  `,
  styles: [`
    .login-card {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 12px;
      background: var(--card-bg);
      box-shadow: var(--shadow);
    }
    .login-form { display: flex; flex-direction: column; gap: 0.75rem; }
    .login-form label { font-weight: 500; }
    .login-form input { padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color); }
    .login-form button { margin-top: 0.5rem; padding: 0.75rem; cursor: pointer; }
    .error { color: var(--error, #c62828); font-size: 0.875rem; }
    .hint { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem; }
  `],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.auth.login(this.form.value.email!, this.form.value.password!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.errorMessage = 'Login failed. Please try again.';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
