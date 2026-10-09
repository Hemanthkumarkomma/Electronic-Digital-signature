import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

import { DashboardComponent } from './presentation/dashboard/dashboard.component';

import { LoginPageComponent } from './presentation/auth/login/login-page.component';

import { ExhibitorRegisterComponent } from './presentation/auth/register/exhibitor-register.component';

import { RegistrationSuccessComponent } from './presentation/auth/register-success/registration-success.component';

import { JuniorConsentFormComponent } from './presentation/consent/junior/junior-consent-form.component';

import { OpenConsentFormComponent } from './presentation/consent/open/open-consent-form.component';

import { MySubmissionsComponent } from './presentation/my-submissions/my-submissions.component';
import { ProfileComponent } from './presentation/profile/profile.component';


export const routes: Routes = [

  // Default
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Login
  {
    path: 'login',
    component: LoginPageComponent
  },

  // Registration
  {
    path: 'register',
    component: ExhibitorRegisterComponent
  },

  // Registration success
  {
    path: 'registration-successful',
    component: RegistrationSuccessComponent
  },

  // Dashboard
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // My Submissions
  {
    path: 'my-submissions',
    component: MySubmissionsComponent,
    canActivate: [authGuard]
  },

  // Profile
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },

  // Junior Exhibitor Consent
  {
    path: 'consent/junior',
    component: JuniorConsentFormComponent,
    canActivate: [authGuard]
  },

  // Open Exhibitor Consent
  {
    path: 'consent/open',
    component: OpenConsentFormComponent,
    canActivate: [authGuard]
  },

  // Unknown route
  {
    path: '**',
    redirectTo: 'login'
  }

];