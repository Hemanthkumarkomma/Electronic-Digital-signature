import { environment } from '../../../environments/environment';

// Centralized API endpoint definitions for the Online (API communication) layer.
// Components must never hard-code these URLs; go through the relevant online service instead.
export const API_ENDPOINTS = {
  auth: {
    login: `${environment.apiUrl}/auth/login`,
    register: `${environment.apiUrl}/auth/register`,
  },
  exhibitors: {
    profile: `${environment.apiUrl}/Exhibitors/profile`,
  },
};
