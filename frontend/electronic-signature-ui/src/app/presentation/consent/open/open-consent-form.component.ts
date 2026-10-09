import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { ConsentShellComponent } from '../shared/consent-shell/consent-shell.component';

import {
  DigitalSignatureComponent,
  SignatureResult
} from '../shared/digital-signature/digital-signature.component';

import {
  ConsentService,
  ConsentForm
} from '../../../core/services/consent.service';

const STEPS = [
  'Event Details',
  'Exhibitor Info',
  'Animal Info',
  'Safety & Medical',
  'Consent',
  'Signature',
  'Review',
];

const ANIMAL_TYPES = [
  'Cattle',
  'Sheep',
  'Goat',
  'Swine',
  'Poultry',
  'Rabbit',
  'Horse',
  'Other'
];

const SAFETY_GUIDELINES = [
  'I will follow all event safety instructions.',
  'I will follow instructions from event officials, supervisors, and animal-handling personnel.',
  'I will handle animals only in designated areas and in an appropriate manner.',
  'I will use required safety equipment where applicable.',
  'I will not intentionally mistreat, frighten, injure, or improperly handle any animal.',
  'I will immediately report an accident, injury, unsafe condition, or animal-related incident to event personnel.',
  'I will follow all applicable event rules and requirements.',
];

@Component({
  selector: 'app-open-consent-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConsentShellComponent,
    DigitalSignatureComponent
  ],
  templateUrl: './open-consent-form.component.html',
  styleUrls: [
    './open-consent-form.component.css',
    '../shared/consent-sections.css'
  ],
})
export class OpenConsentFormComponent {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly consentService = inject(ConsentService);

  protected readonly steps = STEPS;
  protected readonly animalTypes = ANIMAL_TYPES;
  protected readonly safetyGuidelines = SAFETY_GUIDELINES;

  protected readonly currentStep = signal(1);

  protected readonly signature =
    signal<SignatureResult | null>(null);

  protected readonly submitted =
    signal(false);

