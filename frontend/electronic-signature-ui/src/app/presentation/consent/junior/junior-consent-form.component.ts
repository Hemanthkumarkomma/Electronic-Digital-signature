import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  ConsentForm,
  ConsentService,
  JuniorEligibilityRule
} from '../../../core/services/consent.service';
import { ConsentShellComponent } from '../shared/consent-shell/consent-shell.component';
import {
  DigitalSignatureComponent,
  SignatureResult
} from '../shared/digital-signature/digital-signature.component';
import { Subscription } from 'rxjs';

const STEPS = [
  'Event Details',
  'Junior Exhibitor',
  'Junior Eligibility',
  'Club Information',
  'Parent / Guardian',
  'Animal Information',
  'Safety / Emergency',
  'Junior / Parent Consent',
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
  'Follow all event safety instructions.',
  'Follow instructions from event officials, supervisors, and animal-handling personnel.',
  'Handle animals only in designated areas and in an appropriate manner.',
  'Use required safety equipment where applicable.',
  'Do not intentionally mistreat, frighten, injure, or improperly handle any animal.',
  'Immediately report an accident, injury, unsafe condition, or animal-related incident to event personnel.',
  'Follow all applicable event rules and requirements.',
];

function notFutureDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string | null;
  if (!value) {
    return null;
  }

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');

  return value > today
    ? { futureDate: true }
    : null;
}

