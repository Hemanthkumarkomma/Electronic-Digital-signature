import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-success',
  standalone: true,
  imports: [],
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.css']
})
export class RegistrationSuccessComponent {

  private readonly router = inject(Router);

  /**
   * Navigate to the login page.
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
