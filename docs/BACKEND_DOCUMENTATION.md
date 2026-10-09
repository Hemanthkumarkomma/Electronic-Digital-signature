# ASP.NET Core Backend

## Project and dependencies

`backend\ElectronicSignature.API\ElectronicSignature.API.csproj` targets `net10.0` with nullable reference types and implicit usings. Direct dependencies include ASP.NET Core JWT bearer authentication, EF Core SQL Server/Design, Microsoft.Data.SqlClient, Open XML, Swagger, and `System.IdentityModel.Tokens.Jwt`.

## Composition root and middleware

`Program.cs` registers scoped `IAuthService`/`AuthService`, `IExhibitorService`/`ExhibitorService`, and `IExhibitorRepository`/`ExhibitorRepository`; `IConsentPdfService`/`ConsentPdfService` is singleton. It configures `ApplicationDbContext` with SQL Server, controllers, Swagger with a bearer security scheme, JWT validation, authorization, and CORS.

Pipeline: Development Swagger/UI, HTTPS redirection, CORS policy `AllowAngular`, authentication, authorization, controller mapping. JWT validation checks issuer, audience, key, and lifetime with two-minute clock skew. CORS allows localhost ports 4200 over HTTP/HTTPS with any headers/methods.

## Controllers and service layers

| File/class | Responsibility |
|---|---|
| `Online\Controllers\AuthController.cs` | Anonymous login/register endpoints; explicit missing-credentials and auth/registration responses. |
| `Online\Services\Implementations\AuthService.cs` | Email normalization, password-hash verification, JWT creation and login response. |
| `Online\Services\Implementations\ExhibitorService.cs` | Registration, account-type whitelist, password hashing, profile mapping/update. |
| `Data\Repositories\Implementations\ExhibitorRepository.cs` | EF queries/add/save for exhibitor rows. |
| `Online\Controllers\ExhibitorsController.cs` | Authorized profile GET/PUT; identifies account using custom numeric `userId` claim. |
| `Online\Controllers\ConsentFormsController.cs` | Authorized consent create, Junior validation, list-own-submissions and PDF/status action. Directly uses DbContext. |
| `Online\Services\Implementations\ConsentPdfService.cs` | Fills DOCX template and converts it to PDF using Word COM automation on Windows. |

`Models\AppUser.cs` is not the active authentication entity; login/register use `Models\Exhibitor.cs`. There is no dedicated consent repository/service layer.

## Passwords and JWT

The active API uses `Microsoft.AspNetCore.Identity.PasswordHasher<Exhibitor>` to create and verify password hashes. It does not store plaintext passwords. Login creates an HMAC-SHA256 JWT with subject/email, name, `Exhibitor` role, numeric `userId`, and `exhibitorType`. Configuration includes a development key/fallback in source; production must use protected key configuration.

## Consent persistence and validation

On consent POST, the controller uses the token identity/type, overwrites user id, and rejects type mismatch. For Junior it reads `JuniorEligibility:MinAge`/`MaxAge`, returns 503 if configuration is invalid, and validates DOB/age, club and guardian information, agreement booleans, and signature method/data. For Open it clears Junior-only values. It sets UTC submission time/status and writes `ConsentForms`.

The user's own submissions are queried by identity claim. The `approve` action also looks up only that user's row, builds a PDF, sets status to `Approved`, and returns it. This is not a privileged administrative approval flow.

Persistence exceptions are logged. Development responses may include SQL/inner exception details; production responses return generic messages. Avoid exposing detailed database errors in production.

## PDF generation

`ConsentPdfService` selects Junior/Open DOCX templates copied from `Assets` to the API output's `Templates` directory, copies a template into a unique temp folder, fills it with consent data and signature, and asks Microsoft Word to export a PDF. A semaphore serializes Word automation. The service explicitly requires Windows and Microsoft Word; it cleans up temporary working files after generation.

## Database and migrations

`Data\ApplicationDbContext.cs` exposes `DbSet<Exhibitor> Exhibitors` and `DbSet<ConsentForm> ConsentForms`. SQL Server LocalDB and the migration list are covered in [DATABASE_DOCUMENTATION.md](DATABASE_DOCUMENTATION.md). Startup does not automatically apply migrations.

