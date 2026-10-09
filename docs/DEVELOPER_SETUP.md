# Developer Setup

## Prerequisites

- Node.js with npm (the frontend manifest declares npm 10.9.2).
- .NET 10 SDK.
- SQL Server LocalDB (`MSSQLLocalDB`) for the checked-in development connection string.
- Windows with Microsoft Word installed if testing consent PDF generation.

## Start the backend

From the workspace root in PowerShell:

```powershell
cd .\backend\ElectronicSignature.API
dotnet restore
dotnet ef database update
dotnet run --launch-profile http
```

The launch profile sets `ASPNETCORE_ENVIRONMENT=Development` and listens on `http://localhost:5022`. Swagger is enabled in Development. The `DefaultConnection` config uses the LocalDB instance and the `ElectronicSignature` database. Migrations are not applied automatically. If the EF command is unavailable, install `dotnet-ef` compatible with EF Core 10, then retry.

Development's `appsettings.Development.json` defines the Junior eligibility age bounds. Configure appropriate values in the environment used to run the API; otherwise Junior submissions receive a configuration error. Do not use the development JWT key/fallback in production.

## Start the Angular application

In a second PowerShell terminal:

```powershell
cd .\frontend\electronic-signature-ui
npm install
npm start
```

Browse to `http://localhost:4200`. API base settings are in `src\environments\environment.ts`; the consent service separately defines its consent URL. Keep those endpoints aligned with the backend launch profile.

## Common commands

```powershell
# Frontend build
npm run build

# Frontend unit tests
npm test

# Backend build
cd ..\..\backend\ElectronicSignature.API
dotnet build

# Backend tests
# No backend test project was found in the inspected workspace.
```

Run frontend commands from `frontend\electronic-signature-ui` and .NET commands from `backend\ElectronicSignature.API`.

## Useful configuration files

| File | Setting/use |
|---|---|
| `frontend\electronic-signature-ui\package.json` | Angular/TypeScript versions and npm scripts |
| `frontend\electronic-signature-ui\angular.json` | Build, serve, test targets and global styles/assets |
| `frontend\electronic-signature-ui\src\environments\environment.ts` | Angular API base URL |
| `backend\ElectronicSignature.API\ElectronicSignature.API.csproj` | .NET target and NuGet references |
| `backend\ElectronicSignature.API\appsettings.json` | SQL connection, JWT settings, logging |
| `backend\ElectronicSignature.API\appsettings.Development.json` | Development overrides including Junior bounds |
| `backend\ElectronicSignature.API\Properties\launchSettings.json` | Local API URL and Development environment |

## Troubleshooting

- **Angular cannot reach API:** ensure API is running at the configured URL; check browser CORS errors and that CORS origins include the frontend's exact scheme/port.
- **Database unavailable:** verify LocalDB is installed/running and apply EF migrations with `dotnet ef database update`.
- **Junior submission returns 503:** provide valid `JuniorEligibility:MinAge` and `JuniorEligibility:MaxAge` for the API process.
- **Protected route redirects to login:** the browser guard needs `tas-jwt`; sign in again. An expired token is ultimately rejected by the API.
- **Consent request returns 400:** inspect the response message/errors, verify posted exhibitor type matches the token, and ensure all Junior backend-required fields and consents are set.
- **PDF generation fails:** generation requires Windows and Microsoft Word; check template files are copied into the API output directory and inspect backend logs.
- **PDF request works but status does not update:** the API generates first, then persists `Approved`; a persistence failure returns 500 and leaves the prior status.

