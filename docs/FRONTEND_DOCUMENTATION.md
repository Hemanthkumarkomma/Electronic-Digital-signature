# Angular Frontend

## Configuration and bootstrap

`frontend\electronic-signature-ui\package.json` declares Angular `^22.1.0`, Angular CLI/build `^22.1.8`, TypeScript `~6.0.2`, RxJS `~7.8.0`, and Vitest `^4.0.8`. Scripts: `npm start`, `npm run build`, `npm test`, and `npm run watch`.

`src\main.ts` bootstraps standalone `App`; `app.config.ts` provides `HttpClient`, Angular Router routes, and browser global error listeners. `App` renders a `RouterOutlet`. `angular.json` uses `src\main.ts`, `src\styles.css`, and the `public` asset directory. Global CSS sets base font/background/box sizing; components have colocated CSS.

## Routes

Routes are declared in `src\app\app.routes.ts`. The default and wildcard paths redirect to login. Account-type-specific consent routes are selected by the login page, not by route guards. The guard checks token presence only.

## Component reference

| Component / file | Purpose, dependencies, state and behavior |
|---|---|
| `presentation\auth\login\login-page.component.ts` | Reactive email/password form, calls `AuthService.login`, displays errors/loading/password visibility, routes by returned exhibitor type. No explicit inputs/outputs. |
| `presentation\auth\register\exhibitor-register.component.ts` | Reactive registration form, password match/type/name validation, calls `AuthService.register`, routes to registration success. Includes frontend-only terms field. |
| `presentation\auth\register-success\registration-success.component.ts` | Success-page action navigates to login. |
| `presentation\dashboard\dashboard.component.ts` | Displays user values from `AuthService.getCurrentUser()` and logout action. |
| `presentation\profile\profile.component.ts` | Loads and edits profile via `ProfileService`; reactive validation and signal-driven loading/edit/success/error state. |
| `presentation\my-submissions\my-submissions.component.ts` | Loads current user's records; uses `ConsentService`; requests PDF and updates visible status to Approved. |
| `presentation\consent\junior\junior-consent-form.component.ts` | Ten-step Junior form; validates step groups, receives signature events, builds payload, handles API states and navigation. |
| `presentation\consent\open\open-consent-form.component.ts` | Seven-step Open form; validates step groups, receives signature events, builds payload and submits. |
| `presentation\consent\shared\consent-shell\consent-shell.component.ts` | Shared layout; `@Input` title, badge, step and button state; outputs `back`/`next`; logout through `AuthService`. |
| `presentation\consent\shared\digital-signature\digital-signature.component.ts` | Reusable capture component; inputs `heading`/`description`, outputs `signatureSaved`/`signatureCleared`; canvas, typed-name and upload methods. |

Templates and styles are adjacent to components; dashboard uses an inline template/style. Consent steps use `*ngIf`, `formGroupName`, `formControlName`, `FormArray`, and shared CSS.

## Forms and state

Reactive form construction uses `FormBuilder`, `FormGroup`, `FormArray`, and `Validators` for required fields, patterns, email, age range basics, and `requiredTrue` agreements. Junior form adds a `notFutureDate` validator; the backend independently checks age bounds. The signature component is not an Angular form control; it communicates through `EventEmitter` outputs.

Signals are used for local UI state, including login errors/loading, current step, signature result, form submission state, and previews. RxJS `Observable`s returned by `HttpClient` are subscribed to by screens; the consent submissions component uses `timeout(10000)` for the list call and rethrows errors.

## Services and storage

- `online\services\auth.service.ts`: login/register, `tas-jwt`, `tas-user`, getters and logout.
- `online\services\profile.service.ts`: authenticated GET/PUT profile.
- `core\services\consent.service.ts`: consent create, list, and approve/download calls.
- `online\api\api-endpoints.ts`: auth/profile endpoint URLs from `environment.apiUrl`.

There is no global HTTP interceptor. Auth/profile/consent services construct bearer headers manually. `auth.guard.ts` reads the token directly from `localStorage`.

## Frontend validation and error display

Login and registration render field errors and request-level banners. Profile displays load/save messages. Junior consent exposes `submissionError`; Open consent uses browser alerts for selected submission failures and console logging for details. Upload type/size failures appear inline in the signature component. No single shared HTTP error handler exists.

## Assets, styling, and tests

The app uses global `src\styles.css` plus component stylesheets; the signature CSS includes tablet/mobile breakpoints. `angular.json` copies `public\` assets. A second, separate Angular project `frontend\cdk-drag-drop-practice` is not the main portal.

Component unit-test files exist for login, registration, registration success, Junior/Open consent, profile, and app bootstrap. Run them with `npm test` from the main Angular project; package dependencies identify Vitest as the runner.

