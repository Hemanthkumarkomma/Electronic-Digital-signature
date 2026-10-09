import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  Observable,
  throwError
} from 'rxjs';

import {
  timeout,
  catchError
} from 'rxjs/operators';


export interface ConsentForm {

  id?: number;

  userId?: string;

  exhibitorType?: string;

  eventName: string;

  eventLocation: string;

  eventDate: string;

  organization: string;

  participantFullName: string;

  dateOfBirth: string | null;

  age: number | null;

  participantPhone: string;

  participantEmail: string;

  participantAddress: string;

  participantCity: string;

  participantState: string;

  participantZip: string;

  clubAffiliation?: string | null;

  clubName?: string | null;

  clubChapterNumber?: string | null;

  countyDistrict?: string | null;

  parentGuardianName?: string | null;

  parentGuardianRelationship?: string | null;

  parentGuardianPhone?: string | null;

  parentGuardianEmail?: string | null;

  parentGuardianAddress?: string | null;

  parentGuardianCity?: string | null;

  parentGuardianState?: string | null;

  parentGuardianZip?: string | null;

  parentGuardianConsent?: boolean | null;

  juniorParticipationAgreement?: boolean | null;

  juniorRulesAgreement?: boolean | null;

  animalTypes: string;

  otherAnimalType: string;

  animalName: string;

  species: string;

  exhibitorRole: string;

  otherRole: string;

  safetyAgreed: boolean;

  allergies: string;

  specialAssistance: string;

  emergencyContactName: string;

  emergencyContactPhone: string;

  preferredHospital: string;

  consentAgreed: boolean;

  signatureMethod: string;

  signatureData: string;

  participantSignatureMethod?: string | null;

  participantSignatureData?: string | null;

  finalConsent: boolean;

  submittedAt?: string;

  status?: string;
}

export interface JuniorEligibilityRule {
  minAge: number;
  maxAge: number;
}


@Injectable({
  providedIn: 'root'
})
export class ConsentService {

  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    'http://localhost:5022/api/ConsentForms';


  // ==========================================
  // TOKEN
  // ==========================================

  private getToken(): string {

    const rawToken =
      localStorage.getItem('tas-jwt');

    if (!rawToken) {

      console.error(
        'JWT token not found.'
      );

      return '';
    }

    return rawToken
      .trim()
      .replace(/^"|"$/g, '')
      .replace(/^Bearer\s+/i, '')
      .trim();
  }


  // ==========================================
  // HEADERS
  // ==========================================

  private getAuthHeaders(): HttpHeaders {

    const token =
      this.getToken();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }


  // ==========================================
  // POST
  // ==========================================

  submitConsentForm(
    form: ConsentForm
  ): Observable<any> {

    console.log(
      'POST:',
      this.apiUrl
    );

    return this.http.post(
      this.apiUrl,
      form,
      {
        headers:
          this.getAuthHeaders()
      }
    );
  }

  getJuniorEligibility(): Observable<JuniorEligibilityRule> {
    return this.http.get<JuniorEligibilityRule>(
      `${this.apiUrl}/junior-eligibility`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }


  // ==========================================
  // GET MY SUBMISSIONS
  // ==========================================

  getMySubmissions():
    Observable<ConsentForm[]> {

    const url =
      `${this.apiUrl}/my-submissions`;

    console.log(
      '================================'
    );

    console.log(
      'GET MY SUBMISSIONS'
    );

    console.log(
      'URL:',
      url
    );

    console.log(
      'JWT EXISTS:',
      !!this.getToken()
    );

    console.log(
      '================================'
    );


    return this.http.get<ConsentForm[]>(
      url,
      {
        headers:
          this.getAuthHeaders()
      }
    ).pipe(

      // Don't let the UI remain loading forever
      timeout(10000),

      catchError((error) => {

        console.error(
          'GET SUBMISSIONS FAILED:',
          error
        );

        return throwError(
          () => error
        );
      })

    );
  }


  // ==========================================
  // APPROVE + DOWNLOAD PDF
  // ==========================================

  approveSubmission(
    id: number
  ): Observable<Blob> {

    return this.http.post(
      `${this.apiUrl}/${id}/approve`,
      null,
      {
        headers:
          this.getAuthHeaders(),
        responseType: 'blob'
      }
    );
  }
}