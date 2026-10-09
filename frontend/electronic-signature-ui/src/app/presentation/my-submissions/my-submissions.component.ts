import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../online/services/auth.service';
import {
  ConsentService,
  ConsentForm
} from '../../core/services/consent.service';

@Component({
  selector: 'app-my-submissions',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.css']
})
export class MySubmissionsComponent implements OnInit {

  private readonly consentService = inject(ConsentService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);

  readonly newSubmissionLink =
    this.authService.getExhibitorType() === 'Junior'
      ? '/consent/junior'
      : '/consent/open';

  submissions: ConsentForm[] = [];

  loading = true;

  errorMessage = '';

  approvingId: number | null = null;

  actionError: { id: number; message: string } | null = null;

  ngOnInit(): void {
    console.log('===== MY SUBMISSIONS COMPONENT CREATED =====');

    this.loadSubmissions();
  }

  loadSubmissions(): void {

    console.log('===== START GET SUBMISSIONS =====');

    this.loading = true;
    this.errorMessage = '';

    this.consentService.getMySubmissions().subscribe({

      next: (response: ConsentForm[]) => {

        console.log('===== GET SUCCESS =====');
        console.log('API RESPONSE:', response);

        if (Array.isArray(response)) {
          this.submissions = response;
        } else {
          console.error(
            'API response is not an array:',
            response
          );

          this.submissions = [];
        }

        console.log(
          'SUBMISSIONS COUNT:',
          this.submissions.length
        );

        this.loading = false;

        console.log(
          'LOADING AFTER SUCCESS:',
          this.loading
        );

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('===== GET ERROR =====');
        console.error(error);

        this.loading = false;

        if (error.status === 401) {
          this.errorMessage =
            'Authentication failed. Please login again.';
        } else if (error.status === 0) {
          this.errorMessage =
            'Cannot connect to the backend server.';
        } else {
          this.errorMessage =
            'Unable to load your submissions. Please try again.';
        }

        this.cdr.detectChanges();
      },

      complete: () => {

        console.log(
          '===== GET REQUEST COMPLETED ====='
        );

        // Safety fallback
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  isApproved(submission: ConsentForm): boolean {
    return submission.status?.toLowerCase() === 'approved';
  }

  approve(submission: ConsentForm): void {

    if (submission.id == null || this.approvingId !== null) {
      return;
    }

    const id = submission.id;

    this.approvingId = id;
    this.actionError = null;

    this.consentService.approveSubmission(id).subscribe({

      next: (pdf: Blob) => {

        const exhibitorType =
          submission.exhibitorType === 'Junior' ? 'Junior' : 'Open';

        const url = URL.createObjectURL(pdf);
        const link = document.createElement('a');

        link.href = url;
        link.download =
          `Texas_Youth_Animal_Showcase_${exhibitorType}_${id}.pdf`;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);

        submission.status = 'Approved';
        this.approvingId = null;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('APPROVE / PDF FAILED:', error);

        this.approvingId = null;
        this.actionError = {
          id,
          message:
            'Unable to generate the consent form PDF. Please try again.'
        };

        this.cdr.detectChanges();
      }
    });
  }
}