  protected readonly form: FormGroup = this.fb.group({

    // =========================
    // EVENT
    // =========================
    event: this.fb.group({
      eventName: ['Texas Youth Animal Showcase'],
      eventLocation: ['', Validators.required],
      eventDate: ['', Validators.required],
      organization: [''],
    }),

    // =========================
    // EXHIBITOR
    // =========================
    exhibitor: this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: [''],
      age: [''],

      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['Texas', Validators.required],

      zip: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{5}$/)
      ]],
    }),

    // =========================
    // ANIMAL
    // =========================
    animal: this.fb.group({

      animalTypes: this.fb.array(
        ANIMAL_TYPES.map(() => false)
      ),

      otherAnimalType: [''],

      animalName: [
        '',
        Validators.required
      ],

      species: [
        '',
        Validators.required
      ],

      exhibitorRole: [
        'Exhibitor',
        Validators.required
      ],

      otherRole: [''],
    }),

    // =========================
    // SAFETY
    // =========================
    safety: this.fb.group({

      guidelines: this.fb.array(
        SAFETY_GUIDELINES.map(() => false)
      ),

      agree: [
        false,
        Validators.requiredTrue
      ],
    }),

    // =========================
    // MEDICAL
    // =========================
    medical: this.fb.group({

      allergies: [''],

      specialAssistance: [''],

      emergencyContactName: [
        '',
        Validators.required
      ],

      emergencyContactPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      preferredHospital: [''],
    }),

    // =========================
    // CONSENT
    // =========================
    consent: this.fb.group({

      agree: [
        false,
        Validators.requiredTrue
      ],
    }),

    // =========================
    // REVIEW
    // =========================
    review: this.fb.group({

      finalConsent: [
        false,
        Validators.requiredTrue
      ],
    }),
  });

  private stepGroupKeys: (string[] | null)[] = [
    ['event'],
    ['exhibitor'],
    ['animal'],
    ['safety', 'medical'],
    ['consent'],
    null,
    ['review'],
  ];

  // =========================================================
  // BACK
  // =========================================================

  goBack(): void {

    if (this.currentStep() > 1) {

      this.currentStep.update(
        step => step - 1
      );

    }
  }

  // =========================================================
  // NEXT
  // =========================================================

  goNext(): void {

    const groupKeys =
      this.stepGroupKeys[
        this.currentStep() - 1
      ];

    if (groupKeys) {

      for (const key of groupKeys) {

        const group =
          this.form.get(key);

        group?.markAllAsTouched();

        if (group?.invalid) {
          return;
        }
      }

    } else if (
      this.currentStep() === 6 &&
      !this.signature()
    ) {

      return;
    }

    // Last step
    if (
      this.currentStep() ===
      this.steps.length
    ) {

      this.submit();

      return;
    }

    this.currentStep.update(
      step => step + 1
    );
  }

  // =========================================================
  // SIGNATURE
  // =========================================================

  onSignatureSaved(
    result: SignatureResult
  ): void {

    console.log(
      'Signature saved:',
      result
    );

    this.signature.set(result);
  }

  onSignatureCleared(): void {

    this.signature.set(null);
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  private submit(): void {

    console.log(
      '===== STARTING CONSENT SUBMISSION ====='
    );

    this.form.markAllAsTouched();

    if (
      this.form.invalid ||
      !this.signature()
    ) {

      console.error(
        'Form is invalid or signature is missing.'
      );

      return;
    }

    // =======================================================
    // CHECK JWT
    // =======================================================

    const token =
      localStorage.getItem('tas-jwt');

    console.log(
      'JWT exists:',
      !!token
    );

    if (!token) {

      console.error(
        'JWT token not found in localStorage.'
      );

      alert(
        'Your login session has expired. Please login again.'
      );

      this.router.navigate(['/login']);

      return;
    }

    // =======================================================
    // GET FORM VALUES
    // =======================================================

    const formValue =
      this.form.getRawValue();

    // =======================================================
    // CREATE BACKEND OBJECT
    // =======================================================

    const consentForm: ConsentForm = {

      // Backend will set this from JWT
      userId: '',

      exhibitorType: 'Open',

      // -------------------------
      // Event
      // -------------------------

      eventName:
        formValue.event.eventName,

      eventLocation:
        formValue.event.eventLocation,

      eventDate:
        formValue.event.eventDate,

      organization:
        formValue.event.organization,

      // -------------------------
      // Exhibitor
      // -------------------------

      participantFullName:
        formValue.exhibitor.fullName,

      dateOfBirth:
        formValue.exhibitor.dateOfBirth || null,

      age:
        formValue.exhibitor.age === '' || formValue.exhibitor.age === null
          ? null
          : Number(formValue.exhibitor.age),

      participantPhone:
        formValue.exhibitor.phone,

      participantEmail:
        formValue.exhibitor.email,

      participantAddress:
        formValue.exhibitor.address,

      participantCity:
        formValue.exhibitor.city,

      participantState:
        formValue.exhibitor.state,

      participantZip:
        formValue.exhibitor.zip,

      // -------------------------
      // Animal
      // -------------------------

      animalTypes:
        this.getSelectedAnimalTypes(
          formValue.animal.animalTypes
        ),

      otherAnimalType:
        formValue.animal.otherAnimalType,

      animalName:
        formValue.animal.animalName,

      species:
        formValue.animal.species,

      exhibitorRole:
        formValue.animal.exhibitorRole,

      otherRole:
        formValue.animal.otherRole,

      // -------------------------
      // Safety / Medical
      // -------------------------

      safetyAgreed:
        formValue.safety.agree,

      allergies:
        formValue.medical.allergies,

      specialAssistance:
        formValue.medical.specialAssistance,

      emergencyContactName:
        formValue.medical.emergencyContactName,

      emergencyContactPhone:
        formValue.medical.emergencyContactPhone,

      preferredHospital:
        formValue.medical.preferredHospital,

      // -------------------------
      // Consent
      // -------------------------

      consentAgreed:
        formValue.consent.agree,

      // -------------------------
      // Signature
      // -------------------------

      signatureMethod:
        this.getSignatureMethod(),

      signatureData:
        this.getSignatureData(),

      // -------------------------
      // Final Review
      // -------------------------

      finalConsent:
        formValue.review.finalConsent
    };

    console.log(
      '===== API URL ====='
    );

    console.log(
      'https://localhost:5022/api/ConsentForms'
    );

    // =======================================================
    // CALL API
    // =======================================================

    this.consentService
      .submitConsentForm(consentForm)
      .subscribe({

        // ===================================================
        // SUCCESS
        // ===================================================

        next: (response) => {

          console.log(
            '===== CONSENT SUBMISSION SUCCESS ====='
          );

          console.log(
            'Server response:',
            response
          );

          this.submitted.set(true);

          // Navigate to My Submissions
          this.router.navigate([
            '/my-submissions'
          ]);

        },

        // ===================================================
        // ERROR
        // ===================================================

        error: (error) => {

          console.error(
            '===================================='
          );

          console.error(
            'CONSENT SUBMISSION FAILED'
          );

          console.error(
            '===================================='
          );

          console.error(
            'HTTP Status:',
            error.status
          );

          console.error(
            'Status Text:',
            error.statusText
          );

          console.error(
            'Request URL:',
            error.url
          );

          console.error(
            'Response:',
            error.error
          );

          console.error(
            'Full Error:',
            error
          );

          // -----------------------------------------------
          // 401
          // -----------------------------------------------

          if (error.status === 401) {

            alert(
              'Authentication failed. Please login again.'
            );

            return;
          }

          // -----------------------------------------------
          // 400
          // -----------------------------------------------

          if (error.status === 400) {

            let message =
              'The consent form data is invalid.';

            if (error.error?.message) {

              message =
                error.error.message;
            }

            alert(message);

            return;
          }

          // -----------------------------------------------
          // 500
          // -----------------------------------------------

          // Technical details stay in the console (logged above).
          alert(
            'Unable to save your consent form. Please try again.'
          );
        }
      });
  }

  // =========================================================
  // ANIMAL TYPES
  // =========================================================

  protected getSelectedAnimalTypes(
    selected: boolean[]
  ): string {

    return this.animalTypes
      .filter(
        (_, index) =>
          selected[index]
      )
      .join(', ');
  }

  protected isImageSignature(signature: SignatureResult | null): boolean {
    return !!signature?.dataUrl &&
      (signature.method === 'draw' || signature.method === 'upload');
  }

  // =========================================================
  // SIGNATURE METHOD
  // =========================================================

  private getSignatureMethod(): string {

    return this.signature()?.method ?? '';
  }

  // =========================================================
  // SIGNATURE DATA
  // =========================================================

  private getSignatureData(): string {

    const signature =
      this.signature();

    if (!signature) {
      return '';
    }

    return signature.dataUrl || signature.fullName || '';
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  goToDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);
  }

  // =========================================================
  // VALIDATION ERROR
  // =========================================================

  showError(
    groupPath: string,
    controlName: string,
    errorType: string
  ): boolean {

    const control =
      this.form.get(
        `${groupPath}.${controlName}`
      );

    if (!control) {
      return false;
    }

    return (
      control.hasError(errorType) &&
      (
        control.touched ||
        control.dirty
      )
    );
  }

  // =========================================================
  // LAST STEP
  // =========================================================

  isLastStep(): boolean {

    return (
      this.currentStep() ===
      this.steps.length
    );
  }
}