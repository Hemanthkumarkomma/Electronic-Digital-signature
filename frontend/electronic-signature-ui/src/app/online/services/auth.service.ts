import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { RegisterExhibitorRequest, RegisterExhibitorResponse } from '../models/exhibitor.model';

export type { LoginRequest, AuthUser, LoginResponse } from '../models/auth.model';
export type { RegisterExhibitorRequest, RegisterExhibitorResponse } from '../models/exhibitor.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'tas-jwt';
  private readonly userKey = 'tas-user';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.auth.login, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(
          this.userKey,
          JSON.stringify({
            email: response.email,
            fullName: response.fullName,
            role: response.role,
            exhibitorType: response.exhibitorType,
          } satisfies AuthUser),
        );
      }),
    );
  }

  register(request: RegisterExhibitorRequest): Observable<RegisterExhibitorResponse> {
    return this.http.post<RegisterExhibitorResponse>(API_ENDPOINTS.auth.register, request);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): AuthUser | null {
    const storedUser = localStorage.getItem(this.userKey);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      return null;
    }
  }

  getExhibitorType(): 'Junior' | 'Open' | null {
    const type = this.getCurrentUser()?.exhibitorType;
    return type === 'Junior' || type === 'Open' ? type : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }
}
