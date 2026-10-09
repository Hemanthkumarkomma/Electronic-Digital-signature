import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../online/services/auth.service';

/**
 * Shared page shell (header, sidebar, stepper, footer nav) reused by both
 * the Junior and Open exhibitor consent forms so only step content differs.
 */
@Component({
  selector: 'app-consent-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './consent-shell.component.html',
  styleUrl: './consent-shell.component.css',
})
export class ConsentShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Input() formTitle = '';
  @Input() contentSubtitle = 'Texas Youth Animal Showcase';
  @Input() badgeLabel = '';
  @Input() badgeVariant: 'junior' | 'open' = 'open';
  @Input() steps: string[] = [];
  @Input() currentStep = 1;
  @Input() showBack = true;
  @Input() nextLabel = 'Next';
  @Input() nextDisabled = false;
  @Input() isLastStep = false;
  @Input() showStepper = true;
  @Input() showFooterNavigation = true;

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  protected readonly currentUser = this.authService.getCurrentUser();

  logout(): void {
    this.authService.logout();
  }

  onBack(): void {
    this.back.emit();
  }

  onNext(): void {
    this.next.emit();
  }
}
