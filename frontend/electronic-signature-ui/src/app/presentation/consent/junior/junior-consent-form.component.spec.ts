import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ConsentForm, ConsentService } from '../../../core/services/consent.service';
import { JuniorConsentFormComponent } from './junior-consent-form.component';

describe('JuniorConsentFormComponent', () => {
  let component: JuniorConsentFormComponent;
  let fixture: ComponentFixture<JuniorConsentFormComponent>;
  let submitConsentForm: ReturnType<typeof vi.fn>;
  let getJuniorEligibility: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    submitConsentForm = vi.fn(() => of({ id: 1 }));
    getJuniorEligibility = vi.fn(() => of({ minAge: 18, maxAge: 21 }));

    await TestBed.configureTestingModule({
      imports: [JuniorConsentFormComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        {
          provide: ConsentService,
          useValue: { submitConsentForm, getJuniorEligibility },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JuniorConsentFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  function form(): FormGroup {
    return Reflect.get(component, 'form') as FormGroup;
  }

  function fillRequiredFields(): void {
    form().patchValue({
      event: {
        eventLocation: 'Showgrounds',
        eventDate: '2026-10-01',
      },
      participant: {
        fullName: 'Junior Exhibitor',
        phone: '1234567890',
        email: 'junior@example.com',
        address: '100 Main Street',
        city: 'Austin',
        state: 'Texas',
        zip: '78701',
      },
      juniorEligibility: {
        dateOfBirth: '2008-06-15',
        age: 18,
      },
      club: {
        clubAffiliation: '4-H',
        clubName: 'County 4-H Club',
      },
      parentGuardian: {
        fullName: 'Parent Guardian',
        relationship: 'Parent',
        phone: '9876543210',
        email: 'parent@example.com',
      },
      animal: {
        animalName: 'Exhibit 1',
        species: 'Goat',
      },
      safety: {
        agree: true,
      },
      medical: {
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '5555555555',
      },
      consent: {
        agree: true,
        parentGuardianConsent: true,
        juniorParticipationAgreement: true,
        juniorRulesAgreement: true,
      },
      review: {
        participantAcknowledgment: true,
        finalConsent: true,
      },
    });
    form().get('animal.animalTypes')?.setValue(Array(8).fill(false));
    form().get('safety.guidelines')?.setValue(Array(7).fill(false));
  }

  function saveSignatures(): void {
    component.onParticipantSignatureSaved({
      method: 'draw',
      dataUrl: 'data:image/png;base64,participant',
    });
    component.onGuardianSignatureSaved({
      method: 'type',
      dataUrl: '',
      fullName: 'Parent Guardian',
    });
  }

  it('identifies itself as the Junior Exhibitor Consent Form', () => {
    expect(fixture.nativeElement.textContent).toContain('Junior Exhibitor Consent Form');
    expect(fixture.nativeElement.textContent).toContain('Junior Eligibility');
  });

  it('requires club affiliation and name before proceeding', () => {
    fillRequiredFields();
    form().get('club.clubAffiliation')?.setValue('');
    form().get('club.clubName')?.setValue('');

    component.goNext();
    component.goNext();
    component.goNext();
    component.goNext();

    expect(Reflect.get(component, 'currentStep')()).toBe(4);
    expect(form().get('club.clubAffiliation')?.hasError('required')).toBe(true);
    expect(form().get('club.clubName')?.hasError('required')).toBe(true);
    expect(submitConsentForm).not.toHaveBeenCalled();
  });

  it('requires parent and guardian details before proceeding', () => {
    fillRequiredFields();
    form().get('parentGuardian.fullName')?.setValue('');

    component.goNext();
    component.goNext();
    component.goNext();
    component.goNext();
    component.goNext();

    expect(Reflect.get(component, 'currentStep')()).toBe(5);
    expect(form().get('parentGuardian.fullName')?.hasError('required')).toBe(true);
    expect(submitConsentForm).not.toHaveBeenCalled();
  });

  it('requires parental consent before proceeding to signature', () => {
    fillRequiredFields();
    form().get('consent.parentGuardianConsent')?.setValue(false);

    for (let step = 0; step < 8; step += 1) {
      component.goNext();
    }

    expect(Reflect.get(component, 'currentStep')()).toBe(8);
    expect(form().get('consent.parentGuardianConsent')?.hasError('required')).toBe(true);
    expect(submitConsentForm).not.toHaveBeenCalled();
  });

  it('submits the Junior payload with guardian consent and existing signature output', () => {
    fillRequiredFields();
    saveSignatures();

    for (let step = 0; step < 10; step += 1) {
      component.goNext();
    }

    expect(submitConsentForm).toHaveBeenCalledOnce();
    expect(submitConsentForm).toHaveBeenCalledWith(
      expect.objectContaining({
        exhibitorType: 'Junior',
        dateOfBirth: '2008-06-15',
        age: 18,
        clubAffiliation: '4-H',
        clubName: 'County 4-H Club',
        parentGuardianName: 'Parent Guardian',
        parentGuardianConsent: true,
        juniorParticipationAgreement: true,
        juniorRulesAgreement: true,
        signatureMethod: 'type',
        signatureData: 'Parent Guardian',
        participantSignatureMethod: 'draw',
        participantSignatureData: 'data:image/png;base64,participant',
      } satisfies Partial<ConsentForm>),
    );
  });

  it('shows a friendly message when Junior eligibility is not configured', () => {
    submitConsentForm.mockReturnValueOnce(
      throwError(() => ({
        status: 503,
        error: {
          code: 'JUNIOR_ELIGIBILITY_NOT_CONFIGURED',
          message: 'ignored',
        },
      })),
    );
    fillRequiredFields();
    saveSignatures();

    for (let step = 0; step < 10; step += 1) {
      component.goNext();
    }

    expect(Reflect.get(component, 'submissionError')()).toBe(
      'Junior eligibility could not be verified. Please contact the administrator.',
    );
    expect(Reflect.get(component, 'submitted')()).toBe(false);
  });

  it('shows all Junior template review sections and the saved guardian signature', () => {
    fillRequiredFields();
    saveSignatures();
    Reflect.get(component, 'currentStep').set(10);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('3. Junior Eligibility & Club Information');
    expect(text).toContain('4. Parent / Legal Guardian Information');
    expect(text).toContain('9. Parent / Guardian Consent');
    expect(text).toContain('11. Participant Acknowledgment');
    expect(text).toContain('12. Final Consent');
    expect(text).toContain('Parent Guardian');
    expect(text).toContain('Participant Digital Signature');
  });

  it('calculates age from DOB on the event date and updates on either date change', () => {
    form().patchValue({
      event: { eventDate: '2026-10-01' },
      juniorEligibility: { dateOfBirth: '2008-10-01' },
    });

    expect(form().get('juniorEligibility.age')?.value).toBe(18);

    form().get('juniorEligibility.dateOfBirth')?.setValue('2008-10-02');
    expect(form().get('juniorEligibility.age')?.value).toBe(17);

    form().get('event.eventDate')?.setValue('2026-10-02');
    expect(form().get('juniorEligibility.age')?.value).toBe(18);
  });

  it('restricts the DOB picker to the configured age range on the event date', () => {
    Reflect.get(component, 'currentStep').set(3);
    form().patchValue({
      event: { eventDate: '2026-10-01' },
      juniorEligibility: { dateOfBirth: '2008-10-01' },
    });
    fixture.detectChanges();

    const dobInput = fixture.nativeElement.querySelector(
      'input[formControlName="dateOfBirth"]',
    ) as HTMLInputElement;
    expect(dobInput.min).toBe('2004-10-02');
    expect(dobInput.max).toBe('2008-10-01');
    expect(form().get('juniorEligibility')?.valid).toBe(true);

    form().get('juniorEligibility.dateOfBirth')?.setValue('2008-10-02');
    expect(form().get('juniorEligibility.age')?.value).toBe(17);
    expect(form().get('juniorEligibility')?.hasError('ageNotEligible')).toBe(true);
  });

  it('treats February 28 as the leap-day birthday in non-leap years', () => {
    form().patchValue({
      event: { eventDate: '2026-02-28' },
      juniorEligibility: { dateOfBirth: '2008-02-29' },
    });

    expect(form().get('juniorEligibility.age')?.value).toBe(18);
    expect(form().get('juniorEligibility')?.valid).toBe(true);
    expect(Reflect.get(component, 'minimumEligibleDateOfBirth')()).toBe('2004-03-01');
    expect(Reflect.get(component, 'maximumEligibleDateOfBirth')()).toBe('2008-02-29');
  });

  it('requires an event date before applying age eligibility', () => {
    form().get('juniorEligibility.dateOfBirth')?.setValue('2008-10-01');

    expect(form().get('juniorEligibility.age')?.value).toBeNull();
    expect(form().get('juniorEligibility')?.hasError('eventDateRequiredForEligibility')).toBe(true);
    expect(Reflect.get(component, 'minimumEligibleDateOfBirth')()).toBe('');
  });

  it('keeps the age input read-only and blocks proceeding without both signatures', () => {
    fillRequiredFields();
    Reflect.get(component, 'currentStep').set(3);
    fixture.detectChanges();
    const ageInput = fixture.nativeElement.querySelector(
      'input[formControlName="age"]',
    ) as HTMLInputElement;
    expect(ageInput.readOnly).toBe(true);

    Reflect.get(component, 'currentStep').set(9);
    component.onGuardianSignatureSaved({
      method: 'type',
      dataUrl: '',
      fullName: 'Parent Guardian',
    });
    component.goNext();
    expect(Reflect.get(component, 'currentStep')()).toBe(9);
    expect(submitConsentForm).not.toHaveBeenCalled();

    component.onParticipantSignatureSaved({
      method: 'type',
      dataUrl: '',
      fullName: 'Junior Exhibitor',
    });
    component.goNext();
    expect(Reflect.get(component, 'currentStep')()).toBe(10);
  });

  it('clears participant and guardian signatures independently', () => {
    saveSignatures();
    component.onParticipantSignatureCleared();
    expect(Reflect.get(component, 'participantSignature')()).toBeNull();
    expect(Reflect.get(component, 'guardianSignature')()?.fullName).toBe('Parent Guardian');

    component.onParticipantSignatureSaved({
      method: 'type',
      dataUrl: '',
      fullName: 'Junior Exhibitor',
    });
    component.onGuardianSignatureCleared();
    expect(Reflect.get(component, 'guardianSignature')()).toBeNull();
    expect(Reflect.get(component, 'participantSignature')()?.fullName).toBe('Junior Exhibitor');
  });
});
