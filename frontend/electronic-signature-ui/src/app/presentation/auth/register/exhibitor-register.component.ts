
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../online/services/auth.service';

@Component({
  selector: 'app-exhibitor-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './exhibitor-register.component.html',
  styleUrls: ['./exhibitor-register.component.css']
})
export class ExhibitorRegisterComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly allowedExhibitorTypes = ['Junior', 'Open'];

  registerForm: FormGroup;

  passwordVisibleValue = false;
  confirmPasswordVisibleValue = false;

  submitting = false;
  registrationError = '';

  constructor(private fb: FormBuilder) {

    this.registerForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(10)
          ]
        ],

        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(10)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{10}$/)
          ]
        ],

        exhibitorType: [
          '',
          [
            Validators.required,
            this.allowedExhibitorTypeValidator.bind(this)
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],

        confirmPassword: [
          '',
          Validators.required
        ],

        terms: [
          false,
          Validators.requiredTrue
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }


  /**
   * Password and confirm-password validation.
   */
  passwordMatchValidator(
    form: AbstractControl
  ): { [key: string]: boolean } | null {

    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (
      password &&
      confirmPassword &&
      password !== confirmPassword
    ) {
      return {
        passwordMismatch: true
      };
    }


    return null;
  }


  /**
   * Restrict exhibitor type to currently supported backend values.
   */
  allowedExhibitorTypeValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {

    if (!control.value) {
      return null;
    }

    return this.allowedExhibitorTypes.includes(control.value)
      ? null
      : { invalidExhibitorType: true };
  }


  /**
   * Show validation error for a specific form control.
   */
  showControlError(
    controlName: string,
    errorType: string
  ): boolean {

    const control = this.registerForm.get(controlName);

    if (!control) {
      return false;
    }

    return (
      control.hasError(errorType) &&
      (control.touched || control.dirty)
    );
  }


  /**
   * Show password mismatch error.
   */
  showPasswordMismatch(): boolean {

    const passwordControl =
      this.registerForm.get('password');

    const confirmPasswordControl =
      this.registerForm.get('confirmPassword');

    if (
      !passwordControl ||
      !confirmPasswordControl
    ) {
      return false;
    }

    return (
      this.registerForm.hasError('passwordMismatch') &&
      !!confirmPasswordControl.value &&
      (passwordControl.touched ||
       passwordControl.dirty ||
       confirmPasswordControl.touched ||
       confirmPasswordControl.dirty)
    );
  }


  /**
   * Password visibility.
   */
  passwordVisible(): boolean {
    return this.passwordVisibleValue;
  }


  /**
   * Confirm password visibility.
   */
  confirmPasswordVisible(): boolean {
    return this.confirmPasswordVisibleValue;
  }


  /**
   * Toggle password visibility.
   */
  togglePasswordVisibility(): void {
    this.passwordVisibleValue =
      !this.passwordVisibleValue;
  }


  /**
   * Toggle confirm password visibility.
   */
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisibleValue =
      !this.confirmPasswordVisibleValue;
  }


  /**
   * Check whether registration is in progress.
   */
  isSubmitting(): boolean {
    return this.submitting;
  }


  /**
   * Get registration error message.
   */
  registerError(): string {
    return this.registrationError;
  }


  /**
   * Register exhibitor.
   */
  register(): void {

    // Clear previous error.
    this.registrationError = '';

    // Prevent duplicate submission.
    if (this.submitting) {
      return;
    }

    // Validate form.
    if (this.registerForm.invalid) {

      // Show all validation messages.
      this.registerForm.markAllAsTouched();

      return;
    }

    // Start submission.
    this.submitting = true;

    const formValue = this.registerForm.value;

    const registrationData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email.trim().toLowerCase(),
      phone: formValue.phone,
      exhibitorType: formValue.exhibitorType,

      // Organization is not currently present
      // in the form, so send an empty value.
      organization: '',

      password: formValue.password
    };

    this.authService
      .register(registrationData)
      .subscribe({

        /**
         * Registration successful.
         */
        next: () => {

          this.submitting = false;

          this.registrationError = '';

          this.router.navigate(['/registration-successful']);
        },


        /**
         * Registration failed.
         */
        error: (err: HttpErrorResponse) => {

          this.submitting = false;

          if (err.status === 409) {

            this.registrationError =
              'An account with this email already exists.';

          } else if (err.status === 400) {

            this.registrationError =
              err.error?.message ||
              'Please check your registration details and try again.';

          } else if (err.status === 0) {

            this.registrationError =
              'Unable to connect to the server. Please make sure the backend is running.';

          } else {

            this.registrationError =
              'Registration failed due to a server error. Please try again.';
          }
        }
      });
  }
}
