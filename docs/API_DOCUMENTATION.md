# API Documentation

## Base URLs

- Angular `environment.apiUrl`: `http://localhost:5022/api`
- Consent service URL: `http://localhost:5022/api/ConsentForms`
- ASP.NET Core launch profile: `http://localhost:5022`

Controller route matching is case-insensitive in ASP.NET Core; paths below use controller names from the implementation. Protected calls require `Authorization: Bearer <JWT>`. There is no global Angular HTTP interceptor; services add headers.

## Request lifecycle

```mermaid
sequenceDiagram
    participant UI as Angular component
    participant S as Angular service
    participant M as ASP.NET Core middleware
    participant C as API controller
    participant EF as EF Core / SQL Server
    UI->>S: Call API method
    S->>M: HTTP request; JSON and bearer token when protected
    M->>M: CORS, JWT authentication, authorization
    M->>C: Route to controller action
    C->>EF: Validate/use identity and persist or query
    EF-->>C: Result
    C-->>S: HTTP status and JSON or PDF
    S-->>UI: Observable response/error
```

## Endpoints

| Method and path | Controller/action | Authorization | Frontend caller |
|---|---|---|---|
| `POST /api/Auth/login` | `AuthController.Login` | Anonymous | `AuthService.login()` |
| `POST /api/Auth/register` | `AuthController.Register` | Anonymous | `AuthService.register()` |
| `GET /api/Exhibitors/profile` | `ExhibitorsController.GetProfile` | JWT | `ProfileService.getProfile()` |
| `PUT /api/Exhibitors/profile` | `ExhibitorsController.UpdateProfile` | JWT | `ProfileService.updateProfile()` |
| `GET /api/ConsentForms/junior-eligibility` | `ConsentFormsController.GetJuniorEligibility` | JWT | `ConsentService.getJuniorEligibility()` |
| `POST /api/ConsentForms` | `ConsentFormsController.CreateConsentForm` | JWT | `ConsentService.submitConsentForm()` |
| `GET /api/ConsentForms/my-submissions` | `ConsentFormsController.GetMySubmissions` | JWT | `ConsentService.getMySubmissions()` |
| `POST /api/ConsentForms/{id}/approve` | `ConsentFormsController.ApproveSubmission` | JWT; own record only | `ConsentService.approveSubmission()` |

## Authentication endpoints

### `POST /api/Auth/login`

Request: `{ "email": "string", "password": "string" }`.

Success response: `{ token, expiresAtUtc, email, fullName, role, exhibitorType }`. The API returns 400 when required credential strings are blank and 401 when credentials do not match. The backend normalizes email and verifies `PasswordHasher<Exhibitor>` hashes. The role response is `Exhibitor`; type is `Junior` or `Open`.

### `POST /api/Auth/register`

Request properties: `firstName`, `lastName`, `email`, `phone`, `exhibitorType`, optional `organization`, and `password`.

Success response: `{ message, exhibitorId }`. Service validation requires nonblank first/last name, normalized email, phone, and password; type must exactly match `Junior` or `Open`; duplicate email returns 409. Invalid request returns 400. The API hashes the password and writes an `Exhibitor` row. It does not issue a JWT.

## Exhibitor profile

### `GET /api/Exhibitors/profile`

No body. Uses custom numeric `userId` JWT claim to load the account. Returns profile fields: `fullName`, `email`, `phone`, `exhibitorType`, contact/address values, and Junior profile fields (null for Open). Returns 401 if account identity cannot be parsed and 404 if the record is missing.

### `PUT /api/Exhibitors/profile`

Request DTO: `fullName`, `email`, `phone`, `address`, `city`, `state`, `zip`, optional DOB/age/club and guardian fields. The service requires a full name with first and last parts and prevents another exhibitor from using the same email; updates profile fields and Junior-only attributes for Junior accounts. Returns the profile response, 409 for duplicate email, 400 for invalid update, and 401 if identity is unavailable.

## Consent endpoints

### `POST /api/ConsentForms`

Request is the JSON shape represented by `Models\ConsentForm.cs`: event, participant, animal, safety/medical, consent, signature, and optional Junior-specific fields. The server replaces `UserId` from the JWT and checks `ExhibitorType` against the authenticated `exhibitorType` claim. A mismatch returns 400; missing/unrecognized type is forbidden; missing identity returns 401.

For Junior accounts, the controller requires valid configured `JuniorEligibility:MinAge` and `MaxAge`; missing/invalid config returns 503 with code `JUNIOR_ELIGIBILITY_NOT_CONFIGURED`. It validates DOB/age, club information, guardian contact and consent, safety/consent/final flags, and nonempty signature fields; validation failures return 400 with `message` and `errors`. Open submissions have Junior-only fields cleared. Success persists the row and returns a message, id, and userId. Database failures return 500 with a generic message; Development may include diagnostic detail.

### `GET /api/ConsentForms/junior-eligibility`

No body. Returns `{ "minAge": number, "maxAge": number }` from the same backend configuration used during Junior submission validation. Invalid/missing values return 503 with code `JUNIOR_ELIGIBILITY_NOT_CONFIGURED`.

### `GET /api/ConsentForms/my-submissions`

No body. Queries submissions by the authenticated name-identifier claim and orders newest first. Returns an array of `ConsentForm` records. Missing identity returns 401; persistence errors return 500.

### `POST /api/ConsentForms/{id}/approve`

No request body. Looks up the requested submission using both id and current user's identifier, so other users' records return 404. It generates a PDF, then sets status to `Approved` and saves. Returns `application/pdf` with a filename including type and id. PDF or status-save failures return 500. Although the action is named “approve,” it is available to authenticated exhibitors and is not an admin-only review endpoint.

## Persistence fields

See [DATABASE_DOCUMENTATION.md](DATABASE_DOCUMENTATION.md) for all stored properties. Open signatures and Junior guardian signatures use `SignatureMethod` and `SignatureData`; Junior participant signatures use `ParticipantSignatureMethod` and `ParticipantSignatureData`. Draw/upload data is a data URL, while type mode stores the typed name in the corresponding data field.

## Error handling

`[ApiController]` provides framework request binding behavior. Login, registration, and profile methods return explicit 400/401/404/409 outcomes as described. Consent writes catch exceptions, log them, and return 500; detailed database exception text is included only in Development. API-level model validation is not a substitute for frontend form validation; the Junior controller adds explicit domain checks, while the Open submission has less server-side field validation.
