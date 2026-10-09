import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { ConsentService } from '../../../core/services/consent.service';
import { OpenConsentFormComponent } from './open-consent-form.component';

afterEach(() => {
  localStorage.removeItem('tas-jwt');
});

describe('OpenConsentFormComponent', () => {
  let component: OpenConsentFormComponent;
  let fixture: ComponentFixture<OpenConsentFormComponent>;
  let submitConsentForm: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    submitConsentForm = vi.fn(() => of({ id: 1 }));

    await TestBed.configureTestingModule({
      imports: [OpenConsentFormComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        {
          provide: ConsentService,
          useValue: { submitConsentForm },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenConsentFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    localStorage.setItem('tas-jwt', 'test-token');
    fixture.detectChanges();
  });

  function form(): FormGroup {
    return Reflect.get(component, 'form') as FormGroup;
  }

  it('submits without Junior eligibility or guardian fields', () => {
    form().patchValue({
      event: {
        eventLocation: 'Showgrounds',
        eventDate: '2026-10-01',
      },
      exhibitor: {
        fullName: 'Open Exhibitor',
        dateOfBirth: '',
        age: '',
        phone: '1234567890',
        email: 'open@example.com',
        address: '100 Main Street',
        city: 'Austin',
        state: 'Texas',
        zip: '78701',
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
      },
      review: {
        finalConsent: true,
      },
    });
    form().get('animal.animalTypes')?.setValue(Array(8).fill(false));
    form().get('safety.guidelines')?.setValue(Array(7).fill(false));

    component.onSignatureSaved({
      method: 'type',
      dataUrl: '',
      fullName: 'Open Exhibitor',
    });

    for (let step = 0; step < 7; step += 1) {
      component.goNext();
    }

    expect(submitConsentForm).toHaveBeenCalledOnce();
    expect(submitConsentForm).toHaveBeenCalledWith(
      expect.objectContaining({
        exhibitorType: 'Open',
        dateOfBirth: null,
        age: null,
        signatureMethod: 'type',
        signatureData: 'Open Exhibitor',
      }),
    );
  });

  it('shows the complete template-ordered review and typed signature', () => {
    form().patchValue({
      event: {
        eventLocation: 'Showgrounds',
        eventDate: '2026-10-01',
        organization: 'Texas Youth Animal Showcase',
      },
      exhibitor: {
        fullName: 'Open Exhibitor',
        phone: '1234567890',
        email: 'open@example.com',
        address: '100 Main Street',
        city: 'Austin',
        state: 'Texas',
        zip: '78701',
      },
      animal: {
        animalName: 'Exhibit 1',
        species: 'Goat',
        exhibitorRole: 'Handler',
      },
      safety: { agree: true },
      medical: {
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '5555555555',
      },
      consent: { agree: true },
    });
    component.onSignatureSaved({
      method: 'type',
      dataUrl: '',
      fullName: 'Open Exhibitor',
    });
    Reflect.get(component, 'currentStep').set(7);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('1. Event Information');
    expect(text).toContain('3. Animal Participation Information');
    expect(text).toContain('5. Medical / Emergency Information');
    expect(text).toContain('7. Digital Signature');
    expect(text).toContain('Open Exhibitor');
  });
});
