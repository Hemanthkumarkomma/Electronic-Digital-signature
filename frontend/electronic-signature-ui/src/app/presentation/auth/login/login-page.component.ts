import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../online/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly loginError = signal('');
  protected readonly passwordVisible = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {

    this.loginError.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService
      .login({
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value,
      })
      .subscribe({

        next: () => {

          this.isSubmitting.set(false);

          // AuthService has already stored the logged-in
          // user's exhibitor type in localStorage.
          const exhibitorType =
            this.authService.getExhibitorType();

          if (exhibitorType === 'Junior') {
            this.router.navigate(['/consent/junior']);
            return;
          }

          if (exhibitorType === 'Open') {
            this.router.navigate(['/consent/open']);
            return;
          }

          // Fallback if exhibitor type is missing/invalid.
          this.router.navigate(['/dashboard']);
        },

        error: () => {

          this.isSubmitting.set(false);

          this.loginError.set(
            'Invalid email or password. Please try again.'
          );
        },

      });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(
      (visible) => !visible
    );
  }
}