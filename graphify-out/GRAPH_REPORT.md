# Graph Report - ElectronicSignature  (2026-10-09)

## Corpus Check
- 139 files · ~335,137 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 827 nodes · 1187 edges · 69 communities (53 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 19
- CLAUDE.md
- ElectronicSignature.API.Models
- .Login
- exhibitor-register.spec.ts
- ExhibitorRegisterComponent
- ConsentFormsController
- Exhibitor
- OpenConsentFormComponent
- .RegisterAsync
- ConsentPdfService
- junior-consent-form.component.ts
- ElectronicSignature.API.Online.DTOs.Auth
- JuniorConsentFormComponent
- Exhibitor
- ConsentService
- app.routes.ts
- AuthService
- .Login
- 20260921063647_InitialCreate.Designer.cs
- 20260929062645_AddConsentForm.Designer.cs
- 20260930095748_AddJuniorConsentFields.Designer.cs
- .Login
- API Documentation
- Digital Signature Capture
- ElectronicSignature
- ElectronicSignature.API.Online.DTOs.Exhibitor
- ConsentPdfService
- Exhibitor
- Project Documentation
- Angular Frontend
- auth.service.ts
- ASP.NET Core Backend
- Developer Setup
- AuthService
- AuthService
- Architecture
- Authentication and Registration
- Consent Form System
- Database Documentation
- SignatureResult
- LoginPageComponent
- AddParticipantConsentSignature
- 20261001060654_AddExhibitorProfileFields.Designer.cs
- api-endpoints.ts

## God Nodes (most connected - your core abstractions)
1. `TemplateFiller` - 46 edges
2. `Texas Animal Showcase — Login Page Copilot Prompt` - 32 edges
3. `JuniorConsentFormComponent` - 24 edges
4. `DigitalSignatureComponent` - 21 edges
5. `ConsentFormsController` - 18 edges
6. `ExhibitorRegisterComponent` - 16 edges
7. `OpenConsentFormComponent` - 16 edges
8. `AuthService` - 15 edges
9. `ConsentService` - 13 edges
10. `ElectronicSignature.API.Migrations` - 12 edges

## Surprising Connections (you probably didn't know these)
- `ApplicationDbContext` --references--> `Exhibitor`  [EXTRACTED]
  backend/ElectronicSignature.API/Data/ApplicationDbContext.cs → backend/ElectronicSignature.API/Models/Exhibitor.cs
- `ExhibitorRepository` --implements--> `IExhibitorRepository`  [EXTRACTED]
  backend/ElectronicSignature.API/Data/Repositories/Implementations/ExhibitorRepository.cs → backend/ElectronicSignature.API/Data/Repositories/Interfaces/IExhibitorRepository.cs
- `AuthService` --references--> `IExhibitorRepository`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Services/Implementations/AuthService.cs → backend/ElectronicSignature.API/Data/Repositories/Interfaces/IExhibitorRepository.cs
- `TemplateFiller` --references--> `ConsentForm`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Services/Implementations/ConsentPdfService.cs → backend/ElectronicSignature.API/Models/ConsentForm.cs
- `AuthController` --references--> `IExhibitorService`  [EXTRACTED]
  backend/ElectronicSignature.API/Online/Controllers/AuthController.cs → backend/ElectronicSignature.API/Online/Services/Interfaces/IExhibitorService.cs

## Import Cycles
- None detected.

## Communities (69 total, 16 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (44): @angular/cdk, dependencies, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (39): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+31 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (39): build, serve, test, builder, configurations, defaultConfiguration, options, architect (+31 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (10): ExhibitorProfile, ProfileService, Injectable, UpdateExhibitorProfile, ConsentShellComponent, Component, Input, Output (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): DateTime, Dictionary, TemplateFiller, Body, Drawing, Func, GeneratedRegex, Height (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (42): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, rxjs (+34 more)

### Community 7 - "Community 7"
Cohesion: 0.40
Nodes (3): ModelBuilder, ApplicationDbContextModelSnapshot, ModelSnapshot

### Community 8 - "Community 8"
Cohesion: 0.23
Nodes (6): App, appConfig, routes, Component, DropListPractice, Component

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (36): 10. IMPORTANT — REMOVE THIS, 11. Angular Login Component, 12. Angular Reactive Form, 13. Angular Auth Service, 14. Login API, 15. User Entity, 16. Password Security, 17. JWT Configuration (+28 more)

### Community 10 - "Community 10"
Cohesion: 0.36
Nodes (4): App, appConfig, routes, Component

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (3): ANIMAL_TYPES, SAFETY_GUIDELINES, STEPS

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, CdkDragDropPractice, Code scaffolding, Development server, Running end-to-end tests, Running unit tests

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, ElectronicSignatureUi, Running end-to-end tests, Running unit tests

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (10): net10.0, DocumentFormat.OpenXml (3.5.1), Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0), Microsoft.AspNetCore.OpenApi (10.0.9), Microsoft.Data.SqlClient (6.1.1), Microsoft.EntityFrameworkCore.Design (10.0.12), Microsoft.EntityFrameworkCore.SqlServer (10.0.0), Swashbuckle.AspNetCore (10.2.3) (+2 more)

