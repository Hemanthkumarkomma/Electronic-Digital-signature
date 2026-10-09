import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../online/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-shell">
      <div class="dashboard-card">
        <p class="eyebrow">Authenticated</p>
        <h1>Welcome, {{ currentUser?.fullName || 'Exhibitor' }}</h1>
        <p class="subtext">You have successfully signed in to the Texas Animal Showcase portal.</p>

        <div class="meta">
          <span><strong>Email:</strong> {{ currentUser?.email || 'Not available' }}</span>
          <span><strong>Role:</strong> {{ currentUser?.role || 'Exhibitor' }}</span>
        </div>

        <button type="button" class="logout-button" (click)="logout()">Log out</button>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #f3f2ef;
        font-family: 'Segoe UI', sans-serif;
      }

      .dashboard-shell {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
      }

      .dashboard-card {
        width: min(640px, 100%);
        background: #fff;
        border: 1px solid rgba(16, 38, 68, 0.08);
        border-radius: 24px;
        box-shadow: 0 18px 45px rgba(20, 41, 71, 0.12);
        padding: 48px 42px;
      }

      .eyebrow {
        margin: 0 0 12px;
        font-size: 0.82rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #0d5aa8;
        font-weight: 700;
      }

      h1 {
        margin: 0 0 12px;
        color: #1f2d3d;
        font-size: clamp(2rem, 3vw, 3rem);
      }

      .subtext {
        margin: 0;
        color: #536579;
        font-size: 1.08rem;
      }

      .meta {
        margin-top: 28px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        color: #273b4c;
        font-size: 1rem;
      }

      .logout-button {
        margin-top: 30px;
        border: none;
        border-radius: 12px;
        background: #0f6bbd;
        color: white;
        padding: 14px 22px;
        font-weight: 700;
        cursor: pointer;
      }
    `,
  ],
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  protected currentUser = this.authService.getCurrentUser();

  logout(): void {
    this.authService.logout();
  }
}
