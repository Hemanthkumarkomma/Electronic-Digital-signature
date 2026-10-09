import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  const loginUrl = 'http://localhost:5022/api/auth/login';

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should not submit when required fields are missing', () => {
    component.submit();

    httpMock.expectNone(loginUrl);
    expect(component['isSubmitting']()).toBe(false);
  });

  it('should navigate and persist authentication only after a successful response', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component['loginForm'].setValue({
      email: 'jane@example.com',
      password: 'Password1',
    });

    component.submit();

    const request = httpMock.expectOne(loginUrl);
    expect(request.request.body).toEqual({
      email: 'jane@example.com',
      password: 'Password1',
    });
    expect(component['isSubmitting']()).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(localStorage.getItem('tas-jwt')).toBeNull();

    request.flush({
      token: 'jwt-token',
      expiresAtUtc: '2026-09-22T12:00:00Z',
      email: 'jane@example.com',
      fullName: 'Jane Doe',
      role: 'Exhibitor',
    });

    expect(component['isSubmitting']()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    expect(localStorage.getItem('tas-jwt')).toBe('jwt-token');
    expect(JSON.parse(localStorage.getItem('tas-user')!)).toEqual({
      email: 'jane@example.com',
      fullName: 'Jane Doe',
      role: 'Exhibitor',
    });
  });

  it('should show the exact invalid-credentials message and remain on the page', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component['loginForm'].setValue({
      email: 'jane@example.com',
      password: 'wrong-password',
    });

    component.submit();

    const request = httpMock.expectOne(loginUrl);
    request.flush(
      { message: 'Invalid email or password.' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(component['loginError']()).toBe('Invalid email or password. Please try again.');
    expect(component['isSubmitting']()).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(localStorage.getItem('tas-jwt')).toBeNull();
  });

});