### Community 21 - "ElectronicSignature.API.Models"
Cohesion: 0.22
Nodes (7): AppUser, IConsentPdfService, ElectronicSignature.API.Online.Services.Interfaces, ElectronicSignature.API.Models, ElectronicSignature.API.Online.Services.Implementations, ElectronicSignature.API.Data.Repositories.Interfaces, ElectronicSignature.API.Data.Repositories.Implementations

### Community 22 - ".Login"
Cohesion: 0.16
Nodes (12): ActionResult, HttpGet, Task, ExhibitorsController, DateTime, ExhibitorProfileResponse, Task, ExhibitorProfileUpdateResult (+4 more)

### Community 24 - "ExhibitorRegisterComponent"
Cohesion: 0.11
Nodes (7): DigitalSignatureComponent, IMPORTANT:, SignatureMethod, Component, Input, Output, ViewChild

### Community 25 - "ConsentFormsController"
Cohesion: 0.11
Nodes (20): ApplicationDbContext, DateTime, ConsentForm, CancellationToken, DateTime, Dictionary, HttpGet, HttpPost (+12 more)

### Community 26 - "Exhibitor"
Cohesion: 0.24
Nodes (5): ConsentForm, fillRequiredFields(), form(), MySubmissionsComponent, Component

### Community 28 - ".RegisterAsync"
Cohesion: 0.27
Nodes (6): Task, IExhibitorRepository, PasswordHasher, Task, ExhibitorService, HashSet

### Community 29 - "ConsentPdfService"
Cohesion: 0.50
Nodes (3): MigrationBuilder, InitialCreate, Migration

### Community 30 - "junior-consent-form.component.ts"
Cohesion: 0.24
Nodes (9): JuniorEligibilityRule, ANIMAL_TYPES, calculateAge(), daysInMonth(), isLeapYear(), parseDateOnly(), SAFETY_GUIDELINES, shiftDateByYears() (+1 more)

### Community 39 - "app.routes.ts"
Cohesion: 0.23
Nodes (5): authGuard(), RegistrationSuccessComponent, Component, DashboardComponent, Component

### Community 42 - "20260921063647_InitialCreate.Designer.cs"
Cohesion: 0.29
Nodes (4): ModelBuilder, InitialCreate, ElectronicSignature.API.Data, ElectronicSignature.API.Controllers

### Community 44 - "20260930095748_AddJuniorConsentFields.Designer.cs"
Cohesion: 0.33
Nodes (3): ModelBuilder, AddJuniorConsentFields, ElectronicSignature.API.Migrations

### Community 45 - ".Login"
Cohesion: 0.17
Nodes (11): AllowAnonymous, HttpPost, IActionResult, Task, AuthController, LoginRequest, DateTime, LoginResponse (+3 more)

### Community 46 - "API Documentation"
Cohesion: 0.12
Nodes (17): API Documentation, Authentication endpoints, Base URLs, Consent endpoints, Endpoints, Error handling, Exhibitor profile, `GET /api/ConsentForms/junior-eligibility` (+9 more)

### Community 47 - "Digital Signature Capture"
Cohesion: 0.13
Nodes (15): 10. Security and legal/cryptographic limits, 1. Purpose and terminology, 2. Source files and component contract, 3. Showing exactly one capture panel, 4. Draw capture: canvas lifecycle and rendering, 5. Typed signature, 6. Uploaded signature, 7. Parent-child event flow and persistence (+7 more)

### Community 48 - "ElectronicSignature"
Cohesion: 0.17
Nodes (12): Architecture, Authentication and consent workflow, Current limits worth knowing, Database and API, Digital signature overview, Documentation, ElectronicSignature, Frontend (+4 more)

