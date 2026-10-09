import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RegistrationSuccessComponent } from './registration-success.component';

describe('RegistrationSuccessComponent', () => {
  let component: RegistrationSuccessComponent;
  let fixture: ComponentFixture<RegistrationSuccessComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationSuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationSuccessComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the success message and back to login button', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Registration Successful!');
    expect(text).toContain('Your exhibitor account has been created successfully.');
    expect(text).toContain('You can now log in using your registered email and password.');
    expect(text).toContain('Back to Login');
  });

  it('should navigate to /login when Back to Login is clicked', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.back-to-login');

    button.dispatchEvent(new Event('click'));

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
