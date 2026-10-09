import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  ExhibitorProfile,
  ProfileService,
  UpdateExhibitorProfile,
} from '../../online/services/profile.service';
import { ConsentShellComponent } from '../consent/shared/consent-shell/consent-shell.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConsentShellComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);

  protected readonly profile = signal<ExhibitorProfile | null>(null);
  protected readonly editing = signal(false);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
    dateOfBirth: [''],
    age: [null as number | null, [Validators.min(0), Validators.max(120)]],
    clubAffiliation: [''],
    clubName: [''],
    clubChapterNumber: [''],
    countyDistrict: [''],
    parentGuardianName: [''],
    parentGuardianRelationship: [''],
    parentGuardianPhone: ['', Validators.pattern(/^$|^[0-9]{10}$/)],
    parentGuardianEmail: ['', Validators.email],
  });

  constructor() {
    this.loadProfile();
  }

  protected isJunior(): boolean {
    return this.profile()?.exhibitorType === 'Junior';
  }

  protected beginEdit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
    this.editing.set(true);
  }

  protected cancelEdit(): void {
    const profile = this.profile();
    if (profile) {
      this.populateForm(profile);
    }
    this.errorMessage.set('');
    this.editing.set(false);
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) {
      return;
    }

    const value = this.form.getRawValue();
    const request: UpdateExhibitorProfile = {
      fullName: value.fullName,
      email: value.email,
      phone: value.phone,
      address: value.address,
      city: value.city,
      state: value.state,
      zip: value.zip,
      dateOfBirth: this.isJunior() && value.dateOfBirth ? value.dateOfBirth : null,
      age: this.isJunior() ? value.age : null,
      clubAffiliation: this.isJunior() ? value.clubAffiliation || null : null,
      clubName: this.isJunior() ? value.clubName || null : null,
      clubChapterNumber: this.isJunior() ? value.clubChapterNumber || null : null,
      countyDistrict: this.isJunior() ? value.countyDistrict || null : null,
      parentGuardianName: this.isJunior() ? value.parentGuardianName || null : null,
      parentGuardianRelationship: this.isJunior()
        ? value.parentGuardianRelationship || null
        : null,
      parentGuardianPhone: this.isJunior() ? value.parentGuardianPhone || null : null,
      parentGuardianEmail: this.isJunior() ? value.parentGuardianEmail || null : null,
    };

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.profileService.updateProfile(request).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.populateForm(profile);
        this.saving.set(false);
        this.editing.set(false);
        this.successMessage.set('Profile updated successfully.');
      },
      error: (error: { error?: { message?: string } }) => {
        this.saving.set(false);
        this.errorMessage.set(
          error.error?.message ?? 'Unable to update your profile. Please try again.',
        );
      },
    });
  }

  protected showError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }

  private loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.populateForm(profile);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Unable to load your profile. Please try again.');
      },
    });
  }

  private populateForm(profile: ExhibitorProfile): void {
    this.form.reset({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address ?? '',
      city: profile.city ?? '',
      state: profile.state ?? 'Texas',
      zip: profile.zip ?? '',
      dateOfBirth: profile.dateOfBirth?.slice(0, 10) ?? '',
      age: profile.age,
      clubAffiliation: profile.clubAffiliation ?? '',
      clubName: profile.clubName ?? '',
      clubChapterNumber: profile.clubChapterNumber ?? '',
      countyDistrict: profile.countyDistrict ?? '',
      parentGuardianName: profile.parentGuardianName ?? '',
      parentGuardianRelationship: profile.parentGuardianRelationship ?? '',
      parentGuardianPhone: profile.parentGuardianPhone ?? '',
      parentGuardianEmail: profile.parentGuardianEmail ?? '',
    });
  }
}