### Community 49 - "ElectronicSignature.API.Online.DTOs.Exhibitor"
Cohesion: 0.20
Nodes (6): RegisterExhibitorRequest, RegisterExhibitorResponse, DateTime, UpdateExhibitorProfileRequest, ElectronicSignature.API.Online.DTOs.Exhibitor, ElectronicSignature.API.Online.Controllers

### Community 50 - "ConsentPdfService"
Cohesion: 0.24
Nodes (9): CancellationToken, ILogger, Task, ConsentPdfService, int, SemaphoreSlim, string, SupportedOSPlatform (+1 more)

### Community 51 - "Exhibitor"
Cohesion: 0.31
Nodes (5): ApplicationDbContext, Task, ExhibitorRepository, DateTime, Exhibitor

### Community 52 - "Project Documentation"
Cohesion: 0.20
Nodes (10): Implementation cautions, Key features, Plain-language system description, Primary user journey, Project Documentation, Project structure, Purpose and status, Technical overview (+2 more)

### Community 54 - "Angular Frontend"
Cohesion: 0.22
Nodes (8): Angular Frontend, Assets, styling, and tests, Component reference, Configuration and bootstrap, Forms and state, Frontend validation and error display, Routes, Services and storage

### Community 55 - "auth.service.ts"
Cohesion: 0.39
Nodes (4): LoginRequest, LoginResponse, RegisterExhibitorRequest, RegisterExhibitorResponse

### Community 56 - "ASP.NET Core Backend"
Cohesion: 0.25
Nodes (8): ASP.NET Core Backend, Composition root and middleware, Consent persistence and validation, Controllers and service layers, Database and migrations, Passwords and JWT, PDF generation, Project and dependencies

### Community 57 - "Developer Setup"
Cohesion: 0.25
Nodes (7): Common commands, Developer Setup, Prerequisites, Start the Angular application, Start the backend, Troubleshooting, Useful configuration files

### Community 58 - "AuthService"
Cohesion: 0.32
Nodes (3): AuthUser, AuthService, Injectable

### Community 59 - "AuthService"
Cohesion: 0.38
Nodes (4): IConfiguration, PasswordHasher, Task, AuthService

### Community 60 - "Architecture"
Cohesion: 0.29
Nodes (7): API layers, Architecture, Configuration and operational boundaries, Frontend structure, Persistence, Request and identity flow, System context

### Community 61 - "Authentication and Registration"
Cohesion: 0.29
Nodes (7): Authentication and Registration, Browser storage and services, Errors and security notes, JWT issuance and validation, Login sequence, Registration, Routes and account-type behavior

### Community 62 - "Consent Form System"
Cohesion: 0.29
Nodes (7): Consent Form System, Junior and Open differentiation, Junior consent steps, Open consent steps, Shared and page-specific components, Signature events and payload, Submission and persistence

### Community 63 - "Database Documentation"
Cohesion: 0.29
Nodes (7): `ConsentForms`, Database Documentation, Engine and configuration, `Exhibitors`, Other model and migrations, Persistence flow, Tables and relationships

## Knowledge Gaps
- **261 isolated node(s):** `net10.0`, `DocumentFormat.OpenXml (3.5.1)`, `Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0)`, `Microsoft.AspNetCore.OpenApi (10.0.9)`, `Microsoft.Data.SqlClient (6.1.1)` (+256 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TemplateFiller` connect `Community 4` to `ConsentFormsController`, `ConsentPdfService`, `ElectronicSignature.API.Models`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `ElectronicSignature.API.Data` connect `20260921063647_InitialCreate.Designer.cs` to `AddParticipantConsentSignature`, `20261001060654_AddExhibitorProfileFields.Designer.cs`, `Community 7`, `20260929062645_AddConsentForm.Designer.cs`, `20260930095748_AddJuniorConsentFields.Designer.cs`, `Community 19`, `ElectronicSignature.API.Models`, `ConsentFormsController`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `ElectronicSignature.API.Online.Services.Interfaces` connect `ElectronicSignature.API.Models` to `ElectronicSignature.API.Online.DTOs.Exhibitor`, `20260921063647_InitialCreate.Designer.cs`, `.Login`, `.Login`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `net10.0`, `DocumentFormat.OpenXml (3.5.1)`, `Microsoft.AspNetCore.Authentication.JwtBearer (10.0.0)` to the rest of the system?**
  _261 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._