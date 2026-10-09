import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { ExhibitorRegisterComponent } from './exhibitor-register.component';

describe('ExhibitorRegisterComponent', () => {
  let component: ExhibitorRegisterComponent;
  let fixture: ComponentFixture<ExhibitorRegisterComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  const registerUrl = 'http://localhost:5022/api/auth/register';

  const validForm = {
    firstName: 'JaneRegina',
    lastName: 'DoeExhibit',
    email: 'JANE.DOE@example.com',
    phone: '1234567890',
    exhibitorType: 'Junior',
    password: 'Password1',
    confirmPassword: 'Password1',
    terms: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitorRegisterComponent, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExhibitorRegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when the form is invalid', () => {
    component.register();
    httpMock.expectNone(registerUrl);
  });

  it('should show required validation messages below fields after invalid submit', () => {
    component.register();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('First name is required.');
    expect(text).toContain('Last name is required.');
    expect(text).toContain('Email address is required.');
    expect(text).toContain('Phone number is required.');
    expect(text).toContain('Please select an exhibitor type.');
    expect(text).toContain('Password is required.');
    expect(text).toContain('Please confirm your password.');
    expect(text).toContain('Please accept the Terms and Conditions and Privacy Policy.');
  });

  it('should show format and matching validation messages after submit', () => {
    component.registerForm.setValue({
      firstName: 'J',
      lastName: 'D',
      email: 'invalid-email',
      phone: '123',
      exhibitorType: '',
      password: 'Password1',
      confirmPassword: 'Password2',
      terms: false,
    });

    component.register();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('First name must be at least 10 characters.');
    expect(text).toContain('Last name must be at least 10 characters.');
    expect(text).toContain('Please enter a valid email address.');
    expect(text).toContain('Please enter a valid 10-digit phone number.');
    expect(text).toContain('Passwords do not match.');
    expect(text).toContain('Please accept the Terms and Conditions and Privacy Policy.');
    httpMock.expectNone(registerUrl);
  });

  it('should clear password mismatch when the passwords match', () => {
    component.registerForm.patchValue({
      password: 'Password1',
      confirmPassword: 'Password2',
    });
    component.registerForm.markAllAsTouched();

    expect(component.showPasswordMismatch()).toBe(true);

    component.registerForm.patchValue({
      confirmPassword: 'Password1',
    });

    expect(component.showPasswordMismatch()).toBe(false);
  });

  it('should reject unsupported exhibitor types', () => {
    component.registerForm.setValue({
      ...validForm,
      exhibitorType: 'organization',
    });

    component.register();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Please select Junior or Open.');
    httpMock.expectNone(registerUrl);
  });

  it('should navigate to the registration success page and show success state on 200', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.registerForm.setValue(validForm);

    component.register();

    const req = httpMock.expectOne(registerUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      firstName: 'JaneRegina',
      lastName: 'DoeExhibit',
      email: 'jane.doe@example.com',
      phone: '1234567890',
      exhibitorType: 'Junior',
      organization: '',
      password: 'Password1',
    });
    expect(req.request.body.confirmPassword).toBeUndefined();
    expect(req.request.body.terms).toBeUndefined();

    req.flush({ message: 'ok', exhibitorId: '1' });

    expect(component.isSubmitting()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/registration-successful']);
  });

  it('should show a duplicate email message on 409', () => {
    component.registerForm.setValue(validForm);

    component.register();

    const req = httpMock.expectOne(registerUrl);
    req.flush(
      { message: 'An account with this email already exists.' },
      { status: 409, statusText: 'Conflict' },
    );

    expect(component.registerError()).toBe('An account with this email already exists.');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should show a connection error message on status 0', () => {
    component.registerForm.setValue(validForm);

    component.register();

    const req = httpMock.expectOne(registerUrl);
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(component.registerError()).toBe(
      'Unable to connect to the server. Please make sure the backend is running.',
    );
    expect(component.isSubmitting()).toBe(false);
  });

  it('should show backend validation message on 400 when available', () => {
    component.registerForm.setValue(validForm);

    component.register();

    const req = httpMock.expectOne(registerUrl);
    req.flush(
      { message: 'Email address is invalid.' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(component.registerError()).toBe('Email address is invalid.');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should show server error message on 500', () => {
    component.registerForm.setValue(validForm);

    component.register();

    const req = httpMock.expectOne(registerUrl);
    req.flush(
      { message: 'Stack trace should not be shown.' },
      { status: 500, statusText: 'Server Error' },
    );

    expect(component.registerError()).toBe(
      'Registration failed due to a server error. Please try again.',
    );
    expect(component.isSubmitting()).toBe(false);
  });

  it('should not send a second request while a submission is in progress', () => {
    component.registerForm.setValue(validForm);

    component.register();
    component.register();

    httpMock.expectOne(registerUrl);
  });
});
