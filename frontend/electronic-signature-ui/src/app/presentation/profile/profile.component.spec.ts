import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import {
  ExhibitorProfile,
  ProfileService,
} from '../../online/services/profile.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let updateProfile: ReturnType<typeof vi.fn>;

  const juniorProfile: ExhibitorProfile = {
    fullName: 'Junior Exhibitor',
    email: 'junior@example.com',
    phone: '1234567890',
    exhibitorType: 'Junior',
    address: '100 Main Street',
    city: 'Austin',
    state: 'Texas',
    zip: '78701',
    dateOfBirth: '2012-06-15T00:00:00',
    age: 14,
    clubAffiliation: '4-H',
    clubName: 'County 4-H Club',
    clubChapterNumber: '12',
    countyDistrict: 'Travis',
    parentGuardianName: 'Parent Guardian',
    parentGuardianRelationship: 'Parent',
    parentGuardianPhone: '9876543210',
    parentGuardianEmail: 'parent@example.com',
  };

  beforeEach(async () => {
    updateProfile = vi.fn((profile) => of({ ...juniorProfile, ...profile }));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProfileService,
          useValue: {
            getProfile: vi.fn(() => of(juniorProfile)),
            updateProfile,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the authenticated Junior exhibitor profile', () => {
    expect(fixture.nativeElement.textContent).toContain('Profile');
    expect(fixture.nativeElement.textContent).toContain('Junior Exhibitor Details');
    expect((Reflect.get(component, 'form') as FormGroup).value.clubName).toBe(
      'County 4-H Club',
    );
  });

  it('saves allowed profile fields through the profile API service', () => {
    Reflect.get(component, 'beginEdit').call(component);
    (Reflect.get(component, 'form') as FormGroup).patchValue({
      city: 'Dallas',
      parentGuardianPhone: '5555555555',
    });

    Reflect.get(component, 'save').call(component);
    fixture.detectChanges();

    expect(updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        city: 'Dallas',
        parentGuardianPhone: '5555555555',
      }),
    );
    expect(fixture.nativeElement.textContent).toContain('Profile updated successfully.');
  });
});
