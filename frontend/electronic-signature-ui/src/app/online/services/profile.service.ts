import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../api/api-endpoints';
import { AuthService } from './auth.service';

export interface ExhibitorProfile {
  fullName: string;
  email: string;
  phone: string;
  exhibitorType: 'Junior' | 'Open';
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  dateOfBirth: string | null;
  age: number | null;
  clubAffiliation: string | null;
  clubName: string | null;
  clubChapterNumber: string | null;
  countyDistrict: string | null;
  parentGuardianName: string | null;
  parentGuardianRelationship: string | null;
  parentGuardianPhone: string | null;
  parentGuardianEmail: string | null;
}

export type UpdateExhibitorProfile = Omit<ExhibitorProfile, 'exhibitorType'>;

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getProfile(): Observable<ExhibitorProfile> {
    return this.http.get<ExhibitorProfile>(
      API_ENDPOINTS.exhibitors.profile,
      { headers: this.getAuthHeaders() },
    );
  }

  updateProfile(profile: UpdateExhibitorProfile): Observable<ExhibitorProfile> {
    return this.http.put<ExhibitorProfile>(
      API_ENDPOINTS.exhibitors.profile,
      profile,
      { headers: this.getAuthHeaders() },
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() ?? '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}