@Component({
  selector: 'app-junior-consent-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConsentShellComponent, DigitalSignatureComponent],
  templateUrl: './junior-consent-form.component.html',
  styleUrls: [
    '../open/open-consent-form.component.css',
    '../shared/consent-sections.css'
  ],
})
export class JuniorConsentFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly consentService = inject(ConsentService);

  protected readonly steps = STEPS;
  protected readonly animalTypes = ANIMAL_TYPES;
  protected readonly safetyGuidelines = SAFETY_GUIDELINES;
  protected readonly currentStep = signal(1);
  protected readonly participantSignature = signal<SignatureResult | null>(null);
  protected readonly guardianSignature = signal<SignatureResult | null>(null);
  protected readonly juniorEligibilityRule = signal<JuniorEligibilityRule | null>(null);
  protected readonly eligibilityLoadError = signal('');
  protected readonly eventDateForEligibility = signal('');
  protected readonly minimumEligibleDateOfBirth = signal('');
  protected readonly maximumEligibleDateOfBirth = signal('');
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submissionError = signal('');
  private readonly subscriptions = new Subscription();

  protected readonly form: FormGroup = this.fb.group({
    event: this.fb.group({
      eventName: ['Texas Youth Animal Showcase'],
      eventLocation: ['', Validators.required],
      eventDate: ['', Validators.required],
      organization: [''],
    }),
    participant: this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.pattern(/^[0-9]{10}$/)],
      email: ['', Validators.email],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['Texas', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
    }),
    juniorEligibility: this.fb.group({
      dateOfBirth: ['', [Validators.required, notFutureDate]],
      age: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+$/)
      ]],
    }),
    club: this.fb.group({
      clubAffiliation: ['', Validators.required],
      clubName: ['', Validators.required],
      clubChapterNumber: [''],
      countyDistrict: [''],
    }),
    parentGuardian: this.fb.group({
      fullName: ['', Validators.required],
      relationship: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      city: [''],
      state: [''],
      zip: ['', Validators.pattern(/^[0-9]{5}$/)],
    }),
    animal: this.fb.group({
      animalTypes: this.fb.array(ANIMAL_TYPES.map(() => false)),
      otherAnimalType: [''],
      animalName: ['', Validators.required],
      species: ['', Validators.required],
      exhibitorRole: ['Exhibitor', Validators.required],
      otherRole: [''],
    }),
    safety: this.fb.group({
      guidelines: this.fb.array(SAFETY_GUIDELINES.map(() => false)),
      agree: [false, Validators.requiredTrue],
    }),
    medical: this.fb.group({
      allergies: [''],
      specialAssistance: [''],
      emergencyContactName: ['', Validators.required],
      emergencyContactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      preferredHospital: [''],
    }),
    consent: this.fb.group({
      agree: [false, Validators.requiredTrue],
      parentGuardianConsent: [false, Validators.requiredTrue],
      juniorParticipationAgreement: [false, Validators.requiredTrue],
      juniorRulesAgreement: [false, Validators.requiredTrue],
    }),
    review: this.fb.group({
      participantAcknowledgment: [false, Validators.requiredTrue],
      finalConsent: [false, Validators.requiredTrue],
    }),
  });

  private readonly stepGroupKeys: (string[] | null)[] = [
    ['event'],
    ['participant'],
    ['juniorEligibility'],
    ['club'],
    ['parentGuardian'],
    ['animal'],
    ['safety', 'medical'],
    ['consent'],
    null,
    ['review'],
  ];

  constructor() {
    this.form.get('juniorEligibility')?.addValidators(() =>
      this.juniorEligibilityValidationErrors()
    );
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.form.get('event.eventDate')!.valueChanges.subscribe(() => {
        this.recalculateJuniorEligibility();
      })
    );
    this.subscriptions.add(
      this.form.get('juniorEligibility.dateOfBirth')!.valueChanges.subscribe(() => {
        this.recalculateJuniorEligibility();
      })
    );
    this.subscriptions.add(
      this.consentService.getJuniorEligibility().subscribe({
        next: (rule) => {
          this.juniorEligibilityRule.set(rule);
          this.eligibilityLoadError.set('');
          this.recalculateJuniorEligibility();
        },
        error: (error: { status?: number }) => {
          console.error('Junior eligibility configuration could not be loaded:', error);
          this.eligibilityLoadError.set(
            error.status === 503
              ? 'Junior eligibility could not be verified. Please contact the administrator.'
              : 'Unable to load Junior eligibility rules. Please try again.'
          );
          this.form.get('juniorEligibility')?.updateValueAndValidity();
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goBack(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  goNext(): void {
    if (this.submitting() || this.submitted()) {
      return;
    }

    const groupKeys = this.stepGroupKeys[this.currentStep() - 1];
    if (groupKeys) {
      for (const key of groupKeys) {
        const group = this.form.get(key);
        group?.markAllAsTouched();
        if (group?.invalid) {
          return;
        }
      }
    } else if (
      this.currentStep() === 9 &&
      (!this.participantSignature() || !this.guardianSignature())
    ) {
      return;
    }

    if (this.currentStep() === this.steps.length) {
      this.submit();
      return;
    }

    this.currentStep.update((step) => step + 1);
  }

  onSignatureSaved(result: SignatureResult): void {
    this.onGuardianSignatureSaved(result);
  }

  onParticipantSignatureSaved(result: SignatureResult): void {
    this.participantSignature.set(result);
  }

  onParticipantSignatureCleared(): void {
    this.participantSignature.set(null);
  }

  onGuardianSignatureSaved(result: SignatureResult): void {
    this.guardianSignature.set(result);
  }

  onSignatureCleared(): void {
    this.onGuardianSignatureCleared();
  }

  onGuardianSignatureCleared(): void {
    this.guardianSignature.set(null);
  }

  private submit(): void {
    this.form.markAllAsTouched();
    this.recalculateJuniorEligibility();
    const participantSignature = this.participantSignature();
    const guardianSignature = this.guardianSignature();

    if (
      this.form.invalid ||
      !participantSignature ||
      !guardianSignature ||
      this.submitting()
    ) {
      return;
    }

    const value = this.form.getRawValue();
    const consentForm: ConsentForm = {
      userId: '',
      exhibitorType: 'Junior',
      eventName: value.event.eventName,
      eventLocation: value.event.eventLocation,
      eventDate: value.event.eventDate,
      organization: value.event.organization,
      participantFullName: value.participant.fullName,
      dateOfBirth: value.juniorEligibility.dateOfBirth,
      age: Number(value.juniorEligibility.age),
      participantPhone: value.participant.phone,
      participantEmail: value.participant.email,
      participantAddress: value.participant.address,
      participantCity: value.participant.city,
      participantState: value.participant.state,
      participantZip: value.participant.zip,
      clubAffiliation: value.club.clubAffiliation,
      clubName: value.club.clubName,
      clubChapterNumber: value.club.clubChapterNumber || null,
      countyDistrict: value.club.countyDistrict || null,
      parentGuardianName: value.parentGuardian.fullName,
      parentGuardianRelationship: value.parentGuardian.relationship,
      parentGuardianPhone: value.parentGuardian.phone,
      parentGuardianEmail: value.parentGuardian.email,
      parentGuardianAddress: value.parentGuardian.address || null,
      parentGuardianCity: value.parentGuardian.city || null,
      parentGuardianState: value.parentGuardian.state || null,
      parentGuardianZip: value.parentGuardian.zip || null,
      animalTypes: this.getSelectedAnimalTypes(value.animal.animalTypes),
      otherAnimalType: value.animal.otherAnimalType,
      animalName: value.animal.animalName,
      species: value.animal.species,
      exhibitorRole: value.animal.exhibitorRole,
      otherRole: value.animal.otherRole,
      safetyAgreed: value.safety.agree,
      allergies: value.medical.allergies,
      specialAssistance: value.medical.specialAssistance,
      emergencyContactName: value.medical.emergencyContactName,
      emergencyContactPhone: value.medical.emergencyContactPhone,
      preferredHospital: value.medical.preferredHospital,
      consentAgreed: value.consent.agree,
      parentGuardianConsent: value.consent.parentGuardianConsent,
      juniorParticipationAgreement: value.consent.juniorParticipationAgreement,
      juniorRulesAgreement: value.consent.juniorRulesAgreement,
      signatureMethod: guardianSignature.method,
      signatureData: guardianSignature.dataUrl || guardianSignature.fullName || '',
      participantSignatureMethod: participantSignature.method,
      participantSignatureData:
        participantSignature.dataUrl || participantSignature.fullName || '',
      finalConsent: value.review.finalConsent,
    };

    this.submissionError.set('');
    this.submitting.set(true);
    this.consentService.submitConsentForm(consentForm).subscribe({
      next: () => {
        this.submitted.set(true);
        this.router.navigate(['/my-submissions']);
      },
      error: (error: { status?: number; error?: { code?: string; message?: string } }) => {
        console.error('Junior consent submission failed:', error);
        let message = 'Unable to save your consent form. Please try again.';
        if (error.error?.code === 'JUNIOR_ELIGIBILITY_NOT_CONFIGURED') {
          message = 'Junior eligibility could not be verified. Please contact the administrator.';
        } else if (error.status === 400 && error.error?.message) {
          message = error.error.message;
        } else if (error.status === 401) {
          message = 'Authentication failed. Please login again.';
        }
        this.submissionError.set(message);
        this.submitting.set(false);
      },
    });
  }

  protected getSelectedAnimalTypes(selected: boolean[]): string {
    return this.animalTypes
      .filter((_, index) => selected[index])
      .join(', ');
  }

  protected isImageSignature(signature: SignatureResult | null): boolean {
    return !!signature?.dataUrl &&
      (signature.method === 'draw' || signature.method === 'upload');
  }

  showEligibilityError(errorType: string): boolean {
    const group = this.form.get('juniorEligibility');
    return !!group?.hasError(errorType) && (group.touched || group.dirty);
  }

  private recalculateJuniorEligibility(): void {
    const eventDate = this.form.get('event.eventDate')?.value as string | null;
    const dateOfBirth = this.form.get('juniorEligibility.dateOfBirth')?.value as string | null;
    const rule = this.juniorEligibilityRule();
    const ageControl = this.form.get('juniorEligibility.age');

    this.eventDateForEligibility.set(eventDate || '');

    if (eventDate && rule && parseDateOnly(eventDate)) {
      this.minimumEligibleDateOfBirth.set(
        shiftDateByYears(eventDate, -(rule.maxAge + 1), true)
      );
      this.maximumEligibleDateOfBirth.set(
        shiftDateByYears(eventDate, -rule.minAge, false)
      );
    } else {
      this.minimumEligibleDateOfBirth.set('');
      this.maximumEligibleDateOfBirth.set('');
    }

    const calculatedAge =
      eventDate && dateOfBirth && parseDateOnly(eventDate) && parseDateOnly(dateOfBirth)
        ? calculateAge(dateOfBirth, eventDate)
        : null;

    ageControl?.setValue(calculatedAge, { emitEvent: false });
    this.form.get('juniorEligibility')?.updateValueAndValidity({ emitEvent: false });
  }

  private juniorEligibilityValidationErrors(): ValidationErrors | null {
    const dateOfBirth = this.form.get('juniorEligibility.dateOfBirth')?.value as string | null;
    if (!dateOfBirth) {
      return null;
    }

    const eventDate = this.form.get('event.eventDate')?.value as string | null;
    if (!eventDate) {
      return { eventDateRequiredForEligibility: true };
    }

    const rule = this.juniorEligibilityRule();
    if (!rule) {
      return { eligibilityRuleUnavailable: true };
    }

    const age = calculateAge(dateOfBirth, eventDate);
    if (age === null) {
      return { invalidEligibilityDates: true };
    }

    const submittedAge = this.form.get('juniorEligibility.age')?.value;
    if (submittedAge !== age) {
      return { calculatedAgeMismatch: true };
    }

    if (age < rule.minAge || age > rule.maxAge) {
      return { ageNotEligible: { age, minAge: rule.minAge, maxAge: rule.maxAge } };
    }

    return null;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  showError(groupPath: string, controlName: string, errorType: string): boolean {
    const control = this.form.get(`${groupPath}.${controlName}`);
    return !!control &&
      control.hasError(errorType) &&
      (control.touched || control.dirty);
  }

  isLastStep(): boolean {
    return this.currentStep() === this.steps.length;
  }
}

function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null;
}

function calculateAge(dateOfBirth: string, referenceDate: string): number | null {
  const birth = parseDateOnly(dateOfBirth);
  const reference = parseDateOnly(referenceDate);
  if (!birth || !reference || birth > reference) {
    return null;
  }

  let birthdayMonth = birth.getUTCMonth();
  let birthdayDay = birth.getUTCDate();
  if (
    birthdayMonth === 1 &&
    birthdayDay === 29 &&
    !isLeapYear(reference.getUTCFullYear())
  ) {
    birthdayDay = 28;
  }

  let age = reference.getUTCFullYear() - birth.getUTCFullYear();
  if (
    reference.getUTCMonth() < birthdayMonth ||
    (reference.getUTCMonth() === birthdayMonth &&
      reference.getUTCDate() < birthdayDay)
  ) {
    age -= 1;
  }

  return age;
}

function shiftDateByYears(value: string, yearOffset: number, addOneDay: boolean): string {
  const date = parseDateOnly(value);
  if (!date) {
    return '';
  }

  const sourceYear = date.getUTCFullYear();
  const targetYear = sourceYear + yearOffset;
  const month = date.getUTCMonth();
  let day = date.getUTCDate();

  if (
    month === 1 &&
    day === 28 &&
    !isLeapYear(sourceYear) &&
    isLeapYear(targetYear)
  ) {
    day = 29;
  } else {
    day = Math.min(day, daysInMonth(targetYear, month));
  }

  const shifted = new Date(Date.UTC(targetYear, month, day));
  if (addOneDay) {
    shifted.setUTCDate(shifted.getUTCDate() + 1);
  }

  return [
    shifted.getUTCFullYear(),
    String(shifted.getUTCMonth() + 1).padStart(2, '0'),
    String(shifted.getUTCDate()).padStart(2, '0')
  ].join('-');
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
